export const QUESTION_SYSTEM_PROMPT = `You are an experienced JavaScript and React technical interviewer.
Your job is to create realistic interview questions for the supplied topic.
The questions are for a developer preparing for technical interviews.
Use the supplied topic content as the primary source.

LANGUAGE STYLE (VERY IMPORTANT):
- Answers and explanations must use natural Indian developer Hinglish (conversational Hindi-English) as spoken by software engineers in India.
- Keep all technical terms in English (e.g., Closure, Hoisting, Call Stack, Event Loop, Lexical Environment, useEffect, Props, State, Virtual DOM, Render cycle). Do NOT translate technical programming terms into unnatural Hindi.
- The actual interview question can be in English or natural developer Hinglish (e.g., "What is a closure in JavaScript?" or "Is code ka output kya hoga aur kyun?").
- Answers should be concise, crisp, and interview-ready. Avoid textbook-length fluff. Include a direct answer plus key bullet points or a short interview takeaway when helpful.

RULES:
1. Generate only questions strictly relevant to the supplied topic and its hierarchy.
2. Do not invent concepts unsupported by the supplied learning content or roadmap context.
3. Distribute question difficulty and interview styles progressively:
   - Basic: Core definitions, fundamentals (e.g. "What is X?", "When is X created?")
   - Conceptual: Deep understanding, internal mechanics (e.g. "How does X work under the hood?")
   - Practical / Scenario: Real-world usage, architectural decisions (e.g. "Where do we use X in production?", "How does X help with data privacy?")
   - Code / Output: Realistic code snippets with expected output and line-by-line explanation when programming concepts are involved.
   - Comparison: Distinguish commonly confused concepts (e.g. "X vs Y — what is the difference?")
   - Advanced: Edge cases, memory lifecycle, performance considerations.
4. For programming topics, include code questions with a "code" field containing clean JavaScript/JSX.
5. Every question must have a deterministic ID: "<slug>-q1", "<slug>-q2", etc.
6. Return strictly VALID JSON with NO Markdown wrappers (no \`\`\`json or \`\`\`).

JSON SCHEMA:
{
  "questions": [
    {
      "id": "<slug>-q1",
      "question": "Question text here?",
      "answer": "Concise, interview-ready model answer in natural Hinglish.",
      "explanation": "Clear technical explanation of why this works, edge cases, or interview tips.",
      "difficulty": "basic" | "medium" | "advanced",
      "type": "conceptual" | "code" | "output" | "scenario" | "comparison" | "practical" | "debugging",
      "code": "Optional code snippet if relevant, otherwise empty string"
    }
  ]
}`;

/**
 * Builds the prompt for initial question set generation.
 */
export function buildQuestionPrompt({
  topicSlug,
  topicName,
  parentSection,
  roadmapPath,
  topicContent = "",
  revisionNotes = null,
  isSmallTopic = false
}) {
  let prompt = `ROADMAP HIERARCHY:\n${roadmapPath || topicName}\n\n`;
  prompt += `PARENT SECTION:\n${parentSection || "General"}\n\n`;
  prompt += `CURRENT TOPIC:\n${topicName}\n\n`;

  if (topicContent) {
    prompt += `TOPIC LEARNING CONTENT / NOTES:\n${topicContent}\n\n`;
  }

  if (revisionNotes && typeof revisionNotes === "object") {
    prompt += `QUICK REVISION CONTEXT:\n${JSON.stringify(revisionNotes, null, 2).slice(0, 1500)}\n\n`;
  }

  const targetCount = isSmallTopic
    ? "Generate between 6 to 8 focused, high-yield interview questions (do not generate repetitive filler for small concepts)."
    : "Generate at least 10 to 12 distinct, progressive interview questions spanning basic, conceptual, practical, code-based/output, scenario, and advanced difficulty.";

  prompt += `TASK:
Create a comprehensive interview question bank for "${topicName}".
${targetCount}
Use deterministic IDs starting with "${topicSlug}-q1", "${topicSlug}-q2", etc.
Return strictly valid JSON matching the schema without markdown wrappers.`;

  return prompt;
}

/**
 * Builds the prompt for generating additional questions ("+ Generate More").
 */
export function buildGenerateMorePrompt({
  topicSlug,
  topicName,
  parentSection,
  roadmapPath,
  topicContent = "",
  revisionNotes = null,
  existingQuestions = [],
  startIndex = 1
}) {
  let prompt = `ROADMAP HIERARCHY:\n${roadmapPath || topicName}\n\n`;
  prompt += `PARENT SECTION:\n${parentSection || "General"}\n\n`;
  prompt += `CURRENT TOPIC:\n${topicName}\n\n`;

  if (topicContent) {
    prompt += `TOPIC LEARNING CONTENT / NOTES:\n${topicContent}\n\n`;
  }

  if (revisionNotes && typeof revisionNotes === "object") {
    prompt += `QUICK REVISION CONTEXT:\n${JSON.stringify(revisionNotes, null, 2).slice(0, 1200)}\n\n`;
  }

  if (Array.isArray(existingQuestions) && existingQuestions.length > 0) {
    prompt += `EXISTING QUESTIONS IN QUESTION BANK (DO NOT DUPLICATE OR CLOSELY PARAPHRASE THESE):\n`;
    existingQuestions.forEach((q, idx) => {
      prompt += `${idx + 1}. [${q.type || "conceptual"}] ${q.question}\n`;
    });
    prompt += `\n`;
  }

  prompt += `TASK:
Generate approximately 5 NEW and DISTINCT interview questions for "${topicName}".
CRITICAL: Do NOT duplicate or re-ask the existing questions listed above. Explore new interview angles:
- Edge cases and tricky behavior
- Real-world production scenarios
- Comparison with alternative patterns
- Debugging or code output questions
- Common interviewer follow-up questions

Use deterministic IDs starting from "${topicSlug}-q${startIndex}".
Return strictly valid JSON matching the schema without markdown wrappers.`;

  return prompt;
}
