/**
 * Vercel Serverless Function: POST /api/groq-chat
 *
 * Secure server-side proxy for Groq chat completions.
 * Protects GROQ_API_KEY from exposure to the client bundle.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MODEL_FALLBACKS = [
  process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "llama-3.3-70b-versatile"
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = (
    process.env.GROQ_API_KEY ||
    process.env.VITE_GROQ_API_KEY ||
    process.env.AI_API_KEY ||
    ""
  ).trim();

  if (!apiKey) {
    return res.status(500).json({
      error: "AI service is not configured. GROQ_API_KEY is missing on server."
    });
  }

  const { messages, temperature = 0.3, response_format, model } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required." });
  }

  const modelsToTry = Array.from(
    new Set([model, ...MODEL_FALLBACKS].filter(Boolean))
  );

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 28000);

      const groqRes = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature,
          ...(response_format ? { response_format } : {})
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!groqRes.ok) {
        let errMsg = `Groq API error (${groqRes.status})`;
        try {
          const errData = await groqRes.json();
          if (errData?.error?.message) {
            errMsg = errData.error.message;
          }
        } catch {
          // ignore
        }

        if (
          groqRes.status === 404 ||
          errMsg.toLowerCase().includes("does not exist") ||
          errMsg.toLowerCase().includes("access to it")
        ) {
          lastError = new Error(errMsg);
          continue;
        }

        if (groqRes.status === 401) {
          return res.status(500).json({ error: "Invalid Groq API key configured on server." });
        }
        if (groqRes.status === 429) {
          return res.status(429).json({ error: "Groq rate limit exceeded. Please wait a few seconds and try again." });
        }

        lastError = new Error(errMsg);
        continue;
      }

      const groqData = await groqRes.json();
      return res.status(200).json(groqData);
    } catch (err) {
      if (err.name === "AbortError") {
        lastError = new Error("Request to Groq timed out.");
      } else {
        lastError = err;
      }
    }
  }

  return res.status(502).json({
    error: lastError?.message || "Failed to communicate with Groq AI service."
  });
}
