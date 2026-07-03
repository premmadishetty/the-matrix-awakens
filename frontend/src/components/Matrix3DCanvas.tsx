import { useEffect, useRef } from "react";

const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
const CHARS = KATAKANA + "0123456789ABCDEF";
const OM = "ॐ";

const NUM_LAYERS = 8;
const TOTAL_DEPTH = 2400;
const FOCAL = 600;
const DURATION = 3200;

interface Drop {
  x: number;
  y: number;
  z: number;
  char: string;
  speed: number;
  brightness: number;
  ticker: number;
  isOm: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Props {
  onComplete: () => void;
}

const Matrix3DCanvas = ({ onComplete }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const drops: Drop[] = [];
    const spreadX = W * 3;
    const spreadY = H * 3;

    // ── 8 dense depth layers — no focus chain ──
    for (let layer = 0; layer < NUM_LAYERS; layer++) {
      const baseZ = 300 + layer * ((TOTAL_DEPTH - 300) / NUM_LAYERS);
      const count = 80 + layer * 35; // much denser
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * spreadX - spreadX / 3,
          y: Math.random() * spreadY - spreadY / 3,
          z:
            baseZ +
            (Math.random() - 0.5) *
              ((TOTAL_DEPTH - 300) / NUM_LAYERS) *
              0.6,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          speed: 0.3 + Math.random() * 0.5,
          brightness: 0.3 + Math.random() * 0.7,
          ticker: Math.floor(Math.random() * 60),
          isOm: false,
        });
      }
    }

    // ── Single OM character placed at a mid-depth, near center ──
    const omZ = TOTAL_DEPTH * 0.7;
    drops.push({
      x: W / 2 + (Math.random() - 0.5) * 60,
      y: H / 2 + (Math.random() - 0.5) * 60,
      z: omZ,
      char: OM,
      speed: 0.3,
      brightness: 1,
      ticker: Infinity, // never changes
      isOm: true,
    });

    // Sort far-to-near (back-to-front)
    drops.sort((a, b) => b.z - a.z);

    const t0 = performance.now();
    let raf: number;

    const frame = (now: number) => {
      const elapsed = now - t0;
      const t = Math.min(elapsed / DURATION, 1);
      const camZ = easeInOutCubic(t) * TOTAL_DEPTH * 0.65;

      // Fading trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, W, H);

      for (const d of drops) {
        // Lazy fall
        d.y += d.speed;
        if (d.y > spreadY / 2) d.y -= spreadY;

        // Random character swap (OM never changes)
        if (d.ticker !== Infinity) {
          d.ticker--;
          if (d.ticker <= 0) {
            d.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            d.ticker = 12 + Math.floor(Math.random() * 50);
          }
        }

        // Perspective projection
        const dz = d.z - camZ;
        if (dz < 15) continue;

        const sc = FOCAL / dz;
        const sx = (d.x - W / 2) * sc + W / 2;
        const sy = (d.y - H / 2) * sc + H / 2;
        const fs = 16 * sc;

        if (fs < 1.5 || sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80)
          continue;

        const a = d.brightness * Math.min(1, sc * 1.8);

        // ── Draw ──
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        if (d.isOm && t > 0.5) {
          // OM character — subtle glow, NOT oversized
          const glow = Math.min(1, (t - 0.5) / 0.4);
          ctx.shadowColor = `rgba(0,255,65,${glow * 0.7})`;
          ctx.shadowBlur = 8 + glow * 18;
          ctx.fillStyle = `rgba(0,255,65,${Math.min(1, a + glow * 0.5)})`;
          // Only slightly larger than surrounding chars
          ctx.font = `bold ${fs * (1 + glow * 0.15)}px "Noto Sans Devanagari", "Fira Code", sans-serif`;
        } else {
          ctx.fillStyle = `rgba(0,255,65,${a * 0.6})`;
          ctx.font = `${fs}px "Fira Code", monospace`;
        }

        ctx.fillText(d.char, sx, sy);
      }

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // Fade to black at end
      if (t > 0.82) {
        const fade = (t - 0.82) / 0.18;
        ctx.fillStyle = `rgba(0,0,0,${fade})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    };

    raf = requestAnimationFrame(frame);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="fixed inset-0" />;
};

export default Matrix3DCanvas;
