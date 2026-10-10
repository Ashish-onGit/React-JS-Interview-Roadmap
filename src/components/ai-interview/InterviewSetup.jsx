import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiZap,
  FiClock,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";
import {
  getStoredResumeDraft,
  saveResumeDraft,
  getSavedInterviews,
} from "../../services/interviewStorage";

const SAMPLE_RESUME = `I am a Full Stack / MERN developer with 2.5 years of experience building scalable web applications.
Core skills: React 18, JavaScript (ES6+), TypeScript, Node.js, Express, MongoDB, Redux Toolkit, Tailwind CSS.
Projects:
1. Real-Time Analytics Dashboard: Built with React, WebSockets, and Node.js. Optimized render performance with useMemo and virtualization.
2. E-Commerce Checkout Service: Designed RESTful microservices, JWT authentication, stripe payment integration, and Redis caching.
3. Interactive Code Sandbox: Implemented client-side AST parsing, code execution worker, and state synchronization.`;

export default function InterviewSetup({
  onAnalyzeAndStart,
  onOpenHistory,
}) {
  const [resumeText, setResumeText] = useState(() => getStoredResumeDraft() || "");
  const [recentInterviews] = useState(() => getSavedInterviews().slice(0, 3));


  const handleChange = (e) => {
    const text = e.target.value.slice(0, 5000);
    setResumeText(text);
    saveResumeDraft(text);
  };

  const handleUseSample = () => {
    setResumeText(SAMPLE_RESUME);
    saveResumeDraft(SAMPLE_RESUME);
  };

  const handleClear = () => {
    setResumeText("");
    saveResumeDraft("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    onAnalyzeAndStart(resumeText.trim());
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive AI Interview Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Interview
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-[#a0a0a0]">
          Practice realistic interviews based on your actual experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left 2 Cols: Main Resume/Experience Form */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-6 sm:p-7 shadow-lg space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FiFileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Tell me about your experience
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-[#7f7f7f]">
                    Paste your resume or describe your roles, stack & projects
                  </p>
                </div>
              </div>

              {/* Sample resume button */}
              <button
                type="button"
                onClick={handleUseSample}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 transition-colors"
                title="Paste a pre-filled realistic candidate resume"
              >
                Use Sample Resume
              </button>
            </div>

            {/* Experience Textarea */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={handleChange}
                  rows={9}
                  placeholder={`Paste your resume or describe your experience, skills, projects, technologies, and current role...\n\nFor example:\nI am a MERN stack developer with 2+ years of experience.\nI have worked with React, Node.js, Express and MongoDB.\nI have experience building enterprise applications and personal projects involving authentication, APIs, Redux, Tailwind CSS and real-time communication...`}
                  className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#2d2d2d] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                />

                {/* Counter & Clear Button */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#737373] mt-2 px-1">
                  <div className="flex items-center gap-3">
                    <span>{resumeText.length} / 5000</span>
                    {resumeText && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <span>Markdown / Plain text accepted</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={!resumeText.trim()}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <FiZap className="w-5 h-5 fill-current" />
                <span>Analyze & Start Interview</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Col: Tips & Previous Interviews */}
        <div className="space-y-6">
          {/* Interview Tips Card */}
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <FiHelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Interview Tips</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-[#a3a3a3]">
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Be honest & specific:</strong> Mention actual libraries and architectural decisions you made.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Live Voice First:</strong> The AI will ask questions via voice and listen as you speak.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Follow-ups:</strong> The AI drills deeper into your answers just like a senior engineer.
                </span>
              </li>
            </ul>
          </div>

          {/* Previous Interviews Mini Widget */}
          <div className="bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#272727] rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                <FiClock className="w-4 h-4 text-indigo-500" />
                <span>Recent Interviews</span>
              </div>
              {recentInterviews.length > 0 && (
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All
                </button>
              )}
            </div>

            {recentInterviews.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-[#777777] py-2">
                No previous interviews yet. Start your first session above!
              </p>
            ) : (
              <div className="space-y-2 pt-1">
                {recentInterviews.map((item) => (
                  <div
                    key={item.id}
                    onClick={onOpenHistory}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200/80 dark:border-[#282828] hover:border-indigo-400 dark:hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.interviewType}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.durationFormatted || "30m"}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-500 text-xs">
                      {item.scores?.technicalKnowledge || 80}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
