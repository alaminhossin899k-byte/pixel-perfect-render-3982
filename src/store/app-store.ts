import { create } from "zustand";
import { LEADS, TICKETS, type Lead, type Role, type Ticket, type TicketStatus } from "@/lib/mock-data";

type AppState = {
  role: Role;
  setRole: (role: Role) => void;
  tickets: Ticket[];
  leads: Lead[];
  setStatus: (id: string, status: TicketStatus, actor: string, text: string) => void;
  transfer: (id: string, target: string, actor: string) => void;
  addNote: (id: string, author: string, text: string) => void;
  assignLead: (id: string, pop: string) => void;
};

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const roleLabel: Record<Role, string> = {
  technician: "Technician",
  support: "Support Agent",
  escalation: "Escalation / NOC",
};

export const useAppStore = create<AppState>((set) => ({
  role: "support",
  setRole: (role) => set({ role }),
  tickets: TICKETS,
  leads: LEADS,
  setStatus: (id, status, actor, text) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              timeline: [
                ...t.timeline,
                { id: crypto.randomUUID(), at: now(), actor, text, kind: "status" as const },
              ],
            }
          : t,
      ),
    })),
  transfer: (id, target, actor) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              assignee: actor,
              timeline: [
                ...t.timeline,
                {
                  id: crypto.randomUUID(),
                  at: now(),
                  actor,
                  text: `Transferred to ${target}`,
                  kind: "transfer" as const,
                },
              ],
            }
          : t,
      ),
    })),
  addNote: (id, author, text) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id
          ? { ...t, notes: [...t.notes, { id: crypto.randomUUID(), author, at: now(), text }] }
          : t,
      ),
    })),
  assignLead: (id, pop) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, assignedPop: pop } : l)) })),
}));
