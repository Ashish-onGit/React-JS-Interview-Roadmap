import axios from "axios";

/**
 * Service to evaluate candidate interview answers via backend serverless function.
 * Uses Axios for HTTP requests and never persists answers or evaluation results.
 *
 * @param {Object} params
 * @param {string} params.question - Interview question text
 * @param {string} params.userAnswer - Candidate's spoken/typed answer
 * @param {string} [params.referenceAnswer] - Model answer if available
 * @param {string} [params.topic] - Topic title
 * @param {string} [params.subtopic] - Subtopic title
 * @param {string} [params.difficulty] - Question difficulty level
 * @param {string} [params.codeSnippet] - Associated code snippet if any
 * @returns {Promise<{score: number, summary: string, strengths: string[], missingConcepts: string[], improvementSuggestion: string}>}
 */
export async function evaluateAnswer({
  question,
  userAnswer,
  referenceAnswer = "",
  topic = "",
  subtopic = "",
  difficulty = "",
  codeSnippet = ""
}) {
  const trimmedAnswer = (userAnswer || "").trim();
  if (!trimmedAnswer) {
    throw new Error("Answer cannot be empty. Please speak or type your answer before checking.");
  }

  const trimmedQuestion = (question || "").trim();
  if (!trimmedQuestion) {
    throw new Error("Question is missing. Cannot evaluate empty question.");
  }

  try {
    const response = await axios.post(
      "/api/evaluate-answer",
      {
        question: trimmedQuestion,
        userAnswer: trimmedAnswer,
        referenceAnswer: (referenceAnswer || "").trim(),
        topic: (topic || "").trim(),
        subtopic: (subtopic || "").trim(),
        difficulty: (difficulty || "").trim(),
        codeSnippet: (codeSnippet || "").trim()
      },
      {
        timeout: 35000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data?.error || "Invalid response format from evaluation service.");
  } catch (err) {
    // Axios error handling
    if (err.response) {
      const serverMessage = err.response.data?.error;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      if (err.response.status === 429) {
        throw new Error("Groq rate limit exceeded. Please wait a few seconds and try again.");
      }
      if (err.response.status === 500) {
        throw new Error("AI service error on server. Please check that GROQ_API_KEY is configured.");
      }
      throw new Error(`Server returned error (${err.response.status}). Please try again.`);
    } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      throw new Error("Evaluation request timed out. Please check your connection and try again.");
    } else if (err.request) {
      throw new Error("Network error. Could not connect to evaluation service. Please check your internet connection.");
    }

    throw err;
  }
}
