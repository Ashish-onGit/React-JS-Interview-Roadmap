import React, { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ProgressBar({
  value = 0,
  max = 100,
  height = "h-2",
  colorClass = "bg-emerald-500",
  bgClass = "bg-slate-200 dark:bg-[#333333]"
}) {
  const percentage = Math.min(Math.max(Math.round((value / (max || 1)) * 100), 0), 100);
  const shouldReduceMotion = useReducedMotion();
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full ${bgClass} rounded-full overflow-hidden ${height}`}
    >
      <motion.div
        className={`${height} ${colorClass} rounded-full`}
        initial={isFirstRender.current ? false : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.35, ease: "easeOut" }
        }
      />
    </div>
  );
}
