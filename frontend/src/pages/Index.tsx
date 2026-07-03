import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TerminalScreen from "@/components/TerminalScreen";
import MatrixTransition from "@/components/MatrixTransition";
import Portfolio from "@/components/Portfolio";

type Stage = "terminal" | "transition" | "portfolio";

const Index = () => {
  const [stage, setStage] = useState<Stage>("terminal");

  const handleTerminalComplete = useCallback(() => {
    setStage("transition");
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setStage("portfolio");
  }, []);

  return (
    <div className="bg-background min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === "terminal" && (
          <motion.div
            key="terminal"
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            <TerminalScreen onComplete={handleTerminalComplete} />
          </motion.div>
        )}

        {stage === "transition" && (
          <motion.div
            key="transition"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <MatrixTransition onComplete={handleTransitionComplete} />
          </motion.div>
        )}

        {stage === "portfolio" && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Portfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
