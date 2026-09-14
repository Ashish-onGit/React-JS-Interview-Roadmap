import React, { useState } from "react";
import AICodeBlock from "./AICodeBlock";
import AIComparison from "./AIComparison";
import AIInterviewQuestions from "./AIInterviewQuestions";
import AIKeyTakeaways from "./AIKeyTakeaways";
import AIMarkdownMessage from "./AIMarkdownMessage";
import { LuSparkles, LuUser } from "react-icons/lu";
import { FiAlertCircle, FiLoader, FiCopy, FiCheck, FiThumbsUp } from "react-icons/fi";

export default function AIContent({
  lesson,
  conversation = [],
  isFollowUpLoading = false,
  onAskFollowUp
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [likedIndices, setLikedIndices] = useState({});

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
    <div className="p-4 sm:p-6 space-y-6">
      {/* 📚 1. Overview */}
      {lesson.overview && (
        <section className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 flex items-center gap-1.5">
            <span>📚</span>
            <span>Overview</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {lesson.overview}
          </p>
        </section>
      )}

      {/* 🧠 2. Core Theory */}
      {lesson.theory && lesson.theory.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span>🧠</span>
            <span>Core Theory & Mechanics</span>
          </h4>
          <div className="space-y-3">
            {lesson.theory.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs"
              >
                {item.heading && (
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    {item.heading}
                  </h5>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🌍 3. Real-World Example */}
      {lesson.realWorldExample && (
        <section className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
            <span>🌍</span>
            <span>Real-World Engineering Scenario</span>
          </h4>
          {lesson.realWorldExample.scenario && (
            <div className="text-xs sm:text-sm font-semibold text-emerald-950 mb-1">
              {lesson.realWorldExample.scenario}
            </div>
          )}
          {lesson.realWorldExample.explanation && (
            <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
              {lesson.realWorldExample.explanation}
            </p>
          )}
        </section>
      )}

      {/* 💻 4. Code Example */}
      {lesson.codeExample && lesson.codeExample.code && (
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
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
        <section className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2.5 flex items-center gap-1.5">
            <span>🚫</span>
            <span>Common Pitfalls & Mistakes</span>
          </h4>
          <ul className="space-y-2">
            {lesson.commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-amber-950/90 leading-relaxed"
              >
                <FiAlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🎯 7. Interview Questions */}
      {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
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
        <section className="border-t border-slate-200 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>💬</span>
              <span>Follow-Up Discussion</span>
            </h4>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {conversation.length} {conversation.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {conversation.map((msg, idx) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-1">
                    <LuSparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`rounded-2xl transition-all ${
                    isUser
                      ? "max-w-[85%] sm:max-w-[75%] px-4 py-2.5 bg-indigo-600 text-white rounded-tr-none shadow-xs text-xs sm:text-sm leading-relaxed"
                      : "w-full max-w-[96%] sm:max-w-[92%] bg-white rounded-tl-none border border-slate-200 shadow-xs p-4 sm:p-5"
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                  ) : (
                    <div>
                      {/* Top interactive toolbar for AI message */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-semibold text-[11px] sm:text-xs">
                          <LuSparkles className="w-3.5 h-3.5" />
                          <span>AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyResponse(msg.content, idx)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            aria-label="Copy full answer"
                            title="Copy full answer"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 font-semibold">Copied!</span>
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
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
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

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-1">
                    <LuUser className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isFollowUpLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 pl-1 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="font-medium">Generating interactive answer...</span>
            </div>
          )}

          {/* Quick Suggested Follow-Up Prompts after existing discussion */}
          {onAskFollowUp && !isFollowUpLoading && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
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
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => onAskFollowUp(prompt.replace(/^[^a-zA-Z0-9]+/, ""))}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200 shadow-2xs transition-all active:scale-95 text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Suggested Follow-Up Prompts for fresh topic */}
      {conversation.length === 0 && onAskFollowUp && (
        <section className="border-t border-slate-200/80 pt-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
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
              <button
                key={pIdx}
                type="button"
                onClick={() => onAskFollowUp(prompt.replace(/^[^a-zA-Z0-9]+/, ""))}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200 shadow-2xs transition-all active:scale-95 text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
