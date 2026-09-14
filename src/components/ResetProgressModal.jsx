import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { dialogVariants, backdropVariants, buttonTapScale } from "../utils/motionVariants";

export default function ResetProgressModal({ isOpen, onClose, onConfirm }) {
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
        <motion.div
          key="reset-backdrop"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <motion.div
            key="reset-dialog"
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#303030] p-6 overflow-hidden"
          >
            <motion.button
              whileTap={buttonTapScale}
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </motion.button>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-50 dark:bg-[#262626] text-red-600 dark:text-red-400 rounded-xl flex-shrink-0 border border-red-100 dark:border-[#333333]">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="reset-modal-title" className="text-lg font-bold text-slate-900 dark:text-[#f5f5f5]">
                  Reset All Progress?
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-[#a3a3a3] leading-relaxed">
                  Are you sure you want to reset all progress? This will uncheck all completed topics and return your overall progress to 0%. The roadmap content will remain intact.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-[#2a2a2a]">
              <motion.button
                type="button"
                whileTap={buttonTapScale}
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-[#e5e5e5] bg-slate-100 dark:bg-[#262626] hover:bg-slate-200 dark:hover:bg-[#303030] border border-transparent dark:border-[#333333] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileTap={buttonTapScale}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Progress
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
