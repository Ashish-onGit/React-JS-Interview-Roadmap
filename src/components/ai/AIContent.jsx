import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import AICodeBlock from "./AICodeBlock";
import AIComparison from "./AIComparison";
import AIInterviewQuestions from "./AIInterviewQuestions";
import AIKeyTakeaways from "./AIKeyTakeaways";
import AIMarkdownMessage from "./AIMarkdownMessage";
import { LuSparkles, LuUser } from "react-icons/lu";
import { FiAlertCircle, FiLoader, FiCopy, FiCheck, FiThumbsUp } from "react-icons/fi";
import { messageVariants, buttonTapScale } from "../../utils/motionVariants";

export default function AIContent({
  lesson,
  conversation = [],
  isFollowUpLoading = false,
  onAskFollowUp
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [likedIndices, setLikedIndices] = useState({});
  const initialMsgCount = useRef(conversation.length);

  const handleCopyResponse = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error("Failed to copy response", err);
    }
  };

  const handleToggleLike = (idx) => {
    setLikedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  if (!lesson) return null;

  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
      {/* 📚 1. Overview */}
      {lesson.overview && (
        <section className="bg-slate-50/80 dark:bg-[#171717] border border-slate-200/80 dark:border-[#2a2a2a] rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <span>📚</span>
            <span>Overview</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-[#d4d4d4] leading-relaxed">
            {lesson.overview}
          </p>
        </section>
      )}

      {/* 🧠 2. Core Theory */}
      {lesson.theory && lesson.theory.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#a3a3a3] flex items-center gap-1.5">
            <span>🧠</span>
            <span>Core Theory & Mechanics</span>
          </h4>
          <div className="space-y-3">
            {lesson.theory.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#191919] border border-slate-200/90 dark:border-[#2a2a2a] rounded-xl p-4 shadow-2xs"
              >
                {item.heading && (
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#f5f5f5] mb-1.5">
                    {item.heading}
                  </h5>
                )}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#d4d4d4] leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🌍 3. Real-World Example */}
      {lesson.realWorldExample && (
        <section className="bg-emerald-50/40 dark:bg-[#191919] border border-emerald-100 dark:border-[#2a2a2a] dark:border-l-4 dark:border-l-emerald-500 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <span>🌍</span>
            <span>Real-World Engineering Scenario</span>
          </h4>
          {lesson.realWorldExample.scenario && (
            <div className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-[#f5f5f5] mb-1">
              {lesson.realWorldExample.scenario}
            </div>
          )}
          {lesson.realWorldExample.explanation && (
            <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-[#d4d4d4] leading-relaxed">
              {lesson.realWorldExample.explanation}
            </p>
          )}
        </section>
      )}

      {/* 💻 4. Code Example */}
      {lesson.codeExample && lesson.codeExample.code && (
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#a3a3a3] mb-1.5 flex items-center gap-1.5">
            <span>💻</span>
            <span>Code Example</span>
          </h4>
          <AICodeBlock
            code={lesson.codeExample.code}
            language={lesson.codeExample.language}
            explanation={lesson.codeExample.explanation}
          />
        </section>
      )}

      {/* ⚖️ 5. Comparison Table */}
      {lesson.comparison && (
        <section>
          <AIComparison comparison={lesson.comparison} />
        </section>
      )}

      {/* 🚫 6. Common Mistakes */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <section className="bg-amber-50/40 dark:bg-[#191919] border border-amber-200/80 dark:border-[#2a2a2a] dark:border-l-4 dark:border-l-amber-500 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
            <span>🚫</span>
            <span>Common Pitfalls & Mistakes</span>
          </h4>
          <ul className="space-y-2">
            {lesson.commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-amber-950/90 dark:text-[#d4d4d4] leading-relaxed"
              >
                <FiAlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🎯 7. Interview Questions */}
      {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#a3a3a3] mb-2 flex items-center gap-1.5">
            <span>🎯</span>
            <span>Key Interview Questions & Answers</span>
          </h4>
          <AIInterviewQuestions questions={lesson.interviewQuestions} />
        </section>
      )}

      {/* 💡 8. Key Takeaways */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <section>
          <AIKeyTakeaways takeaways={lesson.keyTakeaways} />
        </section>
      )}

      {/* In-Session Follow-Up Conversation Thread */}
      {conversation.length > 0 && (
        <section className="border-t border-slate-200 dark:border-[#2a2a2a] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#a3a3a3] flex items-center gap-1.5">
              <span>💬</span>
              <span>Follow-Up Discussion</span>
            </h4>
            <span className="text-[11px] font-medium text-slate-400 dark:text-[#a3a3a3] bg-slate-100 dark:bg-[#242424] px-2 py-0.5 rounded-full">
              {conversation.length} {conversation.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {conversation.map((msg, idx) => {
            const isUser = msg.role === "user";
            const isNewlyAdded = idx >= initialMsgCount.current;
            const MessageComponent = isNewlyAdded ? motion.div : "div";
            const motionProps = isNewlyAdded
              ? {
                  variants: messageVariants,
                  initial: "initial",
                  animate: "animate"
                }
              : {};

            return (
              <MessageComponent
                key={idx}
                {...motionProps}
                className={`w-full flex ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`transition-all ${
                    isUser
                      ? "max-w-[88%] sm:max-w-[80%] ml-auto px-3.5 py-2.5 bg-indigo-600 dark:bg-[#242424] text-white dark:text-[#f5f5f5] dark:border dark:border-[#333333] rounded-2xl rounded-tr-xs shadow-xs text-xs sm:text-sm leading-relaxed font-medium"
                      : "w-full bg-white dark:bg-[#171717] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] shadow-xs p-3 sm:p-4 md:p-5"
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div>
                      {/* Top interactive toolbar for AI message */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#262626] pb-2 mb-2.5 text-xs">
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] sm:text-xs">
                          <LuSparkles className="w-3.5 h-3.5" />
                          <span>AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyResponse(msg.content, idx)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-500 dark:text-[#a3a3a3] hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262626] transition-colors"
                            aria-label="Copy full answer"
                            title="Copy full answer"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <FiCopy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleLike(idx)}
                            className={`p-1.5 rounded-md text-xs transition-colors ${
                              likedIndices[idx]
                                ? "text-indigo-600 bg-indigo-50 dark:bg-[#262626] dark:text-indigo-400"
                                : "text-slate-400 dark:text-[#737373] hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#262626]"
                            }`}
                            aria-label="Mark helpful"
                            title="Helpful response"
                          >
                            <FiThumbsUp className={`w-3.5 h-3.5 ${likedIndices[idx] ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Markdown Content */}
                      <AIMarkdownMessage content={msg.content} />
                    </div>
                  )}
                </div>
              </MessageComponent>
            );
          })}

          {isFollowUpLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-[#a3a3a3] pl-1 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 dark:bg-[#262626] text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="font-medium">Generating interactive answer...</span>
            </div>
          )}

          {/* Quick Suggested Follow-Up Prompts after existing discussion */}
          {onAskFollowUp && !isFollowUpLoading && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-[#737373] uppercase tracking-wider mb-2 flex items-center gap-1">
                <span>⚡</span>
                <span>Suggested Follow-Ups</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "💡 Give another code example",
                  "🎯 How do interviewers ask this?",
                  "⚠️ What are the common edge cases?",
                  "🔄 Summarize in 2 key points"
                ].map((prompt, pIdx) => (
                  <motion.button
                    key={pIdx}
                    type="button"
                    whileTap={buttonTapScale}
                    onClick={() => onAskFollowUp(prompt.replace(/^[^a-zA-Z0-9]+/, ""))}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1f1f1f] hover:bg-indigo-50 dark:hover:bg-[#282828] hover:text-indigo-700 dark:hover:text-white hover:border-indigo-200 dark:hover:border-[#444444] text-slate-600 dark:text-[#d4d4d4] border border-slate-200 dark:border-[#333333] shadow-2xs transition-colors text-left cursor-pointer"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Suggested Follow-Up Prompts for fresh topic */}
      {conversation.length === 0 && onAskFollowUp && (
        <section className="border-t border-slate-200/80 dark:border-[#2a2a2a] pt-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#737373] flex items-center gap-1.5">
            <span>💡</span>
            <span>Suggested Questions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "💡 Give a practical code example",
              "🎯 Common interview pitfalls for this topic",
              "⚖️ Compare with alternative patterns",
              "👶 Explain this in simple terms"
            ].map((prompt, pIdx) => (
              <motion.button
                key={pIdx}
                type="button"
                whileTap={buttonTapScale}
                onClick={() => onAskFollowUp(prompt.replace(/^[^a-zA-Z0-9]+/, ""))}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1f1f1f] hover:bg-indigo-50 dark:hover:bg-[#282828] hover:text-indigo-700 dark:hover:text-white hover:border-indigo-200 dark:hover:border-[#444444] text-slate-600 dark:text-[#d4d4d4] border border-slate-200 dark:border-[#333333] shadow-2xs transition-colors text-left cursor-pointer"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
