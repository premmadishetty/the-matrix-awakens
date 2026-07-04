import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixRain from "./MatrixRain";

type Phase = "rain2d" | "zoom";

interface MatrixTransitionProps {
  onComplete: () => void;
}

// Dense 2D rain → slow deep zoom through the streams → fade into the site.
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

  // Phase 1 → Phase 2: after ~2.6s of dense rain, begin the zoom
  useEffect(() => {
    if (phase !== "rain2d") return;
    const timer = setTimeout(() => setPhase("zoom"), 2600);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2 → done: slow zoom lasts ~2.4s, then a graceful fade
  useEffect(() => {
    if (phase !== "zoom") return;
    const timer = setTimeout(finish, 2400);
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

      <AnimatePresence mode="wait">
        {/* Phase 1: dense flat 2D rain */}
        {phase === "rain2d" && (
          <motion.div
            key="rain2d"
            className="fixed inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MatrixRain dense fade={0.04} />
          </motion.div>
        )}

        {/* Phase 2: slow deep zoom through the rain — scales gently so the
            character streams stay dense and rush past instead of thinning out */}
        {phase === "zoom" && (
          <motion.div
            key="zoom"
            className="fixed inset-0"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 2.4, ease: [0.45, 0, 0.55, 1] }}
            style={{ transformOrigin: "center center" }}
          >
            <MatrixRain dense fade={0.03} speed={1.3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MatrixTransition;
