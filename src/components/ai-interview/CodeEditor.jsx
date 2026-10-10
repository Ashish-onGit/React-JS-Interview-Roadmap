import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import {
  FiMaximize2,
  FiMinimize2,
  FiCopy,
  FiCheck,
  FiCode,
  FiRotateCcw,
  FiAlignLeft,
  FiFileText,
  FiX,
  FiSend,
  FiExternalLink,
  FiSidebar,
  FiMove,
  FiMinus,
  FiChevronLeft,
} from "react-icons/fi";

export const DEFAULT_REACT_CODE = `import React, { useState } from 'react';

export default function Component() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h2>React Component</h2>
      <button onClick={() => setCount(prev => prev + 1)}>
        Count: {count}
      </button>
    </div>
  );
}`;

export default function CodeEditor({
  value = DEFAULT_REACT_CODE,
  onChange,
  disabled = false,
  placeholder = "// Write your React / JavaScript component code solution here...",
  width = 520,
  onWidthChange,
  onClose,
  onSubmit,
  activeQuestionText = null,
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [floatingPos, setFloatingPos] = useState(() => {
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const initialWidth = 620;
    return {
      x: Math.max(20, screenWidth - initialWidth - 30),
      y: 76,
    };
  });
  const [floatingSize, setFloatingSize] = useState({
    width: 620,
    height: 520,
  });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedY, setCollapsedY] = useState(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.max(120, Math.floor(h * 0.35));
  });
  const collapsedDragStartRef = useRef({ y: 0, startMouseY: 0, moved: false });
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(() => {
    return Math.max(1, (value || "").split("\n").length);
  });

  const textareaRef = useRef(null);
  const lineGutterRef = useRef(null);
  const highlightRef = useRef(null);
  const isDraggingLeftRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(width);
  const previousWidthRef = useRef(width);

  // Memoize Prism JSX syntax highlighting with VS Code Dark+ tokens
  const highlightedCode = useMemo(() => {
    if (!value) return "";
    try {
      return Prism.highlight(value, Prism.languages.jsx, "jsx");
    } catch {
      return value;
    }
  }, [value]);

  // Auto-populate with default React code if editor is empty on mount
  useEffect(() => {
    if (!value && onChange) {
      onChange(DEFAULT_REACT_CODE);
    }
  }, []);

  // Synchronize line count
  useEffect(() => {
    const lines = (value || "").split("\n").length;
    setLineCount(Math.max(1, lines));
  }, [value]);

  // Synchronize scrolling between textarea, highlighted pre, and line gutter
  const handleScroll = () => {
    if (textareaRef.current) {
      if (lineGutterRef.current) {
        lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = textareaRef.current.scrollTop;
        highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }
  };

  // Drag-to-resize to the LEFT handler in docked split mode
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    isDraggingLeftRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = width;

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingLeftRef.current) return;
      const deltaX = dragStartXRef.current - moveEvent.clientX;
      const screenWidth = window.innerWidth || 1200;
      const maxAllowed = Math.max(380, screenWidth - 640);
      const newWidth = Math.max(340, Math.min(maxAllowed, dragStartWidthRef.current + deltaX));
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingLeftRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Touch drag resize for docked mode
  const handleTouchStartResize = (e) => {
    if (!e.touches[0]) return;
    isDraggingLeftRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartWidthRef.current = width;

    const handleTouchMove = (moveEvent) => {
      if (!isDraggingLeftRef.current || !moveEvent.touches[0]) return;
      const deltaX = dragStartXRef.current - moveEvent.touches[0].clientX;
      const screenWidth = window.innerWidth || 1200;
      const maxAllowed = Math.max(300, screenWidth - 40);
      const newWidth = Math.max(280, Math.min(maxAllowed, dragStartWidthRef.current + deltaX));
      if (onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleTouchEnd = () => {
      isDraggingLeftRef.current = false;
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Drag-to-move floating window by its header
  const handleHeaderMouseDown = (e) => {
    if (!isFloating || isMaximized) return;
    if (e.button !== 0) return;
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) {
      return;
    }
    e.preventDefault();
    setIsDraggingWindow(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = floatingPos.x;
    const origY = floatingPos.y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const screenW = window.innerWidth || 1200;
      const screenH = window.innerHeight || 800;
      const newX = Math.max(10, Math.min(screenW - 120, origX + deltaX));
      const newY = Math.max(10, Math.min(screenH - 80, origY + deltaY));
      setFloatingPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDraggingWindow(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleHeaderTouchStart = (e) => {
    if (!isFloating || isMaximized || !e.touches[0]) return;
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) {
      return;
    }
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const origX = floatingPos.x;
    const origY = floatingPos.y;

    const handleTouchMove = (moveEvent) => {
      if (!moveEvent.touches[0]) return;
      const t = moveEvent.touches[0];
      const deltaX = t.clientX - startX;
      const deltaY = t.clientY - startY;
      const screenW = window.innerWidth || 1200;
      const screenH = window.innerHeight || 800;
      const newX = Math.max(10, Math.min(screenW - 120, origX + deltaX));
      const newY = Math.max(10, Math.min(screenH - 80, origY + deltaY));
      setFloatingPos({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Corner resize (bottom-right: both width & height)
  const handleCornerResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = floatingSize.width;
    const startH = floatingSize.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const screenW = window.innerWidth || 1200;
      const screenH = window.innerHeight || 800;
      const minW = 380;
      const maxW = Math.max(minW, screenW - floatingPos.x - 20);
      const minH = 280;
      const maxH = Math.max(minH, screenH - floatingPos.y - 20);

      setFloatingSize({
        width: Math.max(minW, Math.min(maxW, startW + deltaX)),
        height: Math.max(minH, Math.min(maxH, startH + deltaY)),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Bottom edge resize (height only)
  const handleBottomEdgeResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startH = floatingSize.height;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const screenH = window.innerHeight || 800;
      const minH = 280;
      const maxH = Math.max(minH, screenH - floatingPos.y - 20);
      setFloatingSize((prev) => ({
        ...prev,
        height: Math.max(minH, Math.min(maxH, startH + deltaY)),
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Right edge resize (width only)
  const handleRightEdgeResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = floatingSize.width;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const screenW = window.innerWidth || 1200;
      const minW = 380;
      const maxW = Math.max(minW, screenW - floatingPos.x - 20);
      setFloatingSize((prev) => ({
        ...prev,
        width: Math.max(minW, Math.min(maxW, startW + deltaX)),
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Left edge resize (width + position adjust)
  const handleLeftEdgeResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = floatingSize.width;
    const origX = floatingPos.x;

    const handleMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const minW = 380;
      const newW = Math.max(minW, startW + deltaX);
      const newX = origX - (newW - startW);
      if (newX >= 10) {
        setFloatingSize((prev) => ({ ...prev, width: newW }));
        setFloatingPos((prev) => ({ ...prev, x: newX }));
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Toggle maximize
  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  // Toggle floating / pop-out mode
  const toggleFloating = () => {
    if (!isFloating) {
      if (isMaximized) setIsMaximized(false);
      setIsFloating(true);
    } else {
      setIsFloating(false);
    }
  };

  // Drag-to-move for collapsed button along the right side
  const handleCollapsedMouseDown = (e) => {
    if (e.button !== 0) return;
    collapsedDragStartRef.current = {
      y: collapsedY,
      startMouseY: e.clientY,
      moved: false,
    };

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - collapsedDragStartRef.current.startMouseY;
      if (Math.abs(deltaY) > 4) {
        collapsedDragStartRef.current.moved = true;
      }
      const maxH = window.innerHeight - 80;
      const newY = Math.max(60, Math.min(maxH, collapsedDragStartRef.current.y + deltaY));
      setCollapsedY(newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleCollapsedTouchStart = (e) => {
    if (!e.touches[0]) return;
    collapsedDragStartRef.current = {
      y: collapsedY,
      startMouseY: e.touches[0].clientY,
      moved: false,
    };

    const handleTouchMove = (moveEvent) => {
      if (!moveEvent.touches[0]) return;
      const deltaY = moveEvent.touches[0].clientY - collapsedDragStartRef.current.startMouseY;
      if (Math.abs(deltaY) > 4) {
        collapsedDragStartRef.current.moved = true;
      }
      const maxH = window.innerHeight - 80;
      const newY = Math.max(60, Math.min(maxH, collapsedDragStartRef.current.y + deltaY));
      setCollapsedY(newY);
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleCollapsedClick = () => {
    if (!collapsedDragStartRef.current.moved) {
      setIsCollapsed(false);
    }
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Insert boilerplate template
  const handleInsertTemplate = () => {
    if (disabled) return;
    onChange(DEFAULT_REACT_CODE);
  };

  // Auto format code
  const handleFormatCode = () => {
    if (disabled || !value) return;
    const lines = value.split("\n");
    let indentLevel = 0;
    const formatted = lines.map((rawLine) => {
      const line = rawLine.trim();
      if (!line) return "";
      if (/^[}\])]/.test(line)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      const indentation = "  ".repeat(indentLevel);
      const res = indentation + line;
      if (/[{([]\s*$/.test(line) && !/^[}\])]/.test(line)) {
        indentLevel++;
      } else if (/^[}\]](.*)[{([]\s*$/.test(line)) {
        indentLevel = Math.max(1, indentLevel);
      }
      return res;
    });
    onChange(formatted.join("\n"));
  };

  // Clear code
  const handleClear = () => {
    if (disabled || !value) return;
    onChange("");
  };

  // Key handlers: Tab, Enter (auto-indent), Auto-close brackets
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;

    if (e.key === "Tab") {
      e.preventDefault();
      const tabStr = "  ";
      if (e.shiftKey) {
        const before = value.substring(0, selectionStart);
        const lineStart = before.lastIndexOf("\n") + 1;
        if (value.substring(lineStart, lineStart + 2) === "  ") {
          const updated = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(updated);
          setTimeout(() => {
            textarea.selectionStart = Math.max(lineStart, selectionStart - 2);
            textarea.selectionEnd = Math.max(lineStart, selectionEnd - 2);
          }, 0);
        }
      } else {
        const updated = value.substring(0, selectionStart) + tabStr + value.substring(selectionEnd);
        onChange(updated);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 2;
          textarea.selectionEnd = selectionStart + 2;
        }, 0);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const currentLineBeforeCursor = value.substring(0, selectionStart).split("\n").pop() || "";
      const matchIndent = currentLineBeforeCursor.match(/^\s*/);
      let indent = matchIndent ? matchIndent[0] : "";
      const endsWithOpen = /[{[(]\s*$/.test(currentLineBeforeCursor);
      if (endsWithOpen) {
        indent += "  ";
      }
      const updated = value.substring(0, selectionStart) + "\n" + indent + value.substring(selectionEnd);
      onChange(updated);
      setTimeout(() => {
        textarea.selectionStart = selectionStart + 1 + indent.length;
        textarea.selectionEnd = selectionStart + 1 + indent.length;
      }, 0);
      return;
    }

    const pairs = {
      "{": "}",
      "(": ")",
      "[": "]",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (pairs[e.key] && selectionStart === selectionEnd) {
      e.preventDefault();
      const closeChar = pairs[e.key];
      const updated = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      onChange(updated);
      setTimeout(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };

  // Render Collapsed Floating Arrow Button at Right Side
  if (isCollapsed) {
    const collapsedBtn = (
      <div
        style={{ top: `${collapsedY}px` }}
        onMouseDown={handleCollapsedMouseDown}
        onTouchStart={handleCollapsedTouchStart}
        onClick={handleCollapsedClick}
        className="fixed right-0 z-[9999] group flex items-center select-none cursor-pointer"
        title="Click to restore Code Editor • Drag vertically to reposition"
      >
        <div className="flex items-center gap-2.5 pl-3.5 pr-2.5 py-2.5 bg-[#161b22]/95 hover:bg-[#1a2333] border-2 border-r-0 border-emerald-500/80 hover:border-emerald-400 rounded-l-2xl shadow-[-8px_4px_30px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all group-hover:pr-4 group-hover:-translate-x-1.5 ring-1 ring-emerald-500/30">
          {/* Arrow button indicator */}
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-inner">
            <FiChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>

          {/* Label + line count badge */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-white">
            <FiCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold tracking-wide">React Code</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
              {lineCount}L
            </span>
          </div>

          {/* Tiny vertical drag grip */}
          <div className="flex flex-col gap-0.5 px-0.5 text-slate-500 group-hover:text-slate-300 cursor-grab" title="Drag vertically to reposition">
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>
      </div>
    );

    if (typeof document !== "undefined") {
      return createPortal(collapsedBtn, document.body);
    }
    return collapsedBtn;
  }

  const editorContent = (
    <aside
      style={
        isMaximized
          ? undefined
          : isFloating
          ? {
              position: "fixed",
              left: `${floatingPos.x}px`,
              top: `${floatingPos.y}px`,
              width: `${floatingSize.width}px`,
              height: `${floatingSize.height}px`,
              zIndex: 9999,
            }
          : { width: `${width}px` }
      }
      className={
        isMaximized
          ? "fixed inset-0 z-[100] flex flex-col h-full w-full bg-[#0d1117] shadow-2xl overflow-hidden"
          : isFloating
          ? `flex flex-col bg-[#0d1117] border border-slate-700/80 rounded-2xl shadow-[0_25px_65px_-10px_rgba(0,0,0,0.85)] ring-1 ring-white/10 overflow-hidden transition-[box-shadow,border-color] ${
              isDraggingWindow ? "shadow-[0_25px_70px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/60 border-emerald-500/50" : ""
            }`
          : "fixed lg:relative inset-y-0 right-0 z-30 flex h-full max-w-[96vw] lg:max-w-[calc(100vw-360px)] flex-shrink-0 bg-[#0d1117] border-l border-slate-800 shadow-2xl transition-[width] duration-75 overflow-hidden"
      }
    >
      {/* 1. Left Vertical Resize Handle Bar (Stretch to Left) - Only shown in docked split mode */}
      {!isMaximized && !isFloating && (
        <div
          onMouseDown={handleMouseDownResize}
          onTouchStart={handleTouchStartResize}
          onDoubleClick={toggleMaximize}
          className="w-2.5 hover:w-3.5 h-full bg-slate-800/80 hover:bg-emerald-500 active:bg-emerald-600 border-r border-slate-700/80 flex flex-col items-center justify-center cursor-col-resize transition-all select-none group z-20 flex-shrink-0"
          title="Drag left to stretch code editor width, or double-click to maximize"
        >
          <div className="w-1 h-12 rounded-full bg-slate-500 group-hover:bg-white group-active:bg-white transition-colors" />
        </div>
      )}

      {/* 2. Floating Window Edge & Corner Resize Grips */}
      {isFloating && !isMaximized && (
        <>
          {/* Bottom Edge */}
          <div
            onMouseDown={handleBottomEdgeResizeMouseDown}
            className="absolute bottom-0 inset-x-2 h-2 cursor-ns-resize z-30 hover:bg-emerald-500/20 transition-colors"
            title="Drag to resize height"
          />
          {/* Right Edge */}
          <div
            onMouseDown={handleRightEdgeResizeMouseDown}
            className="absolute right-0 inset-y-2 w-2 cursor-ew-resize z-30 hover:bg-emerald-500/20 transition-colors"
            title="Drag to resize width"
          />
          {/* Left Edge */}
          <div
            onMouseDown={handleLeftEdgeResizeMouseDown}
            className="absolute left-0 inset-y-2 w-2 cursor-ew-resize z-30 hover:bg-emerald-500/20 transition-colors"
            title="Drag to resize width"
          />
          {/* Bottom-Right Corner Grip */}
          <div
            onMouseDown={handleCornerResizeMouseDown}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize z-40 flex items-end justify-end p-0.5 group select-none"
            title="Drag corner to resize both width and height"
          >
            <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-slate-500 group-hover:border-emerald-400 group-active:border-emerald-300 transition-colors" />
          </div>
        </>
      )}

      {/* 3. Main Editor Panel Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0d1117]">
        {/* Top Header Toolbar */}
        <div
          onMouseDown={isFloating ? handleHeaderMouseDown : undefined}
          onTouchStart={isFloating ? handleHeaderTouchStart : undefined}
          className={`px-3.5 py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between gap-2 text-xs flex-shrink-0 w-full overflow-hidden ${
            isFloating && !isMaximized
              ? isDraggingWindow
                ? "cursor-grabbing bg-[#1c232d] select-none"
                : "cursor-grab select-none hover:bg-[#1a2029]"
              : ""
          }`}
          title={isFloating ? "Click and drag to move window" : undefined}
        >
          {/* Left: Window dots, Language Badge, Line counter & Floating Mode Indicator */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
              <FiCode className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">React / JSX</span>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>

            {isFloating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 select-none">
                <FiMove className="w-2.5 h-2.5" /> Floating Window
              </span>
            )}

            {isMaximized && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Maximized IDE Mode
              </span>
            )}
          </div>

          {/* Right: Actions (Format, Template, Copy, Clear, Pop Out / Dock, Maximize, Close) */}
          <div className="flex items-center gap-1 text-slate-400 flex-shrink-0 ml-auto">
            <button
              type="button"
              onClick={handleFormatCode}
              disabled={disabled || !value}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Auto-format code indentation"
            >
              <FiAlignLeft className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Format</span>
            </button>

            <button
              type="button"
              onClick={handleInsertTemplate}
              disabled={disabled}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Insert React boilerplate component"
            >
              <FiFileText className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Template</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!value}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy code to clipboard"
            >
              {copied ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px] hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || !value}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-red-400 disabled:opacity-40 transition-colors cursor-pointer"
              title="Clear code"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-slate-700 mx-1" />

            {/* Pop-Out / Dock Toggle */}
            <button
              type="button"
              onClick={toggleFloating}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                isFloating
                  ? "bg-emerald-600/25 text-emerald-300 hover:bg-emerald-600/35 ring-1 ring-emerald-500/40"
                  : "hover:bg-slate-800 hover:text-emerald-400 text-slate-300"
              }`}
              title={isFloating ? "Dock to right side panel" : "Pop out as separate floating resizable window"}
            >
              {isFloating ? (
                <>
                  <FiSidebar className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline font-medium">Dock</span>
                </>
              ) : (
                <>
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline font-medium">Pop Out</span>
                </>
              )}
            </button>

            {/* Minimize to small right-side arrow button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-amber-300 text-slate-300 transition-colors cursor-pointer"
              title="Minimize to right-side arrow button"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>

            {/* Maximize / Restore width toggle */}
            <button
              type="button"
              onClick={toggleMaximize}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMaximized
                  ? "bg-indigo-600/25 text-indigo-300 hover:bg-indigo-600/35 ring-1 ring-indigo-500/40"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
              title={isMaximized ? "Restore view" : "Maximize editor (Full IDE)"}
            >
              {isMaximized ? (
                <FiMinimize2 className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <FiMaximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Close button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
                title="Close code editor"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* If maximized, show compact question prompt context */}
        {isMaximized && activeQuestionText && (
          <div className="px-4 py-2 bg-indigo-950/35 border-b border-indigo-900/40 flex items-center justify-between gap-3 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 flex-shrink-0 uppercase tracking-wider">
                Question
              </span>
              <p className="text-slate-300 text-xs truncate">
                {activeQuestionText}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleMaximize}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors flex-shrink-0 underline cursor-pointer"
            >
              Restore split view
            </button>
          </div>
        )}

        {/* Editor Body: Line numbers + Synchronized VS Code Highlighted Textarea */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0d1117]">
          {/* Line Numbers Gutter */}
          <div
            ref={lineGutterRef}
            className="w-11 sm:w-14 py-3.5 bg-[#161b22]/70 border-r border-slate-800/80 font-mono text-xs sm:text-[13px] text-slate-500 text-right pr-3 select-none overflow-hidden leading-[1.625rem]"
          >
            {Array.from({ length: lineCount }).map((_, idx) => (
              <div key={idx + 1}>{idx + 1}</div>
            ))}
          </div>

          {/* Interactive Code Container: VS Code Highlighted Pre Layer + Transparent Overlay Textarea */}
          <div className="relative flex-1 min-h-0 overflow-hidden font-mono text-xs sm:text-[13px] leading-[1.625rem]">
            {/* Syntax Highlighted Render Layer */}
            <pre
              ref={highlightRef}
              aria-hidden="true"
              style={{ tabSize: 2, MozTabSize: 2 }}
              className="vscode-editor-syntax absolute inset-0 p-3.5 m-0 font-mono text-xs sm:text-[13px] leading-[1.625rem] whitespace-pre overflow-hidden pointer-events-none select-none border-0 bg-transparent text-[#d4d4d4]"
              dangerouslySetInnerHTML={{
                __html: highlightedCode + (value.endsWith("\n") ? " " : ""),
              }}
            />

            {/* Editable Transparent Textarea on top */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              disabled={disabled}
              placeholder={placeholder}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              style={{ tabSize: 2, MozTabSize: 2 }}
              className="absolute inset-0 p-3.5 m-0 font-mono text-xs sm:text-[13px] leading-[1.625rem] text-transparent caret-white selection:bg-[#264f78] bg-transparent outline-none resize-none overflow-auto whitespace-pre border-0 placeholder-slate-600 focus:ring-0"
            />
          </div>
        </div>

        {/* Bottom Toolbar: Hints & Submit Button */}
        <div className="px-3.5 py-2 bg-[#161b22] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono flex-shrink-0">
          <div className="flex items-center gap-3">
            <span>Tab: 2 spaces</span>
            {isFloating ? (
              <span className="hidden sm:inline text-emerald-400/90">• Drag header to move, corner to resize</span>
            ) : (
              <span className="hidden sm:inline">• Drag left bar ⬌ to stretch</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onSubmit && (
              <button
                type="button"
                onClick={onSubmit}
                disabled={disabled || !value.trim()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Submit solution code"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );

  if (isFloating && typeof document !== "undefined") {
    return createPortal(editorContent, document.body);
  }

  return editorContent;
}
