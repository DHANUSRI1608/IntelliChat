import React from "react";
import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Mic } from "lucide-react";

const PLACEHOLDER_HINTS = [
  "What caused the fall of the Roman Empire?",
  "Explain quantum entanglement simply.",
  "Who invented the World Wide Web?",
  "What are the largest countries by area?",
  "How does a nuclear reactor work?",
  "Tell me about the French Revolution.",
];

export default function InputBox({ onSend, isLoading }) {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_HINTS[0]);
  const textareaRef = useRef(null);

  // Rotate placeholder hints
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholder((cur) => {
        const idx = PLACEHOLDER_HINTS.indexOf(cur);
        return PLACEHOLDER_HINTS[(idx + 1) % PLACEHOLDER_HINTS.length];
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="relative z-10 flex-shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-4xl mx-auto">
        <div
          className={`
            glass rounded-2xl transition-all duration-200
            ${canSend ? "shadow-lg shadow-midnight-500/10 dark:shadow-midnight-900/40" : ""}
            ${isLoading ? "opacity-70" : ""}
          `}
        >
          <div className="flex items-end gap-2 p-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              className={`
                flex-1 resize-none bg-transparent border-none outline-none
                text-sm text-slate-800 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                font-body leading-relaxed py-2 px-2
                min-h-[36px] max-h-[160px]
                transition-placeholder duration-500
              `}
            />

            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className={`
                flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${canSend
                  ? "bg-gradient-to-br from-midnight-500 to-violet-600 text-white shadow-md shadow-midnight-500/30 hover:scale-105 hover:shadow-lg hover:shadow-midnight-500/40 active:scale-95"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }
              `}
            >
              <SendHorizonal size={15} className={canSend ? "" : "opacity-60"} />
            </button>
          </div>

          {/* Footer hint */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-[9px]">Enter</kbd> to send
              {" · "}
              <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-[9px]">Shift+Enter</kbd> for newline
            </p>
            <span className={`text-[10px] font-mono ${value.length > 1800 ? "text-red-400" : "text-slate-400 dark:text-slate-500"}`}>
              {value.length}/2000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}