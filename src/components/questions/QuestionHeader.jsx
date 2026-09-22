import React from "react";
import {
  FiX,
  FiPlus,
  FiChevronLeft,
  FiHelpCircle,
  FiMaximize2,
  FiMinimize2
} from "react-icons/fi";
import { motion } from "framer-motion";
import { buttonTapScale } from "../../utils/motionVariants";

export default function QuestionHeader({
  topicName,
  roadmapPath,
  completedCount,
  totalCount,
  progressPercentage,
  onGenerateMore,
  isGeneratingMore,
  isMaximized,
  onToggleMaximize,
  onClose,
  onPointerDown,
  disabled = false
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="flex flex-col border-b border-slate-200/90 dark:border-[#262626] bg-white dark:bg-[#151515] sticky top-0 z-10 flex-shrink-0 select-none cursor-grab active:cursor-grabbing touch-none transition-colors"
    >
      {/* Top Drag Handle Pill Bar */}
      <div className="w-full flex justify-center pt-2 pb-0.5" title="Drag down to close">
        <div className="w-10 sm:w-12 h-1.5 rounded-full bg-slate-300 dark:bg-[#404040] hover:bg-slate-400 dark:hover:bg-[#555555] active:bg-emerald-400 transition-colors" />
      </div>

      {/* DESKTOP HEADER (sm and above) */}
      <div className="hidden sm:flex items-center justify-between px-4 sm:px-5 pb-2.5 pt-1 gap-2">
        {/* Left: Back Arrow + Icon + Title + Breadcrumbs */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Roadmap"
            className="p-1.5 -ml-1 text-slate-500 dark:text-[#a3a3a3] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#242424] rounded-lg transition-colors cursor-pointer flex-shrink-0"
            title="Back to Roadmap"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <FiHelpCircle className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-[#f5f5f5] leading-tight truncate">
                {topicName}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-[#1a261f] border border-emerald-200/80 dark:border-[#263e2e] px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                Interview Questions
              </span>
            </div>

            {roadmapPath && (
              <p className="text-[11px] text-slate-400 dark:text-[#737373] truncate leading-tight mt-0.5 font-medium">
                {roadmapPath}
              </p>
            )}
          </div>
        </div>

        {/* Right: Quick Stats & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {totalCount > 0 && (
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100/80 dark:bg-[#202020] border border-slate-200/60 dark:border-[#2f2f2f] rounded-lg text-xs">
              <span className="font-semibold text-slate-600 dark:text-[#a3a3a3]">
                {completedCount} / {totalCount}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {progressPercentage}%
              </span>
            </div>
          )}

          {totalCount > 0 && (
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={onGenerateMore}
              disabled={disabled || isGeneratingMore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Generate 5 additional non-duplicative interview questions"
            >
              {isGeneratingMore ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Generate More</span>
                </>
              )}
            </motion.button>
          )}

          {/* Maximize / Full-Screen Button */}
          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              title={isMaximized ? "Exit full screen" : "Maximize"}
              aria-label={isMaximized ? "Exit full screen" : "Maximize"}
              className="p-2 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#242424] rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {isMaximized ? (
                <FiMinimize2 className="w-4.5 h-4.5" />
              ) : (
                <FiMaximize2 className="w-4.5 h-4.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close interview questions"
            className="p-2 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#242424] rounded-xl transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE-FIRST SIMPLIFIED HEADER (xs to sm) */}
      <div className="sm:hidden px-3.5 pb-2.5 pt-1 space-y-2">
        {/* ROW 1: ← Topic Name                    × */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to Roadmap"
              className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-600 dark:text-[#d4d4d4] hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#f5f5f5] truncate">
              {topicName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close interview questions"
            className="w-10 h-10 -mr-2 flex items-center justify-center text-slate-400 dark:text-[#a3a3a3] hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* ROW 2: Interview Questions Badge + Progress + Generate More Button */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-tight">
              Interview Questions
            </p>
            {totalCount > 0 && (
              <p className="text-xs font-semibold text-slate-500 dark:text-[#a3a3a3] leading-tight mt-0.5">
                {completedCount} / {totalCount} completed
              </p>
            )}
          </div>

          {totalCount > 0 && (
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={onGenerateMore}
              disabled={disabled || isGeneratingMore}
              className="h-9 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0"
            >
              {isGeneratingMore ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Generate More</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
