import React from "react";
import { Sun, Moon, Trash2, Brain } from "lucide-react";

export default function Navbar({ isDark, onToggleTheme, onClearChat, messageCount }) {
  return (
    <header className="relative z-10 flex-shrink-0">
      <div className="glass border-b border-white/40 dark:border-midnight-700/40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-midnight-500 to-violet-600 flex items-center justify-center shadow-lg shadow-midnight-500/30">
                <Brain size={16} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="font-display font-700 text-base leading-none tracking-tight text-slate-900 dark:text-white">
                Intelli<span className="text-midnight-500 dark:text-midnight-400">chat</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-body mt-0.5 leading-none">
                Factual AI Assistant
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {messageCount > 1 && (
              <button
                onClick={onClearChat}
                title="Clear chat"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                           text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-950/30
                           transition-all duration-200 group"
              >
                <Trash2 size={13} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={onToggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-600 dark:text-slate-300
                         hover:bg-midnight-100 dark:hover:bg-midnight-900/50
                         transition-all duration-200 hover:scale-105"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}