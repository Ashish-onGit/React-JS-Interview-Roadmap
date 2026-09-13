import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";

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
    <nav
      aria-label="Mobile Topic Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] px-3.5 py-2.5 space-y-2"
    >
      {/* Row 1: Topic Switcher Bar (Prev | Active Topic Info | Next) */}
      <div className="flex items-center justify-between gap-2">
        {/* Previous Topic Button */}
        <button
          type="button"
          disabled={!prevSection}
          onClick={() => goToSection(prevSection)}
          aria-label={prevSection ? `Previous topic: ${prevSection.sectionTitle}` : "No previous topic"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            prevSection
              ? "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-95 cursor-pointer"
              : "text-slate-300 bg-slate-50 cursor-not-allowed"
          }`}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        {/* Current Active Topic Title & Progress */}
        {currentSectionInfo ? (
          <div className="min-w-0 flex-1 text-center px-1">
            <div className="text-xs font-bold text-slate-800 truncate">
              {currentSectionInfo.sectionNumber} {currentSectionInfo.sectionTitle}
            </div>
            {sectionStats && (
              <div className="text-[10px] font-semibold text-emerald-600 truncate">
                {sectionStats.completed}/{sectionStats.total} completed ({sectionStats.percentage}%)
              </div>
            )}
          </div>
        ) : (
          <div className="min-w-0 flex-1 text-center text-xs font-semibold text-slate-500">
            Roadmap
          </div>
        )}

        {/* Next Topic Button */}
        <button
          type="button"
          disabled={!nextSection}
          onClick={() => goToSection(nextSection)}
          aria-label={nextSection ? `Next topic: ${nextSection.sectionTitle}` : "No next topic"}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
            nextSection
              ? "text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200 cursor-pointer"
              : "text-slate-300 bg-slate-100 cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Row 2: Wide, Sleek Search Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Search topics across roadmap"
        className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/80 transition-all active:scale-[0.99] group cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FiSearch className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
          <span className="text-slate-400 group-hover:text-slate-600 truncate font-normal">
            Search topics across roadmap...
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs flex-shrink-0">
          Search
        </span>
      </button>
    </nav>
  );
}
