"use client";

import { ADULT_DOCUMENTS } from "@/content/documents";
import { STEPS } from "@/content/steps";
import type { UserProgress } from "@/lib/types";

// Client-side progress store.
//
// v1 persists to localStorage so the app is fully usable without any backend.
// When Supabase is configured, swap the load/save implementations here for
// queries against the `documents` / `steps_progress` / `eligibility_answers`
// tables (RLS scopes rows to the authenticated user). The rest of the app only
// talks to this module, so the storage swap is isolated.

const STORAGE_KEY = "naturage:progress:v1";

export function emptyProgress(): UserProgress {
  const documents: UserProgress["documents"] = {};
  for (const d of ADULT_DOCUMENTS) documents[d.key] = { status: "not_started" };
  const steps: UserProgress["steps"] = {};
  for (const s of STEPS) steps[s.key] = "todo";
  return { documents, steps };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    // Merge with defaults so new docs/steps appear after content updates.
    const base = emptyProgress();
    return {
      documents: { ...base.documents, ...(parsed.documents ?? {}) },
      steps: { ...base.steps, ...(parsed.steps ?? {}) },
      eligibilityAnswers: parsed.eligibilityAnswers,
      eligibilityResult: parsed.eligibilityResult,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full / disabled — fail silently in v1.
  }
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
