import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function QuestionFilters({
  filterStatus,
  onSelectStatus,
  filterDifficulty,
  onSelectDifficulty,
  searchTerm,
  onSearchChange,
  totalCount,
  completedCount,
  remainingCount
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
      {/* Left: Status Filter Pills (Horizontally scrollable on mobile) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-shrink-0">
        <button
          type="button"
          onClick={() => onSelectStatus("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterStatus === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
              : "bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-[#a3a3a3] hover:bg-slate-200/80 dark:hover:bg-[#2c2c2c]"
          }`}
        >
          All ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectStatus("incomplete")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterStatus === "incomplete"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-[#a3a3a3] hover:bg-slate-200/80 dark:hover:bg-[#2c2c2c]"
          }`}
        >
          Incomplete ({remainingCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectStatus("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filterStatus === "completed"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-[#a3a3a3] hover:bg-slate-200/80 dark:hover:bg-[#2c2c2c]"
          }`}
        >
          Completed ({completedCount})
        </button>

        {/* Optional Difficulty Pills */}
        <span className="hidden sm:inline text-slate-300 dark:text-[#333333] px-1">|</span>

        {["all", "basic", "medium", "advanced"].map((diff) => {
          const isDiffActive = filterDifficulty === diff;
          if (diff === "all") return null; // "All" is covered by status

          const label = diff.charAt(0).toUpperCase() + diff.slice(1);
          return (
            <button
              key={diff}
              type="button"
              onClick={() => onSelectDifficulty(isDiffActive ? "all" : diff)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isDiffActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-[#202020] text-slate-500 dark:text-[#888888] hover:bg-slate-200/80 dark:hover:bg-[#2c2c2c]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Right: Local Search Field (Full width on mobile, fixed width on desktop) */}
      <div className="relative w-full sm:w-60 flex-shrink-0">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-[#737373]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-8 pr-7 h-10 sm:h-8.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#2f2f2f] bg-slate-50/70 dark:bg-[#1b1b1b] text-slate-900 dark:text-[#f5f5f5] placeholder:text-slate-400 dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            aria-label="Clear search"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
