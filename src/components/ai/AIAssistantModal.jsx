import React, { useEffect, useRef } from "react";
import { useAIAssistant } from "../../context/AIContext";
import AIAssistantHeader from "./AIAssistantHeader";
import AIChatSidebar from "./AIChatSidebar";
import AIChatDrawer from "./AIChatDrawer";
import AILoading from "./AILoading";
import AIError from "./AIError";
import AIContent from "./AIContent";
import AIFollowUpInput from "./AIFollowUpInput";

export default function AIAssistantModal() {
  const {
    isOpen,
    activeChat,
    chats,
    lessonData,
    isLoading,
    error,
    conversation,
    isFollowUpLoading,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    closeAssistant,
    minimizeAssistant,
    switchChat,
    deleteTopicChat,
    regenerate,
    retry,
    askFollowUp
  } = useAIAssistant();

  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Lock body scroll only when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAssistant();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAssistant]);

  // Auto-scroll to bottom of content on new follow-up messages
  useEffect(() => {
    if (conversation.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [conversation, isFollowUpLoading]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAssistant();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 transition-opacity animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
      aria-labelledby="ai-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full h-[100dvh] max-h-[100dvh] sm:h-[86vh] sm:max-h-[860px] sm:max-w-4xl lg:max-w-5xl bg-white sm:rounded-2xl shadow-2xl flex flex-row overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200 relative"
      >
        {/* Desktop Left Sidebar: Chat History */}
        <div className="hidden md:flex h-full">
          <AIChatSidebar
            chats={chats}
            currentChatId={activeChat?.chatId}
            onSelectChat={switchChat}
            onDeleteChat={deleteTopicChat}
          />
        </div>

        {/* Mobile Slide-in Drawer: Chat History */}
        <AIChatDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          chats={chats}
          currentChatId={activeChat?.chatId}
          onSelectChat={switchChat}
          onDeleteChat={deleteTopicChat}
        />

        {/* Main Learning Content Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-white">
          {/* Header */}
          <AIAssistantHeader
            item={activeChat}
            onClose={closeAssistant}
            onMinimize={minimizeAssistant}
            onRegenerate={regenerate}
            onToggleMobileDrawer={() => setIsMobileDrawerOpen(true)}
            isLoading={isLoading}
          />

          {/* Scrollable Content Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-slate-50/40"
          >
            {isLoading && <AILoading />}

            {!isLoading && error && (
              <AIError error={error} onRetry={retry} onClose={closeAssistant} />
            )}

            {!isLoading && !error && lessonData && (
              <AIContent
                lesson={lessonData}
                conversation={conversation}
                isFollowUpLoading={isFollowUpLoading}
              />
            )}
          </div>

          {/* Bottom Follow-Up Question Input */}
          {!isLoading && !error && lessonData && (
            <AIFollowUpInput
              onSubmit={askFollowUp}
              isLoading={isFollowUpLoading}
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
