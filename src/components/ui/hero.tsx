"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.08 + layer * 0.05;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  };
}

// Swiss-red light beams (instead of the original cyan) to fit the brand.
const BEAM_RGB = "228,51,32";

export const PremiumHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [titleNumber, setTitleNumber] = useState(0);

  const LAYERS = 3;
  const BEAMS_PER_LAYER = 8;

  // Rotating words — the things this product spares you.
  const painWords = [
    "la repayer",
    "documents périmés",
    "délai manqué",
    "mauvaise surprise",
    "tout recommencer",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseRef.current;
    if (!canvas || !noiseCanvas) return;
    const ctx = canvas.getContext("2d");
    const nCtx = noiseCanvas.getContext("2d");
    if (!ctx || !nCtx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      noiseCanvas.width = window.innerWidth * dpr;
      noiseCanvas.height = window.innerHeight * dpr;
      noiseCanvas.style.width = `${window.innerWidth}px`;
      noiseCanvas.style.height = `${window.innerHeight}px`;
      nCtx.setTransform(1, 0, 0, 1, 0, 0);
      nCtx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(
            createBeam(window.innerWidth, window.innerHeight, layer),
          );
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i + 1] = v;
        imgData.data[i + 2] = v;
        imgData.data[i + 3] = 12;
      }
      nCtx.putImageData(imgData, 0, 0);
    };

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = Math.min(
        1,
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4),
      );
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `rgba(${BEAM_RGB},0)`);
      gradient.addColorStop(0.2, `rgba(${BEAM_RGB},${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(${BEAM_RGB},${pulsingOpacity})`);
      gradient.addColorStop(0.8, `rgba(${BEAM_RGB},${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${BEAM_RGB},0)`);

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#070707");
      gradient.addColorStop(1, "#141414");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
        drawBeam(beam);
      });

      generateNoise();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % painWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [painWords.length]);

  return (
    <div className="relative w-full min-h-[82vh] overflow-hidden">
      <canvas ref={noiseRef} className="absolute inset-0 z-0 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      {/* Fade the dark canvas into the page background so the next section flows in */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-20 flex min-h-[82vh] w-full items-center justify-center px-6 py-16 text-center">
        <div className="container mx-auto flex flex-col items-center gap-7 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.svg"
            alt="MaNaturalisation"
            className="h-40 w-auto md:h-56"
          />

          <h1 className="max-w-4xl text-3xl font-semibold tracking-tighter text-white sm:text-4xl md:text-6xl">
            <span className="block font-normal text-white/90">Votre naturalisation,</span>
            <span className="relative mt-1 flex h-[1.4em] items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={titleNumber}
                  className="whitespace-nowrap font-semibold text-[rgb(228,51,32)]"
                  initial={{ opacity: 0, y: "0.6em" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "-0.6em" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  sans {painWords[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-white/60 md:text-xl">
            Des années de présence. Plus de 1&apos;000 CHF d&apos;émoluments non
            remboursables. Et il suffit d&apos;une attestation périmée ou d&apos;une
            condition oubliée pour que tout reparte à zéro. On vous évite l&apos;erreur
            qui coûte des mois.
          </p>

          <div className="flex flex-row flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/eligibilite">
                Tester mon éligibilité, gratuit <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/#fonctionnement">Comment ça marche</Link>
            </Button>
          </div>

          <p className="text-sm text-white/40">
            Sans carte bancaire. Le suivi complet se débloque ensuite pour 39 CHF, une
            seule fois.
          </p>
        </div>
      </div>
    </div>
  );
};
