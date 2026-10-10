/**
 * Storage utility for AI Interview sessions.
 * Strictly persists only textual interview transcripts and metadata.
 * NEVER stores raw audio or voice recordings.
 */

const STORAGE_KEY = "react-js-ai-interview-history";
const DRAFT_KEY = "react-js-ai-interview-draft-resume";

export function getInterviewHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read interview history from localStorage:", err);
    return [];
  }
}

export function saveInterview(interviewData) {
  try {
    const history = getInterviewHistory();
    const newRecord = {
      id: interviewData.id || `interview-${Date.now()}`,
      createdAt: interviewData.createdAt || new Date().toISOString(),
      durationSeconds: interviewData.durationSeconds || 0,
      interviewStyle: interviewData.interviewStyle || "Technical Interview",
      candidateProfile: interviewData.candidateProfile || null,
      questionsCount: interviewData.questions?.length || 0,
      questions: interviewData.questions || [],
      scores: interviewData.scores || null,
      overallScore: interviewData.overallScore || 0,
      summary: interviewData.summary || ""
    };

    // Prepend new record, keep up to 25 items
    const updated = [newRecord, ...history.filter((h) => h.id !== newRecord.id)].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error("Failed to save interview to localStorage:", err);
    return null;
  }
}

export function deleteInterview(id) {
  try {
    const history = getInterviewHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error("Failed to delete interview from localStorage:", err);
    return false;
  }
}

export function clearAllInterviews() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error("Failed to clear interview history:", err);
    return false;
  }
}

export function getSavedResumeDraft() {
  try {
    return localStorage.getItem(DRAFT_KEY) || "";
  } catch {
    return "";
  }
}

export function saveResumeDraft(text) {
  try {
    if (!text) {
      localStorage.removeItem(DRAFT_KEY);
    } else {
      localStorage.setItem(DRAFT_KEY, text);
    }
  } catch {
    // ignore
  }
}

// Aliases for seamless naming compatibility
export const getSavedInterviews = getInterviewHistory;
export const saveInterviewSession = saveInterview;
export const deleteInterviewSession = deleteInterview;
export const getStoredResumeDraft = getSavedResumeDraft;

