import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, PhoneCall, RotateCcw } from "lucide-react";
import { Button, Card, Input, Modal, PageHeader, PriorityBadge, Select } from "@/components/ui-kit";
import { roleLabel, useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification Queue — Alpha Network" },
      {
        name: "description",
        content: "Tickets resolved by technicians awaiting customer confirmation and closure.",
      },
      { property: "og:title", content: "Verification Queue — Alpha Network" },
      {
        property: "og:description",
        content: "Tickets resolved by technicians awaiting customer confirmation and closure.",
      },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  const allTickets = useAppStore((s) => s.tickets);
  const tickets = useMemo(
    () => allTickets.filter((t) => t.status === "resolved"),
    [allTickets],
  );
  const setStatus = useAppStore((s) => s.setStatus);
  const role = useAppStore((s) => s.role);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rating, setRating] = useState("5");
  const [feedback, setFeedback] = useState("");
  const actor = roleLabel[role];

  return (
    <div>
      <PageHeader
        title="Support Verification Queue"
        subtitle="Resolved by field teams — confirm with the customer before closing."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {tickets.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  to="/tickets/$id"
                  params={{ id: t.id }}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {t.subject}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.id} · {t.customer.name} · {t.customer.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.customer.pop} · resolved by {t.assignee}
                </p>
              </div>
              <PriorityBadge priority={t.priority} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                <PhoneCall size={13} /> Call customer
              </Button>
              <Button size="sm" onClick={() => setActiveId(t.id)}>
                <CheckCircle2 size={13} /> Verify &amp; Close
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatus(t.id, "open", actor, "Re-opened — issue not fixed")}
              >
                <RotateCcw size={13} /> Re-Open
              </Button>
            </div>
          </Card>
        ))}
        {tickets.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">Nothing pending verification right now.</p>
          </Card>
        )}
      </div>

      <Modal open={activeId !== null} onClose={() => setActiveId(null)} title="Verify & close ticket">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Customer satisfaction</label>
            <Select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1">
              <option value="5">5 — Very satisfied</option>
              <option value="4">4 — Satisfied</option>
              <option value="3">3 — Neutral</option>
              <option value="2">2 — Unhappy</option>
              <option value="1">1 — Very unhappy</option>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Customer feedback</label>
            <Input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did the customer say?"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setActiveId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (activeId)
                  setStatus(
                    activeId,
                    "closed",
                    actor,
                    `Verified & closed — rating ${rating}/5${feedback ? ` · "${feedback}"` : ""}`,
                  );
                setFeedback("");
                setActiveId(null);
              }}
            >
              Confirm close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
