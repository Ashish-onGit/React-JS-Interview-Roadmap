import React from "react";
import { motion } from "framer-motion";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { buttonTapScale } from "../../utils/motionVariants";

export default function RevisionError({ error, onRetry }) {
  return (
    <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/50 bg-rose-50/50 dark:bg-rose-950/10 text-center space-y-3">
      <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <FiAlertCircle className="w-4 h-4" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-[#f0f0f0]">
          Quick revision generate nahi ho paaya.
        </p>
        {error && (
          <p className="text-[11px] text-slate-500 dark:text-[#888888] line-clamp-2">
            {error}
          </p>
        )}
      </div>

      <motion.button
        type="button"
        whileTap={buttonTapScale}
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] rounded-lg transition-colors shadow-2xs cursor-pointer"
      >
        <FiRefreshCw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </motion.button>
    </div>
  );
}
