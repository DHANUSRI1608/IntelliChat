import React from "react";
import { Brain, User } from "lucide-react";

/**
 * Very lightweight markdown renderer — handles bold, italic, code, lists.
 * We intentionally avoid a full MD library to keep the bundle tiny.
 */
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];
  let keyCounter = 0;

  const flushList = () => {
    if (listBuffer.length) {
      elements.push(
        <ul key={`ul-${keyCounter++}`} className="list-disc pl-5 mb-2 space-y-0.5">
          {listBuffer.map((item, i) => (
            <li key={i}>{applyInline(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const applyInline = (str) => {
    // Split on bold/italic/code markers
    const parts = [];
    let remaining = str;
    const patterns = [
      { re: /\*\*(.+?)\*\*/g, render: (m, g) => <strong key={m}>{g}</strong> },
      { re: /\*(.+?)\*/g,     render: (m, g) => <em key={m}>{g}</em> },
      { re: /`(.+?)`/g,       render: (m, g) => <code key={m} className="font-mono text-xs bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">{g}</code> },
    ];

    // Simple sequential replacement approach
    let result = [str];
    for (const { re, render } of patterns) {
      result = result.flatMap((chunk) => {
        if (typeof chunk !== "string") return [chunk];
        const pieces = [];
        let last = 0;
        let match;
        re.lastIndex = 0;
        while ((match = re.exec(chunk)) !== null) {
          if (match.index > last) pieces.push(chunk.slice(last, match.index));
          pieces.push(render(match[0] + Math.random(), match[1]));
          last = match.index + match[0].length;
        }
        if (last < chunk.length) pieces.push(chunk.slice(last));
        return pieces.length ? pieces : [chunk];
      });
    }
    return result;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^[-*•]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*•]\s+/, ""));
      continue;
    }

    flushList();

    if (!trimmed) {
      elements.push(<br key={keyCounter++} />);
    } else {
      elements.push(
        <p key={keyCounter++} className="mb-1 last:mb-0 leading-relaxed">
          {applyInline(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center shadow-sm">
            <User size={13} className="text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-midnight-500 to-violet-600 flex items-center justify-center shadow-sm shadow-midnight-500/30">
            <Brain size={13} className="text-white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[80%] sm:max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isUser
              ? "bg-gradient-to-br from-midnight-500 to-violet-600 text-white rounded-tr-sm"
              : "glass-subtle text-slate-800 dark:text-slate-100 rounded-tl-sm"
            }
          `}
        >
          <div className="message-prose">
            {renderMarkdown(message.text)}
          </div>
        </div>

        {/* Timestamp + mode badge */}
        <div className={`flex items-center gap-2 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatTime(message.timestamp)}
          </span>
          {message.mode === "mock" && !isUser && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded
                             bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400
                             border border-amber-200 dark:border-amber-800/30">
              mock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}