import React from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { ROADMAP_DATA } from "../data/roadmap";

export default function NotFound() {
  const defaultPath = `/roadmap/${ROADMAP_DATA[0].id}/${ROADMAP_DATA[0].sections[0].id}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-700 mt-1">Topic or Section Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The topic or route you were looking for doesn't exist in the roadmap.
        </p>
        <Link
          to={defaultPath}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </Link>
      </div>
    </div>
  );
}
