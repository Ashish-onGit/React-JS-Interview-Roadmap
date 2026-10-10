import { LEARNING_SYSTEM_PROMPT, buildLessonPrompt, buildFollowUpSystemPrompt } from "../prompts/learningPrompt";
import { executeChatCompletion } from "./groqClient";

export const GROQ_MODEL =
  import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-120b";

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
 * Generates a structured lesson via secure backend serverless endpoint
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
  const fallbackKey = getApiKey();

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

  const data = await executeChatCompletion(
    {
      messages: [
        { role: "system", content: LEARNING_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    },
    fallbackKey
  );

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
 * Sends a follow-up question via secure backend serverless endpoint
 */
export async function sendFollowUp({
  topicTitle,
  conversationHistory = [],
  userQuestion
}) {
  const fallbackKey = getApiKey();
  const systemPrompt = buildFollowUpSystemPrompt(topicTitle);

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
    })),
    { role: "user", content: userQuestion }
  ];

  const data = await executeChatCompletion(
    {
      messages,
      temperature: 0.5
    },
    fallbackKey
  );

  const answer = data.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error("No response received for your follow-up question.");
  }

  return answer;
}

