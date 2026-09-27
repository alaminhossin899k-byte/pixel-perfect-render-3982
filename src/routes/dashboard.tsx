import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/DashboardView";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Alpha Network Operations" },
      {
        name: "description",
        content: "Alpha Network ISP dashboard: ticket load, verification queue and new leads.",
      },
      { property: "og:title", content: "Dashboard — Alpha Network Operations" },
      {
        property: "og:description",
        content: "Alpha Network ISP dashboard: ticket load, verification queue and new leads.",
      },
    ],
  }),
  component: DashboardView,
});
