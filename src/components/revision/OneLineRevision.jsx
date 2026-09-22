import React from "react";

export default function OneLineRevision({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>🧠 One-line Revision</span>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] divide-y divide-slate-100 dark:divide-[#242424] shadow-2xs overflow-hidden">
        {items.map((line, idx) => {
          const arrowIndex = line.indexOf("→") !== -1 ? line.indexOf("→") : line.indexOf("->");
          const hasArrow = arrowIndex !== -1;

          if (hasArrow) {
            const term = line.substring(0, arrowIndex).trim();
            const def = line.substring(arrowIndex + (line.includes("->") ? 2 : 1)).trim();

            return (
              <div
                key={idx}
                className="p-2.5 flex items-start gap-2 hover:bg-slate-50/70 dark:hover:bg-[#1d1d1d] transition-colors text-xs leading-relaxed"
              >
                <span className="font-semibold text-slate-900 dark:text-[#f0f0f0] whitespace-nowrap flex-shrink-0">
                  {term}
                </span>
                <span className="text-slate-400 dark:text-[#666666] flex-shrink-0 select-none">
                  →
                </span>
                <span className="text-slate-600 dark:text-[#a3a3a3]">
                  {def}
                </span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="p-2.5 text-xs text-slate-700 dark:text-[#a3a3a3] hover:bg-slate-50/70 dark:hover:bg-[#1d1d1d] transition-colors leading-relaxed"
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
