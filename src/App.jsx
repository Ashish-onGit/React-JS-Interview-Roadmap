import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProgressProvider } from "./context/ProgressContext";
import MainLayout from "./layouts/MainLayout";
import SectionPage from "./pages/SectionPage";
import CategoryRedirect from "./pages/CategoryRedirect";
import NotFound from "./pages/NotFound";
import { ROADMAP_DATA } from "./data/roadmap";

export default function App() {
  const initialCategory = ROADMAP_DATA[0].id;
  const initialSection = ROADMAP_DATA[0].sections[0].id;
  const defaultPath = `/roadmap/${initialCategory}/${initialSection}`;

  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to={defaultPath} replace />} />
            <Route path="/roadmap" element={<Navigate to={defaultPath} replace />} />
            <Route path="/roadmap/:categoryId" element={<CategoryRedirect />} />
            <Route path="/roadmap/:categoryId/:sectionId" element={<SectionPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
