import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// ════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIG — 아래 값을 본인 것으로 교체하세요
//     Firebase 콘솔 > 프로젝트 설정 > 내 앱 > SDK 구성
// ════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ── Constants ──────────────────────────────────────
const NUM_BAYS = 11;
const OPEN_H = 9, CLOSE_H = 23;
const HOURS = Array.from({ length: CLOSE_H - OPEN_H }, (_, i) => i + OPEN_H);

const fmt = (h) => `${String(h).padStart(2, "0")}:00`;
const fmtDate = (d) => d ? new Date(d + "T12:00").toLocaleDateString("en-NZ", { weekday: "short", month: "short", day: "numeric" }) : "";
const fmtDateLong = (d) => d ? new Date(d + "T12:00").toLocaleDateString("en-NZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";
const getDates = (n = 14) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0]; });
const DATES = getDates();
const isConsecutive = (hours) => {
  if (hours.length <= 1) return true;
  const s = [...hours].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) if (s[i] !== s[i - 1] + 1) return false;
  return true;
};

// ── Colour palette ─────────────────────────────────
const C = {
  bg: "#f2f7f4", white: "#ffffff",
  green: "#1b8a3d", greenDark: "#156b2f", greenLight: "#27b550",
  greenPale: "#e8f5ed", greenPale2: "#d0ebd8",
  gold: "#e09820", goldLight: "#f0b830",
  text: "#101f15", textMid: "#3a5040", muted: "#7a9880",
  border: "#d5e5db", borderMed: "#b8d4bf",
  red: "#d42b20", redPale: "#fde8e6",
  shadow: "0 2px 12px rgba(27,138,61,0.07)",
  shadowMd: "0 4px 24px rgba(27,138,61,0.11)",
  shadowLg: "0 8px 40px rgba(27,138,61,0.14)",
};
