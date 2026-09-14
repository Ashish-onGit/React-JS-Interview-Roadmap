import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";
import { generateLesson, sendFollowUp } from "../services/groqService";
import { useAIChats } from "../hooks/useAIChats";
import { generateChatId } from "../utils/aiChatStorage";

const AIContext = createContext(null);

export function AIProvider({ children }) {
  // Assistant display state: "closed" | "open" | "minimized"
  const [assistantState, setAssistantState] = useState("closed");
  const [currentChatId, setCurrentChatId] = useState(null);

  // Mobile drawer state inside the modal
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState(null);

  // Accessibility trigger reference
  const triggerElementRef = useRef(null);

  // Storage hook
  const {
    chats,
    getChat,
    saveChat,
    deleteChat,
    addMessage,
    touchChat,
    refreshChats
  } = useAIChats();

  // Active chat object derived from currentChatId and reactive chats
  const activeChat = useMemo(() => {
    if (!currentChatId) return null;
    return chats.find((c) => c.chatId === currentChatId) || getChat(currentChatId);
  }, [currentChatId, chats, getChat]);

  // Derived initial lesson data from activeChat messages
  const lessonData = useMemo(() => {
    if (!activeChat?.messages) return null;
    const lessonMsg = activeChat.messages.find((m) => m.type === "lesson");
    return lessonMsg ? lessonMsg.content : null;
  }, [activeChat]);

  // Derived follow-up conversation history from activeChat messages
  const conversation = useMemo(() => {
    if (!activeChat?.messages) return [];
    return activeChat.messages.filter((m) => m.type === "text");
  }, [activeChat]);

  /**
   * Primary Entry Point: Opens a topic or subtopic chat.
   * If chat exists: Restores it instantly with zero API calls.
   * If chat is new: Creates chat and generates initial lesson.
   */
  const openTopicChat = useCallback(
    async (item, triggerElement = null) => {
      triggerElementRef.current = triggerElement;
      setError(null);
      setFollowUpError(null);
      setIsMobileDrawerOpen(false);

      const targetChatId = generateChatId({
        categoryId: item.categoryId,
        sectionId: item.sectionId,
        topicId: item.topicId,
        subtopicId: item.subtopicId
      });

      // CASE 2: Topic already opened before -> DO NOT create another or call Groq
      const existingChat = getChat(targetChatId);
      if (existingChat) {
        touchChat(targetChatId);
        setCurrentChatId(targetChatId);
        setAssistantState("open");
        return;
      }

      // CASE 1: Topic has never been opened before
      const newChatRecord = {
        chatId: targetChatId,
        topicId: item.topicId,
        topicTitle: item.topicTitle,
        subtopicId: item.subtopicId || null,
        subtopicTitle: item.subtopicTitle || null,
        categoryId: item.categoryId,
        categoryTitle: item.categoryTitle,
        sectionId: item.sectionId,
        sectionTitle: item.sectionTitle,
        allSubtopics: item.allSubtopics || [],
        messages: []
      };

      // Save initial record and open modal immediately
      saveChat(newChatRecord);
      setCurrentChatId(targetChatId);
      setAssistantState("open");
      setIsLoading(true);

      try {
        const lesson = await generateLesson({
          categoryTitle: item.categoryTitle,
          sectionTitle: item.sectionTitle,
          topicTitle: item.topicTitle,
          subtopicTitle: item.subtopicTitle,
          allSubtopics: item.allSubtopics || [],
          cacheKey: targetChatId,
          bypassCache: false
        });

        // Store generated lesson as the first message of type "lesson"
        addMessage(targetChatId, {
          role: "assistant",
          type: "lesson",
          content: lesson
        });
      } catch (err) {
        console.error("Failed to generate initial AI lesson:", err);
        setError(err.message || "Failed to generate lesson.");
      } finally {
        setIsLoading(false);
      }
    },
    [getChat, touchChat, saveChat, addMessage]
  );

  /**
   * Minimizes the assistant into a compact floating pill (Desktop)
   * or a docked pill directly above the search bar (Mobile).
   */
  const minimizeAssistant = useCallback(() => {
    setAssistantState("minimized");
    setIsMobileDrawerOpen(false);
  }, []);

  /**
   * Restores the assistant back to full modal/fullscreen.
   */
  const restoreAssistant = useCallback(() => {
    setAssistantState("open");
  }, []);

  /**
   * Closes the assistant completely (retaining history in storage).
   */
  const closeAssistant = useCallback(() => {
    setAssistantState("closed");
    setIsMobileDrawerOpen(false);
    setError(null);
    setFollowUpError(null);

    // Restore focus to trigger element for accessibility
    if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
      setTimeout(() => {
        triggerElementRef.current?.focus();
      }, 50);
    }
  }, []);

  /**
   * Switches the active view to a different chat from history.
   */
  const switchChat = useCallback(
    (chatId) => {
      touchChat(chatId);
      setCurrentChatId(chatId);
      setIsMobileDrawerOpen(false);
      setAssistantState("open");
      setError(null);
      setFollowUpError(null);
    },
    [touchChat]
  );

  /**
   * Deletes a topic chat from history without affecting roadmap progress.
   */
  const deleteTopicChat = useCallback(
    (chatId) => {
      const isCurrent = currentChatId === chatId;
      deleteChat(chatId);

      if (isCurrent) {
        const remaining = chats.filter((c) => c.chatId !== chatId);
        if (remaining.length > 0) {
          setCurrentChatId(remaining[0].chatId);
        } else {
          setCurrentChatId(null);
          setAssistantState("closed");
        }
      }
    },
    [currentChatId, deleteChat, chats]
  );

  /**
   * Regenerates the current lesson via Groq API.
   */
  const regenerate = useCallback(async () => {
    if (!activeChat) return;
    setIsLoading(true);
    setError(null);

    try {
      const lesson = await generateLesson({
        categoryTitle: activeChat.categoryTitle,
        sectionTitle: activeChat.sectionTitle,
        topicTitle: activeChat.topicTitle,
        subtopicTitle: activeChat.subtopicTitle,
        allSubtopics: activeChat.allSubtopics || [],
        cacheKey: activeChat.chatId,
        bypassCache: true
      });

      // Update the chat: replace the lesson message and clear follow-up messages
      const updatedMessages = [
        {
          id: `msg-${Date.now()}-lesson`,
          role: "assistant",
          type: "lesson",
          content: lesson,
          createdAt: Date.now()
        }
      ];

      saveChat({
        ...activeChat,
        messages: updatedMessages
      });
    } catch (err) {
      console.error("Regeneration failed:", err);
      setError(err.message || "Failed to regenerate lesson.");
    } finally {
      setIsLoading(false);
    }
  }, [activeChat, saveChat]);

  /**
   * Sends a follow-up question in the context of the active chat.
   */
  const askFollowUp = useCallback(
    async (questionText) => {
      if (!questionText?.trim() || !activeChat || !currentChatId) return;
      const cleanQuestion = questionText.trim();

      // 1. Add user question message to chat
      addMessage(currentChatId, {
        role: "user",
        type: "text",
        content: cleanQuestion
      });

      setIsFollowUpLoading(true);
      setFollowUpError(null);

      // Build conversation history format for Groq
      const historyForGroq = [
        ...conversation.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: cleanQuestion }
      ];

      try {
        const topicName = activeChat.subtopicTitle || activeChat.topicTitle;
        const answer = await sendFollowUp({
          topicTitle: topicName,
          conversationHistory: historyForGroq,
          userQuestion: cleanQuestion
        });

        // 2. Add assistant response message to chat
        addMessage(currentChatId, {
          role: "assistant",
          type: "text",
          content: answer
        });
      } catch (err) {
        console.error("Follow-up error:", err);
        setFollowUpError(err.message || "Failed to get response.");
      } finally {
        setIsFollowUpLoading(false);
      }
    },
    [activeChat, currentChatId, conversation, addMessage]
  );

  return (
    <AIContext.Provider
      value={{
        assistantState, // "closed" | "open" | "minimized"
        isOpen: assistantState === "open",
        isMinimized: assistantState === "minimized",
        currentChatId,
        activeChat,
        chats,
        lessonData,
        conversation,
        isLoading,
        error,
        isFollowUpLoading,
        followUpError,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        openAssistant: openTopicChat,
        openTopicChat,
        minimizeAssistant,
        restoreAssistant,
        closeAssistant,
        switchChat,
        deleteTopicChat,
        regenerate,
        askFollowUp,
        retry: regenerate
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
