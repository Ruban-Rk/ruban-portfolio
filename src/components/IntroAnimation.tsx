import { useState, useEffect } from "react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import type { IntroConfig } from "@/hooks/use-admin";

export function IntroAnimation({ 
  config, 
  heroImageUrl,
  onComplete 
}: { 
  config: IntroConfig; 
  heroImageUrl?: string;
  onComplete: () => void; 
}) {
  const [phase, setPhase] = useState(0);

  const taglineCount = config.taglines.length;
  const CAR_PHASE = 3 + taglineCount;
  const FADE_PHASE = CAR_PHASE + 1;
  const UNMOUNT_PHASE = FADE_PHASE + 1;

  useEffect(() => {
    // Dynamic sequence timing
    let currentMs = 800;
    const allTimers: NodeJS.Timeout[] = [];
    
    // Phase 1: Greeting
    allTimers.push(setTimeout(() => setPhase(1), currentMs));
    
    // Phase 2: Name
    currentMs += 1200; // 2000ms
    allTimers.push(setTimeout(() => setPhase(2), currentMs));
    
    // Phase 3...N: Taglines
    for (let i = 0; i < taglineCount; i++) {
      currentMs += 800;
      allTimers.push(setTimeout(() => setPhase(3 + i), currentMs));
    }

    // Car drives
    currentMs += 1700;
    allTimers.push(setTimeout(() => setPhase(CAR_PHASE), currentMs));

    // Fade out begins
    currentMs += 1000;
    allTimers.push(setTimeout(() => setPhase(FADE_PHASE), currentMs));

    // Unmount
    currentMs += 2500;
    allTimers.push(setTimeout(() => {
      setPhase(UNMOUNT_PHASE);
      onComplete();
    }, currentMs));

    return () => allTimers.forEach(clearTimeout);
  }, [onComplete, taglineCount, CAR_PHASE, FADE_PHASE, UNMOUNT_PHASE]);

  if (phase >= UNMOUNT_PHASE) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex overflow-hidden bg-black transition-opacity duration-[2500ms] ease-in-out ${
        phase >= FADE_PHASE ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Left Half (Text) ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-20">
        <div className="text-left relative">
          
          <div className="font-extrabold text-[clamp(2.5rem,6vw,5rem)] leading-tight tracking-tight">
            {/* Phase 1: Greeting */}
            <div
              className={`transition-all duration-1000 ease-out transform ${
                phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                color: config.greetingColor,
                textShadow: phase >= 1 ? `0 0 40px ${config.greetingColor}80` : "none",
              }}
            >
              {config.greetingText}
            </div>

            {/* Phase 2: Name */}
            <div
              className={`transition-all duration-[1500ms] ease-out transform mt-2 ${
                phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
              style={{
                color: "transparent",
                WebkitTextStroke: `2px ${config.nameColor}`,
                backgroundImage: `linear-gradient(to right, ${config.nameColor}, ${config.nameColor}cc)`,
                WebkitBackgroundClip: "text",
                textShadow: phase >= 2 ? `0 0 60px ${config.nameColor}cc, 0 0 20px ${config.nameColor}80` : "none",
              }}
            >
              {config.nameText}
            </div>
          </div>

          {/* Dynamic Section One-Liners */}
          <div className="mt-8 font-semibold text-zinc-300 text-[clamp(1.2rem,2vw,1.8rem)] tracking-wide flex flex-col gap-3">
            {config.taglines.map((tagline, i) => (
              <div 
                key={tagline.id}
                className={`flex items-center gap-4 transition-all duration-1000 ease-out transform ${
                  phase >= (3 + i) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <span 
                  className="w-8 h-[2px] rounded-full" 
                  style={{ backgroundColor: tagline.color, boxShadow: `0 0 8px ${tagline.color}` }}
                />
                <span>{tagline.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Half (Image) ── */}
      <div
        className={`flex-1 relative transition-all duration-[2000ms] ease-out ${
          phase >= 2 ? "opacity-100 filter-none" : "opacity-0 grayscale blur-xl"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
        <img
          src={(config.useHeroImage ?? true) ? (heroImageUrl || heroPortrait) : (config.imageUrl || heroPortrait)}
          alt="Intro Portrait"
          className="w-full h-full object-cover object-center"
        />
        {/* Red lighting effect over image matching name color */}
        <div 
          className={`absolute inset-0 mix-blend-overlay transition-opacity duration-1000 z-20 ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`} 
          style={{ backgroundColor: `${config.nameColor}33` }} // 20% opacity matching name
        />
      </div>

      {/* ── F1 Car & Tire Smoke ── */}
      <div
        className="absolute bottom-10 left-0 w-[1200px] h-[350px] z-[60] pointer-events-none transition-transform ease-in-out"
        style={{
          transitionDuration: "2500ms", // Normal cinematic speed
          transform: phase >= CAR_PHASE 
            ? "translateX(150vw)" 
            : "translateX(-150%)",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Hyper-Realistic F1 Car Image */}
          <img 
            src="/f1car_transparent.png" 
            alt="F1 Racing Car"
            className="absolute inset-0 w-full h-full object-contain z-20 drop-shadow-2xl"
            style={{ 
              filter: 'brightness(1.1) contrast(1.1) drop-shadow(0 10px 20px rgba(0,0,0,0.8))',
              transform: 'scaleX(-1.5) scaleY(1.5)' // Scaled properly and facing right
            }}
          />

          {/* Aesthetic cinematic smoke trails */}
          {phase >= CAR_PHASE && (
            <div className="absolute -left-[500px] bottom-0 w-[800px] h-[350px] flex items-end opacity-80 z-30 pointer-events-none mix-blend-screen">
              {/* Dense thick smoke directly behind the tires */}
              <div className="w-[200px] h-[150px] bg-zinc-200 rounded-full blur-[40px] animate-pulse absolute bottom-10 left-[450px]" style={{ animationDuration: '0.3s' }} />
              
              {/* Expanding billows trailing behind */}
              <div className="w-[300px] h-[200px] bg-zinc-300 rounded-full blur-[50px] animate-pulse absolute bottom-0 left-[250px]" style={{ animationDuration: '0.5s', opacity: 0.9 }} />
              <div className="w-[450px] h-[250px] bg-zinc-400 rounded-full blur-[60px] animate-pulse absolute bottom-[-20px] left-[50px]" style={{ animationDuration: '0.7s', opacity: 0.8 }} />
              
              {/* Large dissipating trailing smoke */}
              <div className="w-[600px] h-[350px] bg-zinc-500 rounded-full blur-[80px] animate-pulse absolute bottom-[-50px] -left-[200px]" style={{ animationDuration: '1s', opacity: 0.6 }} />
              
              {/* Cinematic F1 tail-light reflection bouncing off the thickest smoke */}
              <div className="w-[150px] h-[100px] bg-red-600 rounded-full blur-[50px] animate-pulse absolute bottom-5 left-[450px] opacity-50" style={{ animationDuration: '0.2s' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
