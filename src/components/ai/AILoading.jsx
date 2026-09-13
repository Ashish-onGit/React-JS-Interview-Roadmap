import React from "react";
import { LuSparkles } from "react-icons/lu";

export default function AILoading({ topicTitle }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Title & Status */}
      <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm sm:text-base">
        <LuSparkles className="w-5 h-5 animate-spin" />
        <span>Teaching {topicTitle || "topic"} with Groq AI...</span>
      </div>

      {/* Overview Skeleton */}
      <div className="space-y-2.5">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
      </div>

      {/* Theory Block Skeleton */}
      <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/60">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-4/5"></div>
      </div>

      {/* Real World Example Skeleton */}
      <div className="space-y-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
        <div className="h-4 bg-emerald-200 rounded w-2/5"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
      </div>

      {/* Code Block Skeleton */}
      <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-4 space-y-2.5">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="h-3 bg-slate-700 rounded w-20"></div>
          <div className="h-3 bg-slate-700 rounded w-12"></div>
        </div>
        <div className="h-3 bg-slate-800 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800 rounded w-1/2"></div>
        <div className="h-3 bg-slate-800 rounded w-5/6"></div>
      </div>

      {/* Questions Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
        <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
