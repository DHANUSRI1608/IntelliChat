import React, { useState } from "react";
import {
  MessageSquarePlus,
  X,
  Trash2,
  MessageCircle,
  Search,
} from "lucide-react";

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onNewChat,
  onSwitchTo,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto
          w-72 flex flex-col
          bg-white/80 dark:bg-slate-900/90
          backdrop-blur-xl
          border-r border-slate-200/60 dark:border-slate-700/40
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/40">
          <div>
            <h2 className="font-display font-semibold text-sm text-slate-700 dark:text-slate-200">
              Conversations
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {conversations.length} saved chat{conversations.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center
                       text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl
                       bg-gradient-to-r from-indigo-400/90 to-purple-400/80
                       text-white text-sm font-medium
                       hover:from-indigo-500/90 hover:to-purple-500/80
                       transition-all duration-200 hover:shadow-md hover:shadow-indigo-300/20
                       active:scale-[0.98]"
          >
            <MessageSquarePlus size={15} />
            New Chat
          </button>
        </div>

        {/* Search */}
        {conversations.length > 0 && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats…"
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs
                           bg-slate-100/80 dark:bg-slate-800/60
                           border border-slate-200/60 dark:border-slate-700/40
                           text-slate-700 dark:text-slate-300
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           outline-none focus:ring-1 focus:ring-indigo-300/50
                           transition-all"
              />
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {search ? "No matching chats" : "No conversations yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSwitchTo(conv.id);
                    onClose();
                  }}
                  className={`
                    group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer
                    transition-all duration-150
                    ${
                      conv.id === activeId
                        ? "bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {conv.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {timeAgo(conv.createdAt)}
                      {conv.messages.length > 0 &&
                        ` · ${conv.messages.filter((m) => m.id !== "welcome").length} msgs`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0
                               w-6 h-6 rounded-md flex items-center justify-center
                               text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
                               transition-all duration-150"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
