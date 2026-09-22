import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiZap } from "react-icons/fi";
import { buttonTapScale } from "../../utils/motionVariants";

export default function RevisionHeader({ onRegenerate, isRegenerating = false, disabled = false }) {
  return (
    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80 dark:border-[#262626]">
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <FiZap className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#f5f5f5] tracking-tight flex items-center gap-1.5 truncate">
            <span>Quick Revision</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#8e8e8e] truncate">
            Short notes for this topic
          </p>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={disabled || isRegenerating ? undefined : buttonTapScale}
        onClick={onRegenerate}
        disabled={disabled || isRegenerating}
        title="Regenerate revision notes"
        aria-label="Regenerate revision notes"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
          isRegenerating || disabled
            ? "text-slate-400 dark:text-[#666666] border-slate-200 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1a1a1a] cursor-not-allowed"
            : "text-slate-600 dark:text-[#d4d4d4] hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-[#333333] bg-white dark:bg-[#1f1f1f] hover:bg-slate-50 dark:hover:bg-[#262626] shadow-2xs"
        }`}
      >
        <FiRefreshCw
          className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-amber-500" : ""}`}
        />
        <span className="text-[11px]">Regenerate</span>
      </motion.button>
    </div>
  );
}
