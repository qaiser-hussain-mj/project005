
"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const chatbotRules = rules as Rule[];

const greeting: Message = {
  id: 1,
  sender: "bot",
  text: "Assalam-o-Alaikum! Welcome to UOS Helpdesk Bot. 👋\n\nI can help you with university fees, admissions, timings, library services, and hostel information.\n\nHow can I help you today?",
};

const fallbackReply =
  "Sorry, I couldn't find a matching answer to your question. Please try asking about fees, admissions, university timings, the library, or hostels. For official and up-to-date information, contact the relevant University of Sargodha office.";

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(message: string): string {
  const normalizedMessage = normalizeMessage(message);

  for (const rule of chatbotRules) {
    const matched = rule.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeMessage(keyword))
    );

    if (matched) {
      return rule.reply;
    }
  }

  return fallbackReply;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(2);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  function handleSend() {
    const userText = input.trim();

    if (!userText || isTyping) return;

    const userMessage: Message = {
      id: nextId,
      sender: "user",
      text: userText,
    };

    const botMessage: Message = {
      id: nextId + 1,
      sender: "bot",
      text: getBotReply(userText),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput("");
    setNextId((previous) => previous + 2);
    setIsTyping(false);
    inputRef.current?.focus();
  }

  function handleClearChat() {
    setMessages([greeting]);
    setInput("");
    setNextId(2);
    setIsTyping(false);
    inputRef.current?.focus();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-3 py-5 font-sans text-slate-900 sm:px-6">
      <section className="flex h-[90vh] min-h-[520px] max-h-[850px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-blue-700 px-4 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl">
              🎓
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold sm:text-xl">
                UOS Helpdesk Bot
              </h1>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                University of Sargodha • Virtual Assistant
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-blue-100">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Ready to help
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="shrink-0 rounded-lg border border-white/30 px-3 py-2 text-xs font-medium transition hover:bg-white/10 sm:text-sm"
            aria-label="Clear chat and start again"
          >
            New chat
          </button>
        </header>

        {/* Chat messages */}
        <div
          className="flex-1 space-y-5 overflow-y-auto bg-slate-50 px-3 py-5 sm:px-6"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          <div className="text-center">
            <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
              Welcome to UOS Helpdesk
            </span>
          </div>

          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm">
                    🎓
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                    isUser
                      ? "rounded-br-sm bg-blue-700 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-line break-words">
                    {message.text}
                  </p>

                  <p
                    className={`mt-2 text-right text-[10px] ${
                      isUser ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {isUser ? "You" : "UOS Assistant"}
                  </p>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm">
                🎓
              </div>
              <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                Typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        <div className="border-t border-slate-100 bg-white px-3 pb-3 pt-3 sm:px-5">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Quick questions
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              "Fee structure",
              "Admission details",
              "University timings",
              "Library services",
              "Hostel information",
            ].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => {
                  setInput(question);
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="border-t border-slate-200 bg-white p-3 sm:p-5"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about fees, admissions, hostel..."
              aria-label="Type your question"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            >
              <span>Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2 11 13"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m22 2-7 20-4-9-9-4 20-7Z"
                />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            UOS Helpdesk Bot · Rule-based assistance · No live university connection
          </p>
        </form>
      </section>
    </main>
  );
}
