import { useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";

export function useQuestionModal() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestionModal must be used within a QuestionProvider");
  }
  return context;
}
