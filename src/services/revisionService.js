import { REVISION_SYSTEM_PROMPT, buildRevisionPrompt } from "../ai/revisionPrompt";

const GROQ_MODEL =
  import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MODEL_FALLBACKS = [
  GROQ_MODEL,
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile"
];

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
 * Executes a chat completion against Groq with fallback model support.
 */
async function executeGroqRequest(apiKey, bodyParams) {
  const modelsToTry = Array.from(new Set(MODEL_FALLBACKS));
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          ...bodyParams,
          model: modelName
        })
      });

      if (!response.ok) {
        let errMsg = `Groq API error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) {
            errMsg = errData.error.message;
          }
        } catch {
          // ignore
        }

        if (
          response.status === 404 ||
          errMsg.toLowerCase().includes("does not exist") ||
          errMsg.toLowerCase().includes("access to it")
        ) {
          console.warn(`Model ${modelName} unavailable for revision notes, trying fallback...`);
          lastError = new Error(errMsg);
          continue;
        }

        if (response.status === 401) {
          throw new Error("Invalid Groq API key. Please check your .env configuration.");
        } else if (response.status === 429) {
          throw new Error("Groq rate limit exceeded. Please wait a few seconds and try again.");
        }

        throw new Error(errMsg);
      }

      return await response.json();
    } catch (err) {
      lastError = err;
      if (
        err.message?.includes("Invalid Groq API key") ||
        err.message?.includes("rate limit exceeded")
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to communicate with Groq AI service.");
}

/**
 * Generates structured quick revision notes from Groq.
 */
export async function generateRevisionNotes({
  categoryTitle,
  sectionNumber,
  sectionTitle,
  topics = []
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "AI assistant is not configured yet. Please add your Groq API key (VITE_GROQ_API_KEY) to your .env file."
    );
  }

  const userPrompt = buildRevisionPrompt({
    categoryTitle,
    sectionNumber,
    sectionTitle,
    topics
  });

  const data = await executeGroqRequest(apiKey, {
    messages: [
      { role: "system", content: REVISION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.25,
    response_format: { type: "json_object" }
  });

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Empty response received from Groq.");
  }

  const parsed = cleanAndParseJSON(rawContent);
  return normalizeRevisionResponse(parsed, `Quick Revision — ${sectionTitle}`);
}
