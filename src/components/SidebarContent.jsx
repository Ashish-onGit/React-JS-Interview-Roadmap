import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiCheckCircle,
  FiCircle,
  FiTarget,
  FiRotateCcw,
  FiChevronsLeft,
  FiX
} from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import ProgressBar from "./ProgressBar";
import CategoryIcon from "./CategoryIcon";
import { accordionVariants, buttonTapScale } from "../utils/motionVariants";

export default function SidebarContent({ onOpenSearch, onOpenResetModal, onItemClick, onCollapse, onClose }) {
  const { categoryId, sectionId } = useParams();
  const navigate = useNavigate();
  const { getCategoryStats, getSectionStats, overallStats } = useProgress();
  const [isProgressOpen, setIsProgressOpen] = useState(true);

  // Expanded categories state: default to current category expanded, or first category
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = {};
    ROADMAP_DATA.forEach((cat) => {
      initial[cat.id] = false;
    });
    // Expand current category or first
    const activeCatId = categoryId || ROADMAP_DATA[0].id;
    initial[activeCatId] = true;
    return initial;
  });

  // Keep active category expanded if route changes
  useEffect(() => {
    if (categoryId) {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: true
      }));
    }
  }, [categoryId]);

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    ROADMAP_DATA.forEach((cat) => {
      allExpanded[cat.id] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const handleCollapseAll = () => {
    const allCollapsed = {};
    ROADMAP_DATA.forEach((cat) => {
      allCollapsed[cat.id] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  const allAreExpanded = Object.values(expandedCategories).every(Boolean);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#141414] border-r border-slate-200 dark:border-[#292929] transition-colors duration-150">
      {/* Search & Global Controls Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-[#262626] space-y-2.5 bg-slate-50/50 dark:bg-[#141414]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3 py-2 text-xs text-slate-500 dark:text-[#a3a3a3] bg-white dark:bg-[#191919] hover:bg-slate-50 dark:hover:bg-[#222222] rounded-xl border border-slate-200 dark:border-[#303030] shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <div className="flex items-center gap-2">
              <FiSearch className="w-3.5 h-3.5 text-slate-400 dark:text-[#737373]" />
              <span className="dark:text-[#a3a3a3]">Search topics...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-[#a3a3a3] bg-slate-100 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded">
              Ctrl + K
            </kbd>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#262626] rounded-xl transition-colors shrink-0"
              aria-label="Close drawer"
              title="Close drawer"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#a3a3a3] px-0.5">
          <span className="font-semibold text-slate-600 dark:text-[#a3a3a3] uppercase tracking-wider text-[10px]">
            Roadmap ({ROADMAP_DATA.length} Modules)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={allAreExpanded ? handleCollapseAll : handleExpandAll}
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              {allAreExpanded ? "Collapse All" : "Expand All"}
            </button>
            {onCollapse && (
              <button
                type="button"
                onClick={onCollapse}
                title="Hide sidebar (Ctrl+B)"
                aria-label="Hide sidebar"
                className="hidden md:flex p-1 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#262626] rounded transition-colors"
              >
                <FiChevronsLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Overall Progress Card in Sidebar */}
      <div className="mx-2.5 mt-2.5 mb-1 bg-slate-50/90 dark:bg-[#191919] border border-slate-200/80 dark:border-[#2d2d2d] rounded-xl overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsProgressOpen((prev) => !prev)}
          className="w-full text-left p-3 flex items-center justify-between hover:bg-slate-100/70 dark:hover:bg-[#222222] transition-colors group cursor-pointer"
          aria-expanded={isProgressOpen}
          aria-label="Toggle overall progress details"
        >
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-[#f5f5f5]">Overall Progress</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{overallStats.percentage}%</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#a3a3a3] font-medium mt-0.5">
              {overallStats.completed} / {overallStats.total} topics completed
            </div>
          </div>
          <div className="text-slate-400 dark:text-[#737373] group-hover:text-slate-600 dark:group-hover:text-[#f5f5f5] flex-shrink-0">
            {isProgressOpen ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isProgressOpen && (
            <motion.div
              key="progress-content"
              variants={accordionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 pt-0 space-y-2 border-t border-slate-200/60 dark:border-[#2d2d2d] pt-2.5">
                <ProgressBar
                  value={overallStats.completed}
                  max={overallStats.total}
                  height="h-2"
                  colorClass="bg-emerald-500"
                  bgClass="bg-slate-200 dark:bg-[#333333]"
                />

                {/* Status Legend */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-[#a3a3a3] pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full border border-slate-400 dark:border-[#525252] bg-white dark:bg-[#1f1f1f] inline-block" />
                    <span>Not Started</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category & Section List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 scroll-smooth">
        {ROADMAP_DATA.map((category) => {
          const isExpanded = Boolean(expandedCategories[category.id]);
          const catStats = getCategoryStats(category);
          const isCategoryActive = category.id === categoryId;

          return (
            <div
              key={category.id}
              className={`rounded-xl transition-all duration-150 border ${
                isCategoryActive
                  ? "bg-slate-50/80 dark:bg-[#191919] border-slate-200 dark:border-[#2d2d2d]"
                  : "bg-white dark:bg-[#141414] border-transparent hover:border-slate-200/60 dark:hover:border-[#262626]"
              }`}
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full text-left p-2.5 flex items-center justify-between rounded-xl group transition-colors hover:bg-slate-50 dark:hover:bg-[#1c1c1c]"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      category.color || "bg-indigo-50 dark:bg-[#222222] text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    <CategoryIcon name={category.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-[#f5f5f5] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {category.number}. {category.title}
                    </div>
                    {/* Category progress bar */}
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar
                          value={catStats.completed}
                          max={catStats.total}
                          height="h-1"
                          colorClass="bg-indigo-500"
                          bgClass="bg-slate-200 dark:bg-[#333333]"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-[#737373] font-medium flex-shrink-0">
                        {catStats.completed} / {catStats.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 dark:text-[#737373] group-hover:text-slate-600 dark:group-hover:text-[#f5f5f5] flex-shrink-0">
                  {isExpanded ? (
                    <FiChevronDown className="w-4 h-4" />
                  ) : (
                    <FiChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Sections under this category */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`cat-${category.id}-sections`}
                    variants={accordionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-1 pb-2 pt-0.5 space-y-0.5 border-l-2 border-slate-100 dark:border-[#262626] ml-5 my-1">
                      {category.sections.map((section) => {
                        const secStats = getSectionStats(section);
                        const isSectionActive =
                          category.id === categoryId && section.id === sectionId;

                        return (
                          <NavLink
                            key={section.id}
                            to={`/roadmap/${category.id}/${section.id}`}
                            onClick={() => onItemClick && onItemClick()}
                            className={({ isActive }) =>
                              `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all group ${
                                isSectionActive || isActive
                                  ? "bg-indigo-50 dark:bg-[#242424] text-indigo-700 dark:text-white font-semibold shadow-xs border-l-2 border-indigo-500"
                                  : "text-slate-600 dark:text-[#a3a3a3] hover:bg-slate-100/70 dark:hover:bg-[#202020] hover:text-slate-900 dark:hover:text-[#f5f5f5]"
                              }`
                            }
                          >
                            <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
                              {/* Status Icon */}
                              <span className="flex-shrink-0">
                                {secStats.status === "completed" ? (
                                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                ) : secStats.status === "in-progress" ? (
                                  <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                  </span>
                                ) : (
                                  <FiCircle className="w-3 h-3 text-slate-300 dark:text-[#525252]" />
                                )}
                              </span>
                              <span className="truncate">
                                {section.number} {section.title}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400 dark:text-[#737373] font-medium flex-shrink-0">
                              {secStats.completed} / {secStats.total}
                            </span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Cards */}
      <div className="p-3 border-t border-slate-100 dark:border-[#262626] bg-slate-50/60 dark:bg-[#141414] space-y-2.5">
        {/* Goal Banner */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-[#1c1c1c] dark:to-[#1c1c1c] border border-violet-100 dark:border-[#2a2a2a] flex items-start space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500 text-white flex-shrink-0 shadow-xs">
            <FiTarget className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-tight text-slate-600 dark:text-[#a3a3a3]">
            <span className="font-semibold text-slate-800 dark:text-[#f5f5f5] block mb-0.5">
              Set your goal, track your progress
            </span>
            Stay consistent. You can do it! 💪
          </div>
        </div>

        {/* Reset Progress Action */}
        <motion.button
          type="button"
          whileTap={buttonTapScale}
          onClick={onOpenResetModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-500 dark:text-[#a3a3a3] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-dashed border-slate-200 dark:border-[#303030] hover:border-red-200 dark:hover:border-red-800/40 cursor-pointer"
        >
          <FiRotateCcw className="w-3 h-3" />
          <span>Reset All Progress</span>
        </motion.button>
      </div>
    </div>
  );
}
