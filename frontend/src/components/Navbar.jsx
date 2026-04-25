import React from "react";
import { Sun, Moon, Brain, PanelLeftOpen, PanelLeftClose, MessageSquarePlus } from "lucide-react";

export default function Navbar({
  isDark,
  onToggleTheme,
  onToggleSidebar,
  sidebarOpen,
  onNewChat,
  conversationTitle,
}) {
  return (
    <header className="relative z-10 flex-shrink-0">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/30 px-4 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Left: Sidebar toggle + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-500 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200 hover:scale-105"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={16} />
              ) : (
                <PanelLeftOpen size={16} />
              )}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-300/20 dark:shadow-indigo-900/20">
                  <Brain size={16} className="text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base leading-none tracking-tight text-slate-800 dark:text-white">
                  Intelli
                  <span className="text-indigo-500 dark:text-indigo-400">
                    chat
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-body mt-0.5 leading-none">
                  {conversationTitle && conversationTitle !== "New Chat"
                    ? conversationTitle
                    : "AI Assistant"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onNewChat}
              title="New chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-500 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-all duration-200 hover:scale-105"
            >
              <MessageSquarePlus size={16} />
            </button>

            <button
              onClick={onToggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-slate-500 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
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