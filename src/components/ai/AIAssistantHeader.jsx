import React from "react";
import { LuSparkles } from "react-icons/lu";
import { FiX, FiRefreshCw, FiChevronDown, FiMenu } from "react-icons/fi";

export default function AIAssistantHeader({
  item,
  onClose,
  onMinimize,
  onRegenerate,
  onToggleMobileDrawer,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  isLoading
}) {
  const isSubtopic = Boolean(item?.subtopicTitle);
  const title = item?.subtopicTitle || item?.topicTitle || "AI Learning Assistant";

  const breadcrumbText = isSubtopic
    ? `${item?.topicTitle || ""} → ${item?.sectionTitle || ""}`
    : `${item?.categoryTitle || ""} → ${item?.sectionTitle || ""}`;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="flex flex-col border-b border-slate-200/90 bg-white sticky top-0 z-10 flex-shrink-0 select-none cursor-grab active:cursor-grabbing touch-none"
    >
      {/* Top Drag Handle Pill Bar */}
      <div className="w-full flex justify-center pt-2 pb-0.5" title="Drag down to minimize">
        <div className="w-10 sm:w-12 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 active:bg-indigo-400 transition-colors" />
      </div>

      {/* Main Header Row: Title, Breadcrumbs, and Actions */}
      <div className="flex items-center justify-between px-3 sm:px-5 pb-2.5 pt-0.5">
        {/* Left: Mobile Drawer Trigger + Icon + Clean Title & Subtitle Hierarchy */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1 pr-2">
          {/* Mobile menu button to open chats drawer */}
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer flex-shrink-0"
            title="Open AI chats history"
            aria-label="Open AI chats history"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* AI Gradient Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <LuSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Title + Subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                {title}
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                AI Tutor
              </span>
            </div>

            {breadcrumbText && (
              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5 font-medium">
                {breadcrumbText}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions (Regenerate, Minimize & Close) */}
        <div className="flex items-center space-x-0.5 sm:space-x-1.5 flex-shrink-0">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              title="Regenerate lesson"
              aria-label="Regenerate lesson"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`}
              />
            </button>
          )}

          {/* Minimize Button */}
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize AI Assistant"
            aria-label="Minimize AI Assistant"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <FiChevronDown className="w-5 h-5" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Assistant"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
