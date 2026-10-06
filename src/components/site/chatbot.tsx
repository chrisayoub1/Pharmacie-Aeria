"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "bot"; text: string };

type Lang = "fr" | "en" | "ar";

const WELCOME: Record<Lang, string> = {
  fr: "Bonjour 👋 Je suis l'assistant virtuel de la Pharmacie Aeria. Comment puis-je vous aider aujourd'hui ?",
  en: "Hello 👋 I'm the virtual assistant of Pharmacie Aeria. How can I help you today?",
  ar: "مرحبا 👋 أنا المساعد الافتراضي لصيدلية أيريا. كيف يمكنني مساعدتكم اليوم؟",
};

const QUICK_PROMPTS: Record<Lang, string[]> = {
  fr: ["Quels sont vos services ?", "Où vous trouver ?", "Comment vous contacter ?"],
  en: ["What are your services?", "Where can I find you?", "How can I contact you?"],
  ar: ["ما هي خدماتكم؟", "أين يمكنني أن أجدكم؟", "كيف أتواصل معكم؟"],
};

const UI_STRINGS: Record<Lang, { suggestions: string; call: string; directions: string; placeholder: string; online: string; errApi: string; errNet: string }> = {
  fr: {
    suggestions: "Suggestions",
    call: "Appeler",
    directions: "Itinéraire",
    placeholder: "Écrivez votre message…",
    online: "En ligne · répond en quelques secondes",
    errApi: "Désolé, je ne peux pas répondre pour le moment. Appelez-nous au 05 29 12 23 23.",
    errNet: "Une erreur est survenue. N'hésitez pas à nous appeler au 05 29 12 23 23.",
  },
  en: {
    suggestions: "Suggestions",
    call: "Call",
    directions: "Directions",
    placeholder: "Type your message…",
    online: "Online · replies in seconds",
    errApi: "Sorry, I can't answer right now. Please call us at 05 29 12 23 23.",
    errNet: "Something went wrong. Feel free to call us at 05 29 12 23 23.",
  },
  ar: {
    suggestions: "اقتراحات",
    call: "اتصال",
    directions: "الاتجاهات",
    placeholder: "اكتب رسالتك…",
    online: "متصل · يرد خلال ثوان",
    errApi: "عذرا، لا أستطيع الرد الآن. يرجى الاتصال بنا على 05 29 12 23 23.",
    errNet: "حدث خطأ ما. لا تترددوا في الاتصال بنا على 05 29 12 23 23.",
  },
};

const LANG_LABELS: Record<Lang, string> = { fr: "FR", en: "EN", ar: "ع" };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: WELCOME.fr },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Msg[] = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .slice(1) // skip the initial welcome message
            .map((m) => ({
              role: m.role === "bot" ? "assistant" : "user",
              content: m.text,
            })),
        }),
      });
      const data = await res.json();
      // Follow the language detected by the API for the conversation
      if (data.lang && data.lang !== lang) setLang(data.lang);
      const reply = data.ok && data.reply ? data.reply : UI_STRINGS[lang].errApi;
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: UI_STRINGS[lang].errNet },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Manual language switch: reset the conversation in the chosen language
  const switchLang = (l: Lang) => {
    if (l === lang) return;
    setLang(l);
    setMessages([{ role: "bot", text: WELCOME[l] }]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        aria-label="Ouvrir l'assistant"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Pulsing rings */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          </>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="avatar"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 h-full w-full"
            >
              {/* Avatar image with breathing animation */}
              <div className="h-full w-full animate-carter-breathe">
                <Image
                  src="/chatbot-avatar-sm.png"
                  alt="Assistant Pharmacie Aeria"
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {hasNew && !open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 z-20">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-36 sm:bottom-24 right-3 sm:right-5 z-[60] flex h-[520px] max-h-[70vh] sm:max-h-[75vh] w-[calc(100vw-1.5rem)] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-foreground/20"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 bg-gradient-to-br from-primary to-[#0d5d56] px-5 py-4 text-white">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur overflow-hidden">
                <Image
                  src="/chatbot-avatar-sm.png"
                  alt="Assistant Pharmacie Aeria"
                  fill
                  sizes="44px"
                  className="object-contain p-0.5"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-medium leading-tight">
                  Assistant Pharmacie Aeria
                </p>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {UI_STRINGS[lang].online}
                </p>
              </div>
              {/* Language switcher */}
              <div className="flex items-center gap-0.5 rounded-full bg-white/15 p-0.5 ring-1 ring-white/25">
                {(["fr", "en", "ar"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchLang(l)}
                    aria-label={l === "fr" ? "Français" : l === "en" ? "English" : "العربية"}
                    className={
                      "rounded-full px-2 py-1 text-[11px] font-semibold transition-colors " +
                      (lang === l
                        ? "bg-white text-primary"
                        : "text-white/75 hover:bg-white/15 hover:text-white")
                    }
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto scrollbar-thin bg-secondary/40 px-4 py-4"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    dir="auto"
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-white shadow-sm"
                        : "max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm ring-1 ring-border"
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator with avatar */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border">
                    <Image
                      src="/chatbot-avatar-sm.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-border">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              )}

              {/* Quick prompts (only at start) */}
              {messages.length <= 1 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 pt-1"
                >
                  <p dir="auto" className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {UI_STRINGS[lang].suggestions}
                  </p>
                  {QUICK_PROMPTS[lang].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className="block w-full rounded-xl border border-border bg-white px-3.5 py-2 text-left text-sm text-foreground transition-all hover:border-primary/40 hover:bg-accent/40"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Quick contact footer */}
            <div className="flex items-center gap-2 border-t border-border bg-white px-3 py-2">
              <a
                href="tel:0529122323"
                className="flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-medium text-primary"
              >
                <Phone className="h-3.5 w-3.5" />
                {UI_STRINGS[lang].call}
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Pharmacie+Aeria+Aeria+Mall+Casablanca"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-medium text-primary"
              >
                <MapPin className="h-3.5 w-3.5" />
                {UI_STRINGS[lang].directions}
              </a>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                dir="auto"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={UI_STRINGS[lang].placeholder}
                disabled={loading}
                className="flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
