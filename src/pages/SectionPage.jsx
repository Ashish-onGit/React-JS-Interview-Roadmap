import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiCheck,
  FiChevronRight,
  FiChevronDown,
  FiChevronLeft,
  FiCircle,
  FiCheckCircle
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { ROADMAP_DATA } from "../data/roadmap";
import { useProgress } from "../hooks/useProgress";
import { useAIAssistant } from "../context/AIContext";
import ProgressBar from "../components/ProgressBar";

export default function SectionPage() {
  const { categoryId, sectionId } = useParams();
  const navigate = useNavigate();
  const {
    isCompleted,
    toggleItem,
    toggleTopicWithSubtopics,
    getSectionStats
  } = useProgress();
  const { openAssistant } = useAIAssistant();

  // Expanded subtopics accordion state
  const [expandedTopics, setExpandedTopics] = useState({});

  // Flattened list of all sections for Prev / Next navigation
  const allSections = useMemo(() => {
    const list = [];
    ROADMAP_DATA.forEach((cat) => {
      cat.sections.forEach((sec) => {
        list.push({
          categoryId: cat.id,
          categoryTitle: cat.title,
          sectionId: sec.id,
          sectionNumber: sec.number,
          sectionTitle: sec.title
        });
      });
    });
    return list;
  }, []);

  // Find active category and section
  const currentCategory = ROADMAP_DATA.find((cat) => cat.id === categoryId);
  const currentSection = currentCategory?.sections?.find((sec) => sec.id === sectionId);

  const currentSectionIndex = allSections.findIndex(
    (item) => item.categoryId === categoryId && item.sectionId === sectionId
  );
  const prevSection = currentSectionIndex > 0 ? allSections[currentSectionIndex - 1] : null;
  const nextSection =
    currentSectionIndex >= 0 && currentSectionIndex < allSections.length - 1
      ? allSections[currentSectionIndex + 1]
      : null;

  if (!currentCategory || !currentSection) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Section Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested section does not exist or may have been moved.
        </p>
        <Link
          to={`/roadmap/${ROADMAP_DATA[0].id}/${ROADMAP_DATA[0].sections[0].id}`}
          className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Go to First Topic
        </Link>
      </div>
    );
  }

  const sectionStats = getSectionStats(currentSection);

  const toggleTopicExpand = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Active Section Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Badge + Section Title */}
          <div className="flex items-center space-x-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-xs ${
                currentCategory.color || "bg-amber-100 text-amber-700 border border-amber-200"
              }`}
            >
              {currentCategory.badgeText || "JS"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {currentCategory.number}. {currentCategory.title}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                {currentSection.number} {currentSection.title}
              </h2>
            </div>
          </div>

          {/* Right: Progress Stats & Prev/Next Buttons */}
          <div className="flex items-center justify-between md:justify-end gap-5">
            <div className="text-right">
              <div className="flex items-center justify-end gap-3 text-xs mb-1.5">
                <span className="font-semibold text-slate-600">
                  {sectionStats.completed} / {sectionStats.total} completed
                </span>
                <span className="font-bold text-emerald-600 text-sm">
                  {sectionStats.percentage}%
                </span>
              </div>
              <div className="w-36 sm:w-44">
                <ProgressBar
                  value={sectionStats.completed}
                  max={sectionStats.total}
                  height="h-2"
                  colorClass="bg-emerald-500"
                  bgClass="bg-slate-100"
                />
              </div>
            </div>

            {/* Prev / Next Section Arrow Buttons */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
              <button
                type="button"
                disabled={!prevSection}
                onClick={() =>
                  prevSection &&
                  navigate(`/roadmap/${prevSection.categoryId}/${prevSection.sectionId}`)
                }
                title={prevSection ? `Previous: ${prevSection.sectionTitle}` : "First section"}
                className={`p-2 rounded-xl border transition-colors ${
                  prevSection
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white shadow-xs"
                    : "text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50"
                }`}
                aria-label="Previous section"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!nextSection}
                onClick={() =>
                  nextSection &&
                  navigate(`/roadmap/${nextSection.categoryId}/${nextSection.sectionId}`)
                }
                title={nextSection ? `Next: ${nextSection.sectionTitle}` : "Last section"}
                className={`p-2 rounded-xl border transition-colors ${
                  nextSection
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white shadow-xs"
                    : "text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50"
                }`}
                aria-label="Next section"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Learning Items / Topics List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {currentSection.topics.map((topic) => {
          const hasSubtopics = Boolean(topic.subtopics && topic.subtopics.length > 0);
          const isExpanded = Boolean(expandedTopics[topic.id]);

          // Completion logic
          let topicCompleted = false;
          let subtopicsCompletedCount = 0;
          let subtopicsTotal = 0;

          if (hasSubtopics) {
            subtopicsTotal = topic.subtopics.length;
            subtopicsCompletedCount = topic.subtopics.filter((sub) =>
              isCompleted(sub.id)
            ).length;
            topicCompleted =
              subtopicsTotal > 0 && subtopicsCompletedCount === subtopicsTotal;
          } else {
            topicCompleted = isCompleted(topic.id);
          }

          const handleTopicToggle = () => {
            if (hasSubtopics) {
              const subIds = topic.subtopics.map((s) => s.id);
              toggleTopicWithSubtopics(subIds);
            } else {
              toggleItem(topic.id);
            }
          };

          return (
            <div
              key={topic.id}
              className={`transition-colors ${
                topicCompleted ? "bg-emerald-50/20" : "bg-white hover:bg-slate-50/70"
              }`}
            >
              {/* Topic Row */}
              <div className="flex items-center justify-between p-4 sm:px-5">
                <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={handleTopicToggle}
                    aria-label={`Mark ${topic.title} as ${topicCompleted ? "incomplete" : "complete"}`}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                      topicCompleted
                        ? "bg-emerald-500 text-white shadow-xs shadow-emerald-200"
                        : "border-2 border-slate-300 hover:border-slate-400 bg-white"
                    }`}
                  >
                    {topicCompleted && <FiCheck className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Topic Number & Name */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400">
                        {topic.number}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-medium transition-colors ${
                          topicCompleted
                            ? "text-slate-700 line-through decoration-slate-300"
                            : "text-slate-800"
                        }`}
                      >
                        {topic.title}
                      </span>
                      {hasSubtopics && (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {subtopicsCompletedCount} / {subtopicsTotal} subtopics
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action / AI Assistant / Expand */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* AI Teach Me Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAssistant({
                        categoryId: currentCategory.id,
                        categoryTitle: currentCategory.title,
                        sectionId: currentSection.id,
                        sectionTitle: currentSection.title,
                        topicId: topic.id,
                        topicTitle: topic.title,
                        allSubtopics: topic.subtopics?.map((s) => s.title) || []
                      }, e.currentTarget);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/90 active:bg-indigo-100 rounded-lg transition-colors border border-indigo-100/70 cursor-pointer shadow-2xs"
                    title={`Learn about ${topic.title} with AI`}
                    aria-label={`Teach me about ${topic.title}`}
                  >
                    <LuSparkles className="w-3.5 h-3.5 text-indigo-600" />
                    {/* <span className="hidden xs:inline sm:inline">Teach Me</span> */}
                  </button>

                  {hasSubtopics ? (
                    <button
                      type="button"
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
                      aria-label="Toggle subtopics"
                    >
                      <span className="hidden sm:inline">Subtopics</span>
                      {isExpanded ? (
                        <FiChevronDown className="w-4 h-4" />
                      ) : (
                        <FiChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <FiChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Collapsible Subtopics List */}
              {hasSubtopics && isExpanded && (
                <div className="bg-slate-50/80 border-t border-slate-100 px-6 sm:px-12 py-2 space-y-1.5 animate-in fade-in duration-150">
                  {topic.subtopics.map((sub) => {
                    const subCompleted = isCompleted(sub.id);
                    return (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleItem(sub.id)}
                            aria-label={`Mark ${sub.title} as ${subCompleted ? "incomplete" : "complete"}`}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                              subCompleted
                                ? "bg-emerald-500 text-white"
                                : "border-2 border-slate-300 hover:border-slate-400 bg-white"
                            }`}
                          >
                            {subCompleted && <FiCheck className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <span
                            className={`text-sm ${
                              subCompleted
                                ? "text-slate-600 line-through decoration-slate-300"
                                : "text-slate-700"
                            }`}
                          >
                            {sub.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2.5 flex-shrink-0">
                          {/* Subtopic AI Teach Me Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssistant({
                                categoryId: currentCategory.id,
                                categoryTitle: currentCategory.title,
                                sectionId: currentSection.id,
                                sectionTitle: currentSection.title,
                                topicId: topic.id,
                                topicTitle: topic.title,
                                subtopicId: sub.id,
                                subtopicTitle: sub.title,
                                allSubtopics: topic.subtopics?.map((s) => s.title) || []
                              }, e.currentTarget);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-100/60 cursor-pointer"
                            title={`Learn about ${sub.title} with AI`}
                            aria-label={`Teach me about ${sub.title}`}
                          >
                            <LuSparkles className="w-3 h-3 text-indigo-500" />
                            <span>Teach Me</span>
                          </button>

                          <span className="text-[11px] text-slate-400">
                            {subCompleted ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subsequent Sections in Current Category (Matching Screenshot) */}
      <div className="pt-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Other Sections in {currentCategory.title}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {currentCategory.sections.map((sec) => {
            const isCurrent = sec.id === sectionId;
            const secStats = getSectionStats(sec);

            return (
              <Link
                key={sec.id}
                to={`/roadmap/${currentCategory.id}/${sec.id}`}
                className={`flex items-center justify-between p-4 transition-colors group ${
                  isCurrent
                    ? "bg-indigo-50/50 font-semibold"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="flex-shrink-0">
                    {secStats.status === "completed" ? (
                      <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : secStats.status === "in-progress" ? (
                      <span className="relative flex h-3.5 w-3.5 mx-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span>
                      </span>
                    ) : (
                      <FiCircle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm sm:text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {sec.number} {sec.title}
                    </span>
                    {isCurrent && (
                      <span className="ml-2 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-400">
                    {secStats.completed} / {secStats.total}
                  </span>
                  <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
