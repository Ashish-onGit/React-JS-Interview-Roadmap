import React, { useState } from "react";
import {
  FiMic,
  FiSquare,
  FiSend,
  FiEdit3,
  FiCode,
  FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor, { DEFAULT_REACT_CODE } from "./CodeEditor";

export default function AnswerBar({
  isRecording,
  transcript,
  formattedDuration,
  isEvaluating,
  onStartRecording,
  onStopRecording,
  onSubmitAnswer,
  speechError,
  apiError,
  onRetry,
  isCodeEditorOpen = false,
  onToggleCodeEditor,
  codeSnippet = "",
}) {
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isTypingMode, setIsTypingMode] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isEvaluating) return;

    if (isRecording) {
      onStopRecording();
    }

    const finalAnswer = isTypingMode ? typedAnswer.trim() : (transcript || typedAnswer).trim();
    const finalCode = isCodeEditorOpen && codeSnippet.trim() ? codeSnippet.trim() : null;
    if (!finalAnswer && !finalCode) return;

    onSubmitAnswer({
      text: finalAnswer,
      code: finalCode,
      intent: "ANSWER",
    });

    setTypedAnswer("");
    setIsTypingMode(false);
  };

  const handleQuickAction = (intent, promptText) => {
    if (isEvaluating) return;
    if (isRecording) onStopRecording();

    onSubmitAnswer({
      text: promptText,
      code: null,
      intent,
    });
  };

  const handleReviewVoiceTranscript = () => {
    if (isRecording) onStopRecording();
    setTypedAnswer(transcript || "");
    setIsTypingMode(true);
  };

  return (
    <div className="sticky bottom-0 z-20 w-full bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#262626] p-3 sm:p-4 shadow-lg transition-colors max-h-[75vh] overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Action Chips Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-medium text-slate-400 dark:text-[#737373] flex-shrink-0 mr-1 hidden sm:inline">
            Quick Actions:
          </span>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("HINT_REQUEST", "Can you give me a hint for this question?")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>💡</span>
            <span>Ask for Hint</span>
          </button>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("CLARIFICATION_REQUEST", "Could you clarify what you mean by this question?")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>❓</span>
            <span>Clarify</span>
          </button>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("EXAMPLE_REQUEST", "Could you give a small practical example to help illustrate this?")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>📝</span>
            <span>Give Example</span>
          </button>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("REPEAT_REQUEST", "Could you please repeat the question?")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/20 text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>🔄</span>
            <span>Repeat Question</span>
          </button>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("SKIP_REQUEST", "I would like to skip this question and move to the next topic.")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#202020] hover:bg-slate-200 dark:hover:bg-[#2a2a2a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#333333] text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>⏩</span>
            <span>Skip</span>
          </button>
        </div>

        {/* API Error Banner with Retry */}
        {apiError && (
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{apiError}</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex-shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Error notification banner if microphone or speech fails */}
        {speechError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{speechError}</span>
            <button
              type="button"
              onClick={() => setIsTypingMode(true)}
              className="font-medium underline hover:text-amber-900 dark:hover:text-amber-200 cursor-pointer"
            >
              Switch to typing
            </button>
          </div>
        )}

        {/* Evaluating State Banner */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-sm text-indigo-700 dark:text-indigo-300 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>AI is listening and formulating the next interviewer response...</span>
          </motion.div>
        )}

        {/* Live Speech Recording View */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Listening & Transcribing...
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                    {formattedDuration}
                  </span>
                </div>

                {/* Calm Acoustic Wave Visualizer */}
                <div className="flex items-center gap-1 h-5 px-2">
                  {[0.3, 0.6, 0.9, 1.0, 0.9, 0.6, 0.3].map((scale, i) => (
                    <motion.span
                      key={i}
                      className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full inline-block"
                      animate={{
                        scaleY: [scale * 0.4, scale * 1.3, scale * 0.4],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                      style={{ height: "16px", transformOrigin: "center" }}
                    />
                  ))}
                </div>
              </div>

              {/* Real-time transcribed text preview */}
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#181818] border border-slate-200/80 dark:border-[#2a2a2a] min-h-[48px] max-h-24 overflow-y-auto text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {transcript || (
                  <span className="text-slate-400 italic">
                    Start speaking now. Your voice will appear here in real time...
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional Manual Typing Mode */}
        {isTypingMode && (
          <div className="space-y-2">
            <textarea
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              disabled={isEvaluating}
              placeholder="Type your explanation or response here..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#2c2c2c] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>
        )}

        {/* Main Answer Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Secondary Controls: Code & Typing Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsTypingMode(!isTypingMode)}
              disabled={isEvaluating || isRecording}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isTypingMode
                  ? "bg-slate-100 dark:bg-[#252525] border-slate-300 dark:border-[#383838] text-slate-900 dark:white"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202020]"
              }`}
              title={isTypingMode ? "Close manual typing" : "Type answer with keyboard"}
            >
              <FiEdit3 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isTypingMode ? "Typing Mode" : "Type Answer"}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleCodeEditor}
              disabled={isEvaluating || isRecording}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isCodeEditorOpen
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold shadow-2xs"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202020]"
              }`}
              title={isCodeEditorOpen ? "Close right-side code editor" : "Open right-side code editor"}
            >
              <FiCode className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isCodeEditorOpen ? "Code Editor (Open)" : "Code Editor"}
              </span>
            </button>
          </div>

          {/* Primary Action Button (Voice Record / Stop / Submit) */}
          <div className="flex items-center gap-2 ml-auto">
            {isRecording ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReviewVoiceTranscript}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#252525] dark:hover:bg-[#303030] border border-slate-200 dark:border-[#383838] transition-colors cursor-pointer"
                  title="Pause speech and edit transcript before submitting"
                >
                  Edit Transcript
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FiSquare className="w-4 h-4 fill-current" />
                  <span>Stop & Submit Answer</span>
                </button>
              </div>
            ) : isTypingMode ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isEvaluating || (!typedAnswer.trim() && !(isCodeEditorOpen && codeSnippet.trim()))}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiSend className="w-4 h-4" />
                <span>Submit Answer</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartRecording}
                disabled={isEvaluating}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <FiMic className="w-4 h-4 stroke-[2.5]" />
                <span>Answer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
