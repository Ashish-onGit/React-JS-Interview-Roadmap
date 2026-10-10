import React from "react";
import { FiClock, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

export default function InterviewHeader({
  formattedTime,
  isWarning,
  isCritical,
  onExitClick,
  interviewStyle,
  isAISpeaking = false,
}) {
  return (
    <div className="w-full bg-white dark:bg-[#141414] border-b border-slate-200 dark:border-[#262626] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 transition-colors">
      {/* Left: Title & Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            AI Interview
          </h2>
        </div>

        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          In Progress
        </span>

        {/* Live Audio Wave Badge in Header while AI speaks */}
        {isAISpeaking && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-2xs">
            <div className="flex items-center gap-0.5 h-3">
              {[0.4, 0.9, 1.3, 0.7, 1.2, 0.6, 1.0].map((scale, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full inline-block"
                  animate={{
                    scaleY: [scale * 0.3, scale * 1.3, scale * 0.3],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  }}
                  style={{ height: "12px", transformOrigin: "center" }}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] hidden sm:inline">AI Speaking...</span>
          </div>
        )}

        {interviewStyle && (
          <span className="hidden md:inline-flex items-center text-xs text-slate-400 dark:text-[#737373]">
            • {interviewStyle}
          </span>
        )}
      </div>

      {/* Right: Timer & Exit */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timer Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-semibold transition-all shadow-2xs ${
            isCritical
              ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse"
              : isWarning
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
              : "bg-slate-50 dark:bg-[#1c1c1c] border-slate-200 dark:border-[#2f2f2f] text-slate-700 dark:text-slate-200"
          }`}
          title="Interview time remaining"
        >
          <FiClock
            className={`w-3.5 h-3.5 ${
              isCritical
                ? "text-red-500"
                : isWarning
                ? "text-amber-500"
                : "text-slate-400"
            }`}
          />
          <span>{formattedTime}</span>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={onExitClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-[#a3a3a3] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-colors cursor-pointer"
          title="Exit current interview"
        >
          <FiLogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit Interview</span>
        </button>
      </div>
    </div>
  );
}
