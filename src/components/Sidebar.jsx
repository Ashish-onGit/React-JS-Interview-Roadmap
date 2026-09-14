import React from "react";
import SidebarContent from "./SidebarContent";

export default function Sidebar({ isOpen = true, onOpenSearch, onOpenResetModal, onCollapse }) {
  if (!isOpen) return null;

  return (
    <aside className="hidden md:flex flex-col w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 dark:border-[#292929] bg-white dark:bg-[#141414] min-h-[calc(100vh-72px)] sticky top-[72px] h-[calc(100vh-72px)] animate-in fade-in duration-150 transition-colors duration-150">
      <SidebarContent
        onOpenSearch={onOpenSearch}
        onOpenResetModal={onOpenResetModal}
        onCollapse={onCollapse}
      />
    </aside>
  );
}
