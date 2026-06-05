<div align="center">

# 🧑‍💻 Ruban Kumar R — Portfolio

**AI & Data Science Undergrad · Linux Enthusiast · Security Explorer**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-Visit-coral?style=for-the-badge)](https://ruban-rk.github.io)
[![GitHub](https://img.shields.io/badge/GitHub-Ruban--Rk-181717?style=for-the-badge&logo=github)](https://github.com/Ruban-Rk)
[![Made with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

<br />

> *"Learn deeply. Build consistently. Ship things that actually solve problems."*

</div>

---

## ✨ What's Inside

A clean, fast, cream-toned portfolio site built from scratch — no templates. Features a bold typographic hero, timeline experience section, project cards, testimonials, and a contact block. Fully responsive.

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| ⚛️ Framework | TanStack Start v1 + React 19 |
| 🎨 Styling | Tailwind CSS v4 + tw-animate-css |
| 🧭 Routing | TanStack Router (file-based) |
| 🧩 UI | shadcn/ui (New York style) |
| 🔠 Fonts | Inter · Poppins · Caveat |
| 🖼️ Icons | lucide-react |
| ⚡ Build | Vite 7 |
| 📦 Package Manager | Bun |

---

## 🗂️ Project Structure

```
ruban-portfolio/
├── 📁 src/
│   ├── 📁 assets/          → hero portrait image
│   ├── 📁 components/ui/   → shadcn/ui components
│   ├── 📁 hooks/           → custom React hooks
│   ├── 📁 lib/             → utilities & server helpers
│   ├── 📁 routes/
│   │   ├── __root.tsx      → app shell, fonts, meta tags
│   │   └── index.tsx       → full portfolio page
│   ├── router.tsx
│   ├── server.ts
│   └── styles.css          → Tailwind v4 + design tokens
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Run Locally

**1. Install bun**
```bash
curl -fsSL https://bun.sh/install | bash
exec /usr/bin/zsh
```

**2. Clone & install**
```bash
git clone https://github.com/Ruban-Rk/ruban-portfolio.git
cd ruban-portfolio
bun install
```

**3. Add shadcn components**
```bash
npx shadcn@latest init
npx shadcn@latest add button card badge separator tooltip
```

**4. Start dev server**
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## ✏️ Customise

All content lives in `src/routes/index.tsx` as plain arrays — no CMS needed:

```tsx
// 🔧 Edit these to make it yours
const services = [ ... ]   // skills section
const timeline = [ ... ]   // experience entries  
const works    = [ ... ]   // project cards
```

Also update your email, phone, and LinkedIn links inside the same file.

---

## 📦 Build for Production

```bash
bun run build
bun run preview
```

---

## 🌐 Sections

- **Hero** — name, photo, tagline, social links
- **Services** — Linux, Cybersecurity, AI/ML skill cards
- **Experience** — timeline: internship, college, self-taught
- **Works** — project cards linking to GitHub
- **Notes** — testimonials from mentors
- **Contact** — email, phone, social links

---

## 👤 About Me

B.Tech AI & Data Science student at **Rajalakshmi Engineering College**, Chennai (2024–2028).
Passionate about Linux systems, cybersecurity fundamentals, and machine learning.
Space Tech Intern @ Indian Space Academy · 2025.

---

<div align="center">

Made with ☕ and a lot of `bun run dev` restarts

**[github.com/Ruban-Rk](https://github.com/Ruban-Rk)**

</div>
