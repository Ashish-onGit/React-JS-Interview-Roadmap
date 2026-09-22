import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSidebar } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import SearchModal from "../components/SearchModal";
import ResetProgressModal from "../components/ResetProgressModal";
import AIAssistantModal from "../components/ai/AIAssistantModal";
import AIMinimizedPill from "../components/ai/AIMinimizedPill";
import InterviewQuestionsModal from "../components/questions/InterviewQuestionsModal";
import { useProgress } from "../hooks/useProgress";
import { useAIAssistant } from "../context/AIContext";
import { pageVariants } from "../utils/motionVariants";

const SIDEBAR_PREF_KEY = "react-js-interview-sidebar-open";

export default function MainLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_PREF_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const { resetAllProgress } = useProgress();
  const { isMinimized } = useAIAssistant();

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_PREF_KEY, JSON.stringify(next));
      } catch {
        // ignore localStorage errors
      }
      return next;
    });
  };

  // Keyboard shortcuts:
  // - Ctrl + K / Cmd + K: Search
  // - Ctrl + B / Cmd + B: Toggle Desktop Sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleDesktopSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f0f0f] text-slate-800 dark:text-[#f5f5f5] transition-colors duration-150">
      {/* Top Header */}
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        onToggleDesktopSidebar={toggleDesktopSidebar}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Two-Column Body */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Desktop Left Sidebar */}
        <Sidebar
          isOpen={isDesktopSidebarOpen}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenResetModal={() => setIsResetModalOpen(true)}
          onCollapse={() => {
            setIsDesktopSidebarOpen(false);
            try {
              localStorage.setItem(SIDEBAR_PREF_KEY, JSON.stringify(false));
            } catch {
              // ignore
            }
          }}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 ${
            isMinimized ? "pb-44 sm:pb-48 md:pb-12" : "pb-28 sm:pb-32 md:pb-8"
          } transition-all duration-200 ${
            isDesktopSidebarOpen ? "max-w-5xl xl:max-w-7xl 2xl:max-w-[1550px]" : "max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px] mx-auto"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Mobile Bottom Navigation to Switch Between Topics */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      <ResetProgressModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetAllProgress}
      />

      {/* Desktop Floating Minimized AI Pill */}
      <AIMinimizedPill variant="floating" />

      {/* AI Assistant Learning Modal */}
      <AIAssistantModal />

      {/* Interview Questions Practice Modal */}
      <InterviewQuestionsModal />
    </div>
  );
}
