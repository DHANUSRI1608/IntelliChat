import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "./hooks/useTheme";
import { useConversations } from "./hooks/useConversations";
import { useChat } from "./hooks/useChat";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import ErrorBanner from "./components/ErrorBanner";

export default function App() {
  const { isDark, toggle } = useTheme();
  const {
    conversations,
    activeId,
    activeConversation,
    createNew,
    switchTo,
    deleteConversation,
    renameConversation,
    updateMessages,
  } = useConversations();

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    stopGeneration,
    regenerate,
    clearChat,
    dismissError,
  } = useChat({ activeConversation, updateMessages, renameConversation });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ensure a conversation exists when sending the first message
  const handleSend = useCallback(
    (text) => {
      if (!activeId) {
        createNew();
      }
      sendMessage(text);
    },
    [activeId, createNew, sendMessage]
  );

  const handleNewChat = useCallback(() => {
    createNew();
    setSidebarOpen(false);
  }, [createNew]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd + N: New chat
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleNewChat();
      }
      // Ctrl/Cmd + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNewChat]);

  return (
    <div className="flex h-full overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSwitchTo={switchTo}
        onDelete={deleteConversation}
      />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Background ambient orbs */}
        <div
          className="bg-orb w-[400px] h-[400px] top-[-100px] left-[-80px]"
          style={{ background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)" }}
        />
        <div
          className="bg-orb w-[350px] h-[350px] bottom-[-80px] right-[-60px]"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="bg-orb w-[250px] h-[250px] top-[40%] left-[50%]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }}
        />

        <Navbar
          isDark={isDark}
          onToggleTheme={toggle}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          onNewChat={handleNewChat}
          conversationTitle={activeConversation?.title}
        />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onSuggestSelect={handleSend}
          onRegenerate={regenerate}
        />

        <ErrorBanner message={error} onDismiss={dismissError} />

        <InputBox
          onSend={handleSend}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onStop={stopGeneration}
        />
      </div>
    </div>
  );
}