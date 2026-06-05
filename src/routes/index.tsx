import { createFileRoute } from "@tanstack/react-router";
// Replace the import below with your actual portrait image path
import heroPortrait from "@/assets/hero-portrait.jpg";
import {
  Phone,
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  Shield,
  Terminal,
  Brain,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import SkillsBubbles from "@/components/SkillsBubbles";
import ThemeToggle from "@/components/ThemeToggle";
import MatrixRain from "@/components/MatrixRain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruban Kumar R — AI & Data Science Student Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Ruban Kumar R, B.Tech AI & Data Science student at Rajalakshmi Engineering College. Linux, cybersecurity & machine learning enthusiast.",
      },
      { property: "og:title", content: "Ruban Kumar R — Portfolio" },
      {
        property: "og:description",
        content: "AI & Data Science undergraduate exploring Linux, cybersecurity, and machine learning.",
      },
    ],
  }),
  component: Index,
});

const navLinks = [
  { href: "#services", label: "SERVICES" },
  { href: "#skills", label: "SKILLS" },
  { href: "#works", label: "WORKS" },
  { href: "#experience", label: "EXPERIENCE" },
];

function Index() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500 relative z-0">
      <MatrixRain />
      <div className="mx-auto max-w-[1280px] bg-card/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)] transition-colors duration-500 min-h-screen relative z-10 backdrop-blur-sm">
        <Nav />
        <main>
          <Hero />
          <HelpSection />
          <SkillsBubbles />
          <Experience />
          <LatestWorks />
          <Testimonials />
          <ContactCTA />
        </main>
        <Footer />
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

/* ─── Navigation with glassmorphism & mobile menu ───────────────── */

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass rounded-b-2xl mx-2 md:mx-4 flex items-center justify-between px-4 py-3 md:px-14 md:py-5 transition-all duration-300">
      <a
        href="#home"
        className="font-script text-3xl md:text-4xl text-primary transition-transform duration-300 hover:scale-105 z-50"
        style={{ fontFamily: "Caveat, cursive" }}
      >
        Ruban
      </a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] font-semibold text-primary">
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={
              i === 0
                ? "rounded-full border-2 border-[var(--color-accent)] text-[var(--color-accent)] px-4 py-2 transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] hover:shadow-[0_0_20px_oklch(0.55_0.09_190_/_0.3)]"
                : "relative hover:text-[var(--color-accent)] transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--color-accent)] after:transition-all after:duration-300 hover:after:w-full"
            }
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* Actions & Mobile Toggle */}
      <div className="flex items-center gap-3 md:gap-4 z-50">
        <ThemeToggle />
        <a href="tel:+910000000000" className="hidden md:flex items-center gap-3 text-sm font-semibold text-primary group">
          <span className="group-hover:text-[var(--color-accent)] transition-colors duration-300">+91 00000 00000</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-yellow)] text-primary transition-all duration-300 group-hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.5)] group-hover:scale-110">
            <Phone className="h-4 w-4" />
          </span>
        </a>
        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border glass"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-0 left-0 h-screen w-full glass-strong z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-sm tracking-[0.2em] font-bold text-primary">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ─── Hero section ──────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="home" className="grid gap-8 px-6 pb-16 pt-6 md:grid-cols-12 md:px-14 md:pb-24">
      <div className="md:col-span-5 flex flex-col justify-center">
        <ScrollReveal variant="fade-right" duration={900}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-primary">
            Hey There,
            <br />
            I'm <span className="text-gradient">Ruban</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={300}>
          <a
            href="mailto:rubankumar@example.com"
            className="mt-10 inline-block text-[var(--color-coral)] font-medium underline-offset-4 hover:underline transition-all duration-300 hover:tracking-wide"
          >
            rubankumar@example.com
          </a>
        </ScrollReveal>
      </div>

      <div className="md:col-span-4 flex items-center justify-center">
        <ScrollReveal variant="scale" duration={1000}>
          <div className="relative group" data-cursor="image">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-yellow)] to-[var(--color-coral)] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
            <img
              src={heroPortrait}
              alt="Ruban Kumar R"
              width={1024}
              height={1024}
              className="relative w-full max-w-md object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="md:col-span-3 flex flex-col justify-between gap-10">
        <ScrollReveal variant="fade-left" delay={400}>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed md:text-right">
            I build clever things with code & data, and love what I do.
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={600}>
          <div className="flex flex-col items-end gap-3">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-border glass transition-all duration-500 hover:shadow-[0_0_24px_oklch(0.55_0.09_190_/_0.25)] hover:border-[var(--color-accent)]">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-wider text-primary text-right leading-tight">
              B.TECH
              <br />
              AI & DATA SCIENCE
              <br />
              REC · 2028
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="md:col-span-12 flex items-end justify-between border-t border-border pt-6">
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-gradient">02</span>
            <div className="text-xs font-bold tracking-wider text-primary leading-tight">
              YEARS
              <br />
              LEARNING
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={400}>
          <div className="hidden md:flex gap-3 text-primary">
            <a
              href="https://github.com/Ruban-Rk"
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:rubankumar@example.com"
              className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Services / "What do I do?" ────────────────────────────────── */

const services = [
  { icon: Terminal, title: "Linux & Systems", count: "Daily Driver", color: "var(--color-accent)" },
  { icon: Shield, title: "Cybersecurity", count: "Learning Path", color: "var(--color-yellow)" },
  { icon: Brain, title: "AI / ML", count: "Core Focus", color: "var(--color-coral)" },
];

function HelpSection() {
  return (
    <section
      id="services"
      className="grid gap-10 px-6 py-16 md:grid-cols-2 md:px-14 md:py-24 bg-[var(--color-card)]"
    >
      <ScrollReveal variant="fade-right" className="space-y-5" stagger={150}>
        {services.map(({ icon: Icon, title, count, color }) => (
          <div
            key={title}
            className="flex items-center gap-5 rounded-2xl glass p-4 transition-all duration-400 hover:shadow-[0_8px_32px_-8px_oklch(0.55_0.09_190_/_0.2)] hover:translate-x-1 group"
          >
            <div
              className="grid h-14 w-14 place-items-center rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{ background: color }}
            >
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">{title}</h3>
              <p className="text-sm text-muted-foreground">{count}</p>
            </div>
          </div>
        ))}
      </ScrollReveal>

      <div>
        <ScrollReveal variant="fade-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary">What do I do?</h2>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={200}>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            I'm an undergraduate exploring Artificial Intelligence and Data Science. I work on Linux
            every day, dig into cybersecurity concepts, and build small software projects to practice
            what I learn.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            My goal is simple: learn deeply, build consistently, and ship things that actually solve
            problems.
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={400} className="mt-10 flex gap-12">
          <div className="group">
            <div className="text-5xl font-extrabold text-gradient transition-transform duration-300 group-hover:scale-110 origin-left">15+</div>
            <div className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground">
              MINI PROJECTS
            </div>
          </div>
          <div className="group">
            <div className="text-5xl font-extrabold text-gradient transition-transform duration-300 group-hover:scale-110 origin-left">08+</div>
            <div className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground">
              CERTIFICATIONS
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Experience timeline ───────────────────────────────────────── */

const timeline = [
  {
    title: "Indian Space Academy",
    sub: "Intern · 2025",
    role: "Space Tech Intern",
    body: "Worked alongside engineers exploring space technology workflows, mission data, and applied research environments.",
    color: "var(--color-accent)",
  },
  {
    title: "Rajalakshmi Engineering College",
    sub: "2024 — 2028",
    role: "B.Tech · AI & Data Science",
    body: "Pursuing undergraduate studies in AI & Data Science with focus on machine learning, statistics, and systems programming.",
    color: "var(--color-coral)",
  },
  {
    title: "Self-Taught Track",
    sub: "Ongoing",
    role: "Linux · Security · Dev",
    body: "Daily practice on Linux systems, scripting, network security fundamentals, and full-stack software development.",
    color: "var(--color-yellow)",
  },
];

function Experience() {
  return (
    <section id="experience" className="px-6 py-16 md:px-14 md:py-24">
      <ScrollReveal variant="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-12">My Experience</h2>
      </ScrollReveal>
      <div className="space-y-12">
        {timeline.map((t, i) => (
          <ScrollReveal key={t.title} variant="fade-up" delay={i * 150}>
            <div className="grid gap-6 md:grid-cols-12 md:gap-10 glass rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-[0_12px_40px_-12px_oklch(0.55_0.09_190_/_0.15)] hover:translate-y-[-2px]">
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold text-primary">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.sub}</p>
              </div>
              <div className="md:col-span-1 hidden md:flex justify-center">
                <div
                  className="mt-2 h-4 w-4 rounded-full border-2 border-dashed transition-all duration-500 hover:scale-150"
                  style={{ borderColor: t.color, background: "transparent" }}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{ background: t.color, transform: "scale(0.5)" }}
                  />
                </div>
              </div>
              <div className="md:col-span-8">
                <h4 className="text-xl font-bold text-primary">{t.role}</h4>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">{t.body}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Latest Works with glassmorphism cards ─────────────────────── */

const works = [
  { title: "Linux Toolkit", tag: "Shell · Automation", color: "var(--color-yellow)" },
  { title: "Security Notes", tag: "Cybersecurity Lab", color: "var(--color-accent)" },
  { title: "ML Playground", tag: "Python · scikit-learn", color: "var(--color-coral)" },
];

function LatestWorks() {
  return (
    <section id="works" className="px-6 py-16 md:px-14 md:py-24 bg-[var(--color-card)]">
      <ScrollReveal variant="fade-up">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary">My Latest Works</h2>
            <p className="mt-3 text-muted-foreground">A peek at what I'm currently building.</p>
          </div>
          <a
            href="https://github.com/Ruban-Rk"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-[var(--color-coral)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:gap-3"
          >
            Explore More <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5" />
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={120} className="grid gap-6 md:grid-cols-3">
        {works.map((w) => (
          <article
            key={w.title}
            className="rounded-2xl p-6 h-72 flex flex-col justify-between text-primary relative overflow-hidden group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.3)]"
            style={{ background: w.color }}
          >
            {/* Glassmorphism overlay on hover */}
            <div className="absolute inset-0 bg-white/0 backdrop-blur-0 transition-all duration-500 group-hover:bg-white/10 group-hover:backdrop-blur-[2px] rounded-2xl" />

            <div className="relative z-10">
              <p className="text-xs font-bold tracking-wider opacity-70">{w.tag}</p>
              <h3 className="mt-2 text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1">{w.title}</h3>
            </div>
            <div className="relative z-10 self-end">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-card glass transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_oklch(0.55_0.09_190_/_0.3)]">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </div>
          </article>
        ))}
      </ScrollReveal>
    </section>
  );
}

/* ─── Testimonials with glassmorphism cards ──────────────────────── */

function Testimonials() {
  return (
    <section id="notes" className="px-6 py-16 md:px-14 md:py-24 text-center">
      <ScrollReveal variant="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary">People talk about me</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Notes from mentors, peers, and teammates I've worked with along the way.
        </p>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={200} className="mt-12 grid gap-6 md:grid-cols-2 text-left">
        {[
          {
            quote:
              "Ruban shows real curiosity and a strong drive to learn. He's the kind of student who actually goes home and builds the thing.",
            name: "Faculty Mentor",
            role: "Rajalakshmi Engineering College",
          },
          {
            quote:
              "Calm, focused, and quick to pick up new tools. Comfortable in Linux environments and eager about security work.",
            name: "Internship Lead",
            role: "Indian Space Academy",
          },
        ].map((t) => (
          <div
            key={t.name}
            className="rounded-2xl glass p-8 transition-all duration-500 hover:shadow-[0_12px_40px_-12px_oklch(0.55_0.09_190_/_0.15)] hover:translate-y-[-2px] group"
          >
            <p className="text-primary leading-relaxed italic">"{t.quote}"</p>
            <div className="mt-6">
              <div className="font-bold text-primary group-hover:text-gradient transition-all duration-300">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.role}</div>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}

/* ─── Contact CTA ───────────────────────────────────────────────── */

function ContactCTA() {
  return (
    <section id="contact" className="px-6 py-16 md:px-14 md:py-24 bg-[var(--color-card)]">
      <div className="grid gap-10 md:grid-cols-2">
        <ScrollReveal variant="fade-right">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Let's make
            <br />
            something <span className="text-gradient">amazing</span> together.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Start by{" "}
            <a
              href="mailto:rubankumar@example.com"
              className="text-[var(--color-coral)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:tracking-wide"
            >
              saying hi
            </a>
            .
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fade-left">
          <div className="space-y-3 text-primary md:text-right">
            <div className="text-xs font-bold tracking-wider">INFORMATION</div>
            <p>Chennai, Tamil Nadu, India</p>
            <p>rubankumar@example.com</p>
            <p>+91 00000 00000</p>
            <div className="flex gap-3 md:justify-end pt-3">
              <a
                href="https://github.com/Ruban-Rk"
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:rubankumar@example.com"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="px-6 py-8 md:px-14 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-border">
      <div
        className="font-script text-2xl text-primary transition-transform duration-300 hover:scale-105"
        style={{ fontFamily: "Caveat, cursive" }}
      >
        Ruban
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ruban Kumar R. All rights reserved.
      </p>
    </footer>
  );
}
