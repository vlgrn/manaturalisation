// Shared domain types for NaturaGE.

// ---------- Documents ----------

export type DocStatus = "not_started" | "in_progress" | "obtained";

export type DocSpeed = "instant" | "fast" | "medium" | "slow";

export interface DocumentSpec {
  /** Stable key used in storage and DB. Never change once shipped. */
  key: string;
  /** Display order number from the official checklist (1..9). */
  number: number;
  name: string;
  /** Short description shown on the card. */
  summary: string;
  /** Full official requirement text / guidance. */
  detail: string;
  /**
   * Validity window in months once the document is issued.
   * `null` means it does not expire (e.g. language cert, test certificate).
   */
  validityMonths: number | null;
  /** Rough time to obtain, drives the sequencer. */
  speed: DocSpeed;
  /** Estimated weeks to obtain after requesting, [min, max]. Used for the safe-mail-date projection. */
  estimatedWeeks: [number, number];
  /**
   * "slow" docs (long lead time, long/no expiry) should be started FIRST.
   * "short" docs (short validity) should be requested LAST.
   * "neutral" can be done anytime.
   */
  sequenceGroup: "slow_first" | "short_last" | "neutral";
  /** How to obtain it: a link or a mailto generator. */
  action: DocAction;
  /** Only relevant to minors — hidden for adult-only v1 flow but kept in content. */
  minorsOnly?: boolean;
}

export type DocAction =
  | { type: "link"; label: string; href: string }
  | { type: "self"; label: string }
  | { type: "mailto"; label: string; mailtoKey: string };

// ---------- Eligibility ----------

export type AnswerValue = string | number | boolean;

export interface EligibilityQuestion {
  key: string;
  /** Section grouping for the UI. */
  section: "residence" | "permit" | "integration" | "finances";
  question: string;
  help?: string;
  type: "yesno" | "number" | "choice";
  /** For `choice` questions. */
  options?: { value: string; label: string }[];
  unit?: string;
}

export type EligibilityVerdict = "eligible" | "not_yet" | "edge_case";

export interface EligibilityResult {
  verdict: EligibilityVerdict;
  /** Human-readable reasons, shown to the user. */
  reasons: { kind: "blocker" | "warning" | "ok"; message: string }[];
}

// ---------- Steps ----------

export type StepStatus = "todo" | "in_progress" | "done";

export interface StepSpec {
  key: string;
  number: number;
  title: string;
  description: string;
  /** Whether this step is something the applicant does, or the administration does. */
  actor: "you" | "administration";
  /** Steps that can run in parallel with this one (keys). */
  parallelWith?: string[];
}

// ---------- Costs ----------

export interface CostItem {
  label: string;
  amountChf: number | string;
  note?: string;
}

// ---------- User progress (persisted) ----------

export interface DocProgress {
  status: DocStatus;
  requestedDate?: string; // ISO date
  obtainedDate?: string; // ISO date
  expiresDate?: string; // ISO date (computed at obtain time)
}

export interface UserProgress {
  documents: Record<string, DocProgress>;
  steps: Record<string, StepStatus>;
  eligibilityAnswers?: Record<string, AnswerValue>;
  eligibilityResult?: EligibilityResult;
}
