import React from "react";

export default function InterviewReady({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>🎯 Interview Ready</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs text-xs space-y-1.5"
          >
            <div className="font-semibold text-slate-900 dark:text-[#f5f5f5] flex items-start gap-1.5">
              <span className="text-amber-500 font-bold flex-shrink-0">Q:</span>
              <span>{item.question}</span>
            </div>

            <div className="text-slate-600 dark:text-[#a3a3a3] leading-relaxed pl-4 border-l-2 border-slate-200 dark:border-[#333333]">
              {item.shortAnswer}
            </div>

            {item.rememberTip && (
              <div className="pt-1">
                <div className="p-1.5 px-2 rounded-lg bg-slate-100/80 dark:bg-[#222222] text-[11px] text-slate-700 dark:text-[#d4d4d4] flex items-start gap-1.5 border border-slate-200/50 dark:border-[#2a2a2a]">
                  <span className="select-none flex-shrink-0">🧠</span>
                  <div className="leading-snug">
                    <span className="font-semibold mr-1 text-slate-800 dark:text-[#e0e0e0]">
                      Yaad rakho:
                    </span>
                    <span>{item.rememberTip}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
