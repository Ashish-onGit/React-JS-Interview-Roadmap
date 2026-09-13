import React from "react";

export default function AIComparison({ comparison }) {
  if (!comparison || !comparison.columns || !comparison.rows || comparison.rows.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {comparison.title && (
        <h4 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
          <span>⚖️</span>
          <span>{comparison.title}</span>
        </h4>
      )}

      {/* Contained horizontal scroll container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <th className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-800 border-r border-slate-200/60">
                Feature / Criteria
              </th>
              {comparison.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-900 border-r last:border-r-0 border-slate-200/60 bg-indigo-50/30"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {comparison.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="py-2.5 px-3.5 sm:px-4 font-semibold text-slate-800 border-r border-slate-200/60 whitespace-nowrap">
                  {row.feature}
                </td>
                {Array.isArray(row.values) &&
                  row.values.map((val, vIdx) => (
                    <td
                      key={vIdx}
                      className="py-2.5 px-3.5 sm:px-4 text-slate-600 border-r last:border-r-0 border-slate-200/60"
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
