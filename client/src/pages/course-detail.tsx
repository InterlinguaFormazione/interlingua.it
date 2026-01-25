import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { 
  ArrowLeft, 
  Monitor, 
  MessageCircle, 
  Mountain,
  Laptop,
  Sparkles,
  Baby,
  MapPin,
  Clock,
  Euro,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Users,
  Award,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const courseImages: Record<string, string> = {
  "corsi-di-lingua-di-gruppo": courseGroup,
  "corsi-individuali": courseIndividual,
  "preparazione-certificazioni": courseCertification,
  "english-debate-lab": courseConversation,
  "supporto-scolastico": courseTeens,
  "self-learning-piattaforma": courseElearning,
  "blended-individuale": courseIndividual,
  "blended-di-gruppo": courseGroup,
  "corso-in-mini-gruppi": courseGroup,
  "preparazione-certificazioni-online": courseCertification,
  "abbonamento-annuale": courseConversation,
  "prova-gratuita-1-mese": courseConversation,
  "conversazione-individuale": courseConversation,
  "full-immersion-workshop": courseAdventure,
  "spirit-of-leadership": courseAdventure,
  "kids-courses": courseChildren,
  "summer-city-camp": courseChildren,
  "summer-camp-esperienziale": courseAdventure,
  "corsi-online-per-ragazzi": courseElearning,
  "ai-for-students": courseAi,
  "vacanze-studio-estero": courseTeens,
  "office-senza-segreti": courseExcel,
  "ai-senza-segreti": courseAi,
  "digital-skills-bootcamp": courseExcel,
  "comunicazione-efficace": courseGroup,
  "time-management": courseExcel,
  "mindfulness-wellbeing": courseAdventure,
};

const categoryIcons: Record<string, typeof MapPin> = {
  presenza: MapPin,
  online: Monitor,
  speakers: MessageCircle,
  immersion: Mountain,
  kids: Baby,
  digital: Laptop,
  growth: Sparkles,
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
}

const allCourses: CourseData[] = [
  {
    id: "corsi-di-lingua-di-gruppo",
    title: "Corsi di Lingua di Gruppo",
    description: "Inglese, francese, tedesco, spagnolo, russo. 12 settimane, 1 lezione/settimana + piattaforma e-learning 24/7",
    longDescription: "I nostri corsi di lingua di gruppo sono progettati per offrire un'esperienza formativa completa e coinvolgente. Con docenti madrelingua qualificati e un approccio comunicativo, imparerai a parlare, scrivere e comprendere la lingua scelta in modo naturale e efficace. Ogni corso include accesso alla nostra piattaforma e-learning per esercitarti 24/7.",
    price: "€340",
    duration: "12 settimane",
    features: ["Docente madrelingua", "Livelli QCER", "Certificato finale", "Carta Cultura"],
    category: "presenza",
    categoryTitle: "Formazione in Presenza",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["12 lezioni in presenza da 90 minuti", "Accesso piattaforma e-learning 24/7", "Materiale didattico digitale", "Test di livello iniziale", "Certificato di frequenza", "Community online di studenti"],
    requirements: ["Nessun requisito particolare", "Test di livello per inserimento corretto"],
    targetAudience: "Adulti e giovani adulti che desiderano imparare o migliorare una lingua straniera in un ambiente stimolante e interattivo.",
    methodology: "Metodologia C.L.I.L. (Content and Language Integrated Learning) con approccio comunicativo e task-based learning."
  },
  {
    id: "corsi-individuali",
    title: "Corsi Individuali",
    description: "Percorso personalizzato one-to-one con massima flessibilità di orari e contenuti",
    longDescription: "I corsi individuali offrono la massima personalizzazione del percorso formativo. Il docente madrelingua si dedica esclusivamente a te, adattando contenuti, ritmo e metodologia alle tue esigenze specifiche. Ideale per chi ha obiettivi precisi o necessità di orari flessibili.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["100% personalizzato", "Orari flessibili", "Obiettivi specifici", "Preparazione esami"],
    category: "presenza",
    categoryTitle: "Formazione in Presenza",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Lezioni one-to-one con docente madrelingua", "Programma su misura", "Materiale didattico personalizzato", "Flessibilità totale sugli orari", "Report periodici sui progressi", "Possibilità di lezioni a domicilio/azienda"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti, studenti con esigenze specifiche, chi prepara esami o colloqui.",
    methodology: "Approccio completamente personalizzato basato sugli obiettivi e lo stile di apprendimento dello studente."
  },
  {
    id: "preparazione-certificazioni",
    title: "Preparazione Certificazioni",
    description: "Cambridge, IELTS, TOEFL, DELF, DELE, Goethe e altre certificazioni internazionali",
    longDescription: "Preparati al meglio per ottenere la tua certificazione linguistica internazionale. I nostri corsi specifici ti guideranno attraverso tutte le sezioni dell'esame con simulazioni, strategie e feedback dettagliati per massimizzare le tue possibilità di successo.",
    price: "€400",
    duration: "8-12 settimane",
    features: ["Simulazioni d'esame", "Materiale ufficiale", "Feedback dettagliato", "Alta % successo"],
    category: "presenza",
    categoryTitle: "Formazione in Presenza",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Lezioni mirate alla certificazione scelta", "Simulazioni d'esame complete", "Materiale preparatorio ufficiale", "Correzioni dettagliate", "Strategie per ogni sezione", "Supporto fino al giorno dell'esame"],
    requirements: ["Livello minimo richiesto in base alla certificazione"],
    targetAudience: "Studenti, professionisti e chiunque necessiti di una certificazione linguistica riconosciuta a livello internazionale.",
    methodology: "Focus sulle competenze richieste dall'esame con pratica intensiva e feedback costante."
  },
  {
    id: "english-debate-lab",
    title: "English Debate Lab",
    description: "Laboratorio di dibattito in inglese per sviluppare capacità argomentative e pensiero critico",
    longDescription: "L'English Debate Lab è un percorso innovativo che combina l'apprendimento della lingua inglese con lo sviluppo di competenze trasversali fondamentali: pensiero critico, argomentazione, public speaking e lavoro di squadra. Attraverso dibattiti strutturati su temi attuali, migliorerai la tua fluency e la capacità di esprimerti in modo convincente.",
    price: "€320",
    duration: "8 settimane",
    features: ["Public speaking", "Pensiero critico", "Argomentazione", "Docente madrelingua"],
    category: "presenza",
    categoryTitle: "Formazione in Presenza",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["8 sessioni di debate strutturato", "Coaching su public speaking", "Materiali su temi attuali", "Feedback personalizzato", "Video delle performance", "Certificato di partecipazione"],
    requirements: ["Livello minimo B1 di inglese"],
    targetAudience: "Studenti, professionisti e chiunque voglia migliorare le proprie capacità comunicative e argomentative in inglese.",
    methodology: "Debate format con coaching personalizzato e analisi delle performance."
  },
  {
    id: "supporto-scolastico",
    title: "Supporto Scolastico",
    description: "Ripetizioni e supporto personalizzato per studenti di scuole medie e superiori",
    longDescription: "Il nostro servizio di supporto scolastico offre ripetizioni personalizzate per studenti di scuole medie e superiori. Docenti qualificati aiutano gli studenti a colmare lacune, prepararsi per verifiche ed esami, e sviluppare un metodo di studio efficace.",
    price: "Su richiesta",
    duration: "Personalizzata",
    features: ["Tutte le materie", "Preparazione verifiche", "Metodo di studio", "Docenti qualificati"],
    category: "presenza",
    categoryTitle: "Formazione in Presenza",
    categoryColor: "from-purple-500 to-purple-600",
    includes: ["Lezioni individuali o piccoli gruppi", "Supporto per tutte le materie linguistiche", "Preparazione verifiche e interrogazioni", "Sviluppo metodo di studio", "Comunicazione con famiglie", "Flessibilità oraria"],
    requirements: ["Studenti scuole medie o superiori"],
    targetAudience: "Studenti che necessitano di supporto per le lingue straniere o per sviluppare un metodo di studio efficace.",
    methodology: "Approccio personalizzato basato sulle esigenze specifiche dello studente."
  },
  {
    id: "self-learning-piattaforma",
    title: "Self-Learning + Piattaforma",
    description: "Accesso 24/7 alla piattaforma con AI, riconoscimento vocale e contenuti interattivi",
    longDescription: "La nostra piattaforma di e-learning all'avanguardia ti permette di imparare una lingua in modo autonomo, quando e dove vuoi. Con tecnologie AI, riconoscimento vocale e una community di oltre 4 milioni di studenti, avrai tutti gli strumenti per progredire rapidamente.",
    price: "Da €25/mese",
    duration: "Rinnovabile",
    features: ["Accesso 24/7", "Community 4M studenti", "AI integrata", "7 lingue disponibili"],
    category: "online",
    categoryTitle: "E-Learning Online",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Accesso illimitato alla piattaforma", "Corsi per 7 lingue diverse", "Riconoscimento vocale AI", "Esercizi interattivi", "Tracking dei progressi", "Community internazionale"],
    requirements: ["Connessione internet", "Dispositivo (PC, tablet o smartphone)"],
    targetAudience: "Chiunque voglia imparare una lingua in modo flessibile e autonomo.",
    methodology: "Apprendimento adattivo con AI e contenuti multimediali interattivi."
  },
  {
    id: "blended-individuale",
    title: "Blended Individuale",
    description: "Piattaforma e-learning + 2-4 lezioni individuali al mese con tutor madrelingua via Zoom",
    longDescription: "Il formato blended combina il meglio dell'apprendimento autonomo sulla piattaforma con il supporto di un tutor madrelingua in lezioni live. Avrai la flessibilità dello studio online e l'interazione personale con un docente dedicato.",
    price: "Da €65/mese",
    duration: "Rinnovabile",
    features: ["Lezioni live Zoom", "Tutor dedicato", "Flessibilità totale", "Carta Cultura"],
    category: "online",
    categoryTitle: "E-Learning Online",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Accesso piattaforma 24/7", "2-4 lezioni individuali/mese via Zoom", "Tutor madrelingua dedicato", "Prenotazione flessibile via app", "Feedback personalizzato", "Materiali extra"],
    requirements: ["Connessione internet stabile", "Webcam e microfono"],
    targetAudience: "Chi desidera flessibilità ma anche interazione diretta con un docente.",
    methodology: "Combinazione di studio autonomo e coaching personalizzato."
  },
  {
    id: "blended-di-gruppo",
    title: "Blended di Gruppo",
    description: "Piattaforma e-learning + 1 lezione di gruppo a settimana in aula virtuale",
    longDescription: "Il corso blended di gruppo offre l'accesso alla piattaforma e-learning combinato con una lezione settimanale in aula virtuale. Imparerai insieme ad altri studenti del tuo livello, beneficiando dell'interazione sociale e del costo contenuto.",
    price: "€45/mese",
    duration: "Rinnovabile",
    features: ["Lezioni serali", "Piccoli gruppi", "Interazione sociale", "Costo contenuto"],
    category: "online",
    categoryTitle: "E-Learning Online",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Accesso piattaforma 24/7", "1 lezione di gruppo settimanale", "Docente madrelingua", "Piccoli gruppi omogenei", "Materiali condivisi", "Registrazioni lezioni"],
    requirements: ["Connessione internet", "Webcam e microfono consigliati"],
    targetAudience: "Chi preferisce imparare in gruppo con un budget contenuto.",
    methodology: "Apprendimento collaborativo in aula virtuale con supporto piattaforma."
  },
  {
    id: "corso-in-mini-gruppi",
    title: "Corso in Mini-Gruppi",
    description: "Lezioni online in piccoli gruppi con docente madrelingua. Massima interazione garantita",
    longDescription: "I corsi in mini-gruppi online offrono il perfetto equilibrio tra attenzione personalizzata e dinamiche di gruppo. Con massimo 6 studenti per classe, avrai molte opportunità di parlare e interagire.",
    price: "€55/mese",
    duration: "Rinnovabile",
    features: ["Max 6 studenti", "Docente madrelingua", "Orari serali", "Zoom live"],
    category: "online",
    categoryTitle: "E-Learning Online",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Lezioni settimanali in mini-gruppo", "Massimo 6 partecipanti", "Docente madrelingua", "Orari serali flessibili", "Materiale didattico incluso", "Certificato di frequenza"],
    requirements: ["Connessione internet stabile", "Webcam e microfono"],
    targetAudience: "Chi cerca interazione di gruppo con attenzione quasi individuale.",
    methodology: "Lezioni interattive in piccoli gruppi con focus sulla conversazione."
  },
  {
    id: "preparazione-certificazioni-online",
    title: "Preparazione Certificazioni Online",
    description: "Preparazione a distanza per Cambridge, IELTS, DELF, DELE con simulazioni e feedback",
    longDescription: "Preparati alla tua certificazione linguistica comodamente da casa. Il corso online include tutte le risorse necessarie: simulazioni d'esame, materiali ufficiali, lezioni con tutor e feedback dettagliati.",
    price: "€380",
    duration: "8-12 settimane",
    features: ["Simulazioni online", "Materiale digitale", "Tutor dedicato", "Esami mock"],
    category: "online",
    categoryTitle: "E-Learning Online",
    categoryColor: "from-teal-500 to-teal-600",
    includes: ["Lezioni individuali via Zoom", "Simulazioni complete online", "Materiali preparatori digitali", "Correzioni dettagliate", "Strategie d'esame", "Supporto continuo"],
    requirements: ["Livello minimo richiesto in base alla certificazione", "Connessione internet stabile"],
    targetAudience: "Chi vuole prepararsi per una certificazione linguistica da remoto.",
    methodology: "Preparazione intensiva online con simulazioni e feedback personalizzato."
  },
  {
    id: "abbonamento-annuale",
    title: "Abbonamento Annuale Speakers' Corner",
    description: "Accesso illimitato agli incontri settimanali di conversazione. Ogni venerdì alle 18:30 su Zoom",
    longDescription: "Lo Speakers' Corner è il nostro format unico per praticare la conversazione in inglese. Ogni venerdì alle 18:30, un docente madrelingua conduce una sessione su un tema diverso. Frequenza libera, nessun impegno fisso, massima flessibilità.",
    price: "€200/anno",
    duration: "12 mesi",
    features: ["Frequenza libera", "Temi settimanali", "Livello B1+", "Metodologia CLIL"],
    category: "speakers",
    categoryTitle: "Speakers' Corner",
    categoryColor: "from-orange-500 to-orange-600",
    includes: ["Accesso illimitato per 12 mesi", "Incontri ogni venerdì alle 18:30", "Temi sempre nuovi", "Docenti madrelingua diversi", "Materiali di supporto", "Community attiva"],
    requirements: ["Livello minimo B1 di inglese"],
    targetAudience: "Chi vuole mantenere attivo il proprio inglese con pratica regolare.",
    methodology: "Conversazione libera guidata con metodologia CLIL su temi attuali."
  },
  {
    id: "prova-gratuita-1-mese",
    title: "Prova Gratuita 1 Mese",
    description: "Prova lo Speakers' Corner gratuitamente per un mese. Nessun impegno, cancella quando vuoi",
    longDescription: "Vuoi provare lo Speakers' Corner prima di abbonarti? Ti offriamo un mese di prova completamente gratuito. Partecipa agli incontri del venerdì, conosci i nostri docenti e la community, senza alcun impegno.",
    price: "Gratis",
    duration: "1 mese",
    features: ["Senza impegno", "Accesso completo", "Prenota online", "Cancellazione libera"],
    category: "speakers",
    categoryTitle: "Speakers' Corner",
    categoryColor: "from-orange-500 to-orange-600",
    includes: ["4 incontri gratuiti", "Accesso completo alla community", "Nessun vincolo", "Cancellazione automatica", "Possibilità di upgrade"],
    requirements: ["Livello minimo B1 di inglese", "Registrazione online"],
    targetAudience: "Chi vuole provare lo Speakers' Corner senza impegno.",
    methodology: "Stessa metodologia dell'abbonamento annuale."
  },
  {
    id: "conversazione-individuale",
    title: "Conversazione Individuale",
    description: "Carnet di 5 lezioni individuali con il docente che preferisci. Prenotazione via app",
    longDescription: "Il carnet di conversazione individuale ti offre 5 lezioni one-to-one con il docente madrelingua che preferisci. Prenota quando vuoi tramite la nostra app e pratica la conversazione su argomenti di tuo interesse.",
    price: "€95",
    duration: "5 lezioni",
    features: ["Orario flessibile", "Scelta docente", "Zoom live", "Prenotazione app"],
    category: "speakers",
    categoryTitle: "Speakers' Corner",
    categoryColor: "from-orange-500 to-orange-600",
    includes: ["5 lezioni individuali da 30 minuti", "Scelta del docente preferito", "Prenotazione flessibile via app", "Lezioni via Zoom", "Argomenti a scelta", "Validità 6 mesi"],
    requirements: ["Download app per prenotazione"],
    targetAudience: "Chi vuole praticare la conversazione con massima flessibilità.",
    methodology: "Conversazione libera guidata su temi scelti dallo studente."
  },
  {
    id: "full-immersion-workshop",
    title: "Full Immersion Workshop",
    description: "Workshop indoor superintensivo a Vicenza centro. 4 formatori madrelingua specializzati. Avanza un intero livello QCER in una settimana",
    longDescription: "Il Full Immersion Workshop è una soluzione ibrida linguistico-esperienziale superintensiva finalizzata all'avanzamento di un intero livello QCER in una sola settimana. Condotto da 4 formatori/coach madrelingua, ciascuno specializzato nel proprio ambito: linguaggio specialistico customizzato, grammatica, Soft Skills, Small Talk, Ear Training e Game-Based-Learning. Il corso si tiene presso la sede Interlingua di Vicenza, nel centro storico della città del Palladio, patrimonio UNESCO.",
    price: "Da €750",
    duration: "5-7 giorni",
    features: ["4 coach madrelingua", "Vicenza UNESCO", "Soft Skills", "Certificato QCER"],
    category: "immersion",
    categoryTitle: "Full Immersion",
    categoryColor: "from-green-500 to-green-600",
    includes: ["Workshop superintensivo indoor", "4 formatori madrelingua specializzati", "Linguaggio specialistico customizzato", "Soft Skills e Small Talk", "Game-Based-Learning", "Certificato avanzamento QCER", "Convenzioni hotel/b&b Vicenza"],
    requirements: ["Livello minimo A2 di inglese", "Test di livello prima dell'iscrizione"],
    targetAudience: "Adulti e professionisti che vogliono avanzare rapidamente di livello linguistico.",
    methodology: "Approccio superintensivo con 4 coach specializzati e metodologie esperienziali indoor."
  },
  {
    id: "spirit-of-leadership",
    title: "Spirit of Leadership",
    description: "Workshop esperienziale outdoor sui colli Vicentini con equitazione. Leadership, Team Working, Problem Solving in inglese",
    longDescription: "Spirit of Leadership è un workshop esperienziale outdoor presso un centro equestre immerso nei boschi dei colli Vicentini. Acquisirai fluency e confidence in lingua inglese insieme a competenze trasversali fondamentali: Leadership, Change Management, Team Working, Problem Solving e Creativity attraverso un percorso esperienziale completamente in inglese, con attività con i cavalli dalle basi dell'equitazione fino all'adventure trail nel bosco.",
    price: "Da €385",
    duration: "Weekend o settimana",
    features: ["Equitazione", "Team building", "Colli Vicentini", "100% in inglese"],
    category: "immersion",
    categoryTitle: "Full Immersion",
    categoryColor: "from-green-500 to-green-600",
    includes: ["Soggiorno centro equestre", "Attività con i cavalli", "Adventure trail nel bosco", "Workshop Leadership e Team Building", "Coach madrelingua", "Tutti i pasti", "Materiali e attrezzature"],
    requirements: ["Livello minimo A2 di inglese", "Nessuna esperienza equestre richiesta"],
    targetAudience: "Adulti e professionisti che cercano crescita personale e linguistica in un contesto naturale.",
    methodology: "Outdoor education con equitazione e metodologie esperienziali per lo sviluppo delle soft skills."
  },
  {
    id: "kids-courses",
    title: "Kids' Courses",
    description: "Corsi di gruppo per bambini e ragazzi 5-16 anni a Vicenza e Thiene. 1 incontro/settimana di 1h15min con docente madrelingua",
    longDescription: "I Kids' Courses prevedono lezioni di un'ora e un quarto in orario pomeridiano con docenti madrelingua che interagiscono con gli alunni solo in lingua straniera. Le attività si alternano secondo un preciso programma: Grammar Games, The Sound of English, English Theatre, English Press, Team Building, English Clips, English4LifeSkills ed Exam Lab. Ogni classe è divisa per fascia d'età per creare gruppi omogenei.",
    price: "€370/quadrimestre",
    duration: "20 ore (1 quadrimestre)",
    features: ["Max 5 partecipanti", "Grammar Games, English Theatre", "Divisi per fascia d'età", "Materiale incluso"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["20 ore di lezione (1 quadrimestre)", "1 incontro/settimana di 1h15min", "Massimo 3-5 partecipanti", "Docente madrelingua qualificato", "Materiale didattico incluso", "Sedi Vicenza o Thiene", "Attestato finale"],
    requirements: ["Età 5-16 anni", "Divisi per fascia d'età e livello"],
    targetAudience: "Bambini e ragazzi dai 5 ai 16 anni.",
    methodology: "Approccio ludico con Grammar Games, English Theatre, Team Building e preparazione certificazioni."
  },
  {
    id: "summer-city-camp",
    title: "Summer City Camp",
    description: "Settimane estive in inglese presso la sede di Vicenza. Lun-Ven 8:30-12:30 con 2 docenti madrelingua. 3 materie a scelta",
    longDescription: "Il Summer City Camp è l'alternativa conveniente ed efficace ai soggiorni studio all'estero. Permanenza presso la sede di Vicenza dalle 8:30 alle 12:30 dal lunedì al venerdì, per 1 o 2 settimane. I workshop sono condotti da 2 docenti madrelingua che interagiscono solo in inglese con attività altamente comunicative, didattiche e ludiche: Grammar Games, The Sound of English, English Theatre, English Press, Team Building, English Clips.",
    price: "€335/settimana",
    duration: "Giugno-Settembre",
    features: ["Full immersion", "2 docenti madrelingua", "Centro Vicenza", "Attestato finale"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["20 ore/settimana (Lun-Ven 8:30-12:30)", "2 docenti madrelingua qualificati", "3 materie a scelta", "Materiale didattico incluso", "Sede Vicenza centro storico", "Gruppi divisi per età", "Attestato finale"],
    requirements: ["Età 5-16 anni"],
    targetAudience: "Bambini e ragazzi che vogliono passare un'estate divertente imparando l'inglese.",
    methodology: "Immersione ludica con Grammar Games, English Theatre, Team Building e docenti madrelingua."
  },
  {
    id: "summer-camp-esperienziale",
    title: "Summer Camp Esperienziale",
    description: "Learning weeks in collina sui colli Vicentini con equitazione, hiking e team building. 100% in lingua inglese",
    longDescription: "Il Summer Camp Esperienziale porta i ragazzi sui colli Vicentini per settimane indimenticabili presso un centro equestre immerso nei boschi. Sport all'aria aperta, equitazione, team building e full immersion in inglese con coach madrelingua per un'esperienza che unisce avventura e apprendimento.",
    price: "Da €550/sett.",
    duration: "Giugno-Settembre",
    features: ["Equitazione", "Team building", "Coach madrelingua", "Natura e sport"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["Soggiorno centro equestre colli Vicentini", "Tutti i pasti", "Equitazione e hiking", "Team building", "Coach madrelingua", "100% in inglese", "Assicurazione inclusa"],
    requirements: ["Età 10-17 anni", "Nessuna esperienza equestre richiesta"],
    targetAudience: "Ragazzi avventurosi che amano la natura e lo sport.",
    methodology: "Outdoor education con immersione linguistica totale sui colli Vicentini."
  },
  {
    id: "corsi-online-per-ragazzi",
    title: "Corsi Online per Ragazzi",
    description: "Lezioni individuali o di gruppo online per bambini e ragazzi con piattaforma AI interattiva",
    longDescription: "I nostri corsi online per ragazzi combinano lezioni live con docenti qualificati e una piattaforma interattiva con AI. Perfetti per chi preferisce imparare da casa o non può raggiungere le nostre sedi.",
    price: "Da €35/mese",
    duration: "Rinnovabile",
    features: ["Piattaforma AI", "Docenti qualificati", "Orari flessibili", "Giochi didattici"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["Lezioni online live", "Accesso piattaforma AI interattiva", "Giochi didattici", "Tracking progressi per genitori", "Materiali digitali", "Certificato"],
    requirements: ["Età 6-17 anni", "Connessione internet", "Supervisione genitori per i più piccoli"],
    targetAudience: "Bambini e ragazzi che preferiscono o necessitano di formazione online.",
    methodology: "Apprendimento ludico digitale con AI e docenti specializzati."
  },
  {
    id: "ai-for-students",
    title: "AI for Students",
    description: "Corso per ragazzi sull'uso consapevole dell'AI per studio e creatività. ChatGPT, Copilot e strumenti creativi",
    longDescription: "AI for Students insegna ai ragazzi come utilizzare l'intelligenza artificiale in modo consapevole e produttivo per lo studio e la creatività. ChatGPT, Copilot, strumenti di generazione immagini e altro ancora, con focus sull'uso responsabile.",
    price: "€280",
    duration: "6 settimane",
    features: ["AI per lo studio", "Uso responsabile", "Progetti creativi", "Certificato"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["6 lezioni pratiche", "Introduzione agli strumenti AI", "Progetti creativi guidati", "Focus su uso etico e responsabile", "Materiali digitali", "Certificato"],
    requirements: ["Età 12-18 anni", "Competenze informatiche di base"],
    targetAudience: "Ragazzi curiosi che vogliono imparare a usare l'AI in modo intelligente.",
    methodology: "Laboratorio pratico con progetti creativi e discussioni sull'etica dell'AI."
  },
  {
    id: "vacanze-studio-estero",
    title: "Vacanze Studio Estero",
    description: "Soggiorni linguistici in UK, Irlanda, USA, Canada con famiglie selezionate o college",
    longDescription: "Le nostre vacanze studio all'estero offrono un'esperienza unica di immersione linguistica e culturale. Soggiorno presso famiglie selezionate o college, corsi di lingua, attività ed escursioni in UK, Irlanda, USA o Canada.",
    price: "Su richiesta",
    duration: "2-4 settimane",
    features: ["Network internazionale", "Assistenza h24", "Famiglie selezionate", "Certificazione"],
    category: "kids",
    categoryTitle: "Bambini e Ragazzi",
    categoryColor: "from-pink-500 to-pink-600",
    includes: ["Volo e trasferimenti", "Soggiorno in famiglia o college", "Corso di lingua intensivo", "Attività pomeridiane", "Escursioni nel weekend", "Assicurazione completa", "Assistenza 24/7", "Certificazione finale"],
    requirements: ["Età 10-18 anni", "Passaporto valido", "Assicurazione sanitaria"],
    targetAudience: "Ragazzi che vogliono vivere un'esperienza all'estero.",
    methodology: "Immersione culturale e linguistica con supporto costante."
  },
  {
    id: "office-senza-segreti",
    title: "Office Senza Segreti",
    description: "Excel, Word, PowerPoint e Copilot. Impara a gestire dati, report e presentazioni professionali",
    longDescription: "Il corso Office Senza Segreti ti insegna a padroneggiare gli strumenti Microsoft Office più importanti per il lavoro. Excel avanzato per gestire dati e creare report, Word per documenti professionali, PowerPoint per presentazioni d'impatto, e Copilot per velocizzare il lavoro con l'AI.",
    price: "€340",
    duration: "8 settimane",
    features: ["Excel avanzato", "Copilot AI", "Esercitazioni pratiche", "Certificato"],
    category: "digital",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["8 lezioni pratiche in presenza", "Esercitazioni su casi reali", "Focus su Excel avanzato", "Introduzione a Copilot AI", "Materiali e template", "Certificato di competenza"],
    requirements: ["Conoscenza base del PC", "Accesso a Microsoft Office"],
    targetAudience: "Professionisti, studenti e chiunque voglia migliorare le proprie competenze Office.",
    methodology: "Apprendimento pratico con esercitazioni su casi reali."
  },
  {
    id: "ai-senza-segreti",
    title: "AI Senza Segreti",
    description: "Intelligenza Artificiale per lavoro e studio. ChatGPT, Copilot, strumenti creativi e produttività",
    longDescription: "AI Senza Segreti è il corso pratico per imparare a usare l'intelligenza artificiale nella vita quotidiana e professionale. ChatGPT per scrivere e analizzare, Copilot per automatizzare, strumenti creativi per immagini e contenuti, con un approccio strategico e consapevole.",
    price: "€340",
    duration: "8 settimane",
    features: ["Strumenti AI pratici", "Prompt engineering", "Automazione", "Casi d'uso reali"],
    category: "digital",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["8 lezioni pratiche", "Panoramica strumenti AI", "Tecniche di prompt engineering", "Casi d'uso per lavoro e studio", "Materiali e risorse", "Certificato"],
    requirements: ["Conoscenza base del PC", "Curiosità per le nuove tecnologie"],
    targetAudience: "Chiunque voglia imparare a usare l'AI in modo pratico e produttivo.",
    methodology: "Laboratorio pratico con esercitazioni su strumenti reali."
  },
  {
    id: "digital-skills-bootcamp",
    title: "Digital Skills Bootcamp",
    description: "Percorso intensivo su competenze digitali essenziali per il mondo del lavoro moderno",
    longDescription: "Il Digital Skills Bootcamp è un percorso intensivo che copre tutte le competenze digitali essenziali per il mondo del lavoro moderno: cloud e collaboration, analisi dati, digital marketing basics e project management digitale.",
    price: "€450",
    duration: "6 settimane",
    features: ["Cloud & collaboration", "Data analysis", "Digital marketing basics", "Project work"],
    category: "digital",
    categoryTitle: "Competenze Digitali",
    categoryColor: "from-blue-500 to-blue-600",
    includes: ["6 settimane intensive", "Moduli su cloud, dati, marketing", "Project work finale", "Mentoring individuale", "Materiali completi", "Certificato di competenza"],
    requirements: ["Conoscenza base del PC", "Motivazione all'apprendimento intensivo"],
    targetAudience: "Chi vuole acquisire competenze digitali complete in poco tempo.",
    methodology: "Bootcamp intensivo con project work e mentoring."
  },
  {
    id: "comunicazione-efficace",
    title: "Comunicazione Efficace",
    description: "Public speaking, ascolto attivo, comunicazione assertiva e gestione dei conflitti",
    longDescription: "Il corso di Comunicazione Efficace sviluppa le competenze fondamentali per comunicare con impatto: public speaking, ascolto attivo, comunicazione assertiva, gestione dei conflitti e feedback costruttivo.",
    price: "€380",
    duration: "8 settimane",
    features: ["Esercizi pratici", "Video feedback", "Role playing", "Coaching individuale"],
    category: "growth",
    categoryTitle: "Crescita Personale",
    categoryColor: "from-violet-500 to-violet-600",
    includes: ["8 sessioni formative", "Esercitazioni pratiche", "Role playing", "Video delle performance", "Feedback personalizzato", "Sessione di coaching individuale", "Certificato"],
    requirements: ["Nessun requisito particolare", "Apertura al mettersi in gioco"],
    targetAudience: "Professionisti, manager e chiunque voglia migliorare le proprie capacità comunicative.",
    methodology: "Apprendimento esperienziale con pratica intensiva e feedback."
  },
  {
    id: "time-management",
    title: "Time Management",
    description: "Tecniche di gestione del tempo, priorità, focus e produttività personale",
    longDescription: "Il corso di Time Management insegna tecniche pratiche per gestire il tempo, definire priorità, mantenere il focus e aumentare la produttività personale. Metodi collaudati come GTD, Pomodoro e strumenti digitali.",
    price: "€280",
    duration: "4 settimane",
    features: ["Metodo GTD", "Strumenti digitali", "Abitudini efficaci", "Follow-up mensile"],
    category: "growth",
    categoryTitle: "Crescita Personale",
    categoryColor: "from-violet-500 to-violet-600",
    includes: ["4 sessioni formative", "Tecniche GTD e Pomodoro", "Setup strumenti digitali", "Piano personale di produttività", "Follow-up a 1 mese", "Materiali e template"],
    requirements: ["Nessun requisito particolare"],
    targetAudience: "Professionisti, studenti e chiunque voglia gestire meglio il proprio tempo.",
    methodology: "Workshop pratico con implementazione immediata."
  },
  {
    id: "mindfulness-wellbeing",
    title: "Mindfulness & Wellbeing",
    description: "Gestione dello stress, equilibrio vita-lavoro, mindfulness applicata alla quotidianità",
    longDescription: "Il percorso Mindfulness & Wellbeing offre strumenti pratici per gestire lo stress, trovare equilibrio tra vita e lavoro, e sviluppare una pratica di mindfulness applicata alla vita quotidiana.",
    price: "€320",
    duration: "6 settimane",
    features: ["Pratiche guidate", "App dedicate", "Gruppo supporto", "Materiali audio"],
    category: "growth",
    categoryTitle: "Crescita Personale",
    categoryColor: "from-violet-500 to-violet-600",
    includes: ["6 sessioni di gruppo", "Pratiche guidate di mindfulness", "Tecniche di gestione stress", "App e materiali audio", "Gruppo di supporto online", "Sessione individuale finale"],
    requirements: ["Nessun requisito particolare", "Apertura alla pratica meditativa"],
    targetAudience: "Chiunque voglia ridurre lo stress e migliorare il proprio benessere.",
    methodology: "Approccio esperienziale con pratiche guidate e supporto di gruppo."
  }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const course = allCourses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Corso non trovato</h1>
          <p className="text-muted-foreground mb-6">Il corso che cerchi non esiste o è stato rimosso.</p>
          <Link href="/corsi">
            <Button data-testid="button-back-courses">Torna ai Corsi</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[course.category] || BookOpen;
  const courseImage = courseImages[course.id] || categoryImages[course.category];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/corsi">
            <Button variant="ghost" className="gap-2" data-testid="button-back-courses">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Tutti i Corsi</span>
            </Button>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex">
            <CategoryIcon className="w-4 h-4 mr-2" />
            {course.categoryTitle}
          </Badge>
        </div>
      </header>

      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={courseImage} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <Badge className={`bg-gradient-to-r ${course.categoryColor} text-white border-0 mb-3`}>
              {course.categoryTitle}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground max-w-2xl">{course.description}</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.longDescription}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-4">Cosa Include</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Metodologia</h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.methodology}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">A Chi è Rivolto</h2>
              <p className="text-muted-foreground leading-relaxed">
                {course.targetAudience}
              </p>
            </motion.section>

            {course.requirements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Requisiti</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary">•</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {course.price}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {course.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <Link href="/#contact">
                    <Button className="w-full" size="lg" data-testid="button-request-info">
                      <Mail className="w-4 h-4 mr-2" />
                      Richiedi Informazioni
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-call">
                    <Phone className="w-4 h-4 mr-2" />
                    Chiamaci
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Le nostre sedi</h3>
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
