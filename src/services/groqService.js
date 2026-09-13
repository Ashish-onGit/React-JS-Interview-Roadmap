import { LEARNING_SYSTEM_PROMPT, buildLessonPrompt, buildFollowUpSystemPrompt } from "../prompts/learningPrompt";

export const GROQ_MODEL =
  import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Fallback models in priority order if default model isn't active on an account
const MODEL_FALLBACKS = [
  GROQ_MODEL,
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "groq/compound-mini"
];

// In-memory cache for session
const lessonCache = new Map();

export function getApiKey() {
  return (
    import.meta.env.VITE_GROQ_API_KEY ||
    import.meta.env.AI_API_KEY ||
    import.meta.env.VITE_AI_API_KEY ||
    ""
  ).trim();
}

/**
 * Normalizes and validates the AI response to guarantee the UI never crashes
 */
export function normalizeAIResponse(parsed, defaultTitle = "Lesson") {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format received from AI.");
  }

  return {
    title: parsed.title || defaultTitle,
    overview: parsed.overview || "Overview not available.",
    theory: Array.isArray(parsed.theory)
      ? parsed.theory.filter((t) => t && (t.heading || t.content))
      : [],
    realWorldExample:
      parsed.realWorldExample && typeof parsed.realWorldExample === "object"
        ? {
            scenario: parsed.realWorldExample.scenario || "",
            explanation: parsed.realWorldExample.explanation || ""
          }
        : null,
    codeExample:
      parsed.codeExample && typeof parsed.codeExample === "object" && parsed.codeExample.code
        ? {
            language: parsed.codeExample.language || "javascript",
            code: parsed.codeExample.code || "",
            explanation: parsed.codeExample.explanation || ""
          }
        : null,
    comparison:
      parsed.comparison &&
      typeof parsed.comparison === "object" &&
      Array.isArray(parsed.comparison.columns) &&
      Array.isArray(parsed.comparison.rows)
        ? {
            title: parsed.comparison.title || "Comparison",
            columns: parsed.comparison.columns,
            rows: parsed.comparison.rows
          }
        : null,
    commonMistakes: Array.isArray(parsed.commonMistakes)
      ? parsed.commonMistakes.filter(Boolean)
      : [],
    interviewQuestions: Array.isArray(parsed.interviewQuestions)
      ? parsed.interviewQuestions.filter((q) => q && q.question)
      : [],
    keyTakeaways: Array.isArray(parsed.keyTakeaways)
      ? parsed.keyTakeaways.filter(Boolean)
      : []
  };
}

/**
 * Safely parses JSON string even if model wrapped it in Markdown code blocks
 */
function cleanAndParseJSON(rawContent) {
  let cleaned = rawContent.trim();

  // Strip Markdown code block if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  }

  // Attempt direct parse
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Try to locate first { and last }
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
 * Helper to call Groq with automatic model fallbacks if default model is not accessible
 */
async function executeGroqChat(apiKey, bodyParams) {
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
          // ignore json parse
        }

        // If the model does not exist or user doesn't have access, try next model
        if (
          response.status === 404 ||
          errMsg.toLowerCase().includes("does not exist") ||
          errMsg.toLowerCase().includes("access to it")
        ) {
          console.warn(`Model ${modelName} unavailable, trying fallback...`);
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

      const data = await response.json();
      return data;
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
 * Generates a structured lesson from Groq
 */
export async function generateLesson({
  categoryTitle,
  sectionTitle,
  topicTitle,
  subtopicTitle,
  allSubtopics = [],
  cacheKey,
  bypassCache = false
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "AI assistant is not configured yet. Please add your Groq API key (VITE_GROQ_API_KEY or AI_API_KEY) to your .env file."
    );
  }

  // Check in-memory session cache
  if (cacheKey && !bypassCache && lessonCache.has(cacheKey)) {
    return lessonCache.get(cacheKey);
  }

  const userPrompt = buildLessonPrompt({
    categoryTitle,
    sectionTitle,
    topicTitle,
    subtopicTitle,
    allSubtopics
  });

  const data = await executeGroqChat(apiKey, {
    messages: [
      { role: "system", content: LEARNING_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Empty response received from Groq.");
  }

  const parsed = cleanAndParseJSON(rawContent);
  const normalized = normalizeAIResponse(parsed, subtopicTitle || topicTitle);

  // Save to in-memory session cache
  if (cacheKey) {
    lessonCache.set(cacheKey, normalized);
  }

  return normalized;
}

/**
 * Sends a follow-up question for the open assistant session
 */
export async function sendFollowUp({
  topicTitle,
  conversationHistory = [],
  userQuestion
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "AI assistant is not configured yet. Add your Groq API key to your .env file."
    );
  }

  const systemPrompt = buildFollowUpSystemPrompt(topicTitle);

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
    })),
    { role: "user", content: userQuestion }
  ];

  const data = await executeGroqChat(apiKey, {
    messages,
    temperature: 0.5
  });

  const answer = data.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error("No response received for your follow-up question.");
  }

  return answer;
}
