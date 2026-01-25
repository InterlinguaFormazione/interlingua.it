import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Monitor, 
  MessageCircle, 
  Mountain,
  Laptop,
  Sparkles,
  GraduationCap,
  Baby,
  BookOpen,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import categoryPresence from "@/assets/images/category-presence.jpg";
import categoryOnline from "@/assets/images/category-online.jpg";
import categorySpeakers from "@/assets/images/category-speakers.jpg";
import categoryImmersion from "@/assets/images/category-immersion.jpg";
import categoryKids from "@/assets/images/category-kids.jpg";
import categoryDigital from "@/assets/images/category-digital.jpg";
import categoryGrowth from "@/assets/images/category-growth.jpg";

import courseGroup from "@/assets/images/course-group.jpg";
import courseIndividual from "@/assets/images/course-individual.jpg";
import courseCertification from "@/assets/images/course-certification.jpg";
import courseElearning from "@/assets/images/course-elearning.jpg";
import courseConversation from "@/assets/images/course-conversation.jpg";
import courseAdventure from "@/assets/images/course-adventure.jpg";
import courseChildren from "@/assets/images/course-children.jpg";
import courseTeens from "@/assets/images/course-teens.jpg";
import courseExcel from "@/assets/images/course-excel.jpg";
import courseAi from "@/assets/images/course-ai.jpg";

const categoryImages: Record<string, string> = {
  presenza: categoryPresence,
  online: categoryOnline,
  speakers: categorySpeakers,
  immersion: categoryImmersion,
  kids: categoryKids,
  digital: categoryDigital,
  growth: categoryGrowth,
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

const courseImages: Record<string, string> = {
  "Corsi di Lingua di Gruppo": courseGroup,
  "Corsi Individuali": courseIndividual,
  "Preparazione Certificazioni": courseCertification,
  "English Debate Lab": courseConversation,
  "Supporto Scolastico": courseTeens,
  "Self-Learning + Piattaforma": courseElearning,
  "Blended Individuale": courseIndividual,
  "Blended di Gruppo": courseGroup,
  "Corso in Mini-Gruppi": courseGroup,
  "Preparazione Certificazioni Online": courseCertification,
  "Abbonamento Annuale": courseConversation,
  "Prova Gratuita 1 Mese": courseConversation,
  "Conversazione Individuale": courseConversation,
  "Full Immersion Workshop": courseAdventure,
  "Spirit of Leadership": courseAdventure,
  "Kids' Courses": courseChildren,
  "Summer City Camp": courseChildren,
  "Summer Camp Esperienziale": courseAdventure,
  "Corsi Online per Ragazzi": courseElearning,
  "AI for Students": courseAi,
  "Vacanze Studio Estero": courseTeens,
  "Office Senza Segreti": courseExcel,
  "AI Senza Segreti": courseAi,
  "Digital Skills Bootcamp": courseExcel,
  "Comunicazione Efficace": courseGroup,
  "Time Management": courseExcel,
  "Mindfulness & Wellbeing": courseAdventure,
};

const courseCategories = [
  {
    id: "presenza",
    title: "Formazione in Presenza",
    subtitle: "Corsi a Vicenza e Thiene",
    description: "Lezioni con docenti madrelingua qualificati nelle nostre sedi. Metodologia C.L.I.L. e approccio esperienziale.",
    icon: MapPin,
    color: "from-purple-500 to-purple-600",
    courses: [
      {
        title: "Corsi di Lingua di Gruppo",
        description: "Inglese, francese, tedesco, spagnolo, russo. 12 settimane, 1 lezione/settimana + piattaforma e-learning 24/7",
        price: "€340",
        duration: "12 settimane",
        features: ["Docente madrelingua", "Livelli QCER", "Certificato finale", "Carta Cultura"],
        purchaseUrl: "https://interlingua.it/prodotto/collettivi-intensivi-presenza/"
      },
      {
        title: "Corsi Individuali",
        description: "Percorso personalizzato one-to-one con massima flessibilità di orari e contenuti",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["100% personalizzato", "Orari flessibili", "Obiettivi specifici", "Preparazione esami"]
      },
      {
        title: "Preparazione Certificazioni",
        description: "Cambridge, IELTS, TOEFL, DELF, DELE, Goethe e altre certificazioni internazionali",
        price: "€400",
        duration: "8-12 settimane",
        features: ["Simulazioni d'esame", "Materiale ufficiale", "Feedback dettagliato", "Alta % successo"]
      },
      {
        title: "English Debate Lab",
        description: "Laboratorio di dibattito in inglese per sviluppare capacità argomentative e pensiero critico",
        price: "€320",
        duration: "8 settimane",
        features: ["Public speaking", "Pensiero critico", "Argomentazione", "Docente madrelingua"]
      },
      {
        title: "Supporto Scolastico",
        description: "Ripetizioni e supporto personalizzato per studenti di scuole medie e superiori",
        price: "Su richiesta",
        duration: "Personalizzata",
        features: ["Tutte le materie", "Preparazione verifiche", "Metodo di studio", "Docenti qualificati"]
      }
    ]
  },
  {
    id: "online",
    title: "E-Learning Online",
    subtitle: "Impara ovunque tu sia",
    description: "Piattaforma blended con tutor madrelingua e community internazionale di 4 milioni di studenti.",
    icon: Monitor,
    color: "from-teal-500 to-teal-600",
    courses: [
      {
        title: "Self-Learning + Piattaforma",
        description: "Accesso 24/7 alla piattaforma con AI, riconoscimento vocale e contenuti interattivi",
        price: "Da €25/mese",
        duration: "Rinnovabile",
        features: ["Accesso 24/7", "Community 4M studenti", "AI integrata", "7 lingue disponibili"],
        purchaseUrl: "https://interlingua.it/prodotto/corsi-su-piattaforma-online-della-durata-di-un-mese-di-lingua-inglese-francese-tedesca-spagnola-russa/"
      },
      {
        title: "Blended Individuale",
        description: "Piattaforma e-learning + 2-4 lezioni individuali al mese con tutor madrelingua via Zoom",
        price: "Da €65/mese",
        duration: "Rinnovabile",
        features: ["Lezioni live Zoom", "Tutor dedicato", "Flessibilità totale", "Carta Cultura"],
        purchaseUrl: "https://interlingua.it/prodotto/corsi-su-piattaforma-online-della-durata-di-un-mese-di-lingua-inglese-francese-tedesca-spagnola-russa/"
      },
      {
        title: "Blended di Gruppo",
        description: "Piattaforma e-learning + 1 lezione di gruppo a settimana in aula virtuale",
        price: "€45/mese",
        duration: "Rinnovabile",
        features: ["Lezioni serali", "Piccoli gruppi", "Interazione sociale", "Costo contenuto"]
      },
      {
        title: "Corso in Mini-Gruppi",
        description: "Lezioni online in piccoli gruppi con docente madrelingua. Massima interazione garantita",
        price: "€55/mese",
        duration: "Rinnovabile",
        features: ["Max 6 studenti", "Docente madrelingua", "Orari serali", "Zoom live"]
      },
      {
        title: "Preparazione Certificazioni Online",
        description: "Preparazione a distanza per Cambridge, IELTS, DELF, DELE con simulazioni e feedback",
        price: "€380",
        duration: "8-12 settimane",
        features: ["Simulazioni online", "Materiale digitale", "Tutor dedicato", "Esami mock"]
      }
    ]
  },
  {
    id: "speakers",
    title: "Speakers' Corner",
    subtitle: "Pratica la conversazione",
    description: "Incontri settimanali di conversazione in inglese con docenti madrelingua. Frequenza libera, temi sempre nuovi.",
    icon: MessageCircle,
    color: "from-orange-500 to-orange-600",
    courses: [
      {
        title: "Abbonamento Annuale",
        description: "Accesso illimitato agli incontri settimanali di conversazione. Ogni venerdì alle 18:30 su Zoom",
        price: "€200/anno",
        duration: "12 mesi",
        features: ["Frequenza libera", "Temi settimanali", "Livello B1+", "Metodologia CLIL"],
        purchaseUrl: "https://interlingua.it/prodotto/cam-class-speakers-corner-abbonamento-annuale/"
      },
      {
        title: "Prova Gratuita 1 Mese",
        description: "Prova lo Speakers' Corner gratuitamente per un mese. Nessun impegno, cancella quando vuoi",
        price: "Gratis",
        duration: "1 mese",
        features: ["Senza impegno", "Accesso completo", "Prenota online", "Cancellazione libera"],
        purchaseUrl: "https://interlingua.it/speakers-corner-trial-page/"
      },
      {
        title: "Conversazione Individuale",
        description: "Carnet di 5 lezioni individuali con il docente che preferisci. Prenotazione via app",
        price: "€95",
        duration: "5 lezioni",
        features: ["Orario flessibile", "Scelta docente", "Zoom live", "Prenotazione app"],
        purchaseUrl: "https://interlingua.it/prodotto/cam-class-conversazione-lingua-5-lezioni/"
      }
    ]
  },
  {
    id: "immersion",
    title: "Full Immersion",
    subtitle: "Esperienze trasformative",
    description: "Workshop superintensivi per avanzare di un intero livello QCER. Disponibili in versione indoor a Vicenza o outdoor sui colli Vicentini.",
    icon: Mountain,
    color: "from-green-500 to-green-600",
    courses: [
      {
        title: "Full Immersion Workshop",
        description: "Workshop indoor superintensivo a Vicenza centro. 4 formatori madrelingua specializzati. Avanza un intero livello QCER in una settimana",
        price: "Da €750",
        duration: "5-7 giorni",
        features: ["4 coach madrelingua", "Vicenza UNESCO", "Soft Skills", "Certificato QCER"]
      },
      {
        title: "Spirit of Leadership",
        description: "Workshop esperienziale outdoor sui colli Vicentini con equitazione. Leadership, Team Working, Problem Solving in inglese",
        price: "Da €385",
        duration: "Weekend o settimana",
        features: ["Equitazione", "Team building", "Colli Vicentini", "100% in inglese"]
      }
    ]
  },
  {
    id: "kids",
    title: "Bambini e Ragazzi",
    subtitle: "Dai 5 ai 16 anni",
    description: "Corsi dedicati ai giovani con metodologie ludiche e coinvolgenti. Grammar Games, English Theatre, Team Building e molto altro.",
    icon: Baby,
    color: "from-pink-500 to-pink-600",
    courses: [
      {
        title: "Kids' Courses",
        description: "Corsi di gruppo per bambini e ragazzi 5-16 anni a Vicenza e Thiene. 1 incontro/settimana di 1h15min con docente madrelingua",
        price: "€370/quadrimestre",
        duration: "20 ore (1 quadrimestre)",
        features: ["Max 5 partecipanti", "Grammar Games, English Theatre", "Divisi per fascia d'età", "Materiale incluso"],
        purchaseUrl: "https://interlingua.it/kids-courses/"
      },
      {
        title: "Summer City Camp",
        description: "Settimane estive in inglese presso la sede di Vicenza. Lun-Ven 8:30-12:30 con 2 docenti madrelingua. 3 materie a scelta",
        price: "€335/settimana",
        duration: "Giugno-Settembre",
        features: ["Full immersion", "2 docenti madrelingua", "Centro Vicenza", "Attestato finale"],
        purchaseUrl: "https://interlingua.it/summercamp/"
      },
      {
        title: "Summer Camp Esperienziale",
        description: "Learning weeks in collina sui colli Vicentini con equitazione, hiking e team building. 100% in lingua inglese",
        price: "Da €550/sett.",
        duration: "Giugno-Settembre",
        features: ["Equitazione", "Team building", "Coach madrelingua", "Natura e sport"],
        purchaseUrl: "https://interlingua.it/summercamp/"
      },
      {
        title: "Corsi Online per Ragazzi",
        description: "Lezioni individuali o di gruppo in aula virtuale Zoom, o blended con piattaforma AI interattiva per i più grandi",
        price: "Da €35/mese",
        duration: "Rinnovabile",
        features: ["Piattaforma AI", "Docenti qualificati", "Orari flessibili", "Perfetto per i piccoli"],
        purchaseUrl: "https://interlingua.it/corsi-e-learning-online/#kids"
      },
      {
        title: "AI for Students",
        description: "Corso per ragazzi sull'uso consapevole dell'AI per studio e creatività. ChatGPT, Copilot e strumenti creativi",
        price: "€280",
        duration: "6 settimane",
        features: ["AI per lo studio", "Uso responsabile", "Progetti creativi", "Certificato"]
      },
      {
        title: "Vacanze Studio Estero",
        description: "Soggiorni linguistici in UK, Irlanda, USA, Canada con famiglie selezionate o college. Network internazionale di scuole qualificate",
        price: "Su richiesta",
        duration: "2-4 settimane",
        features: ["Network internazionale", "Consulenza personalizzata", "Famiglie selezionate", "Assistenza h24"]
      }
    ]
  },
  {
    id: "digital",
    title: "Competenze Digitali",
    subtitle: "SkillCraft Academy",
    description: "Corsi pratici su Office, Excel avanzato, AI e strumenti digitali per lavoro e studio.",
    icon: Laptop,
    color: "from-blue-500 to-blue-600",
    courses: [
      {
        title: "Office Senza Segreti",
        description: "Excel, Word, PowerPoint e Copilot. Impara a gestire dati, report e presentazioni professionali",
        price: "€340",
        duration: "8 settimane",
        features: ["Excel avanzato", "Copilot AI", "Esercitazioni pratiche", "Certificato"],
        purchaseUrl: "https://interlingua.it/prodotto/office-senza-segreti-excel-word-powerpoint-e-copilot/"
      },
      {
        title: "AI Senza Segreti",
        description: "Intelligenza Artificiale per lavoro e studio. ChatGPT, Copilot, strumenti creativi e produttività",
        price: "€340",
        duration: "8 settimane",
        features: ["Strumenti AI pratici", "Prompt engineering", "Automazione", "Casi d'uso reali"]
      },
      {
        title: "Digital Skills Bootcamp",
        description: "Percorso intensivo su competenze digitali essenziali per il mondo del lavoro moderno",
        price: "€450",
        duration: "6 settimane",
        features: ["Cloud & collaboration", "Data analysis", "Digital marketing basics", "Project work"]
      }
    ]
  },
  {
    id: "growth",
    title: "Crescita Personale",
    subtitle: "SkillCraft Development",
    description: "Soft skills, comunicazione efficace, leadership e benessere personale per la tua crescita.",
    icon: Sparkles,
    color: "from-violet-500 to-violet-600",
    courses: [
      {
        title: "Comunicazione Efficace",
        description: "Public speaking, ascolto attivo, comunicazione assertiva e gestione dei conflitti",
        price: "€380",
        duration: "8 settimane",
        features: ["Esercizi pratici", "Video feedback", "Role playing", "Coaching individuale"]
      },
      {
        title: "Time Management",
        description: "Tecniche di gestione del tempo, priorità, focus e produttività personale",
        price: "€280",
        duration: "4 settimane",
        features: ["Metodo GTD", "Strumenti digitali", "Abitudini efficaci", "Follow-up mensile"]
      },
      {
        title: "Mindfulness & Wellbeing",
        description: "Gestione dello stress, equilibrio vita-lavoro, mindfulness applicata alla quotidianità",
        price: "€320",
        duration: "6 settimane",
        features: ["Pratiche guidate", "App dedicate", "Gruppo supporto", "Materiali audio"]
      }
    ]
  }
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              Torna alla Home
            </Button>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex">
            <GraduationCap className="w-4 h-4 mr-2" />
            Oltre 20 Corsi Disponibili
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Catalogo Completo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            I Nostri{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Corsi
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lingue straniere, competenze digitali, AI e crescita personale. 
            Scegli il percorso più adatto a te tra le nostre 7 aree formative.
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
            >
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <div className="absolute inset-0">
                  <img 
                    src={categoryImages[category.id]} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
                </div>
                <div className="relative p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
                      <p className="text-muted-foreground">{category.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">
                    {category.description}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 max-w-3xl hidden">
                {category.description}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course, courseIndex) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: courseIndex * 0.05 }}
                  >
                    <Card className="h-full hover-elevate overflow-hidden flex flex-col" data-testid={`card-course-${category.id}-${courseIndex}`}>
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={courseImages[course.title] || categoryImages[category.id]} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <Badge className={`bg-gradient-to-r ${category.color} text-white border-0`}>
                            {course.price}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pt-4">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
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
            </motion.section>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Non sai quale corso scegliere?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Prenota una consulenza gratuita con i nostri esperti. Ti aiuteremo a trovare 
              il percorso formativo più adatto ai tuoi obiettivi.
            </p>
            <Link href="/#contact">
              <Button size="lg" data-testid="button-contact-cta">
                Richiedi Consulenza Gratuita
              </Button>
            </Link>
          </Card>
        </motion.section>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>SkillCraft-Interlingua - Dal 1993 Leader nella Formazione</p>
          <p className="text-sm mt-2">Vicenza | Thiene | Online</p>
        </div>
      </footer>
    </div>
  );
}
