/**
 * Storage utility for persisting user theme preference.
 * Uses dedicated key 'react-js-theme' to ensure full isolation from
 * roadmap progress ('react-js-interview-progress') and AI chats ('react-js-ai-chats').
 */

export const THEME_STORAGE_KEY = "react-js-theme";

/**
 * Returns saved theme preference ("light" | "dark") or null if none saved.
 */
export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return null;
  } catch (err) {
    console.warn("Unable to access localStorage for theme:", err);
    return null;
  }
}

/**
 * Persists theme preference ("light" | "dark") to localStorage.
 */
export function saveTheme(theme) {
  try {
    if (theme === "light" || theme === "dark") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch (err) {
    console.warn("Unable to save theme to localStorage:", err);
  }
}

/**
 * Returns system color scheme preference ("dark" | "light").
 */
export function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}
