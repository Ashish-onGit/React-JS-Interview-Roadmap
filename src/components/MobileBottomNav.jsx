import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import AIMinimizedPill from "./ai/AIMinimizedPill";

export default function MobileBottomNav({ onOpenSearch }) {
  const { categoryId, sectionId } = useParams();
  const navigate = useNavigate();
  const { getSectionStats } = useProgress();

  // Flattened list of all sections for Prev / Next topic navigation
  const allSections = useMemo(() => {
    const list = [];
    ROADMAP_DATA.forEach((cat) => {
      cat.sections.forEach((sec) => {
        list.push({
          categoryId: cat.id,
          categoryTitle: cat.title,
          sectionId: sec.id,
          sectionNumber: sec.number,
          sectionTitle: sec.title,
          rawSection: sec
        });
      });
    });
    return list;
  }, []);

  // Determine current active section & adjacent sections
  const currentSectionIndex = allSections.findIndex(
    (item) => item.categoryId === categoryId && item.sectionId === sectionId
  );

  const currentSectionInfo =
    currentSectionIndex >= 0 ? allSections[currentSectionIndex] : null;
  const prevSection =
    currentSectionIndex > 0 ? allSections[currentSectionIndex - 1] : null;
  const nextSection =
    currentSectionIndex >= 0 && currentSectionIndex < allSections.length - 1
      ? allSections[currentSectionIndex + 1]
      : null;

  const sectionStats = currentSectionInfo
    ? getSectionStats(currentSectionInfo.rawSection)
    : null;

  const goToSection = (target) => {
    if (!target) return;
    navigate(`/roadmap/${target.categoryId}/${target.sectionId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex flex-col pointer-events-none">
      {/* Minimized AI Pill: Dynamically stacked directly above the search bar with 8-10px gap */}
      <div className="px-3 pb-2.5 pointer-events-auto">
        <AIMinimizedPill variant="mobile" />
      </div>

      <nav
        aria-label="Mobile Topic Navigation"
        className="pointer-events-auto bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#262626] shadow-[0_-4px_25px_rgba(0,0,0,0.07)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-3 py-2 transition-colors duration-150"
      >
      {/* Single Row: Prev Button | Wide Search Bar with Current Topic | Next Button */}
      <div className="flex items-center justify-between gap-2">
        {/* Previous Topic Button */}
        <motion.button
          type="button"
          whileTap={prevSection ? { scale: 0.96 } : undefined}
          disabled={!prevSection}
          onClick={() => goToSection(prevSection)}
          aria-label={prevSection ? `Previous topic: ${prevSection.sectionTitle}` : "No previous topic"}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 ${
            prevSection
              ? "text-slate-700 dark:text-[#d4d4d4] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1c1c1c] hover:bg-slate-200 dark:hover:bg-[#262626] border border-transparent dark:border-[#2a2a2a] cursor-pointer"
              : "text-slate-300 dark:text-[#404040] bg-slate-50 dark:bg-[#141414] cursor-not-allowed"
          }`}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </motion.button>

        {/* Center: Wide Search Bar with Current Topic Indicator */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSearch}
          aria-label="Search topics across roadmap"
          className="flex-1 min-w-0 flex items-center justify-between px-3 py-2 text-xs bg-slate-100 dark:bg-[#181818] hover:bg-slate-200/80 dark:hover:bg-[#202020] rounded-xl border border-slate-200/80 dark:border-[#2a2a2a] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <FiSearch className="w-3.5 h-3.5 text-slate-400 dark:text-[#737373] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0" />
            <span className="text-slate-400 dark:text-[#737373] group-hover:text-slate-600 dark:group-hover:text-[#a3a3a3] truncate font-normal text-[11px] sm:text-xs">
              Search topics...
            </span>
          </div>

          {currentSectionInfo && (
            <motion.span
              layoutId="active-mobile-topic"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-[#d4d4d4] bg-white dark:bg-[#222222] border border-slate-200/70 dark:border-[#333333] px-1.5 py-0.5 rounded shadow-2xs flex-shrink-0 ml-1.5 truncate max-w-[110px]"
            >
              <span className="truncate">{currentSectionInfo.sectionNumber}</span>
              {sectionStats && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {sectionStats.percentage}%
                </span>
              )}
            </motion.span>
          )}
        </motion.button>

        {/* Next Topic Button */}
        <motion.button
          type="button"
          whileTap={nextSection ? { scale: 0.96 } : undefined}
          disabled={!nextSection}
          onClick={() => goToSection(nextSection)}
          aria-label={nextSection ? `Next topic: ${nextSection.sectionTitle}` : "No next topic"}
          className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex-shrink-0 ${
            nextSection
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none cursor-pointer"
              : "text-slate-300 dark:text-[#404040] bg-slate-50 dark:bg-[#141414] cursor-not-allowed shadow-none"
          }`}
        >
          <span>Next</span>
          <FiChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </nav>
  </div>
  );
}
