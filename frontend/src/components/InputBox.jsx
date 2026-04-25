import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal, Square } from "lucide-react";

const PLACEHOLDER_HINTS = [
  "Ask me anything…",
  "Write a Python function to sort a list",
  "Explain quantum computing simply",
  "What are the best practices for React?",
  "Help me debug this code…",
  "Summarize the theory of relativity",
];

export default function InputBox({ onSend, isLoading, isStreaming, onStop }) {
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const textareaRef = useRef(null);

  // Rotate placeholder
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_HINTS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;
  const showStop = isLoading || isStreaming;

  return (
    <div className="relative z-10 flex-shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-4xl mx-auto">
        <div
          className={`
            bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl
            border border-slate-200/50 dark:border-slate-700/30
            rounded-2xl transition-all duration-200
            ${canSend ? "shadow-md shadow-indigo-200/30 dark:shadow-indigo-900/20 border-indigo-200/40 dark:border-indigo-700/30" : ""}
            ${isLoading ? "opacity-80" : ""}
          `}
        >
          <div className="flex items-end gap-2 p-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_HINTS[placeholderIdx]}
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent border-none outline-none
                         text-sm text-slate-700 dark:text-slate-200
                         placeholder:text-slate-400 dark:placeholder:text-slate-500
                         font-body leading-relaxed py-2 px-2
                         min-h-[36px] max-h-[160px]
                         transition-all duration-300"
            />

            {showStop ? (
              <button
                onClick={onStop}
                className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center
                           bg-rose-100 dark:bg-rose-950/40 text-rose-500
                           border border-rose-200 dark:border-rose-800/40
                           hover:bg-rose-200 dark:hover:bg-rose-900/40
                           transition-all duration-200 active:scale-95"
                title="Stop generating"
              >
                <Square size={13} className="fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSend}
                className={`
                  flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${
                    canSend
                      ? "bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-md shadow-indigo-300/30 hover:scale-105 hover:shadow-lg active:scale-95"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }
                `}
              >
                <SendHorizonal size={15} className={canSend ? "" : "opacity-60"} />
              </button>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Press{" "}
              <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[9px]">
                Enter
              </kbd>{" "}
              to send · {" "}
              <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[9px]">
                Shift+Enter
              </kbd>{" "}
              for newline
            </p>
            <span
              className={`text-[10px] font-mono ${
                value.length > 3500
                  ? "text-rose-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {value.length > 0 ? `${value.length}/4000` : ""}
            </span>
          </div>
        </div>

        {/* Model indicator */}
        <div className="flex justify-center mt-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            gpt-4.1-mini
          </span>
        </div>
      </div>
    </div>
  );
}