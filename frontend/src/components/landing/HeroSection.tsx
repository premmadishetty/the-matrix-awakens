import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import portraitBW from "@/assets/portrait-bw.png";
import portraitMatrix from "@/assets/portrait-matrix.png";

// TO ADD MORE PHOTOS: import them above and add to portraitOptions array
const portraitOptions = [
  portraitBW,
  // Add more imports here as: import portrait2 from "@/assets/portrait-2.png";
];

const FINAL_TEXT = "PREM MADISHETTY";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/\\|{}[]";
const SCRAMBLE_DURATION = 1800;
const SCRAMBLE_INTERVAL = 40;

const TYPEWRITER_TITLES = [
  "Cybersecurity Analyst",
  "AI Security Researcher",
  "SOC Engineer",
  "Threat Intelligence Specialist",
  "DevSecOps Engineer",
];
const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1800;

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
  // Random portrait on each visit; matrix mode always uses the matrix portrait
  const [activePortrait] = useState<string>(() =>
    portraitOptions[Math.floor(Math.random() * portraitOptions.length)]
  );
  const portrait = mode === "matrix" ? portraitMatrix : activePortrait;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const scrambleStarted = useRef(false);

  // Typewriter: type → hold → delete → next title, forever
  const [titleIndex, setTitleIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const [typePhase, setTypePhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const current = TYPEWRITER_TITLES[titleIndex];
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typePhase === "typing") {
      if (typedTitle.length < current.length) {
        timer = setTimeout(() => setTypedTitle(current.slice(0, typedTitle.length + 1)), TYPE_MS);
      } else {
        setTypePhase("holding");
      }
    } else if (typePhase === "holding") {
      timer = setTimeout(() => setTypePhase("deleting"), HOLD_MS);
    } else {
      if (typedTitle.length > 0) {
        timer = setTimeout(() => setTypedTitle(typedTitle.slice(0, -1)), DELETE_MS);
      } else {
        setTitleIndex((i) => (i + 1) % TYPEWRITER_TITLES.length);
        setTypePhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [typedTitle, typePhase, titleIndex]);

  const typewriterContent = (
    <>
      <span className="text-muted-foreground/40">/ </span>
      <span className="text-foreground">{typedTitle}</span>
      {/* Cursor visible while typing/deleting, hidden during the hold pause */}
      {typePhase !== "holding" && (
        <span className="animate-cursor-blink text-foreground">|</span>
      )}
    </>
  );

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
      className="w-full relative overflow-hidden h-[92dvh] md:h-[100dvh]"
    >
      <ShieldPulse mode={mode} />
      <DataDust />

      <motion.h1
        variants={item}
        className={`hidden md:block font-display uppercase leading-[0.82] text-foreground whitespace-nowrap text-center w-full relative z-10 ${
          mode === "matrix" ? "text-glow-strong" : ""
        }`}
        style={{
          fontSize: "clamp(5rem, 17.8vw, 36rem)",
          letterSpacing: "-0.04em",
          paddingTop: "clamp(80px, 18dvh, 170px)",
        }}
      >
        {displayText || " "}
      </motion.h1>

      {/* MOBILE name — two lines filling screen width */}
      <motion.div
        variants={item}
        className="md:hidden w-full text-center relative z-10"
        style={{ paddingTop: "clamp(70px, 14dvh, 110px)" }}
      >
        <div
          className={`font-display uppercase text-foreground ${mode === "matrix" ? "text-glow-strong" : ""}`}
          style={{ fontSize: "clamp(4.5rem, 30vw, 11rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}
        >
          {(displayText || " ").slice(0, 4)}
        </div>
        <div
          className={`font-display uppercase text-foreground ${mode === "matrix" ? "text-glow-strong" : ""}`}
          style={{ fontSize: "clamp(2.1rem, 13vw, 5.5rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}
        >
          {(displayText || " ").slice(5)}
        </div>
      </motion.div>

      {/* DESKTOP "Based in California" — original, untouched */}
      <motion.div
        variants={item}
        className="hidden md:flex w-full justify-end relative z-10"
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

      {/* MOBILE "Based in California" — centered, slightly larger */}
      <motion.div
        variants={item}
        className="md:hidden w-full flex justify-center relative z-10 mt-2"
      >
        <span
          className={`font-mono uppercase text-foreground ${
            mode === "matrix" ? "text-glow-strong" : ""
          }`}
          style={{ fontSize: "clamp(0.7rem, 2.9vw, 1rem)", letterSpacing: "0.3em" }}
        >
          Based in California
        </span>
      </motion.div>

      {/* MOBILE typewriter — in flow under the location line, clear of the portrait */}
      <motion.div variants={item} className="md:hidden w-full flex justify-center relative z-20 mt-4">
        <span
          className={`font-sans font-semibold leading-tight whitespace-nowrap ${
            mode === "matrix" ? "text-glow-strong" : ""
          }`}
          style={{ fontSize: "clamp(0.95rem, 4.6vw, 1.4rem)", letterSpacing: "0.02em" }}
        >
          {typewriterContent}
        </span>
      </motion.div>

      {/* Full-width flex centering — inline translateX(-50%) gets clobbered by the
          framer entrance animation, which shoved the portrait off-center */}
      <motion.div
        variants={item}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center"
        style={{ height: "80dvh" }}
      >
        <div
          className="relative h-full flex items-end justify-center"
          style={{
            opacity: imageOpacity,
            transform: `scale(${imageScale}) translateY(${imageTranslateY}px)`,
            willChange: "opacity, transform",
          }}
        >
          <img
            src={portrait}
            alt="Prem Madishetty"
            className="h-full w-auto max-w-[94vw] md:max-w-none object-contain object-bottom"
          />
          {/* DESKTOP typewriter — same float position as the old two-line labels.
              No uppercase transform so titles keep their casing (DevSecOps, SOC). */}
          <div className="absolute left-0 bottom-[12%] hidden md:block"
            style={{ transform: "translateX(calc(-100% - 24px))" }}
          >
            <span
              className={`font-sans font-semibold leading-tight whitespace-nowrap ${
                mode === "matrix" ? "text-glow-strong" : ""
              }`}
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.8rem)", letterSpacing: "0.02em" }}
            >
              {typewriterContent}
            </span>
          </div>
        </div>
      </motion.div>

    </motion.section>
  );
};

// ── Ambient element: data dust — faint accent-colored motes drifting up the hero.
//    Color follows the time-of-day accent, so the organism changes through the day. ──
const DUST_MOTES = [
  { left: "8%",  duration: 14, delay: 0 },
  { left: "22%", duration: 18, delay: 4 },
  { left: "37%", duration: 12, delay: 8 },
  { left: "58%", duration: 16, delay: 2 },
  { left: "74%", duration: 13, delay: 6 },
  { left: "90%", duration: 17, delay: 10 },
];

const DataDust = () => (
  <div className="absolute inset-0 pointer-events-none z-10 opacity-60 md:opacity-100" aria-hidden>
    {DUST_MOTES.map((m, i) => (
      <span
        key={i}
        className="dust-mote"
        style={{ left: m.left, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
      />
    ))}
  </div>
);

// ── Ambient element: floating shield pulse (top-right of hero) ──
const ShieldPulse = ({ mode }: { mode: string }) => {
  const [hovered, setHovered] = useState(false);
  const stroke = mode === "matrix" ? "#00ff41" : mode === "dark" ? "#ffffff" : "#111111";
  const glow =
    mode === "matrix"
      ? "drop-shadow(0 0 6px #00ff41)"
      : mode === "dark"
      ? "drop-shadow(0 0 5px rgba(255,255,255,0.5))"
      : "none";
  const ripple = mode === "matrix" ? "#00ff41" : "#22c55e";

  return (
    <div
      // top offset clears the fixed nav bar (z-50); kept a safe distance from the
      // right edge so the icon and its ripple never get clipped
      className="absolute top-20 right-5 md:top-24 md:right-10 z-20 opacity-70 md:opacity-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: 24, height: 24, padding: 10, boxSizing: "content-box" }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width={24}
        height={24}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: glow }}
      >
        <path
          d="M12 2l8 3.5v5.2c0 5-3.4 9.2-8 10.8-4.6-1.6-8-5.8-8-10.8V5.5L12 2z"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12l2.3 2.3 4.7-4.6"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
      {hovered && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute rounded-full border pointer-events-none"
          style={{ borderColor: ripple, top: 10, right: 10, width: 24, height: 24 }}
        />
      )}
      {hovered && (
        <span
          className={`absolute top-full right-2 mt-1 whitespace-nowrap text-[9px] uppercase tracking-widest pointer-events-none ${
            mode === "matrix" ? "font-mono text-green-400" : "font-sans text-muted-foreground"
          }`}
        >
          Systems secured
        </span>
      )}
    </div>
  );
};

export default HeroSection;
