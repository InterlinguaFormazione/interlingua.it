import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
  Cpu,
  Brain,
  CreditCard,
  MapPin,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";
import { Link } from "wouter";
import lingueStraniereImage from "@assets/lingue-straniere_1772143318023.webp";
import languageCoachingImage from "@assets/Language_Coaching_1772143397641.webp";
import managementImage from "@assets/management-leadership_1772143822898.webp";
import categoryPresence from "@/assets/images/category-presence.jpg";
import courseIndividual from "@/assets/images/course-individual.jpg";
import courseExcel from "@/assets/images/course-excel.jpg";
import courseAi from "@/assets/images/course-ai.jpg";

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

const sedeOptions = ["Vicenza", "Thiene", "Casa/Azienda"];
const linguaOptions = ["Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Altro"];
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
const province = [
  "Agrigento","Alessandria","Ancona","Aosta","L'Aquila","Arezzo","Ascoli Piceno","Asti","Avellino",
  "Bari","Barletta-Andria-Trani","Belluno","Benevento","Bergamo","Biella","Bologna","Bolzano","Brescia","Brindisi",
  "Cagliari","Caltanissetta","Campobasso","Caserta","Catania","Catanzaro","Chieti","Como","Cosenza","Cremona","Crotone","Cuneo",
  "Enna","Fermo","Ferrara","Firenze","Foggia","Forli-Cesena","Frosinone",
  "Genova","Gorizia","Grosseto",
  "Imperia","Isernia",
  "La Spezia","Latina","Lecce","Lecco","Livorno","Lodi","Lucca",
  "Macerata","Mantova","Massa-Carrara","Matera","Messina","Milano","Modena","Monza-Brianza",
  "Napoli","Novara","Nuoro",
  "Oristano",
  "Padova","Palermo","Parma","Pavia","Perugia","Pesaro-Urbino","Pescara","Piacenza","Pisa","Pistoia","Pordenone","Potenza","Prato",
  "Ragusa","Ravenna","Reggio Calabria","Reggio Emilia","Rieti","Rimini","Roma","Rovigo",
  "Salerno","Sassari","Savona","Siena","Siracusa","Sondrio",
  "Taranto","Teramo","Terni","Torino","Trapani","Trento","Treviso","Trieste",
  "Udine",
  "Varese","Venezia","Verbania","Vercelli","Verona","Vibo Valentia","Vicenza","Viterbo",
];

const courses = [
  {
    id: "corsi-gruppo",
    title: "Corsi di Gruppo",
    subtitle: "Lingue straniere per tutti i livelli",
    description: "Corsi collettivi serali e diurni nelle nostre sedi di Vicenza e Thiene, con docenti madrelingua qualificati. Formazione strutturata e certificata per tutti i livelli QCER, dal principiante all'avanzato.",
    fullDescription: [
      "I corsi di gruppo di Interlingua offrono un ambiente stimolante dove imparare insieme ad altri studenti motivati, con classi omogenee per livello. Ogni modulo dura 6 settimane con 1 incontro settimanale in sede, e può essere rinnovato per un percorso progressivo e continuo.",
      "Il Metodo Interlingua combina l'approccio comunicativo con Task-Based Learning e Content and Language Integrated Learning (CLIL): si impara la lingua usandola attivamente in contesti reali, non studiandola a memoria. Ogni lezione è progettata per sviluppare tutte e 4 le competenze: comprensione, produzione orale, lettura e scrittura.",
      "Il corso include l'accesso alla piattaforma e-learning attiva 24/7, con esercizi interattivi, riconoscimento vocale e una community globale di oltre 4 milioni di studenti. Acquistando il corso completo (due moduli da 6 settimane) risparmi 50 euro sul totale.",
    ],
    image: lingueStraniereImage,
    price: "340",
    duration: "12 settimane",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    icon: Globe,
    showLingua: true,
    features: [
      "Docente madrelingua in sede",
      "Programmi strutturati, progressivi e interattivi",
      "Tutti i livelli QCER disponibili",
      "1 incontro/settimana + piattaforma e-learning 24/7",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: "Risparmia 50 euro acquistando un corso completo (due moduli)",
  },
  {
    id: "corsi-individuali",
    title: "Corsi Individuali o Semi-Individuali",
    subtitle: "1 o 2 partecipanti, massima personalizzazione",
    description: "Apprendimento personalizzato con docenti madrelingua, lezioni su misura e massima flessibilità. Un percorso efficace per un progresso rapido in un ambiente motivante.",
    fullDescription: [
      "Il corso individuale è la soluzione ideale per chi ha obiettivi specifici, tempistiche precise o esigenze professionali particolari. Il programma viene costruito interamente attorno alle tue necessità: preparazione a colloqui, presentazioni aziendali, negoziazioni internazionali, o miglioramento delle competenze comunicative generali.",
      "Con il formato semi-individuale (2 partecipanti) puoi condividere il percorso con un collega o un amico allo stesso livello, dimezzando il costo senza rinunciare all'attenzione personalizzata del docente. Gli orari sono completamente flessibili e concordati direttamente con il tuo insegnante.",
      "Ogni lezione si svolge nella nostra sede con materiale didattico personalizzato. Il docente madrelingua monitora i tuoi progressi e adatta costantemente il percorso per garantirti il massimo risultato nel minor tempo possibile.",
    ],
    image: courseIndividual,
    price: "da 300",
    duration: "Modulare",
    gradient: "from-blue-500 to-indigo-600",
    accentBg: "bg-blue-50 dark:bg-blue-950/30",
    icon: UserCheck,
    showLingua: true,
    features: [
      "Docente madrelingua in sede",
      "Tutti i livelli QCER disponibili",
      "Programmi strutturati, progressivi e interattivi",
      "Materiale didattico personalizzato",
      "Orari flessibili",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "corso-blended",
    title: "Corso Individuale Blended",
    subtitle: "In sede + piattaforma online",
    description: "Il meglio dei due mondi: lezioni individuali in sede con docente madrelingua, integrate dalla piattaforma e-learning attiva 24/7 per uno studio continuo e autonomo tra una lezione e l'altra.",
    fullDescription: [
      "Il corso blended combina il contatto diretto con il docente madrelingua in aula con la flessibilità dello studio autonomo sulla piattaforma digitale. Ogni settimana avrai una lezione in sede focalizzata sulla produzione orale, la correzione personalizzata e il potenziamento delle competenze comunicative.",
      "Tra una lezione e l'altra, la piattaforma e-learning ti accompagna con un programma strutturato: esercizi interattivi, riconoscimento vocale per migliorare la pronuncia, video-lezioni e test di autovalutazione. Puoi studiare quando e dove vuoi, 24 ore su 24, 7 giorni su 7.",
      "Questo formato è particolarmente efficace per chi vuole massimizzare i risultati combinando pratica guidata e studio indipendente. Il docente monitora i tuoi progressi sia in aula che sulla piattaforma, adattando il percorso in tempo reale alle tue esigenze.",
    ],
    image: languageCoachingImage,
    price: "645",
    duration: "12 settimane",
    gradient: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: Monitor,
    showLingua: true,
    features: [
      "Docente madrelingua in sede",
      "1 incontro/settimana + piattaforma e-learning 24/7",
      "Tutti i livelli QCER disponibili",
      "Programmi strutturati, progressivi e interattivi",
      "Materiale didattico personalizzato",
      "Orari flessibili",
      "Certificato a fine corso",
      "Metodo Interlingua",
    ],
    highlight: null,
  },
  {
    id: "office",
    title: "Office senza segreti",
    subtitle: "Excel, Word, PowerPoint e Copilot",
    description: "Un corso pratico e diretto per padroneggiare gli strumenti Office che usi ogni giorno. Dalle formule di Excel alle presentazioni PowerPoint, fino alle funzionalità AI di Copilot per lavorare il doppio in metà tempo.",
    fullDescription: [
      "Il corso copre in modo approfondito l'intero ecosistema Microsoft Office: Excel per la gestione di dati, tabelle pivot, formule avanzate e grafici; Word per documenti professionali, formattazione avanzata e collaborazione; PowerPoint per presentazioni d'impatto con animazioni, template e design efficace.",
      "La grande novità è il modulo dedicato a Microsoft Copilot, l'assistente AI integrato in Office 365: imparerai a usarlo per generare testi, riassumere documenti, creare formule automaticamente, analizzare dati e produrre presentazioni in pochi minuti. Un vantaggio competitivo concreto per il tuo lavoro quotidiano.",
      "Le lezioni si svolgono in sede con un docente qualificato, in un formato pratico e interattivo dove impari facendo. Ogni partecipante lavora al proprio computer con esercitazioni guidate su casi reali. Al termine del corso ricevi un certificato di competenza.",
    ],
    image: courseExcel,
    price: "340",
    duration: "Corso completo",
    gradient: "from-sky-500 to-blue-600",
    accentBg: "bg-sky-50 dark:bg-sky-950/30",
    icon: Cpu,
    showLingua: false,
    features: [
      "Docente qualificato in sede",
      "1 incontro/settimana",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
  {
    id: "ai",
    title: "AI senza segreti",
    subtitle: "Creatività, produttività e soluzioni per tutti",
    description: "Scopri come l'Intelligenza Artificiale può diventare il tuo alleato quotidiano: dalla scrittura alla creatività, dall'analisi dei dati all'automazione. Un corso accessibile a tutti, anche senza competenze tecniche.",
    fullDescription: [
      "Il corso parte dalle basi per portarti a un utilizzo consapevole e produttivo degli strumenti AI più avanzati: ChatGPT, Claude, Gemini, DALL-E, Midjourney e molto altro. Imparerai a scrivere prompt efficaci, a generare testi professionali, a creare immagini e a risolvere problemi complessi con l'aiuto dell'intelligenza artificiale.",
      "Dalla redazione di email e report alla creazione di contenuti per i social media, dalla traduzione e revisione di documenti all'analisi e sintesi di informazioni complesse: ogni lezione ti fornisce competenze immediatamente applicabili nel lavoro e nella vita quotidiana.",
      "Non servono competenze tecniche pregresse. Il corso è pensato per professionisti, imprenditori, studenti e chiunque voglia restare al passo con la trasformazione digitale. Le lezioni in sede sono pratiche e interattive, con esercitazioni su casi reali e il supporto continuo del docente.",
    ],
    image: courseAi,
    price: "340",
    duration: "Corso completo",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50 dark:bg-amber-950/30",
    icon: Brain,
    showLingua: false,
    features: [
      "Docente qualificato in sede",
      "1 incontro/settimana",
      "Certificato a fine corso",
      "Metodo Interlingua",
      "Acquistabile con Carta Cultura Giovani",
    ],
    highlight: null,
  },
];

const stats = [
  { value: 30, suffix: "+", label: "Anni di esperienza", icon: Award },
  { value: 6, suffix: "", label: "Lingue disponibili", icon: Globe },
  { value: 95, suffix: "%", label: "Studenti soddisfatti", icon: Star },
  { value: 2, suffix: "", label: "Sedi nel Veneto", icon: MapPin },
];

const methodFeatures = [
  { icon: Users, title: "Piccoli Gruppi", desc: "Classi ridotte per garantire attenzione personalizzata e partecipazione attiva di ogni studente.", gradient: "from-violet-500 to-purple-600", bgLight: "bg-violet-50 dark:bg-violet-950/30" },
  { icon: Globe, title: "Docenti Madrelingua", desc: "Insegnanti qualificati, certificati e con esperienza nell'insegnamento a studenti italiani.", gradient: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: Shield, title: "Certificazione QCER", desc: "Attestato riconosciuto con il livello raggiunto secondo il Quadro Comune Europeo di Riferimento.", gradient: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50 dark:bg-emerald-950/30" },
  { icon: Monitor, title: "E-Learning 24/7", desc: "Piattaforma interattiva sempre disponibile per consolidare quanto appreso in aula.", gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50 dark:bg-amber-950/30" },
];

function CourseInfoForm({ courseTitle, showLingua, gradient }: { courseTitle: string; showLingua: boolean; gradient: string }) {
  const { toast } = useToast();
  const [sede, setSede] = useState("");
  const [lingua, setLingua] = useState("");
  const [livello, setLivello] = useState("");
  const [comeConosciuto, setComeConosciuto] = useState("");
  const [provincia, setProvincia] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (formData: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!formData.get("fname")) errs.fname = "Campo obbligatorio";
    if (!formData.get("lname")) errs.lname = "Campo obbligatorio";
    if (!formData.get("email")) errs.email = "Campo obbligatorio";
    if (!formData.get("city")) errs.city = "Campo obbligatorio";
    if (!provincia) errs.provincia = "Seleziona una provincia";
    if (!sede) errs.sede = "Seleziona una sede";
    if (!comeConosciuto) errs.comeConosciuto = "Seleziona un'opzione";
    if (showLingua && !lingua) errs.lingua = "Seleziona una lingua";
    if (showLingua && !livello) errs.livello = "Seleziona un livello";
    if (!gdpr) errs.gdpr = "Consenso obbligatorio";
    return errs;
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const parts = [
        `Corso: ${courseTitle}`,
        `Sede: ${sede}`,
        showLingua ? `Lingua: ${lingua}` : "",
        showLingua ? `Livello: ${livelloOptions.find(l => l.value === livello)?.label || livello}` : "",
        `Citta: ${formData.get("city")}`,
        `Provincia: ${provincia}`,
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
      toast({
        title: "Richiesta inviata",
        description: "Ti contatteremo al più presto con tutte le informazioni.",
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
          <Input id="fname" name="fname" placeholder="Il tuo nome" className={submitted && errors.fname ? "border-destructive" : ""} data-testid="input-fip-fname" />
          {submitted && errors.fname && <p className="text-xs text-destructive">{errors.fname}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lname" className="text-sm font-medium">Cognome *</Label>
          <Input id="lname" name="lname" placeholder="Il tuo cognome" className={submitted && errors.lname ? "border-destructive" : ""} data-testid="input-fip-lname" />
          {submitted && errors.lname && <p className="text-xs text-destructive">{errors.lname}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="La tua email" className={submitted && errors.email ? "border-destructive" : ""} data-testid="input-fip-email" />
          {submitted && errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">Telefono</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Numero di telefono" data-testid="input-fip-phone" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium">Citta *</Label>
          <Input id="city" name="city" placeholder="La tua citta" className={submitted && errors.city ? "border-destructive" : ""} data-testid="input-fip-city" />
          {submitted && errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="select-provincia" className="text-sm font-medium">Provincia *</Label>
          <Select value={provincia} onValueChange={(v) => { setProvincia(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.provincia; return n; }); }}>
            <SelectTrigger id="select-provincia" className={submitted && errors.provincia ? "border-destructive" : ""} data-testid="select-fip-provincia">
              <SelectValue placeholder="Seleziona provincia" />
            </SelectTrigger>
            <SelectContent>
              {province.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="select-sede" className="text-sm font-medium">Sede preferita *</Label>
          <Select value={sede} onValueChange={(v) => { setSede(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.sede; return n; }); }}>
            <SelectTrigger id="select-sede" className={submitted && errors.sede ? "border-destructive" : ""} data-testid="select-fip-sede">
              <SelectValue placeholder="Seleziona sede" />
            </SelectTrigger>
            <SelectContent>
              {sedeOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && errors.sede && <p className="text-xs text-destructive">{errors.sede}</p>}
        </div>
        {showLingua ? (
          <div className="space-y-1.5">
            <Label htmlFor="select-lingua" className="text-sm font-medium">Lingua *</Label>
            <Select value={lingua} onValueChange={(v) => { setLingua(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.lingua; return n; }); }}>
              <SelectTrigger id="select-lingua" className={submitted && errors.lingua ? "border-destructive" : ""} data-testid="select-fip-lingua">
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
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="select-come" className="text-sm font-medium">Come ci hai conosciuto *</Label>
            <Select value={comeConosciuto} onValueChange={(v) => { setComeConosciuto(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.comeConosciuto; return n; }); }}>
              <SelectTrigger id="select-come" className={submitted && errors.comeConosciuto ? "border-destructive" : ""} data-testid="select-fip-come">
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
        )}
      </div>
      {showLingua && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="select-livello" className="text-sm font-medium">Livello *</Label>
            <Select value={livello} onValueChange={(v) => { setLivello(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.livello; return n; }); }}>
              <SelectTrigger id="select-livello" className={submitted && errors.livello ? "border-destructive" : ""} data-testid="select-fip-livello">
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
          <div className="space-y-1.5">
            <Label htmlFor="select-come2" className="text-sm font-medium">Come ci hai conosciuto *</Label>
            <Select value={comeConosciuto} onValueChange={(v) => { setComeConosciuto(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.comeConosciuto; return n; }); }}>
              <SelectTrigger id="select-come2" className={submitted && errors.comeConosciuto ? "border-destructive" : ""} data-testid="select-fip-come2">
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
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium">Richieste o domande</Label>
        <Textarea id="message" name="message" rows={3} placeholder="Scrivi qui le tue domande o richieste specifiche..." data-testid="textarea-fip-message" />
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="newsletter"
            checked={newsletter}
            onCheckedChange={(v) => setNewsletter(v === true)}
            data-testid="checkbox-fip-newsletter"
          />
          <Label htmlFor="newsletter" className="text-sm text-muted-foreground leading-snug cursor-pointer">
            Iscriviti alla nostra Newsletter per ricevere aggiornamenti su corsi e promozioni
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="gdpr"
            checked={gdpr}
            onCheckedChange={(v) => { setGdpr(v === true); if (submitted) setErrors(prev => { const n = {...prev}; delete n.gdpr; return n; }); }}
            data-testid="checkbox-fip-gdpr"
          />
          <Label htmlFor="gdpr" className={`text-sm leading-snug cursor-pointer ${submitted && errors.gdpr ? "text-destructive" : "text-muted-foreground"}`}>
            Acconsento al trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679) *
          </Label>
        </div>
        {submitted && errors.gdpr && <p className="text-xs text-destructive ml-7">{errors.gdpr}</p>}
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className={`w-full h-12 text-base rounded-xl bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-bold shadow-lg`}
        data-testid="button-fip-submit"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Invio in corso...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Invia Richiesta
          </>
        )}
      </Button>
    </form>
  );
}

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <Card
        className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card"
        data-testid={`card-fip-course-${course.id}`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${course.gradient}`} />
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]">
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
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
                data-testid={`button-fip-details-${course.id}`}
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
                  data-testid={`button-fip-toggle-form-${course.id}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Richiedi Informazioni
                  {formOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
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
                <div className={`border-t border-border/50 ${course.accentBg}`}>
                  <div className="max-w-3xl mx-auto">
                    <CourseInfoForm courseTitle={course.title} showLingua={course.showLingua} gradient={course.gradient} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export default function FormazioneInPresenzaPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main>
        <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-blue-400 top-[-200px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-indigo-500 bottom-[-150px] left-[-100px] animation-delay-2000" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-cyan-400 top-[30%] left-[60%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm" data-testid="badge-fip-label">
                    <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                    Corsi in Sede a Vicenza e Thiene
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
                  data-testid="text-fip-title"
                >
                  Formazione
                  <br />
                  <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    in Presenza
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-xl text-white/85 mb-4 leading-relaxed max-w-xl"
                >
                  Lingue, competenze digitali e crescita professionale. Corsi strutturati con docenti qualificati, certificati e riconosciuti.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl"
                >
                  Iscrizione gratuita e test di livello incluso. Nuovi corsi in partenza da febbraio 2026.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="flex flex-wrap gap-4 mb-10"
                >
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Sedi</p>
                      <p className="font-bold text-white">Vicenza e Thiene</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <Calendar className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Prossimi corsi</p>
                      <p className="font-bold text-white">Febbraio 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <CreditCard className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Pagamento</p>
                      <p className="font-bold text-white">Carta Cultura Giovani</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button
                    size="lg"
                    className="h-14 px-10 text-base rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-bold"
                    onClick={() => document.querySelector("#courses-section")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid="button-fip-cta"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Scopri i Corsi
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => document.querySelector("#contact-section")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid="button-fip-contact"
                  >
                    Contattaci
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
                  <img
                    src={categoryPresence}
                    alt="Formazione in presenza"
                    className="w-full h-[480px] object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -left-6 fi-glass-card rounded-2xl p-5 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">6 Lingue</p>
                      <p className="text-xs text-muted-foreground">Tutti i livelli QCER</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 fi-glass-card rounded-2xl p-5 shadow-xl animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Certificati</p>
                      <p className="text-xs text-muted-foreground">Riconosciuti QCER</p>
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
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-primary" />
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
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary tracking-wide">Catalogo Corsi</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fip-catalog-title">
                  I Nostri Corsi
                  <span className="gradient-text"> in Sede</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Tutti i corsi si svolgono presso le nostre sedi di Vicenza e Thiene, con docenti madrelingua o qualificati, in piccoli gruppi per garantire la massima efficacia.
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
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/3 blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary tracking-wide">Il Nostro Approccio</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fip-why-title">
                  Il Metodo
                  <span className="gradient-text"> Interlingua</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Un approccio consolidato in oltre 30 anni di attività, che unisce rigore accademico e dinamicità.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {methodFeatures.map((item, i) => (
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
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary tracking-wide">Scopri di Più</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
                  Esplora Anche i Nostri
                  <span className="gradient-text"> Percorsi Intensivi</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                  Per chi cerca un'esperienza ancora più immersiva e trasformativa.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <Link href="/full-immersion">
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full" data-testid="link-fip-immersion">
                      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Full Immersion Workshop</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">Un livello QCER in una settimana. 30+ ore frontali con team di coach madrelingua.</p>
                        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                          Scopri di più <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/speakers-corner">
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full" data-testid="link-fip-speakers">
                      <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Speaker's Corner</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">Pratica la conversazione in inglese ogni venerdi con docenti madrelingua.</p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-cyan-400 top-[-200px] right-[-150px]" />
          <div className="fi-hero-orb w-[500px] h-[500px] bg-blue-500 bottom-[-200px] left-[-150px]" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-indigo-400 top-[40%] right-[20%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-bold text-white/90 tracking-wide">Iscrizioni Aperte</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight tracking-tight" data-testid="text-fip-cta-title">
                  Inizia il Tuo
                  <br />
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    Percorso Formativo
                  </span>
                </h2>
                <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Contattaci per informazioni su date, livelli disponibili e prezzi. Ti aiutiamo a trovare il corso perfetto per i tuoi obiettivi.
                </p>
                <p className="text-lg text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Iscrizione gratuita e test di livello incluso per i corsi di lingua.
                </p>
                <div className="flex flex-wrap justify-center gap-5">
                  <Button
                    size="lg"
                    className="h-16 px-10 text-lg rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-bold"
                    asChild
                    data-testid="button-fip-call"
                  >
                    <a href="tel:+390444321601">
                      <Phone className="w-5 h-5 mr-2" />
                      Chiama: 0444 321601
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-10 text-lg rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm font-medium"
                    asChild
                    data-testid="button-fip-email"
                  >
                    <a href="mailto:info@interlingua.it">
                      <Mail className="w-5 h-5 mr-2" />
                      info@interlingua.it
                    </a>
                  </Button>
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
