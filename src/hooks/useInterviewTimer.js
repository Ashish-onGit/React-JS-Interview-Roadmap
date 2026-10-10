import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for interview countdown timer.
 * Provides formatted mm:ss, subtle warning/critical flags,
 * and handles pause/resume/expiration events.
 */
export function useInterviewTimer(initialMinutes = 30, onExpire) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const timerRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Sync if initialMinutes changes while not running
  useEffect(() => {
    if (!isRunning && !isExpired) {
      setTotalSeconds(initialMinutes * 60);
      setTimeRemaining(initialMinutes * 60);
    }
  }, [initialMinutes, isRunning, isExpired]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsExpired(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (!isExpired && timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [isExpired, timeRemaining]);

  const reset = useCallback((minutes = initialMinutes) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setTimeRemaining(secs);
    setIsRunning(false);
    setIsExpired(false);
  }, [initialMinutes]);

  // Timer interval effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
            setIsExpired(true);
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  const elapsedSeconds = totalSeconds - timeRemaining;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedSecs = elapsedSeconds % 60;
  const formattedElapsed = `${String(elapsedMinutes).padStart(2, "0")}:${String(elapsedSecs).padStart(2, "0")}`;

  const isWarning = timeRemaining <= 300 && timeRemaining > 60; // <= 5 min
  const isCritical = timeRemaining <= 60 && timeRemaining > 0; // <= 1 min

  return {
    timeRemaining,
    formattedTime,
    elapsedSeconds,
    formattedElapsed,
    isRunning,
    isExpired,
    isWarning,
    isCritical,
    start,
    pause,
    resume,
    reset,
  };
}
