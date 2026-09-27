export type Role = "technician" | "support" | "escalation";
export type Priority = "normal" | "high" | "critical";
export type TicketStatus = "open" | "assigned" | "resolved" | "closed";

export type TimelineEntry = {
  id: string;
  at: string;
  actor: string;
  text: string;
  kind: "status" | "transfer" | "note";
};

export type Customer = {
  name: string;
  customerId: string;
  package: string;
  phone: string;
  ip: string;
  mac: string;
  pop: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  customer: Customer;
  timeline: TimelineEntry[];
  notes: { id: string; author: string; at: string; text: string }[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  area: string;
  segment: "Home" | "SME" | "Corporate";
  package: string;
  receivedAt: string;
  assignedPop: string | null;
};

export const POPS = [
  "PoP - Mirpur 10",
  "PoP - Dhanmondi",
  "PoP - Uttara Sector 7",
  "PoP - Banani",
  "NOC - Core",
];

const customer = (
  name: string,
  customerId: string,
  pkg: string,
  phone: string,
  ip: string,
  mac: string,
  pop: string,
): Customer => ({ name, customerId, package: pkg, phone, ip, mac, pop });

export const TICKETS: Ticket[] = [
  {
    id: "TKT-10241",
    subject: "No internet since morning — red LOS light",
    category: "Fiber Cut",
    priority: "critical",
    status: "open",
    assignee: "Unassigned",
    createdAt: "2026-09-27 08:12",
    customer: customer(
      "Rahim Uddin",
      "ALP-88421",
      "30 Mbps Home",
      "+8801711223344",
      "10.24.8.91",
      "A4:2B:B0:11:9C:04",
      "PoP - Mirpur 10",
    ),
    timeline: [
      { id: "t1", at: "08:12", actor: "System", text: "Ticket created from hotline call", kind: "status" },
      { id: "t2", at: "08:20", actor: "Support - Nabila", text: "Priority raised to Critical", kind: "status" },
    ],
    notes: [
      { id: "n1", author: "Support - Nabila", at: "08:22", text: "Customer reports whole building affected." },
    ],
  },
  {
    id: "TKT-10238",
    subject: "Slow speed on evening peak hours",
    category: "Speed Issue",
    priority: "high",
    status: "assigned",
    assignee: "Tech - Sohel",
    createdAt: "2026-09-26 19:45",
    customer: customer(
      "Farhana Akter",
      "ALP-77310",
      "50 Mbps Home Plus",
      "+8801811556677",
      "10.31.4.12",
      "B8:27:EB:3A:11:7D",
      "PoP - Dhanmondi",
    ),
    timeline: [
      { id: "t1", at: "19:45", actor: "System", text: "Ticket created", kind: "status" },
      { id: "t2", at: "20:10", actor: "Escalation - Imran", text: "Transferred to PoP - Dhanmondi", kind: "transfer" },
    ],
    notes: [],
  },
  {
    id: "TKT-10232",
    subject: "Router replaced, needs verification",
    category: "Hardware",
    priority: "normal",
    status: "resolved",
    assignee: "Tech - Jamil",
    createdAt: "2026-09-26 11:02",
    customer: customer(
      "Tanvir Hasan",
      "ALP-65120",
      "20 Mbps Home",
      "+8801911889900",
      "10.18.2.55",
      "C0:3F:D5:88:41:2E",
      "PoP - Uttara Sector 7",
    ),
    timeline: [
      { id: "t1", at: "11:02", actor: "System", text: "Ticket created", kind: "status" },
      { id: "t2", at: "14:30", actor: "Tech - Jamil", text: "Marked as Resolved — ONU replaced", kind: "status" },
    ],
    notes: [{ id: "n1", author: "Tech - Jamil", at: "14:31", text: "Old ONU faulty, swapped with spare unit." }],
  },
  {
    id: "TKT-10229",
    subject: "Billing mismatch on September invoice",
    category: "Billing",
    priority: "normal",
    status: "closed",
    assignee: "Support - Nabila",
    createdAt: "2026-09-25 09:30",
    customer: customer(
      "Sabbir Ahmed",
      "ALP-51002",
      "100 Mbps SME",
      "+8801611334455",
      "10.44.9.20",
      "D8:9E:F3:22:55:10",
      "PoP - Banani",
    ),
    timeline: [
      { id: "t1", at: "09:30", actor: "System", text: "Ticket created", kind: "status" },
      { id: "t2", at: "10:40", actor: "Support - Nabila", text: "Verified & Closed", kind: "status" },
    ],
    notes: [],
  },
  {
    id: "TKT-10226",
    subject: "Frequent disconnection every 10 minutes",
    category: "Link Flap",
    priority: "high",
    status: "resolved",
    assignee: "Tech - Sohel",
    createdAt: "2026-09-25 16:20",
    customer: customer(
      "Nusrat Jahan",
      "ALP-49875",
      "40 Mbps Home Plus",
      "+8801511667788",
      "10.22.7.34",
      "E4:5F:01:99:2B:6A",
      "PoP - Mirpur 10",
    ),
    timeline: [
      { id: "t1", at: "16:20", actor: "System", text: "Ticket created", kind: "status" },
      { id: "t2", at: "18:05", actor: "Tech - Sohel", text: "Marked as Resolved — patch cord replaced", kind: "status" },
    ],
    notes: [],
  },
  {
    id: "TKT-10219",
    subject: "Corporate link down — SLA breach risk",
    category: "Fiber Cut",
    priority: "critical",
    status: "assigned",
    assignee: "Escalation - Imran",
    createdAt: "2026-09-24 07:05",
    customer: customer(
      "Delta Textiles Ltd.",
      "ALP-30011",
      "200 Mbps Corporate",
      "+8801711000111",
      "103.12.44.8",
      "F0:9F:C2:10:88:31",
      "NOC - Core",
    ),
    timeline: [
      { id: "t1", at: "07:05", actor: "System", text: "Ticket created", kind: "status" },
      { id: "t2", at: "07:20", actor: "Support - Nabila", text: "Transferred to NOC - Core", kind: "transfer" },
    ],
    notes: [{ id: "n1", author: "Escalation - Imran", at: "07:40", text: "Backhaul cut near Tejgaon, team dispatched." }],
  },
];

export const LEADS: Lead[] = [
  {
    id: "LD-5011",
    name: "Zaman Enterprise",
    phone: "+8801711900011",
    area: "Banani",
    segment: "Corporate",
    package: "200 Mbps Dedicated",
    receivedAt: "2026-09-27 09:14",
    assignedPop: null,
  },
  {
    id: "LD-5010",
    name: "Rafiq Traders",
    phone: "+8801811900022",
    area: "Mirpur 10",
    segment: "SME",
    package: "100 Mbps Business",
    receivedAt: "2026-09-27 08:02",
    assignedPop: null,
  },
  {
    id: "LD-5009",
    name: "Shirin Sultana",
    phone: "+8801911900033",
    area: "Dhanmondi",
    segment: "Home",
    package: "30 Mbps Home",
    receivedAt: "2026-09-26 21:47",
    assignedPop: "PoP - Dhanmondi",
  },
  {
    id: "LD-5008",
    name: "Mehedi Hasan",
    phone: "+8801611900044",
    area: "Uttara Sector 7",
    segment: "Home",
    package: "20 Mbps Home",
    receivedAt: "2026-09-26 18:31",
    assignedPop: null,
  },
];
