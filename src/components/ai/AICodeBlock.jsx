import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function AICodeBlock({ code, language = "javascript", explanation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  if (!code) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 dark:border-[#262626] bg-[#0f172a] dark:bg-[#0c0c0c] shadow-md my-3">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 dark:bg-[#151515] border-b border-slate-700/80 dark:border-[#262626] text-xs text-slate-400 dark:text-[#a3a3a3]">
        <span className="font-mono uppercase font-semibold text-indigo-400 tracking-wider text-[11px]">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied code" : "Copy code"}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-300 dark:text-[#d4d4d4] hover:text-white bg-slate-700/60 dark:bg-[#222222] hover:bg-slate-700 dark:hover:bg-[#2c2c2c] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content - Horizontally scrollable */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 dark:text-[#ececec] leading-relaxed scrollbar-thin">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      {/* Optional Explanation */}
      {explanation && (
        <div className="px-4 py-2.5 bg-slate-900/60 dark:bg-[#111111] border-t border-slate-800 dark:border-[#262626] text-xs text-slate-400 dark:text-[#a3a3a3] leading-relaxed">
          <span className="font-semibold text-slate-300 dark:text-[#d4d4d4]">Explanation: </span>
          {explanation}
        </div>
      )}
    </div>
  );
}
