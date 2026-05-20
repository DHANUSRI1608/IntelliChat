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
          className={`bg-white/85 dark:bg-slate-950/85 glass border border-slate-200/50 dark:border-slate-700/50 rounded-3xl transition-all duration-200 ${
            canSend ? "shadow-xl shadow-indigo-200/30 dark:shadow-indigo-900/20" : "shadow-sm"
          } ${isLoading ? "opacity-90" : ""}`}
        >
          <div className="flex flex-col gap-3 p-3 md:p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER_HINTS[placeholderIdx]}
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body leading-relaxed py-3 px-3 min-h-[48px] max-h-[180px] transition-all duration-300"
              />

              {showStop ? (
                <button
                  onClick={onStop}
                  className="flex-shrink-0 mb-0.5 w-11 h-11 rounded-2xl flex items-center justify-center bg-rose-100 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-200 dark:hover:bg-rose-900/40 transition-all duration-200 active:scale-95"
                  title="Stop generating"
                >
                  <Square size={13} className="fill-current" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSend}
                  className={`flex-shrink-0 mb-0.5 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    canSend
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-300/30 hover:scale-105 active:scale-95"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <SendHorizonal size={15} className={canSend ? "" : "opacity-60"} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 px-4 pb-2 text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p className="leading-relaxed">
                Press <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[10px]">Enter</kbd> to send · <kbd className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded text-[10px]">Shift+Enter</kbd> for newline
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-end">
                <span className={`font-mono ${value.length > 3500 ? "text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>
                  {value.length > 0 ? `${value.length}/4000` : ""}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2 py-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  gpt-4.1-mini
                </span>
              </div>
            </div>
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