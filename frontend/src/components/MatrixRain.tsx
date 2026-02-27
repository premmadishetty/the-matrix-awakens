import { useEffect, useRef } from "react";

const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
const CHARS = KATAKANA + "0123456789ABCDEF";

interface MatrixRainProps {
  opacity?: number;
  speed?: number;
}

const MatrixRain = ({ opacity = 1, speed = 1 }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);
    const speeds: number[] = new Array(columns).fill(0).map(() => (0.5 + Math.random() * 1.5) * speed);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character - bright
        const brightness = Math.random() > 0.1 ? 1 : 0.7;
        ctx.fillStyle = `rgba(0, 255, 65, ${brightness})`;
        ctx.font = `${fontSize}px "Fira Code", monospace`;
        ctx.fillText(char, x, y);

        // White flash on leading edge
        if (Math.random() > 0.95) {
          ctx.fillStyle = "rgba(180, 255, 180, 0.9)";
          ctx.fillText(char, x, y);
        }

        drops[i] += speeds[i];

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity }}
    />
  );
};

export default MatrixRain;
