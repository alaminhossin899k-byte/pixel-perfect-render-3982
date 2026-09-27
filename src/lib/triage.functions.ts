import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type TriageResult = {
  urgency: "normal" | "high" | "critical";
  summary: string;
  reasoning: string;
  nextAction: string;
  team: string;
};

const SYSTEM = `You are a triage assistant for Alpha Network, an ISP support desk.
Classify the ticket urgency as exactly one of: "normal", "high", "critical".
- critical: full outage, many customers affected, PoP/fiber down, safety or security issue.
- high: single customer fully down, severe degradation, business customer impact.
- normal: slowness, billing, config questions, minor issues.
Recommend one concrete next action for the support agent, and the team to route to
(one of: "Technician", "Support", "Escalation (PoP/NOC)", "Sales").
Reply with ONLY a JSON object: {"urgency": string, "summary": string (max 20 words), "reasoning": string (max 40 words), "nextAction": string (max 40 words), "team": string}`;

export const triageTicket = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ description: z.string().trim().min(10).max(4000) }).parse(d))
  .handler(async ({ data }): Promise<{ ok: true; result: TriageResult } | { ok: false; error: string }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "AI is not configured for this app yet." };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: data.description,
        stream: true,
        store: false,
        reasoning: { effort: "low" },
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) return { ok: false, error: "Too many requests right now — please try again in a minute." };
      if (res.status === 402) return { ok: false, error: "AI credits are used up for this workspace. Add credits to continue." };
      const txt = await res.text().catch(() => "");
      console.error("triage gateway error", res.status, txt);
      return { ok: false, error: `AI request failed (${res.status}).` };
    }

    // Consume the SSE stream and accumulate output text.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
            if (ev.type === "response.refusal.delta") refused = true;
            if (ev.type === "error" || ev.type === "response.failed") {
              return { ok: false, error: ev.error?.message ?? ev.response?.error?.message ?? "AI request failed." };
            }
          } catch {
            /* ignore partial */
          }
        }
      }
    }
    if (refused) return { ok: false, error: "The AI declined to analyze this description." };

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false, error: "The AI returned an unexpected response." };
    try {
      const raw = JSON.parse(match[0]);
      const u = String(raw.urgency ?? "").toLowerCase();
      return {
        ok: true,
        result: {
          urgency: u === "critical" || u === "high" ? u : "normal",
          summary: String(raw.summary ?? ""),
          reasoning: String(raw.reasoning ?? ""),
          nextAction: String(raw.nextAction ?? ""),
          team: String(raw.team ?? ""),
        },
      };
    } catch {
      return { ok: false, error: "The AI returned an unexpected response." };
    }
  });
