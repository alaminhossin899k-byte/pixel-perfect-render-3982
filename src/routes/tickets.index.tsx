import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, PhoneCall, Search } from "lucide-react";
import { Button, Card, Input, PageHeader, PriorityBadge, Select, StatusBadge } from "@/components/ui-kit";
import { POPS, type Priority, type TicketStatus } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tickets/")({
  head: () => ({
    meta: [
      { title: "Ticket Queue — Alpha Network" },
      {
        name: "description",
        content: "Filter, search and action ISP support tickets by status, priority and PoP.",
      },
      { property: "og:title", content: "Ticket Queue — Alpha Network" },
      {
        property: "og:description",
        content: "Filter, search and action ISP support tickets by status, priority and PoP.",
      },
    ],
  }),
  component: TicketsPage,
});

const TABS: { key: TicketStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "assigned", label: "Assigned" },
  { key: "resolved", label: "Resolved (Pending Verification)" },
  { key: "closed", label: "Closed" },
];

function TicketsPage() {
  const tickets = useAppStore((s) => s.tickets);
  const [tab, setTab] = useState<TicketStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [pop, setPop] = useState("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const rows = useMemo(
    () =>
      tickets.filter((t) => {
        if (tab !== "all" && t.status !== tab) return false;
        if (pop !== "all" && t.customer.pop !== pop) return false;
        if (priority !== "all" && t.priority !== priority) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [t.id, t.subject, t.customer.name, t.customer.customerId, t.customer.phone]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }),
    [tickets, tab, pop, priority, query],
  );

  return (
    <div>
      <PageHeader
        title="Ticket Management"
        subtitle="All customer complaints across PoPs, NOC and core network."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t.key
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticket, customer ID or phone"
              className="pl-9"
            />
          </div>
          <Select value={pop} onChange={(e) => setPop(e.target.value)}>
            <option value="all">All PoPs</option>
            {POPS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority | "all")}>
            <option value="all">All priorities</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </div>
      </Card>

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">PoP</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · {t.category} · {t.createdAt}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{t.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{t.customer.customerId}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.customer.pop}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={t.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.assignee}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <PhoneCall size={13} /> Call
                    </Button>
                    <Link to="/tickets/$id" params={{ id: t.id }}>
                      <Button size="sm">
                        <Eye size={13} /> Open
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No tickets match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
