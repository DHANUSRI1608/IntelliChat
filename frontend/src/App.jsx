import React from "react";
import { useTheme } from "./hooks/useTheme";
import { useChat } from "./hooks/useChat";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import ErrorBanner from "./components/ErrorBanner";

export default function App() {
  const { isDark, toggle } = useTheme();
  const { messages, isLoading, error, sendMessage, clearChat, dismissError } = useChat();

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 dark:from-slate-950 dark:via-midnight-950 dark:to-slate-925 transition-colors duration-300">

      {/* Background ambient orbs */}
      <div
        className="bg-orb w-[500px] h-[500px] top-[-150px] left-[-100px]"
        style={{ background: "var(--orb-1)" }}
      />
      <div
        className="bg-orb w-[400px] h-[400px] bottom-[-100px] right-[-80px]"
        style={{ background: "var(--orb-2)" }}
      />
      <div
        className="bg-orb w-[300px] h-[300px] top-[40%] left-[50%]"
        style={{ background: "var(--orb-3)" }}
      />

      <Navbar
        isDark={isDark}
        onToggleTheme={toggle}
        onClearChat={clearChat}
        messageCount={messages.length}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSuggestSelect={sendMessage}
      />

      <ErrorBanner message={error} onDismiss={dismissError} />

      <InputBox onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}