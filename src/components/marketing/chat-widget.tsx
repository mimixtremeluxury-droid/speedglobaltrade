"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, SendHorizonal, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

type ChatMessage = {
  id: string;
  sender: "advisor" | "client";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "intro",
    sender: "advisor",
    text: "Welcome to Speed Global Trade. Ask about onboarding, plans, or copy-trading access.",
  },
];

export function ChatWidget() {
  const chatOpen = useAppStore((state) => state.chatOpen);
  const setChatOpen = useAppStore((state) => state.setChatOpen);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const reply = (question: string) => {
    const lower = question.toLowerCase();
    const text = lower.includes("copy")
      ? "Our copy-trading mock lets you mirror expert allocations instantly from the dashboard."
      : lower.includes("plan")
        ? "You can compare Velocity Core through Sovereign Edge on the plans page and activate them from the dashboard."
        : "A premium advisor will usually respond here with allocation guidance, onboarding help, or funding support.";

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        sender: "advisor",
        text,
      },
    ]);
  };

  useEffect(() => {
    if (!chatOpen) return;
    if (messages.length === 1) return;
    const viewport = document.getElementById("chat-scroll");
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [chatOpen, messages]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const question = draft.trim();
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        sender: "client",
        text: question,
      },
    ]);
    setDraft("");
    window.setTimeout(() => reply(question), 600);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {chatOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="surface mb-4 w-[min(24rem,calc(100vw-2rem))] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="font-heading text-lg text-ink">Live Client Desk</p>
                <p className="text-xs uppercase tracking-[0.2em] text-body/45">Mock concierge support</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-full border border-white/10 p-2 text-body/70 transition hover:border-cyan/40 hover:text-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div id="chat-scroll" className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                      message.sender === "client"
                        ? "bg-gold text-midnight"
                        : "border border-white/10 bg-white/[0.04] text-body"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={onSubmit} className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask about onboarding, plans, or funding..."
                  className="h-12 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-body/40"
                />
                <button type="submit" className="rounded-full bg-cyan/15 p-2 text-cyan transition hover:bg-cyan/20">
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="gold-button shadow-glow"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Live Chat
      </button>
    </div>
  );
}
