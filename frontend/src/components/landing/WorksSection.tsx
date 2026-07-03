import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const projects = [
  {
    name: "Lattice-Map",
    url: "https://github.com/premmadishetty/Lattice-Map",
    description: "Zero-dependency static analysis scanner to quantify Quantum Debt and migrate to NIST PQC standards. Generates interactive dependency graphs for cryptographic audits.",
    tags: ["post-quantum", "cryptography", "NIST-PQC", "static-analysis"],
    lang: "HTML",
    langColor: "#e34c26",
    stars: 0,
    forks: 0,
    tech: ["html5", "javascript", "python"],
  },
  {
    name: "Digital-Forensics-Case-M57Jean",
    url: "https://github.com/premmadishetty/Digital-Forensics-Case-M57Jean",
    description: "Complete digital forensics investigation of the M57-Jean data exfiltration case using Autopsy 4.22.1. Artifact recovery, exfiltration evidence, and legal assessment.",
    tags: ["digital-forensics", "autopsy", "incident-response"],
    lang: "—",
    langColor: "#6e7681",
    stars: 0,
    forks: 0,
    tech: ["autopsy", "forensics", "mitre"],
  },
  {
    name: "the-matrix-awakens",
    url: "https://github.com/premmadishetty/the-matrix-awakens",
    description: "AI-powered cybersecurity portfolio. React + Cloudflare Workers + D1 + Groq LLM. The simulation is live.",
    tags: ["portfolio", "react", "cloudflare", "groq-ai"],
    lang: "JavaScript",
    langColor: "#f1e05a",
    stars: 0,
    forks: 0,
    tech: ["react", "typescript", "cloudflare", "vite"],
  },
  {
    name: "Automated-AI-Prompt-Injection-Framework",
    url: "https://github.com/premmadishetty/Automated-AI-Prompt-Injection-Framework-",
    description: "Automated red-team pipeline stress-testing LLMs against OWASP LLM01. 50 adversarial payloads × 10 attack vectors × n8n automation × OpenRouter API × forensic logging.",
    tags: ["ai-security", "red-team", "OWASP-LLM", "n8n"],
    lang: "Python",
    langColor: "#3572A5",
    stars: 0,
    forks: 0,
    tech: ["python", "n8n", "openai", "docker"],
  },
  {
    name: "AWS-Honeypot-Deployment",
    url: "https://github.com/premmadishetty/AWS-Honeypot-Deployment",
    description: "T-Pot honeypot on AWS EC2 capturing 150K+ real-world attacks in 7 days. GreyNoise + AbuseIPDB enrichment, MITRE ATT&CK mapping, ELK dashboards, IP blocklist automation.",
    tags: ["honeypot", "aws", "threat-intel", "ELK"],
    lang: "—",
    langColor: "#6e7681",
    stars: 0,
    forks: 0,
    tech: ["aws", "elastic", "docker", "python"],
  },
  {
    name: "AWS-VPN-Secure-Infrastructure",
    url: "https://github.com/premmadishetty/AWS-VPN-Secure-Infrastructure",
    description: "Secure VPN deployment on AWS using OpenVPN, EC2, S3 & IAM. Encrypted storage, least-privilege access control, CloudWatch monitoring, and a full incident response plan.",
    tags: ["vpn", "aws", "iam", "zero-trust"],
    lang: "—",
    langColor: "#6e7681",
    stars: 0,
    forks: 0,
    tech: ["aws", "terraform", "openvpn", "iam"],
  },
];

const techMeta: Record<string, { label: string; color: string }> = {
  react:       { label: "React",       color: "#61dafb" },
  typescript:  { label: "TypeScript",  color: "#3178c6" },
  python:      { label: "Python",      color: "#3572A5" },
  javascript:  { label: "JS",          color: "#f1e05a" },
  html5:       { label: "HTML",        color: "#e34c26" },
  cloudflare:  { label: "Cloudflare",  color: "#f48120" },
  vite:        { label: "Vite",        color: "#646cff" },
  docker:      { label: "Docker",      color: "#2496ed" },
  aws:         { label: "AWS",         color: "#ff9900" },
  elastic:     { label: "ELK",         color: "#00bfb3" },
  terraform:   { label: "Terraform",   color: "#7b42bc" },
  openvpn:     { label: "OpenVPN",     color: "#ea7e20" },
  iam:         { label: "IAM",         color: "#ff9900" },
  n8n:         { label: "n8n",         color: "#ea4b71" },
  openai:      { label: "OpenRouter",  color: "#10a37f" },
  autopsy:     { label: "Autopsy",     color: "#6e7681" },
  forensics:   { label: "Forensics",   color: "#8b5cf6" },
  mitre:       { label: "MITRE",       color: "#e53e3e" },
};

const MAX_TRAIL_PARTICLES = 12;

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

  // ── Ambient element: cursor particle trail over the projects grid ──
  const trailRef = useRef<HTMLDivElement>(null);
  const particleCount = useRef(0);
  const lastSpawn = useRef(0);

  const handleTrailMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = trailRef.current;
    if (!container) return;
    const now = performance.now();
    if (now - lastSpawn.current < 40 || particleCount.current >= MAX_TRAIL_PARTICLES) return;
    lastSpawn.current = now;
    const rect = container.getBoundingClientRect();
    const dotColor = isMatrix ? "#00ff41" : isDark ? "#ffffff" : "#000000";
    const dot = document.createElement("div");
    dot.textContent = "·";
    dot.style.cssText = `position:absolute;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;pointer-events:none;font-size:16px;line-height:1;color:${dotColor};opacity:0.7;transition:opacity 600ms ease-out;transform:translate(-50%,-50%);z-index:30;`;
    container.appendChild(dot);
    particleCount.current++;
    requestAnimationFrame(() => {
      dot.style.opacity = "0";
    });
    setTimeout(() => {
      dot.remove();
      particleCount.current--;
    }, 600);
  };

  const cardClass = isMatrix
    ? "bg-black/40 border border-green-500/25 hover:border-green-400/50"
    : isDark
    ? "bg-white/[0.04] border border-white/10 hover:border-white/25"
    : "bg-white border border-black/[0.08] hover:border-black/[0.18] shadow-sm hover:shadow-md";

  const tagClass = isMatrix
    ? "bg-green-500/10 text-green-400/80 border border-green-500/20"
    : "bg-foreground/5 text-muted-foreground border border-foreground/10";

  return (
    <section id="works" ref={sectionRef} className="px-5 md:px-16 py-28 max-w-7xl mx-auto relative">

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
        className={`text-foreground mb-3 relative z-10 uppercase ${isMatrix ? "font-serif text-4xl md:text-6xl text-glow" : "font-display tracking-editorial text-4xl md:text-7xl lg:text-8xl"}`}>
        {isMatrix ? "THE CONSTRUCT" : "Works"}
      </motion.h2>

      <motion.p style={{ y: headingY, opacity: headingOpacity }}
        className={`tracking-[0.2em] uppercase mb-16 relative z-10 ${isMatrix ? "font-mono text-sm text-muted-foreground/60" : "font-sans text-base text-muted-foreground/70 font-medium"}`}>
        {isMatrix ? "Maya" : "Selected Projects"}
      </motion.p>

      <div
        ref={trailRef}
        onMouseMove={handleTrailMove}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10"
      >
        {projects.map((project, i) => (
          <motion.div key={project.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -3 }}
            onClick={handleCardClick}
            className={`group rounded-lg p-4 md:p-5 flex flex-col gap-3 backdrop-blur-sm transition-colors duration-300 ${cardClass}`}>

            {/* Name + external link */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-mono text-sm font-semibold text-foreground break-all">
                <span className="mr-1.5">📁</span>
                {project.name}
              </h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name} on GitHub`}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 -m-2 p-2"
              >
                ↗
              </a>
            </div>

            {/* Description — clamped to 3 lines */}
            <p
              className="text-xs text-muted-foreground leading-relaxed overflow-hidden"
              style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className={`text-[10px] font-mono tracking-wide px-2 py-0.5 rounded-full ${tagClass}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom row: language, stars, forks, tech pills */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-auto pt-1 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: project.langColor }} />
                {project.lang}
              </span>
              <span>★ {project.stars}</span>
              <span>⑂ {project.forks}</span>
              <span className="flex flex-wrap gap-1 ml-auto">
                {project.tech.map((key) => {
                  const meta = techMeta[key];
                  if (!meta) return null;
                  return (
                    <span
                      key={key}
                      className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                      style={{ color: meta.color, backgroundColor: `${meta.color}26` }}
                    >
                      {meta.label}
                    </span>
                  );
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WorksSection;
