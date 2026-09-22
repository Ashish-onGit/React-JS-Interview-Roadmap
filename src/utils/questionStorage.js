const QUESTION_STORAGE_KEY = "react-js-interview-questions";
const CURRENT_STORAGE_VERSION = 1;

/**
 * Deterministically generates a stable topic storage key based on the roadmap hierarchy.
 * Never uses timestamps, random numbers, or UUIDs.
 * Example: javascript-functions/functions/js-functions-closures or with subtopic.
 */
export function generateTopicStorageId({ categoryId, sectionId, topicId, subtopicId }) {
  const cleanCat = String(categoryId || "").trim();
  const cleanSec = String(sectionId || "").trim();
  const cleanTop = String(topicId || "").trim();

  if (subtopicId) {
    const cleanSub = String(subtopicId).trim();
    return `${cleanCat}/${cleanSec}/${cleanTop}/${cleanSub}`;
  }

  return `${cleanCat}/${cleanSec}/${cleanTop}`;
}

/**
 * Creates a clean slug for question IDs based on the topic/subtopic title or ID.
 * Example: "closures" -> "closures", "Call Stack" -> "call-stack"
 */
export function generateQuestionSlug(nameOrId) {
  if (!nameOrId) return "q";
  return String(nameOrId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "q";
}

/**
 * Normalizes question text for client-side duplicate comparison.
 */
export function normalizeQuestionText(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Safely parses the entire question storage tree from localStorage.
 * Handles schema versioning and backwards compatibility.
 */
function getStorageRoot() {
  try {
    const raw = localStorage.getItem(QUESTION_STORAGE_KEY);
    if (!raw) {
      return { version: CURRENT_STORAGE_VERSION, topics: {} };
    }
    const parsed = JSON.parse(raw);

    // If already in versioned structure:
    if (parsed && typeof parsed === "object" && parsed.version && parsed.topics) {
      return parsed;
    }

    // Migration from unversioned root dictionary if encountered:
    if (parsed && typeof parsed === "object") {
      return {
        version: CURRENT_STORAGE_VERSION,
        topics: parsed
      };
    }

    return { version: CURRENT_STORAGE_VERSION, topics: {} };
  } catch (err) {
    console.error("Failed to read interview questions from localStorage:", err);
    return { version: CURRENT_STORAGE_VERSION, topics: {} };
  }
}

/**
 * Safely writes the question storage tree to localStorage with quota protection.
 */
function setStorageRoot(root) {
  try {
    localStorage.setItem(QUESTION_STORAGE_KEY, JSON.stringify(root));
    return true;
  } catch (err) {
    console.error("Failed to save interview questions to localStorage:", err);
    if (err.name === "QuotaExceededError" || err.code === 22) {
      console.warn("Storage quota exceeded for interview questions. Evicting oldest question banks.");
      try {
        const topics = root.topics || {};
        const entries = Object.entries(topics);
        // Sort by lastUpdated ascending and evict oldest 2
        entries.sort((a, b) => (a[1]?.lastUpdated || 0) - (b[1]?.lastUpdated || 0));
        const pruned = Object.fromEntries(entries.slice(2));
        root.topics = pruned;
        localStorage.setItem(QUESTION_STORAGE_KEY, JSON.stringify(root));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Retrieves the question bank for a specific topicStorageId.
 */
export function getQuestionBank(topicStorageId) {
  if (!topicStorageId) return null;
  const root = getStorageRoot();
  return root.topics?.[topicStorageId] || null;
}

/**
 * Saves or updates a question bank in storage.
 */
export function saveQuestionBank(topicStorageId, bankData) {
  if (!topicStorageId || !bankData) return null;
  const root = getStorageRoot();
  const now = Date.now();

  const existing = root.topics[topicStorageId];
  const updated = {
    topicId: topicStorageId,
    topicName: bankData.topicName || existing?.topicName || "Topic",
    roadmapPath: bankData.roadmapPath || existing?.roadmapPath || "",
    generatedAt: existing?.generatedAt || bankData.generatedAt || now,
    lastUpdated: now,
    questions: Array.isArray(bankData.questions)
      ? bankData.questions
      : existing?.questions || [],
    completedQuestionIds: Array.isArray(bankData.completedQuestionIds)
      ? bankData.completedQuestionIds
      : existing?.completedQuestionIds || []
  };

  root.topics[topicStorageId] = updated;
  setStorageRoot(root);
  return updated;
}

/**
 * Toggles a question's completion state optimistically.
 */
export function toggleQuestionCompletion(topicStorageId, questionId) {
  if (!topicStorageId || !questionId) return [];
  const root = getStorageRoot();
  const bank = root.topics[topicStorageId];
  if (!bank) return [];

  const completedSet = new Set(bank.completedQuestionIds || []);
  if (completedSet.has(questionId)) {
    completedSet.delete(questionId);
  } else {
    completedSet.add(questionId);
  }

  const updatedCompleted = Array.from(completedSet);
  bank.completedQuestionIds = updatedCompleted;
  bank.lastUpdated = Date.now();
  setStorageRoot(root);
  return updatedCompleted;
}

/**
 * Marks all questions in a question bank as complete.
 */
export function markAllQuestionsComplete(topicStorageId) {
  if (!topicStorageId) return [];
  const root = getStorageRoot();
  const bank = root.topics[topicStorageId];
  if (!bank || !Array.isArray(bank.questions)) return [];

  const allIds = bank.questions.map((q) => q.id).filter(Boolean);
  bank.completedQuestionIds = allIds;
  bank.lastUpdated = Date.now();
  setStorageRoot(root);
  return allIds;
}

/**
 * Resets completion progress for a question bank.
 * CRITICAL: This ONLY clears completedQuestionIds. It NEVER deletes questions,
 * never resets roadmap progress, and never touches AI chats or Quick Revision.
 */
export function resetQuestionProgress(topicStorageId) {
  if (!topicStorageId) return false;
  const root = getStorageRoot();
  const bank = root.topics[topicStorageId];
  if (!bank) return false;

  bank.completedQuestionIds = [];
  bank.lastUpdated = Date.now();
  setStorageRoot(root);
  return true;
}

/**
 * Appends newly generated questions to an existing question bank with duplicate detection.
 * Compares IDs and normalized question text.
 */
export function appendQuestions(topicStorageId, newQuestions = []) {
  if (!topicStorageId || !Array.isArray(newQuestions) || newQuestions.length === 0) {
    return getQuestionBank(topicStorageId);
  }

  const root = getStorageRoot();
  const bank = root.topics[topicStorageId];
  if (!bank) return null;

  const existingQuestions = bank.questions || [];
  const existingIds = new Set(existingQuestions.map((q) => q.id));
  const existingTexts = new Set(existingQuestions.map((q) => normalizeQuestionText(q.question)));

  const uniqueNewQuestions = [];
  for (const q of newQuestions) {
    if (!q || !q.question) continue;
    const normalized = normalizeQuestionText(q.question);
    if (existingIds.has(q.id) || existingTexts.has(normalized)) {
      continue; // Skip duplicate
    }
    existingIds.add(q.id);
    existingTexts.add(normalized);
    uniqueNewQuestions.push(q);
  }

  if (uniqueNewQuestions.length > 0) {
    bank.questions = [...existingQuestions, ...uniqueNewQuestions];
    bank.lastUpdated = Date.now();
    setStorageRoot(root);
  }

  return bank;
}
