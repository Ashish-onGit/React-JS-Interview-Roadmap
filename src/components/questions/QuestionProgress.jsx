import React from "react";
import { FiCheckCircle, FiRotateCcw, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import ProgressBar from "../ProgressBar";
import { buttonTapScale } from "../../utils/motionVariants";

export default function QuestionProgress({
  completedCount,
  totalCount,
  remainingCount,
  progressPercentage,
  onMarkAllComplete,
  onOpenResetDialog
}) {
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="bg-white dark:bg-[#171717] rounded-xl border border-slate-200/90 dark:border-[#2a2a2a] p-3.5 sm:p-4 shadow-2xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
        {/* Left: Summary Title and Status */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-[#f5f5f5]">
              Practice Progress
            </span>
            {isAllComplete && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <FiAward className="w-3 h-3" />
                <span>All Practiced!</span>
              </span>
            )}
          </div>

          {/* Hierarchy: 12 Questions · 0 Completed · 12 Remaining */}
          <div className="text-xs text-slate-500 dark:text-[#a3a3a3] font-medium">
            <span className="hidden sm:inline">
              {totalCount} Questions <span className="text-slate-300 dark:text-[#404040]">·</span>{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong> Completed{" "}
              <span className="text-slate-300 dark:text-[#404040]">·</span>{" "}
              <strong className="text-amber-600 dark:text-amber-400">{remainingCount}</strong> Remaining
            </span>
            <span className="sm:hidden">
              {completedCount} / {totalCount} completed ({remainingCount} remaining)
            </span>
          </div>
        </div>

        {/* Right: Bulk Actions */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto pt-1 sm:pt-0">
          {/* Mark All Complete */}
          {!isAllComplete && (
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={onMarkAllComplete}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[#1a261f] rounded-lg transition-colors cursor-pointer border border-emerald-200/60 dark:border-[#263e2e]"
              title="Mark all questions as completed"
            >
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Mark All</span>
            </motion.button>
          )}

          {/* Reset Progress */}
          {completedCount > 0 && (
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={onOpenResetDialog}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 dark:text-[#888888] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-[#242424] rounded-lg transition-colors cursor-pointer border border-slate-200/60 dark:border-[#333333]"
              title="Reset question completion progress"
            >
              <FiRotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress Bar + Percentage */}
      <div className="flex items-center gap-3 pt-0.5">
        <div className="flex-1">
          <ProgressBar
            value={completedCount}
            max={totalCount || 1}
            height="h-2"
            colorClass="bg-emerald-500"
            bgClass="bg-slate-100 dark:bg-[#282828]"
          />
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-[#d4d4d4] min-w-[36px] text-right font-mono">
          {progressPercentage}%
        </span>
      </div>
    </div>
  );
}
