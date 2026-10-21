"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors: Record<ToastType, string> = {
    success: "border-green-700 bg-green-950 text-green-100",
    error: "border-red-700 bg-red-950 text-red-100",
    info: "border-[#333] bg-[#0e0e0e] text-[#f2f0ed]",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div
        className="fixed bottom-6 right-4 z-[200] flex flex-col gap-3 w-[320px] max-w-[calc(100vw-2rem)]"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              role="alert"
              className={`flex items-center gap-3 px-4 py-3 border rounded-sm text-sm animate-fade-up ${colors[t.type]}`}
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
                className="opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
