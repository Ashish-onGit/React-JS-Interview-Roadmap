import React from "react";

export default function ComparisonTable({ tables = [] }) {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="space-y-3">
      {tables.map((table, tIdx) => {
        if (!table.columns || table.columns.length === 0 || !table.rows || table.rows.length === 0) {
          return null;
        }

        return (
          <div key={tIdx} className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#d4d4d4] uppercase tracking-wider">
              <span>🔄 {table.title || "Comparison"}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#292929] bg-white dark:bg-[#171717] shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#1c1c1c] text-slate-500 dark:text-[#8e8e8e] font-semibold">
                    {table.columns.map((col, cIdx) => (
                      <th key={cIdx} className="py-2 px-2.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#242424]">
                  {table.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#1d1d1d] transition-colors"
                    >
                      <td className="py-2 px-2.5 font-medium text-slate-800 dark:text-[#e5e5e5] align-top whitespace-nowrap">
                        {row.feature}
                      </td>
                      {Array.isArray(row.values) &&
                        row.values.map((val, vIdx) => (
                          <td
                            key={vIdx}
                            className="py-2 px-2.5 text-slate-600 dark:text-[#a3a3a3] text-xs leading-relaxed align-top"
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
      })}
    </div>
  );
}
