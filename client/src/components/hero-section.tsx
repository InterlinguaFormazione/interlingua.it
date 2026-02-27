import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
  { icon: Users, end: 10000, suffix: "+", label: "Studenti Formati", decimals: 0 },
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
      className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
      data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <Icon className="h-8 w-8 text-white/80 mb-2" />
      <span className="text-2xl font-bold text-white" data-testid={`stat-value-${label.toLowerCase().replace(/\s/g, "-")}`}>
        {display}{suffix}
      </span>
      <span className="text-sm text-white/70">{label}</span>
    </motion.div>
  );
}

export function HeroSection() {
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20 text-white no-default-hover-elevate no-default-active-elevate" data-testid="badge-leader">
              <Sparkles className="w-4 h-4 mr-2" />
              AI, Digital Skills e Formazione Professionale
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-white"
            data-testid="hero-headline"
          >
            Cresci con{" "}
            <span className="relative">
              <span className="font-serif bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Noi
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 100 4 150 6C200 8 250 4 298 8"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="hsl(222, 67%, 40%)" />
                    <stop offset="50%" stopColor="hsl(20, 91%, 53%)" />
                    <stop offset="100%" stopColor="hsl(222, 67%, 40%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg sm:text-xl font-medium text-white/90 mb-2"
            data-testid="hero-subtitle"
          >
            Intelligenza Artificiale, Competenze Digitali e Crescita Professionale dal 1993
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto"
            data-testid="hero-description"
          >
            Impara a usare l'AI per la tua produttività. Corsi di ChatGPT, Copilot,
            automazione, digital marketing, soft skills, management e lingue.
            Percorsi formativi su misura, in presenza o online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              className="text-base px-8 shadow-lg shadow-primary/25"
              data-testid="button-explore-courses"
              onClick={() => {
                const el = document.querySelector("#courses");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Esplora i Corsi
              <ArrowRight className="ml-2 h-5 w-5" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
