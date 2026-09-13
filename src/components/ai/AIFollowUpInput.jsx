import React, { useState } from "react";
import { FiSend, FiLoader } from "react-icons/fi";

export default function AIFollowUpInput({ onSubmit, isLoading, disabled }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!question.trim() || isLoading || disabled) return;
    onSubmit(question);
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:px-6 bg-white border-t border-slate-200/90 flex items-center gap-2 flex-shrink-0"
    >
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder="Ask a follow-up question (e.g. 'Explain with another analogy')..."
        className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400 transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!question.trim() || isLoading || disabled}
        aria-label="Send follow-up question"
        className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all shadow-xs shadow-indigo-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <FiLoader className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="hidden sm:inline">Send</span>
            <FiSend className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
