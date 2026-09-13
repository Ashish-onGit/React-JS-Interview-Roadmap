import React from "react";
import { FiAlertTriangle, FiRefreshCw, FiX } from "react-icons/fi";

export default function AIError({ error, onRetry, onClose }) {
  const isKeyError =
    typeof error === "string" &&
    (error.toLowerCase().includes("api key") || error.toLowerCase().includes("not configured"));

  return (
    <div className="p-6 sm:p-8 text-center max-w-md mx-auto my-8 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
        <FiAlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1.5">
        {isKeyError ? "API Configuration Required" : "Unable to generate lesson"}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
        {error || "An unexpected error occurred while communicating with the AI service."}
      </p>

      {isKeyError && (
        <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 font-mono mb-6">
          <p className="text-slate-500 font-sans text-[11px] mb-1 font-semibold">
            To enable the AI Assistant, add to .env:
          </p>
          <code>VITE_GROQ_API_KEY=gsk_...</code>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 transition-colors cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
