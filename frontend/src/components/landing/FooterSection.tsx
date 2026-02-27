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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/20 py-12 md:py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section links like I7: [ ABOUT ] [ WORKS ] [ EXPERIENCE ] [ CONNECT ] */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {sectionLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
                isMatrix ? "font-mono" : "font-sans"
              }`}
            >
              [ {item.label} ]
            </a>
          ))}
          <a
            href="#connect"
            onClick={(e) => handleNavClick(e, "#connect")}
            className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 ${
              isMatrix ? "font-mono" : "font-sans"
            }`}
          >
            Contact me ↗
          </a>
        </nav>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20">
          <span className={`text-[9px] text-muted-foreground/40 tracking-widest uppercase ${isMatrix ? "font-mono" : "font-sans"}`}>
            © 2026 Prem Madishetty {isMatrix ? "// All systems operational" : ""}
          </span>
          <span className={`text-[9px] text-muted-foreground/30 tracking-widest italic ${isMatrix ? "font-mono" : "font-serif"}`}>
            तमसो मा ज्योतिर्गमय
          </span>
          {isMatrix && (
            <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">
              [ENCRYPTED]
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
