import { useTheme } from "@/contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";

const GlitchOverlay = () => {
  const { isGlitching } = useTheme();

  return (
    <AnimatePresence>
      {isGlitching && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
        >
          {/* Rapid color inversion flashes */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundColor: [
                "rgba(0,255,65,0)",
                "rgba(0,255,65,0.4)",
                "rgba(0,0,0,1)",
                "rgba(0,255,65,0.2)",
                "rgba(0,0,0,0.9)",
                "rgba(0,255,65,0.6)",
                "rgba(0,0,0,1)",
              ],
            }}
            transition={{ duration: 0.4, times: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1] }}
          />

          {/* Horizontal scan lines racing down */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-[2px]"
              style={{ backgroundColor: "rgba(0,255,65,0.8)" }}
              initial={{ top: "-2px" }}
              animate={{ top: "100%" }}
              transition={{
                duration: 0.15,
                delay: i * 0.06,
                ease: "linear",
              }}
            />
          ))}

          {/* Glitch text flash */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.3, times: [0, 0.2, 0.4, 0.6, 1] }}
          >
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase"
              style={{ color: "rgba(0,255,65,0.7)" }}
            >
              [ SYSTEM BREACH ]
            </span>
          </motion.div>

          {/* Horizontal displacement bars */}
          {[20, 35, 55, 70, 85].map((top, i) => (
            <motion.div
              key={`bar-${i}`}
              className="absolute left-0 right-0 overflow-hidden"
              style={{ top: `${top}%`, height: `${3 + Math.random() * 8}px` }}
              animate={{
                x: [0, -20, 15, -8, 0],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className="w-full h-full" style={{ backgroundColor: "rgba(0,255,65,0.15)" }} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlitchOverlay;
