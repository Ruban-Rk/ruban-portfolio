<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=250&section=header&text=PortFolio&fontSize=70&fontAlignY=35&animation=twinkling&fontColor=ffffff" width="100%" />

  <br />
  
  <a href="https://github.com/Ruban-Rk/ruban-portfolio">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=26&pause=1000&color=A5B4FC&center=true&vCenter=true&width=435&lines=Welcome+to+the+Matrix;Interactive.+Cinematic.+Fast.;Built+with+Vite+%2B+React;Powered+by+Firebase" alt="Typing SVG" />
  </a>
  
  <br />

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  </p>
</div>

---

## 🌌 Overview

A highly customized, interactive, and aesthetic portfolio designed to feel like a high-end cinematic experience. Featuring a cyberpunk Matrix-rain background, glassmorphism UI, a highly configurable custom cursor, live public comments, and a **hidden admin panel** controlled remotely through Firebase.

<br/>

## ✨ Key Features

- **🛡️ Secret Admin Panel**: Completely hidden from the public. Triggered exclusively by clicking the logo 5 times.
- **👁️ Live View Counter**: Synced globally using Firebase Firestore to track unique visitors.
- **💬 Public Guestbook/Comments**: Users can leave their thoughts, and the Admin can delete or **Pin** favorite comments.
- **🖱️ Ultimate Custom Cursor**: 100% configurable via the Admin Panel. Change shapes, opacity, size, inject images, or even run raw HTML/CSS logic on the fly.
- **🌧️ Matrix Rain Background**: A fully interactive, lightweight canvas background with glowing green/red terminal characters.
- **📱 Fully Responsive**: From ultra-wide monitors down to standard mobile devices.
- **✨ Micro-Animations**: Smooth fade-ins, scrolling reveals, and typing effects utilizing the latest in modern UI design.

<br/>

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Ruban-Rk/ruban-portfolio.git
cd ruban-portfolio
```

### 2. Install Dependencies
Make sure you have Node.js and `npm` (or `bun`) installed.
```bash
npm install
```

### 3. Setup Firebase & Environment
Create a `.env` file in the root directory and add your Firebase credentials and secret admin password:
```env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="sender_id"
VITE_FIREBASE_APP_ID="app_id"

VITE_ADMIN_PASSWORD="your_super_secret_password"
```

### 4. Run Development Server
```bash
npm run dev
```

<br/>

## 🛠️ Admin Controls

Once deployed, the Admin Panel gives you total control over the UI without touching the code:
- **Toggle View Counter**: Hide or show the live view badge.
- **Set Manual View Count**: Override the views.
- **Cursor Config**: Turn the cursor into a circle, square, custom image, or raw code injection.
- **Manage Comments**: Delete spam, pin great comments.
- **Hero & Intro Sync**: Change the landing image and sync/unsync the intro animations directly from the dashboard.

<br/>

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=100&section=footer" width="100%" />
</div>
