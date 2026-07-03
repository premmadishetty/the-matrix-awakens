import { useState, useEffect, useCallback, useRef } from "react";

const DIALOGUE = [
  "Wake up, Neo.",
  "The Matrix has you...",
  "Follow the Golden Lotus.",
];

interface TerminalScreenProps {
  onComplete: () => void;
}

const TerminalScreen = ({ onComplete }: TerminalScreenProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(true);
  const [isPausing, setIsPausing] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const typeText = useCallback((text: string, onDone: () => void) => {
    setIsTyping(true);
    setCurrentText("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setDisplayedLines((prev) => [...prev, text]);
        setCurrentText("");
        onDone();
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const advanceLine = useCallback(() => {
    if (isTyping || isPausing) return;

    const nextIndex = currentLineIndex + 1;

    if (nextIndex >= DIALOGUE.length) {
      // Clear text, show only cursor, hold briefly, then hand off to the rain
      setIsPausing(true);
      setDisplayedLines([]);
      setCurrentText("");
      pauseTimerRef.current = setTimeout(() => {
        onComplete();
      }, 2000);
      return;
    }

    setCurrentLineIndex(nextIndex);
    setWaitingForInput(false);

    typeText(DIALOGUE[nextIndex], () => {
      setWaitingForInput(true);
    });
  }, [currentLineIndex, isTyping, isPausing, onComplete, typeText]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (waitingForInput && !isPausing) {
        advanceLine();
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [advanceLine, waitingForInput, isPausing]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-8 overflow-hidden cursor-pointer">
      <div className="scanline fixed inset-0 pointer-events-none z-10" />
      <div className="max-w-2xl w-full">
        {!isPausing &&
          displayedLines.map((line, i) => (
            <div key={i} className="mb-2">
              <span className="font-mono text-lg text-foreground text-glow">
                {line}
              </span>
            </div>
          ))}

        {!isPausing && currentText && (
          <div className="mb-2">
            <span className="font-mono text-lg text-foreground text-glow">
              {currentText}
              <span className="inline-block w-3 h-5 bg-foreground ml-0.5 align-middle animate-cursor-blink" />
            </span>
          </div>
        )}

        {/* Blinking cursor — shown idle, between lines, and during the final pause */}
        {!isTyping && !currentText && (
          <div className="mb-2">
            <span className="inline-block w-3 h-5 bg-foreground animate-cursor-blink" />
          </div>
        )}
      </div>

      {waitingForInput && !isPausing && (
        <span className="fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/30">
          [ click to continue ]
        </span>
      )}
    </div>
  );
};

export default TerminalScreen;
