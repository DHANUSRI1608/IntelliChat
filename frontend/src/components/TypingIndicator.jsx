import React from "react";
import { Brain } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* AI avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-midnight-500 to-violet-600 flex items-center justify-center shadow-sm shadow-midnight-500/30">
          <Brain size={13} className="text-white" />
        </div>
      </div>

      {/* Bubble */}
      <div className="glass-subtle px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex items-center gap-3">
          {/* Bouncing dots */}
          <div className="flex items-center gap-1">
            <span className="dot-1 w-1.5 h-1.5 rounded-full bg-midnight-500/70 dark:bg-midnight-400/70 inline-block" />
            <span className="dot-2 w-1.5 h-1.5 rounded-full bg-midnight-500/70 dark:bg-midnight-400/70 inline-block" />
            <span className="dot-3 w-1.5 h-1.5 rounded-full bg-midnight-500/70 dark:bg-midnight-400/70 inline-block" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-body italic">
            Intellichat is thinking…
          </span>
        </div>
      </div>
    </div>
  );
}