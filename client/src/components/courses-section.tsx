import { motion } from "framer-motion";
import { 
  Globe, 
  Code, 
  Briefcase, 
  Brain, 
  Clock, 
  Users,
  ArrowRight,
  Languages
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Course } from "@shared/schema";
import courseEnglish from "@/assets/images/course-english.jpg";
import courseGerman from "@/assets/images/course-german.jpg";
import courseItalian from "@/assets/images/course-italian.jpg";
import courseDigital from "@/assets/images/course-digital.jpg";
import courseSpeaking from "@/assets/images/course-speaking.jpg";
import coursePersonal from "@/assets/images/course-personal.jpg";

const courseImages: Record<string, string> = {
  "1": courseEnglish,
  "2": courseGerman,
  "3": courseItalian,
  "4": courseDigital,
  "5": courseSpeaking,
  "6": coursePersonal,
};

const iconMap: Record<string, any> = {
  globe: Globe,
  code: Code,
  briefcase: Briefcase,
  brain: Brain,
  languages: Languages,
};

const courses: Course[] = [
  {
    id: "1",
    title: "Corsi in Presenza",
    description: "Corsi di inglese, francese, tedesco, spagnolo e russo a Vicenza e Thiene. Docenti madrelingua, gruppi e individuali.",
    category: "languages",
    duration: "3-12 mesi",
    level: "all",
    icon: "globe",
    featured: true,
  },
  {
    id: "2",
    title: "Corsi Online E-Learning",
    description: "Studia quando vuoi con accesso 24/7. Self-Learning o con tutor madrelingua. Inglese, tedesco, francese, spagnolo, russo, portoghese.",
    category: "languages",
    duration: "Flessibile",
    level: "all",
    icon: "languages",
  },
  {
    id: "3",
    title: "Full Immersion Workshop",
    description: "5 giorni intensivi per dare una svolta al tuo inglese. Coach madrelingua, pratica orale, simulazioni reali. Supera un livello QCER in una settimana!",
    category: "languages",
    duration: "5 giorni",
    level: "all",
    icon: "globe",
    featured: true,
  },
  {
    id: "4",
    title: "Certificazioni Linguistiche",
    description: "Preparati per LanguageCert, IELTS, TOEFL, Cambridge, DELF, DELE o Goethe. 12 lezioni live + 60h e-learning + simulazioni d'esame.",
    category: "digital",
    duration: "Personalizzato",
    level: "all",
    icon: "code",
  },
  {
    id: "5",
    title: "Speakers' Corner",
    description: "Pratica l'inglese per un anno con tutor madrelingua qualificati. Lezioni settimanali di conversazione via Zoom.",
    category: "professional",
    duration: "12 mesi",
    level: "intermediate",
    icon: "briefcase",
  },
  {
    id: "6",
    title: "AI e Office",
    description: "Corsi di Intelligenza Artificiale e pacchetto Office per potenziare le tue competenze digitali e professionali.",
    category: "personal",
    duration: "2 mesi",
    level: "all",
    icon: "brain",
  },
];

const categoryLabels: Record<string, string> = {
  languages: "Lingue",
  digital: "Digitale",
  professional: "Professionale",
  personal: "Personale",
};

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzato",
  all: "Tutti i livelli",
};

export function CoursesSection() {
  const handleScrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="courses" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            I Nostri Corsi
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Scegli il Tuo{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Percorso
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Offriamo una vasta gamma di corsi pensati per le tue esigenze. 
            Scopri quello più adatto a te.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const Icon = iconMap[course.icon] || Globe;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover-elevate group cursor-pointer relative overflow-hidden"
                  data-testid={`card-course-${course.id}`}
                >
                  {course.featured && (
                    <div className="absolute top-3 right-3 z-20">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                        Popolare
                      </Badge>
                    </div>
                  )}
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={courseImages[course.id]} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <CardHeader className="pt-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[course.category]}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{levelLabels[course.level]}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group/btn"
                      onClick={handleScrollToContact}
                      data-testid={`button-course-info-${course.id}`}
                    >
                      Scopri di più
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            onClick={handleScrollToContact}
            data-testid="button-all-courses"
          >
            Richiedi Informazioni
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
