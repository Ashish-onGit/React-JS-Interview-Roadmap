import React, { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ROADMAP_DATA } from "../data/roadmap";

export default function CategoryRedirect() {
  const { categoryId } = useParams();
  const category = ROADMAP_DATA.find((c) => c.id === categoryId);

  if (!category || !category.sections.length) {
    return <Navigate to={`/roadmap/${ROADMAP_DATA[0].id}/${ROADMAP_DATA[0].sections[0].id}`} replace />;
  }

  return (
    <Navigate
      to={`/roadmap/${category.id}/${category.sections[0].id}`}
      replace
    />
  );
}
