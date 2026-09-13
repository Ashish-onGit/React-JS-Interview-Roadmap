import React from "react";
import AICodeBlock from "./AICodeBlock";
import AIComparison from "./AIComparison";
import AIInterviewQuestions from "./AIInterviewQuestions";
import AIKeyTakeaways from "./AIKeyTakeaways";
import { LuSparkles, LuUser } from "react-icons/lu";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

export default function AIContent({
  lesson,
  conversation = [],
  isFollowUpLoading = false
}) {
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>💬</span>
            <span>Follow-Up Q&A</span>
          </h4>

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
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                    <LuSparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-xs"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80 whitespace-pre-wrap font-sans"
                  }`}
                >
                  {msg.content}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                    <LuUser className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isFollowUpLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 pl-1 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Generating follow-up answer...</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
