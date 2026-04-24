import React from "react";


const SUGGESTIONS = [
  { icon: "🏛️", label: "Fall of Rome", prompt: "What caused the fall of the Roman Empire?" },
  { icon: "🔬", label: "DNA discovery", prompt: "Who discovered the structure of DNA and how?" },
  { icon: "🌍", label: "WW2 turning points", prompt: "What were the major turning points of World War II?" },
  { icon: "🚀", label: "Space race", prompt: "Explain the Space Race between the US and USSR." },
  { icon: "⚡", label: "Quantum physics", prompt: "What is quantum mechanics in simple terms?" },
  { icon: "🗺️", label: "Largest countries", prompt: "What are the 10 largest countries by land area?" },
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="px-4 py-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-4 font-body">
          Try asking about…
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUGGESTIONS.map(({ icon, label, prompt }) => (
            <button
              key={label}
              onClick={() => onSelect(prompt)}
              className="glass-subtle rounded-xl px-3 py-2.5 text-left
                         hover:bg-midnight-50/60 dark:hover:bg-midnight-900/30
                         border border-white/60 dark:border-midnight-700/30
                         transition-all duration-200 hover:scale-[1.02] hover:shadow-md
                         group"
            >
              <span className="text-base block mb-0.5">{icon}</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-midnight-600 dark:group-hover:text-midnight-300 transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}