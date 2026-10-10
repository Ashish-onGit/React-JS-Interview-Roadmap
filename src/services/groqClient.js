import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Fallback direct browser execution if /api/groq-chat is not reachable
 * (e.g. standalone static preview environments).
 */
async function executeDirectClientFallback(apiKey, bodyParams) {
  const models = [
    bodyParams.model || "openai/gpt-oss-120b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "llama-3.3-70b-versatile"
  ];

  let lastError = null;

  for (const modelName of Array.from(new Set(models))) {
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

        if (response.status === 401) {
          throw new Error("Invalid Groq API key.");
        }
        if (response.status === 429) {
          throw new Error("Groq rate limit exceeded. Please wait a few seconds.");
        }

        lastError = new Error(errMsg);
        continue;
      }

      return await response.json();
    } catch (err) {
      lastError = err;
      if (err.message?.includes("Invalid Groq API key") || err.message?.includes("rate limit")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to communicate with Groq AI service.");
}

/**
 * Primary helper to execute Groq chat completions securely via the serverless backend.
 * Uses Axios to call POST /api/groq-chat, keeping the API key on the server.
 *
 * @param {Object} bodyParams - { messages, temperature, response_format, model }
 * @param {string} [clientFallbackKey] - Optional fallback key for non-serverless environments
 * @returns {Promise<Object>} Groq chat completion response
 */
export async function executeChatCompletion(bodyParams, clientFallbackKey = "") {
  try {
    const response = await axios.post("/api/groq-chat", bodyParams, {
      timeout: 35000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data) {
      return response.data;
    }

    throw new Error("Empty response received from backend AI service.");
  } catch (err) {
    const status = err.response?.status;
    const errorMsg = err.response?.data?.error;

    // If backend returned an explicit error response from Groq, propagate it directly
    if (status && status !== 404) {
      throw new Error(errorMsg || `AI Service error (${status})`);
    }

    // If backend endpoint was not found (404) and client has fallback key
    if (clientFallbackKey) {
      console.warn("Backend /api/groq-chat endpoint not reachable. Falling back to direct client request.");
      return executeDirectClientFallback(clientFallbackKey, bodyParams);
    }

    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      throw new Error("AI request timed out. Please try again.");
    }

    throw new Error(errorMsg || err.message || "Failed to communicate with AI service.");
  }
}
