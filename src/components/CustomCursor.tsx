import { useEffect, useRef, useCallback, useState } from "react";
import { useCursor, type CursorVariant } from "../hooks/use-cursor";
import { useAdmin } from "../hooks/use-admin";

// ─── Constants ───────────────────────────────────────────────────────────────

const CLICKABLE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input[type='submit']",
  "[data-cursor='pointer']",
].join(",");

const IMAGE_SELECTOR = "img, [data-cursor='image']";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return (
    "ontouchstart" in window ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const { variant, setCursorVariant } = useCursor();
  const { portfolioData } = useAdmin();
  const cursorRef = useRef<HTMLDivElement>(null);

  const [isTouch, setIsTouch] = useState(true);

  // ── Touch detection ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  // ── Mouse move listener ──────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    // Instantly position the cursor without delay
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  }, []);

  // ── Hover detection via mouseover / mouseout on document ─────────────────
  const onMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(CLICKABLE_SELECTOR)) {
        setCursorVariant("hover");
      } else if (target.closest(IMAGE_SELECTOR)) {
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
        setCursorVariant("default");
      }
    },
    [setCursorVariant],
  );

  // ── Set up & tear down ───────────────────────────────────────────────────
  useEffect(() => {
    if (isTouch) return;

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isTouch, onMouseMove, onMouseOver, onMouseOut]);

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

  // ─── Style logic from admin panel ──────────────────────────────────────────
  const config = portfolioData?.cursorConfig || {
    type: "circle",
    size: 24,
    opacity: 0.3,
    color: "#7c3aed",
    backdropBlur: 2,
    imageUrl: "",
    customCode: "",
  };

  if (config.type === "custom_code") {
    return (
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none will-change-transform"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: config.customCode }}
      />
    );
  }

  let size = config.size;
  let bg = config.color;
  let opacity = config.opacity;
  let border = "none";
  let backdropFilter = `blur(${config.backdropBlur}px)`;
  let borderRadius = config.type === "square" ? "4px" : "50%";

  if (variant === "hover") {
    size = config.size * 1.5;
    opacity = Math.max(0.1, config.opacity - 0.1);
    backdropFilter = `blur(${config.backdropBlur * 2}px)`;
  } else if (variant === "image") {
    size = config.size * 2;
    opacity = Math.max(0.05, config.opacity - 0.15);
    backdropFilter = `blur(${config.backdropBlur * 3}px)`;
  } else if (variant === "hidden") {
    opacity = 0;
    size = 0;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[99999] pointer-events-none will-change-transform flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        marginTop: -size / 2,
        marginLeft: -size / 2,
        backgroundColor: config.type === "image" ? "transparent" : bg,
        opacity: opacity,
        borderRadius: borderRadius,
        backdropFilter: config.type === "image" ? "none" : backdropFilter,
        transition: "width 0.2s ease-out, height 0.2s ease-out, margin 0.2s ease-out, opacity 0.2s ease, backdrop-filter 0.2s ease, border-radius 0.2s ease",
      }}
      aria-hidden="true"
    >
      {config.type === "image" && config.imageUrl && (
        <img src={config.imageUrl} alt="cursor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </div>
  );
}
