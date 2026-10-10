import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { dialogVariants } from "../../utils/motionVariants";

export default function ExitConfirmDialog({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="exit-interview-title"
            aria-describedby="exit-interview-desc"
            className="relative w-full max-w-md bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#2f2f2f] rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252525] transition-colors"
              aria-label="Close dialog"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  id="exit-interview-title"
                  className="text-lg font-bold text-slate-900 dark:text-[#f5f5f5]"
                >
                  Exit Interview?
                </h3>
                <p
                  id="exit-interview-desc"
                  className="text-sm text-slate-500 dark:text-[#a3a3a3] mt-2 leading-relaxed"
                >
                  Your current interview session is active. If you exit now,
                  uncompleted progress will not be saved. Are you sure you want
                  to exit?
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-[#d4d4d4] bg-slate-100 dark:bg-[#242424] hover:bg-slate-200 dark:hover:bg-[#2e2e2e] transition-colors"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors shadow-xs"
              >
                Exit & Discard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
