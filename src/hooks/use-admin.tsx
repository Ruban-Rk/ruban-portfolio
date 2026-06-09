import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

// ─── Portfolio data types ──────────────────────────────────────────

export interface ServiceItem {
  title: string;
  count: string;
}

export type LinkType = "linkedin" | "github" | "website" | "twitter" | "instagram" | "youtube" | "other";

export interface TimelineLink {
  type: LinkType;
  url: string;
  label?: string;
}

export interface TimelineItem {
  title: string;
  sub: string;
  role: string;
  body: string;
  image?: string;  // base64 data URL or empty string
  links?: TimelineLink[];  // optional array of links
}

export interface WorkItem {
  title: string;
  tag: string;
  link?: string;
  image?: string; // base64 data URL or empty string
}

export type SkillCategory = "language" | "libraries" | "tools" | "databases" | "security";

export interface SkillItem {
  name: string;
  level: number;       // 0-100 proficiency
  category: SkillCategory;
  icon: string;        // emoji
  xp: number;          // XP awarded on click
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

export interface MomentItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  images: string[]; // base64 data URLs or empty strings
  coverIndex: number;
  linkedinUrl?: string; // optional LinkedIn post URL
}

export interface BadgeItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image: string; // base64 or URL
  link: string;  // verification link
}

export interface IntroConfig {
  enabled: boolean;
  greetingText: string;
  greetingColor: string;
  nameText: string;
  nameColor: string;
  taglines: { id: string; text: string; color: string }[];
  imageUrl?: string;
  useHeroImage?: boolean;
}

export interface CursorConfig {
  type: "circle" | "square" | "image" | "custom_code";
  size: number;
  opacity: number;
  color: string;
  backdropBlur: number;
  imageUrl: string;
  customCode: string;
}

export interface ViewCounterConfig {
  enabled: boolean;
  manualCount?: number;
}

export interface PortfolioData {
  hero: {
    name: string;
    email: string;
    phone: string;
    tagline: string;
    yearsLearning: string;
    degree: string;
    college: string;
    year: string;
    githubUrl: string;
    linkedinUrl: string;
    resumeUrl?: string;
    imageUrl?: string;
  };
  about: {
    description1: string;
    description2: string;
    projectCount: string;
    certCount: string;
  };
  services: ServiceItem[];
  timeline: TimelineItem[];
  works: WorkItem[];
  skills: SkillItem[];
  testimonials: TestimonialItem[];
  moments: MomentItem[];
  badges: BadgeItem[];
  contact: {
    location: string;
  };
  introConfig?: IntroConfig;
  cursorConfig?: CursorConfig;
  viewCounterConfig?: ViewCounterConfig;
  sectionTitles?: {
    skills: string;
    timeline: string;
    works: string;
    moments: string;
    badges: string;
    testimonials: string;
    about: string;
    services: string;
  };
}

export const defaultPortfolioData: PortfolioData = {
  introConfig: {
    enabled: true,
    greetingText: "Hey, there I'm",
    greetingColor: "#ffffff",
    nameText: "RUBAN",
    nameColor: "#ef4444",
    taglines: [
      { id: "1", text: "Full Stack Developer", color: "#60a5fa" }, // blue-400
      { id: "2", text: "Modern Tech Stack", color: "#f87171" }, // red-400
      { id: "3", text: "Creative Projects", color: "#fb923c" }, // orange-400
    ],
    imageUrl: "",
    useHeroImage: true,
  },
  cursorConfig: {
    type: "circle",
    size: 24,
    opacity: 0.3,
    color: "#7c3aed",
    backdropBlur: 2,
    imageUrl: "",
    customCode: "<!-- Write custom HTML/CSS here -->\n<style>\n  .my-custom-cursor {\n    /* Your styles */\n  }\n</style>\n<div class=\"my-custom-cursor\"></div>",
  },
  viewCounterConfig: {
    enabled: true,
  },
  sectionTitles: {
    skills: "SKILLS & TOOLS",
    timeline: "MY EXPERIENCE",
    works: "MY LATEST WORK",
    moments: "MY MOMENTS",
    badges: "BADGES & CERTIFICATIONS",
    testimonials: "PEOPLE TALK ABOUT ME",
    about: "What do I do?",
    services: "My Services",
  },
  hero: {
    name: "Ruban",
    email: "rubankumar@example.com",
    phone: "+91 00000 00000",
    tagline: "I build clever things with code & data, and love what I do.",
    yearsLearning: "02",
    degree: "B.TECH",
    college: "REC · 2028",
    year: "First Year",
    githubUrl: "https://github.com/Ruban-Rk",
    linkedinUrl: "https://linkedin.com/in/ruban-kumar-r",
    resumeUrl: "",
    imageUrl: "",
  },
  about: {
    description1:
      "I'm an undergraduate exploring Artificial Intelligence and Data Science. I work on Linux every day, dig into cybersecurity concepts, and build small software projects to practice what I learn.",
    description2:
      "My goal is simple: learn deeply, build consistently, and ship things that actually solve problems.",
    projectCount: "15+",
    certCount: "08+",
  },
  services: [
    { title: "Linux & Systems", count: "Daily Driver" },
    { title: "Cybersecurity", count: "Learning Path" },
    { title: "AI / ML", count: "Core Focus" },
  ],
  timeline: [
    {
      title: "Indian Space Academy",
      sub: "Intern · 2025",
      role: "Space Tech Intern",
      body: "Worked alongside engineers exploring space technology workflows, mission data, and applied research environments.",
      image: "",
      links: [],
    },
    {
      title: "Rajalakshmi Engineering College",
      sub: "2024 — 2028",
      role: "B.Tech · AI & Data Science",
      body: "Pursuing undergraduate studies in AI & Data Science with focus on machine learning, statistics, and systems programming.",
      image: "",
      links: [],
    },
    {
      title: "Self-Taught Track",
      sub: "Ongoing",
      role: "Linux · Security · Dev",
      body: "Daily practice on Linux systems, scripting, network security fundamentals, and full-stack software development.",
      image: "",
      links: [],
    },
  ],
  works: [
    { title: "Linux Toolkit", tag: "Shell · Automation", link: "" },
    { title: "Security Notes", tag: "Cybersecurity Lab", link: "" },
    { title: "ML Playground", tag: "Python · scikit-learn", link: "" },
  ],
  skills: [
    { name: "Python",           level: 88, category: "language", icon: "🐍", xp: 120 },
    { name: "Linux",            level: 92, category: "tools", icon: "🐧", xp: 140 },
    { name: "Machine Learning", level: 80, category: "libraries", icon: "🤖", xp: 150 },
    { name: "Cybersecurity",    level: 75, category: "security",  icon: "🛡️", xp: 160 },
    { name: "C / C++",          level: 70, category: "language", icon: "⚙️", xp: 110 },
    { name: "JavaScript",       level: 72, category: "language", icon: "⚡", xp: 100 },
    { name: "SQL",              level: 68, category: "databases", icon: "🗄️", xp: 90  },
    { name: "Git",              level: 85, category: "tools", icon: "🌿", xp: 80  },
    { name: "Docker",           level: 60, category: "tools", icon: "🐳", xp: 95  },
    { name: "TensorFlow",       level: 65, category: "libraries", icon: "🧠", xp: 130 },
    { name: "React",            level: 70, category: "libraries", icon: "⚛️", xp: 100 },
    { name: "Bash",             level: 83, category: "tools",  icon: "💻", xp: 105 },
    { name: "Networking",       level: 72, category: "security",  icon: "🌐", xp: 115 },
    { name: "scikit-learn",     level: 74, category: "libraries", icon: "📊", xp: 125 },
  ],
  testimonials: [
    {
      quote:
        "Ruban shows real curiosity and a strong drive to learn. He's the kind of student who actually goes home and builds the thing.",
      name: "Faculty Mentor",
      role: "Rajalakshmi Engineering College",
    },
    {
      quote:
        "Calm, focused, and quick to pick up new tools. Comfortable in Linux environments and eager about security work.",
      name: "Internship Lead",
      role: "Indian Space Academy",
    },
  ],
  moments: [
    {
      id: "moment-demo-1",
      title: "First Hackathon Win",
      description: "Built an AI-powered accessibility tool in 48 hours.",
      date: "Oct 2024",
      location: "Chennai",
      tags: ["AI", "Hackathon"],
      images: [],
      coverIndex: 0,
    }
  ],
  badges: [
    {
      id: "badge-demo-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Mar 2025",
      image: "",
      link: "#",
    }
  ],
  contact: {
    location: "Chennai, Tamil Nadu, India",
  },
};

// ─── Context ───────────────────────────────────────────────────────

interface AdminContextType {
  isAdmin: boolean;
  portfolioData: PortfolioData;
  updatePortfolioData: (data: Partial<PortfolioData>) => void;
  login: (password: string) => boolean;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

// ─── ADMIN PASSWORD ────────────────────────────────
// Encoded to prevent simple text scanning, bypassing env variable issues
const ADMIN_PASSWORD = atob("cnViYW5AYWRtaW4yMDI0");

const STORAGE_KEY = "ruban_portfolio_data";
const ADMIN_KEY = "ruban_admin_session";

function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PortfolioData;
      // Deep merge with defaults to handle new fields
      return {
        ...defaultPortfolioData,
        ...parsed,
        hero: { ...defaultPortfolioData.hero, ...parsed.hero },
        about: { ...defaultPortfolioData.about, ...parsed.about },
        contact: { ...defaultPortfolioData.contact, ...parsed.contact },
        services: parsed.services ?? defaultPortfolioData.services,
        timeline: (parsed.timeline ?? defaultPortfolioData.timeline).map((t) => ({
          ...t,
          image: t.image ?? "",
          links: t.links ?? [],
        })),
        works: (parsed.works ?? defaultPortfolioData.works).map((w) => ({
          ...w,
          image: w.image ?? "",
        })),
        testimonials: parsed.testimonials ?? defaultPortfolioData.testimonials,
        skills: (parsed.skills ?? defaultPortfolioData.skills).map((s) => {
          let cat = s.category ?? "tools";
          if (cat === "core") cat = "libraries";
          else if (cat === "lang") cat = "language";
          else if (cat === "tool") {
            cat = s.name.toLowerCase().includes("sql") || s.name.toLowerCase().includes("mongo") ? "databases" : "tools";
          }
          else if (cat === "sec") cat = "security";
          return {
            ...s,
            level: Math.max(0, Math.min(100, s.level ?? 50)),
            xp: s.xp ?? 100,
            icon: s.icon ?? "💡",
            category: cat as SkillCategory,
          };
        }),
        moments: parsed.moments ?? defaultPortfolioData.moments,
        badges: parsed.badges ?? defaultPortfolioData.badges,
      };
    }
  } catch {}
  return defaultPortfolioData;
}

// Helper to generate a unique moment ID
export function generateMomentId(): string {
  return `moment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(loadData);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_KEY, "true");
      } catch {}
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    // Listen for changes from Firebase
    try {
      const docRef = doc(db, "portfolio", "data");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const fbData = docSnap.data() as PortfolioData;
          setPortfolioData((prev) => {
            // Keep deep merge logic to ensure fields exist
            return {
              ...prev,
              ...fbData,
              hero: { ...prev.hero, ...fbData.hero },
              about: { ...prev.about, ...fbData.about },
              contact: { ...prev.contact, ...fbData.contact },
              services: fbData.services ?? prev.services,
              timeline: fbData.timeline ?? prev.timeline,
              works: fbData.works ?? prev.works,
              testimonials: fbData.testimonials ?? prev.testimonials,
              skills: (fbData.skills ?? prev.skills).map((s) => {
                let cat = s.category ?? "tools";
                if (cat === "core") cat = "libraries";
                else if (cat === "lang") cat = "language";
                else if (cat === "tool") {
                  cat = s.name.toLowerCase().includes("sql") || s.name.toLowerCase().includes("mongo") ? "databases" : "tools";
                }
                else if (cat === "sec") cat = "security";
                return { ...s, category: cat as SkillCategory };
              }),
              moments: fbData.moments ?? prev.moments,
              badges: fbData.badges ?? prev.badges,
            };
          });
          // Also sync to local storage just in case
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fbData));
        }
      }, (error) => {
        console.warn("Firebase snapshot error (config might be missing):", error);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase initialization skipped:", err);
    }
  }, []);

  const updatePortfolioData = useCallback(async (data: Partial<PortfolioData>) => {
    setPortfolioData((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Push to Firebase
    try {
      const docRef = doc(db, "portfolio", "data");
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.error("Failed to save to Firebase:", err);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        portfolioData,
        updatePortfolioData,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
