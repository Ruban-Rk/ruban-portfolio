import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative grid h-10 w-10 place-items-center rounded-full border border-border glass transition-all duration-500 hover:scale-110 hover:shadow-[0_0_16px_oklch(0.55_0.09_190_/_0.4)]"
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] text-[var(--color-yellow)] transition-all duration-500 ${
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] text-cyan-400 transition-all duration-500 ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
