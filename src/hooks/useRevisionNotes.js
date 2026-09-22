import { useState, useEffect, useCallback, useRef } from "react";
import {
  getRevisionStorageKey,
  getRevisionNote,
  saveRevisionNote
} from "../utils/revisionStorage";
import { generateRevisionNotes } from "../services/revisionService";

export function useRevisionNotes({
  categoryId,
  sectionId,
  categoryTitle,
  sectionNumber,
  sectionTitle,
  topics = []
}) {
  const [revisionData, setRevisionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);

  // Active request tracking to ignore stale responses when navigating between sections
  const activeKeyRef = useRef("");

  const currentKey = getRevisionStorageKey(categoryId, sectionId);

  /**
   * Fetches or generates revision notes
   */
  const loadRevision = useCallback(
    async (forceRegenerate = false) => {
      if (!categoryId || !sectionId) return;

      activeKeyRef.current = currentKey;

      // 1. If not forcing regenerate, check localStorage cache first
      if (!forceRegenerate) {
        const cached = getRevisionNote(currentKey);
        if (cached && cached.content) {
          setRevisionData(cached.content);
          setIsLoading(false);
          setIsRegenerating(false);
          setError(null);
          return;
        }
      }

      // 2. Set loading states
      if (forceRegenerate) {
        setIsRegenerating(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await generateRevisionNotes({
          categoryTitle,
          sectionNumber,
          sectionTitle,
          topics
        });

        // Ensure this request matches the currently active section
        if (activeKeyRef.current === currentKey) {
          saveRevisionNote(currentKey, result, {
            sectionTitle,
            sectionNumber,
            categoryId
          });
          setRevisionData(result);
          setError(null);
        }
      } catch (err) {
        if (activeKeyRef.current === currentKey) {
          console.error("Revision notes generation error:", err);
          setError(err.message || "Quick revision generate nahi ho paaya.");
        }
      } finally {
        if (activeKeyRef.current === currentKey) {
          setIsLoading(false);
          setIsRegenerating(false);
        }
      }
    },
    [categoryId, sectionId, currentKey, categoryTitle, sectionNumber, sectionTitle, topics]
  );

  // Automatic load on section change
  useEffect(() => {
    loadRevision(false);
  }, [loadRevision]);

  const regenerate = useCallback(() => {
    return loadRevision(true);
  }, [loadRevision]);

  const retry = useCallback(() => {
    return loadRevision(false);
  }, [loadRevision]);

  return {
    revisionData,
    isLoading,
    isRegenerating,
    error,
    regenerate,
    retry
  };
}
