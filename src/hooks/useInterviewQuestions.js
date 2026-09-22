import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  generateTopicStorageId,
  generateQuestionSlug,
  getQuestionBank,
  saveQuestionBank,
  toggleQuestionCompletion,
  markAllQuestionsComplete,
  resetQuestionProgress,
  appendQuestions
} from "../utils/questionStorage";
import {
  generateInitialQuestions,
  generateMoreQuestions
} from "../services/questionService";
import { getRevisionNote, getRevisionStorageKey } from "../utils/revisionStorage";

export function useInterviewQuestions(topicItem) {
  // Derive stable storage ID and names
  const topicStorageId = useMemo(() => {
    if (!topicItem) return "";
    return generateTopicStorageId({
      categoryId: topicItem.categoryId,
      sectionId: topicItem.sectionId,
      topicId: topicItem.topicId,
      subtopicId: topicItem.subtopicId
    });
  }, [topicItem]);

  const [questionBank, setQuestionBank] = useState(() => {
    if (!topicItem) return null;
    const storageId = generateTopicStorageId({
      categoryId: topicItem.categoryId,
      sectionId: topicItem.sectionId,
      topicId: topicItem.topicId,
      subtopicId: topicItem.subtopicId
    });
    return storageId ? getQuestionBank(storageId) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState(null);

  // Local filter & search states
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "incomplete" | "completed"
  const [filterDifficulty, setFilterDifficulty] = useState("all"); // "all" | "basic" | "medium" | "advanced"
  const [searchTerm, setSearchTerm] = useState("");

  const activeTopicStorageIdRef = useRef("");

  const topicName = topicItem?.subtopicTitle || topicItem?.topicTitle || "Topic";
  const parentSection = `${topicItem?.sectionNumber || ""} ${topicItem?.sectionTitle || ""}`.trim();
  const roadmapPath = useMemo(() => {
    if (!topicItem) return "";
    const parts = [
      topicItem.categoryTitle,
      topicItem.sectionTitle,
      topicItem.topicTitle
    ];
    if (topicItem.subtopicTitle) {
      parts.push(topicItem.subtopicTitle);
    }
    return parts.filter(Boolean).join(" → ");
  }, [topicItem]);

  const topicSlug = useMemo(() => {
    return generateQuestionSlug(topicItem?.subtopicTitle || topicItem?.topicTitle || topicItem?.topicId);
  }, [topicItem]);

  /**
   * Loads questions from localStorage or calls Groq if not yet generated.
   * STRICT REQUIREMENT: If questions already exist in localStorage, DO NOT call Groq.
   */
  const loadQuestions = useCallback(
    async (forceRegenerate = false) => {
      if (!topicStorageId) return;

      activeTopicStorageIdRef.current = topicStorageId;
      setError(null);

      // 1. Check localStorage first
      if (!forceRegenerate) {
        const cached = getQuestionBank(topicStorageId);
        if (cached && Array.isArray(cached.questions) && cached.questions.length > 0) {
          setQuestionBank((prev) => {
            if (prev && prev.topicName === cached.topicName && prev.questions?.length === cached.questions?.length) {
              return prev;
            }
            return cached;
          });
          setIsLoading(false);
          setIsGeneratingMore(false);
          return;
        }
      }

      // 2. Questions do not exist -> Call Groq
      setIsLoading(true);

      // Check if revision notes are available in cache for extra context
      let revisionNotes = null;
      if (topicItem?.categoryId && topicItem?.sectionId) {
        const revKey = getRevisionStorageKey(topicItem.categoryId, topicItem.sectionId);
        const cachedRev = getRevisionNote(revKey);
        if (cachedRev?.content) {
          revisionNotes = cachedRev.content;
        }
      }

      try {
        const generatedQuestions = await generateInitialQuestions({
          topicName,
          topicSlug,
          parentSection,
          roadmapPath,
          topicContent: topicItem?.topicContent || "",
          revisionNotes,
          isSmallTopic: Boolean(topicItem?.isSmallTopic)
        });

        if (activeTopicStorageIdRef.current === topicStorageId) {
          const newBank = {
            topicName,
            roadmapPath,
            questions: generatedQuestions,
            completedQuestionIds: []
          };
          const saved = saveQuestionBank(topicStorageId, newBank);
          setQuestionBank(saved);
          setError(null);
        }
      } catch (err) {
        if (activeTopicStorageIdRef.current === topicStorageId) {
          console.error("Failed to generate initial interview questions:", err);
          setError(err.message || "Questions generate nahi ho paaye. Please try again.");
        }
      } finally {
        if (activeTopicStorageIdRef.current === topicStorageId) {
          setIsLoading(false);
        }
      }
    },
    [topicStorageId, topicName, topicSlug, parentSection, roadmapPath, topicItem]
  );

  // State adjustment during render when topic changes (React recommended pattern)
  const [prevTopicId, setPrevTopicId] = useState(topicStorageId);
  if (prevTopicId !== topicStorageId) {
    setPrevTopicId(topicStorageId);
    setSearchTerm("");
    setFilterStatus("all");
    setFilterDifficulty("all");
    const cached = topicStorageId ? getQuestionBank(topicStorageId) : null;
    setQuestionBank(cached);
  }

  // Load questions when topic changes
  useEffect(() => {
    if (topicStorageId) {
      loadQuestions(false);
    }
  }, [topicStorageId, loadQuestions]);

  /**
   * Generates ~5 additional questions and appends them without replacing existing questions.
   */
  const generateMore = useCallback(async () => {
    if (!topicStorageId || isGeneratingMore || isLoading) return;

    setIsGeneratingMore(true);

    let revisionNotes = null;
    if (topicItem?.categoryId && topicItem?.sectionId) {
      const revKey = getRevisionStorageKey(topicItem.categoryId, topicItem.sectionId);
      const cachedRev = getRevisionNote(revKey);
      if (cachedRev?.content) {
        revisionNotes = cachedRev.content;
      }
    }

    const currentQuestions = questionBank?.questions || [];
    const startIndex = currentQuestions.length + 1;

    try {
      const newQuestions = await generateMoreQuestions({
        topicName,
        topicSlug,
        parentSection,
        roadmapPath,
        topicContent: topicItem?.topicContent || "",
        revisionNotes,
        existingQuestions: currentQuestions,
        startIndex
      });

      const updatedBank = appendQuestions(topicStorageId, newQuestions);
      if (updatedBank) {
        setQuestionBank({ ...updatedBank });
      }
    } catch (err) {
      console.error("Failed to generate more questions:", err);
      setError(err.message || "Additional questions generate nahi ho paaye.");
    } finally {
      setIsGeneratingMore(false);
    }
  }, [
    topicStorageId,
    isGeneratingMore,
    isLoading,
    topicItem,
    questionBank,
    topicName,
    topicSlug,
    parentSection,
    roadmapPath
  ]);

  /**
   * Toggles completion for a single question.
   */
  const toggleComplete = useCallback(
    (questionId) => {
      if (!topicStorageId || !questionId) return;
      const updatedIds = toggleQuestionCompletion(topicStorageId, questionId);
      setQuestionBank((prev) => (prev ? { ...prev, completedQuestionIds: updatedIds } : null));
    },
    [topicStorageId]
  );

  /**
   * Marks all questions as completed.
   */
  const markAllComplete = useCallback(() => {
    if (!topicStorageId) return;
    const allIds = markAllQuestionsComplete(topicStorageId);
    setQuestionBank((prev) => (prev ? { ...prev, completedQuestionIds: allIds } : null));
  }, [topicStorageId]);

  /**
   * Resets question completion (leaves questions intact, does not touch roadmap progress).
   */
  const resetProgress = useCallback(() => {
    if (!topicStorageId) return;
    resetQuestionProgress(topicStorageId);
    setQuestionBank((prev) => (prev ? { ...prev, completedQuestionIds: [] } : null));
  }, [topicStorageId]);

  /**
   * Retries generating initial questions on failure.
   */
  const retry = useCallback(() => {
    loadQuestions(true);
  }, [loadQuestions]);

  // Derived question bank counts & progress
  const questions = useMemo(() => questionBank?.questions || [], [questionBank]);
  const completedQuestionIds = useMemo(
    () => questionBank?.completedQuestionIds || [],
    [questionBank]
  );
  const completedSet = useMemo(() => new Set(completedQuestionIds), [completedQuestionIds]);

  const totalCount = questions.length;
  const completedCount = completedQuestionIds.length;
  const remainingCount = Math.max(0, totalCount - completedCount);
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered & searched questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const isCompleted = completedSet.has(q.id);

      // Status filter
      if (filterStatus === "incomplete" && isCompleted) return false;
      if (filterStatus === "completed" && !isCompleted) return false;

      // Difficulty filter
      if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false;

      // Local search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const inQuestion = q.question.toLowerCase().includes(term);
        const inAnswer = (q.answer || "").toLowerCase().includes(term);
        const inExplanation = (q.explanation || "").toLowerCase().includes(term);
        const inType = (q.type || "").toLowerCase().includes(term);
        const inDifficulty = (q.difficulty || "").toLowerCase().includes(term);
        return inQuestion || inAnswer || inExplanation || inType || inDifficulty;
      }

      return true;
    });
  }, [questions, completedSet, filterStatus, filterDifficulty, searchTerm]);

  return {
    questionBank,
    questions,
    filteredQuestions,
    completedQuestionIds,
    completedSet,
    totalCount,
    completedCount,
    remainingCount,
    progressPercentage,
    isLoading,
    isGeneratingMore,
    error,
    filterStatus,
    setFilterStatus,
    filterDifficulty,
    setFilterDifficulty,
    searchTerm,
    setSearchTerm,
    toggleComplete,
    markAllComplete,
    resetProgress,
    generateMore,
    retry,
    topicName,
    parentSection,
    roadmapPath
  };
}
