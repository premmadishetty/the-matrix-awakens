import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const experience = [
  {
    role: "AI SECURITY RESEARCHER",
    org: "AI4BUSINESS LAB, SAN DIEGO STATE UNIVERSITY",
    meta: "SAN DIEGO, CA — OCT 2024 – MAY 2026",
    bullets: [
      "Architected a Quantum-Safe file transfer system utilizing PQC & Kyber-512.",
      "Engineered Agentic AI systems using AutoGen, reducing LLM hallucinations by 14%.",
      "Automated LLM Red Teaming via n8n against the OWASP Top 10.",
      "Built a RAG-based CTI pipeline to synthesize actionable IOCs and TTPs.",
    ],
  },
  {
    role: "SOC ANALYST",
    org: "NEXTERA ENERGY",
    meta: "MIAMI, FL — MAY 2023 – JULY 2024",
    bullets: [
      "Redesigned Mock Phishing Framework for 9,300+ employees, reducing click rate by 30%.",
      "Automated SOAR playbooks, improving operational efficiency by 40%.",
      "Resolved 20+ critical Zscaler incidents via Wireshark analysis.",
      "Authored 6 SOPs and a Business Continuity Program ensuring 100% uptime.",
    ],
  },
  {
    role: "CYBERSECURITY ANALYST",
    org: "NEXTERA ENERGY",
    meta: "MIAMI, FL — MAY 2021 – APRIL 2023",
    bullets: [
      "Fine-tuned SIEM correlation rules and IPS/IDS signatures, accelerating MTTD by 35%.",
      "Analyzed 50+ malware payloads via CrowdStrike Falcon Sandbox.",
      "Led forensics using Tanium and EDR to thwart 7 data exfiltration attempts.",
      "Managed AWS IAM and Vulnerability Management for NIST 800-53 & ISO 27001.",
    ],
  },
];

const ExperienceSection = () => {
  const { mode } = useTheme();
  const isMatrix = mode === "matrix";
  const isDark = mode === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const boxClass = isMatrix
    ? "border border-green-500/30 bg-black/40 hover:border-green-400/60 hover:bg-black/60"
    : isDark
    ? "border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
    : "border border-black/10 bg-white hover:border-black/20 hover:shadow-md";

  return (
    <section id="experience" ref={sectionRef} className="px-6 md:px-16 py-28 max-w-7xl mx-auto">
      {isMatrix && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{"// the_protocol.execute()"}</span>
        </motion.div>
      )}

      <motion.h2 style={{ y: headingY, opacity: headingOpacity }}
        className={`text-foreground mb-3 uppercase ${isMatrix ? "font-serif text-5xl md:text-6xl text-glow" : "font-display tracking-editorial text-7xl md:text-8xl"}`}>
        {isMatrix ? "THE PROTOCOL" : "Experience"}
      </motion.h2>

      <motion.p style={{ y: headingY, opacity: headingOpacity }}
        className={`tracking-[0.2em] uppercase mb-16 ${isMatrix ? "font-mono text-sm text-muted-foreground/60" : "font-sans text-base text-muted-foreground/70 font-medium"}`}>
        {isMatrix ? "Karma" : "Professional Journey"}
      </motion.p>

      <div className="space-y-6 mb-16">
        {experience.map((exp, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`p-6 md:p-8 transition-all duration-300 ${boxClass}`}>

            {/* Box header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-5 pb-4 border-b ${isMatrix ? 'border-green-500/20' : isDark ? 'border-white/10' : 'border-black/8'}">
              <div>
                <h3 className={`text-lg md:text-xl font-bold text-foreground uppercase ${isMatrix ? "font-mono" : "font-sans"}`}>
                  {exp.role}
                </h3>
                <p className={`text-xs font-medium text-muted-foreground tracking-wider uppercase mt-0.5 ${isMatrix ? "font-mono" : "font-sans"}`}>
                  {exp.org}
                </p>
              </div>
              <span className={`text-xs text-muted-foreground/50 tracking-wider uppercase whitespace-nowrap mt-1 md:mt-0 ${isMatrix ? "font-mono" : "font-sans"}`}>
                {exp.meta}
              </span>
            </div>

            {/* Bullets */}
            <ul className="space-y-2">
              {exp.bullets.map((bullet, j) => (
                <motion.li key={j}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 + j * 0.06 }}
                  className={`text-[13px] text-muted-foreground flex gap-3 leading-relaxed ${isMatrix ? "font-mono" : "font-sans"}`}>
                  <span className={`flex-shrink-0 mt-0.5 ${isMatrix ? "text-green-500/60" : "text-foreground/30"}`}>▸</span>
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;