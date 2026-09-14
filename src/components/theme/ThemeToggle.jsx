import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle({ className = "", variant = "header" }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const title = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "drawer") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={title}
        title={title}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all ${
          isDark
            ? "bg-[#1f1f1f] text-[#f5f5f5] hover:bg-[#262626] border border-[#2e2e2e]"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <FiSun className="w-4 h-4 text-amber-400" />
          ) : (
            <FiMoon className="w-4 h-4 text-indigo-600" />
          )}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={title}
      title={title}
      className={`p-2 rounded-xl border transition-all duration-150 active:scale-95 flex items-center justify-center shrink-0 ${
        isDark
          ? "bg-[#1a1a1a] hover:bg-[#242424] text-amber-400 border-[#2e2e2e] shadow-xs"
          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 shadow-2xs"
      } ${className}`}
    >
      {isDark ? (
        <FiSun className="w-4 h-4 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <FiMoon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
