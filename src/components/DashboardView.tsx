import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, TicketCheck, UserPlus } from "lucide-react";
import { Card, PageHeader, PriorityBadge, StatusBadge } from "@/components/ui-kit";
import { useAppStore } from "@/store/app-store";

export function DashboardView() {
  const tickets = useAppStore((s) => s.tickets);
  const leads = useAppStore((s) => s.leads);

  const stats = [
    {
      label: "Open tickets",
      value: tickets.filter((t) => t.status === "open").length,
      icon: AlertTriangle,
      tone: "text-destructive",
    },
    {
      label: "In progress",
      value: tickets.filter((t) => t.status === "assigned").length,
      icon: Clock,
      tone: "text-primary",
    },
    {
      label: "Pending verification",
      value: tickets.filter((t) => t.status === "resolved").length,
      icon: TicketCheck,
      tone: "text-warning",
    },
    {
      label: "New leads",
      value: leads.filter((l) => !l.assignedPop).length,
      icon: UserPlus,
      tone: "text-success",
    },
  ];

  const recent = tickets.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Live view of tickets, field work and sales pipeline across all PoPs."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
            </div>
            <Icon className={tone} size={22} />
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">Recent tickets</h2>
          <div className="mt-4 space-y-3">
            {recent.map((t) => (
              <Link
                key={t.id}
                to="/tickets/$id"
                params={{ id: t.id }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.id} · {t.customer.name} · {t.customer.pop}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-foreground">Latest leads</h2>
          <div className="mt-4 space-y-3">
            {leads.slice(0, 4).map((l) => (
              <div key={l.id} className="rounded-lg border border-border/70 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{l.name}</p>
                  <span className="text-[11px] text-muted-foreground">{l.segment}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {l.area} · {l.package}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  {l.assignedPop ? (
                    <>
                      <CheckCircle2 size={12} className="text-success" /> {l.assignedPop}
                    </>
                  ) : (
                    <>
                      <Clock size={12} className="text-warning" /> Awaiting PoP assignment
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
