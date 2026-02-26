import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Globe,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Monitor,
  Mountain,
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  ExternalLink,
  ShoppingCart,
  Send,
  Loader2,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema, type InsertContact } from "@shared/schema";

import categoryLanguages from "@assets/lingue-straniere_1771623311454.webp";
import categorySoftSkills from "@assets/internazionalizzazione-business-development_1771623434911.webp";
import categoryManagement from "@/assets/images/category-management.jpg";
import categoryBusiness from "@assets/management-leadership_1771623365629.webp";
import categoryDigitalSkills from "@assets/intelligenza-artificiale_1771623256532.webp";
import categoryExperiential from "@assets/competenze-trasversali_1771623339669.webp";

const categoryImages: Record<string, string> = {
  lingue: categoryLanguages,
  "competenze-trasversali": categorySoftSkills,
  management: categoryManagement,
  business: categoryBusiness,
  digitale: categoryDigitalSkills,
  "formazione-esperienziale": categoryExperiential,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

interface Course {
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  purchaseUrl?: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Globe;
  color: string;
  courses: Course[];
}

const courseCategories: Category[] = [
  {
    id: "digitale",
    title: "AI & Competenze Digitali",
    subtitle: "Innovazione e tecnologia",
    description: "Digital skills, digital marketing e innovazione digitale & AI per il lavoro moderno.",
    icon: Monitor,
    color: "from-blue-500 to-blue-600",
    courses: [
      {
        title: "Digital Skills",
        description: "Alfabetizzazione e strumenti digitali avanzati per il lavoro moderno.",
        price: "€340",
        duration: "8 settimane",
        features: ["Excel avanzato", "Cloud tools", "Copilot AI", "Certificato"],
        purchaseUrl: "https://interlingua.it/prodotto/office-senza-segreti-excel-word-powerpoint-e-copilot/"
      },
      {
        title: "Digital Marketing",
        description: "Strategie online e contenuti per promuovere il business nel digitale.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Social media", "Content marketing", "SEO basics", "Analytics"]
      },
      {
        title: "Innovazione Digitale & AI",
        description: "Intelligenza artificiale, automazione e nuovi scenari per il futuro.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["ChatGPT & Copilot", "Prompt engineering", "Automazione", "Casi d'uso reali"]
      }
    ]
  },
  {
    id: "management",
    title: "Management & Organizzazione",
    subtitle: "Guidare team e processi",
    description: "Project management, metodologie agile, lean office e gestione risorse umane per guidare team e processi.",
    icon: ClipboardList,
    color: "from-indigo-500 to-indigo-600",
    courses: [
      {
        title: "Project Management",
        description: "Obiettivi, team e processi per gestire progetti di successo.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Metodologie standard", "Gestione risorse", "Pianificazione", "Risk management"]
      },
      {
        title: "Metodologie Agile & Scrum",
        description: "Approcci flessibili e iterativi per lo sviluppo e la gestione dei progetti.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Scrum framework", "Sprint planning", "Retrospettive", "Certificazione"]
      },
      {
        title: "Lean Office & Operations",
        description: "Efficienza e processi snelli per ottimizzare il lavoro quotidiano.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Eliminazione sprechi", "Kaizen", "Value stream", "5S"]
      },
      {
        title: "Gestione Risorse Umane",
        description: "Selezione, sviluppo e motivazione del personale.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Selezione personale", "Sviluppo talenti", "Performance review", "Employer branding"]
      }
    ]
  },
  {
    id: "competenze-trasversali",
    title: "Competenze Trasversali",
    subtitle: "Crescita personale e professionale",
    description: "Comunicazione, problem solving, creatività e leadership per la crescita personale e professionale.",
    icon: MessageSquare,
    color: "from-teal-500 to-teal-600",
    courses: [
      {
        title: "Comunicazione",
        description: "Chiarezza, impatto, ascolto, empatia per migliorare le relazioni professionali.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Public speaking", "Ascolto attivo", "Comunicazione assertiva", "Role playing"]
      },
      {
        title: "Problem Solving",
        description: "Soluzioni rapide ed efficaci per affrontare sfide quotidiane e professionali.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Pensiero analitico", "Decision making", "Casi pratici", "Strumenti operativi"]
      },
      {
        title: "Creatività & Innovazione",
        description: "Pensiero laterale e tecniche creative per generare idee innovative.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Design thinking", "Brainstorming avanzato", "Pensiero laterale", "Prototipazione"]
      },
      {
        title: "Leadership & Teamwork",
        description: "Relazioni, motivazione e collaborazione per guidare e lavorare in team.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Team building", "Motivazione", "Delega efficace", "Gestione conflitti"]
      }
    ]
  },
  {
    id: "business",
    title: "Business & Strategia",
    subtitle: "Strategie per crescere",
    description: "Sales & marketing e pianificazione & controllo per strategie commerciali efficaci e risultati concreti.",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    courses: [
      {
        title: "Sales & Marketing",
        description: "Strategie commerciali efficaci per aumentare vendite e presenza sul mercato.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Tecniche di vendita", "Negoziazione", "CRM", "Analisi mercato"]
      },
      {
        title: "Pianificazione & Controllo",
        description: "Obiettivi, performance e risultati concreti per guidare il business.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Budget", "KPI", "Reporting", "Analisi performance"]
      }
    ]
  },
  {
    id: "formazione-esperienziale",
    title: "Formazione Esperienziale",
    subtitle: "Imparare facendo",
    description: "Workshop indoor e outdoor, full immersion e attività esperienziali per sviluppare competenze attraverso la pratica diretta.",
    icon: Mountain,
    color: "from-green-500 to-green-600",
    courses: [
      {
        title: "Workshop Indoor & Outdoor",
        description: "Attività esperienziali per sviluppare competenze attraverso la pratica diretta.",
        price: "Da €385",
        duration: "1-3 giorni",
        features: ["Team building", "Outdoor training", "Colli Vicentini", "Facilitatori esperti"]
      },
      {
        title: "Full Immersion English",
        description: "Learning week intensive per avanzare di un intero livello QCER in una settimana.",
        price: "Da €750",
        duration: "5-7 giorni",
        features: ["4 coach madrelingua", "Vicenza centro", "Soft skills", "Certificato QCER"]
      },
      {
        title: "The Spirit of Leadership",
        description: "Workshop esperienziale-sportivo con equitazione sui colli Vicentini. Leadership e team working in inglese.",
        price: "Da €385",
        duration: "Weekend",
        features: ["Equitazione", "Team building", "100% in inglese", "Colli Vicentini"]
      }
    ]
  },
  {
    id: "lingue",
    title: "Lingue e Interculturalità",
    subtitle: "Comunicazione globale",
    description: "Lingue straniere, comunicazione interculturale, language coaching e learning week immersive per una comunicazione fluida internazionale.",
    icon: Globe,
    color: "from-purple-500 to-purple-600",
    courses: [
      {
        title: "Lingue Straniere",
        description: "Inglese, francese, tedesco, spagnolo, russo. Corsi di gruppo e individuali per comunicazione fluida internazionale.",
        price: "Da €340",
        duration: "12 settimane",
        features: ["Docente madrelingua", "Livelli QCER", "Certificato finale", "Carta Cultura"],
        purchaseUrl: "https://interlingua.it/prodotto/collettivi-intensivi-presenza/"
      },
      {
        title: "Comunicazione Interculturale e Cross-culturale",
        description: "Apertura e competenze globali per lavorare in contesti internazionali.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Competenze globali", "Casi studio reali", "Role playing", "Certificato"]
      },
      {
        title: "Language Coaching",
        description: "Percorsi personalizzati con coach qualificati per obiettivi specifici.",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["100% personalizzato", "Coach qualificati", "Obiettivi specifici", "Flessibilità totale"]
      },
      {
        title: "Learning Week & Weekend Tematici",
        description: "Esperienze immersive e pratiche per apprendere in modo intensivo.",
        price: "Da €750",
        duration: "5-7 giorni",
        features: ["Full immersion", "Docenti madrelingua", "Approccio esperienziale", "Certificato QCER"]
      }
    ]
  }
];

const contactFormSchema = insertContactSchema.extend({
  name: insertContactSchema.shape.name.min(2, "Il nome deve avere almeno 2 caratteri"),
  message: insertContactSchema.shape.message.min(10, "Il messaggio deve avere almeno 10 caratteri"),
});

function CategoryContactForm({ categoryTitle, color }: { categoryTitle: string; color: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadTime = useRef(Date.now());
  const { toast } = useToast();

  const form = useForm<InsertContact>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseInterest: categoryTitle,
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...data,
        _hp: honeypot,
        _ts: formLoadTime.current,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Messaggio inviato!",
        description: "Ti ricontatteremo al più presto.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  if (isSubmitted) {
    return (
      <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-1">Grazie!</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Abbiamo ricevuto la tua richiesta per {categoryTitle}. Ti ricontatteremo presto!
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline" size="sm">
            Invia un'altra richiesta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white`}>
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Richiedi Informazioni</h3>
            <p className="text-sm text-muted-foreground">Interessato a {categoryTitle}? Scrivici!</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}>
              <input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} data-testid={`input-cat-contact-name-${categoryTitle}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="mario@email.com" {...field} data-testid={`input-cat-contact-email-${categoryTitle}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+39 123 456 7890" {...field} value={field.value ?? ""} data-testid={`input-cat-contact-phone-${categoryTitle}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Messaggio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Vorrei saperne di più sui corsi di ${categoryTitle}...`}
                      className="min-h-24 resize-none"
                      {...field}
                      data-testid={`textarea-cat-contact-message-${categoryTitle}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
              data-testid={`button-cat-contact-submit-${categoryTitle}`}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  Invia Richiesta
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function CoursesPage() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2 flex-wrap">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </Button>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex">
            <GraduationCap className="w-4 h-4 mr-2" />
            Catalogo Formativo Completo
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
          data-testid="section-hero"
        >
          <Badge variant="outline" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Catalogo Completo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            I Nostri{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Corsi
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Lingue straniere, competenze trasversali, management, business, digitale e formazione esperienziale. 
            Scegli il percorso più adatto a te tra le nostre 6 aree formative.
          </p>
        </motion.div>

        <div className="space-y-16">
          {courseCategories.map((category, categoryIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              id={category.id}
              data-testid={`section-category-${category.id}`}
            >
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <div className="absolute inset-0">
                  <img 
                    src={categoryImages[category.id]} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    data-testid={`img-category-${category.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
                </div>
                <div className="relative p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold" data-testid={`text-category-title-${category.id}`}>{category.title}</h2>
                      <p className="text-muted-foreground" data-testid={`text-category-subtitle-${category.id}`}>{category.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course, courseIndex) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: courseIndex * 0.05 }}
                  >
                    <Card className="h-full hover-elevate flex flex-col" data-testid={`card-course-${category.id}-${courseIndex}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <CardTitle className="text-lg" data-testid={`text-course-title-${category.id}-${courseIndex}`}>{course.title}</CardTitle>
                          <Badge className={`bg-gradient-to-r ${category.color} text-white border-0 shrink-0`} data-testid={`badge-price-${category.id}-${courseIndex}`}>
                            {course.price}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {course.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {course.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-col gap-2">
                        <Link href={`/corsi/${slugify(course.title)}`} className="w-full">
                          <Button variant="outline" className="w-full" data-testid={`button-info-${slugify(course.title)}`}>
                            Maggiori Informazioni
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        {course.purchaseUrl && (
                          <a href={course.purchaseUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full gap-2" data-testid={`button-buy-${slugify(course.title)}`}>
                              <ShoppingCart className="w-4 h-4" />
                              Acquista Online
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <CategoryContactForm categoryTitle={category.title} color={category.color} />
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
          id="calendario"
          data-testid="section-calendar"
        >
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <CalendarDays className="w-4 h-4 mr-2" />
              Prossime Date
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Calendario Corsi</h2>
            <p className="text-muted-foreground">Le prossime sessioni in partenza</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { course: "ChatGPT & AI per il Lavoro", date: "10 Marzo 2026", spots: 8, category: "AI & Digitale" },
              { course: "Digital Skills (Excel, Word, Copilot)", date: "17 Marzo 2026", spots: 12, category: "AI & Digitale" },
              { course: "Public Speaking", date: "24 Marzo 2026", spots: 6, category: "Soft Skills" },
              { course: "Project Management Agile", date: "31 Marzo 2026", spots: 10, category: "Management" },
              { course: "Team Building Esperienziale", date: "7 Aprile 2026", spots: 15, category: "Esperienziale" },
              { course: "Inglese - Livello B1/B2", date: "14 Aprile 2026", spots: 8, category: "Lingue" },
            ].map((item, i) => (
              <Card key={i} className="hover-elevate" data-testid={`card-calendar-${i}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{item.course}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">{item.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {item.spots} posti disponibili
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
          data-testid="section-cta"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-cta-title">
              Non sai quale corso scegliere?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Prenota una consulenza gratuita con i nostri esperti. Ti aiuteremo a trovare 
              il percorso formativo più adatto ai tuoi obiettivi.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="gap-2" data-testid="button-contact-cta">
                Contattaci Ora
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
