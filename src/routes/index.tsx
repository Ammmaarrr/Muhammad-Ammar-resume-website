import { createFileRoute } from "@tanstack/react-router";
import MissionPortfolio from "@/components/MissionPortfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AMMAR-01 — Mission Briefing | Muhammad Ammar Portfolio" },
      { name: "description", content: "Space mission control portfolio of Muhammad Ammar — Software Engineer, ML Enthusiast & Entrepreneur. Scroll to launch through skills, experience and projects." },
      { property: "og:title", content: "AMMAR-01 — Mission Briefing" },
      { property: "og:description", content: "A NASA-style mission briefing portfolio: skills, experience and projects rendered as planets in deep space." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return <MissionPortfolio />;
}
