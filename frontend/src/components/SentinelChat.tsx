import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Terminal, X, Send, Eraser, AlertCircle } from "lucide-react";

// Matrix mode keeps the cyber-terminal flavor; every other theme gets a plain,
// friendly assistant vibe.
const HANDSHAKE_MATRIX = [
  "> INITIALIZING NEURAL PROXY...",
  "> ESTABLISHING SECURE HANDSHAKE (KYBER-512)...",
  "> IDENTITY VERIFIED.",
] as const;
const HANDSHAKE_FRIENDLY = [
  "Hi there! 👋",
  "I'm Prem's assistant.",
  "Ask me anything about his work or experience.",
] as const;

const PROCESSING_MATRIX = [
  "[SCANNING_INPUT]",
  "[SANITIZING_PII]",
  "[GENERATING_RESPONSE]",
] as const;
const PROCESSING_FRIENDLY = [
  "Reading...",
  "Thinking...",
  "Writing...",
] as const;

const TYPEWRITER_MS = 28;
const HANDSHAKE_INTERVAL_MS = 380;
const PROCESSING_STEP_MS = 600;
const PROCESSING_TOTAL_MS = PROCESSING_STEP_MS * PROCESSING_MATRIX.length;

type MessageRole = "system" | "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  typewriterLength?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface SentinelChatProps {
  isMatrixMode: boolean;
  isDarkMode?: boolean;
}

export default function SentinelChat({ isMatrixMode, isDarkMode = false }: SentinelChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [handshakeDone, setHandshakeDone] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handshakeStarted = useRef(false);

  // Mode-aware chat copy: matrix = cyber terminal, otherwise a plain assistant
  const HANDSHAKE_LINES = isMatrixMode ? HANDSHAKE_MATRIX : HANDSHAKE_FRIENDLY;
  const PROCESSING_STEPS = isMatrixMode ? PROCESSING_MATRIX : PROCESSING_FRIENDLY;
  const panelTitle = isMatrixMode ? "NEURAL PROXY" : "Prem's Assistant";

  // Theme helpers
  const isDark = isDarkMode || isMatrixMode;
  const bgColor = isMatrixMode ? "bg-black" : isDarkMode ? "bg-[#0a0a0a]" : "bg-white";
  const textColor = isMatrixMode ? "text-[#00ff41]" : isDarkMode ? "text-white" : "text-black";
  const mutedText = isMatrixMode ? "text-[#00ff41]/70" : isDarkMode ? "text-white/60" : "text-black/60";
  const borderColor = isMatrixMode ? "border-green-500/20" : isDarkMode ? "border-white/10" : "border-black/10";
  const placeholderColor = isMatrixMode ? "placeholder:text-[#00ff41]/50" : isDarkMode ? "placeholder:text-white/40" : "placeholder:text-black/40";
  const inputBorder = isMatrixMode ? "1px solid rgba(0,255,65,0.4)" : isDarkMode ? "1px solid rgba(255,255,255,0.3)" : "1px solid black";
  const fontClass = isMatrixMode ? "font-mono" : "font-sans";

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isOpen || handshakeStarted.current) return;
    handshakeStarted.current = true;
    setHandshakeDone(false);
    setMessages([]);
    HANDSHAKE_LINES.forEach((line, i) => {
      const id = `handshake-${i}-${Date.now()}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id, role: "system", content: line }]);
      }, i * HANDSHAKE_INTERVAL_MS);
    });
    const doneTimer = setTimeout(() => setHandshakeDone(true), HANDSHAKE_LINES.length * HANDSHAKE_INTERVAL_MS + 200);
    return () => clearTimeout(doneTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) handshakeStarted.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (!isTyping || messages.length === 0) {
      if (!isTyping) setProcessingStatus(null);
      return;
    }
    const last = messages[messages.length - 1];
    if (last.role !== "assistant" || last.typewriterLength === undefined) {
      setProcessingStatus(null);
      return;
    }
    const fullLen = last.content.length;
    if (last.typewriterLength >= fullLen) {
      setIsTyping(false);
      setProcessingStatus(null);
      return;
    }
    const t = setTimeout(() => {
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.length - 1;
        const current = next[idx];
        if (current.role === "assistant" && current.typewriterLength !== undefined) {
          next[idx] = { ...current, typewriterLength: Math.min((current.typewriterLength ?? 0) + 1, fullLen) };
        }
        return next;
      });
    }, TYPEWRITER_MS);
    return () => clearTimeout(t);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!processingStatus || !isTyping) {
      if (!isTyping && processingStatus) setProcessingStatus(null);
      return;
    }
    let step = 0;
    const id = setInterval(() => {
      if (!isTyping) { setProcessingStatus(null); clearInterval(id); return; }
      step = (step + 1) % PROCESSING_STEPS.length;
      setProcessingStatus(PROCESSING_STEPS[step]);
    }, PROCESSING_STEP_MS);
    return () => clearInterval(id);
  }, [processingStatus, isTyping]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !handshakeDone) return;
    if (!API_BASE_URL) { setError("API base URL is not configured."); return; }
    setInputValue("");
    setError(null);
    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setProcessingStatus(PROCESSING_STEPS[0]);
    setIsTyping(true);
    try {
      const history = messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role, content: m.content }));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.status === 429) {
        const errorData = await response.json();
        if (errorData.fallbackResponse || errorData.response) {
          const assistantMsg: Message = { id: `assistant-${Date.now()}`, role: "assistant", content: errorData.fallbackResponse || errorData.response, typewriterLength: 0 };
          setIsTyping(false);
          setProcessingStatus(null);
          setTimeout(() => setMessages((prev) => [...prev, assistantMsg]), PROCESSING_TOTAL_MS);
        } else {
          setError(`Rate limit exceeded. Please try again in ${errorData.retryAfter || "15 minutes"}.`);
          setIsTyping(false);
          setProcessingStatus(null);
        }
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const reply = data.response || "Error generating response";
      const assistantMsg: Message = { id: `assistant-${Date.now()}`, role: "assistant", content: reply, typewriterLength: 0 };
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(true);
        setProcessingStatus(null);
      }, PROCESSING_TOTAL_MS);
    } catch (err) {
      setIsTyping(false);
      setProcessingStatus(null);
      let errorMessage = "Failed to get response. Please try again.";
      if (err instanceof TypeError || (err instanceof Error && err.name === "AbortError")) {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: `[ERROR]: ${errorMessage}` }]);
    }
  };

  const runHandshake = useCallback(() => {
    setMessages([]);
    setHandshakeDone(false);
    HANDSHAKE_LINES.forEach((line, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: `handshake-${i}-${Date.now()}`, role: "system", content: line }]);
      }, i * HANDSHAKE_INTERVAL_MS);
    });
    setTimeout(() => setHandshakeDone(true), HANDSHAKE_LINES.length * HANDSHAKE_INTERVAL_MS + 200);
  }, []);

  const handleClear = () => {
    setProcessingStatus(null);
    setIsTyping(false);
    handshakeStarted.current = false;
    if (isOpen) runHandshake();
    else { setMessages([]); setHandshakeDone(false); }
  };

  const displayContent = (m: Message) => {
    if (m.role === "assistant" && m.typewriterLength !== undefined) return m.content.slice(0, m.typewriterLength);
    return m.content;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999]">
      {showLauncher && !isOpen && (
        <motion.button type="button"
          onClick={() => { setShowLauncher(false); setIsOpen(true); }}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-black border border-green-500/50 text-[#00ff41] focus:ring-green-500/50"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} aria-label="Open Neural Proxy">
          <Terminal className="h-6 w-6" />
        </motion.button>
      )}

      <AnimatePresence onExitComplete={() => { if (!isOpen) setShowLauncher(true); }}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className={`absolute bottom-20 right-0 flex w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-lg shadow-2xl transition-colors duration-500 border ${bgColor} ${fontClass} ${borderColor}`}
            style={{ maxHeight: "min(70vh, 520px)" }}
          >
            {/* CRT scanline overlay (Matrix only) */}
            {isMatrixMode && (
              <>
                <div className="pointer-events-none absolute inset-0 z-10 rounded-lg"
                  style={{ background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.06) 2px, rgba(0,255,65,0.06) 4px)" }}
                  aria-hidden />
                <div className="pointer-events-none absolute left-0 right-0 z-10 h-px bg-[#00ff41]/25"
                  style={{ top: 0, animation: "sentinel-scanline 3s linear infinite" }}
                  aria-hidden />
              </>
            )}

            {/* Header */}
            <div className={`flex items-center justify-between border-b px-4 py-3 transition-colors duration-500 ${borderColor} ${textColor}`}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium tracking-tight">{panelTitle}</span>
                {processingStatus && (
                  <span className={`ml-2 text-xs ${mutedText}`}>{processingStatus}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleClear}
                  className={`rounded p-1.5 transition-colors hover:opacity-80 focus:outline-none focus:ring-1 ${textColor}`}
                  aria-label="Clear terminal">
                  <Eraser className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setIsOpen(false)}
                  className={`rounded p-1.5 transition-colors hover:opacity-80 focus:outline-none focus:ring-1 ${textColor}`}
                  aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 text-sm" style={{ minHeight: "200px" }}>
              {messages.map((m) => (
                <div key={m.id} className={`mb-2 ${
                  m.role === "system" ? mutedText
                  : m.role === "user" ? textColor
                  : m.content.startsWith("[ERROR]")
                    ? isMatrixMode ? "text-red-400" : isDarkMode ? "text-red-400" : "text-red-600"
                  : textColor
                }`}>
                  {m.role === "user" && "> "}
                  <span className="whitespace-pre-wrap break-words">{displayContent(m)}</span>
                  {m.role === "assistant" && m.typewriterLength !== undefined && m.typewriterLength < m.content.length && (
                    <span className={`inline-block h-4 w-0.5 align-middle animate-pulse ${isMatrixMode ? "bg-[#00ff41]" : isDarkMode ? "bg-white" : "bg-black"}`} aria-hidden />
                  )}
                </div>
              ))}
              {error && (
                <div className={`mt-2 p-2 rounded text-xs flex items-center gap-2 ${
                  isDark ? "bg-red-900/20 text-red-400 border border-red-500/30" : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={`border-t ${borderColor}`}>
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3">
                  <input type="text" value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                    placeholder={handshakeDone ? "Enter query..." : "Initializing..."}
                    disabled={!handshakeDone || isTyping}
                    className={`w-full bg-transparent text-sm outline-none transition-colors duration-500 ${textColor} ${placeholderColor}`}
                    style={{ border: "none", borderBottom: inputBorder, borderRadius: 0 }}
                    aria-label="Query input"
                  />
                  <button type="submit" disabled={!handshakeDone || !inputValue.trim() || isTyping}
                    className={`shrink-0 rounded p-2 transition-all disabled:opacity-40 ${textColor} hover:opacity-80`}
                    aria-label="Send">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className={`px-4 pb-3 pt-2 border-t ${borderColor}`}>
                  <p className={`text-[10px] uppercase tracking-wider ${mutedText}`}>
                    [SECURE_AUDIT_ACTIVE]: All interactions are logged for threat intelligence and security research.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}