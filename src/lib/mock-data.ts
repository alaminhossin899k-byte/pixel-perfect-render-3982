export type Persona =
  | "admin"
  | "pop_engineer"
  | "senior_core"
  | "senior_support"
  | "junior_support"
  | "field_tech"
  | "intern";
/** @deprecated use Persona */
export type Role = Persona;

export type Department =
  | "Core Network"
  | "NOC"
  | "Home Support"
  | "Corporate & SME Support"
  | "LAN & Transmission"
  | "PoP Engineering"
  | "Field Technician"
  | "Management";
export type Level = "Senior" | "Junior" | "Intern";

export const DEPARTMENTS: Department[] = [
  "Core Network",
  "NOC",
  "Home Support",
  "Corporate & SME Support",
  "LAN & Transmission",
  "PoP Engineering",
  "Field Technician",
];
export const LEVELS: Level[] = ["Senior", "Junior", "Intern"];

export type Priority = "normal" | "high" | "critical";
export type TicketStatus = "open" | "assigned" | "resolved" | "closed";

export type TimelineEntry = {
  id: string;
  at: string;
  actor: string;
  text: string;
  kind: "status" | "transfer" | "note" | "worklog";
};

export type Customer = {
  name: string;
  customerId: string;
  package: string;
  phone: string;
  address: string;
  ip: string;
  mac: string;
  pop: string;
};

export type Materials = {
  dropCableMeters: number;
  connectors: number;
  onuSerial: string;
  none: boolean;
};

export type Note = { id: string; author: string; at: string; text: string; draft?: boolean };

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  department: Department;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  customer: Customer;
  timeline: TimelineEntry[];
  notes: Note[];
  materials?: Materials;
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
  forwardedTo?: string;
};

export type Permissions = {
  editCustomer: boolean;
  reassignTickets: boolean;
  viewLeads: boolean;
  overrideSla: boolean;
};

export type Employee = {
  id: string;
  name: string;
  department: Department;
  level: Level;
  zone: string;
  online: boolean;
  activeTickets: number;
  resolvedToday: number;
  sla: number;
  permissions: Permissions;
};

export type PopNode = {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  utilization: number;
  engineer: string;
  status: "online" | "degraded" | "down";
  upstream: { name: string; up: boolean; load: number }[];
  olts: number;
  onts: number;
};

export const POPS = [
  "PoP - Mirpur 10",
  "PoP - Dhanmondi",
  "PoP - Uttara Sector 7",
  "PoP - Banani",
  "NOC - Core",
];

const P = (e: boolean, r: boolean, l: boolean, s: boolean): Permissions => ({
  editCustomer: e,
  reassignTickets: r,
  viewLeads: l,
  overrideSla: s,
});

export const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Arif Chowdhury", department: "Management", level: "Senior", zone: "HQ", online: true, activeTickets: 0, resolvedToday: 0, sla: 100, permissions: P(true, true, true, true) },
  { id: "EMP-011", name: "Kamal Hossain", department: "PoP Engineering", level: "Senior", zone: "PoP - Mirpur 10", online: true, activeTickets: 3, resolvedToday: 2, sla: 96, permissions: P(true, true, true, false) },
  { id: "EMP-012", name: "Rezaul Karim", department: "PoP Engineering", level: "Junior", zone: "PoP - Dhanmondi", online: false, activeTickets: 2, resolvedToday: 1, sla: 91, permissions: P(false, true, true, false) },
  { id: "EMP-021", name: "Sohel Rana", department: "Field Technician", level: "Junior", zone: "PoP - Mirpur 10", online: true, activeTickets: 2, resolvedToday: 3, sla: 94, permissions: P(false, false, false, false) },
  { id: "EMP-022", name: "Jamil Ahmed", department: "Field Technician", level: "Junior", zone: "PoP - Uttara Sector 7", online: true, activeTickets: 1, resolvedToday: 4, sla: 98, permissions: P(false, false, false, false) },
  { id: "EMP-023", name: "Rakib Hasan", department: "Field Technician", level: "Intern", zone: "PoP - Banani", online: false, activeTickets: 0, resolvedToday: 1, sla: 88, permissions: P(false, false, false, false) },
  { id: "EMP-031", name: "Nabila Rahman", department: "Home Support", level: "Senior", zone: "HQ", online: true, activeTickets: 5, resolvedToday: 9, sla: 97, permissions: P(true, true, true, true) },
  { id: "EMP-032", name: "Sadia Khan", department: "Corporate & SME Support", level: "Junior", zone: "HQ", online: true, activeTickets: 4, resolvedToday: 6, sla: 93, permissions: P(true, false, true, false) },
  { id: "EMP-033", name: "Tania Islam", department: "Home Support", level: "Intern", zone: "HQ", online: true, activeTickets: 0, resolvedToday: 0, sla: 100, permissions: P(false, false, false, false) },
  { id: "EMP-041", name: "Imran Hossain", department: "NOC", level: "Senior", zone: "NOC - Core", online: true, activeTickets: 2, resolvedToday: 3, sla: 99, permissions: P(true, true, false, true) },
  { id: "EMP-051", name: "Mahbub Alam", department: "Core Network", level: "Senior", zone: "NOC - Core", online: true, activeTickets: 1, resolvedToday: 2, sla: 100, permissions: P(true, true, false, true) },
];

export const POP_NODES: PopNode[] = [
  { id: "POP-01", name: "PoP - Mirpur 10", zone: "Dhaka North", capacity: 10, utilization: 78, engineer: "Kamal Hossain", status: "degraded", upstream: [{ name: "Core Uplink A (10G)", up: true, load: 81 }, { name: "Backup Uplink B (10G)", up: false, load: 0 }], olts: 4, onts: 2140 },
  { id: "POP-02", name: "PoP - Dhanmondi", zone: "Dhaka South", capacity: 10, utilization: 64, engineer: "Rezaul Karim", status: "online", upstream: [{ name: "Core Uplink A (10G)", up: true, load: 62 }, { name: "Backup Uplink B (10G)", up: true, load: 5 }], olts: 3, onts: 1680 },
  { id: "POP-03", name: "PoP - Uttara Sector 7", zone: "Dhaka North", capacity: 20, utilization: 41, engineer: "Kamal Hossain", status: "online", upstream: [{ name: "Core Uplink A (20G)", up: true, load: 40 }], olts: 5, onts: 2530 },
  { id: "POP-04", name: "PoP - Banani", zone: "Gulshan", capacity: 40, utilization: 55, engineer: "Rezaul Karim", status: "online", upstream: [{ name: "Corporate Ring (40G)", up: true, load: 55 }], olts: 6, onts: 980 },
];

const cust = (name: string, customerId: string, pkg: string, phone: string, address: string, ip: string, mac: string, pop: string): Customer => ({ name, customerId, package: pkg, phone, address, ip, mac, pop });
const tl = (at: string, actor: string, text: string, kind: TimelineEntry["kind"] = "status"): TimelineEntry => ({ id: `${at}-${text}`, at, actor, text, kind });

export const TICKETS: Ticket[] = [
  { id: "TKT-10241", subject: "No internet since morning — red LOS light", category: "Fiber Cut", department: "Home Support", priority: "critical", status: "open", assignee: "Unassigned", createdAt: "2026-09-27 08:12",
    customer: cust("Rahim Uddin", "ALP-88421", "30 Mbps Home", "+8801711223344", "House 12, Road 3, Mirpur 10", "10.24.8.91", "A4:2B:B0:11:9C:04", "PoP - Mirpur 10"),
    timeline: [tl("08:12", "System", "Ticket created from hotline call"), tl("08:20", "Nabila Rahman", "Priority raised to Critical")],
    notes: [{ id: "n1", author: "Nabila Rahman", at: "08:22", text: "Customer reports whole building affected." }] },
  { id: "TKT-10238", subject: "Slow speed on evening peak hours", category: "Speed Issue", department: "PoP Engineering", priority: "high", status: "assigned", assignee: "Rezaul Karim", createdAt: "2026-09-26 19:45",
    customer: cust("Farhana Akter", "ALP-77310", "50 Mbps Home Plus", "+8801811556677", "Flat 4B, Road 27, Dhanmondi", "10.31.4.12", "B8:27:EB:3A:11:7D", "PoP - Dhanmondi"),
    timeline: [tl("19:45", "System", "Ticket created"), tl("20:10", "Imran Hossain", "Escalated to PoP Engineering", "transfer")], notes: [] },
  { id: "TKT-10232", subject: "Router replaced, needs verification", category: "Hardware", department: "Field Technician", priority: "normal", status: "resolved", assignee: "Jamil Ahmed", createdAt: "2026-09-26 11:02",
    customer: cust("Tanvir Hasan", "ALP-65120", "20 Mbps Home", "+8801911889900", "House 7, Sector 7, Uttara", "10.18.2.55", "C0:3F:D5:88:41:2E", "PoP - Uttara Sector 7"),
    timeline: [tl("11:02", "System", "Ticket created"), tl("14:30", "Jamil Ahmed", "Worklog submitted — ONU replaced (SN: ZTEG-88A1C). Resolved (Pending Support Verification)", "worklog")],
    notes: [{ id: "n1", author: "Jamil Ahmed", at: "14:31", text: "Old ONU faulty, swapped with spare unit." }],
    materials: { dropCableMeters: 0, connectors: 1, onuSerial: "ZTEG-88A1C", none: false } },
  { id: "TKT-10229", subject: "Billing mismatch on September invoice", category: "Billing", department: "Home Support", priority: "normal", status: "closed", assignee: "Nabila Rahman", createdAt: "2026-09-25 09:30",
    customer: cust("Sabbir Ahmed", "ALP-51002", "100 Mbps SME", "+8801611334455", "Level 3, Kemal Ataturk Ave, Banani", "10.44.9.20", "D8:9E:F3:22:55:10", "PoP - Banani"),
    timeline: [tl("09:30", "System", "Ticket created"), tl("10:40", "Nabila Rahman", "Customer call verified & closed")], notes: [] },
  { id: "TKT-10226", subject: "Frequent disconnection every 10 minutes", category: "Link Flap", department: "Field Technician", priority: "high", status: "resolved", assignee: "Sohel Rana", createdAt: "2026-09-25 16:20",
    customer: cust("Nusrat Jahan", "ALP-49875", "40 Mbps Home Plus", "+8801511667788", "House 44, Block C, Mirpur 10", "10.22.7.34", "E4:5F:01:99:2B:6A", "PoP - Mirpur 10"),
    timeline: [tl("16:20", "System", "Ticket created"), tl("18:05", "Sohel Rana", "Worklog submitted — patch cord replaced, 2 connectors", "worklog")], notes: [],
    materials: { dropCableMeters: 0, connectors: 2, onuSerial: "", none: false } },
  { id: "TKT-10219", subject: "Corporate link down — SLA breach risk", category: "Fiber Cut", department: "Corporate & SME Support", priority: "critical", status: "assigned", assignee: "Imran Hossain", createdAt: "2026-09-24 07:05",
    customer: cust("Delta Textiles Ltd.", "ALP-30011", "200 Mbps Corporate", "+8801711000111", "Plot 18, Tejgaon I/A", "103.12.44.8", "F0:9F:C2:10:88:31", "NOC - Core"),
    timeline: [tl("07:05", "System", "Ticket created"), tl("07:20", "Sadia Khan", "Escalated to NOC", "transfer")],
    notes: [{ id: "n1", author: "Imran Hossain", at: "07:40", text: "Backhaul cut near Tejgaon, team dispatched." }] },
  { id: "TKT-10244", subject: "BGP session flapping with upstream IIG", category: "Core Routing", department: "Core Network", priority: "critical", status: "assigned", assignee: "Mahbub Alam", createdAt: "2026-09-27 06:40",
    customer: cust("Alpha Network Core", "INT-CORE", "Upstream Transit", "+8801700000000", "Core DC, Tejgaon", "103.12.40.1", "00:1C:73:AA:10:01", "NOC - Core"),
    timeline: [tl("06:40", "Imran Hossain", "Alarm raised from NOC monitoring"), tl("06:52", "Imran Hossain", "Escalated to Core", "transfer")], notes: [] },
  { id: "TKT-10245", subject: "OLT port 3/7 high optical loss", category: "Optical", department: "NOC", priority: "high", status: "open", assignee: "Unassigned", createdAt: "2026-09-27 09:05",
    customer: cust("Multiple (32 subscribers)", "OLT-MIR-03", "PON Segment", "—", "Mirpur 10 splitter cabinet", "—", "—", "PoP - Mirpur 10"),
    timeline: [tl("09:05", "System", "NOC auto-alarm: Rx power -29 dBm")], notes: [] },
  { id: "TKT-10246", subject: "New office LAN setup — 40 drops", category: "LAN Install", department: "LAN & Transmission", priority: "normal", status: "assigned", assignee: "Kamal Hossain", createdAt: "2026-09-26 13:15",
    customer: cust("Zaman Enterprise", "ALP-30442", "200 Mbps Dedicated", "+8801711900011", "Road 11, Banani", "103.12.46.20", "F0:9F:C2:22:11:09", "PoP - Banani"),
    timeline: [tl("13:15", "Sadia Khan", "Ticket created from corporate onboarding")], notes: [] },
  { id: "TKT-10247", subject: "New installation — fiber drop required", category: "Installation", department: "PoP Engineering", priority: "normal", status: "open", assignee: "Unassigned", createdAt: "2026-09-27 10:20",
    customer: cust("Mehedi Hasan", "ALP-90012", "20 Mbps Home", "+8801611900044", "House 9, Sector 7, Uttara", "—", "—", "PoP - Uttara Sector 7"),
    timeline: [tl("10:20", "System", "Created from sales lead LD-5008")], notes: [] },
  { id: "TKT-10248", subject: "Fiber fault — pole damaged after storm", category: "Fiber Cut", department: "PoP Engineering", priority: "high", status: "open", assignee: "Unassigned", createdAt: "2026-09-27 11:02",
    customer: cust("Area outage (Road 5)", "ZONE-DHN-05", "Distribution", "—", "Road 5, Dhanmondi", "—", "—", "PoP - Dhanmondi"),
    timeline: [tl("11:02", "Rezaul Karim", "Fault logged after site survey")], notes: [] },
];

export const LEADS: Lead[] = [
  { id: "LD-5011", name: "Zaman Enterprise", phone: "+8801711900011", area: "Banani", segment: "Corporate", package: "200 Mbps Dedicated", receivedAt: "2026-09-27 09:14", assignedPop: null },
  { id: "LD-5010", name: "Rafiq Traders", phone: "+8801811900022", area: "Mirpur 10", segment: "SME", package: "100 Mbps Business", receivedAt: "2026-09-27 08:02", assignedPop: null },
  { id: "LD-5009", name: "Shirin Sultana", phone: "+8801911900033", area: "Dhanmondi", segment: "Home", package: "30 Mbps Home", receivedAt: "2026-09-26 21:47", assignedPop: "PoP - Dhanmondi", forwardedTo: "PoP Engineer" },
  { id: "LD-5008", name: "Mehedi Hasan", phone: "+8801611900044", area: "Uttara Sector 7", segment: "Home", package: "20 Mbps Home", receivedAt: "2026-09-26 18:31", assignedPop: null },
];
