import React from "react";
import { FiUser, FiCheckCircle } from "react-icons/fi";

export default function CandidateMessage({ message }) {
  const { text, code, timestamp, isLive } = message;

  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-3xl ml-auto flex-row-reverse">
      {/* User Avatar */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
        <FiUser className="w-5 h-5" />
      </div>

      {/* Message Card */}
      <div
        className={`flex-1 min-w-0 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors ${
          isLive
            ? "bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30"
            : "bg-indigo-50/70 dark:bg-[#1a202c]/50 border border-indigo-200/60 dark:border-[#2d3748]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              You
            </span>
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Transcription
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-[#737373]">
                <FiCheckCircle className="w-3 h-3 text-emerald-500" />
                {message.intent === "HINT_REQUEST"
                  ? "Hint Requested"
                  : message.intent === "CLARIFICATION_REQUEST"
                  ? "Clarification Requested"
                  : message.intent === "REPEAT_REQUEST"
                  ? "Question Repeat Requested"
                  : message.intent === "EXAMPLE_REQUEST"
                  ? "Example Requested"
                  : message.intent === "SKIP_REQUEST"
                  ? "Question Skipped (-Points)"
                  : message.intent === "RETRY_REQUEST"
                  ? "Retry Attempt"
                  : "Answer Submitted"}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-[#666666]">
            {timestamp || "Just now"}
          </span>
        </div>

        {/* Text Transcript */}
        {text && (
          <p className="text-sm sm:text-base text-slate-800 dark:text-[#e2e8f0] leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        )}

        {/* Optional Code Block */}
        {code && (
          <div className="mt-3 overflow-hidden rounded-xl bg-slate-900 border border-slate-700">
            <div className="px-3 py-1.5 bg-slate-800/80 border-b border-slate-700/80 text-[11px] font-mono text-slate-300">
              JavaScript Code
            </div>
            <pre className="p-3 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
