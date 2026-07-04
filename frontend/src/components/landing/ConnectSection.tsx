import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const ConnectSection = () => {
  const { mode } = useTheme();
  const isMatrix = mode === "matrix";
  const isDark = mode === "dark";
  const [hoveredHeadline, setHoveredHeadline] = useState(false);
  const [pstTime, setPstTime] = useState("");
  // Hidden greeting — 70% chance of appearing on hover
  const [showEasterEgg] = useState(() => Math.random() > 0.3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } };

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", hour12: false });
      setPstTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) { toast.error("Validation Error", { description: "Name is required." }); return; }
    if (!formData.email?.trim()) { toast.error("Validation Error", { description: "Email is required." }); return; }
    if (!isValidEmail(formData.email)) { toast.error("Validation Error", { description: "Please provide a valid email address." }); return; }
    if (!formData.message?.trim()) { toast.error("Validation Error", { description: "Message cannot be empty." }); return; }
    if (!API_BASE_URL) { toast.error("Configuration Error", { description: "API base URL is not configured." }); return; }
    setIsSubmitting(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim() }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.status === 429) { const d = await response.json().catch(() => ({})); toast.error("Rate Limit Exceeded", { description: d.message || "Too many requests.", duration: 5000 }); return; }
      if (response.status === 400) { const d = await response.json().catch(() => ({})); toast.error("Validation Error", { description: d.message || "Please check your input." }); return; }
      if (!response.ok) { const d = await response.json().catch(() => ({})); throw new Error(d.message || `HTTP error! status: ${response.status}`); }
      const data = await response.json();
      toast.success("Message sent successfully!", { description: data.message || "I'll get back to you soon.", duration: 4000 });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") { toast.error("Request Timeout", { description: "The request took too long.", duration: 5000 }); return; }
      if (error instanceof TypeError && error.message.includes("fetch")) { toast.error("Network Error", { description: "Unable to connect to the server.", duration: 5000 }); return; }
      toast.error("Failed to send message", { description: error instanceof Error ? error.message : "Please try again later.", duration: 5000 });
    } finally { setIsSubmitting(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const textColor = isMatrix ? "text-green-400" : "text-foreground";
  const mutedColor = isMatrix ? "text-green-500/40 font-mono" : isDark ? "text-white/40 font-sans" : "text-muted-foreground/50 font-sans";
  const fontClass = isMatrix ? "font-mono" : "font-sans";

  const GmailLogo = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        fill={isMatrix ? "#00ff41" : isDark ? "#f0f0f0" : "#EA4335"} />
    </svg>
  );

  const LinkedInLogo = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill={isMatrix ? "#00ff41" : isDark ? "#f0f0f0" : "#0A66C2"}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const GitHubLogo = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill={isMatrix ? "#00ff41" : isDark ? "#f0f0f0" : "#181717"}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );

  const headlineGlow = (hovered: boolean) =>
    isMatrix && hovered ? "2px 0 #ff0040, -2px 0 #00ff88, 0 0 20px rgba(0,255,100,0.3)" : isMatrix ? "0 0 10px rgba(0,255,100,0.15)" : "none";

  return (
    <section id="connect" ref={sectionRef} className="pt-16 md:pt-24 pb-0 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-5 md:px-16">

        <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
          className={`text-center uppercase tracking-[0.35em] mb-10 ${isMatrix ? "font-mono text-base text-green-500/90" : "font-sans text-base text-muted-foreground"}`}>
          {isMatrix ? "// initiate_uplink()" : "Let's start the conversation"}
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6 relative" onMouseEnter={() => setHoveredHeadline(true)} onMouseLeave={() => setHoveredHeadline(false)}>
          {/* Sonar ping — secure-handshake radar sweep behind the headline */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block" aria-hidden>
            <div className="sonar-ring w-40 h-40 rounded-full border" style={{ borderColor: "hsl(var(--accent) / 0.5)" }} />
          </div>
          <h2 className={`font-display uppercase leading-[0.9] relative ${isMatrix ? "text-green-400" : "text-foreground"}`}
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)", letterSpacing: "-0.03em", textShadow: headlineGlow(hoveredHeadline), transition: "text-shadow 0.2s" }}>
            System Integrity
          </h2>
        </motion.div>

        <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-center uppercase tracking-[0.4em] mb-4 ${isMatrix ? "font-mono text-base text-green-500/70" : "font-sans text-base text-muted-foreground/80"}`}>
          Starts with
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-20" onMouseEnter={() => setHoveredHeadline(true)} onMouseLeave={() => setHoveredHeadline(false)}>
          <h2 className={`font-display uppercase leading-[0.9] ${isMatrix ? "text-green-400" : "text-foreground"}`}
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)", letterSpacing: "-0.03em", textShadow: headlineGlow(hoveredHeadline), transition: "text-shadow 0.2s" }}>
            a Secure Handshake
          </h2>
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }} className="space-y-10 mb-0" onSubmit={handleSubmit}>
          {[
            { label: "Your Name*", type: "text", name: "name", isTextarea: false },
            { label: "Phone", type: "tel", name: "phone", isTextarea: false },
            { label: "Your Email*", type: "email", name: "email", isTextarea: false },
            { label: "How can I help you", type: "text", name: "message", isTextarea: true },
          ].map((field, i) => (
            <motion.div key={field.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <label className={`block uppercase tracking-[0.2em] mb-3 ${isMatrix ? "font-mono text-[11px] text-green-500/70" : "font-sans text-[11px] text-muted-foreground/70"}`}>
                {field.label}
              </label>
              {field.isTextarea ? (
                <textarea name={field.name} value={formData[field.name as keyof typeof formData] || ""} onChange={(e) => handleInputChange(e as any)}
                  disabled={isSubmitting} rows={4}
                  className={`w-full bg-transparent border-0 border-b pb-3 text-sm focus:outline-none transition-colors disabled:opacity-50 resize-none ${isMatrix ? "border-green-500/40 text-green-400 focus:border-green-400 font-mono matrix-input-glow" : "border-foreground/20 text-foreground focus:border-foreground font-sans"}`}
                  style={{ borderBottomWidth: "1px" }} />
              ) : (
                <input type={field.type} name={field.name} value={formData[field.name as keyof typeof formData] || ""} onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full bg-transparent border-0 border-b pb-3 text-sm focus:outline-none transition-colors disabled:opacity-50 ${isMatrix ? "border-green-500/40 text-green-400 focus:border-green-400 font-mono matrix-input-glow" : "border-foreground/20 text-foreground focus:border-foreground font-sans"}`}
                  style={{ borderBottomWidth: "1px" }} />
              )}
            </motion.div>
          ))}

          <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            type="submit" disabled={isSubmitting}
            className={`uppercase tracking-[0.2em] text-xs mt-6 group flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isMatrix ? "font-mono text-green-400 hover:text-green-300" : "font-sans text-foreground hover:opacity-70"}`}>
            <span className={`${isMatrix ? "border-b border-transparent group-hover:border-green-400" : "border-b border-transparent group-hover:border-foreground"} pb-1 transition-colors`}>
              {isSubmitting ? "Sending..." : "Contact Me"}
            </span>
            <span className="text-sm">{isMatrix ? ">_" : "↗"}</span>
          </motion.button>

          {/* Audit line — NO border above, seamless */}
          <div className="mt-8">
            <p className={`text-[10px] uppercase tracking-wider text-center ${isMatrix ? "text-green-500/50 font-mono" : "text-muted-foreground/60 font-sans"}`}>
              [SECURE_AUDIT_ACTIVE]: All interactions are logged for threat intelligence and security research.
            </p>
          </div>
        </motion.form>
      </div>

      {/* ━━━ FULL WIDTH FOOTER INFO ━━━ */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="w-full px-5 md:px-12 lg:px-20 mt-16 pb-8 relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 w-full">

          {/* LEFT — nav links + resume (DESKTOP ONLY; removed on phone) */}
          <div className="hidden md:flex flex-col gap-3">
            {["About", "Experience", "Works"].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); document.querySelector(`#${label.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" }); }}
                className={`text-sm uppercase tracking-[0.12em] transition-opacity hover:opacity-50 cursor-pointer ${fontClass} ${textColor}`}>
                {label}
              </a>
            ))}
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); }}
              className={`text-sm uppercase tracking-[0.12em] transition-opacity hover:opacity-50 cursor-pointer ${fontClass} ${textColor}`}
              style={{ pointerEvents: "all" }}>
              Resume ↗
            </a>
          </div>

          {/* RIGHT — contact info */}
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">

            {/* Phone */}
            <a href="tel:+13692107491"
              className={`text-xl sm:text-2xl md:text-4xl font-bold tracking-tight transition-opacity hover:opacity-60 flex items-start gap-2 ${fontClass} ${textColor}`}>
              +1 (369)-210-7491 <span className="text-base md:text-xl mt-1">↗</span>
            </a>

            {/* Email */}
            <a href="mailto:prem131298@gmail.com"
              className={`text-xl sm:text-2xl md:text-4xl font-bold tracking-tight transition-opacity hover:opacity-60 flex items-start gap-2 break-all ${fontClass} ${textColor}`}>
              prem131298@gmail.com <span className="text-base md:text-xl mt-1">↗</span>
            </a>

            {/* Social — logos only, grouped in a colorful chip (no text, no arrows) */}
            <div className={`inline-flex items-center gap-5 px-5 py-2.5 rounded-full border ${isMatrix ? "border-green-500/30 bg-green-500/5" : "border-border/40 bg-foreground/[0.03]"}`}>
              <a href="mailto:prem131298@gmail.com" aria-label="Email" className="transition-transform hover:scale-125">
                <GmailLogo />
              </a>
              <span className={`w-px h-4 ${isMatrix ? "bg-green-500/20" : "bg-border/50"}`} />
              <a href="https://www.linkedin.com/in/madishettyprem/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-transform hover:scale-125">
                <LinkedInLogo />
              </a>
              <span className={`w-px h-4 ${isMatrix ? "bg-green-500/20" : "bg-border/50"}`} />
              <a href="https://github.com/premmadishetty" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-transform hover:scale-125">
                <GitHubLogo />
              </a>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Full-width name band */}
      <div className="relative">
        {/* DESKTOP */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8 }} className="hidden md:block w-full">
          <h2 data-testid="footer-name"
            className={`font-display uppercase leading-[0.82] text-center w-full whitespace-nowrap ${isMatrix ? "text-green-400 text-glow-strong" : "text-foreground"}`}
            style={{ fontSize: "clamp(5rem, 17.8vw, 36rem)", letterSpacing: "-0.04em" }}>
            PREM MADISHETTY
          </h2>
        </motion.div>

        {/* MOBILE — two big lines, more prominent */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8 }} className="md:hidden w-full text-center px-2">
          <div className={`font-display uppercase leading-[0.84] ${isMatrix ? "text-green-400 text-glow-strong" : "text-foreground"}`}
            style={{ fontSize: "clamp(4.5rem, 33vw, 11rem)", letterSpacing: "-0.03em" }}>
            PREM
          </div>
          <div className={`font-display uppercase leading-[0.86] ${isMatrix ? "text-green-400 text-glow-strong" : "text-foreground"}`}
            style={{ fontSize: "clamp(2.4rem, 15vw, 5.5rem)", letterSpacing: "-0.02em" }}>
            MADISHETTY
          </div>
        </motion.div>
      </div>

      {/* Clock — sits directly below the name (left on desktop, centered on mobile).
          Extra top margin clears the giant name's overflowing descenders. */}
      <div className="w-full px-5 md:px-12 lg:px-20 mt-8 md:mt-12 flex justify-center md:justify-start">
        <span className={`text-[10px] md:text-[10px] tracking-[0.15em] uppercase ${isMatrix ? "font-mono text-green-500/50" : "font-sans text-muted-foreground/60"}`}>
          <span className="inline-flex items-end gap-[2px] mr-2 align-middle" aria-hidden>
            {[7, 10, 5, 9].map((h, i) => (
              <span key={i} className="signal-bar" style={{ height: h, animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
          San Diego, California: (GMT-8) {pstTime}
        </span>
      </div>

      {/* Bottom bar — Fortified credo bottom-left (desktop) / centered (mobile),
          Sanskrit bottom-right (desktop) / centered (mobile). Transparent so the
          time-of-day wash tints it seamlessly. */}
      <div className={`w-full px-5 md:px-12 lg:px-20 pt-5 pb-20 md:pb-5 mt-3 border-t border-border/20 ${isMatrix ? "bg-[#0a0a0a]" : "bg-transparent"}`}>
        {showEasterEgg && (
          <div className="flex justify-center mb-3">
            <span
              className={`opacity-0 hover:opacity-100 transition-opacity [transition-duration:800ms] hover:[transition-duration:200ms] text-[10px] ${
                isMatrix ? "font-mono text-green-400" : "font-sans text-muted-foreground/40"
              }`}
              style={{ cursor: "default" }}
            >
              WAKE UP, PREM
            </span>
          </div>
        )}
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:items-end md:text-left">
          {/* Fortified — matches the site font (sans), bold */}
          <span className={`text-[11px] md:text-xs font-bold tracking-[0.18em] uppercase ${isMatrix ? "font-mono text-green-400/90" : "font-sans text-foreground/85"}`}>
            Fortified by Code, Guided by Gita © 2026
          </span>
          <div className="flex flex-col items-center md:items-end gap-0.5 md:pr-16 lg:pr-20">
            <span className={`text-[13px] font-semibold tracking-wider ${isMatrix ? "font-mono text-green-400/70" : "font-serif text-foreground/70"}`}>
              {"सत्यमेव जयते"}
            </span>
            {isMatrix && <span className="font-mono text-[9px] text-green-500/40 tracking-widest">{"// All systems operational"}</span>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;