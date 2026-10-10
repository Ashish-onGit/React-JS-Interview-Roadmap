import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiTrash2,
  FiChevronRight,
  FiArrowLeft,
  FiFileText,
} from "react-icons/fi";
import { modalVariants } from "../../utils/motionVariants";
import { deleteInterviewSession } from "../../services/interviewStorage";

export default function InterviewHistoryModal({
  isOpen,
  onClose,
  interviews = [],
  onRefresh,
}) {
  const [selectedSession, setSelectedSession] = useState(null);

  if (!isOpen) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteInterviewSession(id);
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full max-w-2xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {selectedSession && (
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#222222]"
                title="Back to history list"
              >
                <FiArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {selectedSession ? "Interview Transcript" : "Previous Interviews"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-[#888888]">
                {selectedSession
                  ? `${selectedSession.interviewType} • ${new Date(selectedSession.createdAt).toLocaleDateString()}`
                  : `${interviews.length} saved interview sessions`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#222222]"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {selectedSession ? (
            /* Detailed Transcript View */
            <div className="space-y-5">
              {/* Scorecard pill */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200/80 dark:border-[#2c2c2c] text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Technical</span>
                  <span className="font-bold text-emerald-500 font-mono">
                    {selectedSession.scores?.technicalKnowledge || 85}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Communication</span>
                  <span className="font-bold text-indigo-500 font-mono">
                    {selectedSession.scores?.communication || 80}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Problem Solving</span>
                  <span className="font-bold text-amber-500 font-mono">
                    {selectedSession.scores?.problemSolving || 82}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Depth</span>
                  <span className="font-bold text-violet-500 font-mono">
                    {selectedSession.scores?.depthOfAnswers || 84}%
                  </span>
                </div>
              </div>

              {/* Feedback Summary */}
              {selectedSession.summary && (
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs sm:text-sm text-slate-700 dark:text-indigo-200">
                  <span className="font-semibold block mb-1">Interviewer Feedback:</span>
                  <p>{selectedSession.summary}</p>
                </div>
              )}

              {/* Q&A Records */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#737373]">
                  Questions & Transcribed Answers
                </h4>

                {selectedSession.questions?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#2a2a2a] space-y-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {item.question}
                      </p>
                    </div>

                    <div className="pl-7 text-xs sm:text-sm text-slate-600 dark:text-[#c0c0c0] leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-[#141414] p-3 rounded-xl border border-slate-100 dark:border-[#222222]">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Your Answer:
                      </span>
                      {item.answer || "No verbal answer provided"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : interviews.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#202020] text-slate-400 mx-auto flex items-center justify-center">
                <FiFileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Saved Interviews Yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-[#888888] max-w-xs mx-auto">
                Completed interviews that you choose to save will appear here with scores and full transcripts.
              </p>
            </div>
          ) : (
            /* List of Saved Sessions */
            <div className="space-y-2.5">
              {interviews.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200/80 dark:border-[#292929] hover:border-indigo-400 dark:hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {session.interviewType || "Technical Interview"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {session.scores?.technicalKnowledge || 82}%
                      </span>
                      {session.difficultyLevel && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                          Level {session.difficultyLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-[#7f7f7f]">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {session.durationFormatted || `${session.duration || 30} min`}
                      </span>
                      <span>{session.questions?.length || 0} Qs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Delete interview record"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <FiChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
