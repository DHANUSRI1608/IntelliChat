import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Brain, User, Copy, Check, RotateCcw } from "lucide-react";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-3">
      {/* Language label + Copy button */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-t-lg
                      bg-slate-200/80 dark:bg-slate-700/80 border-b border-slate-300/40 dark:border-slate-600/40">
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400
                     hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none font-mono text-[13px] leading-relaxed
                      bg-slate-100/90 dark:bg-slate-800/90 p-3 rounded-b-lg overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code className="font-mono text-[13px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

export default function ChatMessage({ message, onRegenerate }) {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center shadow-sm ring-2 ring-white/50 dark:ring-slate-800/50">
            <User size={13} className="text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm shadow-indigo-400/20 ring-2 ring-white/50 dark:ring-slate-800/50">
            <Brain size={13} className="text-white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`group flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`
            relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-indigo-400/90 to-purple-400/80 text-white rounded-tr-sm"
                : "bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/30 text-slate-700 dark:text-slate-200 rounded-tl-sm"
            }
          `}
        >
          <div className="message-prose">
            {isUser ? (
              <p className="mb-0">{message.text}</p>
            ) : (
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    if (inline) {
                      return <InlineCode>{children}</InlineCode>;
                    }
                    return (
                      <CodeBlock className={className}>
                        {String(children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-slate-800 dark:text-white">{children}</strong>;
                  },
                  em({ children }) {
                    return <em className="italic text-slate-600 dark:text-slate-300">{children}</em>;
                  },
                  h1({ children }) {
                    return <h1 className="text-lg font-bold mb-2 mt-3 text-slate-800 dark:text-white">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-bold mb-2 mt-3 text-slate-800 dark:text-white">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-bold mb-1 mt-2 text-slate-800 dark:text-white">{children}</h3>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-3 border-indigo-300 dark:border-indigo-600 pl-3 my-2 text-slate-600 dark:text-slate-400 italic">
                        {children}
                      </blockquote>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                         className="text-indigo-500 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
            {/* Streaming cursor */}
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-indigo-400 dark:bg-indigo-400 ml-0.5 animate-cursor-blink align-middle" />
            )}
          </div>
        </div>

        {/* Footer: Timestamp + Actions */}
        <div
          className={`flex items-center gap-2 mt-1.5 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatTime(message.timestamp)}
          </span>

          {/* Action buttons (visible on hover) */}
          {!message.isStreaming && message.id !== "welcome" && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                title="Copy message"
                className="w-5 h-5 rounded flex items-center justify-center
                           text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              </button>
              {!isUser && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Regenerate response"
                  className="w-5 h-5 rounded flex items-center justify-center
                             text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  <RotateCcw size={11} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}