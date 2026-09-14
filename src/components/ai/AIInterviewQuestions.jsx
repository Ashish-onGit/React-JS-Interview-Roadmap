import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle } from "react-icons/fi";

export default function AIInterviewQuestions({ questions }) {
  const [openMap, setOpenMap] = useState({ 0: true }); // first question open by default

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  const toggle = (index) => {
    setOpenMap((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-2.5 my-4">
      {questions.map((item, idx) => {
        const isOpen = Boolean(openMap[idx]);

        return (
          <div
            key={idx}
            className="border border-slate-200/90 dark:border-[#2a2a2a] rounded-xl overflow-hidden bg-white dark:bg-[#171717] shadow-2xs transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="w-full text-left p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#222222] border border-indigo-100 dark:border-[#333333] px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#f5f5f5] leading-snug">
                  {item.question}
                </span>
              </div>
              <div className="text-slate-400 dark:text-[#737373] flex-shrink-0">
                {isOpen ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-3.5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#d4d4d4] leading-relaxed border-t border-slate-100 dark:border-[#262626] bg-slate-50/40 dark:bg-[#141414] animate-in fade-in duration-150">
                <div className="font-semibold text-[11px] uppercase tracking-wider mb-1 text-indigo-700 dark:text-indigo-400">
                  Model Answer:
                </div>
                <p className="whitespace-pre-line">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
