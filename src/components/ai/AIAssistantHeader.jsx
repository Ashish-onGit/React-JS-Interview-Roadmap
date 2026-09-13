import React from "react";
import { LuSparkles } from "react-icons/lu";
import { FiX, FiRefreshCw } from "react-icons/fi";

export default function AIAssistantHeader({
  item,
  onClose,
  onRegenerate,
  isLoading
}) {
  const title = item?.subtopicTitle || item?.topicTitle || "AI Learning Assistant";
  const breadcrumbs = [
    item?.categoryTitle,
    item?.sectionTitle,
    item?.subtopicTitle ? item?.topicTitle : null
  ].filter(Boolean);

  return (
    <div className="flex items-center justify-between p-3.5 sm:px-6 border-b border-slate-200/90 bg-white sticky top-0 z-10 flex-shrink-0">
      {/* Left: Icon + Topic Title & Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
          <LuSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
              AI Tutor
            </span>
            {breadcrumbs.length > 0 && (
              <span className="hidden sm:inline text-[11px] text-slate-400 truncate">
                {breadcrumbs.join(" / ")}
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate mt-0.5">
            {title}
          </h3>
        </div>
      </div>

      {/* Right: Actions (Regenerate & Close) */}
      <div className="flex items-center space-x-1.5 flex-shrink-0">
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            title="Regenerate lesson"
            aria-label="Regenerate lesson"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Assistant"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
