import React from "react";

export default function ImportantConcepts({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>💡 Important Concepts</span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs text-xs space-y-1"
          >
            <div className="font-semibold text-slate-800 dark:text-[#f0f0f0]">
              {item.title}
            </div>
            <div className="text-slate-600 dark:text-[#a3a3a3] leading-relaxed">
              {item.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
