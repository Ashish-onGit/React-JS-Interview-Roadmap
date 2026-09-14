import React from "react";
import { FiTrash2, FiAlertCircle } from "react-icons/fi";

export default function AIChatDeleteDialog({ chat, isOpen, onClose, onConfirm }) {
  if (!isOpen || !chat) return null;

  const topicName = chat.subtopicTitle || chat.topicTitle || "this topic";

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-chat-title"
    >
      <div className="w-full max-w-sm bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-xl border border-slate-200 dark:border-[#303030] p-5 text-center animate-in zoom-in-95 duration-150">
        <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-[#262626] dark:border dark:border-[#333333] text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
          <FiTrash2 className="w-5 h-5" />
        </div>

        <h4 id="delete-chat-title" className="text-sm font-bold text-slate-900 dark:text-[#f5f5f5] mb-1">
          Delete {topicName} chat?
        </h4>

        <p className="text-xs text-slate-500 dark:text-[#a3a3a3] leading-relaxed mb-5">
          This will remove the saved AI conversation for <strong>{topicName}</strong>. Your roadmap learning progress will not be affected.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-[#d4d4d4] bg-slate-100 dark:bg-[#262626] hover:bg-slate-200 dark:hover:bg-[#303030] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(chat.chatId);
              onClose();
            }}
            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
