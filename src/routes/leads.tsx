import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneCall, Sparkles } from "lucide-react";
import { Button, Card, Modal, PageHeader, Select } from "@/components/ui-kit";
import { POPS } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Sales & Lead Queue — Alpha Network" },
      {
        name: "description",
        content: "New connection requests from the website, prioritised for SME and Corporate.",
      },
      { property: "og:title", content: "Sales & Lead Queue — Alpha Network" },
      {
        property: "og:description",
        content: "New connection requests from the website, prioritised for SME and Corporate.",
      },
    ],
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const leads = useAppStore((s) => s.leads);
  const assignLead = useAppStore((s) => s.assignLead);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pop, setPop] = useState<string>(POPS[0]!);

  return (
    <div>
      <PageHeader
        title="Sales & Lead Queue"
        subtitle="New connection requests submitted from the Alpha Network website."
      />

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Lead</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">PoP</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const hot = l.segment !== "Home";
              return (
                <tr
                  key={l.id}
                  className={cn(
                    "border-b border-border/60 last:border-0 hover:bg-accent/30",
                    hot && "bg-warning/5",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="flex items-center gap-2 font-medium text-foreground">
                      {l.name}
                      {hot && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
                          <Sparkles size={10} /> {l.segment}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{l.id}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.area}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.package}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.receivedAt}</td>
                  <td className="px-4 py-3">
                    {l.assignedPop ? (
                      <span className="text-xs text-success">{l.assignedPop}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <PhoneCall size={13} /> Call
                      </Button>
                      <Button size="sm" onClick={() => setActiveId(l.id)}>
                        Assign to PoP
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Card className="mt-4">
        <p className="text-xs text-muted-foreground">
          SME and Corporate requests are highlighted and should be contacted within 30 minutes.
        </p>
      </Card>

      <Modal open={activeId !== null} onClose={() => setActiveId(null)} title="Assign lead to PoP">
        <div className="space-y-3">
          <Select value={pop} onChange={(e) => setPop(e.target.value)}>
            {POPS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setActiveId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (activeId) assignLead(activeId, pop);
                setActiveId(null);
              }}
            >
              Assign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
