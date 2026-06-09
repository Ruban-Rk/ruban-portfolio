import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import type { PortfolioData, SkillCategory } from "@/hooks/use-admin";
import { useLogs } from "@/hooks/use-logs";
import { useComments } from "@/hooks/use-comments";
import { getInitials, pickAvatarColor } from "@/hooks/use-comments";

// ─── Admin Login Modal ─────────────────────────────────────────────

export function AdminLoginModal() {
  const { login, setShowLoginModal } = useAdmin();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(password);
    setLoading(false);
    if (ok) {
      setShowLoginModal(false);
      setPassword("");
      setError("");
    } else {
      setError("Invalid password. Try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
    if (e.key === "Escape") setShowLoginModal(false);
  };

  return (
    <div
      id="admin-login-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(16px)",
      }}
      onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d0d1f 100%)",
          border: "1px solid rgba(147,51,234,0.3)",
          borderRadius: "20px",
          padding: "40px",
          width: "min(420px, 90vw)",
          boxShadow: "0 30px 80px -20px rgba(147,51,234,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: shake ? "shake 0.4s ease" : "slideIn 0.3s ease",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
          }
          @keyframes spin360 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .admin-login-input:focus {
            outline: none;
            border-color: rgba(147,51,234,0.8) !important;
            box-shadow: 0 0 0 3px rgba(147,51,234,0.2) !important;
          }
        `}</style>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 0 30px rgba(124,58,237,0.5)",
              fontSize: "28px",
              marginBottom: "16px",
            }}
          >
            🔐
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              margin: 0,
            }}
          >
            Admin Access
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "13px",
              marginTop: "6px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Enter your admin password to continue
          </p>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "8px",
            }}
          >
            PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="admin-login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKey}
              placeholder="Enter admin password…"
              autoFocus
              style={{
                width: "100%",
                padding: "12px 48px 12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "15px",
                fontFamily: "'Inter', sans-serif",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: "#ff6b6b",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <button
          id="admin-login-btn"
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: "100%",
            padding: "13px",
            background: loading
              ? "rgba(124,58,237,0.4)"
              : "linear-gradient(135deg, #7c3aed, #2563eb)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            cursor: loading || !password ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            opacity: !password ? 0.6 : 1,
            letterSpacing: "0.03em",
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: "spin360 0.6s linear infinite",
                  fontSize: "16px",
                }}
              >
                ⟳
              </span>
              Verifying…
            </span>
          ) : (
            "Sign In as Admin"
          )}
        </button>

        <button
          onClick={() => setShowLoginModal(false)}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Admin Panel ───────────────────────────────────────────────────

type Tab =
  | "intro"
  | "cursor"
  | "hero"
  | "about"
  | "services"
  | "experience"
  | "skills"
  | "works"
  | "badges"
  | "testimonials"
  | "contact"
  | "moments"
  | "comments"
  | "logs";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "intro", label: "Intro", icon: "🎬" },
  { key: "cursor", label: "Cursor", icon: "🖱️" },
  { key: "hero", label: "Hero", icon: "🏠" },
  { key: "about", label: "About", icon: "📝" },
  { key: "services", label: "Services", icon: "⚡" },
  { key: "experience", label: "Experience", icon: "💼" },
  { key: "skills", label: "Skills", icon: "🎮" },
  { key: "works", label: "Works", icon: "🚀" },
  { key: "badges", label: "Badges", icon: "🏅" },
  { key: "testimonials", label: "Reviews", icon: "💬" },
  { key: "contact", label: "Contact", icon: "📬" },
  { key: "moments", label: "Moments", icon: "📸" },
  { key: "comments", label: "Comments", icon: "💭" },
  { key: "logs", label: "Logs", icon: "📊" },
];

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "15px" }}>
      <label
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {value && (
          <img
            src={value}
            alt="Preview"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        )}
        <label
          style={{
            padding: "8px 12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              borderRadius: "6px",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminPanel() {
  const { isAdmin, portfolioData, updatePortfolioData, logout } = useAdmin();
  const [tab, setTab] = useState<Tab>("hero");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [localData, setLocalData] = useState<PortfolioData>(portfolioData);
  const [systemErrors, setSystemErrors] = useState<{ id: number; msg: string; time: Date }[]>([]);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setSystemErrors((prev) => [
        { id: Date.now(), msg: `Window Error: ${e.message}`, time: new Date() },
        ...prev,
      ]);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg =
        e.reason?.message || typeof e.reason === "string" ? e.reason : "Promise Rejection";
      setSystemErrors((prev) => [
        { id: Date.now(), msg: `Network/Promise: ${msg}`, time: new Date() },
        ...prev,
      ]);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  useEffect(() => {
    setLocalData(portfolioData);
  }, [portfolioData]);

  if (!isAdmin) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePortfolioData(localData);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      const errMsg = err.message || "Unknown error occurred";
      setSystemErrors((prev) => [
        { id: Date.now(), msg: `Save Error: ${errMsg}`, time: new Date() },
        ...prev,
      ]);
      alert(
        `Failed to save changes! Error: ${errMsg}\n\nFirebase has a 1MB limit per document. If you added multiple large images, please compress them or use external image URLs.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const update = (path: string, value: unknown) => {
    const keys = path.split(".");
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    resize: "vertical" as const,
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.5)",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "5px",
    fontFamily: "'Inter', sans-serif",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: "14px",
  };

  const sectionTitle: React.CSSProperties = {
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    marginBottom: "14px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          zIndex: 9998,
          padding: "12px 16px",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          border: "none",
          borderRadius: "50px",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ⚙️ Admin Panel
      </button>
    );
  }

  return (
    <div
      id="admin-panel"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "min(400px, 92vw)",
        zIndex: 9998,
        background: "linear-gradient(180deg, #0a0a1a 0%, #0f0f20 100%)",
        borderLeft: "1px solid rgba(124,58,237,0.25)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(124,58,237,0.1)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>⚙️</span>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Admin Panel
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
              Portfolio Editor
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              padding: "6px 10px",
              fontSize: "13px",
            }}
          >
            ✕
          </button>
          <button
            onClick={logout}
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              color: "#f87171",
              cursor: "pointer",
              padding: "6px 10px",
              fontSize: "12px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "6px 12px",
              background: tab === t.key ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
              border: "1px solid",
              borderColor: tab === t.key ? "rgba(124,58,237,0.5)" : "transparent",
              borderRadius: "50px",
              color: tab === t.key ? "#c4b5fd" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div
        className="admin-panel-scroll"
        style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px" }}
      >
        {systemErrors.length > 0 ? (
          <div
            style={{
              marginBottom: "20px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              color: "#fca5a5",
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                ⚠️ System Alerts
              </strong>
              <button
                onClick={() => setSystemErrors([])}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fca5a5",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Clear
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {systemErrors.map((err) => (
                <div
                  key={err.id}
                  style={{ background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(252, 165, 165, 0.6)",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    {err.time.toLocaleTimeString()}
                  </span>
                  {err.msg}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              marginBottom: "20px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px",
              padding: "10px 12px",
              color: "#6ee7b7",
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "14px" }}>✅</span>
            <span><strong style={{ fontWeight: 600 }}>System Status:</strong> All systems operational. No active alerts.</span>
          </div>
        )}

        <style>{`
          .admin-input:focus { outline: none; border-color: rgba(124,58,237,0.7) !important; box-shadow: 0 0 0 2px rgba(124,58,237,0.2) !important; }
          .admin-panel-scroll::-webkit-scrollbar { width: 4px; }
          .admin-panel-scroll::-webkit-scrollbar-track { background: transparent; }
          .admin-panel-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }
        `}</style>

        {/* ── INTRO ── */}
        {tab === "intro" && (
          <div>
            <div style={sectionTitle}>Intro Animation Settings</div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#fff",
                cursor: "pointer",
                padding: "15px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={localData.introConfig?.enabled ?? true}
                onChange={(e) => update("introConfig.enabled", e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "#7c3aed" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 600 }}>Enable Intro Animation</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                  If unchecked, the website will skip the intro completely and load instantly.
                </span>
              </div>
            </label>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  color: "#fff",
                  margin: "0 0 15px 0",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "15px",
                }}
              >
                Intro Image
              </h4>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  marginBottom: "15px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <input
                  type="checkbox"
                  checked={localData.introConfig?.useHeroImage ?? true}
                  onChange={(e) => update("introConfig.useHeroImage", e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#7c3aed" }}
                />
                <span style={{ fontSize: "14px" }}>Use the same image as the Hero section</span>
              </label>

              {!(localData.introConfig?.useHeroImage ?? true) && (
                <ImageUpload
                  label="Custom Intro Image"
                  value={localData.introConfig?.imageUrl || ""}
                  onChange={(v) => update("introConfig.imageUrl", v)}
                />
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Greeting Text</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.introConfig?.greetingText || ""}
                  onChange={(e) => update("introConfig.greetingText", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Greeting Glow Color (Hex)</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.introConfig?.greetingColor || ""}
                  onChange={(e) => update("introConfig.greetingColor", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Name Text</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.introConfig?.nameText || ""}
                  onChange={(e) => update("introConfig.nameText", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Name Text Color (Hex)</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.introConfig?.nameColor || ""}
                  onChange={(e) => update("introConfig.nameColor", e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div style={{ ...sectionTitle, borderBottom: "none", margin: 0 }}>
                Animated Taglines
              </div>
              <button
                onClick={() => {
                  const arr = [...(localData.introConfig?.taglines || [])];
                  arr.push({ id: Date.now().toString(), text: "New Topic", color: "#60a5fa" });
                  update("introConfig.taglines", arr);
                }}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px dashed rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                + Add Tagline
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(localData.introConfig?.taglines || []).map((t, i) => (
                <div
                  key={t.id || i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto",
                    gap: "15px",
                    alignItems: "flex-end",
                    background: "rgba(255,255,255,0.03)",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ ...fieldStyle, margin: 0 }}>
                    <label style={labelStyle}>Text</label>
                    <input
                      className="admin-input"
                      style={inputStyle}
                      value={t.text}
                      onChange={(e) => {
                        const arr = [...(localData.introConfig?.taglines || [])];
                        arr[i].text = e.target.value;
                        update("introConfig.taglines", arr);
                      }}
                    />
                  </div>
                  <div style={{ ...fieldStyle, margin: 0 }}>
                    <label style={labelStyle}>Glow Color (Hex)</label>
                    <input
                      className="admin-input"
                      style={inputStyle}
                      value={t.color}
                      onChange={(e) => {
                        const arr = [...(localData.introConfig?.taglines || [])];
                        arr[i].color = e.target.value;
                        update("introConfig.taglines", arr);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const arr = [...(localData.introConfig?.taglines || [])];
                      arr.splice(i, 1);
                      update("introConfig.taglines", arr);
                    }}
                    style={{
                      padding: "0 16px",
                      background: "rgba(239, 68, 68, 0.2)",
                      border: "1px solid rgba(239, 68, 68, 0.5)",
                      borderRadius: "6px",
                      color: "#fca5a5",
                      cursor: "pointer",
                      height: "42px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {(!localData.introConfig?.taglines ||
                localData.introConfig.taglines.length === 0) && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.4)",
                    fontStyle: "italic",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                >
                  No taglines added.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CURSOR ── */}
        {tab === "cursor" && (
          <div>
            <div style={sectionTitle}>Custom Cursor Settings</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div style={fieldStyle}>
                <label style={labelStyle}>Cursor Shape/Type</label>
                <select
                  value={localData.cursorConfig?.type || "circle"}
                  onChange={(e) => update("cursorConfig.type", e.target.value)}
                  style={inputStyle}
                >
                  <option value="circle">Glass Circle</option>
                  <option value="square">Glass Square</option>
                  <option value="image">Custom Image</option>
                  <option value="custom_code">Custom HTML/CSS Code</option>
                </select>
              </div>

              {(localData.cursorConfig?.type === "circle" ||
                localData.cursorConfig?.type === "square") && (
                <>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Cursor Color</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        type="color"
                        value={localData.cursorConfig?.color || "#7c3aed"}
                        onChange={(e) => update("cursorConfig.color", e.target.value)}
                        style={{
                          width: "40px",
                          height: "40px",
                          padding: "0",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: "transparent",
                        }}
                      />
                      <input
                        type="text"
                        value={localData.cursorConfig?.color || "#7c3aed"}
                        onChange={(e) => update("cursorConfig.color", e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Size (px)</label>
                    <input
                      type="number"
                      value={localData.cursorConfig?.size || 24}
                      onChange={(e) => update("cursorConfig.size", parseInt(e.target.value))}
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Opacity (0.0 to 1.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={localData.cursorConfig?.opacity ?? 0.3}
                      onChange={(e) => update("cursorConfig.opacity", parseFloat(e.target.value))}
                      style={inputStyle}
                    />
                  </div>

                  <div style={fieldStyle}>
                    <label style={labelStyle}>Backdrop Blur Effect (px)</label>
                    <input
                      type="number"
                      value={localData.cursorConfig?.backdropBlur ?? 2}
                      onChange={(e) =>
                        update("cursorConfig.backdropBlur", parseInt(e.target.value))
                      }
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {localData.cursorConfig?.type === "image" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <ImageUpload
                    label="Custom Cursor Image"
                    value={localData.cursorConfig?.imageUrl || ""}
                    onChange={(v) => update("cursorConfig.imageUrl", v)}
                  />
                  <div style={{ marginTop: "15px" }}>
                    <label style={labelStyle}>Image Size (px)</label>
                    <input
                      type="number"
                      value={localData.cursorConfig?.size || 32}
                      onChange={(e) => update("cursorConfig.size", parseInt(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {localData.cursorConfig?.type === "custom_code" && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Custom HTML/CSS Code</label>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Write your own HTML elements and &lt;style&gt; blocks here to completely
                    customize the cursor. Javascript is not supported for security.
                  </span>
                  <textarea
                    value={localData.cursorConfig?.customCode || ""}
                    onChange={(e) => update("cursorConfig.customCode", e.target.value)}
                    style={{
                      ...inputStyle,
                      height: "200px",
                      fontFamily: "monospace",
                      whiteSpace: "pre",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div>
            <div style={sectionTitle}>Hero Section</div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "20px",
              }}
            >
              <ImageUpload
                label="Hero Portrait Image"
                value={localData.hero?.imageUrl || ""}
                onChange={(v) => update("hero.imageUrl", v)}
              />
            </div>

            {(
              [
                ["Display Name", "hero.name"],
                ["Email", "hero.email"],
                ["Phone", "hero.phone"],
                ["Years Learning", "hero.yearsLearning"],
                ["Degree", "hero.degree"],
                ["College & Year", "hero.college"],
                ["GitHub URL", "hero.githubUrl"],
                ["LinkedIn URL", "hero.linkedinUrl"],
              ] as [string, string][]
            ).map(([label, path]) => (
              <div key={path} style={fieldStyle}>
                <label style={labelStyle}>{label}</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={(() => {
                    const keys = path.split(".");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let v: any = localData;
                    for (const k of keys) v = v[k];
                    return v as string;
                  })()}
                  onChange={(e) => update(path, e.target.value)}
                />
              </div>
            ))}
            <div style={fieldStyle}>
              <label style={labelStyle}>Tagline</label>
              <textarea
                className="admin-input"
                style={{ ...inputStyle, minHeight: "80px" }}
                value={localData.hero.tagline}
                onChange={(e) => update("hero.tagline", e.target.value)}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Resume (PDF/Doc)</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const res = ev.target?.result;
                        if (typeof res === "string") {
                          update("hero.resumeUrl", res);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ color: "#a5b4fc", fontSize: "14px" }}
                />
                {localData.hero.resumeUrl && (
                  <a
                    href={localData.hero.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "12px", color: "#818cf8", textDecoration: "underline" }}
                  >
                    View Current Resume
                  </a>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                Upload your resume here. It will be stored securely and made available for download
                on the homepage.
              </p>
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        {tab === "about" && (
          <div>
            <div style={sectionTitle}>About Section</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.about || "What do I do?"}
                onChange={(e) => update("sectionTitles.about", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Description 1</label>
              <textarea
                className="admin-input"
                style={{ ...inputStyle, minHeight: "100px" }}
                value={localData.about.description1}
                onChange={(e) => update("about.description1", e.target.value)}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Description 2</label>
              <textarea
                className="admin-input"
                style={{ ...inputStyle, minHeight: "80px" }}
                value={localData.about.description2}
                onChange={(e) => update("about.description2", e.target.value)}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Project Count</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.about.projectCount}
                  onChange={(e) => update("about.projectCount", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cert Count</label>
                <input
                  className="admin-input"
                  style={inputStyle}
                  value={localData.about.certCount}
                  onChange={(e) => update("about.certCount", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {tab === "services" && (
          <div>
            <div style={sectionTitle}>Services / Offerings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.services || "My Services"}
                onChange={(e) => update("sectionTitles.services", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            {localData.services.map((s, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "16px",
                  padding: "14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  SERVICE {i + 1}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Title</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={s.title}
                    onChange={(e) => {
                      const next = [...localData.services];
                      next[i] = { ...next[i], title: e.target.value };
                      update("services", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Badge / Count</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={s.count}
                    onChange={(e) => {
                      const next = [...localData.services];
                      next[i] = { ...next[i], count: e.target.value };
                      update("services", next);
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    update(
                      "services",
                      localData.services.filter((_, idx) => idx !== i),
                    )
                  }
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "6px",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                update("services", [
                  ...localData.services,
                  { title: "New Service", count: "Label" },
                ])
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(124,58,237,0.15)",
                border: "1px dashed rgba(124,58,237,0.4)",
                borderRadius: "8px",
                color: "#c4b5fd",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Service
            </button>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {tab === "experience" && (
          <div>
            <div style={sectionTitle}>Experience Settings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.timeline || "MY EXPERIENCE"}
                onChange={(e) => update("sectionTitles.timeline", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            {localData.timeline.map((t, i) => {
              const updateEntry = (field: string, value: unknown) => {
                const next = [...localData.timeline];
                next[i] = { ...next[i], [field]: value };
                update("timeline", next);
              };
              const links = t.links ?? [];
              const LINK_TYPES = [
                "linkedin",
                "github",
                "website",
                "twitter",
                "instagram",
                "youtube",
                "other",
              ] as const;
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "16px",
                    padding: "14px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "11px",
                      marginBottom: "10px",
                      fontWeight: 600,
                    }}
                  >
                    ENTRY {i + 1}
                  </div>

                  {/* Topic name fields */}
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      background: "rgba(124,58,237,0.06)",
                      borderRadius: "8px",
                      border: "1px solid rgba(124,58,237,0.15)",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        marginBottom: "8px",
                        fontWeight: 700,
                      }}
                    >
                      📛 TOPIC INFO
                    </div>
                    {(["title", "sub", "role"] as const).map((field) => (
                      <div key={field} style={fieldStyle}>
                        <label style={labelStyle}>
                          {field === "title"
                            ? "Organization / Title"
                            : field === "sub"
                              ? "Date / Subtitle"
                              : "Role"}
                        </label>
                        <input
                          className="admin-input"
                          style={inputStyle}
                          value={t[field]}
                          onChange={(e) => updateEntry(field, e.target.value)}
                        />
                      </div>
                    ))}
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Body / Description</label>
                      <textarea
                        className="admin-input"
                        style={{ ...inputStyle, minHeight: "80px" }}
                        value={t.body}
                        onChange={(e) => updateEntry("body", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Image upload */}
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      background: "rgba(99,102,241,0.06)",
                      borderRadius: "8px",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        marginBottom: "8px",
                        fontWeight: 700,
                      }}
                    >
                      🖼️ IMAGE (optional)
                    </div>
                    {t.image ? (
                      <div>
                        <img
                          src={t.image}
                          alt="preview"
                          style={{
                            width: "100%",
                            maxHeight: "120px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        />
                        <button
                          onClick={() => updateEntry("image", "")}
                          style={{
                            width: "100%",
                            padding: "6px",
                            background: "rgba(239,68,68,0.12)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            borderRadius: "6px",
                            color: "#f87171",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          🗑 Remove Image
                        </button>
                      </div>
                    ) : (
                      <label style={{ display: "block", cursor: "pointer" }}>
                        <div
                          style={{
                            width: "100%",
                            padding: "18px",
                            border: "1.5px dashed rgba(99,102,241,0.35)",
                            borderRadius: "8px",
                            textAlign: "center",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "12px",
                            fontFamily: "'Inter', sans-serif",
                            background: "rgba(99,102,241,0.04)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor =
                              "rgba(99,102,241,0.6)";
                            (e.currentTarget as HTMLDivElement).style.color =
                              "rgba(255,255,255,0.6)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor =
                              "rgba(99,102,241,0.35)";
                            (e.currentTarget as HTMLDivElement).style.color =
                              "rgba(255,255,255,0.35)";
                          }}
                        >
                          📁 Click to upload image
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              updateEntry("image", (ev.target?.result as string) ?? "");
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Links */}
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      background: "rgba(34,197,94,0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(34,197,94,0.12)",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        marginBottom: "8px",
                        fontWeight: 700,
                      }}
                    >
                      🔗 LINKS
                    </div>
                    {links.map((link, li) => (
                      <div
                        key={li}
                        style={{
                          marginBottom: "8px",
                          display: "flex",
                          gap: "6px",
                          alignItems: "flex-end",
                        }}
                      >
                        <div style={{ flex: "0 0 100px" }}>
                          <label style={{ ...labelStyle, marginBottom: "3px" }}>Type</label>
                          <select
                            className="admin-input"
                            style={{ ...inputStyle, padding: "7px 8px" }}
                            value={link.type}
                            onChange={(e) => {
                              const next = [...links];
                              next[li] = {
                                ...next[li],
                                type: e.target.value as (typeof LINK_TYPES)[number],
                              };
                              updateEntry("links", next);
                            }}
                          >
                            {LINK_TYPES.map((lt) => (
                              <option key={lt} value={lt}>
                                {lt.charAt(0).toUpperCase() + lt.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ ...labelStyle, marginBottom: "3px" }}>URL</label>
                          <input
                            className="admin-input"
                            style={inputStyle}
                            value={link.url}
                            placeholder="https://..."
                            onChange={(e) => {
                              const next = [...links];
                              next[li] = { ...next[li], url: e.target.value };
                              updateEntry("links", next);
                            }}
                          />
                        </div>
                        <div style={{ flex: "0 0 70px" }}>
                          <label style={{ ...labelStyle, marginBottom: "3px" }}>Label</label>
                          <input
                            className="admin-input"
                            style={inputStyle}
                            value={link.label ?? ""}
                            placeholder="Optional"
                            onChange={(e) => {
                              const next = [...links];
                              next[li] = { ...next[li], label: e.target.value };
                              updateEntry("links", next);
                            }}
                          />
                        </div>
                        <button
                          onClick={() =>
                            updateEntry(
                              "links",
                              links.filter((_, idx) => idx !== li),
                            )
                          }
                          style={{
                            flexShrink: 0,
                            marginBottom: "0",
                            padding: "7px 10px",
                            background: "rgba(239,68,68,0.12)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            borderRadius: "6px",
                            color: "#f87171",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {/* Add link row */}
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}
                    >
                      {LINK_TYPES.map((lt) => (
                        <button
                          key={lt}
                          onClick={() =>
                            updateEntry("links", [...links, { type: lt, url: "", label: "" }])
                          }
                          style={{
                            padding: "4px 10px",
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.25)",
                            borderRadius: "6px",
                            color: "#86efac",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          + {lt.charAt(0).toUpperCase() + lt.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      update(
                        "timeline",
                        localData.timeline.filter((_, idx) => idx !== i),
                      )
                    }
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: "6px",
                      color: "#f87171",
                      cursor: "pointer",
                      padding: "5px 10px",
                      fontSize: "12px",
                    }}
                  >
                    Remove Entry
                  </button>
                </div>
              );
            })}
            <button
              onClick={() =>
                update("timeline", [
                  ...localData.timeline,
                  {
                    title: "Organization",
                    sub: "Date",
                    role: "Role",
                    body: "Description.",
                    image: "",
                    links: [],
                  },
                ])
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(124,58,237,0.15)",
                border: "1px dashed rgba(124,58,237,0.4)",
                borderRadius: "8px",
                color: "#c4b5fd",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Topic / Entry
            </button>
          </div>
        )}

        {/* ── WORKS ── */}
        {tab === "works" && (
          <div>
            <div style={sectionTitle}>Works Settings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.works || "MY LATEST WORK"}
                onChange={(e) => update("sectionTitles.works", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            {localData.works.map((w, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "16px",
                  padding: "14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  PROJECT {i + 1}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Title</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={w.title}
                    onChange={(e) => {
                      const next = [...localData.works];
                      next[i] = { ...next[i], title: e.target.value };
                      update("works", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Tag / Tech Stack</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={w.tag}
                    onChange={(e) => {
                      const next = [...localData.works];
                      next[i] = { ...next[i], tag: e.target.value };
                      update("works", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Link (optional)</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={w.link ?? ""}
                    onChange={(e) => {
                      const next = [...localData.works];
                      next[i] = { ...next[i], link: e.target.value };
                      update("works", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Project Image (optional)</label>
                  {w.image ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={w.image}
                        alt="Project cover"
                        style={{
                          width: "100%",
                          maxHeight: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          marginBottom: "6px",
                        }}
                      />
                      <button
                        onClick={() => {
                          const next = [...localData.works];
                          next[i] = { ...next[i], image: "" };
                          update("works", next);
                        }}
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          background: "rgba(239,68,68,0.85)",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`work-img-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        background: "rgba(124,58,237,0.08)",
                        border: "1.5px dashed rgba(124,58,237,0.35)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: "#c4b5fd",
                        fontSize: "12px",
                        fontFamily: "'Inter', sans-serif",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>🖼️</span> Click to upload an image
                      <input
                        id={`work-img-${i}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string;
                            const next = [...localData.works];
                            next[i] = { ...next[i], image: result };
                            update("works", next);
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
                <button
                  onClick={() =>
                    update(
                      "works",
                      localData.works.filter((_, idx) => idx !== i),
                    )
                  }
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "6px",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                update("works", [
                  ...localData.works,
                  { title: "New Project", tag: "Tech Stack", link: "" },
                ])
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(124,58,237,0.15)",
                border: "1px dashed rgba(124,58,237,0.4)",
                borderRadius: "8px",
                color: "#c4b5fd",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Project
            </button>
          </div>
        )}

        {/* ── BADGES ── */}
        {tab === "badges" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ margin: 0, color: "#fff", fontSize: "16px", fontWeight: 600 }}>
              Badges Settings
            </h3>
            <div style={{ marginBottom: "5px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.badges || "BADGES & CERTIFICATIONS"}
                onChange={(e) => update("sectionTitles.badges", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            {(localData.badges || []).map((b, i) => (
              <div
                key={b.id || i}
                style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => {
                    const next = [...(localData.badges || [])];
                    next.splice(i, 1);
                    update("badges", next);
                  }}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "none",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  🗑
                </button>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label className="admin-label">BADGE NAME</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={b.name}
                      onChange={(e) => update(`badges.${i}.name`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">ISSUER (e.g. AWS, Microsoft)</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={b.issuer}
                      onChange={(e) => update(`badges.${i}.issuer`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">DATE EARNED</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={b.date}
                      onChange={(e) => update(`badges.${i}.date`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="admin-label">VERIFICATION LINK</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={b.link}
                      onChange={(e) => update(`badges.${i}.link`, e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="admin-label">BADGE IMAGE</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        className="admin-input"
                        type="text"
                        value={b.image ?? ""}
                        onChange={(e) => update(`badges.${i}.image`, e.target.value)}
                        placeholder="Paste URL or upload..."
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id={`badges-img-${i}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) =>
                              update(`badges.${i}.image`, event.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        onClick={() => document.getElementById(`badges-img-${i}`)?.click()}
                        style={{
                          padding: "8px 12px",
                          background: "rgba(124,58,237,0.2)",
                          border: "1px solid rgba(124,58,237,0.4)",
                          borderRadius: "8px",
                          color: "#c4b5fd",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Upload
                      </button>
                    </div>
                    {b.image && (
                      <div style={{ marginTop: "10px" }}>
                        <img
                          src={b.image}
                          alt="Preview"
                          style={{ height: "60px", borderRadius: "6px", objectFit: "contain" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                update("badges", [
                  ...(localData.badges || []),
                  {
                    id: `badge-${Date.now()}`,
                    name: "New Badge",
                    issuer: "Issuer",
                    date: "Jan 2024",
                    link: "",
                    image: "",
                  },
                ])
              }
              style={{
                padding: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              + Add Badge
            </button>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {tab === "testimonials" && (
          <div>
            <div style={sectionTitle}>Testimonials Settings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.testimonials || "PEOPLE TALK ABOUT ME"}
                onChange={(e) => update("sectionTitles.testimonials", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            {localData.testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "16px",
                  padding: "14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  REVIEW {i + 1}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Quote</label>
                  <textarea
                    className="admin-input"
                    style={{ ...inputStyle, minHeight: "90px" }}
                    value={t.quote}
                    onChange={(e) => {
                      const next = [...localData.testimonials];
                      next[i] = { ...next[i], quote: e.target.value };
                      update("testimonials", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Name</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={t.name}
                    onChange={(e) => {
                      const next = [...localData.testimonials];
                      next[i] = { ...next[i], name: e.target.value };
                      update("testimonials", next);
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Role / Company</label>
                  <input
                    className="admin-input"
                    style={inputStyle}
                    value={t.role}
                    onChange={(e) => {
                      const next = [...localData.testimonials];
                      next[i] = { ...next[i], role: e.target.value };
                      update("testimonials", next);
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    update(
                      "testimonials",
                      localData.testimonials.filter((_, idx) => idx !== i),
                    )
                  }
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "6px",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                update("testimonials", [
                  ...localData.testimonials,
                  { quote: "Write review here.", name: "Name", role: "Role" },
                ])
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(124,58,237,0.15)",
                border: "1px dashed rgba(124,58,237,0.4)",
                borderRadius: "8px",
                color: "#c4b5fd",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Review
            </button>
          </div>
        )}

        {/* ── CONTACT ── */}
        {tab === "contact" && (
          <div>
            <div style={sectionTitle}>Contact Info</div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Location</label>
              <input
                className="admin-input"
                style={inputStyle}
                value={localData.contact.location}
                onChange={(e) => update("contact.location", e.target.value)}
              />
            </div>
            <div
              style={{
                marginTop: "8px",
                padding: "12px",
                background: "rgba(124,58,237,0.08)",
                borderRadius: "8px",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                💡 Email, phone, and social links can be edited in the{" "}
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>Hero</strong> tab.
              </p>
            </div>
          </div>
        )}

        {/* ── MOMENTS ── */}
        {tab === "moments" && (
          <div>
            <div style={sectionTitle}>Moments Settings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.moments || "MY MOMENTS"}
                onChange={(e) => update("sectionTitles.moments", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            <div
              style={{
                padding: "16px",
                background: "rgba(99,102,241,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(99,102,241,0.2)",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  margin: "0 0 12px",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Manage your personal moments gallery — add photos, descriptions, tags and dates for
                meetups, events and memories.
              </p>
              <Link
                to="/moments"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                📸 Go to Moments Page
              </Link>
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "12px",
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                💡 You currently have{" "}
                <strong style={{ color: "#a5b4fc" }}>
                  {localData.moments?.length ?? 0} moment(s)
                </strong>{" "}
                with{" "}
                <strong style={{ color: "#a5b4fc" }}>
                  {localData.moments?.reduce(
                    (s, m) => s + (m.images?.filter(Boolean).length ?? 0),
                    0,
                  ) ?? 0}{" "}
                  photo(s)
                </strong>
                . To add, edit or delete moments and upload photos, visit the Moments page above.
              </p>
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === "skills" && (
          <div>
            <div style={sectionTitle}>Skills Settings</div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                SECTION TITLE
              </label>
              <input
                type="text"
                value={localData.sectionTitles?.skills || "SKILLS & TOOLS"}
                onChange={(e) => update("sectionTitles.skills", e.target.value)}
                className="admin-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(6,182,212,0.06)",
                borderRadius: "10px",
                border: "1px solid rgba(6,182,212,0.15)",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  margin: 0,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Manage your interactive skill tree. Each skill appears as an orb in the game-like
                visualization. Set a proficiency level (0–100), pick a category for color coding,
                and assign XP that visitors earn by clicking.
              </p>
            </div>

            {/* Category legend */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              {(["language", "libraries", "tools", "databases", "security"] as const).map((cat) => {
                const meta: Record<string, { label: string; color: string }> = {
                  language: { label: "Language", color: "#a855f7" },
                  libraries: { label: "Libraries & Frameworks", color: "#06b6d4" },
                  tools: { label: "Tools & Platforms", color: "#f59e0b" },
                  databases: { label: "Databases", color: "#10b981" },
                  security: { label: "Security", color: "#ef4444" },
                };
                const m = meta[cat];
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: m.color,
                        boxShadow: `0 0 6px ${m.color}`,
                      }}
                    />
                    <span
                      style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}
                    >
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {localData.skills?.map((s, i) => {
              const catColors: Record<string, string> = {
                language: "#a855f7",
                libraries: "#06b6d4",
                tools: "#f59e0b",
                databases: "#10b981",
                security: "#ef4444",
              };
              const borderColor = catColors[s.category] ?? "#64748b";
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${borderColor}33`,
                    position: "relative",
                  }}
                >
                  {/* Skill number badge */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{s.icon || "💡"}</span>
                      <span style={{ color: borderColor, fontSize: "13px", fontWeight: 700 }}>
                        {s.name || `Skill ${i + 1}`}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: borderColor,
                        background: `${borderColor}15`,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        border: `1px solid ${borderColor}33`,
                      }}
                    >
                      {s.level}%
                    </span>
                  </div>

                  {/* Name + Icon row */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Name</label>
                      <input
                        className="admin-input"
                        style={inputStyle}
                        value={s.name}
                        onChange={(e) => {
                          const next = [...localData.skills];
                          next[i] = { ...next[i], name: e.target.value };
                          update("skills", next);
                        }}
                      />
                    </div>
                    <div style={{ width: "80px" }}>
                      <label style={labelStyle}>Icon</label>
                      <input
                        className="admin-input"
                        style={{ ...inputStyle, textAlign: "center", fontSize: "18px" }}
                        value={s.icon}
                        onChange={(e) => {
                          const next = [...localData.skills];
                          next[i] = { ...next[i], icon: e.target.value };
                          update("skills", next);
                        }}
                      />
                    </div>
                  </div>

                  {/* Category + XP row */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Category</label>
                      <select
                        className="admin-input"
                        style={{
                          ...inputStyle,
                          appearance: "none",
                          background: `rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 10px center`,
                          paddingRight: "28px",
                          cursor: "pointer",
                        }}
                        value={s.category}
                        onChange={(e) => {
                          const next = [...localData.skills];
                          next[i] = { ...next[i], category: e.target.value as SkillCategory };
                          update("skills", next);
                        }}
                      >
                        <option value="language" style={{ background: "#1a1a2e" }}>
                          💜 Language
                        </option>
                        <option value="libraries" style={{ background: "#1a1a2e" }}>
                          🩵 Libraries & Frameworks
                        </option>
                        <option value="tools" style={{ background: "#1a1a2e" }}>
                          🟡 Tools & Platforms
                        </option>
                        <option value="databases" style={{ background: "#1a1a2e" }}>
                          🟢 Databases
                        </option>
                        <option value="security" style={{ background: "#1a1a2e" }}>
                          🔴 Security
                        </option>
                      </select>
                    </div>
                    <div style={{ width: "100px" }}>
                      <label style={labelStyle}>XP Reward</label>
                      <input
                        className="admin-input"
                        style={{ ...inputStyle, textAlign: "center" }}
                        type="number"
                        min={10}
                        max={500}
                        step={5}
                        value={s.xp}
                        onChange={(e) => {
                          const next = [...localData.skills];
                          next[i] = {
                            ...next[i],
                            xp: Math.max(10, Math.min(500, parseInt(e.target.value) || 100)),
                          };
                          update("skills", next);
                        }}
                      />
                    </div>
                  </div>

                  {/* Level slider */}
                  <div style={{ marginBottom: "6px" }}>
                    <label style={labelStyle}>Proficiency Level: {s.level}%</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={s.level}
                        onChange={(e) => {
                          const next = [...localData.skills];
                          next[i] = { ...next[i], level: parseInt(e.target.value) };
                          update("skills", next);
                        }}
                        style={{ flex: 1, accentColor: borderColor, cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      update(
                        "skills",
                        localData.skills.filter((_: unknown, idx: number) => idx !== i),
                      )
                    }
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: "6px",
                      color: "#f87171",
                      cursor: "pointer",
                      padding: "5px 10px",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Remove Skill
                  </button>
                </div>
              );
            })}

            <button
              onClick={() =>
                update("skills", [
                  ...(localData.skills ?? []),
                  {
                    name: "New Skill",
                    level: 50,
                    category: "tools" as SkillCategory,
                    icon: "💡",
                    xp: 100,
                  },
                ])
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(6,182,212,0.12)",
                border: "1px dashed rgba(6,182,212,0.35)",
                borderRadius: "8px",
                color: "#7dd3fc",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              + Add Skill
            </button>
          </div>
        )}

        {/* ── COMMENTS ── */}
        {tab === "comments" && <AdminCommentsTab localData={localData} update={update} />}

        {/* ── LOGS ── */}
        {tab === "logs" && <AdminLogsTab />}
      </div>

      {/* Footer Save */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        <button
          id="admin-save-btn"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: "100%",
            padding: "12px",
            background: saved
              ? "linear-gradient(135deg, #10b981, #059669)"
              : isSaving
              ? "linear-gradient(135deg, #4b5563, #374151)"
              : "linear-gradient(135deg, #7c3aed, #2563eb)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            fontFamily: "'Poppins', sans-serif",
            cursor: isSaving ? "wait" : "pointer",
            transition: "all 0.3s ease",
            letterSpacing: "0.03em",
          }}
        >
          {isSaving ? "⏳ Saving..." : saved ? "✓ Saved!" : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ─── Admin Comments Tab ─────────────────────────────────────────── */

function relTimeShort(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30
    ? `${d}d ago`
    : new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function AdminCommentsTab({
  localData,
  update,
}: {
  localData: any;
  update: (path: string, value: any) => void;
}) {
  const { comments, viewCount, deleteComment, togglePin, setManualViewCount } = useComments();
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Local state for manually setting the count
  const [manualCountInput, setManualCountInput] = useState(viewCount.toString());

  // Keep input in sync if it changes externally
  useEffect(() => {
    setManualCountInput(viewCount.toString());
  }, [viewCount]);

  const handleUpdateViewCount = () => {
    const val = parseInt(manualCountInput, 10);
    if (!isNaN(val) && val >= 0) {
      setManualViewCount(val);
      alert("View count updated successfully!");
    }
  };

  const sorted = [
    ...comments.filter((c) => c.pinned).sort((a, b) => b.timestamp - a.timestamp),
    ...comments.filter((c) => !c.pinned).sort((a, b) => b.timestamp - a.timestamp),
  ];

  return (
    <div>
      <style>{`
        .admin-cmt-scroll::-webkit-scrollbar { width: 3px; }
        .admin-cmt-scroll::-webkit-scrollbar-track { background: transparent; }
        .admin-cmt-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
      `}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "Views", value: viewCount, color: "#a5b4fc" },
          { label: "Comments", value: comments.length, color: "#f9a8d4" },
          { label: "Pinned", value: comments.filter((c) => c.pinned).length, color: "#fde047" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                color,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                color: "rgba(255,255,255,0.35)",
                marginTop: "3px",
                letterSpacing: "0.06em",
              }}
            >
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* ── View Counter Controls ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              View Counter Badge
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Show or hide the public views badge.
            </div>
          </div>
          <button
            onClick={() =>
              update("viewCounterConfig.enabled", !(localData?.viewCounterConfig?.enabled ?? true))
            }
            style={{
              padding: "6px 14px",
              background:
                (localData?.viewCounterConfig?.enabled ?? true)
                  ? "rgba(167,139,250,0.2)"
                  : "rgba(255,255,255,0.1)",
              color: (localData?.viewCounterConfig?.enabled ?? true) ? "#c084fc" : "#fff",
              border:
                (localData?.viewCounterConfig?.enabled ?? true)
                  ? "1px solid rgba(167,139,250,0.4)"
                  : "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {(localData?.viewCounterConfig?.enabled ?? true) ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Manually Edit Views
            </label>
            <input
              type="number"
              min="0"
              value={manualCountInput}
              onChange={(e) => setManualCountInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={handleUpdateViewCount}
            style={{
              padding: "10px 16px",
              background: "rgba(99,102,241,0.2)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            Update Count
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ALL COMMENTS ({comments.length})
        </span>
        {comments.length > 0 &&
          (confirmClearAll ? (
            <button
              onClick={() => {
                sorted.forEach((c) => deleteComment(c.id));
                setConfirmClearAll(false);
              }}
              style={{
                padding: "4px 10px",
                background: "rgba(239,68,68,0.4)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ⚠ Confirm Delete All
            </button>
          ) : (
            <button
              onClick={() => setConfirmClearAll(true)}
              style={{
                padding: "4px 10px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "6px",
                color: "#f87171",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Delete All
            </button>
          ))}
      </div>
      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 16px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
          }}
        >
          No comments yet.
        </div>
      ) : (
        <div
          className="admin-cmt-scroll"
          style={{
            maxHeight: "420px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {sorted.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                background: c.pinned ? "rgba(250,204,21,0.06)" : "rgba(255,255,255,0.03)",
                border: c.pinned
                  ? "1px solid rgba(250,204,21,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              {c.pinned && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    fontSize: "9px",
                    background: "rgba(250,204,21,0.2)",
                    border: "1px solid rgba(250,204,21,0.35)",
                    borderRadius: "4px",
                    padding: "1px 6px",
                    color: "#fde047",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  📌 PINNED
                </span>
              )}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c.avatarColor || pickAvatarColor(c.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {c.avatar || getInitials(c.name) || "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "#e2e8f0",
                      }}
                    >
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {relTimeShort(c.timestamp)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.6)",
                      margin: "0 0 8px",
                      lineHeight: 1.55,
                      wordBreak: "break-word",
                    }}
                  >
                    {c.message}
                  </p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => togglePin(c.id)}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "6px",
                        border: "none",
                        background: c.pinned ? "rgba(250,204,21,0.2)" : "rgba(99,102,241,0.18)",
                        color: c.pinned ? "#fde047" : "#a5b4fc",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {c.pinned ? "📌 Unpin" : "📌 Pin"}
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      style={{
                        padding: "3px 9px",
                        borderRadius: "6px",
                        border: "none",
                        background: "rgba(239,68,68,0.14)",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminLogsTab() {
  const { visits, edits } = useLogs();
  const [logTab, setLogTab] = useState<"visits" | "edits">("visits");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "10px",
          padding: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "8px",
        }}
      >
        <h4
          style={{
            margin: "0 0 4px 0",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "14px",
          }}
        >
          System Logs
        </h4>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          View visitor history and track recent administrative changes.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          background: "rgba(0,0,0,0.2)",
          padding: "6px",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={() => setLogTab("visits")}
          style={{
            flex: 1,
            padding: "8px",
            border: "none",
            borderRadius: "6px",
            background: logTab === "visits" ? "rgba(124, 58, 237, 0.2)" : "transparent",
            color: logTab === "visits" ? "#c4b5fd" : "rgba(255,255,255,0.5)",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Visitor Logs ({visits.length})
        </button>
        <button
          onClick={() => setLogTab("edits")}
          style={{
            flex: 1,
            padding: "8px",
            border: "none",
            borderRadius: "6px",
            background: logTab === "edits" ? "rgba(124, 58, 237, 0.2)" : "transparent",
            color: logTab === "edits" ? "#c4b5fd" : "rgba(255,255,255,0.5)",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Admin Edits ({edits.length})
        </button>
      </div>

      {logTab === "visits" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
          className="admin-panel-scroll"
        >
          {visits.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: "12px",
                margin: "20px 0",
              }}
            >
              No visits recorded yet.
            </p>
          ) : (
            visits.map((v) => {
              const dt = v.timestamp?.toDate ? v.timestamp.toDate() : new Date(v.timestamp);
              return (
                <div
                  key={v.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "12px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      🌍 {v.location}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "10px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {dt?.toLocaleString() || "Unknown Date"}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "11px",
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: "4px",
                    }}
                  >
                    <strong>IP:</strong> {v.ip}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "10px",
                      fontFamily: "'Inter', sans-serif",
                      wordBreak: "break-all",
                    }}
                  >
                    {v.device}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {logTab === "edits" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
          className="admin-panel-scroll"
        >
          {edits.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: "12px",
                margin: "20px 0",
              }}
            >
              No edits recorded yet.
            </p>
          ) : (
            edits.map((e) => {
              const dt = e.timestamp?.toDate ? e.timestamp.toDate() : new Date(e.timestamp);
              return (
                <div
                  key={e.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#fbbf24",
                        fontWeight: 600,
                        fontSize: "12px",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ✏️ {e.action}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "10px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {dt?.toLocaleString() || "Unknown Date"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span>🌍 {e.adminLocation || "Unknown Location"}</span>
                    <span>IP: {e.adminIp || "Unknown"}</span>
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "11px",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {e.diffs && e.diffs.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          marginTop: "8px",
                          background: "rgba(0,0,0,0.2)",
                          padding: "8px",
                          borderRadius: "6px",
                        }}
                      >
                        {e.diffs.map((diff, i) => (
                          <div
                            key={i}
                            style={{
                              fontFamily: "monospace",
                              fontSize: "10px",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {diff.split("->").length === 2 ? (
                              <>
                                <span style={{ color: "#a78bfa" }}>{diff.split(":")[0]}:</span>
                                <span
                                  style={{
                                    color: "#f87171",
                                    textDecoration: "line-through",
                                    margin: "0 4px",
                                  }}
                                >
                                  {diff.split(":")[1]?.split("->")[0]?.trim()}
                                </span>
                                <span style={{ color: "#4ade80" }}>
                                  {diff.split("->")[1]?.trim()}
                                </span>
                              </>
                            ) : (
                              <span style={{ color: "#a78bfa" }}>{diff}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                        No changes detected in payload.
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
