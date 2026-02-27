import { motion } from "framer-motion";
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
  Languages
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
import courseItalianImage from "@/assets/images/course-italian.jpg";

const categories = [
  {
    id: "lingua",
    title: "Corsi di Lingua",
    description: "Inglese, francese, tedesco, spagnolo e russo. Corsi di gruppo, individuali e preparazione certificazioni in presenza a Vicenza e Thiene.",
    icon: Globe,
    image: lingueStraniereImage,
    color: "from-purple-500 to-purple-600",
    courseCount: 4,
    featured: true,
  },
  {
    id: "coaching",
    title: "Language Coaching",
    description: "Percorsi personalizzati 1-to-1 con coach madrelingua. Sviluppa fluency, confidence e competenze comunicative su misura per i tuoi obiettivi.",
    icon: Mic,
    image: languageCoachingImage,
    color: "from-indigo-500 to-indigo-600",
    courseCount: 3,
  },
  {
    id: "online",
    title: "Formazione Online",
    description: "Piattaforma 24/7 con AI e riconoscimento vocale. Corsi blended con tutor madrelingua via Zoom. Studia quando e dove vuoi.",
    icon: Monitor,
    image: corsoOnlineImage,
    color: "from-teal-500 to-teal-600",
    courseCount: 3,
  },
  {
    id: "speakers",
    title: "Speakers' Corner",
    description: "Pratica la conversazione in inglese ogni venerdì con docenti madrelingua. Abbonamento annuale, prova gratuita o lezioni individuali.",
    icon: MessageCircle,
    image: speakersCornerCourseImage,
    color: "from-orange-500 to-orange-600",
    courseCount: 3,
  },
  {
    id: "immersion",
    title: "Full Immersion",
    description: "Workshop intensivi a Vicenza e esperienze outdoor sui colli Vicentini con equitazione. Avanza un livello QCER in una settimana.",
    icon: Mountain,
    image: fullImmersionImage,
    color: "from-green-500 to-green-600",
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
    courseCount: 5,
    featured: true,
  },
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            I Nostri Corsi
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Scegli il Tuo{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Percorso
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Esplora le nostre aree formative e trova il corso perfetto per i tuoi obiettivi</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {category.id === "professional" ? (
                  <a href="https://skillcraft.interlingua.it/" target="_blank" rel="noopener noreferrer">
                    <Card 
                      className="h-full hover-elevate group cursor-pointer relative overflow-hidden"
                      data-testid={`card-category-${category.id}`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={192}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                        <div className={`absolute bottom-3 left-3 p-2 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {category.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {category.courseCount} {category.courseCount === 1 ? "corso" : "corsi"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Tutti i livelli</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-medium text-sm">
                            Esplora
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Link href={category.id === "immersion" ? "/full-immersion" : category.id === "lingua" ? "/formazione-in-presenza" : category.id === "online" ? "/corsi-e-learning" : category.id === "coaching" ? "/language-coaching" : category.id === "speakers" ? "/speakers-corner" : "/"}>
                    <Card 
                      className="h-full hover-elevate group cursor-pointer relative overflow-hidden"
                      data-testid={`card-category-${category.id}`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={192}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                        <div className={`absolute bottom-3 left-3 p-2 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {category.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {category.courseCount} {category.courseCount === 1 ? "corso" : "corsi"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Tutti i livelli</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-medium text-sm">
                            Esplora
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6"
        >
          <Link href="/corsi-italiano">
            <Card className="hover-elevate cursor-pointer group overflow-hidden" data-testid="card-italian-courses">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="relative sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden">
                  <img
                    src={courseItalianImage}
                    alt="Corsi di Italiano a Vicenza"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={192}
                    height={128}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 hidden sm:block" />
                  <div className="absolute bottom-2 left-2 sm:bottom-auto sm:top-2 sm:left-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
                      <Languages className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 flex-1">
                  <div className="text-left flex-1">
                    <h3 className="font-bold group-hover:text-primary transition-colors">Italiano per Stranieri / Italian for Foreigners</h3>
                    <p className="text-sm text-muted-foreground mt-1">Corsi intensivi di lingua italiana a Vicenza - Intensive Italian courses in Vicenza</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm shrink-0">
                    Scopri / Discover
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
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
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Oltre 20 corsi disponibili tra lingue, competenze digitali e crescita personale
          </p>
        </motion.div>
      </div>
    </section>
  );
}
