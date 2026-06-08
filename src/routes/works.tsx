import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, FolderGit2 } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/works")({
  component: WorksPage,
  head: () => ({
    meta: [
      { title: "Latest Works & Projects — Ruban Kumar R" },
      {
        name: "description",
        content: "View all latest works and projects built by Ruban Kumar R.",
      },
    ],
  }),
});

const worksColors = [
  "rgba(124,58,237,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(14,165,233,0.8)",
  "rgba(16,185,129,0.8)",
  "rgba(245,158,11,0.8)",
  "rgba(239,68,68,0.8)",
];

function WorksPage() {
  const { portfolioData } = useAdmin();
  const { works, hero } = portfolioData;

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FolderGit2 className="h-8 w-8 text-indigo-500" />
                <h1 className="text-4xl md:text-6xl font-black tracking-tight font-poppins">
                  All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Works</span>
                </h1>
              </div>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                A complete showcase of my projects, experiments, and software builds.
              </p>
            </div>
            <a
              href={hero.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              Explore More on GitHub
            </a>
          </div>
        </ScrollReveal>

        {works.length === 0 ? (
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-border/50 bg-card/30 backdrop-blur-sm text-center">
              <FolderGit2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-xl font-semibold text-muted-foreground mb-2">No projects yet</p>
              <p className="text-muted-foreground/60 max-w-sm">Check back later for new works and experiments.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {works.map((w, i) => (
              <ScrollReveal key={w.title + i} variant="fade-up" delay={i * 50}>
                <article
                  className="rounded-2xl p-6 h-80 flex flex-col justify-between text-primary relative overflow-hidden group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.3)] border border-border/30"
                  style={
                    w.image
                      ? { backgroundImage: `url(${w.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: worksColors[i % worksColors.length] }
                  }
                >
                  {/* Colour tint overlay */}
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

                  {/* Gradient to darken top & bottom text areas if image is present */}
                  {w.image && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
                  )}

                  {/* Content (z-10 ensures it stays above the overlay) */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold font-poppins text-white drop-shadow-md">
                      {w.title}
                    </h3>
                    {w.tag && (
                      <p className="text-sm mt-2 text-white/90 drop-shadow line-clamp-3">
                        {w.tag}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 self-end mt-4">
                    {w.link ? (
                      <a href={w.link} target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black shadow-lg">
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                      </a>
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black shadow-lg cursor-not-allowed opacity-50">
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
