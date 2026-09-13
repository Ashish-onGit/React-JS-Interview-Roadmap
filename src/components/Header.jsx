import React from "react";
import { FiCode, FiMenu, FiSidebar, FiSearch } from "react-icons/fi";
import { useProgress } from "../hooks/useProgress";

export default function Header({
  onOpenMobileMenu,
  isDesktopSidebarOpen = true,
  onToggleDesktopSidebar,
  onOpenSearch
}) {
  const { overallStats } = useProgress();

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-30 h-16 md:h-[72px] shadow-xs">
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 h-full flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Branding & Sidebar Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            aria-label={isDesktopSidebarOpen ? "Hide sidebar (Ctrl+B)" : "Show sidebar (Ctrl+B)"}
            title={isDesktopSidebarOpen ? "Hide sidebar (Ctrl+B)" : "Show sidebar (Ctrl+B)"}
            className={`hidden md:flex items-center justify-center p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDesktopSidebarOpen
                ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-200"
            }`}
          >
            <FiSidebar className="w-5 h-5" />
          </button>

          {/* 48px x 48px application icon */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <FiCode className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight truncate">
              <span className="hidden sm:inline">React + JavaScript Interview Preparation</span>
              <span className="sm:hidden">React + JS Interview</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight mt-0.5 truncate">
              Learn • Revise • Track • Crack It 🚀
            </p>
          </div>
        </div>

        {/* Center: Search Bar in Light Theme */}
        <div className="hidden md:flex items-center justify-center px-2 flex-1 max-w-sm lg:max-w-md mx-auto">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group cursor-pointer"
            title="Search topics across roadmap (Ctrl+K)"
            aria-label="Search topics across roadmap"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FiSearch className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                Search topics across roadmap...
              </span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded flex-shrink-0 ml-2 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Streamlined Header Progress Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-bold text-slate-900">{overallStats.percentage}%</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              ({overallStats.completed}/{overallStats.total})
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
