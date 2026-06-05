import { useEffect, useRef, useCallback, useState } from "react";
import { useCursor, type CursorVariant } from "../hooks/use-cursor";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCENT = "oklch(0.55 0.09 190)";
const ACCENT_FILL = "oklch(0.55 0.09 190 / 0.12)";

const DOT_SIZE = 8;
const RING_SIZE = 36;
const LERP_FACTOR = 0.15;

const CLICKABLE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input[type='submit']",
  "[data-cursor='pointer']",
].join(",");

const IMAGE_SELECTOR = "img, [data-cursor='image']";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return (
    "ontouchstart" in window ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

// ─── Variant → style maps ────────────────────────────────────────────────────

function getDotStyle(variant: CursorVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    width: DOT_SIZE,
    height: DOT_SIZE,
    backgroundColor: ACCENT,
    borderRadius: "50%",
    transition: "width 0.3s cubic-bezier(.22,1,.36,1), height 0.3s cubic-bezier(.22,1,.36,1), background-color 0.3s ease, opacity 0.3s ease",
  };

  switch (variant) {
    case "hover":
      return { ...base, width: 5, height: 5 };
    case "image":
      return { ...base, width: 0, height: 0, opacity: 0 };
    case "hidden":
      return { ...base, opacity: 0, width: 0, height: 0 };
    default:
      return base;
  }
}

function getRingStyle(variant: CursorVariant): React.CSSProperties {
  const base: React.CSSProperties = {
    width: RING_SIZE,
    height: RING_SIZE,
    border: `1.5px solid ${ACCENT}`,
    borderRadius: "50%",
    backgroundColor: "transparent",
    transition:
      "width 0.4s cubic-bezier(.22,1,.36,1), height 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease",
  };

  switch (variant) {
    case "hover":
      return {
        ...base,
        width: RING_SIZE * 1.5,
        height: RING_SIZE * 1.5,
        borderColor: ACCENT,
        borderWidth: 2,
      };
    case "image":
      return {
        ...base,
        width: 64,
        height: 64,
        backgroundColor: ACCENT_FILL,
        borderColor: ACCENT,
        borderWidth: 1.5,
      };
    case "hidden":
      return { ...base, opacity: 0, width: 0, height: 0 };
    default:
      return base;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const { variant, setCursorVariant } = useCursor();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Mouse position tracked in a ref so we don't trigger re-renders every frame
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  // Track which variant was set by automatic hover detection
  // so we don't clobber programmatic overrides
  const autoVariant = useRef<CursorVariant>("default");

  const [isTouch, setIsTouch] = useState(true); // default hidden until we verify

  // ── Touch detection ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  // ── Mouse move listener ──────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    // Instantly position the dot (no delay)
    if (dotRef.current) {
      const dot = dotRef.current;
      const w = dot.offsetWidth;
      const h = dot.offsetHeight;
      dot.style.transform = `translate(${e.clientX - w / 2}px, ${e.clientY - h / 2}px)`;
    }
  }, []);

  // ── Hover detection via mouseover / mouseout on document ─────────────────
  const onMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(CLICKABLE_SELECTOR)) {
        autoVariant.current = "hover";
        setCursorVariant("hover");
      } else if (target.closest(IMAGE_SELECTOR)) {
        autoVariant.current = "image";
        setCursorVariant("image");
      }
    },
    [setCursorVariant],
  );

  const onMouseOut = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.closest(CLICKABLE_SELECTOR) ||
        target.closest(IMAGE_SELECTOR)
      ) {
        autoVariant.current = "default";
        setCursorVariant("default");
      }
    },
    [setCursorVariant],
  );

  // ── Hide cursor when mouse leaves viewport ──────────────────────────────
  const onMouseLeave = useCallback(() => {
    mouse.current = { x: -100, y: -100 };
    ringPos.current = { x: -100, y: -100 };
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(-100px, -100px)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(-100px, -100px)`;
    }
  }, []);

  // ── rAF loop for the trailing ring ───────────────────────────────────────
  const animate = useCallback(() => {
    const { x: mx, y: my } = mouse.current;
    const rp = ringPos.current;

    rp.x = lerp(rp.x, mx, LERP_FACTOR);
    rp.y = lerp(rp.y, my, LERP_FACTOR);

    if (ringRef.current) {
      const ring = ringRef.current;
      const w = ring.offsetWidth;
      const h = ring.offsetHeight;
      ring.style.transform = `translate(${rp.x - w / 2}px, ${rp.y - h / 2}px)`;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  // ── Set up & tear down ───────────────────────────────────────────────────
  useEffect(() => {
    if (isTouch) return;

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [isTouch, onMouseMove, onMouseOver, onMouseOut, onMouseLeave, animate]);

  // ── Inject global cursor:none ────────────────────────────────────────────
  useEffect(() => {
    if (isTouch) return;

    const style = document.createElement("style");
    style.setAttribute("data-custom-cursor", "");
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [isTouch]);

  // Don't render on touch devices
  if (isTouch) return null;

  const dotStyle = getDotStyle(variant);
  const ringStyle = getRingStyle(variant);

  return (
    <>
      {/* Inner dot — follows mouse exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{
          ...dotStyle,
          transform: "translate(-100px, -100px)",
        }}
        aria-hidden="true"
      />

      {/* Outer ring — trails with lerp */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{
          ...ringStyle,
          transform: "translate(-100px, -100px)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
