import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button, Card, PageHeader, PriorityBadge } from "@/components/ui-kit";
import { triageTicket, type TriageResult } from "@/lib/triage.functions";

export const Route = createFileRoute("/triage")({
  head: () => ({
    meta: [
      { title: "AI Triage — Alpha Network" },
      { name: "description", content: "Paste a ticket description to get AI-assessed urgency and a recommended next action." },
      { property: "og:title", content: "AI Triage — Alpha Network" },
      { property: "og:description", content: "AI-assessed ticket urgency and next-action recommendations for support agents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TriagePage,
});

function TriagePage() {
  const triage = useServerFn(triageTicket);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TriageResult | null>(null);

  const submit = async () => {
    if (description.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await triage({ data: { description } });
      if (r.ok) setResult(r.result);
      else setError(r.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Triage" subtitle="Describe a customer issue and get an urgency rating plus a recommended next step." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Ticket description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            maxLength={4000}
            placeholder="e.g. Customer in Gulshan reports no internet since 9am, ONU LOS light blinking red, neighbours also affected…"
            className="mt-2 w-full rounded-md border border-border bg-input/40 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={submit} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Analyzing…" : "Analyze ticket"}
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-foreground">Recommendation</h2>
          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          {!error && !result && !loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Results will appear here after analysis.</p>
          ) : null}
          {loading ? <p className="mt-4 text-sm text-muted-foreground">Assessing urgency…</p> : null}
          {result ? (
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Urgency</span>
                <PriorityBadge priority={result.urgency} />
              </div>
              <Field label="Summary" value={result.summary} />
              <Field label="Recommended next action" value={result.nextAction} highlight />
              <Field label="Route to" value={result.team} />
              <Field label="Why" value={result.reasoning} />
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <p className={highlight ? "mt-1 font-medium text-primary" : "mt-1 text-foreground"}>{value}</p>
    </div>
  );
}
