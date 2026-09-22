import React from "react";

export default function ConceptTable({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
        <span>⚡ Concept Cheat Sheet</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#1c1c1c] text-slate-500 dark:text-[#8e8e8e] font-semibold">
              <th className="py-2 px-3 w-1/3">Concept</th>
              <th className="py-2 px-3">Simple Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#242424]">
            {items.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1d1d1d] transition-colors"
              >
                <td className="py-2 px-3 font-mono font-medium text-slate-800 dark:text-[#e5e5e5] align-top whitespace-nowrap sm:whitespace-normal">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#262626] text-[11px] text-slate-700 dark:text-[#d4d4d4]">
                    {row.concept}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 dark:text-[#a3a3a3] text-xs leading-relaxed align-top">
                  {row.meaning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
