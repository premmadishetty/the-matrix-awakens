import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import portraitBW from "@/assets/portrait-bw.png";
import portraitMatrix from "@/assets/portrait-matrix.png";

const FINAL_TEXT = "PREM MADISHETTY";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/\\|{}[]";
const SCRAMBLE_DURATION = 1800;
const SCRAMBLE_INTERVAL = 40;

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const HeroSection = () => {
  const { mode } = useTheme();
  const portrait = mode === "matrix" ? portraitMatrix : portraitBW;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const scrambleStarted = useRef(false);

  const startScramble = useCallback(() => {
    if (scrambleStarted.current) return;
    scrambleStarted.current = true;
    const totalFrames = Math.floor(SCRAMBLE_DURATION / SCRAMBLE_INTERVAL);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockedCount = Math.floor(progress * FINAL_TEXT.length);
      let result = "";
      for (let i = 0; i < FINAL_TEXT.length; i++) {
        if (i < lockedCount) {
          result += FINAL_TEXT[i];
        } else if (FINAL_TEXT[i] === " ") {
          result += " ";
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplayText(result);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(FINAL_TEXT);
      }
    }, SCRAMBLE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(startScramble, 600);
    return () => clearTimeout(t);
  }, [startScramble]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, (scrolled - sectionHeight * 0.15) / (sectionHeight * 0.55)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageOpacity = 1 - scrollProgress;
  const imageScale = 1 - scrollProgress * 0.12;
  const imageTranslateY = scrollProgress * 50;

  return (
    <motion.section
      ref={sectionRef}
      variants={container}
      initial="hidden"
      animate="visible"
      className="w-full relative overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <motion.h1
        variants={item}
        className={`font-display uppercase leading-[0.82] text-foreground whitespace-nowrap text-center w-full relative z-10 ${
          mode === "matrix" ? "text-glow-strong" : ""
        }`}
        style={{
          fontSize: "clamp(5rem, 17.8vw, 36rem)",
          letterSpacing: "-0.04em",
          paddingTop: "clamp(80px, 18dvh, 170px)",
        }}
      >
        {displayText || " "}
      </motion.h1>

      {/* "Based in California" ends before the last t in MADISHETTY */}
      <motion.div
        variants={item}
        className="w-full flex justify-end relative z-10"
        style={{ paddingRight: "clamp(50px, 7vw, 140px)" }}
      >
        <span
          className={`font-mono uppercase text-foreground ${
            mode === "matrix" ? "text-glow-strong" : ""
          }`}
          style={{
            fontSize: "clamp(0.55rem, 0.85vw, 0.95rem)",
            letterSpacing: "0.4em",
          }}
        >
          Based in California
        </span>
      </motion.div>

      <motion.div
        variants={item}
        className="absolute bottom-0 left-1/2"
        style={{
          opacity: imageOpacity,
          transform: `translateX(-50%) scale(${imageScale}) translateY(${imageTranslateY}px)`,
          willChange: "opacity, transform",
          height: "80dvh",
        }}
      >
        <div className="relative h-full flex items-end justify-center">
          <img
            src={portrait}
            alt="Prem Madishetty"
            className="h-full w-auto object-contain object-bottom"
          />
          <div className="absolute left-0 bottom-[12%] flex flex-col gap-0"
            style={{ transform: "translateX(calc(-100% - 24px))" }}
          >
            <span
              className={`font-display uppercase text-foreground leading-tight whitespace-nowrap ${
                mode === "matrix" ? "text-glow-strong" : ""
              }`}
              style={{ fontSize: "clamp(1rem, 1.6vw, 2rem)", letterSpacing: "0.02em" }}
            >
              /Cybersecurity
            </span>
            <span
              className={`font-display uppercase text-foreground leading-tight whitespace-nowrap ${
                mode === "matrix" ? "text-glow-strong" : ""
              }`}
              style={{ fontSize: "clamp(1rem, 1.6vw, 2rem)", letterSpacing: "0.02em" }}
            >
              /AI Security
            </span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
