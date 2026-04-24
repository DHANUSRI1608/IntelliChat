import React from "react";
import { useState, useCallback } from "react";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "ai",
  text: "Hello! I'm **Intellichat**, your factual knowledge assistant. Ask me anything about history, science, geography, current events, technology, or the world around you.\n\n*What would you like to explore today?*",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: text.trim(),
    history: messages.filter((m) => m.id !== "welcome").slice(-10),
  }),
});

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();

      const aiMsg = {
        id: `a-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date(),
        mode: data.mode,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return { messages, isLoading, error, sendMessage, clearChat, dismissError };
}