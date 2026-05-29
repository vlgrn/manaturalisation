import { ADULT_DOCUMENTS, getDocument } from "@/content/documents";
import type { DocProgress, DocumentSpec, UserProgress } from "@/lib/types";

// ---------- Date helpers (no external deps) ----------

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEK = 7;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatDate(date: Date, locale = "fr-CH"): string {
  return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

export function parseDate(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d;
}

/** Compute expiry date for a document given when it was obtained. */
export function computeExpiry(doc: DocumentSpec, obtainedDate?: string): string | undefined {
  if (doc.validityMonths == null || !obtainedDate) return undefined;
  const d = parseDate(obtainedDate);
  if (!d) return undefined;
  return addMonths(d, doc.validityMonths).toISOString();
}

// ---------- Sequencer ----------

export interface SequencerWarning {
  docKey: string;
  level: "block" | "warn" | "info";
  message: string;
}

export interface SequencerResult {
  /** Documents grouped by recommended phase. */
  startNow: DocumentSpec[]; // slow_first — start immediately, in parallel
  requestLast: DocumentSpec[]; // short_last — short validity
  anytime: DocumentSpec[]; // neutral
  warnings: SequencerWarning[];
  /** Earliest date by which it's safe to mail, based on slow docs still pending. */
  earliestSafeMailDate?: Date;
  /** Whether all slow docs are obtained (so short-validity docs can safely be requested). */
  slowDocsReady: boolean;
  /** Documents currently obtained but already expired. */
  expired: DocumentSpec[];
}

function progressOf(progress: UserProgress, key: string): DocProgress {
  return progress.documents[key] ?? { status: "not_started" };
}

/**
 * The core sequencing logic.
 *
 * Rule: short-validity documents (#4, #5, #6 — 3 months) must be requested LAST;
 * slow, long/no-expiry documents (#1, #7, #8) must be started FIRST, so that when
 * the dossier is ready to mail none of the short-validity attestations have expired.
 */
export function computeSequence(progress: UserProgress, now: Date = new Date()): SequencerResult {
  const docs = ADULT_DOCUMENTS;

  const startNow = docs.filter((d) => d.sequenceGroup === "slow_first");
  const requestLast = docs.filter((d) => d.sequenceGroup === "short_last");
  const anytime = docs.filter((d) => d.sequenceGroup === "neutral");

  // Are all slow docs obtained?
  const slowPending = startNow.filter((d) => progressOf(progress, d.key).status !== "obtained");
  const slowDocsReady = slowPending.length === 0;

  const warnings: SequencerWarning[] = [];

  // Warn / block on requesting short-validity docs too early.
  for (const doc of requestLast) {
    const p = progressOf(progress, doc.key);
    if (p.status === "not_started" && !slowDocsReady) {
      const pendingNames = slowPending.map((d) => d.name).join(", ");
      warnings.push({
        docKey: doc.key,
        level: "warn",
        message: `⚠️ Ne demandez pas encore « ${doc.name} » : un document lent n'est pas revenu (${pendingNames}). Il risquerait de périmer (validité ${doc.validityMonths} mois) avant l'envoi du dossier.`,
      });
    }
  }

  // Encourage starting slow docs now.
  for (const doc of startNow) {
    const p = progressOf(progress, doc.key);
    if (p.status === "not_started") {
      warnings.push({
        docKey: doc.key,
        level: "info",
        message: `Commencez « ${doc.name} » dès maintenant : délai estimé ${doc.estimatedWeeks[0]}–${doc.estimatedWeeks[1]} semaines.`,
      });
    }
  }

  // Expiry detection on obtained docs.
  const expired: DocumentSpec[] = [];
  for (const doc of docs) {
    if (doc.validityMonths == null) continue;
    const p = progressOf(progress, doc.key);
    if (p.status !== "obtained") continue;
    const expiry = p.expiresDate ? parseDate(p.expiresDate) : computeExpiryDate(doc, p);
    if (expiry && expiry.getTime() < now.getTime()) {
      expired.push(doc);
      warnings.push({
        docKey: doc.key,
        level: "block",
        message: `❌ « ${doc.name} » a expiré (le ${formatDate(expiry)}). Il faudra le redemander avant l'envoi.`,
      });
    } else if (expiry) {
      const daysLeft = Math.round((expiry.getTime() - now.getTime()) / MS_PER_DAY);
      if (daysLeft <= 21) {
        warnings.push({
          docKey: doc.key,
          level: "warn",
          message: `⚠️ « ${doc.name} » expire bientôt (le ${formatDate(expiry)}, dans ${daysLeft} jours). Envoyez le dossier rapidement.`,
        });
      }
    }
  }

  const earliestSafeMailDate = computeEarliestSafeMailDate(progress, slowPending, now);

  return {
    startNow,
    requestLast,
    anytime,
    warnings,
    earliestSafeMailDate,
    slowDocsReady,
    expired,
  };
}

function computeExpiryDate(doc: DocumentSpec, p: DocProgress): Date | undefined {
  if (doc.validityMonths == null) return undefined;
  const obtained = parseDate(p.obtainedDate);
  if (!obtained) return undefined;
  return addMonths(obtained, doc.validityMonths);
}

/**
 * Projected earliest date by which the dossier can safely be mailed.
 *
 * Logic: the gating factor is the slowest still-pending slow document. Once it's
 * obtained, the short-validity attestations (≈ up to 3 weeks to obtain) can be
 * requested. We add the worst-case obtaining time of the short docs on top.
 */
function computeEarliestSafeMailDate(
  progress: UserProgress,
  slowPending: DocumentSpec[],
  now: Date
): Date | undefined {
  let slowReadyDate = now;

  for (const doc of slowPending) {
    const p = progressOf(progress, doc.key);
    let docReady: Date;
    if (p.status === "in_progress" && p.requestedDate) {
      // Already requested: ready = requestedDate + maxWeeks.
      const requested = parseDate(p.requestedDate) ?? now;
      docReady = addDays(requested, doc.estimatedWeeks[1] * WEEK);
    } else {
      // Not started: ready = now + maxWeeks (must still request it).
      docReady = addDays(now, doc.estimatedWeeks[1] * WEEK);
    }
    if (docReady.getTime() > slowReadyDate.getTime()) slowReadyDate = docReady;
  }

  // Worst-case obtaining time of the short-validity docs once we trigger them.
  const shortMaxWeeks = ADULT_DOCUMENTS.filter((d) => d.sequenceGroup === "short_last").reduce(
    (m, d) => Math.max(m, d.estimatedWeeks[1]),
    0
  );

  return addDays(slowReadyDate, shortMaxWeeks * WEEK);
}

export { getDocument };
