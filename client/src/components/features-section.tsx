import { motion } from "framer-motion";
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

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Perché Sceglierci
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              La Tua Crescita è la Nostra{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Missione
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">Con oltre 30 anni di esperienza nella formazione, abbiamo sviluppato un metodo unico che combina tradizione e innovazione per risultati concreti.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                  data-testid={`benefit-${index}`}
                >
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Lightbulb;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-xl bg-card border border-border/50 hover-elevate"
                  data-testid={`feature-${feature.id}`}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 w-fit mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
