import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSparkles } from "react-icons/lu";
import { FiChevronUp, FiLoader, FiX } from "react-icons/fi";
import { useAIAssistant } from "../../context/AIContext";
import { pillSpringTransition, buttonTapScale } from "../../utils/motionVariants";

export default function AIMinimizedPill({ variant = "floating" }) {
  const {
    isMinimized,
    activeChat,
    restoreAssistant,
    closeAssistant,
    isLoading,
    isFollowUpLoading
  } = useAIAssistant();

  const title = activeChat?.subtopicTitle || activeChat?.topicTitle || "AI Tutor";
  const isGenerating = isLoading || isFollowUpLoading;

  // Mobile layout (anchored directly above the mobile search bar)
  if (variant === "mobile") {
    return (
      <AnimatePresence>
        {isMinimized && activeChat && (
          <motion.div
            key="mobile-minimized-pill"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={pillSpringTransition}
            className="w-full h-11 bg-slate-900/95 dark:bg-[#1c1c1c] backdrop-blur-md border border-slate-700/80 dark:border-[#333333] rounded-2xl shadow-xl px-3 flex items-center justify-between transition-colors select-none text-white"
          >
            <div
              onClick={restoreAssistant}
              onKeyDown={(e) => e.key === "Enter" && restoreAssistant()}
              role="button"
              tabIndex={0}
              aria-label={`Restore AI Assistant for ${title}`}
              className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2 cursor-pointer hover:opacity-90"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <LuSparkles className="w-3.5 h-3.5" />
              </div>

              <div className="min-w-0 flex-1 flex items-center gap-2 truncate">
                <span className="text-xs font-bold text-white truncate">
                  {title}
                </span>
                {isGenerating ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium animate-pulse flex-shrink-0">
                    <FiLoader className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                    AI Tutor Active
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <motion.button
                type="button"
                whileTap={buttonTapScale}
                onClick={restoreAssistant}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 text-indigo-300 dark:text-[#d4d4d4] font-bold text-xs cursor-pointer transition-colors"
              >
                <span className="text-[11px]">Restore</span>
                <FiChevronUp className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                type="button"
                whileTap={buttonTapScale}
                onClick={(e) => {
                  e.stopPropagation();
                  closeAssistant();
                }}
                title="Close AI Assistant"
                aria-label="Close AI Assistant"
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop floating widget: Centered "Dynamic Island" style floating pill
  return (
    <AnimatePresence>
      {isMinimized && activeChat && (
        <motion.div
          key="desktop-minimized-pill"
          initial={{ opacity: 0, scale: 0.88, y: 16, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.88, y: 16, x: "-50%" }}
          transition={pillSpringTransition}
          className="hidden md:flex fixed bottom-6 left-1/2 z-40 items-center gap-3 pl-3.5 pr-2.5 py-2 bg-slate-900/95 hover:bg-slate-900 dark:bg-[#181818] dark:hover:bg-[#1f1f1f] text-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-slate-700/80 dark:border-[#333333] backdrop-blur-md transition-colors group select-none"
        >
          {/* Clickable Area to Restore */}
          <div
            onClick={restoreAssistant}
            onKeyDown={(e) => e.key === "Enter" && restoreAssistant()}
            role="button"
            tabIndex={0}
            aria-label={`Restore AI Assistant for ${title}`}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-95"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <LuSparkles className="w-3.5 h-3.5" />
            </div>

            <div className="flex items-center gap-2 pr-1">
              <span className="text-xs font-bold text-white max-w-[200px] truncate leading-tight">
                {title}
              </span>
              <span className="h-3.5 w-px bg-slate-700 dark:bg-[#333333]" />
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 leading-none">
                {isGenerating ? (
                  <span className="text-indigo-400 font-medium flex items-center gap-1 animate-pulse">
                    <FiLoader className="w-2.5 h-2.5 animate-spin" />
                    <span>Thinking...</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">AI Tutor Active</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Expand and Dismiss */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-700/80 dark:border-[#333333]">
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={restoreAssistant}
              title="Expand AI Assistant"
              aria-label="Expand AI Assistant"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600/80 hover:bg-indigo-600 dark:bg-[#282828] dark:hover:bg-[#333333] text-white dark:text-[#f5f5f5] dark:border dark:border-[#3a3a3a] text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <span>Expand</span>
              <FiChevronUp className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={(e) => {
                e.stopPropagation();
                closeAssistant();
              }}
              title="Close AI Assistant"
              aria-label="Close AI Assistant"
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
