# Ruban Kumar R — Portfolio

Personal portfolio site built with TanStack Start, React 19, Tailwind CSS v4, and shadcn/ui.

---

## Tech Stack

- **Framework**: TanStack Start v1 (SSR React)
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **UI Components**: shadcn/ui (new-york style)
- **Icons**: lucide-react
- **Fonts**: Inter, Poppins, Caveat (Google Fonts)
- **Package Manager**: bun (recommended) or npm

---

## Local Setup

### 1. Prerequisites

Install **bun** (recommended):
```bash
curl -fsSL https://bun.sh/install | bash
```
Or use **Node.js 18+** with npm.

### 2. Clone / open in VS Code

```bash
cd ruban-portfolio
code .
```

### 3. Install dependencies

```bash
bun install
# or
npm install
```

### 4. Install shadcn/ui components

The `src/components/ui/` folder needs the shadcn components. Run:

```bash
npx shadcn@latest init          # follow prompts (choose new-york, CSS vars)
npx shadcn@latest add button card badge avatar separator tooltip
# Add more as needed: accordion alert dialog dropdown-menu etc.
```

Or copy them from any shadcn/TanStack starter — they're standard boilerplate.

### 5. Add your portrait photo

Drop your photo at:
```
src/assets/hero-portrait.jpg
```

Then uncomment and restore the import in `src/routes/index.tsx`:
```tsx
// Line 3 — uncomment this:
import heroPortrait from "@/assets/hero-portrait.jpg";

// In Hero(), replace the placeholder <div> with:
<img
  src={heroPortrait}
  alt="Ruban Kumar R"
  width={1024}
  height={1024}
  className="w-full max-w-md object-contain"
/>
```

### 6. Update your personal details

In `src/routes/index.tsx`, search and replace:
- `rubankumar@example.com` → your actual email
- `+91 00000 00000` → your actual phone
- GitHub link is already set to `https://github.com/Ruban-Rk`
- Add your LinkedIn URL where `href="#"` appears

### 7. Run the dev server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
ruban-portfolio/
├── src/
│   ├── assets/
│   │   └── hero-portrait.jpg       ← your photo goes here
│   ├── components/
│   │   └── ui/                     ← shadcn/ui components (install via CLI)
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   └── example.functions.ts
│   │   ├── config.server.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── lovable-error-reporting.ts
│   │   └── utils.ts
│   ├── routes/
│   │   ├── __root.tsx              ← app shell, fonts, meta
│   │   └── index.tsx               ← main portfolio page (ALL sections)
│   ├── routeTree.gen.ts            ← AUTO-GENERATED, do not edit
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── styles.css                  ← Tailwind v4 + design tokens
├── .gitignore
├── .prettierrc
├── components.json
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Customizing the Portfolio

All content data is in `src/routes/index.tsx` as plain arrays — easy to edit:

| Variable | What it controls |
|----------|-----------------|
| `navLinks` | Navigation links |
| `services` | Services/skills section cards |
| `timeline` | Experience section entries |
| `works` | Project cards |
| Inline arrays in `Testimonials` | Testimonial quotes |

---

## Build for Production

```bash
bun run build
bun run preview
```

---

## Deploy

This is a TanStack Start app (Nitro-powered). It can deploy to:
- **Cloudflare Workers** (default target)
- **Vercel** / **Netlify** (via adapter)
- Any Node.js server

---
