import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { anthropicConfigured } from "@/lib/env";
import { ADULT_DOCUMENTS, getDocument } from "@/content/documents";
import { addMonths } from "@/lib/sequencer";

export const maxDuration = 60;

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

// Canonical document list the model classifies against (cached prefix).
const DOC_LIST = ADULT_DOCUMENTS.map(
  (d) =>
    `- ${d.key}: ${d.name}${
      d.validityMonths ? ` (valable ${d.validityMonths} mois)` : " (ne périme pas)"
    }`,
).join("\n");

const SYSTEM = `Tu es un assistant qui aide à organiser un dossier de naturalisation ordinaire à Genève. On te donne UN document (image ou PDF) téléversé par l'usager. Ta tâche :
1. Identifie de quel document officiel il s'agit, parmi cette liste (renvoie sa clé doc_key, ou "unknown" si aucun ne correspond) :
${DOC_LIST}
2. Donne un libellé court et clair en français (doc_label) décrivant le document.
3. Repère la date d'établissement / d'émission du document si elle est visible (issue_date, format AAAA-MM-JJ ; chaîne vide si introuvable).
4. Indique si le document semble complet et lisible (looks_complete).
5. summary : une phrase factuelle (ce que tu vois). Ne donne PAS de conseil juridique.

Réponds uniquement via le format structuré demandé.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    doc_key: { type: "string", enum: [...ADULT_DOCUMENTS.map((d) => d.key), "unknown"] },
    doc_label: { type: "string" },
    issue_date: { type: "string" },
    looks_complete: { type: "boolean" },
    summary: { type: "string" },
  },
  required: ["doc_key", "doc_label", "issue_date", "looks_complete", "summary"],
} as const;

export async function POST(req: Request) {
  if (!anthropicConfigured) {
    return NextResponse.json({ error: "AI non configurée." }, { status: 503 });
  }
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "id manquant." }, { status: 400 });

  // RLS ensures the row belongs to the current user.
  const { data: row, error: rowErr } = await supabase
    .from("user_documents")
    .select("*")
    .eq("id", id)
    .single();
  if (rowErr || !row) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  const mime: string = row.mime_type ?? "";
  const isPdf = mime === "application/pdf";
  const isImage = IMAGE_TYPES.has(mime);
  if (!isPdf && !isImage) {
    await supabase.from("user_documents").update({ status: "error" }).eq("id", id);
    return NextResponse.json(
      { error: "Format non pris en charge (PDF ou image uniquement)." },
      { status: 415 },
    );
  }

  // Download the file from storage (RLS scopes this to the user's folder).
  const { data: blob, error: dlErr } = await supabase.storage
    .from("documents")
    .download(row.storage_path);
  if (dlErr || !blob) {
    await supabase.from("user_documents").update({ status: "error" }).eq("id", id);
    return NextResponse.json({ error: "Téléchargement impossible." }, { status: 500 });
  }
  const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");

  const filePart = isPdf
    ? { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 } }
    : { type: "image" as const, source: { type: "base64" as const, media_type: mime as "image/png" | "image/jpeg" | "image/gif" | "image/webp", data: base64 } };

  const client = new Anthropic();

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [
        {
          role: "user",
          content: [
            filePart,
            { type: "text", text: "Analyse ce document et renvoie le résultat structuré." },
          ],
        },
      ],
    } as Anthropic.MessageCreateParamsNonStreaming);

    const textBlock = msg.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";
    // Defensive: extract the JSON object even if the model adds any surrounding prose.
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const parsed = JSON.parse(start >= 0 && end > start ? raw.slice(start, end + 1) : "{}");

    const docKey: string | null =
      parsed.doc_key && parsed.doc_key !== "unknown" ? parsed.doc_key : null;
    const spec = docKey ? getDocument(docKey) : undefined;
    const docDate: string | null = /^\d{4}-\d{2}-\d{2}$/.test(parsed.issue_date)
      ? parsed.issue_date
      : null;

    let expiresAt: string | null = null;
    if (spec?.validityMonths && docDate) {
      expiresAt = addMonths(new Date(docDate), spec.validityMonths).toISOString().slice(0, 10);
    }
    const isValid = docKey
      ? expiresAt
        ? expiresAt >= new Date().toISOString().slice(0, 10)
        : true
      : null;

    const update = {
      status: "done",
      doc_key: docKey,
      doc_label: parsed.doc_label ?? null,
      doc_date: docDate,
      expires_at: expiresAt,
      is_valid: isValid,
      analysis: parsed,
    };
    const { data: updated } = await supabase
      .from("user_documents")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    return NextResponse.json({ document: updated ?? { id, ...update } });
  } catch (err) {
    console.error("Document analysis failed", err);
    await supabase.from("user_documents").update({ status: "error" }).eq("id", id);
    return NextResponse.json({ error: "Analyse impossible." }, { status: 500 });
  }
}
