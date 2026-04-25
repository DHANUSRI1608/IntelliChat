import React from "react";

const SUGGESTIONS = [
  {
    icon: "💻",
    label: "Write Code",
    prompt: "Write a Python function to find the fibonacci sequence using dynamic programming.",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    border: "border-blue-200/40 dark:border-blue-800/20",
  },
  {
    icon: "✍️",
    label: "Creative Writing",
    prompt: "Write a short poem about the beauty of a starry night sky.",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    border: "border-purple-200/40 dark:border-purple-800/20",
  },
  {
    icon: "🔬",
    label: "Explain Science",
    prompt: "Explain quantum entanglement in simple terms that anyone can understand.",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    border: "border-emerald-200/40 dark:border-emerald-800/20",
  },
  {
    icon: "📊",
    label: "Data Analysis",
    prompt: "What are the best techniques for analyzing large datasets and finding patterns?",
    gradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
    border: "border-amber-200/40 dark:border-amber-800/20",
  },
  {
    icon: "🏛️",
    label: "History",
    prompt: "What were the key events that led to the Renaissance period in Europe?",
    gradient: "from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20",
    border: "border-rose-200/40 dark:border-rose-800/20",
  },
  {
    icon: "🧮",
    label: "Math Help",
    prompt: "Explain the concept of derivatives in calculus with a real-world example.",
    gradient: "from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20",
    border: "border-cyan-200/40 dark:border-cyan-800/20",
  },
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mb-4 font-body">
        Try asking about…
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SUGGESTIONS.map(({ icon, label, prompt, gradient, border }, i) => (
          <button
            key={label}
            onClick={() => onSelect(prompt)}
            className={`
              bg-gradient-to-br ${gradient}
              border ${border}
              rounded-xl px-3.5 py-3 text-left
              hover:scale-[1.03] hover:shadow-md
              transition-all duration-200
              animate-slide-up group
            `}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            <span className="text-lg block mb-1">{icon}</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}