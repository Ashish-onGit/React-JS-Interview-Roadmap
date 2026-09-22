const REVISION_STORAGE_KEY = "react-js-ai-revision-notes";

/**
 * Deterministically generates a stable revision cache key for a section.
 */
export function getRevisionStorageKey(categoryId, sectionId) {
  const cleanCat = String(categoryId || "").trim();
  const cleanSec = String(sectionId || "").trim();
  return `${cleanCat}/${cleanSec}`;
}

/**
 * Safely parses the entire revision dictionary from localStorage.
 */
function getRevisionsMap() {
  try {
    const raw = localStorage.getItem(REVISION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.error("Failed to read revision notes from localStorage:", err);
    return {};
  }
}

/**
 * Safely writes the revisions dictionary to localStorage.
 */
function setRevisionsMap(map) {
  try {
    localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch (err) {
    console.error("Failed to save revision notes to localStorage:", err);
    if (err.name === "QuotaExceededError" || err.code === 22) {
      console.warn("Storage quota exceeded for revision notes. Evicting oldest entries.");
      try {
        const entries = Object.entries(map);
        // Sort by generatedAt ascending and remove oldest 3
        entries.sort((a, b) => (a[1]?.generatedAt || 0) - (b[1]?.generatedAt || 0));
        const pruned = Object.fromEntries(entries.slice(3));
        localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(pruned));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Retrieves a cached revision note by key.
 */
export function getRevisionNote(key) {
  if (!key) return null;
  const map = getRevisionsMap();
  return map[key] || null;
}

/**
 * Saves a revision note to the cache.
 */
export function saveRevisionNote(key, content, metadata = {}) {
  if (!key || !content) return false;
  const map = getRevisionsMap();
  map[key] = {
    topicId: key,
    generatedAt: Date.now(),
    content,
    ...metadata
  };
  return setRevisionsMap(map);
}

/**
 * Removes a specific revision note from the cache.
 */
export function clearRevisionNote(key) {
  if (!key) return false;
  const map = getRevisionsMap();
  if (map[key]) {
    delete map[key];
    return setRevisionsMap(map);
  }
  return false;
}
