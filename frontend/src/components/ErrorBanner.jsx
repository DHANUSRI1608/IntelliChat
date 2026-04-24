import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex-shrink-0 px-4 py-2 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
          <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700 dark:text-red-300 flex-1">{message}</p>
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}