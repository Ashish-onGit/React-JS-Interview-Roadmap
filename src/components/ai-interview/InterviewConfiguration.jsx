import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiBriefcase,
  FiPlay,
  FiCheck,
  FiArrowLeft,
  FiAward,
} from "react-icons/fi";

const DURATION_OPTIONS = [
  { value: 15, label: "15 min", desc: "Quick Screen (3-4 Qs)" },
  { value: 30, label: "30 min", desc: "Standard (5-7 Qs)", recommended: true },
  { value: 45, label: "45 min", desc: "Deep Technical (7-9 Qs)" },
  { value: 60, label: "60 min", desc: "Full Comprehensive" },
];

const STYLE_OPTIONS = [
  { value: "Technical Interview", label: "Technical Interview", desc: "Core JS, React & problem solving" },
  { value: "Frontend Interview", label: "Frontend Interview", desc: "UI, state, lifecycle & styling" },
  { value: "Full Stack Interview", label: "Full Stack Interview", desc: "Full architecture, APIs & database" },
  { value: "JavaScript / React Interview", label: "JS / React Interview", desc: "Deep dive into JS engine & React internals" },
  { value: "Mixed Interview", label: "Mixed Interview", desc: "Technical + project scenarios + behavioral" },
];

const DIFFICULTY_LEVELS = [
  {
    level: 1,
    title: "Junior / Entry",
    subtitle: "0-1 Years",
    tag: "Fundamentals",
    desc: "Core JavaScript syntax, basic components, props, state, and simple DOM handling.",
  },
  {
    level: 2,
    title: "Junior-Mid",
    subtitle: "1-2 Years",
    tag: "Practical Core",
    desc: "Common React hooks (useState, useEffect), async/await, API fetching, and array transformations.",
  },
  {
    level: 3,
    title: "Mid-Level",
    subtitle: "2-4 Years",
    recommended: true,
    tag: "Production Ready",
    desc: "Reconciliation, performance optimization (useMemo/useCallback), custom hooks, and state management.",
  },
  {
    level: 4,
    title: "Senior",
    subtitle: "4-6 Years",
    tag: "Architecture",
    desc: "System design, SSR/SSG/Hydration, micro-frontends, caching strategies, and concurrency patterns.",
  },
  {
    level: 5,
    title: "Staff / Architect",
    subtitle: "6+ Years",
    tag: "Deep Technical",
    desc: "Runtime & compiler internals, distributed web systems, security, bundler optimizations, and high-scale resilience.",
  },
];

export default function InterviewConfiguration({
  analysisData,
  onStart,
  onBack,
}) {
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState("Technical Interview");
  const [difficultyLevel, setDifficultyLevel] = useState(3);

  const selectedLevelObj = DIFFICULTY_LEVELS.find((l) => l.level === difficultyLevel) || DIFFICULTY_LEVELS[2];

  const handleStart = () => {
    onStart({
      duration,
      style,
      difficultyLevel,
      levelDetails: selectedLevelObj,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#252525] pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Configure Interview Session
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9e9e9e] mt-1">
              Tailored based on your resume:{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {analysisData?.role || "Software Developer"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-[#222222] transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Resume</span>
          </button>
        </div>

        {/* 1. Interview Difficulty Level (1-5) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <FiAward className="w-4 h-4 text-emerald-500" />
              <span>Interview Difficulty Level (1 to 5)</span>
            </label>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
              Level {difficultyLevel}: {selectedLevelObj.title}
            </span>
          </div>

          {/* 1-5 Segmented Buttons */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {DIFFICULTY_LEVELS.map((item) => {
              const isSelected = difficultyLevel === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setDifficultyLevel(item.level)}
                  className={`py-2.5 px-1 sm:px-2 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30"
                      : "bg-slate-50 dark:bg-[#1f1f1f] border-slate-200 dark:border-[#2f2f2f] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-[#3d3d3d]"
                  }`}
                >
                  <div className="text-sm sm:text-base font-extrabold">{item.level}</div>
                  <div
                    className={`text-[10px] font-medium truncate mt-0.5 ${
                      isSelected ? "text-indigo-100" : "text-slate-500 dark:text-[#888888]"
                    }`}
                  >
                    {item.title.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Level Description Card */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1b1b1b] border border-slate-200/80 dark:border-[#2a2a2a] text-xs text-slate-600 dark:text-[#a0a0a0] flex items-start justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                Target: {selectedLevelObj.title} ({selectedLevelObj.subtitle})
              </span>
              <p>{selectedLevelObj.desc}</p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              {selectedLevelObj.tag}
            </span>
          </div>
        </div>

        {/* 2. Duration Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            <FiClock className="w-4 h-4 text-indigo-500" />
            <span>Interview Duration</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = duration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30"
                      : "bg-slate-50 dark:bg-[#1f1f1f] border-slate-200 dark:border-[#2f2f2f] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-[#3d3d3d]"
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isSelected ? "text-indigo-100" : "text-slate-400 dark:text-[#888888]"
                    }`}
                  >
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Style Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            <FiBriefcase className="w-4 h-4 text-indigo-500" />
            <span>Interview Style</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STYLE_OPTIONS.map((opt) => {
              const isSelected = style === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20"
                      : "bg-slate-50 dark:bg-[#1f1f1f] border-slate-200 dark:border-[#2f2f2f] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-[#3d3d3d]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                        <FiCheck className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#888888] mt-0.5">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <FiPlay className="w-5 h-5 fill-current" />
            <span>Start Interview (Level {difficultyLevel})</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
