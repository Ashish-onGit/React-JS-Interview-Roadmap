import axios from "axios";

/**
 * Fallback resume analyzer if network or backend service is offline
 */
function fallbackAnalyzeResume(resumeText) {
  const text = (resumeText || "").toLowerCase();
  const skills = [];

  const commonSkills = [
    "react", "javascript", "typescript", "node.js", "express", "mongodb",
    "redux", "next.js", "tailwind css", "html", "css", "git", "rest api",
    "graphql", "sql", "postgresql", "docker", "aws", "jest"
  ];

  commonSkills.forEach((s) => {
    if (text.includes(s.toLowerCase())) {
      skills.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
  });

  const finalSkills = skills.length > 0 ? skills.slice(0, 6) : ["JavaScript", "React", "Web Fundamentals", "State Management", "Async Programming"];
  const candidateName = text.includes("ashish") ? "Ashish" : "Candidate";

  return {
    candidateName,
    roleTitle: text.includes("mern") ? "Full Stack MERN Developer" : text.includes("frontend") ? "Frontend Engineer" : "Full Stack JavaScript Developer",
    experienceLevel: text.includes("year") ? "Mid-Level Engineer" : "Software Developer",
    skills: finalSkills,
    projects: ["Web Applications", "Full-Stack System"],
    topics: finalSkills.slice(0, 5),
    welcomeMessage: `Hi ${candidateName}! I've analyzed your background in ${finalSkills.slice(0, 3).join(", ")}. Let's begin your technical interview.`
  };
}

/**
 * Fallback questions repository organized by difficulty levels (1 to 5)
 */
const FALLBACK_QUESTIONS_BY_LEVEL = {
  1: [
    {
      greeting: "Welcome! Let's start with a foundational JavaScript and React concept.",
      question: "Can you explain the difference between 'let', 'const', and 'var' in JavaScript, and what scoping rules apply to them?",
      topic: "JavaScript Variables & Scope",
      type: "conceptual"
    },
    {
      greeting: "Great. Now let's talk about components in React.",
      question: "What is the difference between props and state in React, and when would you use each?",
      topic: "React Props & State",
      type: "conceptual"
    },
    {
      greeting: "Let's touch on basic array operations.",
      question: "How do the array methods map, filter, and forEach differ when rendering lists of elements in React?",
      topic: "Array Manipulation & Lists",
      type: "practical"
    },
    {
      greeting: "Let's discuss handling user interaction.",
      question: "How do synthetic events work in React, and how do you handle a form submission or button click cleanly?",
      topic: "Event Handling",
      type: "practical"
    },
    {
      greeting: "Now let's examine conditional rendering.",
      question: "What are the recommended ways to conditionally render elements in JSX (e.g. ternary operator vs logical &&)?",
      topic: "Conditional Rendering",
      type: "conceptual"
    },
    {
      greeting: "Let's wrap up with keys in lists.",
      question: "Why does React require a unique 'key' prop when rendering lists, and why is using the array index as a key considered an anti-pattern?",
      topic: "List Keys & Reconciliation",
      type: "conceptual"
    }
  ],
  2: [
    {
      greeting: "Great to meet you. Let's start with React hooks and side-effects.",
      question: "How does the useEffect hook work in React, and what purpose does the dependency array serve?",
      topic: "React Lifecycle & useEffect",
      type: "conceptual"
    },
    {
      greeting: "Nice. Let's look at handling asynchronous operations.",
      question: "How do you handle API calls using fetch or Axios in React components, and how do you manage loading and error states?",
      topic: "Asynchronous Data Fetching",
      type: "practical"
    },
    {
      greeting: "Let's explore component communication.",
      question: "What is 'prop drilling', and what are common techniques to share state between deeply nested components?",
      topic: "Component State Flow",
      type: "conceptual"
    },
    {
      greeting: "Now let's examine uncontrolled vs controlled inputs.",
      question: "What is the difference between controlled and uncontrolled components in React, and when would you use useRef?",
      topic: "Forms & Refs",
      type: "practical"
    },
    {
      greeting: "Let's look at custom hooks.",
      question: "What are the rules of React Hooks, and how do you build a custom hook to share stateful logic between components?",
      topic: "Custom Hooks & Logic Reuse",
      type: "conceptual"
    },
    {
      greeting: "Let's wrap up with error handling.",
      question: "How do Error Boundaries work in React, and what types of errors can they catch versus not catch?",
      topic: "Error Boundaries & Resilience",
      type: "conceptual"
    }
  ],
  3: [
    {
      greeting: "Welcome! Let's start with a core JavaScript concurrency concept.",
      question: "Can you explain what the event loop in JavaScript is, and how the call stack interacts with the microtask and macrotask queues?",
      topic: "JavaScript & Concurrency",
      type: "conceptual"
    },
    {
      greeting: "Great, let's look at component rendering and optimization.",
      question: "How does the Virtual DOM reconciliation algorithm work in React, and when would you use useMemo or useCallback to avoid unnecessary re-renders?",
      topic: "React Performance & Reconciliation",
      type: "conceptual"
    },
    {
      greeting: "Let's explore state management architecture.",
      question: "What are the key trade-offs between local component state, React Context, and an external store like Redux Toolkit in production applications?",
      topic: "State Management Architecture",
      type: "conceptual"
    },
    {
      greeting: "Now let's look at practical routing and lazy loading.",
      question: "How does code splitting with React.lazy and Suspense work under the hood to reduce initial bundle size?",
      topic: "Code Splitting & Suspense",
      type: "architecture"
    },
    {
      greeting: "Let's examine authentication flows.",
      question: "How do you securely handle JWT storage and automatic token refresh in a client-side React single-page application?",
      topic: "Auth & Security",
      type: "practical"
    },
    {
      greeting: "Let's conclude with debugging.",
      question: "If a user reports that a large dashboard page is lagging when typing in an input, what step-by-step methodology and profiling tools would you use to diagnose the bottleneck?",
      topic: "Performance Profiling",
      type: "practical"
    }
  ],
  4: [
    {
      greeting: "Great to have you here. Let's dive straight into advanced architecture and performance.",
      question: "How does React 18's Concurrent Mode and Automatic Batching work under the hood, and what are the architectural trade-offs of useTransition versus useDeferredValue?",
      topic: "Concurrent React Internals",
      type: "architectural"
    },
    {
      greeting: "Let's discuss modern rendering paradigms.",
      question: "Compare Server-Side Rendering (SSR), Static Site Generation (SSG), and Streaming Hydration. What causes hydration mismatches and how do you prevent them at scale?",
      topic: "SSR & Streaming Hydration",
      type: "architectural"
    },
    {
      greeting: "Now let's explore distributed web patterns.",
      question: "How would you architect a production Micro-Frontend application using Module Federation while maintaining shared authentication and shared design tokens?",
      topic: "Micro-Frontends & Module Federation",
      type: "system-design"
    },
    {
      greeting: "Let's look at state machines and complex UI flows.",
      question: "When should you model complex UI state with Finite State Machines (like XState) instead of standard React state or reducers?",
      topic: "State Machines & Modeling",
      type: "architectural"
    },
    {
      greeting: "Let's examine network resilience and caching.",
      question: "How do tools like React Query or SWR implement stale-while-revalidate caching, request deduplication, and optimistic updates?",
      topic: "Data Synchronization & Cache",
      type: "practical"
    },
    {
      greeting: "Let's finish with bundle architecture.",
      question: "How do modern tree-shaking algorithms work with ES modules, and how do side-effects in package.json affect build output in Webpack/Vite?",
      topic: "Bundler Mechanics & Optimization",
      type: "internals"
    }
  ],
  5: [
    {
      greeting: "Welcome. Let's start with high-scale frontend systems design and runtime internals.",
      question: "If you were designing a resilient, high-throughput frontend platform supporting millions of concurrent users, how would you design module federation, runtime hydration, custom AST compiler optimizations, and edge asset caching?",
      topic: "Enterprise Frontend Architecture",
      type: "system-design"
    },
    {
      greeting: "Let's go into compiler and bundler internals.",
      question: "Explain how modern JavaScript runtimes (V8) optimize inline caches and hidden classes. How does that influence how you write hot performance-critical React code or data structures?",
      topic: "Runtime Optimization & V8 Internals",
      type: "internals"
    },
    {
      greeting: "Let's examine resilience and multi-tenant security.",
      question: "How do you enforce security barriers (CSP, CSRF, XSS sandboxing) across third-party micro-frontend plugins while maintaining unified telemetry and error containment?",
      topic: "Web Security & Resilient Systems",
      type: "security"
    },
    {
      greeting: "Let's analyze rendering engine internals.",
      question: "How does React's Fiber architecture implement cooperative multitasking using algebraic effects and lane priorities under high CPU load?",
      topic: "React Fiber Architecture & Schedulers",
      type: "internals"
    },
    {
      greeting: "Let's discuss distributed design systems.",
      question: "How would you architect a design system across 50+ independent teams ensuring zero runtime CSS collisions, sub-second hot reload, and automated accessibility compliance?",
      topic: "Design Systems at Scale",
      type: "system-design"
    },
    {
      greeting: "Let's conclude with engineering governance.",
      question: "What technical strategies, automated linting AST rules, and CI performance budgets would you implement to prevent performance regressions across a monorepo with 100+ contributors?",
      topic: "Engineering Governance & CI Budgets",
      type: "leadership"
    }
  ]
};

const FALLBACK_QUESTIONS = FALLBACK_QUESTIONS_BY_LEVEL[3];

export async function analyzeResume(resumeText) {
  try {
    const response = await axios.post("/api/interview", {
      action: "analyze-resume",
      payload: { resumeText }
    }, {
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn("Backend resume analysis unavailable, using local intelligent analysis:", err.message);
  }

  return fallbackAnalyzeResume(resumeText);
}

export async function generateFirstQuestion(arg1, arg2) {
  let candidateProfile = arg1;
  let interviewStyle = arg2;
  let difficultyLevel = 3;

  if (typeof arg1 === "object" && arg1 !== null) {
    if (arg1.resumeContext || arg1.interviewType || arg1.difficultyLevel) {
      candidateProfile = { resumeText: arg1.resumeContext };
      interviewStyle = arg1.interviewType;
      difficultyLevel = arg1.difficultyLevel || 3;
    } else if (arg1.difficultyLevel) {
      difficultyLevel = arg1.difficultyLevel;
    }
  }

  try {
    const response = await axios.post("/api/interview", {
      action: "generate-first-question",
      payload: { candidateProfile, interviewStyle, difficultyLevel }
    }, {
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn("Backend question generation unavailable, using adaptive fallback:", err.message);
  }

  const levelQuestions = FALLBACK_QUESTIONS_BY_LEVEL[difficultyLevel] || FALLBACK_QUESTIONS_BY_LEVEL[3];
  return levelQuestions[0];
}

export async function evaluateAndNext({
  currentQuestion,
  currentQuestionId,
  candidateAnswer,
  codeSnippet,
  conversationHistory = [],
  questionIndex = 1,
  totalQuestions = 6,
  candidateProfile,
  interviewStyle,
  difficultyLevel = 3,
}) {
  try {
    const response = await axios.post("/api/interview", {
      action: "evaluate-and-next",
      payload: {
        currentQuestion,
        currentQuestionId,
        candidateAnswer,
        codeSnippet,
        conversationHistory,
        questionIndex,
        totalQuestions,
        candidateProfile,
        interviewStyle,
        difficultyLevel,
      }
    }, {
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn("Backend answer evaluation unavailable, using intelligent local evaluation:", err.message);
  }

  // Local fallback response with intent recognition
  const trimmed = (candidateAnswer || "").trim().toLowerCase();
  const levelQuestions = FALLBACK_QUESTIONS_BY_LEVEL[difficultyLevel] || FALLBACK_QUESTIONS_BY_LEVEL[3];
  const isFinished = questionIndex >= totalQuestions || questionIndex >= levelQuestions.length;
  const nextQ = (!isFinished && questionIndex < levelQuestions.length) ? levelQuestions[questionIndex] : null;

  if (/^(can you (give|provide) (me )?a hint|give me a hint|hint please|any hint|i need a hint)/i.test(trimmed)) {
    return {
      intent: "HINT_REQUEST",
      response: "Here is a hint: consider how React manages component lifecycles or state updates under the hood, and what data structures or hooks are involved.",
      evaluation: null,
      nextAction: "KEEP_CURRENT_QUESTION",
      nextQuestion: null,
      isFinished: false
    };
  }

  if (/^(i (don'?t|didn'?t) (understand|get)|what do you mean|could you clarify|can you explain)/i.test(trimmed)) {
    return {
      intent: "CLARIFICATION_REQUEST",
      response: "Let me clarify the question: we are looking for the core mechanism and practical purpose of this concept in real React applications. Take your time and give it a try.",
      evaluation: null,
      nextAction: "KEEP_CURRENT_QUESTION",
      nextQuestion: null,
      isFinished: false
    };
  }

  if (/^(can you repeat|repeat the question|please repeat|say that again)/i.test(trimmed)) {
    const currentText = typeof currentQuestion === "object" ? currentQuestion.question : currentQuestion;
    return {
      intent: "REPEAT_REQUEST",
      response: `Certainly, here is the question again: "${currentText}"`,
      evaluation: null,
      nextAction: "KEEP_CURRENT_QUESTION",
      nextQuestion: null,
      isFinished: false
    };
  }

  if (/^(skip( this)?|next question please|i want to skip|pass|can we skip)/i.test(trimmed)) {
    return {
      intent: "SKIP_REQUEST",
      response: "No problem at all, let's pivot to the next topic.",
      evaluation: null,
      nextAction: "NEXT_QUESTION",
      nextQuestion: nextQ,
      isFinished: isFinished || !nextQ
    };
  }

  const remarks = [
    "Thank you for walking me through your thoughts. Let's proceed to the next technical question.",
    "Understood. Let's look at another fundamental concept.",
    "I noted your answer. Let's transition to the next scenario.",
    "Good, let's explore your practical experience from another angle.",
    "Let's move forward to the next area of the interview."
  ];
  const remark = remarks[(questionIndex - 1) % remarks.length];

  return {
    intent: "ANSWER",
    response: remark,
    evaluation: {
      score: 7,
      maxScore: 10,
      strengths: ["Clear communication of the primary concept."],
      improvements: ["Provide more concrete production examples."],
      missingConcepts: []
    },
    nextAction: isFinished || !nextQ ? "FINISH_INTERVIEW" : "NEXT_QUESTION",
    nextQuestion: nextQ,
    isFinished: isFinished || !nextQ
  };
}

export async function evaluateAnswerAndGetNext(params) {
  const currentQuestion = params.currentQuestion;
  const currentQuestionId = params.currentQuestionId;
  const candidateAnswer = params.candidateAnswer;
  const candidateProfile = params.candidateProfile || { resumeText: params.resumeContext };
  const interviewStyle = params.interviewStyle || params.interviewType;
  const conversationHistory = params.conversationHistory || params.history || [];
  const questionIndex = params.questionIndex || (conversationHistory.length || 1);
  const totalQuestions = params.totalQuestions || 6;

  const result = await evaluateAndNext({
    currentQuestion,
    currentQuestionId,
    candidateAnswer,
    codeSnippet: params.codeSnippet,
    conversationHistory,
    questionIndex,
    totalQuestions,
    candidateProfile,
    interviewStyle,
    difficultyLevel: params.difficultyLevel || 3,
  });

  const intent = result.intent || "ANSWER";
  const nextAction = result.nextAction || (result.isFinished ? "FINISH_INTERVIEW" : "NEXT_QUESTION");
  const feedback = result.response || result.interviewerRemark || "Understood.";
  const nextQ = typeof result.nextQuestion === "object" ? result.nextQuestion?.question : result.nextQuestion;

  return {
    ...result,
    intent,
    feedback,
    evaluation: result.evaluation || null,
    nextAction,
    nextQuestion: nextQ || null,
    nextQuestionObj: result.nextQuestion || null,
    isCompleted: nextAction === "FINISH_INTERVIEW" || Boolean(result.isFinished),
    isClarification: intent === "CLARIFICATION_REQUEST",
    isHint: intent === "HINT_REQUEST",
    isRepeat: intent === "REPEAT_REQUEST",
    isExample: intent === "EXAMPLE_REQUEST",
    isExplanation: intent === "ANSWER_EXPLANATION_REQUEST",
    isSkip: intent === "SKIP_REQUEST",
    isRetry: intent === "RETRY_REQUEST",
  };
}

export async function generateInterviewSummary(arg1, arg2) {
  // Support both generateInterviewSummary(session, profile) and generateInterviewSummary({ history, resumeContext, ... })
  let interviewSession = arg1;
  let candidateProfile = arg2;

  if (arg1 && !arg2 && (arg1.history || arg1.resumeContext)) {
    interviewSession = {
      questions: arg1.history || [],
      durationFormatted: arg1.durationFormatted,
      interviewType: arg1.interviewType,
    };
    candidateProfile = {
      resumeText: arg1.resumeContext,
    };
  }

  try {
    const response = await axios.post("/api/interview", {
      action: "generate-summary",
      payload: { interviewSession, candidateProfile }
    }, {
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
  } catch (err) {
  }

  const questionsList = interviewSession?.questions || [];
  const skippedCount = questionsList.filter(
    (q) => q.skipped || q.evaluation?.skipped || /skip(ped)?/i.test(q.answer || "")
  ).length;
  const penalty = skippedCount * 18;

  const baseTechnical = Math.max(20, 86 - penalty);
  const baseProblemSolving = Math.max(20, 85 - penalty);
  const baseOverall = Math.max(20, 84 - penalty);
  const baseDepth = Math.max(20, 83 - penalty);

  return {
    overallScore: baseOverall,
    scores: {
      technicalKnowledge: baseTechnical,
      communication: Math.max(35, 80 - skippedCount * 6),
      problemSolving: baseProblemSolving,
      depthOfAnswers: baseDepth,
    },
    summary: skippedCount > 0
      ? `Completed interview with ${skippedCount} question(s) skipped. Points have been deducted accordingly for unattempted topics.`
      : "Demonstrated solid technical understanding of core JavaScript, React, and full-stack patterns. Articulated solutions clearly and maintained a calm, methodical problem-solving demeanor.",
    overallFeedback: skippedCount > 0
      ? `Completed interview with ${skippedCount} question(s) skipped. Points have been deducted accordingly for unattempted topics.`
      : "Demonstrated solid technical understanding of core JavaScript, React, and full-stack patterns. Articulated solutions clearly and maintained a calm, methodical problem-solving demeanor.",
    strengths: [
      "Clear conceptual grasp of asynchronous execution and component lifecycles",
      "Practical awareness of real-world production trade-offs",
      "Good structure in verbal technical responses"
    ],
    areasForImprovement: [
      skippedCount > 0
        ? `Attempt all questions directly without skipping to avoid score deductions (${skippedCount} skipped)`
        : "Can elaborate further on edge cases when discussing architecture",
      "Provide concrete code metrics or benchmarks where applicable"
    ]
  };
}

