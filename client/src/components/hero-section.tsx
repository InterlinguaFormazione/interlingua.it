import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ArrowRight, Sparkles, Users, Award, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroFallback from "@/assets/images/hero-fallback.jpg";
import heroVideo from "@/assets/videos/hero-video.mp4";

function useCounter(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16);
          timerRef.current = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              if (timerRef.current) clearInterval(timerRef.current);
            } else {
              setCount(Math.floor(start * Math.pow(10, decimals)) / Math.pow(10, decimals));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [end, duration, decimals]);

  return { count, ref };
}

const stats = [
  { icon: Users, end: 15000, suffix: "+", label: "Studenti Formati", decimals: 0 },
  { icon: BookOpen, end: 20, suffix: "+", label: "Corsi Disponibili", decimals: 0 },
  { icon: Award, end: 30, suffix: "+", label: "Anni di Esperienza", decimals: 0 },
  { icon: Star, end: 4.8, suffix: "", label: "Stelle Google", decimals: 1 },
];

function StatCard({ icon: Icon, end, suffix, label, decimals, index }: {
  icon: typeof Users;
  end: number;
  suffix: string;
  label: string;
  decimals: number;
  index: number;
}) {
  const { count, ref } = useCounter(end, 2000, decimals);
  const display = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString();
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.12, ease: "easeOut" }}
      className="group relative flex flex-col items-center p-5 rounded-2xl overflow-visible"
      data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-white/[0.07] backdrop-blur-xl" />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />
      <div
        className="absolute -inset-[1px] rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05), rgba(255,255,255,0.15))",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={prefersReduced ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        >
          <Icon className="h-7 w-7 text-white/80 mb-2" />
        </motion.div>
        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight" data-testid={`stat-value-${label.toLowerCase().replace(/\s/g, "-")}`}>
          {display}{suffix}
        </span>
        <span className="text-xs sm:text-sm text-white/60 font-medium mt-1">{label}</span>
      </div>
    </motion.div>
  );
}

function DotGridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

function FloatingOrbs() {
  const prefersReduced = useReducedMotion();

  const orbs = useMemo(() => [
    { color: "hsl(222, 67%, 50%)", size: 400, x: "10%", y: "20%", delay: 0 },
    { color: "hsl(20, 91%, 53%)", size: 300, x: "75%", y: "60%", delay: 2 },
    { color: "hsl(222, 67%, 45%)", size: 250, x: "60%", y: "10%", delay: 4 },
    { color: "hsl(20, 91%, 48%)", size: 200, x: "20%", y: "70%", delay: 1 },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
            opacity: 0.15,
          }}
          animate={prefersReduced ? {} : {
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 md:pt-32 overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={heroFallback}
          data-testid="hero-video"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/50" />
      </div>

      <FloatingOrbs />
      <DotGridOverlay />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-8 px-5 py-2.5 bg-white/[0.08] backdrop-blur-md border-white/[0.15] text-white no-default-hover-elevate no-default-active-elevate" data-testid="badge-leader">
              <Sparkles className="w-4 h-4 mr-2" />
              Lingue, AI e Formazione Professionale
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-5 text-white leading-[0.95]"
            data-testid="hero-headline"
          >
            Cresci con{" "}
            <span className="relative inline-block">
              <span className="font-serif bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Noi
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 10C50 4 100 4 150 6C200 8 250 4 298 8"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="hsl(222, 67%, 40%)" />
                    <stop offset="50%" stopColor="hsl(20, 91%, 53%)" />
                    <stop offset="100%" stopColor="hsl(222, 67%, 40%)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-medium text-white/90 mb-3"
            data-testid="hero-subtitle"
          >
            Lingue, AI, Digital Skills e Crescita Professionale dal 1993
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            data-testid="hero-description"
          >
            Corsi di lingua, Full Immersion, Language Coaching,
            competenze digitali, AI, soft skills e management.
            In presenza a Vicenza e Thiene, online o in modalità blended.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          >
            <Button
              size="lg"
              className="relative text-base px-8 shadow-lg shadow-primary/25 overflow-hidden group"
              data-testid="button-explore-courses"
              onClick={() => {
                const el = document.querySelector("#courses");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Esplora i Corsi
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white"
              onClick={() => handleScrollTo("#contact")}
              data-testid="button-free-consultation"
            >
              Consulenza Gratuita
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            data-testid="hero-stats"
          >
            {stats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" data-testid="scroll-indicator">
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-7 h-11 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div
            className="w-1.5 h-3 rounded-full bg-gradient-to-b from-white/70 to-white/20"
            animate={prefersReduced ? {} : { opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
