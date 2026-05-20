import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";
import { ChevronDown, Brain } from "lucide-react";

export default function ChatWindow({
  messages,
  isLoading,
  isStreaming,
  onSuggestSelect,
  onRegenerate,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Detect if user scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(distFromBottom > 200);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showWelcome = messages.length <= 1;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto overscroll-contain relative">
      {showWelcome ? (
        /* ── Welcome Hero ──────────────────────────────────────── */
        <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-10 animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-[26px] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-300/20 dark:shadow-indigo-950/20">
              <Brain size={32} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse-slow" />
          </div>
          <div className="max-w-xl text-center">
            <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight mb-3">
              Welcome to IntelliChat
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Your intelligent AI companion for coding, learning, writing, and exploration. Select a prompt below or type a message to begin.
            </p>
          </div>
          <div className="w-full px-2 sm:px-0">
            <SuggestedPrompts onSelect={onSuggestSelect} />
          </div>
        </div>
      ) : (
        /* ── Messages ──────────────────────────────────────────── */
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onRegenerate={msg.sender === "ai" && msg.id !== "welcome" ? onRegenerate : undefined}
            />
          ))}

          {isLoading && !isStreaming && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Scroll-to-bottom FAB */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full
                     bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                     border border-slate-200/60 dark:border-slate-700/40
                     shadow-lg flex items-center justify-center
                     text-slate-500 hover:text-indigo-500
                     transition-all duration-200 animate-fade-in
                     hover:scale-110"
        >
          <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}