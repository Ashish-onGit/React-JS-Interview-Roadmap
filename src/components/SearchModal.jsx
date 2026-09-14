import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiCheckCircle,
  FiCircle,
  FiChevronRight,
  FiTrendingUp,
  FiLayers,
  FiBookOpen
} from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";

const POPULAR_SEARCHES = [
  "useState & useEffect",
  "Closures",
  "Event Loop",
  "React 19 Hooks",
  "Redux Toolkit",
  "Custom Hooks",
  "Server Components",
  "Promises & Async",
  "Performance",
  "Virtual DOM"
];

function HighlightMatch({ text, query }) {
  if (!query?.trim()) return <span>{text}</span>;
  const clean = query.trim();
  const index = text.toLowerCase().indexOf(clean.toLowerCase());
  if (index === -1) return <span>{text}</span>;

  const before = text.slice(0, index);
  const match = text.slice(index, index + clean.length);
  const after = text.slice(index + clean.length);

  return (
    <span>
      {before}
      <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-[#282828] px-1 py-0.5 rounded">
        {match}
      </span>
      {after}
    </span>
  );
}

export default function SearchModal({ isOpen, onClose, onSelectTopic }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isCompleted } = useProgress();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K and Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search items indexing
  const searchableItems = useMemo(() => {
    const items = [];
    ROADMAP_DATA.forEach((category) => {
      category.sections.forEach((section) => {
        // Add Section itself
        items.push({
          type: "section",
          id: section.id,
          title: section.title,
          number: section.number,
          categoryId: category.id,
          categoryTitle: category.title,
          sectionId: section.id,
          sectionTitle: section.title,
          path: `${category.number}. ${category.title} > ${section.number} ${section.title}`
        });

        // Add Topics
        section.topics.forEach((topic) => {
          items.push({
            type: "topic",
            id: topic.id,
            title: topic.title,
            number: topic.number,
            categoryId: category.id,
            categoryTitle: category.title,
            sectionId: section.id,
            sectionTitle: section.title,
            hasSubtopics: Boolean(topic.subtopics && topic.subtopics.length > 0),
            subtopicCount: topic.subtopics ? topic.subtopics.length : 0,
            path: `${category.number}. ${category.title} > ${section.number} ${section.title} > ${topic.title}`
          });

          // Add Subtopics
          if (topic.subtopics && topic.subtopics.length > 0) {
            topic.subtopics.forEach((sub) => {
              items.push({
                type: "subtopic",
                id: sub.id,
                title: sub.title,
                parentTopicId: topic.id,
                parentTopicTitle: topic.title,
                categoryId: category.id,
                categoryTitle: category.title,
                sectionId: section.id,
                sectionTitle: section.title,
                path: `${category.number}. ${category.title} > ${section.number} ${section.title} > ${topic.title} > ${sub.title}`
              });
            });
          }
        });
      });
    });
    return items;
  }, []);

  const results = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    return searchableItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(cleanQuery) ||
          item.path.toLowerCase().includes(cleanQuery) ||
          (item.number && item.number.toLowerCase().includes(cleanQuery))
        );
      })
      .sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(cleanQuery);
        const bTitleMatch = b.title.toLowerCase().includes(cleanQuery);
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;

        const aStart = a.title.toLowerCase().startsWith(cleanQuery);
        const bStart = b.title.toLowerCase().startsWith(cleanQuery);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return 0;
      })
      .slice(0, 40); // limit to top 40 for speed
  }, [query, searchableItems]);

  const handleSelect = (item) => {
    navigate(`/roadmap/${item.categoryId}/${item.sectionId}`);
    if (onSelectTopic) {
      onSelectTopic(item);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-start sm:items-center sm:pt-14 sm:px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[90dvh] sm:h-auto sm:max-h-[82vh] sm:max-w-2xl bg-white dark:bg-[#171717] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-top-4 duration-200 border-0 sm:border sm:border-slate-200/80 dark:sm:border-[#2a2a2a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-[#333333] mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Search header */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 border-b border-slate-100 dark:border-[#262626] gap-2.5 sm:gap-3 bg-white dark:bg-[#171717]">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-[#222222] text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FiSearch className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, questions, hooks..."
            className="flex-1 text-sm sm:text-base bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-slate-900 dark:text-[#f5f5f5] placeholder:text-slate-400 dark:placeholder-[#737373] font-normal"
            aria-label="Search topics"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 dark:text-[#a3a3a3] hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#262626] transition-colors shrink-0"
              aria-label="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-xs font-semibold text-slate-600 dark:text-[#d4d4d4] hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] active:scale-95 transition-colors shrink-0"
          >
            Cancel
          </button>

          {/* Desktop ESC Shortcut */}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 dark:text-[#a3a3a3] bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] rounded shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results body */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-3">
          {query.trim() === "" ? (
            <div className="space-y-4 py-2 px-1">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-[#a3a3a3] uppercase tracking-wider mb-2.5 px-1">
                  <FiTrendingUp className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {POPULAR_SEARCHES.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f1f1f] hover:bg-indigo-50 dark:hover:bg-[#262626] text-slate-700 dark:text-[#d4d4d4] hover:text-indigo-700 dark:hover:text-white border border-slate-200/80 dark:border-[#2a2a2a] hover:border-indigo-200 dark:hover:border-[#383838] transition-all active:scale-95 text-left font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Categories */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-[#a3a3a3] uppercase tracking-wider mb-2.5 px-1">
                  <FiLayers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Browse by Module</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {ROADMAP_DATA.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        const firstSection = cat.sections[0];
                        if (firstSection) {
                          navigate(`/roadmap/${cat.id}/${firstSection.id}`);
                          onClose();
                        }
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#1c1c1c] hover:bg-slate-100/90 dark:hover:bg-[#242424] border border-slate-200/70 dark:border-[#2a2a2a] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#262626] border border-slate-200 dark:border-[#333333] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-[#f5f5f5] shrink-0">
                          {cat.number}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-[#f5f5f5] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cat.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-[#737373] shrink-0 pl-1">
                        {cat.sections.length} topics
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-[#737373] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#222222] flex items-center justify-center mx-auto text-slate-400 dark:text-[#737373]">
                <FiSearch className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-[#f5f5f5]">
                  No matching topics found
                </p>
                <p className="text-xs text-slate-400 dark:text-[#737373] mt-0.5">
                  We couldn't find anything matching "{query}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-[#222222] hover:bg-indigo-100 dark:hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-[#a3a3a3] uppercase tracking-wider">
                <span>Matching Topics</span>
                <span className="bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-[#a3a3a3] px-2 py-0.5 rounded-full text-[11px]">
                  {results.length}
                </span>
              </div>

              {results.map((item) => {
                const completed = isCompleted(item.id);
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#202020] active:bg-slate-100 dark:active:bg-[#262626] border border-transparent hover:border-slate-200/70 dark:hover:border-[#2a2a2a] transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                      <span className="flex-shrink-0">
                        {completed ? (
                          <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <FiCircle className="w-4 h-4 text-slate-300 dark:text-[#525252] group-hover:text-slate-400 dark:group-hover:text-[#737373]" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#f5f5f5] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <HighlightMatch text={item.title} query={query} />
                          </span>
                          <span
                            className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                              item.type === "section"
                                ? "bg-emerald-50 dark:bg-[#1c1c1c] text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-[#2a2a2a]"
                                : item.type === "topic"
                                ? "bg-indigo-50 dark:bg-[#1c1c1c] text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-[#2a2a2a]"
                                : "bg-amber-50 dark:bg-[#1c1c1c] text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-[#2a2a2a]"
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-[#737373] truncate mt-0.5">
                          {item.path}
                        </div>
                      </div>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-slate-300 dark:text-[#525252] group-hover:text-slate-600 dark:group-hover:text-[#f5f5f5] transition-colors flex-shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#141414] border-t border-slate-100 dark:border-[#262626] text-xs text-slate-500 dark:text-[#a3a3a3] flex items-center justify-between shrink-0">
          <span className="hidden sm:inline">
            Navigate with clicks or keyboard
          </span>
          <span className="sm:hidden text-slate-400 dark:text-[#737373]">
            {results.length > 0
              ? `Found ${results.length} topics`
              : "Tap any topic to open"}
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-[#737373]">
            Press <strong>ESC</strong> to exit
          </span>
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-xs font-semibold text-indigo-600 dark:text-indigo-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
