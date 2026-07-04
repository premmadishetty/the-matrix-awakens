import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const olhaNavItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Works", href: "#works" },
  { label: "Connect", href: "#connect" },
];
const matrixNavItems = [
  { label: "Source", href: "#about" },
  { label: "Protocol", href: "#experience" },
  { label: "Construct", href: "#works" },
  { label: "Uplink", href: "#connect" },
];

const YinYang = ({ mode, spinning }: { mode: string; spinning: boolean }) => {
  const isMatrix = mode === "matrix";
  const isDark = mode === "dark";
  const light = isMatrix ? "#00ff41" : isDark ? "#f0f0f0" : "#ffffff";
  const dark = isMatrix ? "#000000" : isDark ? "#111111" : "#111111";
  const glow = isMatrix ? "drop-shadow(0 0 6px #00ff41) drop-shadow(0 0 12px #00ff41)" : "none";
  return (
    <svg viewBox="0 0 200 200" className={`w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-110 ${spinning ? "spin-once" : ""}`} style={{ filter: glow }}>
      <circle cx="100" cy="100" r="98" fill="none" stroke={isDark || isMatrix ? light : dark} strokeWidth="4" />
      <path d="M100,2 A98,98 0 0,0 100,198 Z" fill={dark} />
      <path d="M100,2 A98,98 0 0,1 100,198 Z" fill={light} />
      <circle cx="100" cy="51" r="49" fill={dark} />
      <circle cx="100" cy="149" r="49" fill={light} />
      <circle cx="100" cy="51" r="18" fill={light} />
      <circle cx="100" cy="149" r="18" fill={dark} />
    </svg>
  );
};

const NavigationBar = () => {
  const { mode, triggerBreach, toggleMode } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = mode === "matrix" ? matrixNavItems : olhaNavItems;
  const isMatrix = mode === "matrix";
  const fontClass = isMatrix ? "font-mono" : "font-sans";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (mode === "olha" || mode === "dark") triggerBreach({ forNavigation: true });
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggle = () => {
    if (spinning || mode === "matrix") return;
    setSpinning(true);
    toggleMode();
    setTimeout(() => setSpinning(false), 650);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 ${mode === "matrix" ? "bg-black/60" : "bg-background/60"} backdrop-blur-md`}
    >
      <div className="w-full px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">

        {/* PM Logo */}
        <motion.a href="#" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-display text-foreground text-2xl md:text-3xl leading-none tracking-tight uppercase cursor-pointer"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); triggerBreach(); }}>
          PM
        </motion.a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item, i) => (
            <motion.a key={item.href + item.label} href={item.href} onClick={(e) => handleNavClick(e, item.href)}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className={`text-xs tracking-[0.25em] uppercase ${fontClass} text-foreground hover:text-muted-foreground transition-colors cursor-pointer`}>
              [ {item.label} ]
            </motion.a>
          ))}

          {/* Resume tab */}
          <motion.a
            href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + navItems.length * 0.1 }}
            className={`text-xs tracking-[0.25em] uppercase ${fontClass} text-foreground hover:text-muted-foreground transition-colors cursor-pointer`}>
            [ RESUME ]
          </motion.a>
        </div>

        {/* Yin-Yang toggle + mobile hamburger */}
        <div className="flex items-center gap-1 md:gap-0">
          <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            onClick={handleToggle} aria-label="Toggle light/dark mode"
            className="w-12 md:w-20 flex justify-end py-2 bg-transparent border-none outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={mode === "matrix"}>
            <YinYang mode={mode} spinning={spinning} />
          </motion.button>

          {/* Hamburger — mobile only, 44×44 touch target */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] bg-transparent border-none outline-none"
          >
            <span className={`block w-5 h-[2px] bg-foreground transition-transform duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-5 h-[2px] bg-foreground transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[2px] bg-foreground transition-transform duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`md:hidden overflow-hidden ${mode === "matrix" ? "bg-black/80" : "bg-background/90"} backdrop-blur-md`}
          >
            <div className="flex flex-col px-6 pb-4">
              {navItems.map((item) => (
                <a key={item.href + item.label} href={item.href} onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-xs tracking-[0.25em] uppercase ${fontClass} text-foreground hover:text-muted-foreground transition-colors cursor-pointer py-3`}>
                  [ {item.label} ]
                </a>
              ))}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`text-xs tracking-[0.25em] uppercase ${fontClass} text-foreground hover:text-muted-foreground transition-colors cursor-pointer py-3`}>
                [ RESUME ]
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavigationBar;