import { useState, useRef, useEffect } from "react";
import { useComments } from "@/hooks/use-comments";
import type { Comment } from "@/hooks/use-comments";
import { useAdmin } from "@/hooks/use-admin";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Pin,
  Trash2,
  Send,
  Eye,
  MessageSquare,
  Star,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   Relative time formatter
────────────────────────────────────────────────────────────────── */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ──────────────────────────────────────────────────────────────────
   Animated counter
────────────────────────────────────────────────────────────────── */
function AnimatedCount({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const startVal = 0;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target]);

  return <>{display.toLocaleString()}</>;
}

/* ──────────────────────────────────────────────────────────────────
   Avatar circle
────────────────────────────────────────────────────────────────── */
function Avatar({
  initials,
  color,
  size = 44,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 800,
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        userSelect: "none",
      }}
    >
      {initials || "?"}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Single Comment Card
────────────────────────────────────────────────────────────────── */
function CommentCard({
  comment,
  onDelete,
  onTogglePin,
  isAdmin,
  isNew,
}: {
  comment: Comment;
  onDelete: () => void;
  onTogglePin: () => void;
  isAdmin: boolean;
  isNew: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDelete(false);
      }}
      style={{
        position: "relative",
        padding: "18px 20px",
        borderRadius: "16px",
        border: comment.pinned
          ? "1px solid rgba(250,204,21,0.35)"
          : "1px solid rgba(255,255,255,0.06)",
        background: comment.pinned
          ? "linear-gradient(135deg, rgba(250,204,21,0.05) 0%, rgba(245,158,11,0.04) 100%)"
          : isNew
            ? "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)"
            : "rgba(255,255,255,0.025)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? comment.pinned
            ? "0 12px 40px -8px rgba(250,204,21,0.12)"
            : "0 12px 40px -8px rgba(99,102,241,0.12)"
          : "none",
        animation: isNew ? "commentSlideIn 0.5s cubic-bezier(0.16,1,0.3,1)" : undefined,
      }}
    >
      <style>{`
        @keyframes commentSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Pin badge */}
      {comment.pinned && (
        <div
          style={{
            position: "absolute",
            top: -1,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "linear-gradient(135deg, #f59e0b, #eab308)",
            borderRadius: "0 0 10px 10px",
            padding: "3px 10px",
            fontSize: "10px",
            fontWeight: 700,
            color: "#000",
            letterSpacing: "0.08em",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
          }}
        >
          <Pin size={9} /> PINNED
        </div>
      )}

      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <Avatar initials={comment.avatar} color={comment.avatarColor} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "14px",
                fontFamily: "'Poppins', sans-serif",
                color: "var(--color-primary)",
              }}
            >
              {comment.name}
            </span>
            {isNew && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: "50px",
                  padding: "1px 8px",
                  color: "#a5b4fc",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                NEW
              </span>
            )}
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-muted-foreground)",
                fontFamily: "'Inter', sans-serif",
                marginLeft: "auto",
              }}
            >
              {relativeTime(comment.timestamp)}
            </span>
          </div>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--color-primary)",
              fontFamily: "'Inter', sans-serif",
              margin: 0,
              wordBreak: "break-word",
              opacity: 0.85,
            }}
          >
            {comment.message}
          </p>
        </div>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 16,
            display: "flex",
            gap: "6px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          {/* Pin/Unpin */}
          <button
            onClick={onTogglePin}
            title={comment.pinned ? "Unpin comment" : "Pin comment"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "8px",
              border: "none",
              background: comment.pinned ? "rgba(250,204,21,0.2)" : "rgba(99,102,241,0.2)",
              color: comment.pinned ? "#fde047" : "#a5b4fc",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <Pin size={12} />
            {comment.pinned ? "Unpin" : "Pin"}
          </button>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete comment"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(239,68,68,0.15)",
                color: "#f87171",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
              }}
            >
              <Trash2 size={12} />
              Delete
            </button>
          ) : (
            <button
              onClick={onDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 14px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(239,68,68,0.4)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                animation: "pulse 0.3s ease",
              }}
            >
              <AlertCircle size={12} /> Confirm Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Comment Form
────────────────────────────────────────────────────────────────── */
function CommentForm({ onSubmit }: { onSubmit: (name: string, msg: string) => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState<"name" | "msg" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!message.trim()) {
      setError("Please write a message before submitting.");
      msgRef.current?.focus();
      return;
    }
    setError("");
    onSubmit(name, message);
    setSubmitted(true);
    setName("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 3500);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid",
    background: "rgba(255,255,255,0.04)",
    color: "var(--color-primary)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s, background 0.25s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        padding: "28px",
        backdropFilter: "blur(8px)",
      }}
    >
      <h3
        style={{
          color: "var(--color-primary)",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "17px",
          fontWeight: 700,
          margin: "0 0 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <MessageSquare size={18} style={{ color: "var(--color-accent)" }} />
        Leave a Comment
      </h3>

      <div style={{ display: "grid", gap: "14px" }}>
        {/* Name field */}
        <div>
          <label
            style={{
              display: "block",
              color: "var(--color-muted-foreground)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              marginBottom: "6px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            YOUR NAME <span style={{ opacity: 0.5 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            placeholder="Anonymous"
            maxLength={40}
            style={{
              ...inputBase,
              borderColor: focused === "name" ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.08)",
              boxShadow: focused === "name" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
              background: focused === "name" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
            }}
          />
        </div>

        {/* Message field */}
        <div>
          <label
            style={{
              display: "block",
              color: "var(--color-muted-foreground)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              marginBottom: "6px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            YOUR MESSAGE <span style={{ color: "rgba(239,68,68,0.7)" }}>*</span>
          </label>
          <textarea
            ref={msgRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError("");
            }}
            onFocus={() => setFocused("msg")}
            onBlur={() => setFocused(null)}
            placeholder="Share your thoughts about my portfolio…"
            maxLength={400}
            rows={4}
            style={{
              ...inputBase,
              borderColor: error
                ? "rgba(239,68,68,0.6)"
                : focused === "msg"
                  ? "rgba(99,102,241,0.7)"
                  : "rgba(255,255,255,0.08)",
              boxShadow: error
                ? "0 0 0 3px rgba(239,68,68,0.1)"
                : focused === "msg"
                  ? "0 0 0 3px rgba(99,102,241,0.12)"
                  : "none",
              background: focused === "msg" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
              resize: "vertical",
              minHeight: "100px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            {error ? (
              <span
                style={{
                  color: "#f87171",
                  fontSize: "12px",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <AlertCircle size={12} /> {error}
              </span>
            ) : (
              <span />
            )}
            <span
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "11px",
                fontFamily: "'Inter', sans-serif",
                opacity: 0.6,
              }}
            >
              {message.length}/400
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "13px 28px",
            borderRadius: "12px",
            border: "none",
            background: submitted
              ? "linear-gradient(135deg, #10b981, #059669)"
              : "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            cursor: submitted ? "default" : "pointer",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: submitted
              ? "0 8px 24px rgba(16,185,129,0.3)"
              : "0 8px 24px rgba(99,102,241,0.3)",
            transform: "translateY(0)",
            alignSelf: "flex-start",
          }}
          onMouseEnter={(e) => {
            if (!submitted) {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 14px 32px rgba(99,102,241,0.45)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = submitted
              ? "0 8px 24px rgba(16,185,129,0.3)"
              : "0 8px 24px rgba(99,102,241,0.3)";
          }}
        >
          {submitted ? (
            <>
              <CheckCircle size={16} /> Comment Posted!
            </>
          ) : (
            <>
              <Send size={15} /> Post Comment
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   View Counter Badge
────────────────────────────────────────────────────────────────── */
export function ViewCounterBadge({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 18px",
        borderRadius: "50px",
        background: "rgba(99,102,241,0.1)",
        border: "1px solid rgba(99,102,241,0.25)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Eye size={15} style={{ color: "#a5b4fc" }} />
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "14px",
          color: "#a5b4fc",
        }}
      >
        <AnimatedCount target={count} />
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          color: "var(--color-muted-foreground)",
          fontWeight: 500,
        }}
      >
        views
      </span>
    </div>
  );
}

export default function CommentsSection() {
  const { comments, viewCount, addComment, deleteComment, togglePin } = useComments();
  const { isAdmin, portfolioData } = useAdmin();
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 5;

  const handleSubmit = (name: string, message: string) => {
    // We need to track the new comment ID after it's added
    // Temporarily subscribe: capture all IDs before and after
    const before = new Set(comments.map((c) => c.id));
    addComment(name, message);
    // Find new IDs after a microtask
    setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        // We'll mark the first comment after the call as new
        // Since addComment prepends, it'll be at index 0
        next.add(`pending-${Date.now()}`);
        return next;
      });
    }, 50);
    void before;
  };

  // Track freshly added IDs
  const prevCountRef = useRef(comments.length);
  useEffect(() => {
    if (comments.length > prevCountRef.current) {
      const newest = comments[0];
      if (newest) {
        setNewIds((prev) => new Set([...prev, newest.id]));
        setTimeout(() => {
          setNewIds((prev) => {
            const next = new Set(prev);
            next.delete(newest.id);
            return next;
          });
        }, 4000);
      }
    }
    prevCountRef.current = comments.length;
  }, [comments]);

  const displayedComments = showAll ? comments : comments.slice(0, VISIBLE_COUNT);
  const hasMore = comments.length > VISIBLE_COUNT;

  return (
    <section id="comments" style={{ padding: "0 24px 80px" }} className="md:px-14">
      <style>{`
        .comment-scroll-area::-webkit-scrollbar { width: 4px; }
        .comment-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .comment-scroll-area::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
      `}</style>

      {/* ── Section Header ── */}
      <ScrollReveal variant="fade-up">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px",
            paddingBottom: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "64px",
          }}
        >
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
                }}
              >
                <MessageSquare size={18} color="#fff" />
              </div>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(28px, 5vw, 42px)",
                  fontWeight: 800,
                  margin: 0,
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, rgba(var(--foreground),0.7) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Comments
              </h2>
            </div>
            <p
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}
            >
              {comments.length === 0
                ? "Be the first to leave a comment!"
                : `${comments.length} comment${comments.length !== 1 ? "s" : ""} · share your thoughts`}
            </p>
          </div>

          {/* View Counter */}
          {portfolioData?.viewCounterConfig?.enabled !== false && (
            <ViewCounterBadge count={viewCount} />
          )}
        </div>
      </ScrollReveal>

      {/* ── Stats Row ── */}
      <ScrollReveal variant="fade-up" delay={80}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {[
            ...(portfolioData?.viewCounterConfig?.enabled !== false
              ? [
                  {
                    icon: <Eye size={20} style={{ color: "#a5b4fc" }} />,
                    value: viewCount,
                    label: "Portfolio Views",
                    color: "rgba(99,102,241,0.12)",
                    border: "rgba(99,102,241,0.2)",
                  },
                ]
              : []),
            {
              icon: <MessageSquare size={20} style={{ color: "#f9a8d4" }} />,
              value: comments.length,
              label: "Total Comments",
              color: "rgba(236,72,153,0.1)",
              border: "rgba(236,72,153,0.2)",
            },
            {
              icon: <Star size={20} style={{ color: "#fde047" }} />,
              value: comments.filter((c) => c.pinned).length,
              label: "Pinned",
              color: "rgba(250,204,21,0.1)",
              border: "rgba(250,204,21,0.2)",
            },
          ].map(({ icon, value, label, color, border }) => (
            <div
              key={label}
              style={{
                padding: "18px 20px",
                borderRadius: "16px",
                background: color,
                border: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: "24px",
                    color: "var(--color-primary)",
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCount target={value} />
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    color: "var(--color-muted-foreground)",
                    marginTop: "3px",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Main Layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "32px",
        }}
        className="lg:grid-cols-[1fr_380px]"
      >
        {/* Left: Comments list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Admin mode notice */}
          {isAdmin && comments.length > 0 && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚙️</span>
              <span
                style={{
                  color: "#c4b5fd",
                  fontSize: "12px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                }}
              >
                Admin Mode — hover any comment to pin or delete it.
              </span>
            </div>
          )}

          {comments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--color-muted-foreground)",
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: "20px",
              }}
            >
              <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                No comments yet
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", opacity: 0.6 }}>
                Be the first to share your thoughts! 👇
              </p>
            </div>
          ) : (
            <>
              {displayedComments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  onDelete={() => deleteComment(c.id)}
                  onTogglePin={() => togglePin(c.id)}
                  isAdmin={isAdmin}
                  isNew={newIds.has(c.id)}
                />
              ))}

              {hasMore && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--color-muted-foreground)",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.25s",
                    marginTop: "4px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(99,102,241,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(99,102,241,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-muted-foreground)";
                  }}
                >
                  <ChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.3s",
                      transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                  {showAll
                    ? "Show less"
                    : `Show ${comments.length - VISIBLE_COUNT} more comment${comments.length - VISIBLE_COUNT !== 1 ? "s" : ""}`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Right: Comment form */}
        <div>
          <CommentForm onSubmit={(name, msg) => handleSubmit(name, msg)} />

          {/* Guidelines box */}
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              💬{" "}
              <strong style={{ color: "var(--color-primary)", opacity: 0.7 }}>
                Community guidelines:
              </strong>{" "}
              Be kind, constructive and respectful. Comments are public and stored locally in your
              browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
