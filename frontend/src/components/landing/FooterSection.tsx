import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const sectionLinks = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

const FooterSection = () => {
  const { mode } = useTheme();
  const isMatrix = mode === "matrix";

  // Hidden greeting — 70% chance of appearing on hover
  const [showEasterEgg] = useState(() => Math.random() > 0.3);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/20 py-12 md:py-16 px-5 md:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section links like I7: [ ABOUT ] [ WORKS ] [ EXPERIENCE ] [ CONNECT ] */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {sectionLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2 ${
                isMatrix ? "font-mono" : "font-sans"
              }`}
            >
              [ {item.label} ]
            </a>
          ))}
          <a
            href="#connect"
            onClick={(e) => handleNavClick(e, "#connect")}
            className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 py-2 ${
              isMatrix ? "font-mono" : "font-sans"
            }`}
          >
            Contact me ↗
          </a>
        </nav>

        {showEasterEgg && (
          <div className="flex justify-center">
            <div
              className={`opacity-0 hover:opacity-100 transition-opacity [transition-duration:800ms] hover:[transition-duration:200ms] text-[10px] ${
                isMatrix ? "font-mono text-green-400" : "font-sans text-muted-foreground/40"
              }`}
              style={{ cursor: "default" }}
            >
              WAKE UP, PREM
            </div>
          </div>
        )}

        {/* Bottom row — 3 columns on desktop, stacked + centered on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-6 border-t border-border/20 text-center">
          <span className={`text-[11px] font-medium text-muted-foreground/70 tracking-widest uppercase md:text-left ${isMatrix ? "font-mono" : "font-sans"}`}>
            © 2026 Prem Madishetty {isMatrix ? "// All systems operational" : ""}
          </span>
          <span className={`text-[10px] tracking-[0.25em] uppercase italic text-muted-foreground/50 ${isMatrix ? "font-mono" : "font-serif"}`}>
            Fortified by Code, Guided by Gita ©
          </span>
          <span className={`text-[12px] font-semibold text-foreground/70 tracking-wider md:text-right ${isMatrix ? "font-mono" : "font-serif"}`}>
            सत्यमेव जयते
            {isMatrix && (
              <span className="block font-mono text-[9px] font-normal text-muted-foreground/40 tracking-widest uppercase mt-1">
                [ENCRYPTED]
              </span>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
