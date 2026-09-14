import React from "react";
import { LuSparkles } from "react-icons/lu";

export default function AIChatEmptyState() {
  return (
    <div className="p-6 text-center text-slate-500 my-auto">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
        <LuSparkles className="w-5 h-5" />
      </div>
      <h5 className="text-xs font-bold text-slate-800 mb-1">
        No AI lessons yet
      </h5>
      <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
        Open any roadmap topic and select <span className="font-semibold text-indigo-600">Teach Me</span> to start learning with AI.
      </p>
    </div>
  );
}
