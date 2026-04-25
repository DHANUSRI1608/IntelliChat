import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "intellichat-conversations";

function generateId() {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load conversations:", e);
  }
  return [];
}

function saveToStorage(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.warn("Failed to save conversations:", e);
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState(() => loadFromStorage());
  const [activeId, setActiveId] = useState(null);

  // Persist on every change
  useEffect(() => {
    saveToStorage(conversations);
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const createNew = useCallback(() => {
    const newConv = {
      id: generateId(),
      title: "New Chat",
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    return newConv.id;
  }, []);

  const switchTo = useCallback((id) => {
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const renameConversation = useCallback((id, newTitle) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  }, []);

  const updateMessages = useCallback(
    (id, messages) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, messages } : c))
      );
    },
    []
  );

  return {
    conversations,
    activeId,
    activeConversation,
    createNew,
    switchTo,
    deleteConversation,
    renameConversation,
    updateMessages,
  };
}
