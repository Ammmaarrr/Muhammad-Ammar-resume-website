import { useEffect, useRef, useState } from "react";
import ammarPhoto from "@/assets/ammar.jpeg";

/* ========== Star Field (client-only to avoid SSR/CSS precision mismatch) ========== */
function StarField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  // Fewer stars on small screens
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const count = isSmall ? 70 : 140;
  const stars = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: rand(i + 1) * 100,
    y: rand(i + 2.3) * 100,
    s: rand(i + 5.7) * 2 + 0.4,
    d: rand(i + 11.2) * 4,
    layer: Math.floor(rand(i + 17.9) * 3),
  }));
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.s}px`,
            height: `${s.s}px`,
            opacity: 0.3 + s.layer * 0.25,
            animationDelay: `${s.d}s`,
            transform: `translateZ(0)`,
          }}
        />
      ))}
      <div className="absolute -top-20 -left-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full blur-3xl opacity-30"
           style={{ background: "radial-gradient(circle, oklch(0.5 0.25 290), transparent 70%)" }} />
      <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full blur-3xl opacity-25"
           style={{ background: "radial-gradient(circle, oklch(0.55 0.22 220), transparent 70%)" }} />
    </div>
  );
}

/* ========== Mission Clock ========== */
function MissionClock() {
  const [now, setNow] = useState(new Date());
  const launchRef = useRef(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const utc = now.toISOString().substring(11, 19);
  const elapsed = Math.floor((now.getTime() - launchRef.current.getTime()) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 hud-panel border-b">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-mission-green animate-blink" />
          <span className="hidden sm:inline text-mission-green text-glow">MISSION ACTIVE</span>
          <span className="sm:hidden text-mission-green">LIVE</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-8 font-mono">
          <div className="hidden md:flex flex-col items-center leading-none">
            <span className="text-[8px] text-muted-foreground">UTC</span>
            <span className="text-cosmic-cyan text-glow">{utc}</span>
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[8px] text-muted-foreground">MET (T+)</span>
            <span className="text-primary text-glow">{h}:{m}:{s}</span>
          </div>
          <div className="hidden md:flex flex-col items-center leading-none">
            <span className="text-[8px] text-muted-foreground">CALLSIGN</span>
            <span className="text-foreground">AMMAR-01</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground hidden sm:inline">SYS</span>
          <span className="text-mission-green">●</span>
          <span className="text-mission-green">●</span>
          <span className="text-warning-amber">●</span>
        </div>
      </div>
    </div>
  );
}

/* ========== Rocket scrolling ========== */
function Rocket() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(Math.min(1, window.scrollY / Math.max(1, max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // S-shape trajectory
  const top = 12 + progress * 76; // % of viewport
  const left = 50 + Math.sin(progress * Math.PI * 2) * 32;

  return (
    <div
      className="pointer-events-none fixed z-30 transition-[top,left] duration-200 ease-out hidden sm:block"
      style={{ top: `${top}vh`, left: `${left}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="relative" style={{ transform: `rotate(${Math.sin(progress * Math.PI * 2) * 18}deg)` }}>
        {/* Thrust */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 origin-top animate-thrust">
          <div className="h-12 w-3 rounded-b-full"
               style={{ background: "linear-gradient(to bottom, oklch(0.95 0.15 80), oklch(0.7 0.22 30), transparent)" }} />
        </div>
        {/* Rocket body */}
        <svg width="44" height="64" viewBox="0 0 44 64" fill="none">
          <path d="M22 2 L34 28 L34 50 L10 50 L10 28 Z" fill="oklch(0.95 0.01 240)" stroke="oklch(0.7 0.18 220)" strokeWidth="1.2"/>
          <circle cx="22" cy="24" r="4.5" fill="oklch(0.7 0.18 220)" stroke="oklch(0.95 0.01 240)" strokeWidth="1"/>
          <path d="M10 40 L2 56 L10 50 Z" fill="oklch(0.62 0.22 27)"/>
          <path d="M34 40 L42 56 L34 50 Z" fill="oklch(0.62 0.22 27)"/>
          <rect x="18" y="50" width="8" height="6" fill="oklch(0.4 0.05 260)"/>
        </svg>
      </div>
    </div>
  );
}

/* ========== Section header ========== */
function PlanetHeader({
  code, title, subtitle, color, ringColor,
}: { code: string; title: string; subtitle: string; color: string; ringColor: string }) {
  return (
    <div className="relative mb-12 flex flex-col items-center text-center">
      <div className="relative mb-6 h-40 w-40 sm:h-52 sm:w-52">
        <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${ringColor}` }} />
        <div className="absolute inset-2 rounded-full animate-spin-slow"
             style={{ background: `radial-gradient(circle at 30% 30%, ${color}, oklch(0.1 0.04 260) 80%)`,
                      boxShadow: `0 0 60px ${ringColor}, inset -10px -20px 40px oklch(0 0 0 / 0.6)` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl sm:text-3xl font-black text-white text-glow">{code}</span>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-[0.4em] text-cosmic-cyan">{subtitle}</div>
      <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl text-glow" style={{ color }}>{title}</h2>
      <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-px w-12 bg-border" />
        <span>Approaching target</span>
        <span className="h-px w-12 bg-border" />
      </div>
    </div>
  );
}

/* ========== Data lines ========== */
function HudCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`hud-corner relative hud-panel scanline overflow-hidden p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ========== Sections ========== */
function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 pb-20 sm:pt-24 sm:pb-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-5xl px-3 sm:px-4">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cosmic-cyan">
          <span className="h-px flex-1 bg-cosmic-cyan/40" />
          <span>Mission Briefing — Doc #001</span>
          <span className="h-px flex-1 bg-cosmic-cyan/40" />
        </div>

        <HudCard className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Astronaut Profile</div>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center sm:text-left">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full border border-cosmic-cyan/40 animate-pulse-ring" />
              <div className="absolute -inset-3 rounded-full border border-primary/20" />
              <div
                className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden border-2 border-cosmic-cyan/60"
                style={{ boxShadow: "0 0 40px oklch(0.7 0.18 220 / 0.4), inset 0 0 30px oklch(0 0 0 / 0.4)" }}
              >
                <img
                  src={ammarPhoto}
                  alt="Muhammad Ammar — Astronaut Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-mission-green/20 border border-mission-green/60 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest text-mission-green">
                ID-01
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-black uppercase sm:text-6xl md:text-7xl text-glow text-foreground leading-[0.95]">
                Muhammad
                <br />
                <span className="text-primary">Ammar</span>
              </h1>
              <div className="mt-3 text-xs sm:text-sm uppercase tracking-[0.3em] text-cosmic-cyan">
                Software Engineer • ML Enthusiast • Entrepreneur
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 text-left">
            {[
              { k: "ORIGIN", v: "Pakistan" },
              { k: "SECTOR", v: "GIKI" },
              { k: "CALLSIGN", v: "AMMAR-01" },
              { k: "STATUS", v: "AVAILABLE" },
            ].map((d) => (
              <div key={d.k} className="border-l-2 border-cosmic-cyan/60 pl-3">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{d.k}</div>
                <div className="mt-1 font-display text-sm text-foreground">{d.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-warning-amber animate-blink">
              ▼ Initiate descent — scroll to launch ▼
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              T-MINUS 00:00:03 — IGNITION SEQUENCE START
            </div>
          </div>
        </HudCard>

        {/* Telemetry strip */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-widest">
          {[
            ["Velocity", "11.2 km/s"],
            ["Altitude", "ORBIT"],
            ["Fuel", "98%"],
          ].map(([k, v]) => (
            <div key={k} className="hud-panel px-3 py-2 text-center">
              <div className="text-muted-foreground">{k}</div>
              <div className="text-mission-green text-glow">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const skills = [
  { cat: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"] },
  { cat: "Frontend", items: ["React", "Vite", "Tailwind", "Radix UI", "Recharts"] },
  { cat: "Backend & DB", items: ["Supabase", "PostgreSQL", "Flask", "FastAPI", "REST"] },
  { cat: "ML & Data", items: ["PyTorch", "Scikit-learn", "Pandas", "NumPy", "XGBoost"] },
  { cat: "Scraping", items: ["Scrapy", "BeautifulSoup", "Selenium"] },
  { cat: "DevOps", items: ["Git", "Docker", "GitHub Actions", "CI/CD", "Vercel"] },
];

function SkillsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <PlanetHeader
          code="01"
          title="Skills"
          subtitle="Planet Tekhnos — Sector A"
          color="oklch(0.7 0.18 220)"
          ringColor="oklch(0.7 0.18 220 / 0.5)"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <HudCard key={s.cat}>
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.3em] text-cosmic-cyan">
                  Module 0{i + 1}
                </div>
                <span className="font-mono text-[10px] text-mission-green">● ONLINE</span>
              </div>
              <h3 className="mt-2 text-xl font-bold uppercase text-foreground">{s.cat}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it}
                    className="rounded-sm border border-cosmic-cyan/40 bg-cosmic-cyan/10 px-2 py-1 font-mono text-xs text-cosmic-cyan">
                    {it}
                  </span>
                ))}
              </div>
              {/* signal bars */}
              <div className="mt-4 flex items-end gap-1 h-6">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx}
                    className="w-1 bg-mission-green/70"
                    style={{ height: `${20 + ((idx * 37) % 80)}%`, opacity: 0.3 + (idx / 12) }}
                  />
                ))}
              </div>
            </HudCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const experience = [
  {
    role: "Co-Founder & Country Head",
    org: "Spectra Ops",
    year: "2024 — Present",
    log: [
      "Co-founded a tech solutions company providing software & digital services",
      "Leading Pakistan operations: client relationships and project delivery",
      "Overseeing technical strategy, team coordination, and business dev",
      "Building partnerships with local & international clients",
    ],
  },
  {
    role: "Founder & Operations Manager",
    org: "Safar-e-GIKI",
    year: "2024 — Present",
    log: [
      "Founded transport booking service for GIKI students to major cities",
      "End-to-end ops: bookings, customer support, vendor coordination",
      "Real-time seat inventory, payment tracking, trip scheduling",
      "Built and deployed booking platform — 100+ bookings/month",
    ],
  },
];

function ExperienceSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <PlanetHeader
          code="02"
          title="Experience"
          subtitle="Planet Praxis — Sector B"
          color="oklch(0.78 0.2 145)"
          ringColor="oklch(0.78 0.2 145 / 0.5)"
        />
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cosmic-cyan to-transparent" />
          <div className="space-y-10">
            {experience.map((e, i) => (
              <div key={e.org} className={`relative grid sm:grid-cols-2 gap-6 ${i % 2 ? "" : ""}`}>
                <div className={`pl-12 sm:pl-0 ${i % 2 ? "sm:order-2 sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-warning-amber">{e.year}</div>
                  <h3 className="mt-1 text-2xl font-bold uppercase text-foreground">{e.org}</h3>
                  <div className="mt-1 text-sm text-cosmic-cyan">{e.role}</div>
                </div>
                <div className={`pl-12 sm:pl-0 ${i % 2 ? "sm:order-1 sm:pr-12" : "sm:pl-12"}`}>
                  <HudCard>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-mission-green mb-3">
                      ▸ Mission Log
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {e.log.map((l, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-cosmic-cyan">{String(idx + 1).padStart(2, "0")}</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </HudCard>
                </div>
                {/* node */}
                <div className="absolute left-4 sm:left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Project = {
  name: string;
  tag: string;
  desc: string;
  bullets: string[];
  stack: string[];
  links?: { label: string; href: string }[];
  badge?: string;
};

const projects: Project[] = [
  {
    name: "Wheels Predict",
    tag: "ML / Data Pipeline",
    desc: "End-to-end ML pipeline for Pakistani used-car price prediction with scraped PakWheels data.",
    bullets: [
      "Scrapy spiders → 50,000+ car listings",
      "XGBoost + Random Forest at 85%+ accuracy",
      "Flask web UI w/ live predictions & dashboard",
      "Dockerized + GitHub Actions CI/CD",
    ],
    stack: ["Python", "XGBoost", "Scrapy", "Flask", "Docker"],
  },
  {
    name: "Safar-e-GIKI",
    tag: "Full-Stack Platform",
    desc: "Bus ticket booking platform for GIKI students traveling to Islamabad and Multan.",
    bullets: [
      "Seat selection & real-time bookings",
      "Payment integration + admin analytics",
      "Built with React, TS, Supabase realtime",
      "Live in production, 100+ bookings/mo",
    ],
    stack: ["React", "TypeScript", "Supabase", "Tailwind"],
    badge: "LIVE",
    links: [{ label: "Live Site ↗", href: "https://safar-e-giki.vercel.app/" }],
  },
  {
    name: "Agentic Healthcare Intelligence System",
    tag: "Hackathon / Agentic AI",
    desc: "Agent-powered healthcare intelligence platform built for the 5th Global MIT Hackathon — forked and extended from the original team repository.",
    bullets: [
      "Built for the 5th Global MIT Hackathon",
      "Forked & extended an existing team codebase",
      "Agentic workflows orchestrating clinical reasoning",
      "Patient & provider intelligence dashboards",
    ],
    stack: ["React", "TypeScript", "Agentic AI", "Hackathon"],
    badge: "HACKATHON",
    links: [{ label: "GitHub ↗", href: "https://github.com/Ammmaarrr/health-care-d.git" }],
  },
  {
    name: "Virtual Qari",
    tag: "Mobile / Audio",
    desc: "Quran memorization app with progress tracking, personalized learning & audio playback.",
    bullets: [
      "Personalized memorization tracker",
      "Audio playback & repetition engine",
      "Progress analytics dashboard",
    ],
    stack: ["React", "Audio", "State Mgmt"],
  },
  {
    name: "HCI / UX Design",
    tag: "Design Process",
    desc: "Full UX process: research, sketches, wireframes, prototypes & UML diagrams.",
    bullets: [
      "User research → wireframes → prototypes",
      "Use case, class & sequence UML diagrams",
      "Interactive Figma high-fidelity prototype",
    ],
    stack: ["Figma", "UML", "Wireframes"],
  },
];

function ProjectsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <PlanetHeader
          code="03"
          title="Projects"
          subtitle="Planet Artifex — Sector C"
          color="oklch(0.78 0.18 60)"
          ringColor="oklch(0.78 0.18 60 / 0.5)"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <HudCard key={p.name} className="group">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.3em] text-warning-amber">
                  Payload-{String(i + 1).padStart(3, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-mission-green">
                  ▸ {p.badge ?? "Deployed"}
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <h3 className="text-2xl font-black uppercase text-foreground">{p.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-cosmic-cyan">{p.tag}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-1 text-xs">
                {p.bullets.map((b, idx) => (
                  <li key={idx} className="flex gap-2 font-mono text-muted-foreground">
                    <span className="text-mission-green">[{String(idx + 1).padStart(2, "0")}]</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase text-primary font-mono">
                    {s}
                  </span>
                ))}
              </div>
              {p.links && p.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-mission-green/50 bg-mission-green/10 px-2 py-1 text-[10px] uppercase tracking-widest text-mission-green hover:bg-mission-green/20 transition-colors font-mono"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </HudCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedMissionSection() {
  const features = [
    { code: "F-01", title: "Agentic Orchestration", body: "Autonomous agents coordinate clinical reasoning across symptom intake, triage, and recommendations." },
    { code: "F-02", title: "Patient Intelligence", body: "Personalized health summaries derived from longitudinal records and live signals." },
    { code: "F-03", title: "Provider Copilot", body: "Decision-support surface for clinicians: differential prompts, references, and follow-up planning." },
    { code: "F-04", title: "Conversational Interface", body: "Natural-language chat layer powered by LLMs, with grounded retrieval and tool use." },
    { code: "F-05", title: "Hackathon Heritage", body: "Forked from the original team repo and extended for the 5th Global MIT Hackathon." },
    { code: "F-06", title: "Modular Architecture", body: "Composable agents, tools, and data adapters — easy to extend with new clinical workflows." },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <PlanetHeader
          code="03+"
          title="Featured Mission"
          subtitle="Deep Scan — Payload Spotlight"
          color="oklch(0.78 0.2 145)"
          ringColor="oklch(0.78 0.2 145 / 0.5)"
        />
        <HudCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-warning-amber">
                Mission Dossier — MIT-05
              </div>
              <h3 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-foreground leading-tight">
                Agentic Healthcare
                <br />
                <span className="text-mission-green">Intelligence System</span>
              </h3>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-cosmic-cyan">
                5th Global MIT Hackathon · Forked & Extended
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/Ammmaarrr/health-care-d.git"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-mission-green/60 bg-mission-green/10 px-3 py-2 text-[10px] uppercase tracking-widest text-mission-green hover:bg-mission-green/20 transition-colors font-mono"
              >
                ▸ GitHub Repo ↗
              </a>
              <span className="rounded-sm border border-border bg-background/40 px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                Live Link · TBA
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-cosmic-cyan mb-2">
              ▸ Overview
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An agentic AI system designed to assist healthcare workflows through
              coordinated, autonomous agents. The platform pairs patient-facing
              intelligence with a clinician copilot, using LLM-driven reasoning
              and tool use to triage, summarize, and recommend next steps. Forked
              from the original hackathon team repository and extended with
              additional agents and UX refinements during the 5th Global MIT
              Hackathon.
            </p>
          </div>

          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-cosmic-cyan mb-3">
              ▸ Key Features
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.code}
                  className="hud-corner relative border border-border bg-background/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cosmic-cyan">{f.code}</span>
                    <span className="text-[10px] text-mission-green">● ACTIVE</span>
                  </div>
                  <div className="mt-1 text-sm font-bold uppercase text-foreground">
                    {f.title}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-4">
            {["React", "TypeScript", "Agentic AI", "LLM", "Tool Use", "Hackathon"].map((s) => (
              <span
                key={s}
                className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase text-primary font-mono"
              >
                {s}
              </span>
            ))}
          </div>
        </HudCard>
      </div>
    </section>
  );
}

function EducationSection() {
  const records = [
    { name: "BS Software Engineering", org: "GIKI", year: "2023 — Present", note: "Bachelor of Science" },
    { name: "A-Levels", org: "Jinnah Highs", year: "Completed", note: "2 B's" },
    { name: "O-Levels (IGCSE)", org: "Jinnah Highs", year: "Completed", note: "2 A* + 5 A's" },
    { name: "SQL", org: "Udemy", year: "Cert.", note: "Certification" },
  ];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <PlanetHeader
          code="04"
          title="Training"
          subtitle="Planet Academia — Sector D"
          color="oklch(0.7 0.2 320)"
          ringColor="oklch(0.7 0.2 320 / 0.5)"
        />
        <HudCard>
          <div className="grid grid-cols-[60px_1fr_1fr_auto] gap-3 border-b border-border pb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>ID</span><span>Program</span><span>Institution</span><span>Year</span>
          </div>
          {records.map((r, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr_1fr_auto] gap-3 border-b border-border/50 py-3 text-sm">
              <span className="font-mono text-cosmic-cyan">#{String(i + 1).padStart(3, "0")}</span>
              <span className="text-foreground">{r.name}<div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.note}</div></span>
              <span className="text-muted-foreground self-center">{r.org}</span>
              <span className="text-warning-amber font-mono self-center text-xs">{r.year}</span>
            </div>
          ))}
        </HudCard>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="relative py-24 pb-40">
      <div className="mx-auto max-w-3xl px-4">
        <PlanetHeader
          code="05"
          title="Comms"
          subtitle="Ground Station — Final Approach"
          color="oklch(0.62 0.22 27)"
          ringColor="oklch(0.62 0.22 27 / 0.5)"
        />
        <HudCard className="text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-mission-green animate-blink mb-4">
            ▸ Channel Open — Awaiting Transmission
          </div>
          <h3 className="text-2xl uppercase font-black text-foreground">Establish contact</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Open a relay link to begin a new mission together.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a href="mailto:m.ammar.63.64@gmail.com"
               className="hud-panel hover:border-primary transition-all px-4 py-3 text-left">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Email Relay</div>
              <div className="mt-1 text-xs text-cosmic-cyan break-all">m.ammar.63.64@gmail.com</div>
            </a>
            <a href="#" className="hud-panel hover:border-primary transition-all px-4 py-3 text-left">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Code Repo</div>
              <div className="mt-1 text-xs text-cosmic-cyan">GitHub → /ammar</div>
            </a>
            <a href="#" className="hud-panel hover:border-primary transition-all px-4 py-3 text-left">
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Network</div>
              <div className="mt-1 text-xs text-cosmic-cyan">LinkedIn → /ammar</div>
            </a>
          </div>
          <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            END OF TRANSMISSION — © {new Date().getFullYear()} AMMAR-01
          </div>
        </HudCard>
      </div>
    </section>
  );
}

/* ========== Page ========== */
export default function MissionPortfolio() {
  return (
    <div className="space-bg relative min-h-screen text-foreground">
      <StarField />
      <MissionClock />
      <Rocket />
      <main className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <FeaturedMissionSection />
        <EducationSection />
        <ContactSection />
      </main>
    </div>
  );
}
