import React from "react";

export default function KeyTakeaways({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>🔑 Key Takeaways</span>
      </div>

      <div className="p-3 rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs">
        <ul className="space-y-2 text-xs text-slate-600 dark:text-[#a3a3a3]">
          {items.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-amber-500 font-bold select-none">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
