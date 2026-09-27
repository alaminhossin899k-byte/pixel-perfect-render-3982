import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, PhoneCall, RotateCcw } from "lucide-react";
import { AccessDenied, Button, Card, PageHeader, PriorityBadge } from "@/components/ui-kit";
import { PERSONAS, can, useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/verification-queue")({
  head: () => ({
    meta: [
      { title: "Verification Queue — Alpha Network" },
      { name: "description", content: "Resolved tickets awaiting customer call verification before permanent closure." },
      { property: "og:title", content: "Verification Queue — Alpha Network" },
      { property: "og:description", content: "Resolved tickets awaiting customer call verification before permanent closure." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerificationQueue,
});

function VerificationQueue() {
  const role = useAppStore((s) => s.role);
  const tickets = useAppStore((s) => s.tickets);
  const setStatus = useAppStore((s) => s.setStatus);
  const queue = useMemo(() => tickets.filter((t) => t.status === "resolved"), [tickets]);
  const [called, setCalled] = useState<Record<string, boolean>>({});

  if (!can(role, "viewVerification")) return <AccessDenied need="Support verification access" />;
  const canClose = can(role, "verifyClose");
  const actor = PERSONAS[role].employee;

  return (
    <div>
      <PageHeader
        title="Support Verification Queue"
        subtitle="Tickets marked Resolved (Pending Verification) by field or PoP teams."
      />
      {queue.length === 0 && <Card><p className="text-sm text-muted-foreground">Queue is clear.</p></Card>}
      <div className="grid gap-3 lg:grid-cols-2">
        {queue.map((t) => {
          const step = called[t.id];
          return (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link to="/tickets/$id" params={{ id: t.id }} className="text-xs text-primary">{t.id}</Link>
                  <h3 className="mt-1 font-semibold text-foreground">{t.subject}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.customer.name} · {t.customer.phone} · by {t.assignee}
                  </p>
                </div>
                <PriorityBadge priority={t.priority} />
              </div>
              <ol className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <li className={step ? "text-success" : "text-primary"}>1. Call customer</li>
                <li>→</li>
                <li className={step ? "text-primary" : ""}>2. Confirm service</li>
                <li>→</li>
                <li>3. Close / Re-open</li>
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canClose}
                  onClick={() => setCalled((c) => ({ ...c, [t.id]: true }))}
                >
                  <PhoneCall size={13} /> {step ? "Call logged" : "Call customer"}
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  disabled={!canClose || !step}
                  onClick={() => setStatus(t.id, "closed", actor, "Customer call verified — permanently closed")}
                >
                  <CheckCircle2 size={13} /> Permanently close
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={!canClose}
                  onClick={() => setStatus(t.id, "open", actor, "Re-opened after verification call")}
                >
                  <RotateCcw size={13} /> Re-open
                </Button>
              </div>
              {!canClose && (
                <p className="mt-2 text-[11px] text-muted-foreground">Only Senior Support or Admin can close tickets.</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
