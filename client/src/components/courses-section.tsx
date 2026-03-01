import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { 
  Globe, 
  Monitor,
  MessageCircle,
  Mountain,
  Mic,
  Briefcase,
  ArrowRight,
  Users,
  BookOpen,
  Sparkles,
  Languages,
  GraduationCap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import categoryPresence from "@/assets/images/category-presence.jpg";
import categoryOnline from "@/assets/images/category-online.jpg";
import categorySpeakers from "@/assets/images/category-speakers.jpg";
import categoryImmersion from "@/assets/images/category-immersion.jpg";
import categoryDigital from "@/assets/images/category-digital.jpg";
import courseIndividual from "@/assets/images/course-individual.jpg";
import lingueStraniereImage from "@assets/lingue-straniere_1772143318023.webp";
import languageCoachingImage from "@assets/Language_Coaching_1772143397641.webp";
import corsoOnlineImage from "@assets/corso-lingua-online_1772143586662.jpg";
import speakersCornerCourseImage from "@assets/Speakers-Corner-Conversazione-in-lingua-Inglese_1772143640698.jpg";
import fullImmersionImage from "@assets/Full-Immersion-Workshop-di-Lingua-Inglese_1772143747179.jpg";
import managementImage from "@assets/management-leadership_1772143822898.webp";
import courseItalianImage from "@assets/Learn_Italin_in_Vicenza_1772214851188.png";

const categories = [
  {
    id: "lingua",
    title: "Corsi di Lingua",
    description: "Inglese, francese, tedesco, spagnolo e russo. Corsi di gruppo, individuali e preparazione certificazioni in presenza a Vicenza e Thiene.",
    icon: Globe,
    image: lingueStraniereImage,
    color: "from-purple-500 to-purple-600",
    glowColor: "purple",
    courseCount: 4,
    featured: true,
  },
  {
    id: "coaching",
    title: "Language Coaching",
    description: "Percorsi personalizzati 1-to-1 con coach qualificati. Sviluppa fluency, confidence e competenze comunicative su misura per i tuoi obiettivi.",
    icon: Mic,
    image: languageCoachingImage,
    color: "from-indigo-500 to-indigo-600",
    glowColor: "indigo",
    courseCount: 3,
  },
  {
    id: "online",
    title: "Formazione Online",
    description: "Piattaforma 24/7 con AI e riconoscimento vocale. Corsi blended con tutor qualificati via Zoom. Studia quando e dove vuoi.",
    icon: Monitor,
    image: corsoOnlineImage,
    color: "from-teal-500 to-teal-600",
    glowColor: "teal",
    courseCount: 3,
  },
  {
    id: "speakers",
    title: "Speakers' Corner",
    description: "Pratica la conversazione in inglese ogni venerdì con docenti qualificati. Abbonamento annuale, prova gratuita o lezioni individuali.",
    icon: MessageCircle,
    image: speakersCornerCourseImage,
    color: "from-orange-500 to-orange-600",
    glowColor: "orange",
    courseCount: 3,
  },
  {
    id: "immersion",
    title: "Full Immersion",
    description: "Workshop intensivi a Vicenza e esperienze outdoor sui colli Vicentini con equitazione. Avanza un livello QCER in una settimana.",
    icon: Mountain,
    image: fullImmersionImage,
    color: "from-green-500 to-green-600",
    glowColor: "green",
    courseCount: 2,
    featured: true,
  },
  {
    id: "professional",
    title: "Competenze Professionali",
    description: "Office, AI, digital skills e crescita personale. Comunicazione efficace, leadership e time management per il tuo sviluppo.",
    icon: Briefcase,
    image: managementImage,
    color: "from-blue-500 to-blue-600",
    glowColor: "blue",
    courseCount: 5,
    featured: true,
  },
];

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const Icon = category.icon;
  const prefersReducedMotion = useReducedMotion();

  const cardContent = (
    <Card 
      className="h-full group cursor-pointer relative overflow-visible"
      data-testid={`card-category-${category.id}`}
    >
      <div className="absolute -inset-[1px] rounded-[inherit] bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
        style={{
          background: `linear-gradient(135deg, transparent 30%, ${
            category.glowColor === 'purple' ? 'rgba(168,85,247,0.3)' :
            category.glowColor === 'indigo' ? 'rgba(99,102,241,0.3)' :
            category.glowColor === 'teal' ? 'rgba(20,184,166,0.3)' :
            category.glowColor === 'orange' ? 'rgba(249,115,22,0.3)' :
            category.glowColor === 'green' ? 'rgba(34,197,94,0.3)' :
            'rgba(59,130,246,0.3)'
          } 70%, transparent 100%)`,
        }}
      />

      <div className="relative rounded-[inherit] overflow-hidden bg-card">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
            loading="lazy"
            decoding="async"
            width={400}
            height={208}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className={`absolute bottom-3 left-3 p-2.5 rounded-md bg-gradient-to-br ${category.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>

          {category.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="text-xs backdrop-blur-md bg-white/80 dark:bg-black/60 border-white/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Popolare
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="pt-4 pb-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
              {category.title}
            </h3>
            <Badge variant="secondary" className="text-xs shrink-0">
              {category.courseCount} {category.courseCount === 1 ? "corso" : "corsi"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Tutti i livelli</span>
            </div>
            <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all duration-300">
              Esplora
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <motion.div
      key={category.id}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {category.id === "professional" ? (
        <a href="https://skillcraft.interlingua.it/" target="_blank" rel="noopener noreferrer">
          {cardContent}
        </a>
      ) : (
        <Link href={category.id === "immersion" ? "/full-immersion" : category.id === "lingua" ? "/formazione-in-presenza" : category.id === "online" ? "/corsi-e-learning" : category.id === "coaching" ? "/language-coaching" : category.id === "speakers" ? "/speakers-corner" : "/"}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}

export function CoursesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="courses" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04] dark:opacity-[0.06] animate-float-slow"
          style={{ background: 'radial-gradient(circle, hsl(222 67% 50%) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.03] dark:opacity-[0.05] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(20 91% 53%) 0%, transparent 70%)' }}
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            I Nostri Corsi
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            Scegli il Tuo{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Percorso
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Esplora le nostre aree formative e trova il corso perfetto per i tuoi obiettivi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8"
        >
          <Link href="/corsi-italiano">
            <Card className="group cursor-pointer overflow-visible relative" data-testid="card-italian-courses">
              <div className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.25) 50%, transparent 100%)',
                }}
              />
              <div className="relative rounded-[inherit] overflow-hidden bg-card">
                <div className="flex flex-col sm:flex-row items-stretch">
                  <div className="relative sm:w-56 h-36 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={courseItalianImage}
                      alt="Corsi di Italiano a Vicenza"
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                      width={224}
                      height={144}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/80 hidden sm:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent sm:hidden" />
                    <div className="absolute bottom-3 left-3 sm:bottom-auto sm:top-3 sm:left-3">
                      <div className="p-2.5 rounded-md bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                        <Languages className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 flex-1">
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">Italiano per Stranieri / Italian for Foreigners</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Corsi intensivi di lingua italiana a Vicenza - Intensive Italian courses in Vicenza</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm shrink-0 group-hover:gap-3 transition-all duration-300">
                      Scopri / Discover
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-10"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              size="lg" 
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="button-request-info"
            >
              Richiedi Informazioni
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/test-di-livello">
              <Button size="lg" variant="outline" data-testid="button-courses-test">
                <GraduationCap className="mr-2 h-5 w-5" />
                Fai il Test di Livello
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Oltre 20 corsi disponibili tra lingue, competenze digitali e crescita personale
          </p>
        </motion.div>
      </div>
    </section>
  );
}
