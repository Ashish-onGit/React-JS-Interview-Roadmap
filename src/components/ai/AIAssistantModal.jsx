import React, { useEffect, useRef } from "react";
import { useAIAssistant } from "../../context/AIContext";
import AIAssistantHeader from "./AIAssistantHeader";
import AILoading from "./AILoading";
import AIError from "./AIError";
import AIContent from "./AIContent";
import AIFollowUpInput from "./AIFollowUpInput";

export default function AIAssistantModal() {
  const {
    isOpen,
    selectedItem,
    lessonData,
    isLoading,
    error,
    conversation,
    isFollowUpLoading,
    closeAssistant,
    regenerate,
    retry,
    askFollowUp
  } = useAIAssistant();

  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key press
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
        className="w-full h-[100dvh] max-h-[100dvh] sm:h-[88vh] sm:max-h-[850px] sm:max-w-3xl lg:max-w-4xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <AIAssistantHeader
          item={selectedItem}
          onClose={closeAssistant}
          onRegenerate={regenerate}
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
  );
}
