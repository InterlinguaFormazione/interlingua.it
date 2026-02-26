import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, GraduationCap, Award, Calendar } from "lucide-react";

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Studenti Formati", duration: 2000 },
  { icon: GraduationCap, value: 200, suffix: "+", label: "Corsi Erogati", duration: 1800 },
  { icon: Award, value: 30, suffix: "+", label: "Anni di Esperienza", duration: 1500 },
  { icon: Calendar, value: 98, suffix: "%", label: "Soddisfazione Clienti", duration: 2200 },
];

function AnimatedCounter({ value, suffix, duration }: { value: number; suffix: string; duration: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {count.toLocaleString("it-IT")}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={stat.duration} />
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
