import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import SearchModal from "../components/SearchModal";
import ResetProgressModal from "../components/ResetProgressModal";
import AIAssistantModal from "../components/ai/AIAssistantModal";
import { useProgress } from "../hooks/useProgress";

const SIDEBAR_PREF_KEY = "react-js-interview-sidebar-open";

export default function MainLayout() {
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navy Header */}
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
          className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 transition-all duration-200 ${
            isDesktopSidebarOpen ? "max-w-5xl" : "max-w-6xl mx-auto"
          }`}
        >
          <Outlet />
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

      {/* AI Assistant Learning Modal */}
      <AIAssistantModal />
    </div>
  );
}
