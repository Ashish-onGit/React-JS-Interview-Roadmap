import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for Speech Synthesis (Text-to-Speech) using the Web Speech API.
 * Provides controls for speaking, pausing, resuming, replaying, and tracking speaking status.
 */
export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [error, setError] = useState(null);

  const utteranceRef = useRef(null);
  const onEndCallbackRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      // Pre-load voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const stop = useCallback(() => {
    onEndCallbackRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const speak = useCallback(
    (text, onEnd) => {
      if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onEnd) onEnd();
        return;
      }

      setError(null);
      onEndCallbackRef.current = null;

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }

      // Small 50ms tick to allow Chromium's cancel to flush cleanly
      setTimeout(() => {
        try {
          // Clean markdown backticks/bullets so speech sounds natural
          const cleanedText = text
            .replace(/```[\s\S]*?```/g, "Code example omitted.")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/[*_#]/g, "")
            .trim();

          const utterance = new SpeechSynthesisUtterance(cleanedText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.lang = "en-US";

          // Try to select a natural English voice if available
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Google") ||
                v.name.includes("Natural") ||
                v.name.includes("Samantha") ||
                v.name.includes("David") ||
                v.name.includes("Zira"))
          ) || voices.find((v) => v.lang.startsWith("en"));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          onEndCallbackRef.current = onEnd;

          utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
            setCurrentText(text);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (onEndCallbackRef.current) {
              const cb = onEndCallbackRef.current;
              onEndCallbackRef.current = null;
              cb();
            }
          };

          utterance.onerror = (e) => {
            // If cancelled manually or interrupted, don't treat as natural error or end
            if (e.error !== "canceled" && e.error !== "interrupted") {
              setError(`Speech synthesis error: ${e.error}`);
              if (onEndCallbackRef.current) {
                const cb = onEndCallbackRef.current;
                onEndCallbackRef.current = null;
                cb();
              }
            }
            setIsSpeaking(false);
            setIsPaused(false);
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("Speech synthesis failure:", err);
          setError("Speech synthesis failed to start.");
          setIsSpeaking(false);
          if (onEnd) onEnd();
        }
      }, 50);
    },
    []
  );

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const replay = useCallback(() => {
    if (currentText) {
      speak(currentText);
    }
  }, [currentText, speak]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    currentText,
    speak,
    stop,
    pause,
    resume,
    replay,
    error,
  };
}
