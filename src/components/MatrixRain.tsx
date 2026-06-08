import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/use-theme";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to window size
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Hacker-style strings
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?".split("");

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);

    // Array to track the y coordinate of each column
    // Since it's moving upward, we initialize them at the bottom (height) + some random offset
    let drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = height + Math.random() * height;
    }

    // Mixed Hacker Red & Matrix Green Colors
    const colors = ["#ef4444", "#f87171", "#22c55e", "#4ade80"];

    let animationFrameId: number;

    const draw = () => {
      // Use a dark slate/blue-grey color for the trail with more alpha to make trails shorter and cleaner
      ctx.fillStyle = theme === "dark" ? "rgba(15, 23, 42, 0.15)" : "rgba(240, 240, 245, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Randomly choose between cyan and purple
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i]);

        // Move upward by subtracting fontSize
        drops[i] -= fontSize;

        // Reset to bottom randomly when it reaches the top
        if (drops[i] < 0 && Math.random() > 0.95) {
          drops[i] = height + fontSize;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = height + Math.random() * height;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-40 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
