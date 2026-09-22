import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRevisionNotes } from "../../hooks/useRevisionNotes";
import RevisionHeader from "./RevisionHeader";
import ConceptTable from "./ConceptTable";
import OneLineRevision from "./OneLineRevision";
import ImportantConcepts from "./ImportantConcepts";
import MemoryTricks from "./MemoryTricks";
import ComparisonTable from "./ComparisonTable";
import InterviewReady from "./InterviewReady";
import KeyTakeaways from "./KeyTakeaways";
import RevisionSkeleton from "./RevisionSkeleton";
import RevisionError from "./RevisionError";

export default function QuickRevision({ currentSection, currentCategory }) {
  const {
    revisionData,
    isLoading,
    isRegenerating,
    error,
    regenerate,
    retry
  } = useRevisionNotes({
    categoryId: currentCategory?.id,
    sectionId: currentSection?.id,
    categoryTitle: currentCategory?.title,
    sectionNumber: currentSection?.number,
    sectionTitle: currentSection?.title,
    topics: currentSection?.topics || []
  });

  return (
    <motion.aside
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="w-full bg-white dark:bg-[#171717] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] shadow-sm p-4 sm:p-5 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto transition-colors"
      aria-label="Quick Revision Sheet"
    >
      <RevisionHeader
        onRegenerate={regenerate}
        isRegenerating={isRegenerating}
        disabled={isLoading}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <RevisionSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <RevisionError error={error} onRetry={retry} />
          </motion.div>
        ) : revisionData ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 1. Concept Cheat Sheet Table */}
            <ConceptTable items={revisionData.conceptTable} />

            {/* 2. One-line Revision */}
            <OneLineRevision items={revisionData.oneLineRevision} />

            {/* 3. Important Concepts */}
            <ImportantConcepts items={revisionData.importantConcepts} />

            {/* 4. Memory Tricks */}
            <MemoryTricks items={revisionData.memoryTricks} />

            {/* 5. Comparisons (if applicable) */}
            <ComparisonTable tables={revisionData.comparisonTables} />

            {/* 6. Interview Ready */}
            <InterviewReady items={revisionData.commonInterviewQuestions} />

            {/* 7. Key Takeaways */}
            <KeyTakeaways items={revisionData.keyTakeaways} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.aside>
  );
}
