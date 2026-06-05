import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/* ─── Skill data ─────────────────────────────────────────────────── */

type SkillSize = "large" | "medium" | "small";
type SkillColor = "accent" | "coral" | "yellow";

interface Skill {
  name: string;
  size: SkillSize;
  color: SkillColor;
}

const skills: Skill[] = [
  { name: "Python", size: "large", color: "accent" },
  { name: "Linux", size: "large", color: "coral" },
  { name: "Machine Learning", size: "large", color: "yellow" },
  { name: "Cybersecurity", size: "medium", color: "accent" },
  { name: "C/C++", size: "medium", color: "coral" },
  { name: "JavaScript", size: "medium", color: "yellow" },
  { name: "SQL", size: "small", color: "accent" },
  { name: "Git", size: "small", color: "coral" },
  { name: "Docker", size: "small", color: "yellow" },
  { name: "TensorFlow", size: "small", color: "accent" },
  { name: "React", size: "small", color: "coral" },
  { name: "Bash", size: "medium", color: "yellow" },
];

/* ─── Constants & helpers ────────────────────────────────────────── */

const sizeMap: Record<SkillSize, number> = { large: 120, medium: 90, small: 70 };

const colorMap: Record<SkillColor, { solid: string; glow: string }> = {
  accent: {
    solid: "oklch(0.55 0.09 190)",
    glow: "oklch(0.55 0.09 190 / 0.45)",
  },
  coral: {
    solid: "oklch(0.68 0.19 35)",
    glow: "oklch(0.68 0.19 35 / 0.45)",
  },
  yellow: {
    solid: "oklch(0.82 0.16 85)",
    glow: "oklch(0.82 0.16 85 / 0.45)",
  },
};

const fontSizeMap: Record<SkillSize, string> = {
  large: "0.8rem",
  medium: "0.7rem",
  small: "0.6rem",
};

/** Deterministic pseudo‑random offsets seeded by index */
function offsets(i: number) {
  const seed = ((i * 7 + 3) % 12) / 12; // 0‑1 range
  return {
    marginTop: Math.round(seed * 28 - 8),       // -8 to 20
    marginLeft: Math.round(((seed * 11) % 1) * 16 - 4), // -4 to 12
    animDelay: +(seed * -6).toFixed(2),           // stagger phase
    animDuration: +(5 + seed * 4).toFixed(2),     // 5s–9s
  };
}

/* ─── Constellation canvas ───────────────────────────────────────── */

function useConstellation(
  containerRef: React.RefObject<HTMLDivElement | null>,
  bubbleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Gather bubble centres
    const centres: { x: number; y: number }[] = [];
    for (const el of bubbleRefs.current) {
      if (!el) continue;
      const b = el.getBoundingClientRect();
      centres.push({
        x: b.left - rect.left + b.width / 2,
        y: b.top - rect.top + b.height / 2,
      });
    }

    // Draw faint lines between nearby bubbles
    const maxDist = 220;
    ctx.lineWidth = 1;
    for (let i = 0; i < centres.length; i++) {
      for (let j = i + 1; j < centres.length; j++) {
        const dx = centres[i].x - centres[j].x;
        const dy = centres[i].y - centres[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = ((1 - dist / maxDist) * 0.18).toFixed(3);
          ctx.strokeStyle = `oklch(0.55 0.09 190 / ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(centres[i].x, centres[i].y);
          ctx.lineTo(centres[j].x, centres[j].y);
          ctx.stroke();
        }
      }
    }
  }, [containerRef, bubbleRefs]);

  useEffect(() => {
    draw();
    const id = setInterval(draw, 120); // redraw to follow floating
    window.addEventListener("resize", draw);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", draw);
    };
  }, [draw]);

  return canvasRef;
}

/* ─── Bubble component ───────────────────────────────────────────── */

interface BubbleProps {
  skill: Skill;
  index: number;
  hovered: number | null;
  onHover: (i: number | null) => void;
  refCb: (el: HTMLDivElement | null) => void;
}

function Bubble({ skill, index, hovered, onHover, refCb }: BubbleProps) {
  const px = sizeMap[skill.size];
  const { solid, glow } = colorMap[skill.color];
  const o = offsets(index);
  const isHovered = hovered === index;

  return (
    <div
      ref={refCb}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "relative grid place-items-center rounded-full cursor-pointer select-none",
        "glass transition-all duration-300 ease-out",
      )}
      style={{
        width: px,
        height: px,
        marginTop: o.marginTop,
        marginLeft: o.marginLeft,
        fontSize: fontSizeMap[skill.size],
        borderColor: isHovered ? solid : undefined,
        borderWidth: isHovered ? 2 : 1,
        boxShadow: isHovered
          ? `0 0 24px 6px ${glow}, inset 0 0 18px 2px ${glow}`
          : `0 0 0 0 transparent`,
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        animation: `float ${o.animDuration}s ease-in-out ${o.animDelay}s infinite`,
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {/* colour‑tinted ring behind the text */}
      <span
        className="absolute inset-[6px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${solid} 0%, transparent 70%)` }}
      />

      <span
        className="relative z-[2] font-semibold text-center leading-tight px-1 text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {skill.name}
      </span>

      {/* Tooltip on hover */}
      {isHovered && (
        <span
          className={cn(
            "absolute -bottom-9 whitespace-nowrap rounded-lg px-3 py-1",
            "text-xs font-medium text-primary-foreground",
            "animate-in fade-in-0 zoom-in-95 duration-200",
          )}
          style={{ background: solid }}
        >
          {skill.size === "large"
            ? "Core Skill"
            : skill.size === "medium"
              ? "Proficient"
              : "Familiar"}
        </span>
      )}
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────────── */

export default function SkillsBubbles() {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const canvasRef = useConstellation(containerRef, bubbleRefs);

  return (
    <section id="skills" className="px-6 py-16 md:px-14 md:py-24">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary">
          Skills &amp; Tools
        </h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          The technologies I work with every day — hover to explore.
        </p>
      </div>

      {/* Bubbles container */}
      <div
        ref={containerRef}
        className="relative flex flex-wrap items-center justify-center gap-5 md:gap-7 max-w-3xl mx-auto py-8"
      >
        {/* Constellation canvas sits behind bubbles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        />

        {skills.map((skill, i) => (
          <Bubble
            key={skill.name}
            skill={skill}
            index={i}
            hovered={hovered}
            onHover={setHovered}
            refCb={(el) => {
              bubbleRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mt-10 text-xs text-muted-foreground font-medium">
        {(["large", "medium", "small"] as const).map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span
              className="inline-block rounded-full border border-border"
              style={{
                width: s === "large" ? 14 : s === "medium" ? 10 : 7,
                height: s === "large" ? 14 : s === "medium" ? 10 : 7,
              }}
            />
            {s === "large" ? "Core" : s === "medium" ? "Proficient" : "Familiar"}
          </span>
        ))}
      </div>
    </section>
  );
}
