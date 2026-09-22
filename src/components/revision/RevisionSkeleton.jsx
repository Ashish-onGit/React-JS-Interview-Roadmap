import React from "react";

export default function RevisionSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-label="Loading revision notes">
      {/* Concept Table Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-28 bg-slate-200 dark:bg-[#262626] rounded"></div>
        <div className="rounded-xl border border-slate-200 dark:border-[#262626] overflow-hidden">
          <div className="h-7 bg-slate-100 dark:bg-[#1f1f1f] border-b border-slate-200 dark:border-[#262626]"></div>
          <div className="p-3 space-y-2 bg-white dark:bg-[#171717]">
            <div className="flex gap-3">
              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
              <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
              <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
              <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-[#262626] rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* One-Line Revision Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 bg-slate-200 dark:bg-[#262626] rounded"></div>
        <div className="rounded-xl border border-slate-200 dark:border-[#262626] p-3 space-y-2.5 bg-white dark:bg-[#171717]">
          <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-[#262626] rounded"></div>
          <div className="h-3.5 w-full bg-slate-200 dark:bg-[#262626] rounded"></div>
          <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-[#262626] rounded"></div>
        </div>
      </div>

      {/* Interview Ready Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-28 bg-slate-200 dark:bg-[#262626] rounded"></div>
        <div className="rounded-xl border border-slate-200 dark:border-[#262626] p-3 space-y-2 bg-white dark:bg-[#171717]">
          <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-[#262626] rounded"></div>
          <div className="h-3 w-full bg-slate-100 dark:bg-[#222222] rounded"></div>
          <div className="h-3 w-3/4 bg-slate-100 dark:bg-[#222222] rounded"></div>
        </div>
      </div>
    </div>
  );
}
