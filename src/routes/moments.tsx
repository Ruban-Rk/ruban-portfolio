import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdmin, generateMomentId } from "@/hooks/use-admin";
import type { MomentItem } from "@/hooks/use-admin";
import MatrixRain from "@/components/MatrixRain";
import ThemeToggle from "@/components/ThemeToggle";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Tag,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Upload,
  Star,
  Menu,
  Linkedin,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/moments")({
  head: () => ({
    meta: [
      { title: "My Moments — Ruban Kumar R" },
      {
        name: "description",
        content:
          "Favourite memories, meetups and events captured — Ruban Kumar R's personal gallery.",
      },
    ],
  }),
  component: MomentsPage,
});

/* ──────────────────────────────────────────────────────────────────
   Tag color palette (cycles)
────────────────────────────────────────────────────────────────── */
const TAG_COLORS = [
  { bg: "rgba(99,102,241,0.18)", border: "rgba(99,102,241,0.5)", text: "#a5b4fc" },
  { bg: "rgba(236,72,153,0.18)", border: "rgba(236,72,153,0.5)", text: "#f9a8d4" },
  { bg: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.5)", text: "#86efac" },
  { bg: "rgba(251,146,60,0.18)", border: "rgba(251,146,60,0.5)", text: "#fdba74" },
  { bg: "rgba(14,165,233,0.18)", border: "rgba(14,165,233,0.5)", text: "#7dd3fc" },
  { bg: "rgba(250,204,21,0.18)", border: "rgba(250,204,21,0.5)", text: "#fde047" },
];

function TagBadge({ tag, idx }: { tag: string; idx: number }) {
  const c = TAG_COLORS[idx % TAG_COLORS.length];
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "50px",
        fontSize: "11px",
        fontWeight: 600,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        letterSpacing: "0.06em",
        fontFamily: "'Inter', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {tag}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Lightbox
────────────────────────────────────────────────────────────────── */
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: 42,
          height: 42,
          cursor: "pointer",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute",
              left: 20,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 46,
              height: 46,
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute",
              right: 20,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 46,
              height: 46,
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <img
        src={images[idx]}
        alt={`Photo ${idx + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "88vw",
          maxHeight: "85vh",
          objectFit: "contain",
          borderRadius: "12px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          animation: "lightboxFadeIn 0.25s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            style={{
              width: i === idx ? 24 : 8,
              height: 8,
              borderRadius: "4px",
              background: i === idx ? "#a5b4fc" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes lightboxFadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Moment Card
────────────────────────────────────────────────────────────────── */
function MomentCard({
  moment,
  onEdit,
  onDelete,
}: {
  moment: MomentItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { isAdmin } = useAdmin();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const filledImages = moment.images.filter(Boolean);
  const coverSrc = filledImages[moment.coverIndex] ?? filledImages[0] ?? null;
  const formattedDate = moment.date
    ? new Date(moment.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      {lightboxIdx !== null && filledImages.length > 0 && (
        <Lightbox
          images={filledImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--color-card)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 24px 60px -16px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.15)"
            : "0 4px 20px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Admin controls */}
        {isAdmin && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              display: "flex",
              gap: "6px",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            <button
              onClick={onEdit}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.85)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.85)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {/* LinkedIn badge - visible when linkedinUrl is set */}
        {moment.linkedinUrl && (
          <a
            href={moment.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              background: "rgba(10,102,194,0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: "50px",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              textDecoration: "none",
              opacity: hovered ? 1 : 0.7,
              transition: "opacity 0.2s, transform 0.2s",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Linkedin size={12} />
            LinkedIn Post
          </a>
        )}

        {/* Cover image / placeholder */}
        <div
          style={{
            width: "100%",
            height: 220,
            position: "relative",
            overflow: "hidden",
            background: coverSrc
              ? "transparent"
              : "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(236,72,153,0.12) 100%)",
            cursor: moment.linkedinUrl ? "pointer" : filledImages.length > 0 ? "pointer" : "default",
          }}
          onClick={() => {
            if (moment.linkedinUrl) {
              window.open(moment.linkedinUrl, "_blank", "noopener,noreferrer");
            } else if (filledImages.length > 0) {
              setLightboxIdx(0);
            }
          }}
        >
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={moment.title}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {moment.linkedinUrl ? (
                <>
                  <Linkedin size={36} style={{ color: "rgba(10,102,194,0.5)" }} />
                  <span style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif", color: "rgba(10,102,194,0.7)" }}>
                    Tap to view on LinkedIn
                  </span>
                </>
              ) : (
                <>
                  <Camera size={36} />
                  <span style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                    No photos yet
                  </span>
                </>
              )}
            </div>
          )}

          {/* Image count badge - only show if not linkedin-primary */}
          {filledImages.length > 1 && !moment.linkedinUrl && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                borderRadius: "50px",
                padding: "3px 10px",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Camera size={11} /> {filledImages.length}
            </div>
          )}

          {/* LinkedIn overlay on hover when linkedinUrl is set */}
          {moment.linkedinUrl && hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(10,102,194,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                backdropFilter: "blur(2px)",
                transition: "opacity 0.3s",
              }}
            >
              <ExternalLink size={20} />
              View LinkedIn Post
            </div>
          )}

          {/* Gradient overlay */}
          {coverSrc && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
              }}
            />
          )}
        </div>

        {/* Thumbnail strip */}
        {filledImages.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              padding: "6px 10px",
              overflowX: "auto",
              background: "rgba(0,0,0,0.08)",
              scrollbarWidth: "none",
            }}
          >
            {filledImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`thumb ${i + 1}`}
                loading="lazy"
                decoding="async"
                onClick={() => setLightboxIdx(i)}
                style={{
                  width: 48,
                  height: 36,
                  objectFit: "cover",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: i === moment.coverIndex ? "2px solid #a5b4fc" : "2px solid transparent",
                  flexShrink: 0,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
            ))}
          </div>
        )}

        {/* Card body */}
        <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3
            style={{
              color: "var(--color-primary)",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {moment.title}
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {formattedDate && (
              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "rgba(var(--foreground),0.5)", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                <Calendar size={12} style={{ opacity: 0.6 }} />
                <span style={{ color: "var(--color-muted-foreground)" }}>{formattedDate}</span>
              </span>
            )}
            {moment.location && (
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                <MapPin size={12} style={{ color: "#f9a8d4" }} />
                <span style={{ color: "var(--color-muted-foreground)" }}>{moment.location}</span>
              </span>
            )}
          </div>

          {moment.description && (
            <p
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "13.5px",
                lineHeight: 1.65,
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {moment.description}
            </p>
          )}

          {moment.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
              {moment.tags.map((t, i) => (
                <TagBadge key={t + i} tag={t} idx={i} />
              ))}
            </div>
          )}

          {/* LinkedIn CTA button at bottom of card */}
          {moment.linkedinUrl && (
            <a
              href={moment.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginTop: "8px",
                padding: "8px 16px",
                background: "rgba(10,102,194,0.15)",
                border: "1px solid rgba(10,102,194,0.4)",
                borderRadius: "50px",
                color: "#60a5fa",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                textDecoration: "none",
                alignSelf: "flex-start",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,102,194,0.3)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(10,102,194,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,102,194,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(10,102,194,0.4)";
              }}
            >
              <Linkedin size={13} />
              View LinkedIn Post
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </article>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Moment Editor Modal (admin only)
────────────────────────────────────────────────────────────────── */
function MomentEditor({
  moment,
  onSave,
  onCancel,
}: {
  moment: MomentItem;
  onSave: (m: MomentItem) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<MomentItem>({ ...moment, images: [...moment.images] });
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const update = <K extends keyof MomentItem>(key: K, val: MomentItem[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !data.tags.includes(t)) {
      update("tags", [...data.tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (idx: number) => update("tags", data.tags.filter((_, i) => i !== idx));

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setUploading(true);
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setData((d) => ({ ...d, images: [...d.images, result] }));
          setUploading(false);
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const removeImage = (idx: number) => {
    const imgs = data.images.filter((_, i) => i !== idx);
    update("images", imgs);
    if (data.coverIndex >= imgs.length) update("coverIndex", Math.max(0, imgs.length - 1));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 13px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    cursor: "text",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Restore native cursor inside the editor modal */}
      <style>{`
        [data-moment-editor] input,
        [data-moment-editor] textarea,
        [data-moment-editor] button,
        [data-moment-editor] label,
        [data-moment-editor] * {
          cursor: auto !important;
        }
        [data-moment-editor] button,
        [data-moment-editor] [role="button"] {
          cursor: pointer !important;
        }
        [data-moment-editor] input,
        [data-moment-editor] textarea {
          cursor: text !important;
        }
      `}</style>
      <div
        data-moment-editor
        style={{
          background: "linear-gradient(180deg, #0c0c1e, #0f0f22)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "20px",
          width: "min(600px, 96vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: 700, margin: 0 }}>
            {data.id.startsWith("moment-new") ? "✨ Add New Moment" : "✏️ Edit Moment"}
          </h2>
          <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>MOMENT TITLE *</label>
            <input style={inputStyle} value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Chennai Tech Meetup 2025" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* Date */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>DATE</label>
              <input type="date" style={{ ...inputStyle, colorScheme: "dark", cursor: "pointer" }} value={data.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            {/* Location */}
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>LOCATION</label>
              <input style={inputStyle} value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Linkedin size={12} style={{ color: "#60a5fa" }} />
                LINKEDIN POST URL
              </span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: data.linkedinUrl ? "rgba(10,102,194,0.5)" : "rgba(255,255,255,0.1)" }}
              value={data.linkedinUrl ?? ""}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://www.linkedin.com/posts/..."
              type="url"
            />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "5px", fontFamily: "'Inter', sans-serif" }}>
              When set, touching this moment will open your LinkedIn post.
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>DESCRIPTION</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What made this moment special?"
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px", fontFamily: "'Inter', sans-serif" }}>TAGS</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag & press Enter"
              />
              <button onClick={addTag} style={{ padding: "10px 14px", background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: "10px", color: "#a5b4fc", cursor: "pointer", flexShrink: 0 }}>
                <Plus size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {data.tags.map((t, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: TAG_COLORS[i % TAG_COLORS.length].bg, border: `1px solid ${TAG_COLORS[i % TAG_COLORS.length].border}`, borderRadius: "50px", color: TAG_COLORS[i % TAG_COLORS.length].text, fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
                  {t}
                  <button onClick={() => removeTag(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, padding: 0, display: "flex", lineHeight: 1 }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>PHOTOS</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "16px",
                background: uploading ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                border: "2px dashed rgba(99,102,241,0.35)",
                borderRadius: "12px",
                color: "#a5b4fc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              <Upload size={16} />
              {uploading ? "Uploading…" : "Click to upload photos"}
            </button>

            {/* Preview grid */}
            {data.images.filter(Boolean).length > 0 && (
              <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
                {data.images.filter(Boolean).map((src, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: data.coverIndex === i ? "2px solid #a5b4fc" : "2px solid transparent",
                      cursor: "pointer",
                      aspectRatio: "1",
                    }}
                    onClick={() => update("coverIndex", i)}
                    title="Click to set as cover"
                  >
                    <img src={src} alt={`img ${i}`} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {data.coverIndex === i && (
                      <div style={{ position: "absolute", top: 4, left: 4, background: "#6366f1", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Star size={10} fill="#fff" color="#fff" />
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      style={{ position: "absolute", top: 4, right: 4, background: "rgba(239,68,68,0.85)", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>
              Click a photo to set it as cover. ⭐ = current cover.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px" }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            disabled={!data.title.trim()}
            style={{ padding: "10px 24px", background: data.title.trim() ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(99,102,241,0.3)", border: "none", borderRadius: "10px", color: "#fff", cursor: data.title.trim() ? "pointer" : "not-allowed", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px" }}
          >
            Save Moment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Main Page
────────────────────────────────────────────────────────────────── */
function MomentsPage() {
  const { portfolioData, updatePortfolioData, isAdmin, setShowLoginModal } = useAdmin();
  const moments = portfolioData.moments;
  const [editingMoment, setEditingMoment] = useState<MomentItem | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(moments.flatMap((m) => m.tags)));

  const saveMoment = (m: MomentItem) => {
    const exists = moments.find((x) => x.id === m.id);
    const next = exists
      ? moments.map((x) => (x.id === m.id ? m : x))
      : [...moments, m];
    updatePortfolioData({ moments: next });
    setEditingMoment(null);
  };

  const deleteMoment = (id: string) => {
    if (!confirm("Delete this moment?")) return;
    updatePortfolioData({ moments: moments.filter((m) => m.id !== id) });
  };

  const filteredMoments = filterTag
    ? moments.filter((m) => m.tags.includes(filterTag))
    : moments;

  return (
    <>
      {editingMoment && (
        <MomentEditor
          moment={editingMoment}
          onSave={saveMoment}
          onCancel={() => setEditingMoment(null)}
        />
      )}

      <div className="min-h-screen bg-transparent transition-colors duration-500 relative z-0">
        <MatrixRain />
        <div className="mx-auto max-w-[1280px] bg-card/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.25)] transition-colors duration-500 min-h-screen relative z-10 backdrop-blur-sm">
          {/* ── Nav ── */}
          <MomentsNav isAdmin={isAdmin} onAdminClick={() => setShowLoginModal(true)} />

          {/* ── Hero Banner ── */}
          <section
            style={{
              padding: "60px 32px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -60, left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, right: "10%", width: 250, height: 250, background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <ScrollReveal variant="scale">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "50px", marginBottom: "20px" }}>
                <Camera size={14} style={{ color: "#a5b4fc" }} />
                <span style={{ color: "#a5b4fc", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif" }}>PERSONAL GALLERY</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={100}>
              <h1
                className="text-5xl md:text-6xl font-extrabold text-primary"
                style={{ lineHeight: 1.1, marginBottom: "16px" }}
              >
                {portfolioData.sectionTitles?.moments || (
                  <>
                    My{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Moments
                    </span>
                  </>
                )}
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "16px", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}
              >
                Favourite memories — meetups, events, workshops &amp; adventures captured in time.
              </p>
            </ScrollReveal>

            {/* Stats row */}
            <ScrollReveal variant="fade-up" delay={300}>
              <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                {[
                  { num: moments.length, label: "Moments" },
                  { num: moments.reduce((s, m) => s + m.images.filter(Boolean).length, 0), label: "Photos" },
                  { num: allTags.length, label: "Categories" },
                ].map(({ num, label }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: 800,
                        fontFamily: "'Poppins', sans-serif",
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {num}
                    </div>
                    <div style={{ color: "var(--color-muted-foreground)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Inter', sans-serif" }}>
                      {label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* ── Filter Tags + Add Button ── */}
          <div
            style={{
              padding: "0 32px 28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1, alignItems: "center" }}>
              <Tag size={14} style={{ color: "var(--color-muted-foreground)", flexShrink: 0 }} />
              <button
                onClick={() => setFilterTag(null)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "50px",
                  background: filterTag === null ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                  border: filterTag === null ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  color: filterTag === null ? "#a5b4fc" : "var(--color-muted-foreground)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                All
              </button>
              {allTags.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setFilterTag(filterTag === t ? null : t)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "50px",
                    background: filterTag === t ? TAG_COLORS[i % TAG_COLORS.length].bg : "rgba(255,255,255,0.05)",
                    border: filterTag === t ? `1px solid ${TAG_COLORS[i % TAG_COLORS.length].border}` : "1px solid rgba(255,255,255,0.1)",
                    color: filterTag === t ? TAG_COLORS[i % TAG_COLORS.length].text : "var(--color-muted-foreground)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                id="add-moment-btn"
                onClick={() =>
                  setEditingMoment({
                    id: generateMomentId(),
                    title: "",
                    description: "",
                    date: new Date().toISOString().split("T")[0],
                    location: "",
                    tags: [],
                    images: [],
                    coverIndex: 0,
                  })
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 20px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  border: "none",
                  borderRadius: "50px",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(99,102,241,0.5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)"; }}
              >
                <Plus size={15} /> Add Moment
              </button>
            )}
          </div>

          {/* ── Masonry / Card Grid ── */}
          <section style={{ padding: "0 28px 60px" }}>
            {filteredMoments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--color-muted-foreground)" }}>
                <Camera size={52} style={{ opacity: 0.2, marginBottom: "16px" }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                  {filterTag ? `No moments tagged "${filterTag}"` : "No moments yet"}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", opacity: 0.6 }}>
                  {isAdmin ? 'Click "Add Moment" to create your first memory.' : "Check back soon!"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                {filteredMoments.map((m, i) => (
                  <ScrollReveal key={m.id} variant="fade-up" delay={i * 80}>
                    <MomentCard
                      moment={m}
                      onEdit={() => setEditingMoment({ ...m, images: [...m.images] })}
                      onDelete={() => deleteMoment(m.id)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>

          {/* ── Footer ── */}
          <footer
            className="px-6 py-8 md:px-14 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-border"
          >
            <div
              style={{ fontFamily: "Caveat, cursive", fontSize: "24px" }}
              className="text-primary"
            >
              {portfolioData.hero.name}
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {portfolioData.hero.name} Kumar R. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

/* ── Moments Page Nav ─────────────────────────────────────────── */
function MomentsNav({ isAdmin, onAdminClick }: { isAdmin: boolean; onAdminClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { portfolioData } = useAdmin();

  return (
    <header className="sticky top-0 z-50 glass rounded-b-2xl mx-2 md:mx-4 flex items-center justify-between px-4 py-3 md:px-14 md:py-5 transition-all duration-300">
      <Link
        to="/"
        style={{ fontFamily: "Caveat, cursive", fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 700 }}
        className="text-primary transition-transform duration-300 hover:scale-105 z-50"
      >
        {portfolioData.hero.name}
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] font-semibold text-primary">
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
          className="hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          <ArrowLeft size={13} /> PORTFOLIO
        </Link>
        <span
          style={{
            padding: "6px 16px",
            borderRadius: "50px",
            background: "rgba(99,102,241,0.18)",
            border: "1px solid rgba(99,102,241,0.4)",
            color: "#a5b4fc",
          }}
        >
          MOMENTS
        </span>
        {!isAdmin && (
          <button
            onClick={onAdminClick}
            style={{ background: "none", border: "none", color: "transparent", cursor: "default", fontSize: "1px", padding: 0 }}
            aria-label="Admin"
            id="moments-admin-trigger"
          />
        )}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3 z-50">
        <ThemeToggle />
        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border glass"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 top-0 left-0 h-screen w-full glass-strong z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-sm tracking-[0.2em] font-bold text-primary">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> PORTFOLIO
          </Link>
          <span style={{ color: "#a5b4fc" }}>MOMENTS</span>
        </nav>
      </div>
    </header>
  );
}
