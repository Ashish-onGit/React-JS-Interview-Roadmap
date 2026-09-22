import React from "react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { buttonTapScale } from "../../utils/motionVariants";

export default function QuestionEmptyState({ topicName, onGenerate, isLoading }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-[#171717] rounded-2xl border border-slate-200/90 dark:border-[#2a2a2a] shadow-2xs my-4 transition-colors">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 dark:bg-[#1a261f] border border-emerald-100 dark:border-[#273d2f] flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl sm:text-3xl mb-4 shadow-2xs">
        🧠
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#f5f5f5]">
        No interview questions generated yet
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-[#a3a3a3] max-w-md leading-relaxed">
        Generate a curated, progressive question set for <strong className="text-slate-700 dark:text-[#d4d4d4]">{topicName}</strong> to practice conceptual, code-based, and scenario interview questions.
      </p>

      <motion.button
        type="button"
        whileTap={buttonTapScale}
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating Questions...</span>
          </>
        ) : (
          <>
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Generate Interview Questions</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
