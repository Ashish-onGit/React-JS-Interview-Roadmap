import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { generateLesson, sendFollowUp } from "../services/groqService";

const AIContext = createContext(null);

export function AIProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // In-session follow-up messages
  const [conversation, setConversation] = useState([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState(null);

  // Focus return ref for accessibility
  const triggerElementRef = useRef(null);

  const fetchLesson = useCallback(async (item, bypassCache = false) => {
    setIsLoading(true);
    setError(null);

    const cacheKey = `${item.categoryId || ""}:${item.sectionId || ""}:${item.topicId || item.topicTitle}:${item.subtopicId || item.subtopicTitle || ""}`;

    try {
      const data = await generateLesson({
        categoryTitle: item.categoryTitle,
        sectionTitle: item.sectionTitle,
        topicTitle: item.topicTitle,
        subtopicTitle: item.subtopicTitle,
        allSubtopics: item.allSubtopics || [],
        cacheKey,
        bypassCache
      });
      setLessonData(data);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      setError(err.message || "Failed to generate lesson.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAssistant = useCallback((item, triggerElement = null) => {
    triggerElementRef.current = triggerElement;
    setSelectedItem(item);
    setConversation([]);
    setFollowUpError(null);
    setIsOpen(true);

    // Call fetch immediately
    fetchLesson(item, false);
  }, [fetchLesson]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
    setError(null);
    setFollowUpError(null);

    // Accessibility: restore focus to the button that triggered it
    if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
      setTimeout(() => {
        triggerElementRef.current?.focus();
      }, 50);
    }
  }, []);

  const regenerate = useCallback(() => {
    if (!selectedItem) return;
    setConversation([]);
    setFollowUpError(null);
    fetchLesson(selectedItem, true);
  }, [selectedItem, fetchLesson]);

  const askFollowUp = useCallback(async (questionText) => {
    if (!questionText?.trim() || !selectedItem) return;
    const cleanQuestion = questionText.trim();

    // Append user message immediately
    const updatedHistory = [
      ...conversation,
      { role: "user", content: cleanQuestion }
    ];
    setConversation(updatedHistory);
    setIsFollowUpLoading(true);
    setFollowUpError(null);

    try {
      const answer = await sendFollowUp({
        topicTitle: selectedItem.subtopicTitle || selectedItem.topicTitle,
        conversationHistory: updatedHistory,
        userQuestion: cleanQuestion
      });

      setConversation([
        ...updatedHistory,
        { role: "assistant", content: answer }
      ]);
    } catch (err) {
      console.error("Follow-up error:", err);
      setFollowUpError(err.message || "Failed to get response.");
    } finally {
      setIsFollowUpLoading(false);
    }
  }, [conversation, selectedItem]);

  return (
    <AIContext.Provider
      value={{
        isOpen,
        selectedItem,
        lessonData,
        isLoading,
        error,
        conversation,
        isFollowUpLoading,
        followUpError,
        openAssistant,
        closeAssistant,
        regenerate,
        askFollowUp,
        retry: () => selectedItem && fetchLesson(selectedItem, true)
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIAssistant must be used within an AIProvider");
  }
  return context;
}
