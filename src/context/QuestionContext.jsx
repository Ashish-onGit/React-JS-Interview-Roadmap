import React, { createContext, useState, useCallback, useRef } from "react";

const QuestionContext = createContext(null);

export function QuestionProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
  const triggerElementRef = useRef(null);

  /**
   * Opens the questions interface for a specific subtopic or topic.
   */
  const openQuestions = useCallback((topicData, triggerElement = null) => {
    triggerElementRef.current = triggerElement;
    setActiveTopic(topicData);
    setIsOpen(true);
  }, []);

  /**
   * Closes the questions interface and restores focus to trigger element for accessibility.
   */
  const closeQuestions = useCallback(() => {
    setIsOpen(false);
    if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
      setTimeout(() => {
        triggerElementRef.current?.focus();
      }, 50);
    }
  }, []);

  return (
    <QuestionContext.Provider
      value={{
        isOpen,
        activeTopic,
        openQuestions,
        closeQuestions
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}
export { QuestionContext };
export { useQuestionModal } from "../hooks/useQuestionModal";

