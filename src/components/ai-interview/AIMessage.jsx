import React from "react";
import { FiCpu } from "react-icons/fi";
import { motion } from "framer-motion";
import VoiceQuestion from "./VoiceQuestion";

export default function AIMessage({
  message,
  activeSpeakingId,
  onPlayVoice,
  onStopVoice,
  onReplayVoice,
}) {
  const { id, text, question, timestamp } = message;
  const isSpeaking = activeSpeakingId === id;

  const getIntentBadge = () => {
    switch (message.intent) {
      case "HINT_REQUEST":
        return { label: "💡 Hint & Clue", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
      case "CLARIFICATION_REQUEST":
        return { label: "❓ Question Clarified", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
      case "REPEAT_REQUEST":
        return { label: "🔄 Question Repeated", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" };
      case "EXAMPLE_REQUEST":
        return { label: "📝 Scenario Example", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
      case "ANSWER_EXPLANATION_REQUEST":
        return { label: "📘 Concept Solution", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" };
      case "SKIP_REQUEST":
        return { label: "⏩ Skipped (-Points)", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" };
      case "RETRY_REQUEST":
        return { label: "🔁 Second Attempt", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
      case "UNRELATED_MESSAGE":
        return { label: "💬 Interviewer Guidance", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
      default:
        if (message.isClarification) {
          return { label: "💡 Clarification", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
        }
        if (message.isFollowUp) {
          return { label: "🎯 Follow-up", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
        }
        return null;
    }
  };

  const badge = getIntentBadge();
  const isQuestionPlayerOnly = !question;
  const isNonQuestionInquiry = message.intent && message.intent !== "ANSWER" && message.intent !== "SKIP_REQUEST";

  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-3xl mr-auto">
      {/* AI Avatar with dynamic audio pulse wave effect */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-2xs z-10 relative">
          <FiCpu className="w-5 h-5" />
        </div>

        {/* Dynamic expanding wave halo when AI is speaking */}
        {isSpeaking && (
          <>
            <span className="absolute inset-0 rounded-xl bg-indigo-500/30 animate-ping opacity-75 pointer-events-none" />
            <span className="absolute -inset-1 rounded-2xl bg-indigo-500/20 animate-pulse pointer-events-none" />
          </>
        )}
      </div>

      {/* Message Bubble Card */}
      <div className={`flex-1 min-w-0 bg-white dark:bg-[#171717] border ${
        isSpeaking
          ? "border-indigo-500/40 dark:border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-md"
          : badge
          ? "border-amber-400/30 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5"
          : "border-slate-200 dark:border-[#272727]"
      } rounded-2xl p-4 sm:p-5 shadow-xs transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              AI Interviewer
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#737373]">
              ● Voice Assistant
            </span>
            {badge && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-[#666666]">
            {timestamp || "Just now"}
          </span>
        </div>

        {/* Live Audio Wave Visualizer while AI is speaking */}
        {isSpeaking && (
          <div className="mb-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 font-mono">
                AI Speaking...
              </span>
            </div>

            {/* Multi-channel fluid audio frequency wave bars */}
            <div className="flex items-center gap-1 h-5 px-1">
              {[0.4, 0.8, 1.2, 0.6, 1.5, 0.9, 0.5, 1.4, 0.7, 1.1, 0.5, 0.9, 1.3, 0.6].map((scale, i) => (
                <motion.span
                  key={i}
                  className="w-1 bg-gradient-to-t from-indigo-500 to-emerald-400 rounded-full inline-block"
                  animate={{
                    scaleY: [scale * 0.25, scale * 1.3, scale * 0.25],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: "easeInOut",
                  }}
                  style={{ height: "18px", transformOrigin: "center" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skipped question penalty indicator */}
        {(message.intent === "SKIP_REQUEST" || message.evaluation?.skipped) && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
            <span>Question skipped by candidate</span>
            <span className="font-semibold">-15 points penalty</span>
          </div>
        )}

        {/* Narrative / Feedback Text */}
        {text && (
          <p className="text-sm sm:text-base text-slate-700 dark:text-[#e5e5e5] leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        )}

        {/* Voice Question Player (if message contains a question) */}
        {question && (
          <VoiceQuestion
            questionText={question}
            isSpeaking={isSpeaking}
            onPlay={() => onPlayVoice(id, isNonQuestionInquiry ? text : (text ? `${text}. ${question}` : question))}
            onStop={onStopVoice}
            onReplay={() => onReplayVoice(id, isNonQuestionInquiry ? text : (text ? `${text}. ${question}` : question))}
          />
        )}
      </div>
    </div>
  );
}
