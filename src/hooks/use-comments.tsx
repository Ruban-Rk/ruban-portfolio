import { useState, useEffect, useCallback } from "react";
import { doc, setDoc, updateDoc, onSnapshot, increment, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// ─── Types ─────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: number; // Unix ms
  pinned: boolean;
  avatar: string; // initials or emoji
  avatarColor: string;
  reaction?: string; // optional emoji reaction
}

// ─── Storage Keys ──────────────────────────────────────────────────

const COMMENTS_KEY = "ruban_portfolio_comments";
const VIEWS_KEY = "ruban_portfolio_views";
const SESSION_VIEWED_KEY = "ruban_portfolio_session_viewed";

// ─── Avatar helpers ────────────────────────────────────────────────

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#ec4899,#f43f5e)",
  "linear-gradient(135deg,#14b8a6,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#10b981,#3b82f6)",
  "linear-gradient(135deg,#a855f7,#6366f1)",
  "linear-gradient(135deg,#f97316,#eab308)",
  "linear-gradient(135deg,#06b6d4,#10b981)",
];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function pickAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Comment ID ────────────────────────────────────────────────────

export function generateCommentId(): string {
  return `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Loaders ───────────────────────────────────────────────────────

function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function loadViews(): number {
  try {
    return parseInt(localStorage.getItem(VIEWS_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveComments(comments: Comment[]) {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  } catch {}
}

function saveViews(count: number) {
  try {
    localStorage.setItem(VIEWS_KEY, String(count));
  } catch {}
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useComments() {
  const [comments, setComments] = useState<Comment[]>(loadComments);
  const [viewCount, setViewCount] = useState<number>(loadViews);

  // Sync Views from Firebase
  useEffect(() => {
    try {
      const docRef = doc(db, "portfolio", "stats");
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const fbViews = snap.data().viewCount || 0;
          setViewCount(fbViews);
          saveViews(fbViews);
        }
      });
      return () => unsub();
    } catch {}
  }, []);

  // Increment view count once per session
  useEffect(() => {
    const incrementView = async () => {
      try {
        if (!localStorage.getItem(SESSION_VIEWED_KEY)) {
          localStorage.setItem(SESSION_VIEWED_KEY, "1");
          // Local optimistic update
          const next = loadViews() + 1;
          saveViews(next);
          setViewCount(next);

          // Firebase update
          const docRef = doc(db, "portfolio", "stats");
          const snap = await getDoc(docRef);
          if (!snap.exists()) {
            await setDoc(docRef, { viewCount: 1 });
          } else {
            await updateDoc(docRef, { viewCount: increment(1) });
          }
        }
      } catch {}
    };
    incrementView();
  }, []);

  // Sync Comments from Firebase
  useEffect(() => {
    try {
      const docRef = doc(db, "portfolio", "commentsDoc");
      const unsub = onSnapshot(docRef, (snap) => {
        if (snap.exists() && snap.data().list) {
          const fbComments = snap.data().list as Comment[];
          setComments(fbComments);
          saveComments(fbComments);
        }
      });
      return () => unsub();
    } catch {}
  }, []);

  // Helper to sync to firebase
  const pushCommentsToFirebase = async (newComments: Comment[]) => {
    try {
      const docRef = doc(db, "portfolio", "commentsDoc");
      await setDoc(docRef, { list: newComments }, { merge: true });
    } catch (err) {
      console.warn("Failed to sync comments to Firebase", err);
    }
  };

  const addComment = useCallback((name: string, message: string) => {
    const trimName = name.trim() || "Anonymous";
    const trimMsg = message.trim();
    if (!trimMsg) return false;
    const newComment: Comment = {
      id: generateCommentId(),
      name: trimName,
      message: trimMsg,
      timestamp: Date.now(),
      pinned: false,
      avatar: getInitials(trimName) || "?",
      avatarColor: pickAvatarColor(trimName),
    };
    setComments((prev) => {
      const next = [newComment, ...prev];
      saveComments(next);
      pushCommentsToFirebase(next);
      return next;
    });
    return true;
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveComments(next);
      pushCommentsToFirebase(next);
      return next;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setComments((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c));
      saveComments(next);
      pushCommentsToFirebase(next);
      return next;
    });
  }, []);

  const setManualViewCount = useCallback(async (count: number) => {
    try {
      setViewCount(count);
      saveViews(count);
      const docRef = doc(db, "portfolio", "stats");
      await setDoc(docRef, { viewCount: count }, { merge: true });
    } catch (err) {
      console.warn("Failed to set view count manually", err);
    }
  }, []);

  // Pinned first, then newest
  const sortedComments = [
    ...comments.filter((c) => c.pinned).sort((a, b) => b.timestamp - a.timestamp),
    ...comments.filter((c) => !c.pinned).sort((a, b) => b.timestamp - a.timestamp),
  ];

  return { comments: sortedComments, viewCount, addComment, deleteComment, togglePin, setManualViewCount };
}
