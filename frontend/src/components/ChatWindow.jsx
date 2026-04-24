import React from "react";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

export default function ChatWindow({ messages, isLoading, onSuggestSelect }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages or loading state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const showSuggestions = messages.length === 1; // only welcome message

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-contain"
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Suggestions shown only on first load */}
        {showSuggestions && !isLoading && (
          <SuggestedPrompts onSelect={onSuggestSelect} />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}