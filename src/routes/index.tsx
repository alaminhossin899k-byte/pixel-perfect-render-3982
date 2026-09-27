import { createFileRoute } from "@tanstack/react-router";
import { DashboardView } from "@/components/DashboardView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Alpha Network" },
      {
        name: "description",
        content: "Live ISP operations dashboard for Alpha Network tickets, field work and leads.",
      },
      { property: "og:title", content: "Operations Dashboard — Alpha Network" },
      {
        property: "og:description",
        content: "Live ISP operations dashboard for Alpha Network tickets, field work and leads.",
      },
    ],
  }),
  component: DashboardView,
});
