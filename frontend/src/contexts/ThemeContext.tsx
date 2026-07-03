import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export type ThemeMode = "olha" | "dark" | "matrix";
export type TimeOfDay = "morning" | "afternoon" | "twilight" | "night" | "dawn";
export interface TriggerBreachOptions { forNavigation?: boolean; }

// Time-of-day sub-theme — applies only within olha/dark modes (matrix ignores it)
const getTimeOfDay = (): TimeOfDay => {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return "morning";
  if (h >= 10 && h < 16) return "afternoon";
  if (h >= 16 && h < 20) return "twilight";
  if (h >= 20 || h < 2)  return "night";
  return "dawn"; // 2am–5am
};

interface ThemeContextType {
  mode: ThemeMode;
  timeOfDay: TimeOfDay;
  isGlitching: boolean;
  revealOlha: () => void;
  triggerBreach: (options?: TriggerBreachOptions) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "matrix", timeOfDay: "afternoon", isGlitching: false,
  revealOlha: () => {}, triggerBreach: () => {}, toggleMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);
const NAVIGATION_GLITCH_DURATION_MS = 4000;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("matrix");
  const [timeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());
  const [isGlitching, setIsGlitching] = useState(false);
  const timerRef = useRef<number | null>(null);
  const baseModeRef = useRef<"olha" | "dark">("olha"); // tracks last non-matrix mode
  const nextModeRef = useRef<"olha" | "dark">("dark");

  const revealOlha = useCallback(() => {
    setMode("olha");
    baseModeRef.current = "olha";
  }, []);

  const toggleMode = useCallback(() => {
    if (isGlitching || mode === "matrix") return;
    const next: "olha" | "dark" = mode === "olha" ? "dark" : "olha";
    nextModeRef.current = next;
    baseModeRef.current = next;
    setIsGlitching(true);
    setMode("matrix");
    setTimeout(() => {
      setMode(nextModeRef.current);
      setIsGlitching(false);
    }, 800);
  }, [isGlitching, mode]);

  const triggerBreach = useCallback((options?: TriggerBreachOptions) => {
    if (isGlitching) return;
    // Save current base mode before breaching
    if (mode !== "matrix") baseModeRef.current = mode as "olha" | "dark";
    const forNavigation = options?.forNavigation === true;
    setIsGlitching(true);
    setTimeout(() => {
      setMode("matrix");
      setIsGlitching(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setMode(baseModeRef.current); // return to whatever mode we were in
          setIsGlitching(false);
        }, 400);
      }, forNavigation ? NAVIGATION_GLITCH_DURATION_MS : 5000);
    }, 400);
  }, [isGlitching, mode]);

  const themeClass = mode === "matrix" ? "theme-matrix" : mode === "dark" ? "theme-dark" : "theme-olha";

  return (
    <ThemeContext.Provider value={{ mode, timeOfDay, isGlitching, revealOlha, triggerBreach, toggleMode }}>
      <div className={themeClass} data-time={timeOfDay}>{children}</div>
    </ThemeContext.Provider>
  );
};
