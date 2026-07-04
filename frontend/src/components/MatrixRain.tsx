import { useEffect, useRef } from "react";

const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
const CHARS = KATAKANA + "0123456789ABCDEF";

interface MatrixRainProps {
  opacity?: number;
  speed?: number;
  /** Longer trails (lower = longer). Default 0.05. */
  fade?: number;
  /** Denser columns + two staggered streams per column. Default false. */
  dense?: boolean;
}

const MatrixRain = ({ opacity = 1, speed = 1, fade = 0.05, dense = false }: MatrixRainProps) => {
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

    const fontSize = dense ? 11 : 14;
    const columns = Math.floor(canvas.width / fontSize);
    // In dense mode every column has TWO streams offset vertically, so the
    // screen stays packed with characters even when scaled up during the zoom.
    const lanes = dense ? 2 : 1;
    const drops: number[] = [];
    const speeds: number[] = [];
    for (let l = 0; l < lanes; l++) {
      for (let i = 0; i < columns; i++) {
        drops.push(Math.random() * -100 - l * 40);
        speeds.push((0.5 + Math.random() * 1.5) * speed);
      }
    }

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const col = i % columns;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = col * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random() > 0.1 ? 1 : 0.7;
        ctx.fillStyle = `rgba(0, 255, 65, ${brightness})`;
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
  }, [speed, fade, dense]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity }}
    />
  );
};

export default MatrixRain;
