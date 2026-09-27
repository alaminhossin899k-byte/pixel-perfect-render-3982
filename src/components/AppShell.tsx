import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Signal,
  Ticket,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";
import { roleLabel, useAppStore } from "@/store/app-store";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/leads", label: "Sales & Leads", icon: UserPlus },
  { to: "/verification", label: "Verification Queue", icon: LifeBuoy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
              NB
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Nabila Rahman</p>
              <span className="mt-0.5 inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {roleLabel[role]}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => {
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

        <div className="border-t border-sidebar-border p-4">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Simulate role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="mt-2 w-full rounded-lg border border-border bg-input/60 px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary/60"
          >
            <option value="technician">Technician</option>
            <option value="support">Support Agent</option>
            <option value="escalation">Escalation / NOC</option>
          </select>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
          <div className="relative flex-1 max-w-xl">
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
              NB
            </span>
            <ChevronDown size={14} />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
