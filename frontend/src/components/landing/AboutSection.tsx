import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const AboutSection = () => {
  const { mode } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.05, 0.35], [30, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  // Parallax: the concentric rings drift opposite the scroll for depth
  const ringsY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-5 md:px-16 py-16 md:py-24 max-w-7xl mx-auto"
    >
      {mode === "matrix" && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {"// the_source.load()"}
          </span>
        </motion.div>
      )}

      <motion.h2
        style={{ y: headingY, opacity: headingOpacity }}
        className={`text-foreground mb-3 uppercase ${
          mode === "matrix"
            ? "font-serif text-4xl md:text-6xl text-glow"
            : "font-display tracking-editorial text-4xl md:text-7xl lg:text-8xl"
        }`}
      >
        {mode === "matrix" ? "THE SOURCE" : "About"}
      </motion.h2>

      <motion.p
        style={{ y: headingY, opacity: headingOpacity }}
        className={`tracking-[0.2em] uppercase mb-12 ${
          mode === "matrix"
            ? "font-mono text-sm text-muted-foreground/60"
            : "font-sans text-base text-muted-foreground/70 font-medium"
        }`}
      >
        {mode === "matrix" ? "Dharma" : "The Source"}
        <MorseBeacon />
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl italic text-foreground/80"
          >
            The Third Eye
            <br />
            of Security.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`leading-relaxed ${
              mode === "matrix"
                ? "font-mono text-[11px] text-muted-foreground uppercase tracking-wide"
                : "font-sans text-muted-foreground text-[15px] leading-[1.8] tracking-normal normal-case"
            }`}
          >
            Cybersecurity Professional with 4 years of experience spanning enterprise SOC operations at NextEra Energy and advanced security research at SDSU. I specialize in bridging traditional defense with the future of the field, specifically in Post-Quantum Cryptography and the secure deployment of Generative AI.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`leading-relaxed ${
              mode === "matrix"
                ? "font-mono text-[11px] text-muted-foreground uppercase tracking-wide"
                : "font-sans text-muted-foreground text-[15px] leading-[1.8] tracking-normal normal-case"
            }`}
          >
            I don't just see pixels and packets. I see the underlying code, The Matrix, and the underlying truth, The Gita. Every system has a dharma, a purpose, and my work is to ensure that purpose remains uncorrupted.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformOrigin: "left" }}
            className="buffer-bar w-full"
          />

          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-serif text-xl md:text-2xl italic text-foreground/60 border-l-2 border-foreground/20 pl-6"
          >
            "Once the encryption is broken, there is no going back."
          </motion.blockquote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ y: ringsY }}
          className="flex items-center justify-end md:pr-4 lg:pr-8"
        >
          <div className="relative w-72 h-72">
            {[1, 0.7, 0.4].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-foreground"
                style={{
                  transform: `scale(${scale})`,
                  opacity: 0.15 + i * 0.1,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
              />
            ))}
            {/* Third eye — breathing pulse at the center of the rings,
                colored by the time-of-day accent */}
            <div className="third-eye absolute top-1/2 left-1/2 w-4 h-4 rounded-full" />
            <span
              className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-foreground/60 tracking-[0.3em] uppercase whitespace-nowrap ${
                mode === "matrix" ? "font-mono" : "font-sans"
              }`}
            >
              {"Tṛtīya Netra"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ── Ambient element: a beacon blinking "PREM" in morse code (.--. .-. . --),
//    colored by the time-of-day accent ──
const MORSE_PREM = ".--. .-. . --";
const MORSE_UNIT_MS = 140;

const MorseBeacon = () => {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    // Build the on/off timeline once: dot = 1 unit, dash = 3, gaps per morse spec
    const seq: [boolean, number][] = [];
    for (const ch of MORSE_PREM) {
      if (ch === ".") seq.push([true, MORSE_UNIT_MS], [false, MORSE_UNIT_MS]);
      else if (ch === "-") seq.push([true, MORSE_UNIT_MS * 3], [false, MORSE_UNIT_MS]);
      else seq.push([false, MORSE_UNIT_MS * 3]);
    }
    seq.push([false, MORSE_UNIT_MS * 7]); // word gap, then repeat

    let alive = true;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (!alive) return;
      const [state, duration] = seq[i];
      setLit(state);
      i = (i + 1) % seq.length;
      timer = setTimeout(step, duration);
    };
    step();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <span className="inline-block ml-3 align-middle" title={'Morse code: "PREM"'} aria-hidden>
      <span
        className="block w-2 h-2 rounded-full transition-opacity duration-75"
        style={{
          backgroundColor: "hsl(var(--accent))",
          opacity: lit ? 1 : 0.15,
          boxShadow: lit ? "0 0 8px hsl(var(--accent) / 0.8)" : "none",
        }}
      />
    </span>
  );
};

export default AboutSection;
