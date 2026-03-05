import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CourseReviewsInline } from "@/components/product-reviews";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Award,
  Sparkles,
  Clock,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  Monitor,
  UserCheck,
  GraduationCap,
  CreditCard,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Shield,
  Wifi,
  Mic,
  Video,
  Brain,
  Headphones,
  Play,
} from "lucide-react";
import { Link } from "wouter";
import { PROVINCES } from "@shared/provinces";
import { COUNTRIES } from "@shared/countries";
import { CorsiELearningSchema } from "@/components/seo-schemas";
import corsoOnlineImage from "@assets/course-digitale.png";
import categoryOnline from "@/assets/images/category-online.jpg";
import courseIndividual from "@/assets/images/course-individual.jpg";
import lingueStraniereImage from "@assets/course-lingue-straniere.png";
import managementImage from "@assets/course-management.png";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const linguaOptions = ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Portoghese", "Italiano per stranieri", "Altro"];
const livelloOptions = [
  { value: "nullo", label: "Nullo (non ho mai studiato la lingua)" },
  { value: "a1", label: "(A1) Scarso" },
  { value: "a2", label: "(A2) Discreto" },
  { value: "b1", label: "(B1) Buono" },
  { value: "b2", label: "(B2) Molto buono" },
  { value: "c1", label: "(C1) Ottimo" },
];
const comeConosciutoOptions = [
  "Tramite un amico o conoscente",
  "Newsletter",
  "Facebook",
  "Instagram",
  "Altri social media",
  "Link su un altro sito",
  "YouTube",
  "Tramite la mia Azienda",
  "Altro",
];

const courses = [
  {
    id: "self-learning",
    reviewSlug: "camclass-selflearning",
    title: "Cam-Class Blended Individuale e Self-Learning",
    subtitle: "Studia al tuo ritmo con supporto tutor",
    description: "Impara comodamente da casa con un corso di lingua online dinamico ed efficace su piattaforma e-learning moderna. Self-learning per uno studio personalizzato, oppure modalità blended con 2-4 lezioni individuali da 30 minuti al mese con tutor qualificato via Zoom.",
    fullDescription: [
      "Lezioni su piattaforma digitale altamente tecnologica con lezioni virtuali individuali. Benefici: massima flessibilità, personalizzazione completa del percorso, docente qualificato e tutor dedicato.",
      "La piattaforma è basata su Intelligenza Artificiale con riconoscimento vocale avanzato, coinvolgimento attivo, test e certificazione finale CEFR. Possibilità di auto-prenotazione delle lezioni e di scegliere un programma completamente self-learning.",
      "Interazione con una community internazionale di oltre 4 milioni di studenti attiva 24/7 per esercitarsi e confrontarsi con studenti da tutto il mondo.",
    ],
    image: corsoOnlineImage,
    price: "da 25",
    duration: "Minimo 1 mese",
    gradient: "from-teal-500 to-cyan-600",
    accentBg: "bg-teal-50 dark:bg-teal-950/30",
    icon: Monitor,
    features: [
      "Lezioni serali, 1 incontro/settimana",
      "Durata minima 1 mese, rinnovabile mensilmente",
      "Virtual Classroom Zoom con tutor qualificato",
      "Piattaforma online accessibile 24/7",
      "Programmi strutturati e progressivi",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "gruppo",
    reviewSlug: "camclass-gruppo",
    title: "Cam-Class Blended di Gruppo",
    subtitle: "Lezioni live in piccolo gruppo + e-learning",
    description: "Corso blended con lezioni live con tutor qualificati e piattaforma e-learning interattiva con strumenti avanzati come riconoscimento vocale e AI.",
    fullDescription: [
      "Corso di lingua online in piccoli gruppi con docente qualificato. Lezioni serali settimanali su Zoom integrate dalla piattaforma e-learning attiva 24/7. Inizio flessibile con focus sulla conversazione e metodo comunicativo.",
      "Avanza ogni mese con valutazione orale continua e ottieni il certificato QCER in 4 mesi. Interazione con una community internazionale di oltre 4 milioni di studenti per esercitarti anche fuori dalla lezione.",
      "Strumenti avanzati come riconoscimento vocale e AI per un feedback immediato sulla pronuncia. Supporto costante del tutor qualificato durante tutto il percorso.",
    ],
    image: lingueStraniereImage,
    price: "60",
    duration: "Minimo 1 mese",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    icon: Users,
    features: [
      "Lezioni serali, 1 incontro/settimana",
      "Durata minima 1 mese, rinnovabile mensilmente",
      "Virtual Classroom Zoom con tutor qualificato",
      "Piattaforma online accessibile 24/7",
      "Programmi strutturati e progressivi",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con 18app e Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "individuale",
    reviewSlug: "camclass-individuale",
    title: "Cam-Class Corso Individuale o Semi-Individuale",
    subtitle: "Percorso personalizzato 1-2 partecipanti",
    description: "Formazione linguistica online modulare per 1 o 2 partecipanti, con programma interamente personalizzato sugli obiettivi e il livello dello studente.",
    fullDescription: [
      "Pacchetto di 12 lezioni online con docenti qualificati in inglese, francese, tedesco, spagnolo, portoghese, russo o italiano. Lezioni flessibili, personalizzate e interattive su Zoom.",
      "Il programma viene costruito interamente sulle tue esigenze: obiettivi professionali, preparazione a colloqui, presentazioni, negoziazioni o semplicemente migliorare le competenze comunicative generali.",
      "Massima flessibilità di orari con prenotazione via app. Materiale didattico personalizzato e certificato a fine corso con il livello raggiunto secondo il QCER.",
    ],
    image: categoryOnline,
    price: "230",
    duration: "12 lezioni",
    gradient: "from-emerald-500 to-green-600",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: UserCheck,
    features: [
      "Orari flessibili su prenotazione",
      "12 lezioni in videoconferenza",
      "Virtual Classroom Zoom",
      "Tutor qualificato dedicato",
      "Programmi strutturati e progressivi",
      "Metodo Interlingua",
      "Acquistabile con 18app",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "certificazione",
    reviewSlug: "preparazione-certificazione",
    title: "Percorso di Preparazione a Certificazione Linguistica",
    subtitle: "Preparazione esami MIUR: LanguageCert, IELTS, TOEFL, Cambridge e altri",
    description: "Percorso di certificazione mirato alla preparazione degli esami riconosciuti dal MIUR in inglese, francese, tedesco e spagnolo.",
    fullDescription: [
      "Corso di preparazione agli esami di certificazione linguistica riconosciuti dal MIUR: LanguageCert, IELTS, TOEFL, Cambridge English, Trinity, DELF, DELE, Goethe-Zertifikat. Lezioni online con tutor specializzato e percorso personalizzato.",
      "Puoi scegliere tra intero percorso (preparazione + esame), solo il percorso di preparazione, oppure acquistare solo l'iscrizione all'esame (solo lingua inglese). Il percorso include 12 lezioni live su Zoom con simulazioni di esame, oltre a 60 ore di e-learning interattivo con esercitazioni mirate sulle 4 skills.",
      "Il percorso di preparazione può essere svolto, a scelta, solo in aula virtuale con tutor specializzato, oppure attraverso un corso blended con lezioni live + piattaforma e-learning con programma completo mirato al superamento dell'esame.",
    ],
    image: managementImage,
    price: "da 230",
    duration: "12 lezioni + 60h e-learning",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50 dark:bg-amber-950/30",
    icon: Award,
    features: [
      "Esami MIUR: LanguageCert, IELTS, TOEFL, Cambridge, Trinity, DELF, DELE, Goethe",
      "Tutor specializzato",
      "Simulazioni di esame incluse",
      "12 lezioni live in aula virtuale Zoom",
      "Orari flessibili autoprenotabili (app di self-booking)",
      "60 ore di lezioni interattive su piattaforma 24/7",
      "Acquistabile con 18app, Carta Cultura Giovani e Carta del docente",
      "Quota esame da 130 euro (opzionale)",
    ],
    highlight: "Inglese, francese, tedesco o spagnolo",
  },
  {
    id: "conversazione",
    reviewSlug: "conversazione-individuale",
    title: "Cam-Class Conversazione Individuale",
    subtitle: "Sessioni 1-to-1 per sviluppare fluency",
    description: "Sessioni di conversazione individuali con insegnanti qualificati via Zoom, pensate per sviluppare fluency, sicurezza e padronanza della lingua.",
    fullDescription: [
      "Il corso di conversazione individuale di Interlingua è dedicato a perfezionare le abilità di interazione orale. Attraverso le lezioni interattive in aula virtuale, sviluppi abilità comunicative praticando dialoghi autentici e guadagnando fiducia nell'uso della lingua.",
      "L'insegnante qualificato offre feedback immediato e consigli personalizzati per migliorare la fluidità nella conversazione, sviluppare il vocabolario, migliorare la pronuncia e molto altro.",
      "Pacchetto di 5 lezioni individuali di 30 minuti ciascuna. Metodologia didattica interattiva Task Based Learning e Content and Language Integrated Learning (CLIL). Orari flessibili prenotabili tramite app. Livello minimo richiesto: B1.",
    ],
    image: courseIndividual,
    price: "95",
    duration: "5 lezioni da 30 min",
    gradient: "from-blue-500 to-indigo-600",
    accentBg: "bg-blue-50 dark:bg-blue-950/30",
    icon: Mic,
    features: [
      "Virtual Classroom Zoom",
      "Tutor qualificato dedicato",
      "Metodologia Task Based Learning e CLIL",
      "Orario flessibile",
      "Prenotazione tramite app",
      "Livello minimo: B1",
      "Acquistabile con 18app",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "mini-gruppi",
    reviewSlug: "camclass-minigruppi",
    title: "Cam-Class Corso in Mini-Gruppi",
    subtitle: "Max 5 partecipanti, massima interazione",
    description: "Corso in piccolo gruppo con un massimo di 5 partecipanti per garantire la massima interazione e attenzione individuale.",
    fullDescription: [
      "Corso online di lingua in piccoli gruppi con docente qualificato. Lezioni serali settimanali su Zoom, integrate da accesso illimitato alla piattaforma e-learning 24/7. Disponibile per inglese, francese, tedesco, spagnolo, portoghese, russo o italiano.",
      "Metodo Interlingua con approccio Task-Based Learning e CLIL per un apprendimento pratico e orientato alla comunicazione reale. Massimo 5 partecipanti per garantire attenzione individuale e ampio spazio di pratica.",
      "Orari concordati tra studenti e docente per la massima flessibilità. Programmi strutturati e progressivi con certificato a fine corso.",
    ],
    image: lingueStraniereImage,
    price: "230",
    duration: "12 lezioni",
    gradient: "from-pink-500 to-rose-600",
    accentBg: "bg-pink-50 dark:bg-pink-950/30",
    icon: Users,
    features: [
      "Orari concordati tra studenti e docente",
      "12 lezioni in videoconferenza",
      "Virtual Classroom Zoom",
      "Tutor qualificato dedicato",
      "Programmi strutturati e progressivi",
      "Max 5 partecipanti",
      "Metodo Interlingua",
      "Acquistabile con 18app e Carta Cultura Giovani",
    ],
    highlight: "Inglese, francese, tedesco, spagnolo, russo o italiano",
  },
  {
    id: "bambini-ragazzi",
    reviewSlug: null as string | null,
    title: "Cam-Class Corso di Inglese per Bambini e Ragazzi",
    subtitle: "Corsi di inglese online dedicati ai giovani",
    description: "Corsi di inglese online pensati appositamente per bambini e ragazzi, con metodologie didattiche coinvolgenti e interattive adatte alle diverse fasce di età.",
    fullDescription: [
      "Lezioni live con tutor qualificati in un ambiente stimolante e sicuro, pensate per le diverse fasce di età. Metodologie didattiche specifiche per giovani studenti, con contenuti interattivi e coinvolgenti.",
      "Virtual Classroom su Zoom con programmi strutturati per fasce di età, materiali multimediali e attività ludiche che rendono l'apprendimento divertente e naturale. Certificato a fine corso con il livello raggiunto.",
      "Metodo Interlingua adattato alle esigenze dei giovani studenti, con focus su comunicazione orale, giochi di ruolo e attività collaborative per sviluppare la sicurezza nell'uso della lingua fin da subito.",
    ],
    image: categoryOnline,
    price: "Su richiesta",
    duration: "Flessibile",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50 dark:bg-sky-950/30",
    icon: GraduationCap,
    features: [
      "Virtual Classroom Zoom",
      "Tutor qualificato",
      "Metodologia adatta a bambini e ragazzi",
      "Contenuti interattivi e coinvolgenti",
      "Programmi strutturati per fasce di età",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
];

const stats = [
  { value: 7, suffix: "", label: "Lingue disponibili", icon: Globe },
  { value: 4, suffix: "M+", label: "Studenti nel mondo", icon: Users },
  { value: 24, suffix: "/7", label: "Piattaforma sempre attiva", icon: Wifi },
  { value: 100, suffix: "%", label: "Online, ovunque tu sia", icon: Monitor },
];

const advantages = [
  { icon: Play, title: "Studia Quando Vuoi", desc: "Piattaforma e-learning accessibile 24 ore su 24, 7 giorni su 7. Impara al tuo ritmo.", gradient: "from-teal-500 to-cyan-600", bgLight: "bg-teal-50 dark:bg-teal-950/30" },
  { icon: Video, title: "Lezioni Live su Zoom", desc: "Virtual Classroom con tutor qualificati per un'esperienza interattiva.", gradient: "from-violet-500 to-purple-600", bgLight: "bg-violet-50 dark:bg-violet-950/30" },
  { icon: Brain, title: "AI e Voice Recognition", desc: "Tecnologie avanzate per migliorare pronuncia, comprensione e produzione linguistica.", gradient: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: Shield, title: "Certificazione Inclusa", desc: "Attestato riconosciuto al completamento del corso con il livello raggiunto.", gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50 dark:bg-amber-950/30" },
];

function CourseInfoForm({ courseTitle, gradient }: { courseTitle: string; gradient: string }) {
  const { toast } = useToast();
  const [lingua, setLingua] = useState("");
  const [livello, setLivello] = useState("");
  const [comeConosciuto, setComeConosciuto] = useState("");
  const [paese, setPaese] = useState("IT");
  const isItaly = paese === "IT";
  const [provincia, setProvincia] = useState("");
  const [comuniList, setComuniList] = useState<Array<{ nome: string; cap: string[] }>>([]);
  const [loadingComuni, setLoadingComuni] = useState(false);
  const [citta, setCitta] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isItaly) {
      setProvincia("");
      setCitta("");
      setComuniList([]);
      return;
    }
    if (provincia) {
      setLoadingComuni(true);
      setCitta("");
      setComuniList([]);
      fetch(`/api/comuni/${provincia}`)
        .then((r) => r.json())
        .then((data) => setComuniList(data))
        .catch(() => setComuniList([]))
        .finally(() => setLoadingComuni(false));
    } else {
      setComuniList([]);
    }
  }, [provincia, isItaly]);

  const validate = (formData: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.get("fname")) errs.fname = "Campo obbligatorio";
    if (!formData.get("lname")) errs.lname = "Campo obbligatorio";
    if (!formData.get("email")) errs.email = "Campo obbligatorio";
    if (!citta) errs.city = "Campo obbligatorio";
    if (isItaly && !provincia) errs.provincia = "Seleziona una provincia";
    if (!lingua) errs.lingua = "Seleziona una lingua";
    if (!livello) errs.livello = "Seleziona un livello";
    if (!comeConosciuto) errs.comeConosciuto = "Seleziona un'opzione";
    if (!gdpr) errs.gdpr = "Consenso obbligatorio";
    return errs;
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const parts = [
        `Corso: ${courseTitle}`,
        `Lingua: ${lingua}`,
        `Livello: ${livelloOptions.find(l => l.value === livello)?.label || livello}`,
        `Paese: ${COUNTRIES.find(c => c.code === paese)?.name || paese}`,
        `Citta: ${citta}`,
        provincia ? `Provincia: ${provincia}` : "",
        `Come ci ha conosciuto: ${comeConosciuto}`,
        newsletter ? "Newsletter: Si" : "",
        formData.get("message") ? `\n${formData.get("message")}` : "",
      ].filter(Boolean);

      const body = {
        name: `${formData.get("fname")} ${formData.get("lname")}`,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        courseInterest: courseTitle,
        message: parts.join("\n"),
      };

      await apiRequest("POST", "/api/contact", body);
    },
    onSuccess: () => {
      toast({ title: "Richiesta inviata", description: "Ti contatteremo al più presto con tutte le informazioni." });
    },
    onError: () => {
      toast({ title: "Errore", description: "Si è verificato un errore. Riprova più tardi.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    mutation.mutate(formData);
  };

  if (mutation.isSuccess) {
    return (
      <div className="text-center py-10 px-6">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-5 shadow-xl`}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h4 className="text-xl font-bold text-foreground mb-3">Richiesta inviata con successo</h4>
        <p className="text-muted-foreground max-w-md mx-auto">Ti contatteremo al più presto con tutte le informazioni sul corso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8" noValidate>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Send className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-bold text-foreground">Richiedi informazioni per questo corso</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fname" className="text-sm font-medium">Nome *</Label>
          <Input id="fname" name="fname" placeholder="Il tuo nome" className={submitted && errors.fname ? "border-destructive" : ""} data-testid="input-el-fname" />
          {submitted && errors.fname && <p className="text-xs text-destructive">{errors.fname}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lname" className="text-sm font-medium">Cognome *</Label>
          <Input id="lname" name="lname" placeholder="Il tuo cognome" className={submitted && errors.lname ? "border-destructive" : ""} data-testid="input-el-lname" />
          {submitted && errors.lname && <p className="text-xs text-destructive">{errors.lname}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="La tua email" className={submitted && errors.email ? "border-destructive" : ""} data-testid="input-el-email" />
          {submitted && errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">Telefono</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Numero di telefono" data-testid="input-el-phone" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sel-paese" className="text-sm font-medium">Paese *</Label>
        <Select value={paese} onValueChange={(v) => { setPaese(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.paese; return n; }); }}>
          <SelectTrigger id="sel-paese" data-testid="select-el-paese">
            <SelectValue placeholder="Seleziona paese" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isItaly ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="sel-provincia" className="text-sm font-medium">Provincia *</Label>
            <Select value={provincia} onValueChange={(v) => { setProvincia(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.provincia; return n; }); }}>
              <SelectTrigger id="sel-provincia" className={submitted && errors.provincia ? "border-destructive" : ""} data-testid="select-el-provincia">
                <SelectValue placeholder="Seleziona provincia" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p.sigla} value={p.sigla}>{p.nome} ({p.sigla})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {submitted && errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-sm font-medium">Comune *</Label>
            {provincia && comuniList.length > 0 ? (
              <Select value={citta} onValueChange={(v) => { setCitta(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.city; return n; }); }}>
                <SelectTrigger id="city" className={submitted && errors.city ? "border-destructive" : ""} data-testid="select-el-city">
                  <SelectValue placeholder={loadingComuni ? "Caricamento..." : "Seleziona comune"} />
                </SelectTrigger>
                <SelectContent>
                  {comuniList.map((c) => (
                    <SelectItem key={c.nome} value={c.nome}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input id="city" name="city" value={citta} onChange={(e) => { setCitta(e.target.value); if (submitted) setErrors(prev => { const n = {...prev}; delete n.city; return n; }); }} placeholder={provincia ? "Caricamento comuni..." : "Seleziona prima la provincia"} className={submitted && errors.city ? "border-destructive" : ""} data-testid="input-el-city" disabled={!provincia || loadingComuni} />
            )}
            {submitted && errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium">Città *</Label>
          <Input id="city" name="city" value={citta} onChange={(e) => { setCitta(e.target.value); if (submitted) setErrors(prev => { const n = {...prev}; delete n.city; return n; }); }} placeholder="La tua città" className={submitted && errors.city ? "border-destructive" : ""} data-testid="input-el-city-text" />
          {submitted && errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="sel-lingua" className="text-sm font-medium">Lingua *</Label>
          <Select value={lingua} onValueChange={(v) => { setLingua(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.lingua; return n; }); }}>
            <SelectTrigger id="sel-lingua" className={submitted && errors.lingua ? "border-destructive" : ""} data-testid="select-el-lingua">
              <SelectValue placeholder="Seleziona lingua" />
            </SelectTrigger>
            <SelectContent>
              {linguaOptions.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && errors.lingua && <p className="text-xs text-destructive">{errors.lingua}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sel-livello" className="text-sm font-medium">Livello *</Label>
          <Select value={livello} onValueChange={(v) => { setLivello(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.livello; return n; }); }}>
            <SelectTrigger id="sel-livello" className={submitted && errors.livello ? "border-destructive" : ""} data-testid="select-el-livello">
              <SelectValue placeholder="Seleziona livello" />
            </SelectTrigger>
            <SelectContent>
              {livelloOptions.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && errors.livello && <p className="text-xs text-destructive">{errors.livello}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sel-come" className="text-sm font-medium">Come ci hai conosciuto *</Label>
        <Select value={comeConosciuto} onValueChange={(v) => { setComeConosciuto(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.comeConosciuto; return n; }); }}>
          <SelectTrigger id="sel-come" className={submitted && errors.comeConosciuto ? "border-destructive" : ""} data-testid="select-el-come">
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            {comeConosciutoOptions.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {submitted && errors.comeConosciuto && <p className="text-xs text-destructive">{errors.comeConosciuto}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium">Richieste o domande</Label>
        <Textarea id="message" name="message" rows={3} placeholder="Scrivi qui le tue domande o richieste specifiche..." data-testid="textarea-el-message" />
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(v) => setNewsletter(v === true)} data-testid="checkbox-el-newsletter" />
          <Label htmlFor="newsletter" className="text-sm text-muted-foreground leading-snug cursor-pointer">Iscriviti alla nostra Newsletter per ricevere aggiornamenti su corsi e promozioni</Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox id="gdpr" checked={gdpr} onCheckedChange={(v) => { setGdpr(v === true); if (submitted) setErrors(prev => { const n = {...prev}; delete n.gdpr; return n; }); }} data-testid="checkbox-el-gdpr" />
          <Label htmlFor="gdpr" className={`text-sm leading-snug cursor-pointer ${submitted && errors.gdpr ? "text-destructive" : "text-muted-foreground"}`}>Acconsento al{" "}<a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">trattamento dei dati personali</a>{" "}ai sensi del GDPR (Reg. UE 2016/679) *</Label>
        </div>
        {submitted && errors.gdpr && <p className="text-xs text-destructive ml-7">{errors.gdpr}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending} className={`w-full h-12 text-base rounded-xl bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-bold shadow-lg`} data-testid="button-el-submit">
        {mutation.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio in corso...</>) : (<><Send className="w-4 h-4 mr-2" />Invia Richiesta</>)}
      </Button>
    </form>
  );
}

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <Card id={course.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card scroll-mt-24" data-testid={`card-el-course-${course.id}`}>
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${course.gradient}`} />
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]">
            <div className="relative h-64 md:h-full overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card/30" />
              <div className="absolute top-5 left-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-xl ring-4 ring-white/20`}>
                  <course.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <Badge className="bg-white/95 dark:bg-black/70 text-foreground border-0 backdrop-blur-md px-4 py-2 text-sm font-bold shadow-lg">
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  {course.price === "Su richiesta" ? course.price : `${course.price} euro`}
                </Badge>
                <Badge variant="secondary" className="bg-white/95 dark:bg-black/70 border-0 backdrop-blur-md px-3 py-2 text-xs font-medium shadow-lg">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </Badge>
              </div>
            </div>
            <div className="p-7 md:p-8 lg:p-10">
              <div className="mb-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1.5 tracking-tight">{course.title}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${course.gradient} bg-clip-text text-transparent`}>{course.subtitle}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">{course.description}</p>
              <button
                type="button"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className={`inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors ${detailsOpen ? "text-muted-foreground" : "text-primary hover:text-primary/80"}`}
                data-testid={`button-el-details-${course.id}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {detailsOpen ? "Chiudi dettagli" : "Leggi di più"}
                {detailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <AnimatePresence>
                {detailsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-5 mb-5 ${course.accentBg} border border-border/30`}>
                      <div className="space-y-3">
                        {course.fullDescription.map((paragraph, i) => (
                          <p key={i} className="text-sm text-foreground/80 leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {course.highlight && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{course.highlight}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {course.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${course.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-foreground leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 pt-6 border-t border-border/50">
                <Button
                  size="lg"
                  className={`rounded-xl ${!formOpen ? `bg-gradient-to-r ${course.gradient} hover:opacity-90 text-white shadow-lg` : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                  onClick={() => setFormOpen(!formOpen)}
                  data-testid={`button-el-toggle-form-${course.id}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Richiedi Informazioni
                  {formOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
              </div>
              <AnimatePresence>
                {formOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl mt-4 ${course.accentBg} border border-border/30`}>
                      <div className="max-w-3xl mx-auto">
                        <CourseInfoForm courseTitle={course.title} gradient={course.gradient} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {course.reviewSlug && (
                <CourseReviewsInline productSlug={course.reviewSlug} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export default function CorsiELearningPage() {
  useSEO({
    title: "Corsi di Lingue Online | E-Learning con Tutor Qualificato | SkillCraft-Interlingua",
    description: "Corsi di lingue online con tutor qualificato. Inglese, tedesco, francese, spagnolo e russo. Piattaforma e-learning, lezioni live, orari flessibili.",
    canonical: "/corsi-e-learning",
  });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <CorsiELearningSchema />
      <Navigation />
      <main>
        <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-cyan-800 to-blue-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-teal-400 top-[-200px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-cyan-500 bottom-[-150px] left-[-100px] animation-delay-2000" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-emerald-400 top-[30%] left-[60%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm" data-testid="badge-el-label">
                    <Monitor className="w-3.5 h-3.5 mr-1.5" />
                    Formazione Online
                  </Badge>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight" data-testid="text-el-title">
                  Corsi Online
                  <br />
                  <span className="bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent">
                    ed E-Learning
                  </span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="text-xl text-white/85 mb-4 leading-relaxed max-w-xl">
                  Impara una lingua ovunque tu sia, con piattaforma e-learning 24/7, lezioni live con tutor qualificati e tecnologie AI avanzate.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl">
                  7 lingue disponibili. Da 25 euro al mese. Community internazionale di oltre 4 milioni di studenti.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <Wifi className="w-5 h-5 text-teal-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Accesso</p>
                      <p className="font-bold text-white">24/7 Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <Globe className="w-5 h-5 text-teal-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Lingue</p>
                      <p className="font-bold text-white">7 disponibili</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <CreditCard className="w-5 h-5 text-teal-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">A partire da</p>
                      <p className="font-bold text-white">25 euro/mese</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }} className="flex flex-wrap gap-4">
                  <Button size="lg" className="h-14 px-10 text-base rounded-2xl bg-white text-teal-700 hover:bg-white/90 shadow-2xl shadow-black/20 font-bold" onClick={() => document.querySelector("#courses-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-el-cta">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Scopri i Corsi
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm" onClick={() => document.querySelector("#contact-section")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-el-contact">
                    Contattaci
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
                  <img src={corsoOnlineImage} alt="Corsi online" className="w-full h-[480px] object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -left-6 fi-glass-card rounded-2xl p-5 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Live su Zoom</p>
                      <p className="text-xs text-muted-foreground">Tutor qualificato</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 fi-glass-card rounded-2xl p-5 shadow-xl animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">AI Integrata</p>
                      <p className="text-xs text-muted-foreground">Voice recognition</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="py-6 relative z-10 -mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="fi-glass-card rounded-2xl p-5 md:p-6 text-center shadow-xl">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-1 tracking-tight">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="courses-section" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/5 border border-teal-500/10 mb-6">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-bold text-teal-600 tracking-wide">Catalogo Corsi Online</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-el-catalog-title">
                  I Nostri Corsi
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent"> E-Learning</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Piattaforma interattiva, lezioni live con tutor qualificati e tecnologie avanzate per un apprendimento efficace ovunque tu sia.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-12 max-w-5xl mx-auto">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-500/3 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/5 border border-teal-500/10 mb-6">
                  <Target className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-bold text-teal-600 tracking-wide">Perché Sceglierci</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-el-why-title">
                  I Vantaggi del
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent"> Nostro E-Learning</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  La flessibilità dello studio online con la qualità della formazione Interlingua.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {advantages.map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className={`h-1 bg-gradient-to-r ${item.gradient}`} />
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2 text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/5 border border-teal-500/10 mb-6">
                  <Zap className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-bold text-teal-600 tracking-wide">Scopri di Più</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
                  Preferisci la
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent"> Formazione in Sede?</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                  Scopri anche i nostri corsi in presenza a Vicenza e Thiene e i percorsi intensivi.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <Link href="/formazione-in-presenza">
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full" data-testid="link-el-presenza">
                      <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-600" />
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Formazione in Presenza</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">Corsi di gruppo, individuali e blended nelle nostre sedi di Vicenza e Thiene.</p>
                        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                          Scopri di più <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/full-immersion">
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full" data-testid="link-el-immersion">
                      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Full Immersion Workshop</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">Un livello QCER in una settimana. 30+ ore frontali con team di coach qualificati.</p>
                        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                          Scopri di più <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="contact-section" className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-cyan-800 to-blue-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-teal-400 top-[-200px] right-[-150px]" />
          <div className="fi-hero-orb w-[500px] h-[500px] bg-cyan-500 bottom-[-200px] left-[-150px]" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-emerald-400 top-[40%] right-[20%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
                  <Calendar className="w-4 h-4 text-teal-300" />
                  <span className="text-sm font-bold text-white/90 tracking-wide">Inizia Subito</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight tracking-tight" data-testid="text-el-cta-title">
                  Impara Una Lingua
                  <br />
                  <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                    Ovunque Tu Sia
                  </span>
                </h2>
                <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Contattaci per informazioni su corsi, piattaforma e prezzi. Ti aiutiamo a trovare la formula perfetta per i tuoi obiettivi.
                </p>
                <p className="text-lg text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Prova gratuita disponibile. Nessun impegno.
                </p>
                <div className="flex flex-wrap justify-center gap-5">
                  <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-white text-teal-700 hover:bg-white/90 shadow-2xl shadow-black/20 font-bold" asChild data-testid="button-el-call">
                    <a href="tel:+390444321601">
                      <Phone className="w-5 h-5 mr-2" />
                      Chiama: 0444 321601
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm font-medium" asChild data-testid="button-el-email">
                    <a href="mailto:info@interlingua.it">
                      <Mail className="w-5 h-5 mr-2" />
                      info@interlingua.it
                    </a>
                  </Button>
                  <Link href="/test-di-livello">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-16 px-10 text-lg rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm font-medium"
                      data-testid="button-el-test"
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Fai il Test di Livello
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
