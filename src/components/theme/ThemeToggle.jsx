import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({ className = "", variant = "header" }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const title = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "drawer") {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={toggleTheme}
        aria-label={title}
        title={title}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
          isDark
            ? "bg-[#1f1f1f] text-[#f5f5f5] hover:bg-[#262626] border border-[#2e2e2e]"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="inline-flex"
              >
                <FiSun className="w-4 h-4 text-amber-400" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="inline-flex"
              >
                <FiMoon className="w-4 h-4 text-indigo-600" />
              </motion.span>
            )}
          </AnimatePresence>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400">
          {isDark ? "Dark" : "Light"}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      aria-label={title}
      title={title}
      className={`p-2 rounded-xl border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
        isDark
          ? "bg-[#1a1a1a] hover:bg-[#242424] text-amber-400 border-[#2e2e2e] shadow-xs"
          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 shadow-2xs"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="inline-flex items-center justify-center"
          >
            <FiSun className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="inline-flex items-center justify-center"
          >
            <FiMoon className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
