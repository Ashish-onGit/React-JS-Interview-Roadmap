import React, { useState, useEffect } from "react";

const ROTATING_MESSAGES = [
  "Analyzing topic and interview scope...",
  "Creating conceptual interview questions...",
  "Drafting practical and code-based scenarios...",
  "Synthesizing interview-ready Hinglish model answers...",
  "Finalizing difficulty levels and edge cases..."
];

export default function QuestionSkeleton() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-200">
      {/* Top Spinner & Rotating Status Badge */}
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#171717] rounded-2xl border border-slate-200/90 dark:border-[#2a2a2a] shadow-2xs text-center">
        <div className="relative mb-3">
          <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-[#f5f5f5]">
          Generating Interview Questions
        </h4>
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium h-5 transition-all duration-300">
          {ROTATING_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Placeholder Skeleton Cards */}
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/70 dark:border-[#252525] bg-white dark:bg-[#171717] shadow-2xs animate-pulse space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-[#2c2c2c]" />
                <div className="w-12 h-4 rounded-md bg-slate-200 dark:bg-[#2c2c2c]" />
                <div className="w-16 h-4 rounded-md bg-slate-200 dark:bg-[#2c2c2c]" />
              </div>
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#2c2c2c]" />
            </div>
            <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-[#2c2c2c]" />
          </div>
        ))}
      </div>
    </div>
  );
}
