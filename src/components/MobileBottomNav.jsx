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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2"
    >
      {/* Mini Current Topic Header Strip */}
      {currentSectionInfo && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pb-1.5 border-b border-slate-100 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-slate-800 truncate">
              {currentSectionInfo.sectionNumber} {currentSectionInfo.sectionTitle}
            </span>
          </div>
          {sectionStats && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
              {sectionStats.completed}/{sectionStats.total} ({sectionStats.percentage}%)
            </span>
          )}
        </div>
      )}

      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Previous Topic Button */}
        <button
          type="button"
          disabled={!prevSection}
          onClick={() => goToSection(prevSection)}
          aria-label={prevSection ? `Previous topic: ${prevSection.sectionTitle}` : "No previous topic"}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            prevSection
              ? "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-98 cursor-pointer"
              : "text-slate-300 bg-slate-50 cursor-not-allowed"
          }`}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="truncate">Previous</span>
        </button>

        {/* Quick Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search topics"
          className="p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
        >
          <FiSearch className="w-4 h-4" />
        </button>

        {/* Next Topic Button */}
        <button
          type="button"
          disabled={!nextSection}
          onClick={() => goToSection(nextSection)}
          aria-label={nextSection ? `Next topic: ${nextSection.sectionTitle}` : "No next topic"}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
            nextSection
              ? "text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-200 cursor-pointer"
              : "text-slate-300 bg-slate-100 cursor-not-allowed"
          }`}
        >
          <span className="truncate">Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
