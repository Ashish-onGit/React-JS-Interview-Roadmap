import React, { useState, useRef } from "react";
import {
  FiMic,
  FiSquare,
  FiSend,
  FiEdit3,
  FiCode,
  FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isTypingMode, setIsTypingMode] = useState(true);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isEvaluating) return;

    if (isRecording) {
      onStopRecording();
    }

    const finalAnswer = typedAnswer.trim() || (transcript || "").trim();
    const finalCode = isCodeEditorOpen && codeSnippet.trim() ? codeSnippet.trim() : null;
    if (!finalAnswer && !finalCode) return;

    onSubmitAnswer({
      text: finalAnswer,
      code: finalCode,
      intent: "ANSWER",
    });

    setTypedAnswer("");
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
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="sticky bottom-0 z-20 w-full p-2.5 sm:p-4 bg-transparent pointer-events-none">
      {/* Floating Cockpit Card Container matching application's charcoal/emerald theme */}
      <div className="max-w-5xl mx-auto pointer-events-auto rounded-2xl bg-white/95 dark:bg-[#161616]/95 border border-slate-200/90 dark:border-[#272727] shadow-xl shadow-black/10 dark:shadow-black/50 backdrop-blur-xl p-3 sm:p-4 space-y-3 transition-colors">
        {/* Row 1: Quick Actions Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-[#888888] flex-shrink-0 mr-1 select-none">
            Quick actions:
          </span>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("HINT_REQUEST", "Can you give me a hint for this question?")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>💡</span>
            <span>Ask for Hint</span>
          </button>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("CLARIFICATION_REQUEST", "Could you clarify what you mean by this question?")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/25 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>❓</span>
            <span>Clarify</span>
          </button>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("EXAMPLE_REQUEST", "Could you give a small practical example to help illustrate this?")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>📝</span>
            <span>Give Example</span>
          </button>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("REPEAT_REQUEST", "Could you please repeat the question?")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/25 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>🔄</span>
            <span>Repeat Question</span>
          </button>

          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => handleQuickAction("SKIP_REQUEST", "I would like to skip this question and move to the next topic.")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#202020] hover:bg-slate-200 dark:hover:bg-[#282828] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2f2f2f] text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
          >
            <span>⏩</span>
            <span>Skip</span>
          </button>
        </div>

        {/* API Error Banner with Retry */}
        {apiError && (
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
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

        {/* Speech Error notification */}
        {speechError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{speechError}</span>
            <button
              type="button"
              onClick={() => {
                setIsTypingMode(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              className="font-medium underline hover:text-amber-800 dark:hover:text-amber-200 cursor-pointer"
            >
              Switch to typing
            </button>
          </div>
        )}

        {/* Evaluating State Banner */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
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
              className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2 overflow-hidden"
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

                {/* Acoustic Wave Visualizer */}
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
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2b2b2b] text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal min-h-[38px] max-h-20 overflow-y-auto">
                {transcript || (
                  <span className="text-slate-400 dark:text-slate-500 italic">
                    Start speaking now. Your voice will appear here in real time...
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal Divider Line */}
        <div className="border-t border-slate-200/80 dark:border-[#242424]" />

        {/* Row 2: Segmented Pill (Type Answer / Code Editor) + Center Input Field + Right Answer Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Left Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#282828] flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsTypingMode(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              disabled={isEvaluating}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isTypingMode
                  ? "bg-white dark:bg-[#282828] text-slate-900 dark:text-white font-semibold shadow-xs border border-slate-200/70 dark:border-[#383838]"
                  : "text-slate-500 dark:text-[#888888] hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FiEdit3 className={`w-3.5 h-3.5 ${isTypingMode ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
              <span>Type Answer</span>
            </button>

            <button
              type="button"
              onClick={onToggleCodeEditor}
              disabled={isEvaluating}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isCodeEditorOpen
                  ? "bg-white dark:bg-[#282828] text-slate-900 dark:text-white font-semibold shadow-xs border border-slate-200/70 dark:border-[#383838]"
                  : "text-slate-500 dark:text-[#888888] hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FiCode className={`w-3.5 h-3.5 ${isCodeEditorOpen ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
              <span>Code Editor</span>
              {isCodeEditorOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
              )}
            </button>
          </div>

          {/* Middle: Integrated Input Box with Helper Text */}
          <div className="flex-1 min-w-[240px] relative rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2b2b2b] focus-within:border-emerald-500/60 dark:focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 px-3.5 py-1.5 transition-all flex flex-col justify-center">
            <textarea
              ref={textareaRef}
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isEvaluating}
              placeholder="Type your answer here..."
              rows={1}
              style={{ outline: "none", border: "none", boxShadow: "none" }}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-0 resize-none leading-relaxed overflow-y-auto max-h-20 p-0 m-0 shadow-none ring-0"
            />
            <div className="text-[10px] text-slate-400 dark:text-[#737373] font-mono mt-0.5 select-none">
              Press Enter to submit • Shift + Enter for new line
            </div>
          </div>

          {/* Right: Primary Action Button (Answer / Stop / Submit in signature Emerald) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isRecording ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReviewVoiceTranscript}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#303030] border border-slate-200 dark:border-[#383838] transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <FiSquare className="w-3.5 h-3.5 fill-current" />
                  <span>Stop & Submit</span>
                </button>
              </div>
            ) : typedAnswer.trim() ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartRecording}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
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
