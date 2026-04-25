import React from "react";
import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* AI avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm shadow-indigo-400/20 ring-2 ring-white/50 dark:ring-slate-800/50">
          <Brain size={13} className="text-white" />
        </div>
      </div>

      {/* Shimmer bubble */}
      <div className="bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/30 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 dark:bg-indigo-400/60 inline-block dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 dark:bg-indigo-400/60 inline-block dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 dark:bg-indigo-400/60 inline-block dot-3" />
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-body italic">
            Thinking…
          </span>
        </div>
      </div>
    </div>
  );
}