import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiCpu } from "react-icons/fi";

const ANALYSIS_STEPS = [
  "Experience detected & verified",
  "Core technologies & frameworks identified",
  "Projects & real-world responsibilities extracted",
  "Technical difficulty & seniority level calibrated",
  "Personalized interview questions & follow-ups prepared",
];

export default function ResumeAnalysis({ onComplete }) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        if (prev < ANALYSIS_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6"
      >
        {/* Animated AI Brain Icon */}
        <div className="relative w-16 h-16 mx-auto rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <FiCpu className="w-8 h-8 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161616]" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Analyzing your experience...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9e9e9e] mt-1.5">
            Calibrating realistic questions tailored to your skills and projects
          </p>
        </div>

        {/* Checkmark Sequence */}
        <div className="space-y-3 text-left max-w-md mx-auto pt-2">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0.3, x: -6 }}
                animate={{
                  opacity: isDone || isCurrent ? 1 : 0.3,
                  x: 0,
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  isDone
                    ? "bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium"
                    : isCurrent
                    ? "bg-slate-100 dark:bg-[#202020] text-slate-800 dark:text-slate-200 font-medium"
                    : "text-slate-400 dark:text-[#666666]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "bg-slate-200 dark:bg-[#303030] text-transparent"
                  }`}
                >
                  <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm">{step}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
