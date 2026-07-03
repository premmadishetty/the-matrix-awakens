import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatrixRain from "./MatrixRain";
import Matrix3DCanvas from "./Matrix3DCanvas";

type Phase = "rain2d" | "zoom" | "rain3d";

interface MatrixTransitionProps {
  onComplete: () => void;
}

const MatrixTransition = ({ onComplete }: MatrixTransitionProps) => {
  const [phase, setPhase] = useState<Phase>("rain2d");
  const [exiting, setExiting] = useState(false);

  // Phase 1 → Phase 2: after 3s of 2D rain, begin zoom
  useEffect(() => {
    if (phase !== "rain2d") return;
    const timer = setTimeout(() => setPhase("zoom"), 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2 → Phase 3: zoom lasts ~1.2s then switch to 3D
  useEffect(() => {
    if (phase !== "zoom") return;
    const timer = setTimeout(() => setPhase("rain3d"), 1200);
    return () => clearTimeout(timer);
  }, [phase]);

  // 200ms buffer after the 3D zoom ends, then a 300ms fade-out before unmounting
  const handle3DComplete = useCallback(() => {
    setTimeout(() => setExiting(true), 200);
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-background overflow-hidden"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Scanline overlay always on top */}
      <div className="scanline fixed inset-0 pointer-events-none z-20" />

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

        {/* Phase 3: 3D depth fly-through */}
        {phase === "rain3d" && (
          <motion.div
            key="rain3d"
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Matrix3DCanvas onComplete={handle3DComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MatrixTransition;
