import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for Speech-to-Text using the browser Web Speech API.
 * Provides progressive transcript, recording duration timer,
 * reliable status tracking, and comprehensive error handling.
 */
export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const isManuallyStoppedRef = useRef(false);

  // Check browser Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  // Format elapsed seconds into mm:ss
  const formattedDuration = `${String(Math.floor(recordingDuration / 60)).padStart(2, "0")}:${String(recordingDuration % 60).padStart(2, "0")}`;

  // Stop recording and cleanup
  const stopRecording = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors if already stopped
      }
    }

    setIsRecording(false);
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    setError(null);
    isManuallyStoppedRef.current = false;

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. You can type your answer manually below."
      );
      return;
    }

    // Stop existing instance if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      // Seed final transcript from current text if user is continuing to speak
      finalTranscriptRef.current = transcript ? transcript.trim() + " " : "";

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
        setRecordingDuration(0);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            finalTranscriptRef.current += text + " ";
          } else {
            interimTranscript += text;
          }
        }

        const combined = (finalTranscriptRef.current + interimTranscript).trim();
        setTranscript(combined);
      };

      recognition.onerror = (event) => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);

        const errType = event.error;
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          setError(
            "Microphone access was denied. Please allow microphone permission in your browser settings or type your answer manually."
          );
        } else if (errType === "no-speech") {
          // If no speech, keep existing text and notify user gently
          if (!isManuallyStoppedRef.current) {
            setError("No speech was detected. Please speak closer to your microphone or type your answer.");
          }
        } else if (errType === "audio-capture") {
          setError("No microphone was detected. Please connect a microphone or type your answer.");
        } else if (errType === "network") {
          setError("Speech service network error. Please check your connection or type your answer.");
        } else if (errType !== "aborted") {
          setError(`Speech recognition error (${errType}). You can continue by typing manually.`);
        }
      };

      recognition.onend = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsRecording(false);
      setError("Unable to start microphone. Please check permissions or type your answer manually.");
    }
  }, [transcript]);

  // Reset transcript and state
  const resetTranscript = useCallback(() => {
    stopRecording();
    setTranscript("");
    finalTranscriptRef.current = "";
    setRecordingDuration(0);
    setError(null);
  }, [stopRecording]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isSupported,
    isRecording,
    transcript,
    setTranscript,
    recordingDuration,
    formattedDuration,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    clearError
  };
}
