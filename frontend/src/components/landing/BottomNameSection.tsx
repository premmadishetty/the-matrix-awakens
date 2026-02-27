import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const BottomNameSection = () => {
  const { mode } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 py-24 md:py-32 max-w-7xl mx-auto"
    >
      <h2
        className={`leading-none text-foreground uppercase whitespace-nowrap ${
          mode === "matrix"
            ? "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-glow"
            : "font-display tracking-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
        }`}
      >
        {mode === "matrix" ? (
          <>PREM <span className="italic text-muted-foreground">MADISHETTY</span></>
        ) : (
          "PREM MADISHETTY"
        )}
      </h2>
    </motion.section>
  );
};

export default BottomNameSection;
