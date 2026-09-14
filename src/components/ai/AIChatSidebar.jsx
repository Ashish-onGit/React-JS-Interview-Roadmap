import React, { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import AIChatHistoryItem from "./AIChatHistoryItem";
import AIChatEmptyState from "./AIChatEmptyState";
import AIChatDeleteDialog from "./AIChatDeleteDialog";

export default function AIChatSidebar({
  chats = [],
  currentChatId,
  onSelectChat,
  onDeleteChat
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatToDelete, setChatToDelete] = useState(null);

  // Local fast search filtering by topic, subtopic, section, and category
  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return chats;

    return chats.filter((c) => {
      const top = (c.topicTitle || "").toLowerCase();
      const sub = (c.subtopicTitle || "").toLowerCase();
      const sec = (c.sectionTitle || "").toLowerCase();
      const cat = (c.categoryTitle || "").toLowerCase();
      return (
        top.includes(query) ||
        sub.includes(query) ||
        sec.includes(query) ||
        cat.includes(query)
      );
    });
  }, [chats, searchQuery]);

  return (
    <aside className="w-64 md:w-72 flex-shrink-0 border-r border-slate-200/90 dark:border-[#262626] bg-slate-50/70 dark:bg-[#141414] flex flex-col h-full overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-[#262626] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-[#222222] text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <LuSparkles className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#f5f5f5]">
            AI Chats
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-[#a3a3a3] bg-slate-200/70 dark:bg-[#262626] px-1.5 py-0.5 rounded-full">
          {chats.length}
        </span>
      </div>

      {/* Fast Local Search */}
      <div className="p-2.5 border-b border-slate-200/60 dark:border-[#262626]">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 dark:text-[#737373] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-white dark:bg-[#191919] border border-slate-200 dark:border-[#303030] rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-[#f5f5f5] placeholder:text-slate-400 dark:placeholder-[#737373] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-slate-400 dark:text-[#737373] hover:text-slate-600 dark:hover:text-[#d4d4d4] p-0.5"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <AIChatHistoryItem
              key={chat.chatId}
              chat={chat}
              isActive={chat.chatId === currentChatId}
              onSelect={onSelectChat}
              onDeleteRequest={(targetChat) => setChatToDelete(targetChat)}
            />
          ))
        ) : chats.length === 0 ? (
          <AIChatEmptyState />
        ) : (
          <div className="p-6 text-center text-slate-400 dark:text-[#737373] text-xs">
            No chats matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Chat Deletion Confirmation Dialog */}
      <AIChatDeleteDialog
        chat={chatToDelete}
        isOpen={Boolean(chatToDelete)}
        onClose={() => setChatToDelete(null)}
        onConfirm={(chatId) => {
          onDeleteChat(chatId);
          setChatToDelete(null);
        }}
      />
    </aside>
  );
}
