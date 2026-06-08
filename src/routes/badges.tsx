import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InteractiveBadgeCard } from "@/components/BadgesSection";

export const Route = createFileRoute("/badges")({
  component: BadgesPage,
  head: () => ({
    meta: [
      { title: "Badges & Certifications — Ruban Kumar R" },
      {
        name: "description",
        content: "View all badges, certifications, and achievements earned by Ruban Kumar R.",
      },
    ],
  }),
});

function BadgesPage() {
  const { portfolioData } = useAdmin();
  const badges = portfolioData.badges || [];

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 relative z-10">
        <ScrollReveal variant="fade-down" className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-cyan-500" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight font-poppins">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Badges</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            A comprehensive collection of my certifications, credentials, and continuous learning achievements.
          </p>
        </ScrollReveal>

        {badges.length === 0 ? (
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border/50 bg-card/30 backdrop-blur-sm text-center">
              <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-xl font-semibold text-muted-foreground mb-2">No badges yet</p>
              <p className="text-muted-foreground/60 max-w-sm">Check back later for new credentials and certifications.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {badges.map((badge, i) => (
              <InteractiveBadgeCard key={badge.id || i} badge={badge} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
