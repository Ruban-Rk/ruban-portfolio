import React, { useRef, useState, useCallback } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollReveal } from "./ScrollReveal";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BadgeItem } from "@/hooks/use-admin";

export function InteractiveBadgeCard({ badge, index }: { badge: BadgeItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-10 to 10 degrees)
    const rotateY = (mouseX / width - 0.5) * 20;
    const rotateX = (mouseY / height - 0.5) * -20;

    setRotation({ x: rotateX, y: rotateY });

    // Calculate glare position
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col items-center p-8 rounded-2xl bg-card border border-border/50 transition-all duration-300 shadow-lg"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* The tilted content container */}
      <div
        className="w-full h-full flex flex-col items-center relative z-10"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.1s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Dynamic Glare Effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(var(--color-cyan), 0.15), transparent 60%)`,
            transform: "translateZ(1px)",
          }}
        />

        {/* Badge Image with continuous float animation */}
        <div
          className="w-32 h-32 mb-6 relative flex items-center justify-center p-2 bg-background/50 rounded-full border border-border/50 group-hover:border-cyan-500/50 transition-colors duration-500"
          style={{
            transform: "translateZ(30px)",
            animation: `badgeFloat 3s ease-in-out infinite ${index * 0.5}s`,
            boxShadow: "0 10px 30px -10px rgba(var(--color-cyan), 0.3)",
          }}
        >
          {badge.image ? (
            <img
              src={badge.image}
              alt={badge.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(var(--color-cyan),0.6)] transition-all duration-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-3xl">
              🏅
            </div>
          )}
        </div>

        {/* Badge Details */}
        <div className="text-center flex-1 w-full" style={{ transform: "translateZ(20px)" }}>
          <h3 className="font-bold text-lg mb-2 text-foreground font-poppins line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {badge.name}
          </h3>
          <p className="text-accent font-medium text-sm mb-1">{badge.issuer}</p>
          <p className="text-muted-foreground text-xs font-mono">{badge.date}</p>
        </div>

        {/* Action Link */}
        {badge.link && badge.link !== "#" && (
          <a
            href={badge.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transform: "translateZ(25px)" }}
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-cyan-400 transition-colors bg-background/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(var(--color-cyan),0.3)]"
          >
            View Credential <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Base glow behind the card on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-accent/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-accent/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

export function BadgesSection() {
  const { portfolioData } = useAdmin();
  const badges = portfolioData.badges || [];

  if (badges.length === 0) return null;

  return (
    <section id="badges" className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10 mb-12">
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-poppins tracking-tight">
                Badges & <span className="text-accent">Certifications</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Credentials and achievements I've earned along my journey.
              </p>
            </div>
            <Link
              to="/badges"
              className="inline-flex items-center gap-2 text-[var(--color-coral)] font-semibold underline-offset-4 hover:underline transition-all duration-300 hover:gap-3 shrink-0"
            >
              View All{" "}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fade-up" delay={100}>
        <div className="relative z-10 w-full overflow-hidden flex items-center py-8">
          {/* Fading edges for the marquee */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          <div className="badge-marquee-track">
            {/* We duplicate the badges array multiple times to ensure enough content for an infinite scroll loop */}
            {[...badges, ...badges, ...badges, ...badges, ...badges, ...badges].map((badge, i) => (
              <div key={`${badge.id}-${i}`} className="w-[350px] flex-shrink-0">
                <InteractiveBadgeCard badge={badge} index={0} />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <style>{`
        @keyframes badgeFloat {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-10px); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .badge-marquee-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          /* Move left-to-right from -50% to 0% */
          animation: marqueeScroll 40s linear infinite;
        }
        /* Pause the marquee when the user hovers over it to let them read/click */
        .badge-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
