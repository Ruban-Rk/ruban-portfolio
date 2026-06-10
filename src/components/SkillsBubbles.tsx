import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAdmin } from "@/hooks/use-admin";
import type { SkillItem } from "@/hooks/use-admin";
import { useTheme } from "@/hooks/use-theme";
import { ScrollReveal } from "@/components/ScrollReveal";

/* ─── Skill type re-exported from hook ────────────────────────────── */

type Skill = SkillItem;

function getCategoryMeta(
  isDark: boolean,
): Record<string, { label: string; color: string; glow: string }> {
  return {
    language: {
      label: "Language",
      color: isDark ? "#a855f7" : "#7e22ce",
      glow: isDark ? "rgba(168,85,247,0.5)" : "rgba(126,34,206,0.3)",
    },
    libraries: {
      label: "Libraries & Frameworks",
      color: isDark ? "#06b6d4" : "#0284c7",
      glow: isDark ? "rgba(6,182,212,0.5)" : "rgba(2,132,199,0.3)",
    },
    tools: {
      label: "Tools & Platforms",
      color: isDark ? "#f59e0b" : "#d97706",
      glow: isDark ? "rgba(245,158,11,0.5)" : "rgba(217,119,6,0.3)",
    },
    databases: {
      label: "Databases",
      color: isDark ? "#10b981" : "#059669",
      glow: isDark ? "rgba(16,185,129,0.5)" : "rgba(5,150,105,0.3)",
    },
    security: {
      label: "Security",
      color: isDark ? "#ef4444" : "#dc2626",
      glow: isDark ? "rgba(239,68,68,0.5)" : "rgba(220,38,38,0.3)",
    },
  };
}

/* ─── Physics orb state ──────────────────────────────────────────── */

interface OrbState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  skill: Skill;
  index: number;
  phase: number; // for sin oscillation
  image?: HTMLImageElement;
}

/* ─── Particle burst ─────────────────────────────────────────────── */

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1
  color: string;
  size: number;
  text?: string;
}

/* ─── Floating score popup ───────────────────────────────────────── */

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

/* ─── XP rank thresholds ─────────────────────────────────────────── */

function getRanks(isDark: boolean) {
  return [
    { min: 0, label: "Rookie", color: isDark ? "#94a3b8" : "#475569" },
    { min: 200, label: "Hacker", color: isDark ? "#06b6d4" : "#0284c7" },
    { min: 500, label: "Engineer", color: isDark ? "#a855f7" : "#7e22ce" },
    { min: 900, label: "Architect", color: isDark ? "#f59e0b" : "#d97706" },
    { min: 1400, label: "Wizard", color: isDark ? "#ef4444" : "#dc2626" },
    { min: 2000, label: "Legend", color: isDark ? "#fbbf24" : "#b45309" },
  ];
}

function getRank(xp: number, isDark: boolean) {
  const ranks = getRanks(isDark);
  return [...ranks].reverse().find((r) => xp >= r.min) ?? ranks[0];
}

/* ─── Canvas renderer ────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, mn: number, mx: number) {
  return Math.max(mn, Math.min(mx, v));
}

/* ─── Main component ─────────────────────────────────────────────── */

export default function SkillsBubbles() {
  const { portfolioData } = useAdmin();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeRef = useRef(isDark);

  useEffect(() => {
    themeRef.current = isDark;
  }, [isDark]);

  const skillsRef = useRef<Skill[]>(portfolioData.skills);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<OrbState[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hoveredRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const pidRef = useRef(0);

  const [totalXP, setTotalXP] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [showHint, setShowHint] = useState(true);

  /* ── init orbs ── */
  const initOrbs = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const skills = skillsRef.current;
    // grid-ish placement with jitter
    const cols = Math.ceil(Math.sqrt(skills.length * 1.5));
    const cellW = W / cols;
    const cellH = H / Math.ceil(skills.length / cols);

    orbsRef.current = skills.map((skill, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const r =
        skill.category === "libraries"
          ? 54
          : skill.category === "language"
            ? 48
            : skill.category === "security"
              ? 46
              : skill.category === "databases"
                ? 45
                : 44;
      const bx = clamp(
        cellW * col + cellW / 2 + (Math.random() - 0.5) * cellW * 0.4,
        r + 4,
        W - r - 4,
      );
      const by = clamp(
        cellH * row + cellH / 2 + (Math.random() - 0.5) * cellH * 0.4,
        r + 4,
        H - r - 4,
      );
      const orb: OrbState = {
        x: bx,
        y: by,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseX: bx,
        baseY: by,
        radius: r,
        skill,
        index: i,
        phase: Math.random() * Math.PI * 2,
      };

      if (skill.iconUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = skill.iconUrl;
        orb.image = img;
      }

      return orb;
    });
  }, []);

  // Keep skillsRef in sync with live admin data and reinit orbs
  useEffect(() => {
    skillsRef.current = portfolioData.skills;
    initOrbs();
  }, [portfolioData.skills, initOrbs]);

  /* ── spawn particles ── */
  const spawnBurst = useCallback((x: number, y: number, color: string, count = 18) => {
    for (let k = 0; k < count; k++) {
      const angle = (Math.PI * 2 * k) / count + Math.random() * 0.4;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        id: pidRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 5,
      });
    }
    // XP text burst
    for (let k = 0; k < 4; k++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      particlesRef.current.push({
        id: pidRef.current++,
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: Math.cos(angle) * (1 + Math.random()),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1,
        color,
        size: 0,
        text: "+XP",
      });
    }
  }, []);

  /* ── animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull = canvas.getContext("2d");
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    let W = 0,
      H = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initOrbs();
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    function tick() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      const orbs = orbsRef.current;
      const mouse = mouseRef.current;
      const hovIdx = hoveredRef.current;

      /* ── draw constellation lines ── */
      const MAX_LINK = 160;
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK) {
            const alpha = (1 - dist / MAX_LINK) * 0.12;
            const isChain = hovIdx === i || hovIdx === j;
            const chainAlpha = isChain ? (1 - dist / MAX_LINK) * 0.55 : alpha;
            const catColor = getCategoryMeta(themeRef.current)[orbs[i].skill.category].color;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            if (isChain) {
              ctx.strokeStyle = catColor;
              ctx.globalAlpha = chainAlpha;
              ctx.lineWidth = 1.5;
              ctx.shadowColor = catColor;
              ctx.shadowBlur = 8;
            } else {
              ctx.strokeStyle = themeRef.current ? "#7dd3fc" : "#0284c7";
              ctx.globalAlpha = chainAlpha;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      /* ── update + draw orbs ── */
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];

        // Gentle oscillation towards base
        const oscX = o.baseX + Math.sin(t * 0.7 + o.phase) * 18;
        const oscY = o.baseY + Math.cos(t * 0.55 + o.phase * 1.3) * 14;
        o.vx += (oscX - o.x) * 0.004;
        o.vy += (oscY - o.y) * 0.004;

        // Mouse repulsion
        const mdx = o.x - mouse.x;
        const mdy = o.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const repulse = 120;
        if (mdist < repulse && mdist > 0) {
          const force = ((repulse - mdist) / repulse) * 2.5;
          o.vx += (mdx / mdist) * force;
          o.vy += (mdy / mdist) * force;
        }

        // Orb-orb separation
        for (let j = i + 1; j < orbs.length; j++) {
          const b = orbs[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = o.radius + b.radius + 8;
          if (dist < minDist && dist > 0) {
            const push = ((minDist - dist) / minDist) * 0.7;
            o.vx += (dx / dist) * push;
            o.vy += (dy / dist) * push;
            b.vx -= (dx / dist) * push;
            b.vy -= (dy / dist) * push;
          }
        }

        // Damping
        o.vx *= 0.88;
        o.vy *= 0.88;

        o.x += o.vx;
        o.y += o.vy;

        // Boundary bounce
        if (o.x < o.radius) {
          o.x = o.radius;
          o.vx *= -0.5;
        }
        if (o.x > W - o.radius) {
          o.x = W - o.radius;
          o.vx *= -0.5;
        }
        if (o.y < o.radius) {
          o.y = o.radius;
          o.vy *= -0.5;
        }
        if (o.y > H - o.radius) {
          o.y = H - o.radius;
          o.vy *= -0.5;
        }

        const meta = getCategoryMeta(themeRef.current)[o.skill.category];
        const isHov = hovIdx === i;
        const scale = isHov ? 1.18 : 1;
        const r = o.radius * scale;

        ctx.save();

        /* outer glow ring */
        if (isHov) {
          const grad = ctx.createRadialGradient(o.x, o.y, r * 0.6, o.x, o.y, r * 1.6);
          grad.addColorStop(0, meta.glow);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(o.x, o.y, r * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        /* orbiting ring (hovered) */
        if (isHov) {
          ctx.save();
          ctx.translate(o.x, o.y);
          ctx.rotate(t * 2.2);
          ctx.strokeStyle = meta.color;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          ctx.save();
          ctx.translate(o.x, o.y);
          ctx.rotate(-t * 1.4);
          ctx.strokeStyle = meta.color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 14]);
          ctx.beginPath();
          ctx.arc(0, 0, r + 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        /* base circle */
        const bgGrad = ctx.createRadialGradient(o.x - r * 0.25, o.y - r * 0.25, 0, o.x, o.y, r);
        bgGrad.addColorStop(
          0,
          isHov
            ? meta.color + (themeRef.current ? "55" : "33")
            : meta.color + (themeRef.current ? "22" : "11"),
        );
        bgGrad.addColorStop(
          0.7,
          isHov
            ? meta.color + (themeRef.current ? "33" : "11")
            : meta.color + (themeRef.current ? "0f" : "05"),
        );
        bgGrad.addColorStop(1, "transparent");

        // backdrop
        ctx.beginPath();
        ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
        ctx.fillStyle = themeRef.current ? "rgba(15,15,30,0.55)" : "rgba(245,245,250,0.85)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
        ctx.fillStyle = bgGrad;
        ctx.fill();

        /* border */
        ctx.beginPath();
        ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = isHov ? meta.color : meta.color + "66";
        ctx.lineWidth = isHov ? 2.5 : 1.5;
        if (isHov) {
          ctx.shadowColor = meta.color;
          ctx.shadowBlur = 18;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* glass shimmer */
        const shimmerGrad = ctx.createLinearGradient(
          o.x - r,
          o.y - r,
          o.x + r * 0.4,
          o.y + r * 0.4,
        );
        shimmerGrad.addColorStop(
          0,
          themeRef.current ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.6)",
        );
        shimmerGrad.addColorStop(
          0.5,
          themeRef.current ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.2)",
        );
        shimmerGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(o.x, o.y, r * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = shimmerGrad;
        ctx.fill();

        /* icon */
        ctx.font = `600 ${isHov ? 14 : 12}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = themeRef.current ? "#ffffff" : "#0f172a";
        ctx.fillText(o.skill.name, o.x, o.y + 12);

        if (o.image && o.image.complete && o.image.naturalHeight !== 0) {
          const imgSize = isHov ? 32 : 26;
          ctx.drawImage(o.image, o.x - imgSize / 2, o.y - r * 0.18 - imgSize / 2, imgSize, imgSize);
        } else {
          ctx.font = `${isHov ? 26 : 22}px sans-serif`;
          ctx.fillText(o.skill.icon, o.x, o.y - r * 0.18);
        }

        /* level bar (hovered) */
        if (isHov) {
          const bw = r * 1.2;
          const bh = 5;
          const bx = o.x - bw / 2;
          const by = o.y + r + 10;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 3);
          ctx.fillStyle = themeRef.current ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)";
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(bx, by, bw * (o.skill.level / 100), bh, 3);
          ctx.fillStyle = meta.color;
          ctx.shadowColor = meta.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          // label
          ctx.font = "600 10px Inter, sans-serif";
          ctx.fillStyle = themeRef.current ? "#e2e8f0" : "#475569";
          ctx.textAlign = "center";
          ctx.fillText("Proficiency", bx + bw / 2, by + bh + 14);
        }

        ctx.restore();
      }

      /* ── update particles ── */
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.01);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life -= 0.03;

        ctx.save();
        ctx.globalAlpha = p.life;

        if (p.text) {
          ctx.font = `bold 13px "Inter", sans-serif`;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.textAlign = "center";
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
        }
        ctx.restore();
      }

      /* ── scanlines overlay (subtle) ── */
      ctx.save();
      ctx.globalAlpha = 0.025;
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, y, W, 2);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initOrbs]);

  /* ── mouse tracking ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    // hit-test orbs
    let found: number | null = null;
    for (const o of orbsRef.current) {
      const dx = o.x - mx;
      const dy = o.y - my;
      if (Math.sqrt(dx * dx + dy * dy) < o.radius * 1.1) {
        found = o.index;
        break;
      }
    }
    hoveredRef.current = found;
    setHovered(found);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    hoveredRef.current = null;
    setHovered(null);
  }, []);

  /* ── click to explode ── */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const o of orbsRef.current) {
        const dx = o.x - mx;
        const dy = o.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < o.radius) {
          const meta = getCategoryMeta(themeRef.current)[o.skill.category];
          spawnBurst(o.x, o.y, meta.color);

          // Knockback velocity
          o.vx += (Math.random() - 0.5) * 8;
          o.vy += (Math.random() - 0.5) * 8;

          // Score popup
          const pid = pidRef.current++;
          setPopups((prev) => [
            ...prev,
            {
              id: pid,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top - 20,
              text: `+${o.skill.xp} XP`,
              color: meta.color,
            },
          ]);
          setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== pid)), 1100);

          setTotalXP((prev) => prev + o.skill.xp);
          setShowHint(false);
          break;
        }
      }
    },
    [spawnBurst],
  );

  /* ── cursor style ── */
  const [cursor, setCursor] = useState("default");
  useEffect(() => {
    setCursor(hovered !== null ? "pointer" : "default");
  }, [hovered]);

  const rank = getRank(totalXP, isDark);
  const hoveredSkill = hovered !== null ? skillsRef.current[hovered] : null;
  const currentCatMeta = getCategoryMeta(isDark);
  const hovMeta = hoveredSkill ? currentCatMeta[hoveredSkill.category] : null;

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden">
      {/* Background blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          opacity: 0.08,
          filter: "blur(60px)",
        }}
      />

      {/* Heading */}
      <ScrollReveal variant="fade-up" delay={100}>
        <div style={{ textAlign: "center", marginBottom: "20px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              background: "color-mix(in srgb, var(--color-cyan) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-cyan) 25%, transparent)",
              borderRadius: "50px",
              padding: "4px 16px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--color-cyan)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              🎮 INTERACTIVE SKILL TREE
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem,5vw,3.2rem)",
              fontWeight: 800,
              margin: 0,
              background:
                "linear-gradient(135deg, var(--color-cyan) 0%, var(--color-accent) 50%, var(--color-yellow) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {portfolioData.sectionTitles?.skills || "Skills & Tools"}
          </h2>
          <p
            style={{
              marginTop: "8px",
              color: "var(--muted-foreground)",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Hover to explore · Click to collect XP
          </p>
        </div>
      </ScrollReveal>

      {/* HUD bar */}
      <ScrollReveal variant="fade-up" delay={200}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "720px",
            margin: "0 auto 16px",
            padding: "10px 20px",
            background: "color-mix(in srgb, var(--color-cyan) 6%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-cyan) 15%, transparent)",
            borderRadius: "12px",
            position: "relative",
            zIndex: 2,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* rank badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: rank.color,
                textShadow: `0 0 12px ${rank.color}`,
              }}
            >
              ◆ {rank.label.toUpperCase()}
            </span>
          </div>

          {/* XP bar */}
          <div
            style={{
              flex: 1,
              margin: "0 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <div
              style={{ fontSize: "11px", color: isDark ? "#94a3b8" : "#475569", fontWeight: 600 }}
            >
              {totalXP} XP collected
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              {(() => {
                const ranks = getRanks(isDark);
                const rankIdx = ranks.findIndex((r) => r.label === rank.label);
                const nextRank = ranks[rankIdx + 1];
                const pct = nextRank
                  ? ((totalXP - rank.min) / (nextRank.min - rank.min)) * 100
                  : 100;
                return (
                  <div
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${rank.color}, ${ranks[Math.min(rankIdx + 1, ranks.length - 1)].color})`,
                      transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: `0 0 8px ${rank.color}`,
                      borderRadius: "3px",
                    }}
                  />
                );
              })()}
            </div>
          </div>

          {/* legend dots */}
          <div style={{ display: "flex", gap: "10px" }}>
            {Object.entries(currentCatMeta).map(([key, m]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: m.color,
                    boxShadow: `0 0 6px ${m.color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: isDark ? "#94a3b8" : "#475569",
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Canvas */}
      <ScrollReveal variant="scale" delay={300} duration={800}>
        <div
          ref={containerRef}
          style={{ position: "relative", maxWidth: "720px", margin: "0 auto", zIndex: 2 }}
        >
          <canvas
            ref={canvasRef}
            width={720}
            height={460}
            style={{
              width: "100%",
              height: "clamp(340px, 50vw, 460px)",
              cursor,
              borderRadius: "20px",
              background:
                "linear-gradient(145deg, rgba(6,182,212,0.04) 0%, rgba(168,85,247,0.04) 50%, rgba(15,23,42,0.0) 100%)",
              border: "1px solid rgba(6,182,212,0.12)",
              display: "block",
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => {
              // Prevent scrolling when interacting with canvas on touch devices
              if (e.cancelable) e.preventDefault();
            }}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Score popups (DOM layer) */}
          {popups.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                pointerEvents: "none",
                zIndex: 99,
                color: p.color,
                fontWeight: 800,
                fontSize: "15px",
                fontFamily: "Inter, sans-serif",
                textShadow: `0 0 12px ${p.color}`,
                animation: "skillXpFloat 1.1s ease-out forwards",
              }}
            >
              {p.text}
            </div>
          ))}

          {/* Hint */}
          {showHint && (
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.25)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "11px",
                color: "#7dd3fc",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                animation: "skillPulseHint 2s ease-in-out infinite",
              }}
            >
              👆 Click any skill to earn XP!
            </div>
          )}
        </div>

        {/* Skill detail tooltip panel (wrapped in fixed height container to prevent layout shifts) */}
        <div
          style={{
            minHeight: "84px",
            maxWidth: "720px",
            margin: "14px auto 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {hoveredSkill && hovMeta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 20px",
                background: `linear-gradient(135deg, ${hovMeta.color}18 0%, rgba(15,23,42,0.6) 100%)`,
                border: `1px solid ${hovMeta.color}44`,
                borderRadius: "12px",
                backdropFilter: "blur(12px)",
                animation: "skillFadeIn 0.2s ease",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <span style={{ fontSize: "28px" }}>{hoveredSkill.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {hoveredSkill.name}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "2px 8px",
                      borderRadius: "50px",
                      background: `${hovMeta.color}22`,
                      border: `1px solid ${hovMeta.color}55`,
                      color: hovMeta.color,
                    }}
                  >
                    {hovMeta.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${hoveredSkill.level}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${hovMeta.color}, ${hovMeta.color}bb)`,
                        boxShadow: `0 0 6px ${hovMeta.color}`,
                        borderRadius: "2px",
                        transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: hovMeta.color,
                      minWidth: "36px",
                    }}
                  >
                    {hoveredSkill.level}%
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  CLICK TO EARN
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: hovMeta.color }}>
                  +{hoveredSkill.xp} XP
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Static Skills List for clear view */}
      <ScrollReveal variant="fade-up" delay={400}>
        <div className="max-w-[1000px] mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 px-4">
          {(["language", "libraries", "tools", "databases", "security"] as const).map((catKey) => {
            const meta = currentCatMeta[catKey];
            const catSkills = skillsRef.current.filter((s) => s.category === catKey);

            if (catSkills.length === 0) return null;

            return (
              <div
                key={catKey}
                className="glass p-6 rounded-2xl border border-border/50 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                style={{ "--hover-color": meta.color } as React.CSSProperties}
              >
                <div
                  style={{ color: meta.color }}
                  className="text-[11px] font-bold tracking-wider uppercase mb-5 flex items-center gap-2"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                  />
                  {meta.label}
                </div>

                <div className="flex flex-col gap-4">
                  {catSkills
                    .sort((a, b) => b.level - a.level)
                    .map((s, i) => (
                      <div key={i} className="flex items-center gap-3 group/skill">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-background/50 flex items-center justify-center text-lg border border-border/50 group-hover/skill:scale-110 transition-all duration-300 shadow-sm">
                          {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="text-sm font-semibold text-primary truncate pr-2">
                              {s.name}
                            </div>
                            <div
                              className="text-[10px] font-bold opacity-60"
                              style={{ color: meta.color }}
                            >
                              {s.level}%
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000 origin-left scale-x-0 group-hover/skill:scale-x-100"
                              style={{
                                width: `${s.level}%`,
                                background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
                                transform: "scaleX(1)", // Start expanded
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* CSS animations */}
      <style>{`
        @keyframes skillXpFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateY(-40px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.8); }
        }
        @keyframes skillFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skillPulseHint {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.04); }
        }
      `}</style>
    </section>
  );
}
