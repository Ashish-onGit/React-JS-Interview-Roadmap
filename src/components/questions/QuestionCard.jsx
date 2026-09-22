import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiCopy,
  FiCode,
  FiTarget
} from "react-icons/fi";
import { accordionVariants } from "../../utils/motionVariants";

/**
 * Extracts any embedded markdown code block from the question string
 * so the collapsed card displays only the clean question text,
 * while preserving the code for the expanded view.
 */
function parseQuestionContent(questionText, codeSnippet) {
  let cleanQuestion = questionText || "";
  let code = codeSnippet || "";

  const codeBlockRegex = /```(?:[a-zA-Z]*\n)?([\s\S]*?)```/;
  const match = cleanQuestion.match(codeBlockRegex);
  if (match) {
    if (!code) {
      code = match[1].trim();
    }
    cleanQuestion = cleanQuestion.replace(codeBlockRegex, "").trim();
  }

  // Remove trailing triple backticks if any malformed markdown was present
  cleanQuestion = cleanQuestion.replace(/```[a-zA-Z]*$/g, "").trim();

  return { cleanQuestion, code };
}

function QuestionCard({
  item,
  index,
  isCompleted,
  onToggleComplete
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const { cleanQuestion, code } = useMemo(
    () => parseQuestionContent(item.question, item.code),
    [item.question, item.code]
  );

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const contentId = `question-content-${item.id || index}`;
  const formattedNumber = String(index + 1).padStart(2, "0");

  // Subtle, compact difficulty badge styling
  const difficultyBadge = {
    basic: {
      label: "Basic",
      className:
        "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20"
    },
    medium: {
      label: "Medium",
      className:
        "text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20"
    },
    advanced: {
      label: "Advanced",
      className:
        "text-rose-700 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20"
    }
  }[item.difficulty] || {
    label: item.difficulty || "Medium",
    className:
      "text-slate-600 dark:text-[#a3a3a3] bg-slate-500/10 border-slate-500/20"
  };

  return (
    <div
      className={`border rounded-xl transition-all duration-150 overflow-hidden ${
        isCompleted
          ? "border-emerald-200/80 dark:border-[#223d2b] bg-white dark:bg-[#161616]"
          : isOpen
          ? "border-slate-300 dark:border-[#383838] bg-white dark:bg-[#171717] shadow-2xs"
          : "border-slate-200/80 dark:border-[#262626] bg-white dark:bg-[#171717] hover:border-slate-300 dark:hover:border-[#383838] shadow-2xs"
      }`}
    >
      {/* 
        MOBILE-FIRST HIERARCHY:
        Row 1: 01   BASIC   CONCEPTUAL                          ˅
        Row 2: Question text (100% full card width, 15px-16px, readable)
        Row 3: Completion action button (min 40px touch target)
      */}
      <div className="w-full p-3.5 sm:p-4 flex flex-col gap-2.5">
        {/* Accordion Trigger (Row 1: Metadata + Chevron, Row 2: Full Width Question) */}
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="w-full text-left cursor-pointer group select-none focus:outline-none space-y-2"
        >
          {/* ROW 1: Metadata Badges + Expand Chevron */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Question Number (Subtle, secondary, no large box) */}
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 dark:text-[#737373] tracking-wide select-none">
                {formattedNumber}
              </span>

              {/* Compact Difficulty Badge (font-size 9-10px, padding 3px 7px, radius 5px) */}
              <span
                className={`text-[9px] sm:text-[10px] font-semibold px-[7px] py-[3px] rounded-[5px] border uppercase tracking-wider ${difficultyBadge.className}`}
              >
                {difficultyBadge.label}
              </span>

              {/* Compact Type Badge (Low-contrast neutral styling) */}
              {item.type && (
                <span className="text-[9px] sm:text-[10px] font-medium px-[6px] py-[2px] rounded-[4px] bg-slate-100/70 dark:bg-[#202020] text-slate-500 dark:text-[#888888] border border-slate-200/50 dark:border-[#2b2b2b] uppercase tracking-wider">
                  {item.type}
                </span>
              )}

              {/* Code Indicator Icon if snippet present */}
              {code && (
                <span
                  className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-[2px] rounded-[4px] bg-slate-100/70 dark:bg-[#202020] text-slate-500 dark:text-[#888888] border border-slate-200/50 dark:border-[#2b2b2b]"
                  title="Contains code snippet"
                >
                  <FiCode className="w-2.5 h-2.5" />
                  <span>Code</span>
                </span>
              )}
            </div>

            {/* Chevron Icon with comfortable 40px touch area */}
            <div
              className="w-10 h-10 -mr-2.5 -my-2 flex items-center justify-center text-slate-400 dark:text-[#737373] group-hover:text-slate-700 dark:group-hover:text-white transition-colors flex-shrink-0"
              aria-label={isOpen ? "Collapse answer" : "Expand answer"}
            >
              {isOpen ? (
                <FiChevronUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              ) : (
                <FiChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              )}
            </div>
          </div>

          {/* ROW 2: Question Text (FULL WIDTH, Large 15-16px, readable, no horizontal constraints) */}
          <h3 className="text-[15px] sm:text-base font-semibold leading-[1.5] text-slate-900 dark:text-[#f5f5f5] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors w-full text-left break-words">
            {cleanQuestion}
          </h3>
        </button>

        {/* ROW 3: Compact Status / Completion Control (Min 40px touch target, icon only) */}
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={() => onToggleComplete(item.id)}
            title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
            aria-label={
              isCompleted
                ? `Mark question ${formattedNumber} as incomplete`
                : `Mark question ${formattedNumber} as completed`
            }
            className="w-10 h-10 -ml-2.5 -mb-2 flex items-center justify-center cursor-pointer rounded-lg hover:bg-slate-100/60 dark:hover:bg-[#202020] transition-colors focus:outline-none"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isCompleted
                  ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/20"
                  : "border-2 border-slate-300 dark:border-[#444444] hover:border-emerald-500 dark:hover:border-emerald-400 bg-transparent text-slate-400 dark:text-[#737373]"
              }`}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                </motion.div>
              ) : null}
            </div>
          </button>
        </div>
      </div>

      {/* Accordion Answer & Explanation Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            variants={accordionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 dark:border-[#242424] bg-slate-50/40 dark:bg-[#121212] space-y-3.5">
              {/* Optional Code Snippet Block */}
              {code && (
                <div className="rounded-xl overflow-hidden border border-slate-200/90 dark:border-[#2a2a2a] bg-slate-900 text-slate-100 dark:bg-[#0c0c0c] text-xs sm:text-sm">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800/80 dark:bg-[#161616] border-b border-slate-700/60 dark:border-[#222222]">
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      Code Snippet
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700/60 dark:hover:bg-[#242424] transition-colors cursor-pointer"
                      title="Copy code to clipboard"
                    >
                      {copiedCode ? (
                        <>
                          <FiCheck className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 font-mono text-xs leading-relaxed overflow-x-auto text-emerald-300 dark:text-emerald-400">
                    <code>{code}</code>
                  </pre>
                </div>
              )}

              {/* Model Answer (Clear separation, comfortable line height 1.6) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <FiTarget className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Interview Answer</span>
                </div>
                <div className="text-[14px] sm:text-[15px] text-slate-700 dark:text-[#d4d4d4] leading-[1.6] whitespace-pre-line font-normal">
                  {item.answer}
                </div>
              </div>

              {/* Technical Insight Box (Subtle neutral container) */}
              {item.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-[#1c1c1c] border border-slate-200/80 dark:border-[#2a2a2a] text-xs sm:text-[13px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-[#d4d4d4] text-[11px] uppercase tracking-wider">
                    <span className="text-amber-500">💡</span>
                    <span>Technical Insight</span>
                  </div>
                  <p className="text-slate-600 dark:text-[#a3a3a3] leading-relaxed whitespace-pre-line">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(QuestionCard);
