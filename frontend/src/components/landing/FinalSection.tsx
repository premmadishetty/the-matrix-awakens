import { useTheme } from "@/contexts/ThemeContext";

const sectionLinks = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

const coreResearch = [
  { label: "Post-Quantum Cryptography", href: "#works" },
  { label: "AI Security", href: "#works" },
  { label: "Zero Trust", href: "#experience" },
];

const ABOUT_SUMMARY =
  "Cybersecurity professional with 4 years of experience spanning enterprise SOC operations and advanced security research. I specialize in Post-Quantum Cryptography and the secure deployment of Generative AI.";

const FinalSection = () => {
  const { mode } = useTheme();
  const isMatrix = mode === "matrix";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="final"
      className="h-[100vh] min-h-[600px] max-h-[100dvh] overflow-hidden flex flex-col bg-background border-t border-border/20"
    >
      {/* Asymmetrical grid: one viewport, no spill (I7 layout) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 grid-rows-[auto_1fr_auto_auto] gap-x-6 gap-y-3 md:gap-x-12 md:gap-y-4 px-6 md:px-16 py-5 md:py-8 max-w-[1600px] mx-auto w-full">
        {/* Row 1: Logo (left) | Nav links (center-right) | Contact (right) */}
        <div className="col-span-1 md:col-span-12 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`text-lg md:text-xl uppercase ${isMatrix ? "font-serif italic" : "font-display tracking-editorial-tight"}`}
          >
            PM
          </a>
          <nav className="flex items-center gap-4 md:gap-8 flex-wrap justify-end">
            {sectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${isMatrix ? "font-mono" : "font-sans"}`}
              >
                [ {item.label} ]
              </a>
            ))}
            <a
              href="#connect"
              onClick={(e) => handleNavClick(e, "#connect")}
              className={`text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${isMatrix ? "font-mono" : "font-sans"}`}
            >
              Contact me ↗
            </a>
          </nav>
        </div>

        {/* Row 2: Left = About summary, Right = Staggered Core Research blocks */}
        <div className="col-span-1 md:col-span-5 flex flex-col justify-center">
          <p
            className={`text-sm md:text-base leading-relaxed max-w-md ${
              isMatrix ? "font-mono text-muted-foreground" : "font-sans text-foreground/90"
            }`}
          >
            {ABOUT_SUMMARY}
          </p>
        </div>

        <div className="col-span-1 md:col-span-7 flex flex-col justify-center items-start md:items-end gap-3 md:gap-4 pl-0 md:pl-8">
          {coreResearch.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`block text-[11px] md:text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
                isMatrix ? "font-mono" : "font-sans"
              } ${i === 1 ? "md:mr-8" : i === 2 ? "md:mr-16" : ""}`}
            >
              [ {item.label} ]
            </a>
          ))}
        </div>

        {/* Row 3: Dominant name/brand — visual anchor (900-weight, huge) */}
        <div className="col-span-1 md:col-span-12 flex items-end">
          <h2
            className={`leading-none text-foreground uppercase w-full overflow-hidden md:whitespace-nowrap ${
              isMatrix
                ? "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-glow"
                : "font-display font-black tracking-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] 2xl:text-[10rem]"
            }`}
          >
            {isMatrix ? (
              <>PREM <span className="italic text-muted-foreground">MADISHETTY</span></>
            ) : (
              "PREM MADISHETTY"
            )}
          </h2>
        </div>

        {/* Row 4: Footer strip inside the viewport */}
        <div className="col-span-1 md:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/20 text-[9px] md:text-[10px]">
          <span className={`text-muted-foreground/50 tracking-widest uppercase ${isMatrix ? "font-mono" : "font-sans"}`}>
            © 2026 Prem Madishetty {isMatrix ? "// All systems operational" : ""}
          </span>
          <span className={`text-muted-foreground/40 tracking-widest italic ${isMatrix ? "font-mono" : "font-serif"}`}>
            तमसो मा ज्योतिर्गमय
          </span>
          {isMatrix && (
            <span className="font-mono text-muted-foreground/40 tracking-widest uppercase">[ENCRYPTED]</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
