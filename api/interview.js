/**
 * Vercel Serverless Function: POST /api/interview
 *
 * Backend for the AI Interview Experience.
 * Securely uses Groq AI on the server without exposing API keys.
 * Handles resume analysis, dynamic question generation, natural interviewer follow-ups,
 * and comprehensive interview evaluation summaries.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MODEL_FALLBACKS = [
  process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b"
];

function cleanAndParseJSON(rawContent) {
  let cleaned = (rawContent || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    throw err;
  }
}

async function callGroqChat(apiKey, messages, temperature = 0.3) {
  const models = Array.from(new Set(MODEL_FALLBACKS));
  let lastError = null;

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 28000);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errMsg = `Groq API error (${res.status})`;
        try {
          const errData = await res.json();
          if (errData?.error?.message) errMsg = errData.error.message;
        } catch {
          // ignore
        }

        if (res.status === 404 || errMsg.toLowerCase().includes("does not exist")) {
          lastError = new Error(errMsg);
          continue;
        }

        if (res.status === 401) throw new Error("Invalid Groq API key.");
        if (res.status === 429) throw new Error("Groq rate limit exceeded.");

        lastError = new Error(errMsg);
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to communicate with Groq AI service.");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  const apiKey = (
    process.env.GROQ_API_KEY ||
    process.env.VITE_GROQ_API_KEY ||
    process.env.AI_API_KEY ||
    ""
  ).trim();

  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not configured on the server."
    });
  }

  const { action, payload } = req.body || {};

  try {
    switch (action) {
      // ==========================================
      // ACTION 1: ANALYZE RESUME
      // ==========================================
      case "analyze-resume": {
        const resumeText = (payload?.resumeText || "").trim();
        if (!resumeText) {
          return res.status(400).json({ error: "Resume text is required." });
        }

        const systemPrompt = `You are an expert senior engineering hiring manager and technical interviewer.
Analyze the candidate's resume/experience text to prepare a personalized technical interview.
Extract skills, role, experience level, key projects, and prepare 5 tailored technical topics.
Return ONLY valid JSON matching this schema:
{
  "candidateName": "First name or Candidate",
  "roleTitle": "e.g. Full Stack Developer, Frontend Engineer, React Specialist",
  "experienceLevel": "e.g. Junior, Mid-Level (2+ years), Senior (5+ years)",
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "projects": ["Project1", "Project2"],
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  "welcomeMessage": "Polite, personalized 2-sentence opening greeting acknowledging their background and setting realistic interview expectations."
}`;

        const raw = await callGroqChat(apiKey, [
          { role: "system", content: systemPrompt },
          { role: "user", content: `CANDIDATE EXPERIENCE / RESUME:\n${resumeText.slice(0, 4500)}` }
        ], 0.2);

        const data = cleanAndParseJSON(raw);
        return res.status(200).json({ success: true, data });
      }

      // ==========================================
      // ACTION 2: GENERATE FIRST QUESTION
      // ==========================================
      case "generate-first-question": {
        const { candidateProfile, interviewStyle, difficultyLevel = 3 } = payload || {};

        const levelDescriptions = {
          1: "Level 1 (Junior / Beginner): Focus on fundamental JavaScript syntax, basic components, props, state, and simple DOM events.",
          2: "Level 2 (Junior-Mid): Focus on React hooks (useState, useEffect), async/await API fetching, form handling, and array methods.",
          3: "Level 3 (Mid-Level): Focus on reconciliation, performance hooks (useMemo, useCallback), custom hooks, state management, and error handling.",
          4: "Level 4 (Senior): Focus on frontend architecture, Concurrent React, SSR/hydration, caching strategies, micro-frontends, and design patterns.",
          5: "Level 5 (Staff / Lead Architect): Focus on high-scale distributed frontend architecture, runtime & V8 internals, compiler/bundler plugins, and security.",
        };

        const targetLevelNote = levelDescriptions[difficultyLevel] || levelDescriptions[3];

        const systemPrompt = `You are an expert technical interviewer conducting a live technical interview.
Based on the candidate's profile, interview style, and target difficulty level, generate the opening technical interview question.
TARGET DIFFICULTY: Level ${difficultyLevel} of 5. ${targetLevelNote}
The question MUST directly relate to the candidate's claimed skills or projects and strictly match Level ${difficultyLevel} depth.
Return ONLY valid JSON matching this schema:
{
  "greeting": "Brief conversational opening remark from the interviewer acknowledging their experience and setting the tone.",
  "question": "Clear, realistic interview question text matched to Level ${difficultyLevel}.",
  "topic": "The technical topic being evaluated",
  "type": "conceptual" | "practical" | "code" | "project"
}`;

        const userPrompt = `Candidate Profile:
Role: ${candidateProfile?.roleTitle || "Software Engineer"}
Level: ${candidateProfile?.experienceLevel || "Mid"}
Skills: ${(candidateProfile?.skills || []).join(", ")}
Projects: ${(candidateProfile?.projects || []).join(", ")}
Interview Style: ${interviewStyle || "Technical Interview"}
Difficulty Level: Level ${difficultyLevel} / 5 (${targetLevelNote})

Generate an engaging, relevant first interview question.`;

        const raw = await callGroqChat(apiKey, [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ], 0.3);

        const data = cleanAndParseJSON(raw);
        return res.status(200).json({ success: true, data });
      }

      // ==========================================
      // ACTION 3: EVALUATE ANSWER & HANDLE CANDIDATE INTENT
      // ==========================================
      case "evaluate-and-next": {
        const {
          currentQuestion,
          currentQuestionId = `q_${payload?.questionIndex || 1}`,
          candidateAnswer,
          codeSnippet = payload?.code || "",
          conversationHistory = [],
          questionIndex = 1,
          totalQuestions = 6,
          candidateProfile,
          interviewStyle,
          difficultyLevel = 3,
        } = payload || {};

        if (!candidateAnswer || !candidateAnswer.trim()) {
          return res.status(400).json({ error: "Candidate answer is required." });
        }

        const isLastQuestion = questionIndex >= totalQuestions;

        const currentQText = typeof currentQuestion === "object"
          ? currentQuestion?.question || currentQuestion?.text || JSON.stringify(currentQuestion)
          : String(currentQuestion || "");

        // Collect all previously asked questions to prevent repeats
        const previousQuestionsList = (conversationHistory || [])
          .map((item, idx) => {
            const q = item?.question || item?.text || "";
            return q ? `${idx + 1}. ${q}` : null;
          })
          .filter(Boolean);

        const systemPrompt = `You are a real, expert Senior Staff Technical Interviewer conducting a realistic technical interview.
Target Seniority Level: Level ${difficultyLevel} of 5.
Interview Role: ${candidateProfile?.roleTitle || "Software Engineer"}
Interview Style / Domain: ${interviewStyle || "Technical Interview"}

Your objective is to conduct an interactive, realistic interview experience like an empathetic yet rigorous human interviewer at a top technology company.

==================================================
STEP 1: ACCURATELY CLASSIFY CANDIDATE INTENT
==================================================
Classify the candidate's message into EXACTLY ONE of these 10 intents:
1. "CLARIFICATION_REQUEST": Candidate expresses confusion or says they don't understand the question (e.g. "I don't understand", "What do you mean?", "Could you explain what you're asking?").
2. "HINT_REQUEST": Candidate asks for a hint, nudge, or clue (e.g. "Can you give me a hint?", "Any clues?").
3. "REPEAT_REQUEST": Candidate asks to repeat or restate the question (e.g. "Could you repeat that?", "Say the question again").
4. "EXAMPLE_REQUEST": Candidate asks for an example or scenario to clarify the question (e.g. "Can you give me an example?", "Show a sample input/output").
5. "ANSWER_EXPLANATION_REQUEST": Candidate asks for the correct solution or gives up (e.g. "What is the correct answer?", "Tell me how it works").
6. "SKIP_REQUEST": Candidate asks to skip the question (e.g. "Can we skip this?", "I want to pass", "Next question please").
7. "RETRY_REQUEST": Candidate asks for another try (e.g. "Can I try again?", "Let me re-answer that").
8. "UNRELATED_MESSAGE": Candidate asks or says something off-topic.
9. "END_INTERVIEW_REQUEST": Candidate asks to end or wrap up the interview early.
10. "ANSWER": Candidate is answering the technical question.

==================================================
STEP 2: ENFORCE INTERVIEWER BEHAVIOR & RULES
==================================================
Rule A - NEVER GENERATE A NEW QUESTION ON INQUIRIES:
- If intent is CLARIFICATION_REQUEST, HINT_REQUEST, REPEAT_REQUEST, EXAMPLE_REQUEST, ANSWER_EXPLANATION_REQUEST, RETRY_REQUEST, or UNRELATED_MESSAGE:
  * DO NOT move to a new question!
  * DO NOT score as an answer!
  * "shouldEvaluateAnswer": false
  * "shouldGenerateNextQuestion": false
  * "nextAction": "KEEP_CURRENT_QUESTION"
  * "evaluation": null
  * "nextQuestion": null
  * In "response": provide warm, natural, human guidance:
    - CLARIFICATION_REQUEST: explain the question in simpler, practical words without losing the technical assessment goal.
    - HINT_REQUEST: give a targeted clue without giving away the full answer.
    - REPEAT_REQUEST: warmly restate the current question.
    - EXAMPLE_REQUEST: provide a brief input/output or scenario illustration.
    - ANSWER_EXPLANATION_REQUEST: explain the solution clearly and educationally, and ask if they'd like to try a related angle.
    - UNRELATED_MESSAGE: politely acknowledge and steer them right back to the question.

Rule B - SKIP REQUEST:
- If intent is SKIP_REQUEST:
  * "shouldEvaluateAnswer": false
  * "shouldGenerateNextQuestion": true
  * "nextAction": "NEXT_QUESTION"
  * In "response": politely acknowledge and transition ("No problem, let's pivot to our next area.").
  * Provide the new technical question in "nextQuestion".

Rule C - ANSWER EVALUATION (VERIFY ACTUAL CONTENT):
- Evaluate technical correctness, conceptual depth, trade-offs, and reasoning.
- DO NOT give fake praise like "Excellent!" or "Perfect!" if the answer is wrong or incomplete.
- If answer has misconceptions, politely point them out and give guidance ("WAIT_FOR_CANDIDATE" if they should retry, or "NEXT_QUESTION" if ready to advance).
- If answer is strong, briefly acknowledge and advance or ask an in-depth follow-up.
- Never repeat any question in ALL PREVIOUS QUESTIONS.

Rule D - CRITICAL CODE VERIFICATION (WHEN CANDIDATE SUBMITS CODE):
- Carefully inspect the candidate's actual submitted code line by line!
- NEVER hallucinate working code: If the code is not there, it does not exist.
- Syntax Errors: If there is a typo (e.g. "cosnt" instead of "const", missing parentheses, malformed syntax), EXPLICITLY point out the typo!
- Incomplete / Empty Logic: If the function body is empty, lacks useState, lacks return JSX, or has no logic, DO NOT claim the component works! DO NOT say "Your component correctly uses the useState hook" when useState is not written in the code!
- State clearly what is missing or broken.
- Give a score reflecting actual completion (e.g. 0-2/10 for empty/broken code).
- Set "nextAction": "WAIT_FOR_CANDIDATE", "nextQuestion": null so the candidate can fix the typo and write the actual implementation!

Return ONLY valid JSON matching this schema:
{
  "intent": "ANSWER" | "CLARIFICATION_REQUEST" | "HINT_REQUEST" | "REPEAT_REQUEST" | "EXAMPLE_REQUEST" | "ANSWER_EXPLANATION_REQUEST" | "SKIP_REQUEST" | "RETRY_REQUEST" | "UNRELATED_MESSAGE" | "END_INTERVIEW_REQUEST",
  "currentQuestionId": "${currentQuestionId}",
  "shouldEvaluateAnswer": true | false,
  "shouldGenerateNextQuestion": true | false,
  "response": "Conversational interviewer message spoken aloud and shown in chat",
  "evaluation": {
    "score": 0-10,
    "maxScore": 10,
    "strengths": ["..."],
    "improvements": ["..."],
    "missingConcepts": ["..."]
  } | null,
  "nextAction": "KEEP_CURRENT_QUESTION" | "WAIT_FOR_CANDIDATE" | "NEXT_QUESTION" | "FINISH_INTERVIEW",
  "nextQuestion": {
    "id": "q_${questionIndex + 1}",
    "question": "Only if nextAction is NEXT_QUESTION: the new interview question text",
    "topic": "topic category",
    "type": "conceptual" | "practical" | "code" | "project"
  } | null,
  "isFinished": ${isLastQuestion ? "true" : "false"}
}`;

        const userPrompt = `INTERVIEW CONTEXT:
Candidate: ${candidateProfile?.candidateName || "Candidate"} (${candidateProfile?.roleTitle || "Developer"})
Difficulty Level: Level ${difficultyLevel} / 5
Question Number: ${questionIndex} of ${totalQuestions}
Current Question ID: ${currentQuestionId}

CURRENT QUESTION:
"${currentQText}"

${codeSnippet ? `CANDIDATE'S SUBMITTED CODE:
\`\`\`javascript
${codeSnippet}
\`\`\`` : ""}

CANDIDATE'S MESSAGE / SUBMISSION:
<candidate_message>
${candidateAnswer}
</candidate_message>

ALL PREVIOUS QUESTIONS IN THIS SESSION (NEVER REPEAT ANY):
${previousQuestionsList.length > 0 ? previousQuestionsList.join("\n") : "None yet."}

Verify the candidate's submission with strict technical accuracy. If code was provided, inspect the syntax and implementation line by line!`;

        const raw = await callGroqChat(apiKey, [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ], 0.25);

        const data = cleanAndParseJSON(raw);

        // ==========================================
        // DETERMINISTIC INTENT VERIFICATION & STATE ENFORCEMENT
        // ==========================================
        const trimmed = candidateAnswer.trim();

        // High-confidence heuristic triggers
        if (/^(can you (give|provide) (me )?a hint|give me a hint|hint please|any hint|i need a hint|could you give a hint)/i.test(trimmed)) {
          data.intent = "HINT_REQUEST";
        } else if (/^(can you repeat|repeat the question|please repeat|say that again|repeat please|could you repeat)/i.test(trimmed)) {
          data.intent = "REPEAT_REQUEST";
        } else if (/^(can you (give|provide) (me )?an example|give an example|provide an example|show me an example|any example)/i.test(trimmed)) {
          data.intent = "EXAMPLE_REQUEST";
        } else if (/^(what is the (correct )?answer|tell me the answer|can you explain the answer|i give up, what's the answer|what's the answer)/i.test(trimmed)) {
          data.intent = "ANSWER_EXPLANATION_REQUEST";
        } else if (/^(skip( this)?|next question please|i want to skip|pass|can we skip|skip question)/i.test(trimmed)) {
          data.intent = "SKIP_REQUEST";
        } else if (/^(can i (try|attempt) again|let me try again|another try|one more try|can i re-answer)/i.test(trimmed)) {
          data.intent = "RETRY_REQUEST";
        } else if (/^(i (don'?t|didn'?t) (understand|get)|what do you mean|could you clarify|can you explain what|not understanding)/i.test(trimmed)) {
          data.intent = "CLARIFICATION_REQUEST";
        } else if (/^(i want to end( the)? interview|finish interview|stop the interview|exit interview|end interview)/i.test(trimmed)) {
          data.intent = "END_INTERVIEW_REQUEST";
        }

        // STRICT INVARIANT ENFORCEMENT:
        // No non-answer inquiry can ever advance questions or score
        if (data.intent !== "ANSWER" && data.intent !== "SKIP_REQUEST") {
          data.shouldEvaluateAnswer = false;
          data.shouldGenerateNextQuestion = false;
          data.evaluation = null;
          data.nextQuestion = null;
          data.nextAction = data.intent === "END_INTERVIEW_REQUEST" ? "FINISH_INTERVIEW" : "KEEP_CURRENT_QUESTION";
          data.isFinished = data.intent === "END_INTERVIEW_REQUEST";
        }

        if (data.intent === "SKIP_REQUEST") {
          data.shouldEvaluateAnswer = false;
          data.shouldGenerateNextQuestion = true;
          data.evaluation = {
            score: 0,
            maxScore: 10,
            feedback: "Question skipped by candidate (0/10 - points deducted).",
            skipped: true,
          };
          data.nextAction = "NEXT_QUESTION";
          if (!data.feedback || data.feedback.length < 5) {
            data.feedback = "Understood. Skipping this question. Please note that skipping deducts points for this question.";
          }
          if (!data.nextQuestion) {
            data.nextQuestion = {
              id: `q_${questionIndex + 1}`,
              question: "How do you manage complex side effects and asynchronous state flows in modern React applications?",
              topic: "Async State Architecture",
              type: "practical"
            };
          }
        }

        return res.status(200).json({ success: true, data });
      }

      // ==========================================
      // ACTION 4: GENERATE FINAL INTERVIEW SUMMARY
      // ==========================================
      case "generate-summary": {
        const { interviewSession, candidateProfile } = payload || {};
        const questions = interviewSession?.questions || [];

        // Count skipped questions
        const skippedQuestions = questions.filter(
          (q) => q.skipped || q.evaluation?.skipped || /skip(ped)?/i.test(q.answer || "")
        );
        const skippedCount = skippedQuestions.length;

        const systemPrompt = `You are a technical interview review board evaluating a candidate's completed interview.
Score objectively on a 0-100 scale across 4 core competencies:
1. technicalKnowledge (0-100)
2. communication (0-100)
3. problemSolving (0-100)
4. depthOfAnswers (0-100)

CRITICAL SKIPPED QUESTION PENALTY:
Total questions in session: ${questions.length}
Questions skipped by candidate: ${skippedCount}
- Each skipped question MUST deduct points directly from the candidate's score!
- For each skipped question, deduct 15-20 points from 'overallScore', 'technicalKnowledge', and 'problemSolving'.
- If candidate skipped 1 question, their maximum technicalKnowledge should not exceed 80.
- If candidate skipped 2 questions, their maximum technicalKnowledge should not exceed 65.
- Explicitly note the skipped question penalty in the 'summary' and in 'areasForImprovement'.

Return ONLY valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "scores": {
    "technicalKnowledge": number (0-100),
    "communication": number (0-100),
    "problemSolving": number (0-100),
    "depthOfAnswers": number (0-100)
  },
  "summary": "Crisp 2-3 sentence overall performance evaluation summary mentioning any skipped questions penalty.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForImprovement": ["Area 1", "Area 2"]
}`;

        const transcriptText = questions
          .map((q, i) => {
            const isSkipped = q.skipped || q.evaluation?.skipped || /skip(ped)?/i.test(q.answer || "");
            if (isSkipped) {
              return `Q${i + 1}: ${q.question}\nA: [QUESTION SKIPPED BY CANDIDATE - 0/10 SCORE PENALTY]`;
            }
            return `Q${i + 1}: ${q.question}\nA: ${q.answer || "No answer recorded."} (Score: ${q.evaluation?.score ?? "N/A"}/10)`;
          })
          .join("\n\n");

        const raw = await callGroqChat(apiKey, [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Candidate: ${candidateProfile?.roleTitle || "Developer"}\n\nINTERVIEW TRANSCRIPT:\n${transcriptText.slice(0, 4500)}`
          }
        ], 0.2);

        const data = cleanAndParseJSON(raw);

        // Guarantee penalty deduction even if LLM missed it
        if (skippedCount > 0 && data.scores) {
          const penalty = skippedCount * 18;
          data.scores.technicalKnowledge = Math.max(15, Math.round(data.scores.technicalKnowledge - penalty));
          data.scores.problemSolving = Math.max(15, Math.round(data.scores.problemSolving - penalty));
          if (data.overallScore) {
            data.overallScore = Math.max(15, Math.round(data.overallScore - penalty));
          }
          if (data.summary && !data.summary.includes("skipped")) {
            data.summary += ` Note: ${skippedCount} question(s) were skipped, which deducted points from the overall evaluation.`;
          }
        }

        return res.status(200).json({ success: true, data });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error(`[api/interview] Error handling action "${action}":`, err);
    return res.status(500).json({
      error: err.message || "Failed to process interview request."
    });
  }
}
