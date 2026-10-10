import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiSave,
  FiTrash2,
  FiArrowRight,
  FiTrendingUp,
} from "react-icons/fi";

export default function InterviewCompletion({
  completionData,
  onSave,
  onDiscard,
  onRestart,
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const durationFormatted = completionData?.durationFormatted || "28:15";
  const totalQuestions = completionData?.totalQuestions || 6;
  const followUpsCount = completionData?.followUpsCount || 2;
  const feedback = completionData?.feedback || "Great performance overall! You showed strong understanding of JavaScript event architecture and React hook lifecycles. Continue practicing explaining trade-offs concisely.";
  const scores = completionData?.scores || {
    technicalKnowledge: 86,
    communication: 80,
    problemSolving: 82,
    depthOfAnswers: 84,
  };

  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        {/* Header Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-xs">
            🎉
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Complete
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 text-xs font-semibold">
              Level {completionData?.difficultyLevel || 3} of 5 • {completionData?.interviewStyle || "Technical Interview"}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-[#a0a0a0]">
            You have successfully completed your simulated technical interview.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2c2c2c] text-center">
            <div className="flex items-center justify-center text-slate-400 dark:text-[#737373] mb-1">
              <FiClock className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
              {durationFormatted}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-[#888888]">Duration</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2c2c2c] text-center">
            <div className="flex items-center justify-center text-slate-400 dark:text-[#737373] mb-1">
              <FiCheckCircle className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
              {totalQuestions}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-[#888888]">Questions</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2c2c2c] text-center">
            <div className="flex items-center justify-center text-slate-400 dark:text-[#737373] mb-1">
              <FiMessageSquare className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
              {followUpsCount}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-[#888888]">Follow-ups</div>
          </div>
        </div>

        {/* Performance Scorecard */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1b1b1b] border border-slate-200/90 dark:border-[#2a2a2a] space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <FiTrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Performance Evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries({
              "Technical Knowledge": scores.technicalKnowledge,
              "Communication": scores.communication,
              "Problem Solving": scores.problemSolving,
              "Depth of Answers": scores.depthOfAnswers,
            }).map(([label, val]) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{label}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {val}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-[#2c2c2c] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback Summary */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-[#181d28] border border-indigo-100 dark:border-indigo-950/80 text-xs sm:text-sm text-slate-700 dark:text-indigo-200 leading-relaxed space-y-1.5">
          <div className="font-bold text-indigo-700 dark:text-indigo-300">
            Interviewer Feedback Summary:
          </div>
          <p>{feedback}</p>
        </div>

        {/* Save / Discard Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowDiscardConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#a3a3a3] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Discard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSaved
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/25 cursor-pointer"
              }`}
            >
              <FiSave className="w-4 h-4" />
              <span>{isSaved ? "Saved to History ✓" : "Save Interview"}</span>
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
            >
              <span>Practice Another</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Discard Confirmation Modal */}
        {showDiscardConfirm && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-3">
            <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium">
              Discard this interview? This interview transcript will not be saved.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#202020] border border-slate-300 dark:border-[#333333]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDiscard}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Confirm Discard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
