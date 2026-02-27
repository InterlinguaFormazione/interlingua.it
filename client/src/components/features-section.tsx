import { motion, useReducedMotion } from "framer-motion";
import { 
  Lightbulb, 
  Users, 
  Clock, 
  Target, 
  Award, 
  HeartHandshake,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Feature } from "@shared/schema";

const iconMap: Record<string, any> = {
  lightbulb: Lightbulb,
  users: Users,
  clock: Clock,
  target: Target,
  award: Award,
  heart: HeartHandshake,
};

const features: Feature[] = [
  {
    id: "1",
    title: "Metodologia Innovativa",
    description: "Approccio didattico moderno basato sull'apprendimento attivo e interattivo.",
    icon: "lightbulb",
  },
  {
    id: "2",
    title: "Docenti Esperti",
    description: "Team di professionisti qualificati con anni di esperienza nel settore.",
    icon: "users",
  },
  {
    id: "3",
    title: "Flessibilità Totale",
    description: "Corsi in presenza, online e blended per adattarsi ai tuoi impegni.",
    icon: "clock",
  },
  {
    id: "4",
    title: "Percorsi Personalizzati",
    description: "Programmi su misura per raggiungere i tuoi obiettivi specifici.",
    icon: "target",
  },
  {
    id: "5",
    title: "Certificazioni Riconosciute",
    description: "Preparazione per certificazioni internazionali valide in tutto il mondo.",
    icon: "award",
  },
  {
    id: "6",
    title: "Supporto Continuo",
    description: "Assistenza dedicata durante tutto il percorso formativo.",
    icon: "heart",
  },
];

const benefits = [
  "Classi con massimo 8 partecipanti",
  "Materiale didattico incluso",
  "Accesso alla piattaforma online",
  "Test di livello gratuito",
  "Attestato di partecipazione",
  "Recupero lezioni perse",
];

function FloatingShape({ className, delay = 0 }: { className?: string; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />

      <FloatingShape
        className="w-72 h-72 bg-primary/[0.06] blur-3xl -top-20 -left-20"
        delay={0}
      />
      <FloatingShape
        className="w-96 h-96 bg-accent/[0.05] blur-3xl -bottom-32 -right-32"
        delay={2}
      />
      <FloatingShape
        className="w-48 h-48 bg-primary/[0.04] blur-2xl top-1/2 left-1/3"
        delay={4}
      />

      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-5">
              Perch&eacute; Sceglierci
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold mb-4 leading-tight tracking-tight">
              La Tua Crescita &egrave; la Nostra{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift">
                Missione
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">Con oltre 30 anni di esperienza nella formazione, abbiamo sviluppato un metodo unico che combina tradizione e innovazione per risultati concreti.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-3 group"
                  data-testid={`benefit-${index}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-accent/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Lightbulb;
              return (
                <motion.div
                  key={feature.id}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative p-6 rounded-md bg-card hover-elevate"
                  data-testid={`feature-${feature.id}`}
                >
                  <div className="absolute inset-0 rounded-md border border-border/50 group-hover:border-transparent transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15)) padding-box, linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3)) border-box',
                      border: '1px solid transparent',
                    }}
                  />

                  <div className="relative z-[1]">
                    <div className="relative p-3 rounded-md bg-gradient-to-br from-primary/10 to-accent/10 w-fit mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
