import { useState, useCallback, useRef, useEffect } from "react";

const API_BASE = "http://localhost:5000";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "ai",
  text: "Hello! I'm **Intellichat**, your AI assistant. I can help with coding, writing, analysis, science, history, and much more.\n\n*What would you like to explore today?*",
  timestamp: new Date().toISOString(),
};

export function useChat({ activeConversation, updateMessages, renameConversation }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Sync messages when conversation switches
  useEffect(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      setMessages(activeConversation.messages);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
    setIsLoading(false);
    setIsStreaming(false);
    setError(null);
    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [activeConversation?.id]);

  // Persist messages back to conversation store
  useEffect(() => {
    if (activeConversation && messages.length > 1) {
      updateMessages(activeConversation.id, messages);
    }
  }, [messages, activeConversation, updateMessages]);

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      const userMsg = {
        id: `u-${Date.now()}`,
        sender: "user",
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);
      setIsStreaming(false);
      setError(null);

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const response = await fetch(`${API_BASE}/api/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            history: updatedMessages.filter((m) => m.id !== "welcome").slice(-10),
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `Server error (${response.status})`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const aiMsgId = `a-${Date.now()}`;
        let fullText = "";

        setIsStreaming(true);

        // Add empty AI message that we'll fill with streamed tokens
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: "ai",
            text: "",
            timestamp: new Date().toISOString(),
            isStreaming: true,
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.slice(6).trim();

              if (payload === "[DONE]") break;

              try {
                const parsed = JSON.parse(payload);
                if (parsed.token) {
                  fullText += parsed.token;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsgId ? { ...m, text: fullText, isStreaming: true } : m
                    )
                  );
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (parseErr) {
                if (parseErr.message && !parseErr.message.includes("JSON")) {
                  throw parseErr;
                }
              }
            }
          }
        }

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, text: fullText, isStreaming: false } : m
          )
        );

        // Auto-title: if this is the first user message, generate a title
        if (activeConversation && updatedMessages.filter((m) => m.sender === "user").length === 1) {
          try {
            const titleRes = await fetch(`${API_BASE}/api/title`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: text.trim() }),
            });
            const titleData = await titleRes.json();
            if (titleData.title) {
              renameConversation(activeConversation.id, titleData.title);
            }
          } catch (e) {
            // title generation is non-critical
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          // User cancelled — mark message as complete with what we have
          setMessages((prev) =>
            prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
          );
        } else {
          setError(err.message || "Something went wrong. Please try again.");
          // Remove empty AI message that was created for streaming
          setMessages((prev) =>
            prev.filter((m) => !(m.sender === "ai" && m.id !== "welcome" && !m.text))
          );
        }
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [activeConversation, updateMessages, renameConversation]
  );

  const regenerate = useCallback(async () => {
    // Find the last user message and resend
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
    if (!lastUserMsg) return;

    // Remove the last AI response
    setMessages((prev) => {
      const idx = prev.findLastIndex((m) => m.sender === "ai" && m.id !== "welcome");
      if (idx === -1) return prev;
      return prev.slice(0, idx);
    });

    // Wait a tick for state to update, then resend
    setTimeout(() => sendMessage(lastUserMsg.text), 50);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    stopGeneration,
    regenerate,
    clearChat,
    dismissError,
  };
}