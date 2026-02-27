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

  const glowClass = mode === "matrix" ? "text-glow-strong" : "";

  return (
    <motion.section
      ref={sectionRef}
      variants={container}
      initial="hidden"
      animate="visible"
      className="w-full relative overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* ── NAME ── */}
      <motion.h1
        variants={item}
        className={`font-display uppercase leading-[0.82] text-foreground text-center w-full relative z-10 ${glowClass}`}
        style={{
          // FIX: minimum was 5rem (80px) — caused overflow on phones.
          // New minimum 2.4rem (38px) fits "PREM MADISHETTY" on 320px screens.
          fontSize: "clamp(2.4rem, 10.5vw, 36rem)",
          letterSpacing: "-0.04em",
          paddingTop: "clamp(80px, 18dvh, 170px)",
          // Prevent overflow on very small screens
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {displayText || " "}
      </motion.h1>

      {/* ── BASED IN CALIFORNIA ── */}
      <motion.div
        variants={item}
        className="w-full flex justify-end relative z-10"
        style={{ paddingRight: "clamp(16px, 7vw, 140px)" }}
      >
        <span
          className={`font-mono uppercase text-foreground ${glowClass}`}
          style={{
            fontSize: "clamp(0.55rem, 0.85vw, 0.95rem)",
            letterSpacing: "0.4em",
          }}
        >
          Based in California
        </span>
      </motion.div>

      {/* ── PORTRAIT + LABELS ── */}
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

          {/* ── DESKTOP LABELS: float left of portrait ── */}
          {/* FIX: hidden on mobile (< md), shown on desktop */}
          <div
            className="absolute left-0 bottom-[12%] hidden md:flex flex-col gap-0"
            style={{ transform: "translateX(calc(-100% - 24px))" }}
          >
            <span
              className={`font-display uppercase text-foreground leading-tight whitespace-nowrap ${glowClass}`}
              style={{ fontSize: "clamp(1rem, 1.6vw, 2rem)", letterSpacing: "0.02em" }}
            >
              /Cybersecurity
            </span>
            <span
              className={`font-display uppercase text-foreground leading-tight whitespace-nowrap ${glowClass}`}
              style={{ fontSize: "clamp(1rem, 1.6vw, 2rem)", letterSpacing: "0.02em" }}
            >
              /AI Security
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE LABELS: shown below name, above portrait ── */}
      {/* FIX: only visible on mobile (< md). Clean, readable, no overflow. */}
      <motion.div
        variants={item}
        className="md:hidden absolute z-10 flex flex-col gap-0"
        style={{
          // Sits just below the name — roughly 22% from top
          top: "clamp(110px, 26dvh, 200px)",
          left: "clamp(16px, 5vw, 32px)",
        }}
      >
        <span
          className={`font-display uppercase text-foreground leading-tight ${glowClass}`}
          style={{ fontSize: "clamp(0.9rem, 4.5vw, 1.4rem)", letterSpacing: "0.02em" }}
        >
          /Cybersecurity
        </span>
        <span
          className={`font-display uppercase text-foreground leading-tight ${glowClass}`}
          style={{ fontSize: "clamp(0.9rem, 4.5vw, 1.4rem)", letterSpacing: "0.02em" }}
        >
          /AI Security
        </span>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
