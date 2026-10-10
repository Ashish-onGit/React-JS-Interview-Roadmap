import React, { useState, useEffect, useMemo } from "react";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { motion } from "framer-motion";

export default function VoiceQuestion({
  questionText,
  isSpeaking = false,
  onPlay,
  onStop,
  onReplay,
}) {
  // Estimate duration based on word count (~130 words per minute)
  const estimatedDuration = useMemo(() => {
    if (!questionText) return 12;
    const words = questionText.trim().split(/\s+/).length;
    return Math.max(6, Math.round((words / 130) * 60));
  }, [questionText]);

  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Track playback time during speech
  useEffect(() => {
    let interval = null;
    if (isSpeaking) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= estimatedDuration) return estimatedDuration;
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking, estimatedDuration]);

  const formatSecs = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-indigo-950/20 dark:bg-indigo-950/30 border border-indigo-500/20 dark:border-indigo-500/30 shadow-xs transition-all">
      {/* Voice Player Bar */}
      <div className="px-4 py-3 bg-indigo-600/10 dark:bg-indigo-600/20 border-b border-indigo-500/20 flex items-center justify-between gap-3">
        {/* Left: Wave & Play/Stop controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={isSpeaking ? onStop : onPlay}
            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xs transition-colors flex-shrink-0 cursor-pointer"
            title={isSpeaking ? "Pause voice" : "Listen to question"}
            aria-label={isSpeaking ? "Pause voice" : "Listen to question"}
          >
            {isSpeaking ? (
              <FiPause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <FiPlay className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Realistic Calm Soundwave Bars */}
          <div className="flex items-center gap-1 h-5 px-1">
            {[0.35, 0.7, 1.1, 0.6, 1.3, 0.9, 0.5, 1.2, 0.8, 1.1, 0.6, 0.4].map((heightScale, idx) => (
              <motion.span
                key={idx}
                className={`w-1 rounded-full inline-block ${
                  isSpeaking
                    ? "bg-gradient-to-t from-indigo-500 to-emerald-400"
                    : "bg-indigo-500/40 dark:bg-indigo-400/40"
                }`}
                animate={
                  isSpeaking
                    ? {
                        scaleY: [heightScale * 0.3, heightScale * 1.3, heightScale * 0.3],
                        opacity: [0.6, 1, 0.6],
                      }
                    : { scaleY: 0.35, opacity: 0.4 }
                }
                transition={{
                  duration: 0.8,
                  repeat: isSpeaking ? Infinity : 0,
                  delay: idx * 0.07,
                  ease: "easeInOut",
                }}
                style={{ height: "16px", transformOrigin: "center" }}
              />
            ))}
          </div>

          {/* Time indicator */}
          <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300">
            {formatSecs(playbackSeconds)} / {formatSecs(estimatedDuration)}
          </span>
        </div>

        {/* Right: Replay and Status */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Speaking...
            </span>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
            title="Replay question"
            aria-label="Replay question"
          >
            <FiRotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Text in Player */}
      <div className="p-4 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
        {questionText}
      </div>
    </div>
  );
}
