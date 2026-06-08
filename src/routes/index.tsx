import { createFileRoute, Link } from "@tanstack/react-router";
// Replace the import below with your actual portrait image path
import heroPortrait from "@/assets/hero-portrait.jpg";
import {
  Phone,
  Mail,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
  ArrowUpRight,
  Shield,
  Terminal,
  Brain,
  ChevronUp,
  Menu,
  X,
  Eye,
  Camera,
  MapPin,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  MessageCircle,
  Download,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import ThemeToggle from "@/components/ThemeToggle";
import { useAdmin } from "@/hooks/use-admin";
import { useComments } from "@/hooks/use-comments";

// Lazy load heavy components to improve initial load time
const SkillsBubbles = lazy(() => import("@/components/SkillsBubbles"));
const MatrixRain = lazy(() => import("@/components/MatrixRain"));
const CommentsSection = lazy(() => import("@/components/CommentsSection"));
const BadgesSection = lazy(() => import("@/components/BadgesSection").then((m) => ({ default: m.BadgesSection })));

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
  { href: "#comments", label: "COMMENTS" },
];

const SERVICE_ICONS = [Terminal, Shield, Brain];
const SERVICE_COLORS = [
  "var(--color-accent)",
  "var(--color-yellow)",
  "var(--color-coral)",
];

/* ─── Hidden admin trigger: triple-click the logo ──────────────── */
function useHiddenAdminTrigger() {
  const { setShowLoginModal, isAdmin } = useAdmin();
  const clickCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleLogoClick = useCallback(() => {
    if (isAdmin) return;
    clickCount.current += 1;
    clearTimeout(timer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      setShowLoginModal(true);
    } else {
      timer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 800);
    }
  }, [isAdmin, setShowLoginModal]);

  return handleLogoClick;
}

/* ─── Intro gate (disabled) ─────────────────────────────────────── */
function useIntroGate() {
  // Intro animation has been removed
  return { introVisible: false, fadeOut: false, dismiss: () => {} };
}

function Index() {
  const [showTop, setShowTop] = useState(false);
  useIntroGate(); // kept for compatibility, intro is disabled

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Main Portfolio ── */}
      <div className="min-h-screen bg-transparent transition-colors duration-500 relative z-0">
        <Suspense fallback={null}>
          <MatrixRain />
        </Suspense>
        <div className="mx-auto max-w-[1280px] bg-card/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)] transition-colors duration-500 min-h-screen relative z-10 backdrop-blur-sm">
          <Nav />
          <main>
            <Hero />
            <HelpSection />
            <Suspense fallback={<div className="h-96" />}>
              <SkillsBubbles />
            </Suspense>
            <Experience />
            <LatestWorks />
            <MomentsPreview />
            <Suspense fallback={<div className="h-64" />}>
              <BadgesSection />
            </Suspense>
            <Testimonials />
            <ContactCTA />
            <Suspense fallback={<div className="h-64" />}>
              <CommentsSection />
            </Suspense>
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
    </>
  );
}

/* ─── Navigation with glassmorphism & mobile menu ───────────────── */

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogoClick = useHiddenAdminTrigger();
  const { isAdmin, setShowLoginModal, logout, portfolioData } = useAdmin();
  const { viewCount } = useComments();

  return (
    <header className="sticky top-0 z-50 glass rounded-b-2xl mx-2 md:mx-4 flex items-center justify-between px-4 py-3 md:px-14 md:py-5 transition-all duration-300">
      <a
        href="#home"
        onClick={(e) => { e.preventDefault(); handleLogoClick(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="font-script text-3xl md:text-4xl text-primary transition-transform duration-300 hover:scale-105 z-50 select-none"
        style={{ fontFamily: "Caveat, cursive", cursor: "pointer" }}
        title="Home"
        id="nav-logo"
      >
        Ruban
      </a>

      {/* Admin badge */}
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: "50px",
            padding: "4px 14px",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif" }}>
            ⚙️ ADMIN MODE
          </span>
          <button
            onClick={logout}
            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "11px", fontWeight: 600, fontFamily: "Inter, sans-serif" }}
          >
            (logout)
          </button>
        </div>
      )}

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
        <Link
          to="/moments"
          className="relative hover:text-[var(--color-accent)] transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--color-accent)] after:transition-all after:duration-300 hover:after:w-full"
        >
          MOMENTS
        </Link>
      </nav>

      {/* Actions & Mobile Toggle */}
      <div className="flex items-center gap-3 md:gap-4 z-50">
        {/* Live view counter pill */}
        {portfolioData?.viewCounterConfig?.enabled !== false && (
          <a
            href="#comments"
            title="Portfolio views"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "50px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.22)",
              color: "#a5b4fc",
              textDecoration: "none",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.22)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(99,102,241,0.22)";
            }}
          >
            <Eye style={{ width: 13, height: 13 }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "12px" }}>
              {viewCount.toLocaleString()}
            </span>
          </a>
        )}

        {/* Action / Phone */}
        <InteractivePhone />
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
          <Link
            to="/moments"
            onClick={() => setIsOpen(false)}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            MOMENTS
          </Link>
        </nav>
      </div>
    </header>
  );
}

function InteractivePhone({ variant = "nav" }: { variant?: "nav" | "footer" }) {
  const { portfolioData } = useAdmin();
  const phone = portfolioData.hero.phone;
  const cleanPhone = phone.replace(/\s/g, "");
  
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  if (variant === "footer") {
    return (
      <div className="relative inline-block" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          {phone}
        </button>
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-card border border-border/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col py-1">
              <button onClick={handleCopy} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left w-full">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                <span>{copied ? "Copied!" : "Copy Number"}</span>
              </button>
              <a href={`tel:${cleanPhone}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>Dial Number</span>
              </a>
              <a href={`https://wa.me/${cleanPhone.replace("+", "")}`} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>WhatsApp</span>
              </a>
              <a href={`sms:${cleanPhone}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Text Message</span>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-3 text-sm font-semibold text-primary group"
      >
        <span className="group-hover:text-blue-500 transition-colors duration-300">{phone}</span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500 text-white transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] group-hover:scale-110">
          <Phone className="h-4 w-4" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-card border border-border/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-border/50 bg-background/50">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1">Contact via</p>
            <p className="font-mono text-sm">{phone}</p>
          </div>
          <div className="flex flex-col py-2">
            <button onClick={handleCopy} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left w-full group">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </span>
              <span className="font-medium">{copied ? "Copied to clipboard!" : "Copy to Clipboard"}</span>
            </button>
            <a href={`tel:${cleanPhone}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full group">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium">Dial Number</span>
            </a>
            <a href={`https://wa.me/${cleanPhone.replace("+", "")}`} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full group">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium">WhatsApp Message</span>
            </a>
            <a href={`sms:${cleanPhone}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full group">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-400/20 text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium">Send SMS</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Hero section ──────────────────────────────────────────────── */

function Hero() {
  const { portfolioData } = useAdmin();
  const h = portfolioData.hero;

  return (
    <section id="home" className="grid gap-8 px-6 pb-16 pt-6 md:grid-cols-12 md:px-14 md:pb-24">
      <div className="md:col-span-5 flex flex-col justify-center">
        <ScrollReveal variant="fade-right" duration={900}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-primary">
            Hey There,
            <br />
            I'm <span className="text-gradient">{h.name}</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={300}>
          <a
            href={`mailto:${h.email}`}
            className="mt-10 inline-block text-[var(--color-coral)] font-medium underline-offset-4 hover:underline transition-all duration-300 hover:tracking-wide"
          >
            {h.email}
          </a>
        </ScrollReveal>
      </div>

      <div className="md:col-span-4 flex items-center justify-center">
        <ScrollReveal variant="scale" duration={1000}>
          <div className="relative group" data-cursor="image">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-yellow)] to-[var(--color-coral)] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
            <img
              src={h.imageUrl || heroPortrait}
              alt={h.name}
              width={1024}
              height={1024}
              fetchPriority="high"
              decoding="sync"
              className="relative w-full max-w-md object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="md:col-span-3 flex flex-col justify-between gap-10">
        <ScrollReveal variant="fade-left" delay={400}>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed md:text-right">
            {h.tagline}
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={600}>
          <div className="flex flex-col items-end gap-3">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-border glass transition-all duration-500 hover:shadow-[0_0_24px_oklch(0.55_0.09_190_/_0.25)] hover:border-[var(--color-accent)]">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-wider text-primary text-right leading-tight">
              {h.degree}
              <br />
              AI & DATA SCIENCE
              <br />
              {h.college}
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="md:col-span-12 flex items-end justify-between border-t border-border pt-6">
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-gradient">{h.yearsLearning}</span>
            <div className="text-xs font-bold tracking-wider text-primary leading-tight">
              YEARS
              <br />
              LEARNING
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={400}>
          <div className="flex gap-4 items-center flex-wrap justify-end mt-4 md:mt-0">
            {h.resumeUrl && (
              <a
                href={h.resumeUrl}
                download="Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card/50 text-sm font-semibold transition-all duration-300 hover:bg-[var(--color-accent)] hover:text-white hover:border-transparent hover:scale-105 shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Resume</span>
              </a>
            )}
            <div className="hidden md:flex gap-3 text-primary">
              <a
                href={h.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={h.linkedinUrl}
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${h.email}`}
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

/* ─── Services / "What do I do?" ────────────────────────────────── */

function HelpSection() {
  const { portfolioData } = useAdmin();
  const { services, about } = portfolioData;

  return (
    <section
      id="services"
      className="grid gap-10 px-6 py-16 md:grid-cols-2 md:px-14 md:py-24 bg-[var(--color-card)]"
    >
      <ScrollReveal variant="fade-right" className="space-y-5" stagger={150}>
        {services.map(({ title, count }, idx) => {
          const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
          const color = SERVICE_COLORS[idx % SERVICE_COLORS.length];
          return (
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
          );
        })}
      </ScrollReveal>

      <div>
        <ScrollReveal variant="fade-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary">What do I do?</h2>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={200}>
          <p className="mt-6 text-muted-foreground leading-relaxed">{about.description1}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{about.description2}</p>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={400} className="mt-10 flex gap-12">
          <div className="group">
            <div className="text-5xl font-extrabold text-gradient transition-transform duration-300 group-hover:scale-110 origin-left">{about.projectCount}</div>
            <div className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground">MINI PROJECTS</div>
          </div>
          <div className="group">
            <div className="text-5xl font-extrabold text-gradient transition-transform duration-300 group-hover:scale-110 origin-left">{about.certCount}</div>
            <div className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground">CERTIFICATIONS</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Experience timeline ───────────────────────────────────────────── */

const timelineColors = [
  "var(--color-accent)",
  "var(--color-coral)",
  "var(--color-yellow)",
];

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  other: ExternalLink,
};

const LINK_COLORS: Record<string, string> = {
  linkedin: "#0a66c2",
  github: "#6e40c9",
  website: "var(--color-accent)",
  twitter: "#1d9bf0",
  instagram: "#e1306c",
  youtube: "#ff0000",
  other: "var(--color-coral)",
};

function TimelineLinkBadge({ type, url, label }: { type: string; url: string; label?: string }) {
  const Icon = LINK_ICONS[type] ?? ExternalLink;
  const color = LINK_COLORS[type] ?? "var(--color-accent)";
  const displayLabel = label || type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={displayLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "50px",
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        textDecoration: "none",
        background: `${color}18`,
        border: `1px solid ${color}55`,
        color: color,
        transition: "all 0.2s",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap" as const,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = `${color}30`;
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 12px ${color}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = `${color}18`;
        (e.currentTarget as HTMLAnchorElement).style.transform = "";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
      }}
    >
      <Icon className="h-3 w-3" />
      {displayLabel}
    </a>
  );
}

function Experience() {
  const { portfolioData } = useAdmin();
  const { timeline } = portfolioData;

  return (
    <section id="experience" className="px-6 py-16 md:px-14 md:py-24">
      <ScrollReveal variant="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-12">{portfolioData.sectionTitles?.timeline || "My Experience"}</h2>
      </ScrollReveal>
      <div className="space-y-12">
        {timeline.map((t, i) => (
          <ScrollReveal key={t.title + i} variant="fade-up" delay={i * 150}>
            <div className="glass rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-[0_12px_40px_-12px_oklch(0.55_0.09_190_/_0.15)] hover:translate-y-[-2px]">
              <div className="grid gap-6 md:grid-cols-12 md:gap-10">
                {/* Left column: title + sub */}
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold text-primary">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.sub}</p>
                </div>

                {/* Timeline dot */}
                <div className="md:col-span-1 hidden md:flex justify-center">
                  <div
                    className="mt-2 h-4 w-4 rounded-full border-2 border-dashed transition-all duration-500 hover:scale-150"
                    style={{ borderColor: timelineColors[i % timelineColors.length], background: "transparent" }}
                  >
                    <div
                      className="h-full w-full rounded-full"
                      style={{ background: timelineColors[i % timelineColors.length], transform: "scale(0.5)" }}
                    />
                  </div>
                </div>

                {/* Right column: role + body + links */}
                <div className="md:col-span-8 space-y-3">
                  <h4 className="text-xl font-bold text-primary">{t.role}</h4>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">{t.body}</p>

                  {/* Links row */}
                  {t.links && t.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {t.links.filter((l) => l.url).map((l, li) => (
                        <TimelineLinkBadge key={li} type={l.type} url={l.url} label={l.label} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Image row – full width below grid when image is present */}
              {t.image && (
                <div className="mt-6 overflow-hidden rounded-xl border border-border">
                  <img
                    src={t.image}
                    alt={t.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-h-72 object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Latest Works with glassmorphism cards ─────────────────────── */

const worksColors = [
  "var(--color-yellow)",
  "var(--color-accent)",
  "var(--color-coral)",
];

function LatestWorks() {
  const { portfolioData } = useAdmin();
  const { works, hero } = portfolioData;

  const preview = works.slice(0, 3);

  return (
    <section id="works" className="px-6 py-16 md:px-14 md:py-24 bg-[var(--color-card)]">
      <ScrollReveal variant="fade-up">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary">{portfolioData.sectionTitles?.works || "My Latest Works"}</h2>
            <p className="mt-3 text-muted-foreground">A peek at what I'm currently building.</p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/works"
              className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:gap-3"
            >
              View All <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5" />
            </Link>
            <a
              href={hero.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-coral)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:gap-3"
            >
              Explore More on GitHub <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={120} className="grid gap-6 md:grid-cols-3">
        {preview.map((w, i) => (
          <article
            key={w.title + i}
            className="rounded-2xl p-6 h-72 flex flex-col justify-between text-primary relative overflow-hidden group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.3)]"
            style={
              w.image
                ? { backgroundImage: `url(${w.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: worksColors[i % worksColors.length] }
            }
          >
            {/* Colour tint overlay – always visible; stronger when there's an image */}
            <div
              className="absolute inset-0 rounded-2xl transition-all duration-500"
              style={
                w.image
                  ? {
                      background: `linear-gradient(to bottom, ${worksColors[i % worksColors.length]}99 0%, ${worksColors[i % worksColors.length]}cc 60%, ${worksColors[i % worksColors.length]}f0 100%)`,
                    }
                  : {}
              }
            />
            <div className="absolute inset-0 bg-white/0 backdrop-blur-0 transition-all duration-500 group-hover:bg-white/10 group-hover:backdrop-blur-[2px] rounded-2xl" />
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-wider opacity-70">{w.tag}</p>
              <h3 className="mt-2 text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1">{w.title}</h3>
            </div>
            <div className="relative z-10 self-end">
              {w.link ? (
                <a href={w.link} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-card glass transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_oklch(0.55_0.09_190_/_0.3)]">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-card glass transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_oklch(0.55_0.09_190_/_0.3)]">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              )}
            </div>
          </article>
        ))}
      </ScrollReveal>

      <ScrollReveal variant="fade-up">
        <div className="mt-10 flex flex-col items-center gap-4 md:hidden">
          <Link
            to="/works"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full rounded-full bg-[var(--color-accent)] text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View All Works
          </Link>
          <a
            href={hero.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Explore More on GitHub
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ─── Moments Preview ───────────────────────────────────────────── */

const MOMENT_TAG_COLORS = [
  { bg: "rgba(99,102,241,0.18)", border: "rgba(99,102,241,0.5)", text: "#a5b4fc" },
  { bg: "rgba(236,72,153,0.18)", border: "rgba(236,72,153,0.5)", text: "#f9a8d4" },
  { bg: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.5)", text: "#86efac" },
  { bg: "rgba(251,146,60,0.18)", border: "rgba(251,146,60,0.5)", text: "#fdba74" },
  { bg: "rgba(14,165,233,0.18)", border: "rgba(14,165,233,0.5)", text: "#7dd3fc" },
];

function MomentTagBadge({ tag, idx }: { tag: string; idx: number }) {
  const c = MOMENT_TAG_COLORS[idx % MOMENT_TAG_COLORS.length];
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "50px",
        fontSize: "11px",
        fontWeight: 600,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap" as const,
      }}
    >
      {tag}
    </span>
  );
}

function MomentsPreview() {
  const { portfolioData } = useAdmin();
  const { moments } = portfolioData;

  return (
    <section id="moments" className="px-6 py-16 md:px-14 md:py-24">
      {/* Header */}
      <ScrollReveal variant="fade-up">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="h-5 w-5 text-[var(--color-accent)]" />
              <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">Gallery</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary">{portfolioData.sectionTitles?.moments || "My Moments"}</h2>
            <p className="mt-3 text-muted-foreground">Favourite memories, meetups and events captured.</p>
          </div>
          <Link
            to="/moments"
            className="hidden md:inline-flex items-center gap-2 text-[var(--color-coral)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:gap-3"
          >
            View All <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5" />
          </Link>
        </div>
      </ScrollReveal>

      {moments.length === 0 ? (
        /* Empty state */
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl glass text-center gap-4">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.12)",
                border: "1.5px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera className="h-8 w-8" style={{ color: "#a5b4fc" }} />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              No moments yet — check back soon for memories and meetups!
            </p>
            <Link
              to="/moments"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Camera className="h-4 w-4" /> Browse Moments
            </Link>
          </div>
        </ScrollReveal>
      ) : (
        /* Moment cards marquee */
        <div className="relative z-10 w-full overflow-hidden flex items-center py-4 -mx-6 md:-mx-14 px-6 md:px-14">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
          
          <ScrollReveal variant="fade-up" delay={100} className="w-full">
            <div className="moment-marquee-track">
              {[...moments, ...moments, ...moments, ...moments, ...moments, ...moments].map((moment, i) => {
            const coverImg = moment.images[moment.coverIndex] ?? moment.images[0];
            const formattedDate = moment.date
              ? new Date(moment.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <article
                key={`${moment.id}-${i}`}
                className="w-[320px] md:w-[350px] flex-shrink-0 rounded-2xl overflow-hidden glass transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.25)] group flex flex-col"
              >
                {/* Cover image or placeholder */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: 200 }}
                >
                  {coverImg ? (
                    <img
                      src={coverImg}
                      alt={moment.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: [
                          "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(14,165,233,0.18))",
                          "linear-gradient(135deg,rgba(236,72,153,0.25),rgba(251,146,60,0.18))",
                          "linear-gradient(135deg,rgba(34,197,94,0.25),rgba(250,204,21,0.18))",
                        ][i % 3],
                      }}
                    >
                      <Camera className="h-12 w-12 opacity-30 text-primary" />
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Tags */}
                  {moment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {moment.tags.slice(0, 3).map((tag, ti) => (
                        <MomentTagBadge key={tag} tag={tag} idx={ti} />
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-primary leading-snug group-hover:text-gradient transition-all duration-300">
                    {moment.title}
                  </h3>

                  {/* Description */}
                  {moment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{moment.description}</p>
                  )}

                  {/* Meta */}
                  <div className="mt-auto flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                    {formattedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                      </span>
                    )}
                    {moment.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {moment.location}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
            </div>
          </ScrollReveal>
        </div>
      )}

      <style>{`
        @keyframes marqueeScrollRightToLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .moment-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          /* Move right-to-left from 0% to -50% */
          animation: marqueeScrollRightToLeft 40s linear infinite;
        }
        .moment-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Mobile CTA */}
      <ScrollReveal variant="fade-up">
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/moments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Camera className="h-4 w-4" /> View All Moments
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ─── Testimonials with glassmorphism cards ──────────────────────── */

function Testimonials() {
  const { portfolioData } = useAdmin();
  const { testimonials } = portfolioData;

  return (
    <section id="notes" className="px-6 py-16 md:px-14 md:py-24 text-center">
      <ScrollReveal variant="fade-up">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary">{portfolioData.sectionTitles?.testimonials || "People talk about me"}</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Notes from mentors, peers, and teammates I've worked with along the way.
        </p>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={200} className="mt-12 grid gap-6 md:grid-cols-2 text-left">
        {testimonials.map((t, i) => (
          <div
            key={t.name + i}
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
  const { portfolioData } = useAdmin();
  const { hero, contact } = portfolioData;

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
              href={`mailto:${hero.email}`}
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
            <p>{contact.location}</p>
            <p>{hero.email}</p>
            <InteractivePhone variant="footer" />
            <div className="flex gap-3 md:justify-end pt-3">
              <a href={hero.githubUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]">
                <Github className="h-4 w-4" />
              </a>
              <a href={hero.linkedinUrl} className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={`mailto:${hero.email}`} className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-300 hover:bg-[var(--color-yellow)] hover:scale-110 hover:shadow-[0_0_16px_oklch(0.82_0.16_85_/_0.4)]">
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
  const { portfolioData } = useAdmin();
  const { hero } = portfolioData;

  return (
    <footer className="px-6 py-8 md:px-14 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-border">
      <div
        className="font-script text-2xl text-primary transition-transform duration-300 hover:scale-105"
        style={{ fontFamily: "Caveat, cursive" }}
      >
        {hero.name}
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} {hero.name} Kumar R. All rights reserved.
      </p>
    </footer>
  );
}
