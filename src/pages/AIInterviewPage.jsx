import React, { useState } from "react";
import InterviewSetup from "../components/ai-interview/InterviewSetup";
import ResumeAnalysis from "../components/ai-interview/ResumeAnalysis";
import InterviewConfiguration from "../components/ai-interview/InterviewConfiguration";
import InterviewRoom from "../components/ai-interview/InterviewRoom";
import InterviewCompletion from "../components/ai-interview/InterviewCompletion";
import InterviewHistoryModal from "../components/ai-interview/InterviewHistoryModal";
import {
  analyzeResume,
  generateFirstQuestion,
} from "../services/interviewService";
import {
  saveInterviewSession,
  getSavedInterviews,
} from "../services/interviewStorage";

export default function AIInterviewPage() {
  // State machine: "setup" | "analyzing" | "configuring" | "in-progress" | "completed"
  const [stage, setStage] = useState("setup");

  const [resumeText, setResumeText] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [configuration, setConfiguration] = useState({
    duration: 30,
    style: "Technical Interview",
  });
  const [firstQuestionData, setFirstQuestionData] = useState(null);
  const [completionData, setCompletionData] = useState(null);

  // History modal
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedInterviews, setSavedInterviews] = useState(() => getSavedInterviews());

  const refreshHistory = () => {
    setSavedInterviews(getSavedInterviews());
  };

  // Step 1: User submits resume to analyze
  const handleAnalyzeAndStart = async (text) => {
    setResumeText(text);
    setStage("analyzing");

    try {
      const data = await analyzeResume(text);
      setAnalysisData(data);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      // Fallback data
      setAnalysisData({
        role: "Frontend / Full Stack Developer",
        experienceYears: "2+ years",
        summary: "Experience across modern React and web application architecture.",
        topics: ["JavaScript", "React", "State Management", "Performance", "APIs"],
      });
    }
  };

  // Step 2: Analysis animation completes
  const handleAnalysisAnimationComplete = () => {
    setStage("configuring");
  };

  // Step 3: User configures duration & style, clicks "Start Interview"
  const handleStartInterview = async (config) => {
    setConfiguration(config);

    // Warm up speech synthesis on direct user interaction click
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
        const dummy = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(dummy);
      } catch {
        // ignore
      }
    }

    try {
      const firstQ = await generateFirstQuestion({
        resumeContext: resumeText,
        interviewType: config.style,
        difficultyLevel: config.difficultyLevel || 3,
      });
      setFirstQuestionData(firstQ);
    } catch {
      setFirstQuestionData({
        greeting: "Hi! I've reviewed your experience. Let's begin the technical interview.",
        question: "Can you explain what the event loop in JavaScript is and how it works?",
        topic: "JavaScript Runtime",
      });
    }

    setStage("in-progress");
  };

  // Step 4: Interview completed
  const handleInterviewComplete = (completedPayload) => {
    setCompletionData(completedPayload);
    setStage("completed");
  };

  // Step 5: Save interview to localStorage
  const handleSaveInterview = () => {
    if (!completionData) return;

    saveInterviewSession({
      duration: configuration.duration,
      durationFormatted: completionData.durationFormatted,
      interviewType: configuration.style,
      difficultyLevel: configuration.difficultyLevel || 3,
      resumeContext: resumeText.slice(0, 500),
      questions: completionData.qaHistory || [],
      summary: completionData.feedback,
      scores: completionData.scores,
    });

    refreshHistory();
  };

  // Discard & return to setup
  const handleDiscard = () => {
    setStage("setup");
    setCompletionData(null);
  };

  // Exit in-progress interview
  const handleExitInterview = () => {
    setStage("setup");
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)]">
      {/* 1. Setup Stage */}
      {stage === "setup" && (
        <InterviewSetup
          onAnalyzeAndStart={handleAnalyzeAndStart}
          onOpenHistory={() => {
            refreshHistory();
            setIsHistoryOpen(true);
          }}
        />
      )}

      {/* 2. Analyzing Stage */}
      {stage === "analyzing" && (
        <ResumeAnalysis onComplete={handleAnalysisAnimationComplete} />
      )}

      {/* 3. Configuring Stage */}
      {stage === "configuring" && (
        <InterviewConfiguration
          analysisData={analysisData}
          onStart={handleStartInterview}
          onBack={() => setStage("setup")}
        />
      )}

      {/* 4. In Progress Interview Room */}
      {stage === "in-progress" && (
        <InterviewRoom
          resumeText={resumeText}
          analysisData={analysisData}
          configuration={configuration}
          firstQuestionData={firstQuestionData}
          onComplete={handleInterviewComplete}
          onExit={handleExitInterview}
        />
      )}

      {/* 5. Completion Scorecard */}
      {stage === "completed" && (
        <InterviewCompletion
          completionData={completionData}
          onSave={handleSaveInterview}
          onDiscard={handleDiscard}
          onRestart={() => setStage("setup")}
        />
      )}

      {/* Saved Interviews Modal */}
      <InterviewHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        interviews={savedInterviews}
        onRefresh={refreshHistory}
      />
    </div>
  );
}
