import React, { useEffect } from "react";
import SidebarContent from "./SidebarContent";

export default function MobileSidebar({ isOpen, onClose, onOpenSearch, onOpenResetModal }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="flex-1 overflow-hidden">
          <SidebarContent
            onOpenSearch={() => {
              onClose();
              onOpenSearch();
            }}
            onOpenResetModal={() => {
              onClose();
              onOpenResetModal();
            }}
            onItemClick={onClose}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
