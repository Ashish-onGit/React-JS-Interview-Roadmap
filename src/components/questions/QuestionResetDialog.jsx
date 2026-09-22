import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { dialogVariants, backdropVariants, buttonTapScale } from "../../utils/motionVariants";

export default function QuestionResetDialog({ isOpen, onClose, onConfirm, topicName }) {
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
          key="question-reset-backdrop"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="question-reset-title"
        >
          <motion.div
            key="question-reset-dialog"
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#303030] p-5 sm:p-6 overflow-hidden"
          >
            <motion.button
              type="button"
              whileTap={buttonTapScale}
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-slate-400 dark:text-[#a3a3a3] hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </motion.button>

            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-amber-50 dark:bg-[#262117] text-amber-600 dark:text-amber-400 rounded-xl flex-shrink-0 border border-amber-200 dark:border-[#3d331e]">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  id="question-reset-title"
                  className="text-base font-bold text-slate-900 dark:text-[#f5f5f5]"
                >
                  Reset Question Progress?
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-[#a3a3a3] leading-relaxed">
                  This will uncheck all completed questions for{" "}
                  <strong className="text-slate-700 dark:text-[#d4d4d4]">{topicName}</strong>.
                </p>
                <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#141414] border border-slate-200/70 dark:border-[#282828] text-[11px] text-slate-500 dark:text-[#888888] space-y-1">
                  <div>✓ Questions will NOT be deleted or regenerated.</div>
                  <div>✓ Roadmap progress will remain unchanged.</div>
                  <div>✓ AI chats and Quick Revision will not be affected.</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2.5 pt-3.5 border-t border-slate-100 dark:border-[#2a2a2a]">
              <motion.button
                type="button"
                whileTap={buttonTapScale}
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#e5e5e5] bg-slate-100 dark:bg-[#262626] hover:bg-slate-200 dark:hover:bg-[#303030] rounded-xl transition-colors cursor-pointer"
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
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Questions
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
