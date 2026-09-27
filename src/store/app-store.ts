import { create } from "zustand";
import {
  EMPLOYEES,
  LEADS,
  POP_NODES,
  TICKETS,
  type Employee,
  type Lead,
  type Materials,
  type Persona,
  type PopNode,
  type Ticket,
  type TicketStatus,
} from "@/lib/mock-data";

export type Capability =
  | "adminPanel"
  | "popPanel"
  | "techWorkspace"
  | "viewLeads"
  | "assignLeads"
  | "verifyClose"
  | "viewVerification"
  | "escalate"
  | "reassign"
  | "submitWorklog"
  | "readOnly";

export const PERSONAS: Record<
  Persona,
  { label: string; employee: string; department: string; level: string; caps: Capability[] }
> = {
  admin: {
    label: "Admin",
    employee: "Arif Chowdhury",
    department: "Management",
    level: "Senior",
    caps: ["adminPanel", "popPanel", "techWorkspace", "viewLeads", "assignLeads", "verifyClose", "viewVerification", "escalate", "reassign"],
  },
  pop_engineer: {
    label: "PoP Engineer",
    employee: "Kamal Hossain",
    department: "PoP Engineering",
    level: "Senior",
    caps: ["popPanel", "techWorkspace", "viewLeads", "escalate", "reassign", "submitWorklog"],
  },
  senior_core: {
    label: "Senior Core",
    employee: "Mahbub Alam",
    department: "Core Network",
    level: "Senior",
    caps: ["escalate", "reassign"],
  },
  senior_support: {
    label: "Senior Support",
    employee: "Nabila Rahman",
    department: "Home Support",
    level: "Senior",
    caps: ["viewLeads", "assignLeads", "verifyClose", "viewVerification", "escalate", "reassign"],
  },
  junior_support: {
    label: "Junior Support",
    employee: "Sadia Khan",
    department: "Corporate & SME Support",
    level: "Junior",
    caps: ["viewLeads", "viewVerification", "escalate"],
  },
  field_tech: {
    label: "Field Tech",
    employee: "Sohel Rana",
    department: "Field Technician",
    level: "Junior",
    caps: ["techWorkspace", "submitWorklog"],
  },
  intern: {
    label: "Intern",
    employee: "Tania Islam",
    department: "Home Support",
    level: "Intern",
    caps: ["viewVerification", "viewLeads", "readOnly"],
  },
};

export const can = (p: Persona, c: Capability) => PERSONAS[p].caps.includes(c);

/** Back-compat label map */
export const roleLabel = Object.fromEntries(
  Object.entries(PERSONAS).map(([k, v]) => [k, v.label]),
) as Record<Persona, string>;

type AppState = {
  role: Persona;
  setRole: (role: Persona) => void;
  tickets: Ticket[];
  leads: Lead[];
  employees: Employee[];
  pops: PopNode[];
  setStatus: (id: string, status: TicketStatus, actor: string, text: string) => void;
  transfer: (id: string, target: string, actor: string) => void;
  addNote: (id: string, author: string, text: string, draft?: boolean) => void;
  approveDraft: (id: string, noteId: string, approver: string) => void;
  assignLead: (id: string, pop: string, forwardTo?: string) => void;
  submitWorklog: (id: string, actor: string, summary: string, m: Materials) => void;
  dispatch: (id: string, tech: string, actor: string) => void;
  addEmployee: (e: Employee) => void;
  togglePermission: (id: string, key: keyof Employee["permissions"]) => void;
  savePop: (p: PopNode) => void;
};

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 10);

const patch = (tickets: Ticket[], id: string, fn: (t: Ticket) => Ticket) =>
  tickets.map((t) => (t.id === id ? fn(t) : t));

export const useAppStore = create<AppState>((set) => ({
  role: "senior_support",
  setRole: (role) => set({ role }),
  tickets: TICKETS,
  leads: LEADS,
  employees: EMPLOYEES,
  pops: POP_NODES,
  setStatus: (id, status, actor, text) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => ({
        ...t,
        status,
        timeline: [...t.timeline, { id: uid(), at: now(), actor, text, kind: "status" }],
      })),
    })),
  transfer: (id, target, actor) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => ({
        ...t,
        status: t.status === "open" ? "assigned" : t.status,
        assignee: target,
        timeline: [...t.timeline, { id: uid(), at: now(), actor, text: `Escalated / transferred to ${target}`, kind: "transfer" }],
      })),
    })),
  addNote: (id, author, text, draft) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => ({
        ...t,
        notes: [...t.notes, { id: uid(), author, at: now(), text, draft }],
      })),
    })),
  approveDraft: (id, noteId, approver) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => ({
        ...t,
        notes: t.notes.map((n) => (n.id === noteId ? { ...n, draft: false } : n)),
        timeline: [...t.timeline, { id: uid(), at: now(), actor: approver, text: "Approved intern draft note", kind: "note" }],
      })),
    })),
  assignLead: (id, pop, forwardTo) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, assignedPop: pop, forwardedTo: forwardTo } : l)) })),
  submitWorklog: (id, actor, summary, m) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => {
        const mat = m.none
          ? "No materials used (configuration / splicing only)"
          : [
              m.dropCableMeters ? `${m.dropCableMeters}m drop cable` : "",
              m.connectors ? `${m.connectors} connectors/patch cords` : "",
              m.onuSerial ? `ONU/Router SN ${m.onuSerial}` : "",
            ]
              .filter(Boolean)
              .join(", ") || "No materials recorded";
        return {
          ...t,
          status: "resolved",
          materials: m,
          timeline: [
            ...t.timeline,
            { id: uid(), at: now(), actor, text: `Worklog: ${summary} · Materials: ${mat} → Resolved (Pending Support Verification)`, kind: "worklog" },
          ],
        };
      }),
    })),
  dispatch: (id, tech, actor) =>
    set((s) => ({
      tickets: patch(s.tickets, id, (t) => ({
        ...t,
        status: "assigned",
        assignee: tech,
        timeline: [...t.timeline, { id: uid(), at: now(), actor, text: `Field technician ${tech} dispatched`, kind: "transfer" }],
      })),
      employees: s.employees.map((e) => (e.name === tech ? { ...e, activeTickets: e.activeTickets + 1 } : e)),
    })),
  addEmployee: (e) => set((s) => ({ employees: [...s.employees, e] })),
  togglePermission: (id, key) =>
    set((s) => ({
      employees: s.employees.map((e) =>
        e.id === id ? { ...e, permissions: { ...e.permissions, [key]: !e.permissions[key] } } : e,
      ),
    })),
  savePop: (p) =>
    set((s) => ({
      pops: s.pops.some((x) => x.id === p.id) ? s.pops.map((x) => (x.id === p.id ? p : x)) : [...s.pops, p],
    })),
}));
