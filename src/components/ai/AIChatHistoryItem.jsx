import React from "react";
import { LuSparkles } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AIChatHistoryItem({
  chat,
  isActive,
  onSelect,
  onDeleteRequest
}) {
  const title = chat.subtopicTitle || chat.topicTitle || "Topic";
  const parentSubtitle = chat.subtopicTitle
    ? `${chat.topicTitle} · ${chat.sectionTitle || ""}`
    : `${chat.sectionTitle || chat.categoryTitle || ""}`;

  return (
    <div
      onClick={() => onSelect(chat.chatId)}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
        isActive
          ? "bg-indigo-50/90 dark:bg-[#242424] border-indigo-200/90 dark:border-[#383838] shadow-2xs text-indigo-950 dark:text-[#f5f5f5]"
          : "bg-white/60 dark:bg-[#171717] hover:bg-slate-100/90 dark:hover:bg-[#202020] border-transparent hover:border-slate-200/60 dark:hover:border-[#2d2d2d] text-slate-700 dark:text-[#d4d4d4]"
      }`}
    >
      <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isActive
              ? "bg-indigo-600 text-white shadow-2xs"
              : "bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-[#a3a3a3] group-hover:bg-indigo-100 dark:group-hover:bg-[#2c2c2c] group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          }`}
        >
          <LuSparkles className="w-3.5 h-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={`text-xs font-semibold truncate leading-snug ${
              isActive ? "text-indigo-900 dark:text-white" : "text-slate-800 dark:text-[#e5e5e5]"
            }`}
          >
            {title}
          </h4>
          {parentSubtitle && (
            <p className="text-[10px] text-slate-400 dark:text-[#737373] truncate leading-none mt-0.5">
              {parentSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Relative time & Delete button on hover */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <span className="text-[10px] text-slate-400 dark:text-[#737373] group-hover:hidden whitespace-nowrap">
          {formatRelativeTime(chat.lastActivity)}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(chat);
          }}
          title={`Delete ${title} chat`}
          aria-label={`Delete ${title} chat`}
          className="hidden group-hover:flex items-center justify-center w-6 h-6 text-slate-400 dark:text-[#737373] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
