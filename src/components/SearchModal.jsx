import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiCheckCircle, FiCircle, FiChevronRight } from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";

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

  // Global Ctrl+K / Cmd+K listener
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <FiSearch className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories, sections, topics or subtopics..."
            className="w-full text-base bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
            aria-label="Search topics"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              aria-label="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results body */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-slate-400">
              <FiSearch className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Type anything to search across the entire roadmap</p>
              <p className="text-xs text-slate-400 mt-1">E.g., "Variables", "Closures", "useEffect", "Redux", "CI/CD"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FiSearch className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-slate-700">No matching topics found</p>
              <p className="text-sm text-slate-400 mt-1">We couldn't find anything matching "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Matches ({results.length})
              </div>
              {results.map((item) => {
                const completed = isCompleted(item.id);
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="flex-shrink-0">
                        {completed ? (
                          <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <FiCircle className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {item.path}
                        </div>
                      </div>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Navigate with clicks or keyboard
          </span>
          <span className="text-slate-400">
            Press <strong>ESC</strong> to exit
          </span>
        </div>
      </div>
    </div>
  );
}
