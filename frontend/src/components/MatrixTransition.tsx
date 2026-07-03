import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixRain from "./MatrixRain";

type Phase = "rain2d" | "zoom";

interface MatrixTransitionProps {
  onComplete: () => void;
}

// 2D rain → zoom → fade out. (The old 3D fly-through phase was cut.)
const MatrixTransition = ({ onComplete }: MatrixTransitionProps) => {
  const [phase, setPhase] = useState<Phase>("rain2d");
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    setTimeout(() => onComplete(), 300);
  }, [onComplete]);

  // Phase 1 → Phase 2: after 2.5s of 2D rain, begin zoom
  useEffect(() => {
    if (phase !== "rain2d") return;
    const timer = setTimeout(() => setPhase("zoom"), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2 → done: zoom lasts ~1.2s, then a short buffer and graceful fade out
  useEffect(() => {
    if (phase !== "zoom") return;
    const timer = setTimeout(finish, 1400);
    return () => clearTimeout(timer);
  }, [phase, finish]);

  return (
    <motion.div
      className="fixed inset-0 bg-background overflow-hidden cursor-pointer"
      onClick={finish}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Scanline overlay always on top */}
      <div className="scanline fixed inset-0 pointer-events-none z-20" />
      <span className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 font-mono text-[10px] tracking-[0.3em] uppercase text-green-500/40 pointer-events-none">
        [ click to skip ]
      </span>

      <AnimatePresence mode="wait">
        {/* Phase 1: Flat 2D rain */}
        {phase === "rain2d" && (
          <motion.div
            key="rain2d"
            className="fixed inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MatrixRain />
          </motion.div>
        )}

        {/* Phase 2: 2D rain with zoom-in effect */}
        {phase === "zoom" && (
          <motion.div
            key="zoom"
            className="fixed inset-0"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <MatrixRain />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MatrixTransition;
