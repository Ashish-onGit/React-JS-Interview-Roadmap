import React from "react";
import { FiArrowDown } from "react-icons/fi";

export default function MemoryTricks({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>⚡ Memory Tricks</span>
      </div>

      <div className="space-y-2.5">
        {items.map((trick, idx) => {
          // Split by arrow or downward arrow if present
          const steps = trick
            .split(/(?:↓|→|->|\n)/)
            .map((s) => s.trim())
            .filter(Boolean);

          if (steps.length > 1) {
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs space-y-1.5"
              >
                <div className="flex flex-col items-center">
                  {steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <div className="w-full text-center py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-[#222222] text-xs font-medium text-slate-800 dark:text-[#e0e0e0] border border-slate-200/60 dark:border-[#2e2e2e]">
                        {step}
                      </div>
                      {sIdx < steps.length - 1 && (
                        <div className="my-0.5 text-slate-400 dark:text-[#666666]">
                          <FiArrowDown className="w-3 h-3" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs text-xs text-slate-700 dark:text-[#a3a3a3] font-medium leading-relaxed"
            >
              {trick}
            </div>
          );
        })}
      </div>
    </div>
  );
}
