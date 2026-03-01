import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { 
  ArrowLeft, 
  Globe,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Monitor, 
  Mountain,
  MapPin,
  Clock,
  Euro,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Users,
  Award,
  BookOpen,
  ExternalLink,
  ShoppingCart,
  Target,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import cartaCulturaLogo from "@assets/carte-cultura-1200x675_1772388120185.avif";
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

const categoryIcons: Record<string, typeof Globe> = {
  lingue: Globe,
  "competenze-trasversali": MessageSquare,
  management: ClipboardList,
  business: BarChart3,
  digitale: Monitor,
  "formazione-esperienziale": Mountain,
};

interface CourseData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: string;
  duration: string;
  features: string[];
  category: string;
  categoryTitle: string;
  categoryColor: string;
  includes: string[];
  requirements: string[];
  targetAudience: string;
  methodology: string;
  purchaseUrl?: string;
}

const allCourses: CourseData[] = [
  {
    id: "lingue-straniere",
    title: "Lingue Straniere",
    description: "Inglese, francese, tedesco, spagnolo, russo. Corsi di gruppo e individuali per comunicazione fluida internazionale.",
    longDescription: "I nostri corsi di lingua straniera offrono un'esperienza formativa completa con docenti madrelingua qualificati. Disponibili in formato di gruppo o individuale, coprono inglese, francese, tedesco, spagnolo e russo. Con metodologia comunicativa e accesso alla piattaforma e-learning 24/7, imparerai in modo naturale ed efficace.",
    price: "Da €340",
    duration: "12 settimane",
    features: ["Docente madrelingua", "Livelli QCER", "Certificato finale", "Carta Cultura"],
    category: "lingue",
    categoryTitle: "Lingue e Interculturalità",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["12 lezioni in presenza da 90 minuti", "Accesso piattaforma e-learning 24/7", "Materiale didattico digitale", "Test di livello iniziale", "Certificato di frequenza", "Community online di studenti"],
    requirements: ["Nessun requisito particolare", "Test di livello per inserimento corretto"],
    targetAudience: "Adulti e giovani adulti che desiderano imparare o migliorare una lingua straniera in un ambiente stimolante e interattivo.",
    methodology: "Metodologia C.L.I.L. con approccio comunicativo e task-based learning.",
    purchaseUrl: "https://interlingua.it/prodotto/collettivi-intensivi-presenza/"
  },
  {
    id: "comunicazione-interculturale-e-cross-culturale",
    title: "Comunicazione Interculturale e Cross-culturale",
    description: "Apertura e competenze globali per lavorare in contesti internazionali.",
    longDescription: "Questo corso sviluppa le competenze necessarie per comunicare efficacemente in contesti multiculturali. Attraverso casi studio reali, role playing e analisi culturale, acquisirai strumenti pratici per lavorare con colleghi, clienti e partner internazionali.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Competenze globali", "Casi studio reali", "Role playing", "Certificato"],
    category: "lingue",
    categoryTitle: "Lingue e Interculturalità",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Analisi delle differenze culturali", "Casi studio internazionali", "Simulazioni e role playing", "Strategie di comunicazione cross-culturale", "Materiali di approfondimento", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti che lavorano o intendono lavorare in contesti internazionali e multiculturali.",
    methodology: "Approccio esperienziale con casi studio reali e simulazioni interculturali."
  },
  {
    id: "language-coaching",
    title: "Language Coaching",
    description: "Percorsi personalizzati con coach qualificati per obiettivi specifici.",
    longDescription: "Il Language Coaching offre un percorso completamente su misura con coach madrelingua qualificati. Ideale per chi ha obiettivi specifici come preparazione a colloqui, presentazioni internazionali, trasferimenti all'estero o avanzamento di carriera.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["100% personalizzato", "Coach qualificati", "Obiettivi specifici", "Flessibilità totale"],
    category: "lingue",
    categoryTitle: "Lingue e Interculturalità",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Sessioni one-to-one con coach madrelingua", "Piano formativo personalizzato", "Materiale su misura", "Flessibilità totale su orari e contenuti", "Report periodici sui progressi", "Supporto tra le sessioni"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti con obiettivi linguistici specifici e necessità di massima personalizzazione.",
    methodology: "Coaching linguistico personalizzato basato sugli obiettivi individuali."
  },
  {
    id: "learning-week-weekend-tematici",
    title: "Learning Week & Weekend Tematici",
    description: "Esperienze immersive e pratiche per apprendere in modo intensivo.",
    longDescription: "Le Learning Week e i Weekend Tematici offrono esperienze formative immersive e intensive. Dedicati a temi specifici come business english, conversazione avanzata o preparazione esami, permettono di fare progressi significativi in poco tempo con docenti madrelingua.",
    price: "Da €750",
    duration: "5-7 giorni",
    features: ["Full immersion", "Docenti madrelingua", "Approccio esperienziale", "Certificato QCER"],
    category: "lingue",
    categoryTitle: "Lingue e Interculturalità",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Programma intensivo full day", "Docenti madrelingua specializzati", "Materiale didattico completo", "Attività esperienziali", "Certificato di avanzamento QCER", "Convenzioni alloggio"],
    requirements: ["Livello minimo A2", "Test di livello prima dell'iscrizione"],
    targetAudience: "Chi desidera fare un salto di qualità linguistico in tempi rapidi.",
    methodology: "Full immersion con approccio esperienziale e task-based learning."
  },
  {
    id: "comunicazione",
    title: "Comunicazione",
    description: "Chiarezza, impatto, ascolto, empatia per migliorare le relazioni professionali.",
    longDescription: "Il corso di Comunicazione sviluppa le competenze fondamentali per comunicare con chiarezza e impatto: public speaking, ascolto attivo, comunicazione assertiva, gestione dei conflitti e feedback costruttivo. Attraverso esercizi pratici e role playing, acquisirai strumenti immediatamente applicabili.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Public speaking", "Ascolto attivo", "Comunicazione assertiva", "Role playing"],
    category: "competenze-trasversali",
    categoryTitle: "Competenze Trasversali",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Sessioni formative teorico-pratiche", "Esercitazioni e role playing", "Feedback personalizzato", "Strumenti operativi", "Materiali di approfondimento", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti, manager e chiunque voglia migliorare le proprie capacità comunicative.",
    methodology: "Apprendimento esperienziale con pratica intensiva e feedback personalizzato."
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Soluzioni rapide ed efficaci per affrontare sfide quotidiane e professionali.",
    longDescription: "Il corso di Problem Solving insegna metodologie strutturate per analizzare problemi complessi e trovare soluzioni efficaci. Pensiero analitico, decision making, creatività applicata e strumenti operativi per affrontare le sfide quotidiane e professionali.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Pensiero analitico", "Decision making", "Casi pratici", "Strumenti operativi"],
    category: "competenze-trasversali",
    categoryTitle: "Competenze Trasversali",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Metodologie di analisi strutturata", "Tecniche di decision making", "Casi pratici reali", "Strumenti operativi", "Materiali e template", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti e manager che devono affrontare decisioni complesse e risolvere problemi in modo strutturato.",
    methodology: "Problem-based learning con casi reali e strumenti operativi."
  },
  {
    id: "creativit-innovazione",
    title: "Creatività & Innovazione",
    description: "Pensiero laterale e tecniche creative per generare idee innovative.",
    longDescription: "Il corso di Creatività & Innovazione sviluppa il pensiero laterale e insegna tecniche creative strutturate per generare idee innovative. Design thinking, brainstorming avanzato, prototipazione rapida e metodologie per trasformare le idee in soluzioni concrete.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Design thinking", "Brainstorming avanzato", "Pensiero laterale", "Prototipazione"],
    category: "competenze-trasversali",
    categoryTitle: "Competenze Trasversali",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Tecniche di pensiero laterale", "Workshop di design thinking", "Brainstorming strutturato", "Prototipazione rapida", "Materiali creativi", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti, team leader e chiunque voglia sviluppare la capacità di innovare.",
    methodology: "Design thinking con workshop pratici e prototipazione."
  },
  {
    id: "leadership-teamwork",
    title: "Leadership & Teamwork",
    description: "Relazioni, motivazione e collaborazione per guidare e lavorare in team.",
    longDescription: "Il corso di Leadership & Teamwork sviluppa le competenze per guidare team e lavorare efficacemente in gruppo. Motivazione, delega, gestione dei conflitti, comunicazione di team e strumenti per costruire gruppi ad alte prestazioni.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Team building", "Motivazione", "Delega efficace", "Gestione conflitti"],
    category: "competenze-trasversali",
    categoryTitle: "Competenze Trasversali",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Modelli di leadership", "Tecniche di team building", "Gestione della delega", "Risoluzione conflitti", "Assessment di stile", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Manager, team leader e professionisti che guidano o partecipano a team di lavoro.",
    methodology: "Apprendimento esperienziale con attività di team building e coaching."
  },
  {
    id: "project-management",
    title: "Project Management",
    description: "Obiettivi, team e processi per gestire progetti di successo.",
    longDescription: "Il corso di Project Management fornisce le competenze per pianificare, eseguire e controllare progetti di qualsiasi dimensione. Metodologie standard, gestione risorse, pianificazione temporale, risk management e strumenti per portare i progetti al successo.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Metodologie standard", "Gestione risorse", "Pianificazione", "Risk management"],
    category: "management",
    categoryTitle: "Management & Organizzazione",
    categoryColor: "from-indigo-500 to-indigo-600",
    includes: ["Fondamenti di project management", "Strumenti di pianificazione", "Gestione del rischio", "Monitoraggio e controllo", "Template operativi", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Project manager, team leader e professionisti che gestiscono progetti.",
    methodology: "Formazione pratica con simulazioni di progetto e strumenti operativi."
  },
  {
    id: "metodologie-agile-scrum",
    title: "Metodologie Agile & Scrum",
    description: "Approcci flessibili e iterativi per lo sviluppo e la gestione dei progetti.",
    longDescription: "Il corso sulle Metodologie Agile & Scrum insegna approcci flessibili e iterativi per gestire progetti in contesti dinamici. Scrum framework, sprint planning, daily standup, retrospettive e strumenti per implementare l'agilità organizzativa.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Scrum framework", "Sprint planning", "Retrospettive", "Certificazione"],
    category: "management",
    categoryTitle: "Management & Organizzazione",
    categoryColor: "from-indigo-500 to-indigo-600",
    includes: ["Framework Scrum completo", "Ruoli e cerimonie", "Sprint planning e review", "Retrospettive efficaci", "Strumenti digitali Agile", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Manager, team leader e professionisti che vogliono adottare metodologie agili.",
    methodology: "Learning by doing con simulazioni di sprint e retrospettive reali."
  },
  {
    id: "lean-office-operations",
    title: "Lean Office & Operations",
    description: "Efficienza e processi snelli per ottimizzare il lavoro quotidiano.",
    longDescription: "Il corso Lean Office & Operations insegna a ottimizzare i processi lavorativi eliminando sprechi e inefficienze. Principi lean applicati all'ufficio, metodologia 5S, kaizen, value stream mapping e strumenti per migliorare la produttività.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Eliminazione sprechi", "Kaizen", "Value stream", "5S"],
    category: "management",
    categoryTitle: "Management & Organizzazione",
    categoryColor: "from-indigo-500 to-indigo-600",
    includes: ["Principi Lean applicati", "Value stream mapping", "Metodologia 5S", "Kaizen e miglioramento continuo", "Template operativi", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Manager, responsabili di processo e professionisti che vogliono ottimizzare il lavoro quotidiano.",
    methodology: "Workshop pratico con analisi dei processi reali e implementazione immediata."
  },
  {
    id: "gestione-risorse-umane",
    title: "Gestione Risorse Umane",
    description: "Selezione, sviluppo e motivazione del personale.",
    longDescription: "Il corso di Gestione Risorse Umane copre tutti gli aspetti della gestione del personale: selezione, onboarding, sviluppo dei talenti, performance review, employer branding e strategie di retention per costruire team motivati e performanti.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Selezione personale", "Sviluppo talenti", "Performance review", "Employer branding"],
    category: "management",
    categoryTitle: "Management & Organizzazione",
    categoryColor: "from-indigo-500 to-indigo-600",
    includes: ["Processi di selezione efficaci", "Onboarding strutturato", "Sviluppo e formazione talenti", "Sistemi di valutazione", "Strategie di employer branding", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "HR manager, imprenditori e responsabili di team che gestiscono personale.",
    methodology: "Formazione pratica con casi studio e strumenti HR operativi."
  },
  {
    id: "sales-marketing",
    title: "Sales & Marketing",
    description: "Strategie commerciali efficaci per aumentare vendite e presenza sul mercato.",
    longDescription: "Il corso Sales & Marketing fornisce strumenti e strategie per aumentare le vendite e rafforzare la presenza sul mercato. Tecniche di vendita, negoziazione, gestione clienti, CRM e analisi di mercato per risultati commerciali concreti.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Tecniche di vendita", "Negoziazione", "CRM", "Analisi mercato"],
    category: "business",
    categoryTitle: "Business & Strategia",
    categoryColor: "from-orange-500 to-orange-600",
    includes: ["Tecniche di vendita avanzate", "Negoziazione efficace", "Gestione CRM", "Analisi e segmentazione mercato", "Piano commerciale", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Commerciali, imprenditori e professionisti che vogliono migliorare le performance di vendita.",
    methodology: "Formazione pratica con simulazioni di vendita e analisi di casi reali."
  },
  {
    id: "pianificazione-controllo",
    title: "Pianificazione & Controllo",
    description: "Obiettivi, performance e risultati concreti per guidare il business.",
    longDescription: "Il corso Pianificazione & Controllo insegna a definire obiettivi chiari, monitorare le performance e raggiungere risultati concreti. Budget, KPI, reporting, analisi delle performance e strumenti per guidare il business con dati e metodo.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Budget", "KPI", "Reporting", "Analisi performance"],
    category: "business",
    categoryTitle: "Business & Strategia",
    categoryColor: "from-orange-500 to-orange-600",
    includes: ["Definizione obiettivi e KPI", "Costruzione budget", "Sistemi di reporting", "Analisi scostamenti", "Dashboard di controllo", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Imprenditori, manager e responsabili che necessitano di strumenti di pianificazione e controllo.",
    methodology: "Workshop pratico con costruzione di strumenti di controllo personalizzati."
  },
  {
    id: "digital-skills",
    title: "Digital Skills",
    description: "Alfabetizzazione e strumenti digitali avanzati per il lavoro moderno.",
    longDescription: "Il corso Digital Skills insegna a padroneggiare gli strumenti digitali essenziali per il lavoro moderno. Excel avanzato per gestire dati e creare report, strumenti cloud per la collaborazione, e Copilot AI per velocizzare il lavoro quotidiano.",
    price: "€340",
    duration: "8 settimane",
    features: ["Excel avanzato", "Cloud tools", "Copilot AI", "Certificato"],
    category: "digitale",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["8 lezioni pratiche in presenza", "Esercitazioni su casi reali", "Focus su Excel avanzato", "Introduzione a Copilot AI", "Materiali e template", "Certificato di competenza"],
    requirements: ["Conoscenza base del PC", "Accesso a Microsoft Office"],
    targetAudience: "Professionisti, studenti e chiunque voglia migliorare le proprie competenze digitali.",
    methodology: "Apprendimento pratico con esercitazioni su casi reali.",
    purchaseUrl: "https://interlingua.it/prodotto/office-senza-segreti-excel-word-powerpoint-e-copilot/"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Strategie online e contenuti per promuovere il business nel digitale.",
    longDescription: "Il corso di Digital Marketing insegna strategie e strumenti per promuovere efficacemente il business online. Social media marketing, content creation, SEO basics, analytics e advertising per costruire una presenza digitale efficace.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Social media", "Content marketing", "SEO basics", "Analytics"],
    category: "digitale",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["Strategie social media", "Creazione contenuti efficaci", "Fondamenti SEO", "Google Analytics", "Piano di digital marketing", "Certificato di partecipazione"],
    requirements: ["Conoscenza base del PC e di internet"],
    targetAudience: "Imprenditori, professionisti e chiunque voglia promuovere la propria attività online.",
    methodology: "Formazione pratica con creazione di campagne reali."
  },
  {
    id: "innovazione-digitale-ai",
    title: "Innovazione Digitale & AI",
    description: "Intelligenza artificiale, automazione e nuovi scenari per il futuro.",
    longDescription: "Il corso Innovazione Digitale & AI offre una panoramica pratica sull'intelligenza artificiale applicata al lavoro e alla vita quotidiana. ChatGPT, Copilot, strumenti di automazione, prompt engineering e casi d'uso reali per sfruttare al meglio le nuove tecnologie.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["ChatGPT & Copilot", "Prompt engineering", "Automazione", "Casi d'uso reali"],
    category: "digitale",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["Panoramica strumenti AI", "Tecniche di prompt engineering", "Automazione dei processi", "Casi d'uso per lavoro e studio", "Materiali e risorse", "Certificato di partecipazione"],
    requirements: ["Conoscenza base del PC", "Curiosità per le nuove tecnologie"],
    targetAudience: "Chiunque voglia comprendere e utilizzare l'AI in modo pratico e produttivo.",
    methodology: "Laboratorio pratico con esercitazioni su strumenti AI reali."
  },
  {
    id: "workshop-indoor-outdoor",
    title: "Workshop Indoor & Outdoor",
    description: "Attività esperienziali per sviluppare competenze attraverso la pratica diretta.",
    longDescription: "I Workshop Indoor & Outdoor offrono esperienze formative che combinano apprendimento e pratica diretta. Attività di team building, outdoor training sui colli Vicentini, laboratori creativi e sfide di gruppo per sviluppare competenze trasversali attraverso il fare.",
    price: "Da €385",
    duration: "1-3 giorni",
    features: ["Team building", "Outdoor training", "Colli Vicentini", "Facilitatori esperti"],
    category: "formazione-esperienziale",
    categoryTitle: "Formazione Esperienziale",
    categoryColor: "from-green-500 to-green-600",
    includes: ["Attività esperienziali strutturate", "Facilitatori esperti", "Materiali e attrezzature", "Debriefing e riflessione", "Piano di azione personale", "Certificato di partecipazione"],
    requirements: ["Nessun requisito particolare", "Abbigliamento comodo per attività outdoor"],
    targetAudience: "Team aziendali, gruppi e professionisti che cercano crescita attraverso l'esperienza diretta.",
    methodology: "Outdoor education e formazione esperienziale con facilitatori professionisti."
  },
  {
    id: "full-immersion-english",
    title: "Full Immersion English",
    description: "Learning week intensive per avanzare di un intero livello QCER in una settimana.",
    longDescription: "La Full Immersion English è un workshop superintensivo finalizzato all'avanzamento di un intero livello QCER in una sola settimana. Condotto da 4 formatori/coach madrelingua specializzati in linguaggio specialistico, grammatica, Soft Skills, Small Talk, Ear Training e Game-Based-Learning, presso la sede di Vicenza centro storico, patrimonio UNESCO.",
    price: "Da €750",
    duration: "5-7 giorni",
    features: ["4 coach madrelingua", "Vicenza centro", "Soft skills", "Certificato QCER"],
    category: "formazione-esperienziale",
    categoryTitle: "Formazione Esperienziale",
    categoryColor: "from-green-500 to-green-600",
    includes: ["Workshop superintensivo indoor", "4 formatori madrelingua specializzati", "Linguaggio specialistico customizzato", "Soft Skills e Small Talk", "Game-Based-Learning", "Certificato avanzamento QCER", "Convenzioni hotel/b&b Vicenza"],
    requirements: ["Livello minimo A2 di inglese", "Test di livello prima dell'iscrizione"],
    targetAudience: "Adulti e professionisti che vogliono avanzare rapidamente di livello linguistico.",
    methodology: "Approccio superintensivo con 4 coach specializzati e metodologie esperienziali indoor."
  },
  {
    id: "the-spirit-of-leadership",
    title: "The Spirit of Leadership",
    description: "Workshop esperienziale-sportivo con equitazione sui colli Vicentini. Leadership e team working in inglese.",
    longDescription: "The Spirit of Leadership è un workshop esperienziale outdoor presso un centro equestre immerso nei boschi dei colli Vicentini. Acquisirai fluency e confidence in lingua inglese insieme a competenze trasversali: Leadership, Change Management, Team Working, Problem Solving e Creativity attraverso attività con i cavalli, dalle basi dell'equitazione all'adventure trail nel bosco.",
    price: "Da €385",
    duration: "Weekend",
    features: ["Equitazione", "Team building", "100% in inglese", "Colli Vicentini"],
    category: "formazione-esperienziale",
    categoryTitle: "Formazione Esperienziale",
    categoryColor: "from-green-500 to-green-600",
    includes: ["Soggiorno centro equestre", "Attività con i cavalli", "Adventure trail nel bosco", "Workshop Leadership e Team Building", "Coach madrelingua", "Tutti i pasti", "Materiali e attrezzature"],
    requirements: ["Livello minimo A2 di inglese", "Nessuna esperienza equestre richiesta"],
    targetAudience: "Adulti e professionisti che cercano crescita personale e linguistica in un contesto naturale.",
    methodology: "Outdoor education con equitazione e metodologie esperienziali per lo sviluppo delle soft skills."
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

const categoryGradients: Record<string, string> = {
  lingue: "from-purple-600/90 via-purple-500/80 to-violet-500/70",
  "competenze-trasversali": "from-teal-600/90 via-teal-500/80 to-emerald-500/70",
  management: "from-indigo-600/90 via-indigo-500/80 to-blue-500/70",
  business: "from-orange-600/90 via-orange-500/80 to-amber-500/70",
  digitale: "from-blue-600/90 via-blue-500/80 to-cyan-500/70",
  "formazione-esperienziale": "from-green-600/90 via-green-500/80 to-emerald-500/70",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);
  
  const course = allCourses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Corso non trovato</h1>
          <p className="text-muted-foreground mb-6">Il corso che cerchi non esiste o è stato rimosso.</p>
          <Link href="/">
            <Button data-testid="button-back-courses">Torna alla Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[course.category] || BookOpen;
  const courseImage = categoryImages[course.category];
  const heroGradient = categoryGradients[course.category] || "from-primary/90 via-primary/80 to-primary/70";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-[999] bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-courses">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex">
            <CategoryIcon className="w-4 h-4 mr-2" />
            {course.categoryTitle}
          </Badge>
        </div>
      </header>

      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img 
          src={courseImage} 
          alt={course.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${heroGradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-6 right-6 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-12 left-12 w-24 h-24 md:w-36 md:h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Badge className={`bg-white/20 text-white border border-white/30 backdrop-blur-sm mb-4`}>
                <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                {course.categoryTitle}
              </Badge>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">{course.title}</h1>
            <p className="text-white/80 max-w-2xl text-base md:text-lg leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-5">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Award className="w-4 h-4" />
                <span>Certificato incluso</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Users className="w-4 h-4" />
                <span>Gruppo o individuale</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <motion.section
              custom={0}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Descrizione</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base">
                {course.longDescription}
              </p>
            </motion.section>

            <motion.section
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Cosa Include</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.includes.map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/50 dark:bg-muted/30"
                  >
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              custom={2}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Metodologia</h2>
              </div>
              <Card className="p-5">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {course.methodology}
                </p>
              </Card>
            </motion.section>

            <motion.section
              custom={3}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">A Chi è Rivolto</h2>
              </div>
              <Card className="p-5">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {course.targetAudience}
                </p>
              </Card>
            </motion.section>

            {course.requirements.length > 0 && (
              <motion.section
                custom={4}
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 dark:bg-primary/20">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Requisiti</h2>
                </div>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-muted/50 dark:bg-muted/30">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-24"
            >
              <Card className="overflow-visible">
                <div className={`p-6 bg-gradient-to-br ${heroGradient} rounded-t-md`}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1 tracking-tight">
                      {course.price}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 mb-4">
                    <img src={cartaCulturaLogo} alt="Carta della Cultura" className="h-6 w-auto" />
                    <span className="text-xs text-amber-800 dark:text-amber-200">Pagabile con Carta della Cultura Giovani e del Merito</span>
                  </div>

                  <div className="space-y-3">
                    {course.purchaseUrl && (
                      <a 
                        href={course.purchaseUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full bg-accent text-accent-foreground border-accent" size="lg" data-testid="button-purchase-course">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Acquista Online
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </a>
                    )}
                    <Link href="/#contact">
                      <Button className="w-full" variant={course.purchaseUrl ? "outline" : "default"} size="lg" data-testid="button-request-info">
                        <Mail className="w-4 h-4 mr-2" />
                        Richiedi Informazioni
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg" data-testid="button-call">
                      <Phone className="w-4 h-4 mr-2" />
                      Chiamaci
                    </Button>
                    <Link href="/test-di-livello">
                      <Button variant="outline" className="w-full border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950" size="lg" data-testid="button-placement-test">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Fai il Test di Livello
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Le nostre sedi
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Vicenza - Centro Storico</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Thiene</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Monitor className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Online via Zoom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
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
