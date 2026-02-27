import { useEffect } from "react";
import MatrixRain from "./MatrixRain";
import NavigationBar from "./landing/NavigationBar";
import HeroSection from "./landing/HeroSection";
import AboutSection from "./landing/AboutSection";
import WorksSection from "./landing/WorksSection";
import ExperienceSection from "./landing/ExperienceSection";
import ConnectSection from "./landing/ConnectSection";
import GlitchOverlay from "./GlitchOverlay";
import SentinelChat from "./SentinelChat";
import { useTheme } from "@/contexts/ThemeContext";
import { useTracker } from "@/hooks/useTracker";

const OLHA_REVEAL_DELAY_MS = 400;

const PortfolioContent = () => {
  const { mode, revealOlha, triggerBreach } = useTheme();

  // ── VISITOR TRACKING ──
  // Logs session duration, click count, and click targets to D1 on unload
  useTracker();

  // Scroll to top when portfolio mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const t = setTimeout(revealOlha, OLHA_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [revealOlha]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      const href = a?.getAttribute("href");
      if (href?.startsWith("#") && href.length > 1 && mode === "olha") {
        triggerBreach({ forNavigation: true });
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [mode, triggerBreach]);

  return (
    <div className="bg-background relative transition-colors duration-300" style={{ minHeight: "100dvh" }}>
      {mode === "matrix" && <MatrixRain opacity={0.04} speed={0.4} />}
      {mode === "matrix" && (
        <div className="fixed inset-0 scanline pointer-events-none z-10" />
      )}
      <GlitchOverlay />
      <div className="relative z-20">
        <NavigationBar />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <WorksSection />
        <ConnectSection />
      </div>
      <SentinelChat isMatrixMode={mode === "matrix"} />
    </div>
  );
};

const Portfolio = () => <PortfolioContent />;

export default Portfolio;
