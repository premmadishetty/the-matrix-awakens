import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const experience = [
  {
    role: "CYBERSECURITY ENGINEER",
    org: "AI4BUSINESS LAB, SAN DIEGO STATE UNIVERSITY",
    meta: "SAN DIEGO, CA — OCT 2024 – PRESENT",
    bullets: [
      "Implemented DevSecOps Container Security pipeline using Trivy and Kyverno, detecting 50+ vulnerabilities and blocking noncompliant workloads across 3 clusters.",
      "Integrated SBOM generation and image signing to reduce container attack surface by 40%.",
      "Engineered automated threat intelligence pipeline using n8n, ingesting OSINT feeds and enriching IOCs via VirusTotal, reducing manual threat intel processing by 70%.",
      "Provisioned IaC in Windows and Linux environments using Terraform and Checkov, enforcing Zero Trust and CIS-aligned baselines, reducing provisioning time by 60%.",
    ],
  },
  {
    role: "SENIOR SOC ANALYST",
    org: "NEXTERA ENERGY",
    meta: "MIAMI, FL — MAY 2023 – JULY 2024",
    bullets: [
      "Administered IBM QRadar and Splunk, tuning 15+ correlation rules to reduce false positives by 30% across 500+ daily alerts.",
      "Engineered and maintained 10+ Palo Alto XSOAR playbooks orchestrating ServiceNow, AWS, Tenable, Forcepoint and Proofpoint — automating 2,000+ alerts/week.",
      "Directed Vulnerability Management lifecycle across 3,000 assets using Tenable, achieving 80% critical vuln closure within 30-day SLA.",
      "Managed Palo Alto IPS/IDS signature updates via 4 weekly CAB-approved changes across Fortune 200 critical energy infrastructure.",
    ],
  },
  {
    role: "SOC ANALYST",
    org: "NEXTERA ENERGY",
    meta: "MIAMI, FL — MAY 2021 – APRIL 2023",
    bullets: [
      "Owned IR lifecycle across 6 ServiceNow queues in 24×7×365 rotation, driving SLA compliance from 89% to 99.5%.",
      "Monitored Forcepoint DLP across email, print, and RSD channels — escalated 7 exfiltration attempts averting $28M+ in potential breach cost.",
      "Authored daily CTI reports for leadership, translating IOCs and TTPs into firewall blocklist updates and SIEM rules across $20B critical infrastructure.",
      "Fine-tuned SIEM correlation rules and accelerated MTTD by 35% through alert suppression and behavioral baselining.",
    ],
  },
];

const ExperienceSection = () => {
  const { mode } = useTheme();
  const isMatrix = mode === "matrix";
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section id="experience" ref={sectionRef} className="px-5 md:px-16 py-28 max-w-7xl mx-auto relative">
      <BinaryRainColumn mode={mode} />

      {isMatrix && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{"// the_protocol.execute()"}</span>
        </motion.div>
      )}

      <motion.h2 style={{ y: headingY, opacity: headingOpacity }}
        className={`text-foreground mb-3 uppercase ${isMatrix ? "font-serif text-4xl md:text-6xl text-glow" : "font-display tracking-editorial text-4xl md:text-7xl lg:text-8xl"}`}>
        {isMatrix ? "THE PROTOCOL" : "Experience"}
      </motion.h2>

      <motion.p style={{ y: headingY, opacity: headingOpacity }}
        className={`tracking-[0.2em] uppercase mb-16 ${isMatrix ? "font-mono text-sm text-muted-foreground/60" : "font-sans text-base text-muted-foreground/70 font-medium"}`}>
        {isMatrix ? "Karma" : "Professional Journey"}
      </motion.p>

      <div>
        {experience.map((exp, i) => {
          // meta is "LOCATION — DATE RANGE"
          const [location, dates] = exp.meta.split("—").map((s) => s.trim());
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-16">

              {/* Role + date range — date right-aligned on desktop, below org on mobile */}
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                <h3 className={`font-display uppercase text-foreground text-lg md:text-xl ${isMatrix ? "text-glow" : ""}`}>
                  {exp.role}
                </h3>
                <span className="hidden md:block font-mono text-xs text-muted-foreground/60 tracking-wider uppercase whitespace-nowrap">
                  {dates}
                </span>
              </div>

              <p className="font-mono text-xs text-muted-foreground tracking-wider uppercase mt-1">
                {exp.org} • {location}
              </p>
              <span className="md:hidden block font-mono text-xs text-muted-foreground/60 tracking-wider uppercase mt-1">
                {dates}
              </span>

              <hr className="border-t border-foreground/10 my-4" />

              <ul className="space-y-2">
                {exp.bullets.map((bullet, j) => (
                  <motion.li key={j}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12 + j * 0.06 }}
                    className="font-mono text-[13px] text-muted-foreground flex gap-3 leading-relaxed">
                    <span className="flex-shrink-0 mt-0.5 text-foreground/30">▸</span>
                    {bullet}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// ── Ambient element: single-column binary rain on the far right (desktop only) ──
const BinaryRainColumn = ({ mode }: { mode: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const color = mode === "matrix" ? "#00ff41" : mode === "dark" ? "#ffffff" : "#000000";
    const glyphGap = 18;
    const speed = 60; // px per second

    let height = 0;
    let glyphs: { y: number; char: string }[] = [];
    const seed = () => {
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = 20;
      canvas.height = height;
      glyphs = [];
      for (let y = -glyphGap; y < height; y += glyphGap) {
        glyphs.push({ y, char: Math.random() > 0.5 ? "1" : "0" });
      }
    };
    seed();

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      ctx.clearRect(0, 0, 20, height);
      ctx.font = "11px 'Fira Code', monospace";
      ctx.fillStyle = color;
      for (const g of glyphs) {
        g.y += speed * dt;
        if (g.y > height) {
          g.y = -glyphGap;
          g.char = Math.random() > 0.5 ? "1" : "0";
        }
        ctx.fillText(g.char, 5, g.y);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", seed);
    };
  }, [mode]);

  return (
    <div
      className="absolute right-2 top-0 bottom-0 overflow-hidden pointer-events-none hidden md:block"
      style={{ width: 20, opacity: mode === "olha" ? 0.06 : 0.12 }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ExperienceSection;
