import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiSquare,
  FiSend,
  FiRefreshCw,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiCpu,
  FiInfo,
  FiCheck,
  FiEdit3
} from "react-icons/fi";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { evaluateAnswer } from "../../services/evaluationService";

/**
 * Realistic acoustic voice waveform visualizer.
 * Uses smooth, harmonic scale oscillations mimicking authentic voice audio input.
 */
function VoiceWaveVisualizer() {
  // Symmetrical acoustic wave profile with harmonized timing
  const bars = [
    { baseHeight: 8, minScale: 0.35, maxScale: 0.85, delay: 0 },
    { baseHeight: 13, minScale: 0.3, maxScale: 0.95, delay: 0.12 },
    { baseHeight: 18, minScale: 0.25, maxScale: 1, delay: 0.24 },
    { baseHeight: 22, minScale: 0.2, maxScale: 1, delay: 0.36 },
    { baseHeight: 18, minScale: 0.25, maxScale: 1, delay: 0.24 },
    { baseHeight: 13, minScale: 0.3, maxScale: 0.95, delay: 0.12 },
    { baseHeight: 8, minScale: 0.35, maxScale: 0.85, delay: 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 dark:bg-[#15231a] border border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
    >
      {/* Symmetrical audio waveform */}
      <div className="flex items-center gap-[3px] h-6 px-0.5">
        {bars.map((bar, i) => (
          <motion.span
            key={i}
            className="w-[2.5px] rounded-full bg-emerald-500 dark:bg-emerald-400 origin-center"
            style={{ height: `${bar.baseHeight}px` }}
            animate={{
              scaleY: [bar.minScale, bar.maxScale, bar.minScale],
              opacity: [0.65, 1, 0.65]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.15,
              delay: bar.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
        <span className="font-medium text-[11px] sm:text-xs tracking-tight">Listening...</span>
      </div>
    </motion.div>
  );
}

/**
 * Renders stars as secondary visual element alongside the clear numerical score
 */
function StarRating({ score }) {
  // Score is 0-10, stars are 0-5
  const fullStars = Math.floor(score / 2);
  const hasHalf = score % 2 >= 1;

  return (
    <div className="flex items-center gap-0.5 text-amber-400" title={`Rating: ${score}/10`}>
      {[0, 1, 2, 3, 4].map((idx) => {
        const isFilled = idx < fullStars;
        const isHalf = idx === fullStars && hasHalf;
        return (
          <FiStar
            key={idx}
            className={`w-3.5 h-3.5 ${
              isFilled
                ? "fill-amber-400 text-amber-400"
                : isHalf
                ? "fill-amber-400/50 text-amber-400"
                : "text-slate-300 dark:text-[#444444]"
            }`}
          />
        );
      })}
    </div>
  );
}

/**
 * Circular progress ring for numerical score
 */
function CircularScoreRing({ score }) {
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(10, Math.max(0, score)) / 10) * circumference;

  let strokeColor = "#10b981"; // emerald (8-10)
  if (score < 5) {
    strokeColor = "#f43f5e"; // rose (0-4)
  } else if (score < 8) {
    strokeColor = "#f59e0b"; // amber (5-7)
  }

  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          className="text-slate-100 dark:text-[#252525]"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease-in-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-900 dark:text-[#f5f5f5] leading-none">
          {score}
        </span>
        <span className="text-[9px] text-slate-400 dark:text-[#777777] font-medium leading-none mt-0.5">
          /10
        </span>
      </div>
    </div>
  );
}

/**
 * Returns human-readable label and style based on score
 */
function getScoreMetadata(score) {
  if (score >= 9) {
    return {
      label: "Exceptional Answer",
      subtext: "Covers all key concepts and demonstrates deep understanding.",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    };
  }
  if (score >= 7) {
    return {
      label: "Very Good",
      subtext: "Solid explanation with accurate technical reasoning.",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    };
  }
  if (score >= 5) {
    return {
      label: "Good Attempt",
      subtext: "Understands the basic idea, but misses important details.",
      badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
    };
  }
  if (score >= 3) {
    return {
      label: "Needs Improvement",
      subtext: "Incomplete explanation with some technical gaps.",
      badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
    };
  }
  return {
    label: "Review Needed",
    subtext: "Does not adequately answer the core question.",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
  };
}

export default function AnswerEvaluation({
  questionItem,
  topicName = "",
  roadmapPath = ""
}) {
  const {
    isSupported,
    isRecording,
    transcript,
    setTranscript,
    formattedDuration,
    startRecording,
    stopRecording,
    resetTranscript,
    error: speechError,
    clearError: clearSpeechError
  } = useSpeechRecognition();

  // Submission & evaluation states (PURE COMPONENT STATE - never persisted)
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Handles submitting the answer to the backend
  const handleCheckAnswer = async () => {
    if (isRecording) {
      stopRecording();
    }

    const trimmed = (transcript || "").trim();
    if (!trimmed) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const result = await evaluateAnswer({
        question: questionItem?.question || "",
        userAnswer: trimmed,
        referenceAnswer: questionItem?.answer || "",
        topic: topicName,
        subtopic: roadmapPath || "",
        difficulty: questionItem?.difficulty || "",
        codeSnippet: questionItem?.code || ""
      });

      setEvaluationResult(result);
    } catch (err) {
      console.error("Evaluation submission error:", err);
      setEvalError(err.message || "Failed to evaluate answer. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset to record or type another answer
  const handleTryAgain = () => {
    resetTranscript();
    setEvalError(null);
    setEvaluationResult(null);
  };

  const hasAnswer = (transcript || "").trim().length > 0;
  const activeError = evalError || speechError;

  return (
    <div className="rounded-xl border border-slate-200/90 dark:border-[#282828] bg-slate-50/70 dark:bg-[#141414] overflow-hidden transition-all duration-150">
      {/* Header Bar */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-slate-100/80 dark:bg-[#1b1b1b] border-b border-slate-200/70 dark:border-[#242424] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FiCpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#f0f0f0]">
            AI Answer Evaluation
          </span>
          <span className="text-[10px] text-slate-400 dark:text-[#737373] hidden sm:inline">
            (Speech-to-Text or Type)
          </span>
        </div>

        {/* Live Recording Indicator or Duration */}
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
              Recording {formattedDuration}
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Active Error Notice */}
        <AnimatePresence>
          {activeError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
            >
              <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="leading-relaxed">{activeError}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEvalError(null);
                  clearSpeechError();
                }}
                className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 text-xs font-bold cursor-pointer"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Controls & Status Row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isEvaluating}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Click to answer using your microphone"
            >
              <FiMic className="w-3.5 h-3.5" />
              <span>{hasAnswer ? "Record Again" : "Answer with Voice"}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Stop speech recognition"
              >
                <FiSquare className="w-3.5 h-3.5 fill-white" />
                <span>Stop Recording ({formattedDuration})</span>
              </button>

              {/* Cool Voice Wave Simulation */}
              <VoiceWaveVisualizer />
            </>
          )}

          {/* Fallback notice if Web Speech API is not supported */}
          {!isSupported && (
            <span className="text-[11px] text-slate-500 dark:text-[#888888] flex items-center gap-1">
              <FiInfo className="w-3 h-3 text-slate-400" />
              Speech recognition unavailable in this browser; you can type directly.
            </span>
          )}

          {/* Discard / Clear Button */}
          {hasAnswer && !isRecording && (
            <button
              type="button"
              onClick={resetTranscript}
              disabled={isEvaluating}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-[#2f2f2f] hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-600 dark:text-[#a0a0a0] hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Discard answer and clear input"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Editable Transcript Textarea */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#888888]">
            <span className="flex items-center gap-1 font-medium">
              <FiEdit3 className="w-3 h-3" />
              <span>Your Spoken or Written Answer (editable)</span>
            </span>
            <span>{transcript.length} characters</span>
          </div>

          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak using the microphone or type your answer here... (e.g. 'In JavaScript, closures happen when a function remembers its outer lexical environment...')"
              rows={3}
              disabled={isEvaluating}
              className={`w-full p-3 rounded-lg text-xs sm:text-[13px] leading-relaxed transition-all resize-y border bg-white dark:bg-[#181818] text-slate-900 dark:text-[#f0f0f0] placeholder:text-slate-400 dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                isRecording
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 dark:border-[#2e2e2e]"
              }`}
            />
          </div>
        </div>

        {/* Submit Button Row */}
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-[11px] text-slate-400 dark:text-[#777777]">
            Answers are evaluated in temporary memory and never saved to a database.
          </p>

          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={!hasAnswer || isEvaluating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEvaluating ? (
              <>
                <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Answer...</span>
              </>
            ) : (
              <>
                <FiSend className="w-3.5 h-3.5" />
                <span>Check My Answer</span>
              </>
            )}
          </button>
        </div>

        {/* AI EVALUATION RESULTS SECTION */}
        <AnimatePresence>
          {evaluationResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-slate-200/80 dark:border-[#262626] space-y-4"
            >
              {/* Result Header & Score Card */}
              {(() => {
                const meta = getScoreMetadata(evaluationResult.score);
                return (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#181818] border border-slate-200/90 dark:border-[#282828] flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-3.5">
                      <CircularScoreRing score={evaluationResult.score} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                          <StarRating score={evaluationResult.score} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#999999] leading-tight">
                          {meta.subtext}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#333333] hover:bg-slate-100 dark:hover:bg-[#222222] text-slate-700 dark:text-[#e0e0e0] text-xs font-medium transition-colors cursor-pointer ml-auto"
                      title="Practice again with a new answer"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  </div>
                );
              })()}

              {/* Feedback Summary */}
              {evaluationResult.summary && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-[#282828] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#d0d0d0]">
                    Feedback Summary
                  </span>
                  <p className="text-xs sm:text-[13px] text-slate-700 dark:text-[#d4d4d4] leading-relaxed">
                    {evaluationResult.summary}
                  </p>
                </div>
              )}

              {/* Strengths (if present) */}
              {Array.isArray(evaluationResult.strengths) &&
                evaluationResult.strengths.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-[#141d17] border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      <span>What You Did Well</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#cccccc]">
                      {evaluationResult.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Missing Concepts ("What You Missed") */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-[#282828] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#d0d0d0]">
                  What You Missed
                </span>

                {Array.isArray(evaluationResult.missingConcepts) &&
                evaluationResult.missingConcepts.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#cccccc]">
                    {evaluationResult.missingConcepts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 py-1">
                    <FiCheck className="w-4 h-4 stroke-[3]" />
                    <span className="font-medium">
                      Great answer! You covered the important concepts.
                    </span>
                  </div>
                )}
              </div>

              {/* Improvement Suggestion (Concise tip) */}
              {evaluationResult.improvementSuggestion && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 text-[10px]">
                    <span className="text-amber-500">💡</span>
                    <span>Pro Tip for Technical Interviews</span>
                  </div>
                  <p className="text-amber-900 dark:text-amber-200 leading-relaxed font-normal">
                    {evaluationResult.improvementSuggestion}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
