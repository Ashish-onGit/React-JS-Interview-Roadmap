import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarContent from "./SidebarContent";
import { drawerVariants, backdropVariants } from "../utils/motionVariants";

export default function MobileSidebar({ isOpen, onClose, onOpenSearch, onOpenResetModal }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            key="mobile-sidebar-backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <motion.div
            key="mobile-sidebar-drawer"
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-4/5 max-w-xs bg-white dark:bg-[#141414] border-r border-slate-200 dark:border-[#292929] h-full shadow-2xl flex flex-col z-10"
          >
            <div className="flex-1 overflow-hidden">
              <SidebarContent
                onOpenSearch={() => {
                  onClose();
                  onOpenSearch();
                }}
                onOpenResetModal={() => {
                  onClose();
                  onOpenResetModal();
                }}
                onItemClick={onClose}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
