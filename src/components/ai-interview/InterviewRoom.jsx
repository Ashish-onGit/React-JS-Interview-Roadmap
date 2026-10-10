import React, { useState, useEffect, useRef, useCallback } from "react";
import InterviewHeader from "./InterviewHeader";
import InterviewSidebar from "./InterviewSidebar";
import AIMessage from "./AIMessage";
import CandidateMessage from "./CandidateMessage";
import AnswerBar from "./AnswerBar";
import ExitConfirmDialog from "./ExitConfirmDialog";
import CodeEditor, { DEFAULT_REACT_CODE } from "./CodeEditor";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { useInterviewTimer } from "../../hooks/useInterviewTimer";
import {
  evaluateAnswerAndGetNext,
  generateInterviewSummary,
} from "../../services/interviewService";

export default function InterviewRoom({
  resumeText,
  analysisData,
  configuration,
  firstQuestionData,
  onComplete,
  onExit,
}) {
  const { duration = 30, style = "Technical Interview" } = configuration || {};

  // Messages in conversation
  const [messages, setMessages] = useState(() => {
    const initialAIMessage = {
      id: "ai-msg-0",
      type: "ai",
      text: firstQuestionData?.greeting || "Hi! I've reviewed your resume. Let's begin the interview with a technical question based on your experience.",
      question: firstQuestionData?.question || "Can you explain what the event loop in JavaScript is and how it works?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    return [initialAIMessage];
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = 6;
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState("ai-msg-0");
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState(DEFAULT_REACT_CODE);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(520);
  const lastDraftRef = useRef(null);

  // Q&A history records for final evaluation
  const qaHistoryRef = useRef([
    {
      id: "q_1",
      question: firstQuestionData?.question || "Can you explain what the event loop in JavaScript is and how it works?",
      topic: firstQuestionData?.topic || "Core JavaScript",
      answer: null,
    },
  ]);
  const chatScrollContainerRef = useRef(null);

  // Voice synthesis (Text-to-Speech)
  const {
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  // Voice recognition (Speech-to-Text)
  const {
    isRecording,
    transcript,
    formattedDuration,
    startRecording,
    stopRecording,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // Finish Interview Routine
  const finishInterview = useCallback(async (finalNote, elapsed) => {
    stopSpeaking();
    stopRecording();
    setIsEvaluating(true);

    try {
      const summaryResult = await generateInterviewSummary({
        history: qaHistoryRef.current,
        resumeContext: resumeText,
        interviewType: style,
        durationFormatted: elapsed || "30:00",
      });

      setIsEvaluating(false);

      onComplete({
        durationFormatted: elapsed || "30:00",
        totalQuestions: qaHistoryRef.current.length,
        followUpsCount: Math.max(1, Math.floor(qaHistoryRef.current.length / 3)),
        feedback: summaryResult.overallFeedback || finalNote,
        scores: summaryResult.scores || {
          technicalKnowledge: 85,
          communication: 80,
          problemSolving: 82,
          depthOfAnswers: 84,
        },
        qaHistory: qaHistoryRef.current,
        difficultyLevel: configuration?.difficultyLevel || 3,
        interviewStyle: style,
      });
    } catch {
      setIsEvaluating(false);
      const skippedCount = qaHistoryRef.current.filter((q) => q.skipped || q.evaluation?.skipped).length;
      const penalty = skippedCount * 18;

      onComplete({
        durationFormatted: elapsed || "30:00",
        totalQuestions: qaHistoryRef.current.length,
        followUpsCount: 2,
        feedback: skippedCount > 0
          ? `Completed session with ${skippedCount} question(s) skipped (points penalized).`
          : (finalNote || "Strong technical foundation and clear communication."),
        scores: {
          technicalKnowledge: Math.max(20, 84 - penalty),
          communication: Math.max(30, 82 - skippedCount * 6),
          problemSolving: Math.max(20, 80 - penalty),
          depthOfAnswers: Math.max(20, 83 - penalty),
        },
        qaHistory: qaHistoryRef.current,
        difficultyLevel: configuration?.difficultyLevel || 3,
        interviewStyle: style,
      });
    }
  }, [configuration?.difficultyLevel, onComplete, resumeText, stopRecording, stopSpeaking, style]);

  // Interview timer callback
  const handleTimerExpire = useCallback(() => {
    finishInterview("Time limit reached for this session.");
  }, [finishInterview]);

  const {
    formattedTime,
    formattedElapsed,
    isWarning,
    isCritical,
    start: startTimer,
    pause: pauseTimer,
  } = useInterviewTimer(duration, handleTimerExpire);

  // Auto-scroll chat smoothly on messages change
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isRecording, transcript, isEvaluating]);

  // Initial mount: start timer and speak first question
  useEffect(() => {
    startTimer();

    const firstMsg = messages[0];
    if (firstMsg) {
      setActiveSpeakingId(firstMsg.id);
      const textToSpeak = `${firstMsg.text}. ${firstMsg.question}`;

      const timerId = setTimeout(() => {
        speak(textToSpeak, () => {
          setActiveSpeakingId(null);
        });
      }, 200);

      return () => {
        clearTimeout(timerId);
        stopSpeaking();
        stopRecording();
      };
    }
  }, []);

  // Voice play/stop handlers
  const handlePlayVoice = (msgId, questionText) => {
    stopRecording(); // stop candidate mic if running
    setActiveSpeakingId(msgId);
    speak(questionText, () => {
      setActiveSpeakingId(null);
    });
  };

  const handleStopVoice = () => {
    stopSpeaking();
    setActiveSpeakingId(null);
  };

  const handleReplayVoice = (msgId, questionText) => {
    handlePlayVoice(msgId, questionText);
  };

  // Retry failed submission
  const handleRetrySubmission = () => {
    if (lastDraftRef.current) {
      setApiError(null);
      handleSubmitAnswer(lastDraftRef.current);
    }
  };

  // Submit Candidate Answer or Intent Request
  const handleSubmitAnswer = async ({ text, code, intent = "ANSWER" }) => {
    if (isEvaluating) return;

    stopSpeaking();
    stopRecording();
    setApiError(null);
    lastDraftRef.current = { text, code, intent };

    let answerContent = "";
    if (text && text.trim()) {
      answerContent += text.trim();
    }
    if (code && code.trim()) {
      if (answerContent) answerContent += "\n\n";
      answerContent += `\`\`\`javascript\n${code.trim()}\n\`\`\``;
    }
    if (!answerContent) {
      answerContent = "No answer given.";
    }

    // Append Candidate Message with Intent
    const candidateMsg = {
      id: `user-msg-${Date.now()}`,
      type: "user",
      text: text || null,
      code: code || null,
      intent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, candidateMsg]);
    resetTranscript();

    const currentRecord = qaHistoryRef.current[qaHistoryRef.current.length - 1];
    const currentQId = currentRecord?.id || `q_${currentQuestionIndex + 1}`;

    setIsEvaluating(true);

    try {
      // Evaluate answer or process intent
      const result = await evaluateAnswerAndGetNext({
        currentQuestion: currentRecord?.question || "Previous question",
        currentQuestionId: currentQId,
        candidateAnswer: answerContent,
        codeSnippet: code || null,
        resumeContext: resumeText,
        interviewType: style,
        difficultyLevel: configuration?.difficultyLevel || 3,
        questionIndex: currentQuestionIndex + 1,
        totalQuestions: totalQuestions,
        conversationHistory: qaHistoryRef.current,
        history: qaHistoryRef.current,
      });

      setIsEvaluating(false);

      if (result.isCompleted || result.nextAction === "FINISH_INTERVIEW") {
        pauseTimer();
        await finishInterview(result.feedback, formattedElapsed);
        return;
      }

      if (result.nextAction === "KEEP_CURRENT_QUESTION") {
        // Question index strictly does NOT increment
        const newAiMessage = {
          id: `ai-msg-${Date.now()}`,
          type: "ai",
          intent: result.intent,
          text: result.feedback,
          question: currentRecord?.question || null,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newAiMessage]);

        // Keep current question open without saving as completed answer
        if (currentRecord) {
          currentRecord.answer = null;
        }

        setActiveSpeakingId(newAiMessage.id);
        speak(result.feedback, () => {
          setActiveSpeakingId(null);
        });
      } else if (result.nextAction === "WAIT_FOR_CANDIDATE") {
        // Follow-up question or retry on the same question
        const newAiMessage = {
          id: `ai-msg-${Date.now()}`,
          type: "ai",
          intent: result.intent,
          isFollowUp: true,
          text: result.feedback,
          question: currentRecord?.question || null,
          evaluation: result.evaluation,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newAiMessage]);

        if (currentRecord) {
          currentRecord.answer = answerContent;
          currentRecord.evaluation = result.evaluation;
        }

        setActiveSpeakingId(newAiMessage.id);
        speak(result.feedback, () => {
          setActiveSpeakingId(null);
        });
      } else {
        // NEXT_QUESTION: advance to next question
        setCurrentQuestionIndex((prev) => prev + 1);

        const isSkipped = result.intent === "SKIP_REQUEST" || result.isSkip;

        if (currentRecord) {
          currentRecord.answer = answerContent;
          currentRecord.skipped = isSkipped;
          currentRecord.evaluation = result.evaluation || (isSkipped ? {
            score: 0,
            maxScore: 10,
            feedback: "Question skipped by candidate (-points penalty).",
            skipped: true,
          } : null);
        }

        qaHistoryRef.current.push({
          id: result.nextQuestionObj?.id || `q_${currentQuestionIndex + 2}`,
          question: result.nextQuestion,
          topic: result.nextQuestionObj?.topic || "Technical Evaluation",
          answer: null,
          evaluation: null,
        });

        const newAiMessage = {
          id: `ai-msg-${Date.now()}`,
          type: "ai",
          intent: result.intent,
          text: result.feedback,
          question: result.nextQuestion,
          evaluation: result.evaluation,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newAiMessage]);

        const speechContent = `${newAiMessage.text}. ${newAiMessage.question}`;
        setActiveSpeakingId(newAiMessage.id);
        speak(speechContent, () => {
          setActiveSpeakingId(null);
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setIsEvaluating(false);
      setApiError("Connection to AI interviewer timed out or failed. Your draft has been preserved—click Retry to re-submit.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-h-[920px] bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#242424] rounded-3xl shadow-2xl overflow-hidden transition-colors">
      {/* Top Header */}
      <InterviewHeader
        formattedTime={formattedTime}
        isWarning={isWarning}
        isCritical={isCritical}
        onExitClick={() => setIsExitDialogOpen(true)}
        interviewStyle={style}
        isAISpeaking={Boolean(activeSpeakingId)}
      />

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* Left Sidebar */}
        <InterviewSidebar
          analysisData={analysisData}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          interviewStyle={style}
          durationMinutes={duration}
          difficultyLevel={configuration?.difficultyLevel || 3}
          qaHistory={qaHistoryRef.current}
        />

        {/* Right: Conversation Feed + Sticky Answer Controls */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#fbfcfd] dark:bg-[#0f0f0f] overflow-hidden">
          {/* Scrollable Conversation Stream */}
          <div
            ref={chatScrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
          >
            {messages.map((msg) =>
              msg.type === "ai" ? (
                <AIMessage
                  key={msg.id}
                  message={msg}
                  activeSpeakingId={activeSpeakingId}
                  onPlayVoice={handlePlayVoice}
                  onStopVoice={handleStopVoice}
                  onReplayVoice={handleReplayVoice}
                />
              ) : (
                <CandidateMessage key={msg.id} message={msg} />
              )
            )}
          </div>

          {/* Sticky Answer Control Bar at Bottom */}
          <AnswerBar
            isRecording={isRecording}
            transcript={transcript}
            formattedDuration={formattedDuration}
            isEvaluating={isEvaluating}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSubmitAnswer={handleSubmitAnswer}
            speechError={speechError}
            apiError={apiError}
            onRetry={handleRetrySubmission}
            isCodeEditorOpen={isCodeEditorOpen}
            onToggleCodeEditor={() => setIsCodeEditorOpen((prev) => !prev)}
            codeSnippet={codeSnippet}
          />
        </div>

        {/* Right Side: Resizable Code Editor Panel (opens from right, stretches leftwards or maximizes full workspace) */}
        {isCodeEditorOpen && (
          <CodeEditor
            value={codeSnippet}
            onChange={setCodeSnippet}
            disabled={isEvaluating}
            width={editorWidth}
            onWidthChange={setEditorWidth}
            onClose={() => setIsCodeEditorOpen(false)}
            activeQuestionText={
              qaHistoryRef.current[currentQuestionIndex]?.question ||
              messages.filter((m) => m.type === "ai").slice(-1)[0]?.question ||
              firstQuestionData?.question ||
              null
            }
            onSubmit={() => {
              handleSubmitAnswer({
                text: null,
                code: codeSnippet.trim() || null,
                intent: "ANSWER",
              });
            }}
          />
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      <ExitConfirmDialog
        isOpen={isExitDialogOpen}
        onClose={() => setIsExitDialogOpen(false)}
        onConfirm={onExit}
      />
    </div>
  );
}
