import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  Children,
  cloneElement,
  isValidElement,
} from "react";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur";

export interface ScrollRevealProps {
  /** Animation variant (default: 'fade-up') */
  variant?: ScrollRevealVariant;
  /** Delay in ms before animation starts (default: 0) */
  delay?: number;
  /** Animation duration in ms (default: 700) */
  duration?: number;
  /** IntersectionObserver threshold 0–1 (default: 0.1) */
  threshold?: number;
  /** If true, animate only on first intersection (default: true) */
  once?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Content to reveal */
  children: ReactNode;
  /** HTML element to render (default: 'div') */
  as?: ElementType;
  /** Stagger delay increment (ms) applied to each direct child */
  stagger?: number;
}

// ────────────────────────────────────────────
// Helpers — initial & visible styles per variant
// ────────────────────────────────────────────

const INITIAL_STYLES: Record<ScrollRevealVariant, CSSProperties> = {
  "fade-up": { opacity: 0, transform: "translateY(30px)" },
  "fade-down": { opacity: 0, transform: "translateY(-30px)" },
  "fade-left": { opacity: 0, transform: "translateX(-30px)" },
  "fade-right": { opacity: 0, transform: "translateX(30px)" },
  scale: { opacity: 0, transform: "scale(0.95)" },
  blur: { opacity: 0, filter: "blur(8px)" },
};

const VISIBLE_STYLES: Record<ScrollRevealVariant, CSSProperties> = {
  "fade-up": { opacity: 1, transform: "translateY(0)" },
  "fade-down": { opacity: 1, transform: "translateY(0)" },
  "fade-left": { opacity: 1, transform: "translateX(0)" },
  "fade-right": { opacity: 1, transform: "translateX(0)" },
  scale: { opacity: 1, transform: "scale(1)" },
  blur: { opacity: 1, filter: "blur(0px)" },
};

function buildTransitionProperty(variant: ScrollRevealVariant): string {
  const base = "opacity, transform";
  return variant === "blur" ? "opacity, filter" : base;
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

export function ScrollReveal({
  variant = "fade-up",
  delay = 0,
  duration = 600, // Faster default duration
  threshold = 0.05, // Trigger sooner (5% visible instead of 10%)
  once = false,
  className = "",
  children,
  as: Tag = "div",
  stagger,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin: "0px 0px -20px 0px" // Trigger slightly before it hits the very bottom of viewport
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  // ── Stagger mode: wrap each direct child in its own reveal ──
  if (typeof stagger === "number" && stagger > 0) {
    const kids = Children.toArray(children);

    return (
      <Tag ref={ref} className={className}>
        {kids.map((child, i) => {
          const childDelay = delay + i * stagger;
          const transitionStyle: CSSProperties = {
            willChange: "transform, opacity",
            transitionProperty: buildTransitionProperty(variant),
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", // Super smooth snappy easeOutQuint
            transitionDelay: `${childDelay}ms`,
            ...(isVisible ? VISIBLE_STYLES[variant] : INITIAL_STYLES[variant]),
          };

          // If the child is a valid element, clone and merge styles
          if (isValidElement<HTMLAttributes<HTMLElement>>(child)) {
            return cloneElement(child, {
              key: (child.key ?? i) as string,
              style: { ...transitionStyle, ...(child.props.style ?? {}) },
            });
          }

          // Fallback: wrap in a span
          return (
            <span key={i} style={transitionStyle}>
              {child}
            </span>
          );
        })}
      </Tag>
    );
  }

  // ── Default mode: single reveal wrapper ──
  const style: CSSProperties = {
    willChange: "transform, opacity",
    transitionProperty: buildTransitionProperty(variant),
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", // Super smooth snappy easeOutQuint
    transitionDelay: `${delay}ms`,
    ...(isVisible ? VISIBLE_STYLES[variant] : INITIAL_STYLES[variant]),
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

export default ScrollReveal;
