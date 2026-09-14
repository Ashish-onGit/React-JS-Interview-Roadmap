import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function AIKeyTakeaways({ takeaways }) {
  if (!takeaways || !Array.isArray(takeaways) || takeaways.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-[#2a2a2a] dark:border-l-4 dark:border-l-indigo-500 bg-gradient-to-r from-indigo-50/70 to-violet-50/70 dark:bg-none dark:bg-[#191919] p-4 my-4">
      <h4 className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-[#f5f5f5] mb-2.5 flex items-center gap-2">
        <span>💡</span>
        <span>Key Takeaways</span>
      </h4>
      <ul className="space-y-2">
        {takeaways.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-indigo-900/90 dark:text-[#d4d4d4] leading-relaxed">
            <FiCheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
