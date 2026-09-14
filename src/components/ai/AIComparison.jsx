import React from "react";

export default function AIComparison({ comparison }) {
  if (!comparison || !comparison.columns || !comparison.rows || comparison.rows.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {comparison.title && (
        <h4 className="text-sm font-bold text-slate-800 dark:text-[#f5f5f5] mb-2.5 flex items-center gap-1.5">
          <span>⚖️</span>
          <span>{comparison.title}</span>
        </h4>
      )}

      {/* Contained horizontal scroll container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#171717] shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#202020] border-b border-slate-200 dark:border-[#2a2a2a] text-slate-700 dark:text-[#f5f5f5] font-semibold">
              <th className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-800 dark:text-[#f5f5f5] border-r border-slate-200/60 dark:border-[#2a2a2a]">
                Feature / Criteria
              </th>
              {comparison.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-900 dark:text-[#f5f5f5] border-r last:border-r-0 border-slate-200/60 dark:border-[#2a2a2a] bg-indigo-50/30 dark:bg-[#202020]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#242424] text-slate-700 dark:text-[#d4d4d4]">
            {comparison.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? "bg-white dark:bg-[#171717]" : "bg-slate-50/50 dark:bg-[#1a1a1a]"}
              >
                <td className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-800 dark:text-[#f5f5f5] border-r border-slate-200/60 dark:border-[#242424] whitespace-nowrap">
                  {row.feature}
                </td>
                {Array.isArray(row.values) &&
                  row.values.map((val, vIdx) => (
                    <td
                      key={vIdx}
                      className="py-2.5 px-3.5 sm:px-4 text-slate-600 dark:text-[#d4d4d4] border-r last:border-r-0 border-slate-200/60 dark:border-[#242424]"
                    >
                      {val}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
