import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const projects = [
  {
    id: "01",
    title: "Quantum-Safe File Transfer",
    subtitle: 'The "Post-Quantum" Future',
    description: "Architected a PQC system utilizing Kyber-512 to mitigate 'Harvest Now, Decrypt Later' threats. This implements FIPS 203 standards to secure data against future cryptographic collapse.",
    tags: ["Post-Quantum Cryptography", "Kyber-512", "FIPS 203"],
  },
  {
    id: "02",
    title: "Agentic AI Red Teaming",
    subtitle: "Adversarial AI Defense",
    description: "Engineered Agentic systems using AutoGen and n8n to automate adversarial prompt engineering. Stress-tested models against the OWASP Top 10 for LLMs, reducing hallucinations by 14%.",
    tags: ["AI Security", "AutoGen", "Adversarial ML"],
  },
  {
    id: "03",
    title: "RAG-Based Threat Intelligence",
    subtitle: "Machine-Speed Incident Response",
    description: "Engineered a Retrieval-Augmented Generation (RAG) pipeline to ingest global threat feeds. It synthesizes raw data into actionable TTPs and IOCs, directing real-time incident response.",
    tags: ["RAG", "CTI", "GenAI Operations"],
  },
  {
    id: "04",
    title: "Enterprise AI Risk Governance",
    subtitle: 'The "Shadow AI" Shield',
    description: "Orchestrated a NIST AI RMF audit of 10+ SaaS tools to mitigate 'Shadow AI' exposure. Implemented real-time prompt monitoring and sensitivity labeling to prevent PII leakage.",
    tags: ["AI Governance", "NIST AI RMF", "Data Sovereignty"],
  },
  {
    id: "05",
    title: "Zero Trust IAM Architecture",
    subtitle: "Identity as the Perimeter",
    description: "Architected RBAC for hybrid-cloud environments using HashiCorp Vault for automated secret rotation. Enforced context-aware MFA using device posture and geolocation signals.",
    tags: ["Zero Trust", "HashiCorp Vault", "IAM"],
  },
  {
    id: "06",
    title: "Cloud-Native DevSecOps Pipeline",
    subtitle: "Secure Supply Chain Architecture",
    description: "Built a CI/CD pipeline enforcing zero-trust via Trivy and Cosign for image signing. Implemented Kyverno admission policies to block non-compliant containers at the Kubernetes edge.",
    tags: ["DevSecOps", "Kubernetes", "Supply Chain Security"],
  },
];

const WorksSection = () => {
  const { mode, triggerBreach } = useTheme();
  const isMatrix = mode === "matrix";
  const isDark = mode === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const gridOpacity = useTransform(scrollYProgress, [0, 0.3], [0.05, isMatrix ? 0.35 : 0.22]);
  const gridScale = useTransform(scrollYProgress, [0, 0.4], [0.95, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Grid color — visible in all 3 modes
  const gridColor = isMatrix
    ? "hsl(120 100% 50%)"
    : isDark
    ? "hsl(0 0% 80%)"
    : "hsl(0 0% 0%)";

  const handleCardClick = () => {
    if (mode === "olha") triggerBreach();
  };

  return (
    <section id="works" ref={sectionRef} className="px-6 md:px-16 py-28 max-w-7xl mx-auto relative">

      {/* Wireframe grid */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: gridOpacity, scale: gridScale }}>
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 38 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={15 * (i + 1)} x2="800" y2={15 * (i + 1)} stroke={gridColor} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`v-${i}`} x1={400 + (i - 20) * 25} y1="0" x2={400 + (i - 20) * 40} y2="600" stroke={gridColor} strokeWidth="0.5" />
          ))}
        </svg>
      </motion.div>

      {isMatrix && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4 relative z-10">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{"// the_construct.decrypt()"}</span>
        </motion.div>
      )}

      <motion.h2 style={{ y: headingY, opacity: headingOpacity }}
        className={`text-foreground mb-3 relative z-10 uppercase ${isMatrix ? "font-serif text-5xl md:text-6xl text-glow" : "font-display tracking-editorial text-7xl md:text-8xl"}`}>
        {isMatrix ? "THE CONSTRUCT" : "Works"}
      </motion.h2>

      <motion.p style={{ y: headingY, opacity: headingOpacity }}
        className={`tracking-[0.2em] uppercase mb-16 relative z-10 ${isMatrix ? "font-mono text-sm text-muted-foreground/60" : "font-sans text-base text-muted-foreground/70 font-medium"}`}>
        {isMatrix ? "Maya" : "Selected Projects"}
      </motion.p>

      <div className="space-y-6 relative z-10">
        {projects.map((project, i) => (
          <motion.div key={project.id}
            initial={{ opacity: 0, y: 50, x: i % 2 === 1 ? 30 : -30 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={handleCardClick}
            className={`group border bg-background/80 backdrop-blur-sm p-8 md:p-10 cursor-pointer transition-all duration-300 ${
              isMatrix
                ? "border-green-500/30 hover:border-green-400/60 glitch-hover"
                : isDark
                ? "border-white/10 hover:border-white/25 hover:bg-white/5"
                : "border-border hover:border-foreground/20 hover:shadow-lg"
            } ${i % 2 === 1 ? "md:ml-16" : "md:mr-16"}`}>

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-baseline gap-4">
                <span className="font-sans text-xs text-muted-foreground/40">{project.id}</span>
                <h3 className="font-sans text-xl md:text-2xl font-bold text-foreground group-hover:text-glow transition-all">
                  {project.title}
                </h3>
              </div>
            </div>
            <p className="font-sans text-sm text-muted-foreground/60 italic mb-3">{project.subtitle}</p>
            <p className="font-sans text-[15px] leading-[1.7] text-muted-foreground mb-5">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((tag) => (
                <span key={tag} className={`font-sans text-[10px] px-3 py-1 border uppercase tracking-wider text-muted-foreground/60 ${
                  isDark ? "border-white/15" : "border-border/40"
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WorksSection;