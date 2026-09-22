import {
  QUESTION_SYSTEM_PROMPT,
  buildQuestionPrompt,
  buildGenerateMorePrompt
} from "../ai/questionPrompt";
import { generateQuestionSlug } from "../utils/questionStorage";

const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";
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
 * Normalizes question objects to guarantee consistent, crash-proof structure.
 */
export function normalizeQuestionsResponse(parsed, defaultSlug = "q", startIdx = 1) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format received from AI.");
  }

  const rawQuestions = Array.isArray(parsed.questions)
    ? parsed.questions
    : Array.isArray(parsed)
    ? parsed
    : [];

  return rawQuestions
    .filter((item) => item && (item.question || item.title))
    .map((item, idx) => {
      const questionNumber = startIdx + idx;
      const fallbackId = `${defaultSlug}-q${questionNumber}`;
      const rawDifficulty = String(item.difficulty || "medium").toLowerCase();
      const difficulty = ["basic", "medium", "advanced"].includes(rawDifficulty)
        ? rawDifficulty
        : rawDifficulty.includes("easy") || rawDifficulty.includes("basic")
        ? "basic"
        : rawDifficulty.includes("hard") || rawDifficulty.includes("adv")
        ? "advanced"
        : "medium";

      const validTypes = [
        "conceptual",
        "code",
        "output",
        "scenario",
        "comparison",
        "practical",
        "debugging"
      ];
      const rawType = String(item.type || "conceptual").toLowerCase();
      const type = validTypes.includes(rawType) ? rawType : "conceptual";

      return {
        id: String(item.id || fallbackId),
        question: String(item.question || item.title || ""),
        answer: String(item.answer || item.modelAnswer || "Answer not available."),
        explanation: String(item.explanation || ""),
        difficulty,
        type,
        code: item.code ? String(item.code) : ""
      };
    });
}

/**
 * Executes chat completion with Groq with model fallbacks.
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
          console.warn(`Model ${modelName} unavailable for questions, trying fallback...`);
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
 * Generates the initial question set for a subtopic or topic.
 */
export async function generateInitialQuestions({
  topicName,
  topicSlug,
  parentSection,
  roadmapPath,
  topicContent,
  revisionNotes,
  isSmallTopic = false
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "AI assistant is not configured yet. Please add your Groq API key (VITE_GROQ_API_KEY) to your .env file."
    );
  }

  const slug = topicSlug || generateQuestionSlug(topicName);
  const userPrompt = buildQuestionPrompt({
    topicSlug: slug,
    topicName,
    parentSection,
    roadmapPath,
    topicContent,
    revisionNotes,
    isSmallTopic
  });

  const data = await executeGroqRequest(apiKey, {
    messages: [
      { role: "system", content: QUESTION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Questions generate nahi ho paaye. Empty response received from Groq.");
  }

  const parsed = cleanAndParseJSON(rawContent);
  return normalizeQuestionsResponse(parsed, slug, 1);
}

/**
 * Generates additional questions ("+ Generate More") without duplicating existing ones.
 */
export async function generateMoreQuestions({
  topicName,
  topicSlug,
  parentSection,
  roadmapPath,
  topicContent,
  revisionNotes,
  existingQuestions = [],
  startIndex = 1
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "AI assistant is not configured yet. Please add your Groq API key (VITE_GROQ_API_KEY) to your .env file."
    );
  }

  const slug = topicSlug || generateQuestionSlug(topicName);
  const userPrompt = buildGenerateMorePrompt({
    topicSlug: slug,
    topicName,
    parentSection,
    roadmapPath,
    topicContent,
    revisionNotes,
    existingQuestions,
    startIndex
  });

  const data = await executeGroqRequest(apiKey, {
    messages: [
      { role: "system", content: QUESTION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.35,
    response_format: { type: "json_object" }
  });

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Additional questions generate nahi ho paaye. Empty response received.");
  }

  const parsed = cleanAndParseJSON(rawContent);
  return normalizeQuestionsResponse(parsed, slug, startIndex);
}
