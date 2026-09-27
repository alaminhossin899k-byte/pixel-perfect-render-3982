import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Signal,
  Ticket,
  UserPlus,
  ShieldCheck,
  Router,
  Wrench,
  FlaskConical,
} from "lucide-react";
import type { ReactNode } from "react";
import { PERSONAS, can, type Capability, useAppStore } from "@/store/app-store";
import type { Persona } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; icon: typeof Ticket; cap?: Capability }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/verification-queue", label: "Verification Queue", icon: LifeBuoy, cap: "viewVerification" },
  { to: "/sales-leads", label: "Sales & Leads", icon: UserPlus, cap: "viewLeads" },
  { to: "/pop-management", label: "PoP Management", icon: Router, cap: "popPanel" },
  { to: "/technician-workspace", label: "Technician Workspace", icon: Wrench, cap: "techWorkspace" },
  { to: "/triage", label: "AI Triage", icon: Sparkles },
  { to: "/admin", label: "Admin & HR", icon: ShieldCheck, cap: "adminPanel" },
];

const initials = (n: string) =>
  n
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

export function AppShell({ children }: { children: ReactNode }) {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const persona = PERSONAS[role];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Signal size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-sidebar-foreground">Alpha Network</p>
            <p className="text-[11px] text-muted-foreground">ISP Operations</p>
          </div>
        </div>

        <div className="mx-4 mb-5 rounded-xl border border-sidebar-border bg-card/60 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {initials(persona.employee)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{persona.employee}</p>
              <p className="truncate text-[11px] text-muted-foreground">{persona.department}</p>
              <span className="mt-1 inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {persona.label} · {persona.level}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 pb-24">
          {NAV.filter((n) => !n.cap || can(role, n.cap)).map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <div className="relative max-w-xl flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              placeholder="Quick search customer ID, phone or ticket…"
              className="w-full rounded-lg border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <button className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground">
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
              {initials(persona.employee)}
            </span>
            <ChevronDown size={14} />
          </button>
        </header>

        {role === "intern" && (
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-xs text-warning lg:px-8">
            Intern Mode: read-only access. Draft notes require Senior approval.
          </div>
        )}

        <main className="flex-1 px-4 pb-28 pt-6 lg:px-8">{children}</main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 lg:px-8">
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <FlaskConical size={13} className="text-primary" /> Role simulator
          </span>
          {(Object.keys(PERSONAS) as Persona[]).map((p) => (
            <button
              key={p}
              onClick={() => setRole(p)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                role === p
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {PERSONAS[p].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
