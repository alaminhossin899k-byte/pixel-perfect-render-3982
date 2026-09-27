import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  MapPin,
  PhoneCall,
  RotateCcw,
  Send,
  Share2,
  User,
} from "lucide-react";
import {
  Button,
  Card,
  Input,
  Modal,
  PriorityBadge,
  Select,
  StatusBadge,
} from "@/components/ui-kit";
import { POPS } from "@/lib/mock-data";
import { roleLabel, useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/tickets/$id")({
  head: () => ({
    meta: [
      { title: "Ticket Detail — Alpha Network" },
      {
        name: "description",
        content: "Customer profile, timeline logs and role-based actions for a support ticket.",
      },
      { property: "og:title", content: "Ticket Detail — Alpha Network" },
      {
        property: "og:description",
        content: "Customer profile, timeline logs and role-based actions for a support ticket.",
      },
    ],
  }),
  component: TicketDetail,
});

function TicketDetail() {
  const { id } = Route.useParams();
  const ticket = useAppStore((s) => s.tickets.find((t) => t.id === id));
  const role = useAppStore((s) => s.role);
  const setStatus = useAppStore((s) => s.setStatus);
  const transfer = useAppStore((s) => s.transfer);
  const addNote = useAppStore((s) => s.addNote);

  const [note, setNote] = useState("");
  const [target, setTarget] = useState<string>(POPS[0]!);
  const [closeOpen, setCloseOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("5");

  if (!ticket) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">Ticket {id} was not found.</p>
        <Link to="/tickets" className="mt-3 inline-block text-sm text-primary">
          Back to tickets
        </Link>
      </Card>
    );
  }

  const actor = roleLabel[role];
  const c = ticket.customer;

  return (
    <div>
      <Link
        to="/tickets"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to queue
      </Link>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr_280px]">
        <Card>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User size={15} className="text-primary" /> Customer profile
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <Field label="Name" value={c.name} />
            <Field label="Customer ID" value={c.customerId} />
            <Field label="Package" value={c.package} />
            <Field label="Phone" value={c.phone} />
            <Field label="IP address" value={c.ip} />
            <Field label="MAC address" value={c.mac} />
            <Field label="PoP area" value={c.pop} />
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            <PhoneCall size={13} /> Call customer
          </Button>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={12} /> Last site visit: 26 Sep 2026
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{ticket.subject}</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ticket.id} · {ticket.category} · Created {ticket.createdAt} · {ticket.assignee}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Cpu size={15} className="text-primary" /> Timeline
            </h2>
            <ol className="mt-4 space-y-4 border-l border-border pl-4">
              {ticket.timeline.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm text-foreground">{e.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.actor} · {e.at} · {e.kind}
                  </p>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-foreground">Internal notes</h2>
            <div className="mt-3 space-y-2">
              {ticket.notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-border/70 px-3 py-2">
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.author} · {n.at}
                  </p>
                </div>
              ))}
              {ticket.notes.length === 0 && (
                <p className="text-xs text-muted-foreground">No internal notes yet.</p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write an internal note…"
              />
              <Button
                onClick={() => {
                  if (!note.trim()) return;
                  addNote(ticket.id, actor, note.trim());
                  setNote("");
                }}
              >
                <Send size={13} /> Post
              </Button>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="text-sm font-semibold text-foreground">Actions</h2>
          <p className="mt-1 text-xs text-muted-foreground">Available to: {actor}</p>

          <div className="mt-4 space-y-2">
            {role === "technician" && (
              <Button
                variant="success"
                className="w-full"
                disabled={ticket.status === "resolved" || ticket.status === "closed"}
                onClick={() =>
                  setStatus(ticket.id, "resolved", actor, "Marked as Resolved — pending verification")
                }
              >
                <CheckCircle2 size={14} /> Mark as Resolved
              </Button>
            )}

            {role === "support" && (
              <>
                <Button
                  className="w-full"
                  disabled={ticket.status !== "resolved"}
                  onClick={() => setCloseOpen(true)}
                >
                  <CheckCircle2 size={14} /> Verify &amp; Close Ticket
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStatus(ticket.id, "open", actor, "Ticket re-opened by support")}
                >
                  <RotateCcw size={14} /> Re-Open
                </Button>
              </>
            )}

            {role === "escalation" && (
              <>
                <Select value={target} onChange={(e) => setTarget(e.target.value)}>
                  {POPS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
                <Button
                  className="w-full"
                  onClick={() => transfer(ticket.id, target, actor)}
                >
                  <Share2 size={14} /> Transfer ticket
                </Button>
              </>
            )}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Technicians can resolve but never close. Only support closes a ticket after customer
            verification.
          </p>
        </Card>
      </div>

      <Modal open={closeOpen} onClose={() => setCloseOpen(false)} title="Verify & close ticket">
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
            <Button variant="outline" onClick={() => setCloseOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStatus(
                  ticket.id,
                  "closed",
                  actor,
                  `Verified & closed — rating ${rating}/5${feedback ? ` · "${feedback}"` : ""}`,
                );
                setFeedback("");
                setCloseOpen(false);
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}
