import { useRef } from "react";
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-5 md:px-16 py-28 max-w-7xl mx-auto"
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full" />
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

export default AboutSection;
