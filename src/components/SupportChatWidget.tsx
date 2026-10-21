"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "What is your sizing guide?",
  "Fabric & GSM specs?",
  "How long does delivery take?",
  "Recommend a drop",
];

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Gudumba Concierge online. Sizing, fabric specs, or styling — what's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Stay unapologetic. Anything else?" }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Connection blip. Hit us on IG @only.gudumba or ask another question." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Concierge"
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#c8410a] text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <MessageSquare size={17} className="text-[#c8410a] group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase pr-1">Concierge</span>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#141310] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#141414] border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center">
                <Sparkles size={14} className="text-[#c8410a]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">GUDUMBA® AI</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 text-[9px] font-mono rounded border border-emerald-800">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#777] tracking-wider">Streetwear Styling & Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#777] hover:text-white rounded-lg hover:bg-[#222] transition-colors"
              aria-label="Close Chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#c8410a] text-white font-medium"
                      : "bg-[#181818] border border-[#282828] text-[#e0e0e0]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#181818] border border-[#282828] text-[#999] px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-[#c8410a]" />
                  <span>Checking catalog & specs...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-3 py-2 bg-[#171512] border-t border-[#1e1e1e] flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="shrink-0 text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#c8410a] transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#141414] border-t border-[#222] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sizing, drops, fabric..."
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-[#c8410a] hover:bg-[#d94d12] disabled:opacity-40 text-white rounded-xl transition-colors"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
