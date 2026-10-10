import { REVISION_SYSTEM_PROMPT, buildRevisionPrompt } from "../ai/revisionPrompt";
import { executeChatCompletion } from "./groqClient";

export const GROQ_MODEL =
  import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";

function getApiKey() {
  return (
    import.meta.env.VITE_GROQ_API_KEY ||
    import.meta.env.AI_API_KEY ||
    import.meta.env.VITE_AI_API_KEY ||
    ""
  ).trim();
}

/**
 * Safely parses raw JSON output from the model, stripping markdown wrappers if any.
 */
function cleanAndParseJSON(rawContent) {
  let cleaned = rawContent.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw initialErr;
  }
}

/**
 * Normalizes and guards the response to ensure components never crash on malformed payloads.
 */
export function normalizeRevisionResponse(parsed, defaultTitle = "Quick Revision") {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format received from AI.");
  }

  return {
    title: parsed.title || defaultTitle,
    conceptTable: Array.isArray(parsed.conceptTable)
      ? parsed.conceptTable
          .filter((item) => item && (item.concept || item.meaning))
          .map((item) => ({
            concept: String(item.concept || ""),
            meaning: String(item.meaning || "")
          }))
      : [],
    oneLineRevision: Array.isArray(parsed.oneLineRevision)
      ? parsed.oneLineRevision.filter(Boolean).map(String)
      : [],
    importantConcepts: Array.isArray(parsed.importantConcepts)
      ? parsed.importantConcepts
          .filter((item) => item && (item.title || item.explanation))
          .map((item) => ({
            title: String(item.title || ""),
            explanation: String(item.explanation || "")
          }))
      : [],
    memoryTricks: Array.isArray(parsed.memoryTricks)
      ? parsed.memoryTricks.filter(Boolean).map(String)
      : [],
    comparisonTables: Array.isArray(parsed.comparisonTables)
      ? parsed.comparisonTables
          .filter(
            (table) =>
              table &&
              Array.isArray(table.columns) &&
              table.columns.length > 0 &&
              Array.isArray(table.rows) &&
              table.rows.length > 0
          )
          .map((table) => ({
            title: String(table.title || "Comparison"),
            columns: table.columns.map(String),
            rows: table.rows.map((row) => ({
              feature: String(row.feature || ""),
              values: Array.isArray(row.values) ? row.values.map(String) : []
            }))
          }))
      : [],
    commonInterviewQuestions: Array.isArray(parsed.commonInterviewQuestions)
      ? parsed.commonInterviewQuestions
          .filter((q) => q && (q.question || q.shortAnswer))
          .map((q) => ({
            question: String(q.question || ""),
            shortAnswer: String(q.shortAnswer || ""),
            rememberTip: q.rememberTip ? String(q.rememberTip) : ""
          }))
      : [],
    keyTakeaways: Array.isArray(parsed.keyTakeaways)
      ? parsed.keyTakeaways.filter(Boolean).map(String)
      : []
  };
}

/**
 * Generates structured quick revision notes via secure backend serverless endpoint.
 */
export async function generateRevisionNotes({
  categoryTitle,
  sectionNumber,
  sectionTitle,
  topics = []
}) {
  const fallbackKey = getApiKey();
  const userPrompt = buildRevisionPrompt({
    categoryTitle,
    sectionNumber,
    sectionTitle,
    topics
  });

  const data = await executeChatCompletion(
    {
      messages: [
        { role: "system", content: REVISION_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.25,
      response_format: { type: "json_object" }
    },
    fallbackKey
  );

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Empty response received from Groq.");
  }

  const parsed = cleanAndParseJSON(rawContent);
  return normalizeRevisionResponse(parsed, `Quick Revision — ${sectionTitle}`);
}
