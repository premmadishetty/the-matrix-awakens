import { useState, useEffect, useRef, useCallback } from "react";

const DIALOGUE = [
  "Wake up, Neo.",
  "The Matrix has you...",
  "Follow the Golden Lotus.",
];

const TYPE_MS = 45;
const LINE_PAUSE_MS = 650;
const FINAL_PAUSE_MS = 1400;
const START_DELAY_MS = 700;

interface TerminalScreenProps {
  onComplete: () => void;
}

// Auto-playing terminal intro — no clicks required; any click/key skips straight through
const TerminalScreen = ({ onComplete }: TerminalScreenProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isPausing, setIsPausing] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timersRef.current.forEach(clearTimeout);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timers = timersRef.current;
    let t = START_DELAY_MS;

    DIALOGUE.forEach((line) => {
      for (let i = 1; i <= line.length; i++) {
        const slice = line.slice(0, i);
        timers.push(setTimeout(() => setCurrentText(slice), t));
        t += TYPE_MS;
      }
      timers.push(
        setTimeout(() => {
          setDisplayedLines((prev) => [...prev, line]);
          setCurrentText("");
        }, t)
      );
      t += LINE_PAUSE_MS;
    });

    // Clear screen, hold on the lone cursor, then hand off to the rain
    timers.push(
      setTimeout(() => {
        setIsPausing(true);
        setDisplayedLines([]);
        setCurrentText("");
      }, t)
    );
    timers.push(setTimeout(finish, t + FINAL_PAUSE_MS));

    return () => timers.forEach(clearTimeout);
  }, [finish]);

  // Any interaction skips the whole intro
  useEffect(() => {
    window.addEventListener("click", finish);
    window.addEventListener("keydown", finish);
    return () => {
      window.removeEventListener("click", finish);
      window.removeEventListener("keydown", finish);
    };
  }, [finish]);

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
        {!currentText && (
          <div className="mb-2">
            <span className="inline-block w-3 h-5 bg-foreground animate-cursor-blink" />
          </div>
        )}
      </div>

      <span className="fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/30">
        [ click to skip ]
      </span>
    </div>
  );
};

export default TerminalScreen;
