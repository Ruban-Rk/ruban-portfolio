import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface VisitLog {
  id: string;
  timestamp: any;
  device: string;
  location: string;
  ip: string;
}

export interface EditLog {
  id: string;
  timestamp: any;
  action: string;
  details: string;
  diffs?: string[];
  adminDevice?: string;
  adminLocation?: string;
  adminIp?: string;
}

export function useLogs() {
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [edits, setEdits] = useState<EditLog[]>([]);

  useEffect(() => {
    try {
      const vQuery = query(
        collection(db, "portfolio_visits"),
        orderBy("timestamp", "desc"),
        limit(100),
      );
      const unsubV = onSnapshot(
        vQuery,
        (snap) => {
          setVisits(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as VisitLog));
        },
        (err) => console.warn(err),
      );

      const eQuery = query(
        collection(db, "portfolio_edits"),
        orderBy("timestamp", "desc"),
        limit(100),
      );
      const unsubE = onSnapshot(
        eQuery,
        (snap) => {
          setEdits(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as EditLog));
        },
        (err) => console.warn(err),
      );

      return () => {
        unsubV();
        unsubE();
      };
    } catch (e) {
      console.warn("Failed to init logs listener", e);
    }
  }, []);

  return { visits, edits };
}

export const logVisit = async () => {
  if (typeof window === "undefined" || sessionStorage.getItem("visit_logged")) return;

  try {
    let locationStr = "Unknown Location";
    let ip = "Unknown IP";
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
      clearTimeout(id);
      const data = await res.json();
      if (data && data.ip) {
        ip = data.ip;
        locationStr = `${data.city || ""}, ${data.region || ""}, ${data.country_name || ""}`
          .replace(/^, |, $/g, "")
          .replace(/, ,/g, ",");
      }
    } catch (e) {
      console.warn("Failed to get location info", e);
    }

    await addDoc(collection(db, "portfolio_visits"), {
      timestamp: serverTimestamp(),
      device: navigator.userAgent,
      location: locationStr,
      ip: ip,
    });
    sessionStorage.setItem("visit_logged", "true");
  } catch (e) {
    console.warn("Failed to log visit", e);
  }
};

export const logAdminEdit = async (action: string, diffs: string[]) => {
  try {
    let locationStr = "Unknown Location";
    let ip = "Unknown IP";
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
      clearTimeout(id);
      const data = await res.json();
      if (data && data.ip) {
        ip = data.ip;
        locationStr = `${data.city || ""}, ${data.region || ""}, ${data.country_name || ""}`
          .replace(/^, |, $/g, "")
          .replace(/, ,/g, ",");
      }
    } catch (e) {
      console.warn("Failed to get location info", e);
    }

    await addDoc(collection(db, "portfolio_edits"), {
      timestamp: serverTimestamp(),
      action,
      details: diffs.length > 0 ? "Changes detected" : "No changes",
      diffs,
      adminDevice: navigator.userAgent,
      adminLocation: locationStr,
      adminIp: ip,
    });
  } catch (e) {
    console.warn("Failed to log edit", e);
  }
};
