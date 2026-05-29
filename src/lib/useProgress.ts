"use client";

import { useCallback, useEffect, useState } from "react";
import { loadProgress, saveProgress, loadProgressRemote, saveProgressRemote } from "@/lib/storage";
import { getDocument } from "@/content/documents";
import { computeExpiry } from "@/lib/sequencer";
import type { DocStatus, StepStatus, UserProgress } from "@/lib/types";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Local first (instant), then let a saved remote copy win if present.
    setProgress(loadProgress());
    loadProgressRemote().then((remote) => {
      if (remote) {
        setProgress(remote);
        saveProgress(remote);
      }
    });
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const todayIso = () => new Date().toISOString();

  const setDocStatus = useCallback(
    (docKey: string, status: DocStatus) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const doc = getDocument(docKey);
        const current = prev.documents[docKey] ?? { status: "not_started" };
        const next = { ...current, status };

        if (status === "in_progress" && !next.requestedDate) {
          next.requestedDate = todayIso();
        }
        if (status === "obtained") {
          next.obtainedDate = next.obtainedDate ?? todayIso();
          if (doc) next.expiresDate = computeExpiry(doc, next.obtainedDate);
        }
        if (status === "not_started") {
          next.requestedDate = undefined;
          next.obtainedDate = undefined;
          next.expiresDate = undefined;
        }

        const updated: UserProgress = {
          ...prev,
          documents: { ...prev.documents, [docKey]: next },
        };
        saveProgress(updated);
        void saveProgressRemote(updated);
        return updated;
      });
    },
    []
  );

  const setDocDate = useCallback(
    (docKey: string, field: "requestedDate" | "obtainedDate", isoDate: string) => {
      setProgress((prev) => {
        if (!prev) return prev;
        const doc = getDocument(docKey);
        const current = prev.documents[docKey] ?? { status: "not_started" };
        const next = { ...current, [field]: isoDate || undefined };
        if (field === "obtainedDate" && doc) {
          next.expiresDate = computeExpiry(doc, isoDate);
        }
        const updated: UserProgress = {
          ...prev,
          documents: { ...prev.documents, [docKey]: next },
        };
        saveProgress(updated);
        void saveProgressRemote(updated);
        return updated;
      });
    },
    []
  );

  const setStepStatus = useCallback((stepKey: string, status: StepStatus) => {
    setProgress((prev) => {
      if (!prev) return prev;
      const updated: UserProgress = {
        ...prev,
        steps: { ...prev.steps, [stepKey]: status },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  return { progress, persist, setDocStatus, setDocDate, setStepStatus };
}
