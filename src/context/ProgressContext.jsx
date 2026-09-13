import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { getProgress, saveProgress, clearProgress } from "../utils/storage";
import { ROADMAP_DATA, getSectionItemIds, getCategoryItemIds, getTotalRoadmapItemIds } from "../data/roadmap";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [completedMap, setCompletedMap] = useState(() => getProgress());

  // Listen to storage events across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "react-js-interview-progress") {
        setCompletedMap(getProgress());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isCompleted = useCallback((id) => {
    return Boolean(completedMap[id]);
  }, [completedMap]);

  const toggleItem = useCallback((id) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      saveProgress(next);
      return next;
    });
  }, []);

  // For topics that contain subtopics: toggle all child subtopics together
  const toggleTopicWithSubtopics = useCallback((subtopicIds) => {
    setCompletedMap((prev) => {
      const allCompleted = subtopicIds.every((id) => Boolean(prev[id]));
      const next = { ...prev };
      if (allCompleted) {
        subtopicIds.forEach((id) => {
          delete next[id];
        });
      } else {
        subtopicIds.forEach((id) => {
          next[id] = true;
        });
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    clearProgress();
    setCompletedMap({});
  }, []);

  // Calculate stats dynamically
  const overallStats = useMemo(() => {
    const totalIds = getTotalRoadmapItemIds();
    const total = totalIds.length;
    const completed = totalIds.filter((id) => Boolean(completedMap[id])).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [completedMap]);

  const getCategoryStats = useCallback((category) => {
    const ids = getCategoryItemIds(category);
    const total = ids.length;
    const completed = ids.filter((id) => Boolean(completedMap[id])).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [completedMap]);

  const getSectionStats = useCallback((section) => {
    const ids = getSectionItemIds(section);
    const total = ids.length;
    const completed = ids.filter((id) => Boolean(completedMap[id])).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    let status = "not-started";
    if (completed === total && total > 0) {
      status = "completed";
    } else if (completed > 0) {
      status = "in-progress";
    }
    
    return { completed, total, percentage, status };
  }, [completedMap]);

  const value = useMemo(() => ({
    completedMap,
    isCompleted,
    toggleItem,
    toggleTopicWithSubtopics,
    resetAllProgress,
    overallStats,
    getCategoryStats,
    getSectionStats
  }), [
    completedMap,
    isCompleted,
    toggleItem,
    toggleTopicWithSubtopics,
    resetAllProgress,
    overallStats,
    getCategoryStats,
    getSectionStats
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
