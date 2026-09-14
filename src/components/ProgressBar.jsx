import React from "react";

export default function ProgressBar({
  value = 0,
  max = 100,
  height = "h-2",
  colorClass = "bg-emerald-500",
  bgClass = "bg-slate-200 dark:bg-[#333333]"
}) {
  const percentage = Math.min(Math.max(Math.round((value / (max || 1)) * 100), 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full ${bgClass} rounded-full overflow-hidden ${height}`}
    >
      <div
        className={`${height} ${colorClass} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
