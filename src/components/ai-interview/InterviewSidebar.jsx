import React from "react";
import {
  FiUser,
  FiLayers,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

export default function InterviewSidebar({
  analysisData,
  currentQuestionIndex = 0,
  totalQuestions = 6,
  interviewStyle = "Technical Interview",
  durationMinutes = 30,
  difficultyLevel = 3,
  qaHistory = [],
}) {
  const candidateRole = analysisData?.role || "Software Developer";
  const experienceYears = analysisData?.experienceYears || "2+ years";
  const topics = analysisData?.topics || [
    "JavaScript Core",
    "React Hooks",
    "Async Architecture",
    "State Management",
    "Component Optimization",
  ];

  const levelLabels = {
    1: "Junior / Entry",
    2: "Junior-Mid",
    3: "Mid-Level",
    4: "Senior",
    5: "Staff / Architect",
  };

  const skippedCount = qaHistory.filter((q) => q?.skipped || q?.evaluation?.skipped).length;

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-slate-50/70 dark:bg-[#131313] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#242424] p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto transition-colors">
      {/* Candidate Profile Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200/90 dark:border-[#272727] shadow-2xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            <FiUser className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {candidateRole}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-[#888888]">
              {experienceYears} experience
            </p>
          </div>
        </div>

        {analysisData?.summary && (
          <p className="text-[11px] text-slate-600 dark:text-[#a0a0a0] leading-relaxed line-clamp-3 pt-1 border-t border-slate-100 dark:border-[#252525]">
            {analysisData.summary}
          </p>
        )}

        {/* Difficulty Level Indicator */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#252525] flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-[#888888]">Target Level:</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-2 h-2 rounded-full ${
                    lvl <= difficultyLevel
                      ? "bg-indigo-600 dark:bg-indigo-400"
                      : "bg-slate-200 dark:bg-[#333333]"
                  }`}
                  title={`Level ${lvl}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {levelLabels[difficultyLevel] || `Level ${difficultyLevel}`}
            </span>
          </div>
        </div>
      </div>

      {/* Interview Progress */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200/90 dark:border-[#272727] shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Interview Progress
          </span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">
            {Math.min(currentQuestionIndex + 1, totalQuestions)} / {totalQuestions}
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCompleted = idx < currentQuestionIndex;
            const isCurrent = idx === currentQuestionIndex;
            const record = qaHistory?.[idx];
            const isSkipped = record?.skipped || record?.evaluation?.skipped;

            return (
              <span
                key={idx}
                className={`flex-1 h-2 rounded-full transition-all ${
                  isSkipped
                    ? "bg-rose-500"
                    : isCompleted
                    ? "bg-emerald-500"
                    : isCurrent
                    ? "bg-indigo-600"
                    : "bg-slate-200 dark:bg-[#2b2b2b]"
                }`}
                title={`Question ${idx + 1}${isSkipped ? " (Skipped: -Points)" : isCompleted ? " (Completed)" : ""}`}
              />
            );
          })}
        </div>

        {skippedCount > 0 && (
          <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            <span>Skipped: {skippedCount} question{skippedCount > 1 ? "s" : ""}</span>
            <span>-{skippedCount * 15} pts</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#737373]">
          <span>Mode: {interviewStyle}</span>
          <span>{durationMinutes} min</span>
        </div>
      </div>

      {/* Target Topics / Skills */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-slate-200/90 dark:border-[#272727] shadow-2xs space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <FiLayers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tailored Topics</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {topics.map((topic, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-[#d4d4d4] border border-slate-200/80 dark:border-[#2f2f2f]"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-[#171b26] border border-indigo-100 dark:border-indigo-950/80 text-[11px] text-slate-600 dark:text-indigo-200/80 leading-relaxed space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
          <FiInfo className="w-3.5 h-3.5" />
          <span>Interview Tip</span>
        </div>
        <p>
          Speak clearly and state your reasoning step by step. Feel free to explain trade-offs and real-world project decisions.
        </p>
      </div>
    </aside>
  );
}
