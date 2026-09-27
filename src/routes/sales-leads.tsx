import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Flame, MapPin, Phone } from "lucide-react";
import { AccessDenied, Button, Card, Modal, PageHeader, Select } from "@/components/ui-kit";
import { POPS, type Lead } from "@/lib/mock-data";
import { can, useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sales-leads")({
  head: () => ({
    meta: [
      { title: "Sales & Leads — Alpha Network" },
      { name: "description", content: "Website connection requests with SME and Corporate priority and PoP assignment." },
      { property: "og:title", content: "Sales & Leads — Alpha Network" },
      { property: "og:description", content: "Website connection requests with SME and Corporate priority and PoP assignment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SalesLeads,
});

function SalesLeads() {
  const role = useAppStore((s) => s.role);
  const leads = useAppStore((s) => s.leads);
  const assignLead = useAppStore((s) => s.assignLead);
  const [active, setActive] = useState<Lead | null>(null);
  const [pop, setPop] = useState<string>(POPS[0]!);
  const [forward, setForward] = useState("PoP Engineer");

  if (!can(role, "viewLeads")) return <AccessDenied need="Sales lead visibility" />;
  const canAssign = can(role, "assignLeads");

  return (
    <div>
      <PageHeader title="Sales & Leads" subtitle="New connection requests submitted from the website." />
      <div className="grid gap-3 md:grid-cols-2">
        {leads.map((l) => {
          const hot = l.segment !== "Home";
          return (
            <Card key={l.id} className={cn(hot && "border-warning/50")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{l.id} · {l.receivedAt}</p>
                  <h3 className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                    {hot && <Building2 size={15} className="text-warning" />} {l.name}
                  </h3>
                </div>
                {hot ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning/50 bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-warning">
                    <Flame size={11} /> High priority · {l.segment}
                  </span>
                ) : (
                  <span className="rounded-full border border-info/40 bg-info/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-info">
                    Home
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone size={12} /> {l.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} /> {l.area}</span>
                <span className="col-span-2 text-foreground">{l.package}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {l.assignedPop ? `→ ${l.assignedPop}${l.forwardedTo ? ` · ${l.forwardedTo}` : ""}` : "Unassigned"}
                </span>
                <Button
                  size="sm"
                  disabled={!canAssign}
                  title={canAssign ? undefined : "Senior Support or Admin only"}
                  onClick={() => setActive(l)}
                >
                  Assign to PoP
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={`Assign ${active?.name ?? ""}`}>
        <label className="text-xs text-muted-foreground">Target PoP</label>
        <Select value={pop} onChange={(e) => setPop(e.target.value)} className="mt-1">
          {POPS.map((p) => <option key={p}>{p}</option>)}
        </Select>
        <label className="mt-3 block text-xs text-muted-foreground">Forward to</label>
        <Select value={forward} onChange={(e) => setForward(e.target.value)} className="mt-1">
          <option>PoP Engineer</option>
          <option>Sales Team</option>
        </Select>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setActive(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (active) assignLead(active.id, pop, forward);
              setActive(null);
            }}
          >
            Assign & forward
          </Button>
        </div>
      </Modal>
    </div>
  );
}
