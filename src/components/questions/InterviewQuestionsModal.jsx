import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useQuestionModal } from "../../hooks/useQuestionModal";
import { useInterviewQuestions } from "../../hooks/useInterviewQuestions";
import QuestionHeader from "./QuestionHeader";
import QuestionProgress from "./QuestionProgress";
import QuestionFilters from "./QuestionFilters";
import QuestionCard from "./QuestionCard";
import QuestionEmptyState from "./QuestionEmptyState";
import QuestionSkeleton from "./QuestionSkeleton";
import QuestionResetDialog from "./QuestionResetDialog";
import {
  questionModalDesktopVariants,
  questionModalMobileVariants,
  backdropVariants
} from "../../utils/motionVariants";
import { FiAlertCircle, FiRefreshCw, FiSearch } from "react-icons/fi";

export default function InterviewQuestionsModal() {
  const { isOpen, activeTopic, closeQuestions } = useQuestionModal();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized((prev) => !prev);

  const {
    questions,
    filteredQuestions,
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
    roadmapPath
  } = useInterviewQuestions(activeTopic);

  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const dragControls = useDragControls();

  // Responsive state for animation variants
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll only when modal is open and reset maximized state on close
  useEffect(() => {
    if (!isOpen) {
      setIsMaximized(false);
      return;
    }
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
        closeQuestions();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeQuestions]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeQuestions();
    }
  };

  // Map of question ID to original index in unfiltered list
  const questionIndexMap = useMemo(() => {
    const map = new Map();
    questions.forEach((q, idx) => {
      map.set(q.id, idx);
    });
    return map;
  }, [questions]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="interview-questions-backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center ${
              isMaximized ? "p-0" : "p-0 sm:p-4 md:p-6"
            }`}
            aria-modal="true"
            role="dialog"
            aria-labelledby="interview-questions-title"
          >
            <motion.div
              key="interview-questions-sheet"
              ref={modalRef}
              variants={isMobile ? questionModalMobileVariants : questionModalDesktopVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              drag={isMaximized ? false : "y"}
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_e, info) => {
                if (!isMaximized && (info.offset.y > 80 || info.velocity.y > 350)) {
                  closeQuestions();
                }
              }}
              className={`w-full h-[100dvh] max-h-[100dvh] bg-white dark:bg-[#141414] shadow-2xl flex flex-col overflow-hidden relative transform-gpu ${
                isMaximized
                  ? "sm:h-[100dvh] sm:max-h-[100dvh] sm:max-w-none sm:rounded-none border-0"
                  : "sm:h-[88vh] sm:max-h-[880px] sm:max-w-4xl lg:max-w-5xl sm:rounded-2xl border border-slate-200/80 dark:border-[#2a2a2a]"
              }`}
            >
              {/* Header */}
              <QuestionHeader
                topicName={topicName}
                roadmapPath={roadmapPath}
                completedCount={completedCount}
                totalCount={totalCount}
                progressPercentage={progressPercentage}
                onGenerateMore={generateMore}
                isGeneratingMore={isGeneratingMore}
                isMaximized={isMaximized}
                onToggleMaximize={toggleMaximize}
                onClose={closeQuestions}
                onPointerDown={(e) => {
                  if (
                    isMaximized ||
                    e.target.closest("button") ||
                    e.target.closest("input") ||
                    e.target.closest("a")
                  ) {
                    return;
                  }
                  dragControls.start(e);
                }}
                disabled={isLoading}
              />

              {/* Scrollable Content Body */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-slate-50/40 dark:bg-[#101010] p-3 sm:p-5 space-y-3 sm:space-y-4"
              >
                {/* 1. Loading Skeleton */}
                {isLoading && <QuestionSkeleton />}

                {/* 2. Error State */}
                {!isLoading && error && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-[#201416] border border-rose-200 dark:border-[#3d2024] text-center my-4 space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-rose-100 dark:bg-[#2c1a1e] text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <FiAlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-[#f5f5f5]">
                        Questions generate nahi ho paaye
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-[#a3a3a3] mt-1 max-w-md mx-auto">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={retry}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      <FiRefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}

                {/* 3. Empty State (No questions generated yet) */}
                {!isLoading && !error && questions.length === 0 && (
                  <QuestionEmptyState
                    topicName={topicName}
                    onGenerate={retry}
                    isLoading={isLoading}
                  />
                )}

                {/* 4. Active Question Bank Content */}
                {!isLoading && !error && questions.length > 0 && (
                  <>
                    {/* Progress Summary Card */}
                    <QuestionProgress
                      completedCount={completedCount}
                      totalCount={totalCount}
                      remainingCount={remainingCount}
                      progressPercentage={progressPercentage}
                      onMarkAllComplete={markAllComplete}
                      onOpenResetDialog={() => setIsResetDialogOpen(true)}
                    />

                    {/* Filter & Search Bar */}
                    <QuestionFilters
                      filterStatus={filterStatus}
                      onSelectStatus={setFilterStatus}
                      filterDifficulty={filterDifficulty}
                      onSelectDifficulty={setFilterDifficulty}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      totalCount={totalCount}
                      completedCount={completedCount}
                      remainingCount={remainingCount}
                    />

                    {/* Filtered Question Cards (10px-12px spacing) */}
                    <div className="space-y-2.5 sm:space-y-3 pt-1">
                      {filteredQuestions.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-[#262626] p-6 space-y-2">
                          <FiSearch className="w-8 h-8 mx-auto text-slate-300 dark:text-[#555555]" />
                          <div className="text-sm font-semibold text-slate-700 dark:text-[#d4d4d4]">
                            No matching questions found
                          </div>
                          <p className="text-xs text-slate-400 dark:text-[#777777]">
                            Try clearing your search term or selecting a different status filter.
                          </p>
                          {(searchTerm || filterStatus !== "all" || filterDifficulty !== "all") && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearchTerm("");
                                setFilterStatus("all");
                                setFilterDifficulty("all");
                              }}
                              className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Reset filters
                            </button>
                          )}
                        </div>
                      ) : (
                        filteredQuestions.map((item) => {
                          const originalIndex = questionIndexMap.get(item.id) ?? 0;
                          return (
                            <QuestionCard
                              key={item.id}
                              item={item}
                              index={originalIndex}
                              isCompleted={completedSet.has(item.id)}
                              onToggleComplete={toggleComplete}
                            />
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Reset Dialog */}
      <QuestionResetDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={resetProgress}
        topicName={topicName}
      />
    </>
  );
}
