import React from "react";
import { LuSparkles } from "react-icons/lu";

export default function AIChatEmptyState() {
  return (
    <div className="p-6 text-center text-slate-500 dark:text-[#a3a3a3] my-auto">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#202020] border border-indigo-100/80 dark:border-[#303030] text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
        <LuSparkles className="w-5 h-5" />
      </div>
      <h5 className="text-xs font-bold text-slate-800 dark:text-[#f5f5f5] mb-1">
        No AI lessons yet
      </h5>
      <p className="text-[11px] text-slate-400 dark:text-[#737373] leading-relaxed max-w-[200px] mx-auto">
        Open any roadmap topic and select <span className="font-semibold text-indigo-600 dark:text-indigo-400">Teach Me</span> to start learning with AI.
      </p>
    </div>
  );
}
