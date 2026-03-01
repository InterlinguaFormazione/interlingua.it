import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CourseReviewsInline } from "@/components/product-reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Compass,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Award,
  Sparkles,
  BookOpen,
  Phone,
  Mail,
  Globe,
  Heart,
  GraduationCap,
  UserCheck,
  Mic,
  Brain,
  Shield,
  Zap,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Quote,
  Users,
  Lightbulb,
  Eye,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import languageCoachingImage from "@assets/Language_Coaching_1772143397641.webp";
import courseIndividual from "@/assets/images/course-individual.jpg";
import courseConversation from "@/assets/images/course-conversation.jpg";
import categorySoftSkills from "@/assets/images/category-soft-skills.jpg";
import categoryOnline from "@/assets/images/category-online.jpg";

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReduced = usePrefersReducedMotion();
  if (prefersReduced) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 1.8 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
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

const coachingPillars = [
  {
    title: "Ascolto Profondo",
    description: "Il tuo coach non insegna: ascolta. Ascolta le tue parole, i tuoi silenzi, le tue esitazioni. E in quello spazio tra ciò che dici e ciò che vorresti dire, nasce la trasformazione. Ogni sessione parte da te, dai tuoi obiettivi reali, dalle situazioni concrete che affronti ogni giorno.",
    icon: Headphones,
    gradient: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    title: "Consapevolezza Linguistica",
    description: "Forse hai già notato come certe parole ti vengano naturali mentre altre sembrano sfuggirti. Il coaching linguistico lavora esattamente lì: nello spazio tra ciò che sai e ciò che ancora non sai di sapere. Scoprirai risorse che avevi già dentro di te, pronte per emergere.",
    icon: Eye,
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    title: "Pratica Trasformativa",
    description: "Non si tratta di ripetere frasi o memorizzare regole. Si tratta di vivere la lingua in modo autentico, di sentirla diventare parte di te. Ogni conversazione con il tuo coach è un passo verso quella naturalezza che, nel profondo, sai già di poter raggiungere.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    title: "Risultati Misurabili",
    description: "Man mano che procedi, qualcosa cambia. Non solo nel modo in cui parli, ma nel modo in cui ti senti quando parli. La sicurezza cresce, le parole fluiscono, e le persone intorno a te iniziano a notare la differenza. I progressi vengono documentati e celebrati ad ogni tappa.",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

const differentiators = [
  {
    title: "Non è un corso. È un percorso.",
    description: "Un corso ti dà informazioni. Il coaching ti dà trasformazione. Il tuo language coach costruisce ogni singola sessione intorno a te: i tuoi blocchi, i tuoi obiettivi, il tuo modo unico di apprendere. Perché ogni persona impara in modo diverso, e tu meriti un approccio che riconosca e valorizzi il tuo.",
    icon: Compass,
  },
  {
    title: "Il coach vede ciò che tu non vedi ancora",
    description: "Un insegnante corregge i tuoi errori. Un coach vede i tuoi schemi, le tue potenzialità nascoste, le abitudini linguistiche che ti frenano senza che tu te ne accorga. E ti guida, con delicatezza e precisione, verso una padronanza della lingua che va oltre la grammatica.",
    icon: Eye,
  },
  {
    title: "Fluency non è velocità. È libertà.",
    description: "Parlare fluentemente non significa parlare velocemente. Significa sentirsi liberi di esprimersi, di scherzare, di convincere, di emozionare in un'altra lingua. È quella sensazione di poter essere pienamente te stesso anche quando le parole non sono le tue. E quella sensazione, una volta raggiunta, non la perdi più.",
    icon: Heart,
  },
  {
    title: "Il tuo tempo ha valore",
    description: "Chi sceglie il coaching ha capito una cosa fondamentale: il proprio tempo è prezioso. Non puoi permetterti mesi di lezioni generiche. Hai bisogno di risultati concreti, misurabili, in tempi definiti. Il coaching linguistico è progettato esattamente per questo: il massimo impatto nel minor tempo possibile.",
    icon: Clock,
  },
];

const packages = [
  {
    id: "coaching-presenza",
    reviewSlug: "coaching-in-sede",
    title: "Coaching Individuale in Sede",
    subtitle: "Il percorso più profondo e trasformativo",
    description: "Sessioni one-to-one nella nostra sede, dove ogni dettaglio è pensato per facilitare il tuo apprendimento. Il contatto diretto con il coach crea una connessione unica che accelera i risultati in modi che potresti non aver immaginato possibili.",
    fullDescription: [
      "Il coaching in sede è l'esperienza più completa e immersiva che possiamo offrirti. Nella quiete del nostro studio, lontano dalle distrazioni quotidiane, tu e il tuo coach create uno spazio dedicato interamente alla tua crescita linguistica.",
      "Ogni sessione è un viaggio su misura: il coach osserva il tuo linguaggio corporeo, coglie le micro-esitazioni, adatta l'approccio in tempo reale. È il tipo di attenzione che solo la presenza fisica può garantire, e che fa la differenza tra un buon risultato e un risultato straordinario.",
      "Il percorso include una valutazione approfondita iniziale, obiettivi chiari e misurabili, materiale personalizzato e un piano di azione tra una sessione e l'altra per mantenere il momentum. Sedi disponibili: Vicenza e Thiene.",
    ],
    image: courseIndividual,
    price: "390",
    duration: "Modulare",
    gradient: "from-indigo-500 to-blue-600",
    accentBg: "bg-indigo-50 dark:bg-indigo-950/30",
    icon: UserCheck,
    features: [
      "Coach madrelingua dedicato",
      "Sessioni in sede a Vicenza o Thiene",
      "Programma 100% personalizzato",
      "Valutazione iniziale approfondita",
      "Piano d'azione tra le sessioni",
      "Materiale didattico su misura",
      "Certificato di competenza",
      "Report progressi periodico",
    ],
    highlight: "Disponibile per inglese, francese, tedesco, spagnolo, russo e italiano",
  },
  {
    id: "coaching-blended",
    reviewSlug: "coaching-blended",
    title: "Coaching Blended: Presenza + Online",
    subtitle: "Il meglio dei due mondi, quando ne hai bisogno",
    description: "Un percorso che combina la profondità delle sessioni in sede con la continuità della piattaforma digitale. Tra una sessione e l'altra, la lingua continua a crescere dentro di te grazie a strumenti progettati per mantenere vivo ogni progresso.",
    fullDescription: [
      "Il formato blended nasce dalla consapevolezza che la trasformazione linguistica non avviene solo durante le sessioni: avviene ogni giorno, in ogni momento in cui ti esponi alla lingua. Per questo il coaching in sede è integrato dalla piattaforma e-learning attiva 24/7.",
      "Le sessioni settimanali con il tuo coach sono il cuore del percorso: analisi, pratica, feedback, nuove sfide. Ma tra un incontro e l'altro, la piattaforma ti accompagna con esercizi calibrati sul tuo livello, riconoscimento vocale AI per la pronuncia, e una community internazionale di milioni di studenti.",
      "È il formato ideale per chi vuole risultati profondi e duraturi, massimizzando ogni ora investita. Il coach monitora i tuoi progressi sia in aula che online, creando un ciclo virtuoso di apprendimento che non si ferma mai.",
    ],
    image: categorySoftSkills,
    price: "840",
    duration: "12 settimane",
    gradient: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    icon: Brain,
    features: [
      "Coach madrelingua dedicato in sede",
      "Piattaforma e-learning 24/7 con AI",
      "Riconoscimento vocale avanzato",
      "Sessione settimanale + studio autonomo",
      "Community internazionale",
      "Monitoraggio progressi integrato",
      "Certificato CEFR a fine percorso",
      "Durata 12 settimane intensive",
    ],
    highlight: null,
  },
  {
    id: "coaching-online",
    reviewSlug: "coaching-online",
    title: "Coaching Individuale Online",
    subtitle: "La stessa profondità, ovunque tu sia",
    description: "Per chi sa che la distanza non è un ostacolo quando la connessione è autentica. Le sessioni via Zoom mantengono tutta l'intensità e la personalizzazione del coaching in presenza, con la flessibilità di poter lavorare da qualsiasi luogo.",
    fullDescription: [
      "Il coaching online non è una versione 'ridotta' del coaching in presenza. È un'esperienza completa, pensata per professionisti che viaggiano, imprenditori con agende fitte, o semplicemente per chi preferisce la comodità del proprio spazio.",
      "12 sessioni individuali su Zoom con il tuo coach madrelingua dedicato: un rapporto uno a uno che si costruisce nel tempo, sessione dopo sessione. Il programma viene creato intorno ai tuoi obiettivi reali e adattato continuamente in base ai tuoi progressi.",
      "Orari completamente flessibili con prenotazione tramite app. Materiale personalizzato condiviso in tempo reale. Report di progresso dettagliato. Tutto quello che ti serve per trasformare il tuo rapporto con la lingua, senza muoverti da dove sei.",
    ],
    image: categoryOnline,
    price: "300",
    duration: "12 sessioni",
    gradient: "from-teal-500 to-cyan-600",
    accentBg: "bg-teal-50 dark:bg-teal-950/30",
    icon: Globe,
    features: [
      "Coach madrelingua dedicato",
      "12 sessioni individuali su Zoom",
      "Orari flessibili, prenotazione via app",
      "Programma interamente personalizzato",
      "Materiale condiviso in tempo reale",
      "Report di progresso dettagliato",
      "Certificato di competenza",
      "Disponibile per 7 lingue",
    ],
    highlight: null,
  },
  {
    id: "coaching-fluency",
    reviewSlug: "fluency-coaching",
    title: "Fluency Coaching Intensivo",
    subtitle: "Per chi vuole sbloccarsi, una volta per tutte",
    description: "Cinque sessioni intensive focalizzate sulla scioltezza orale. Se sai la grammatica ma le parole non escono, se capisci tutto ma fatichi a rispondere, questo è il percorso che ti porta dall'altra parte. Quello che manca non è la conoscenza: è la fiducia. E la fiducia si costruisce.",
    fullDescription: [
      "Il Fluency Coaching è progettato per chi ha già una base solida ma si sente bloccato. Conosci le regole, capisci quando gli altri parlano, ma quando tocca a te le parole sembrano evaporare. Non è un problema di competenza: è un pattern che il coaching sa come trasformare.",
      "In 5 sessioni intensive di 30 minuti, il tuo coach lavora esclusivamente sulla tua produzione orale: dialoghi autentici, simulazioni di situazioni reali, tecniche per superare l'esitazione e costruire quella naturalezza che ti permette di esprimerti senza pensarci troppo.",
      "Metodologia Task-Based Learning e CLIL con focus totale sulla comunicazione. Feedback immediato, strategie personalizzate per la pronuncia, espansione del vocabolario attivo. Livello minimo richiesto: B1.",
    ],
    image: courseConversation,
    price: "125",
    duration: "5 sessioni da 30 min",
    gradient: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-50 dark:bg-amber-950/30",
    icon: Mic,
    features: [
      "Coach madrelingua dedicato",
      "5 sessioni intensive via Zoom",
      "Focus esclusivo su fluency",
      "Simulazioni di scenari reali",
      "Feedback personalizzato immediato",
      "Tecniche anti-blocco linguistico",
      "Strategie per la pronuncia",
      "Livello minimo: B1",
    ],
    highlight: null,
  },
];

const testimonials = [
  { text: "Non avrei mai pensato di poter fare una presentazione in inglese davanti a 200 persone. Dopo il coaching, l'ho fatto e mi sono persino divertito.", author: "Marco R., Direttore Commerciale" },
  { text: "Il mio coach ha capito subito dove stava il blocco. In tre mesi ho ottenuto risultati che non avevo raggiunto in anni di corsi tradizionali.", author: "Elena B., Project Manager" },
  { text: "La differenza tra un corso e il coaching è come la differenza tra leggere una mappa e avere qualcuno che cammina con te.", author: "Andrea M., Imprenditore" },
  { text: "Mi sentivo bloccata ogni volta che dovevo parlare al telefono con clienti stranieri. Ora lo faccio con naturalezza, quasi senza accorgermene.", author: "Giulia F., Export Manager" },
  { text: "Pensavo che il mio inglese fosse 'abbastanza buono'. Il coaching mi ha mostrato quanto spazio c'era ancora per crescere, e come arrivarci.", author: "Luca T., CEO" },
  { text: "Avevo provato tutto: corsi di gruppo, app, viaggi all'estero. Il coaching è stata l'unica cosa che ha davvero cambiato il mio rapporto con la lingua.", author: "Chiara D., Avvocato" },
];

const stats = [
  { value: 30, suffix: "+", label: "Anni di esperienza", icon: Award },
  { value: 98, suffix: "%", label: "Clienti soddisfatti", icon: Star },
  { value: 7, suffix: "", label: "Lingue disponibili", icon: Globe },
  { value: 3, suffix: "x", label: "Più veloce dei corsi tradizionali", icon: Zap },
];

const provinceOptions = [
  "Agrigento","Alessandria","Ancona","Aosta","L'Aquila","Arezzo","Ascoli Piceno","Asti","Avellino",
  "Bari","Barletta-Andria-Trani","Belluno","Benevento","Bergamo","Biella","Bologna","Bolzano","Brescia","Brindisi",
  "Cagliari","Caltanissetta","Campobasso","Caserta","Catania","Catanzaro","Chieti","Como","Cosenza","Cremona","Crotone","Cuneo",
  "Enna","Fermo","Ferrara","Firenze","Foggia","Forlì-Cesena","Frosinone",
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

const linguaOptions = ["Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Italiano per stranieri", "Portoghese"];
const livelloOptions = [
  { value: "principiante", label: "Principiante (A1-A2)" },
  { value: "intermedio", label: "Intermedio (B1-B2)" },
  { value: "avanzato", label: "Avanzato (C1-C2)" },
  { value: "non-so", label: "Non sono sicuro/a" },
];
const comeConosciutoOptions = ["Google", "Social Media", "Passaparola", "Già cliente Interlingua", "Evento/Fiera", "Altro"];

function CoachingContactForm({ packageTitle, gradient }: { packageTitle: string; gradient: string }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lingua, setLingua] = useState("");
  const [livello, setLivello] = useState("");
  const [provincia, setProvincia] = useState("");
  const [comeConosciuto, setComeConosciuto] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const parts = [
        `Lingua: ${lingua}`,
        `Livello: ${livello}`,
        `Provincia: ${provincia}`,
        formData.get("azienda") ? `Azienda: ${formData.get("azienda")}` : "",
        `Come conosciuto: ${comeConosciuto}`,
        newsletter ? "Newsletter: Si" : "",
        formData.get("message") ? `\n${formData.get("message")}` : "",
      ].filter(Boolean);

      const body = {
        name: `${formData.get("nome")} ${formData.get("cognome")}`,
        email: formData.get("email") as string,
        phone: (formData.get("telefono") as string) || undefined,
        courseInterest: `Language Coaching: ${packageTitle}`,
        message: parts.join("\n"),
      };

      await apiRequest("POST", "/api/contact", body);
    },
    onSuccess: () => {
      toast({ title: "Richiesta inviata", description: "Ti contatteremo al più presto con tutte le informazioni." });
      setSuccess(true);
    },
    onError: () => {
      toast({ title: "Errore", description: "Si è verificato un errore. Riprova più tardi.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const fd = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};
    if (!fd.get("nome")) newErrors.nome = "Campo obbligatorio";
    if (!fd.get("cognome")) newErrors.cognome = "Campo obbligatorio";
    const email = fd.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email non valida";
    if (!fd.get("telefono")) newErrors.telefono = "Campo obbligatorio";
    if (!lingua) newErrors.lingua = "Seleziona una lingua";
    if (!livello) newErrors.livello = "Seleziona un livello";
    if (!provincia) newErrors.provincia = "Seleziona la provincia";
    if (!comeConosciuto) newErrors.comeConosciuto = "Campo obbligatorio";
    if (!gdpr) newErrors.gdpr = "Devi accettare il trattamento dei dati";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    mutation.mutate(fd);
  };

  if (success) {
    return (
      <div className="p-10 text-center">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-bold mb-2">Richiesta inviata</h4>
        <p className="text-muted-foreground max-w-md mx-auto">Il tuo percorso di coaching sta per iniziare. Ti contatteremo entro 24 ore per definire il tuo percorso personalizzato.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-5" data-testid={`form-coaching-${packageTitle}`}>
      <div className="text-center mb-2">
        <h4 className="text-lg font-bold">Inizia il tuo percorso di coaching</h4>
        <p className="text-sm text-muted-foreground">Compila il form e ti contatteremo per costruire il tuo percorso</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="nome" className="text-sm font-medium">Nome *</Label>
          <Input id="nome" name="nome" placeholder="Il tuo nome" className={submitted && errors.nome ? "border-destructive" : ""} data-testid="input-coaching-nome" />
          {submitted && errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cognome" className="text-sm font-medium">Cognome *</Label>
          <Input id="cognome" name="cognome" placeholder="Il tuo cognome" className={submitted && errors.cognome ? "border-destructive" : ""} data-testid="input-coaching-cognome" />
          {submitted && errors.cognome && <p className="text-xs text-destructive">{errors.cognome}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="la.tua@email.com" className={submitted && errors.email ? "border-destructive" : ""} data-testid="input-coaching-email" />
          {submitted && errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefono" className="text-sm font-medium">Telefono *</Label>
          <Input id="telefono" name="telefono" type="tel" placeholder="+39 ..." className={submitted && errors.telefono ? "border-destructive" : ""} data-testid="input-coaching-telefono" />
          {submitted && errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="azienda" className="text-sm font-medium">Azienda (opzionale)</Label>
        <Input id="azienda" name="azienda" placeholder="La tua azienda" data-testid="input-coaching-azienda" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Lingua *</Label>
          <Select value={lingua} onValueChange={(v) => { setLingua(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.lingua; return n; }); }}>
            <SelectTrigger className={submitted && errors.lingua ? "border-destructive" : ""} data-testid="select-coaching-lingua">
              <SelectValue placeholder="Seleziona" />
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
          <Label className="text-sm font-medium">Livello attuale *</Label>
          <Select value={livello} onValueChange={(v) => { setLivello(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.livello; return n; }); }}>
            <SelectTrigger className={submitted && errors.livello ? "border-destructive" : ""} data-testid="select-coaching-livello">
              <SelectValue placeholder="Seleziona" />
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
          <Label className="text-sm font-medium">Provincia *</Label>
          <Select value={provincia} onValueChange={(v) => { setProvincia(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.provincia; return n; }); }}>
            <SelectTrigger className={submitted && errors.provincia ? "border-destructive" : ""} data-testid="select-coaching-provincia">
              <SelectValue placeholder="Seleziona" />
            </SelectTrigger>
            <SelectContent>
              {provinceOptions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Come ci hai conosciuto *</Label>
        <Select value={comeConosciuto} onValueChange={(v) => { setComeConosciuto(v); if (submitted) setErrors(prev => { const n = {...prev}; delete n.comeConosciuto; return n; }); }}>
          <SelectTrigger className={submitted && errors.comeConosciuto ? "border-destructive" : ""} data-testid="select-coaching-come">
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
        <Label htmlFor="message" className="text-sm font-medium">I tuoi obiettivi o domande</Label>
        <Textarea id="message" name="message" rows={3} placeholder="Raccontaci i tuoi obiettivi, le situazioni in cui usi la lingua, cosa vorresti migliorare..." data-testid="textarea-coaching-message" />
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(v) => setNewsletter(v === true)} data-testid="checkbox-coaching-newsletter" />
          <Label htmlFor="newsletter" className="text-sm text-muted-foreground leading-snug cursor-pointer">Ricevi aggiornamenti su coaching, eventi e promozioni</Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox id="gdpr" checked={gdpr} onCheckedChange={(v) => { setGdpr(v === true); if (submitted) setErrors(prev => { const n = {...prev}; delete n.gdpr; return n; }); }} data-testid="checkbox-coaching-gdpr" />
          <Label htmlFor="gdpr" className={`text-sm leading-snug cursor-pointer ${submitted && errors.gdpr ? "text-destructive" : "text-muted-foreground"}`}>Acconsento al trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679) *</Label>
        </div>
        {submitted && errors.gdpr && <p className="text-xs text-destructive ml-7">{errors.gdpr}</p>}
      </div>
      <Button type="submit" disabled={mutation.isPending} className={`w-full h-12 text-base rounded-xl bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-bold shadow-lg`} data-testid="button-coaching-submit">
        {mutation.isPending ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio in corso...</>) : (<><Send className="w-4 h-4 mr-2" />Richiedi Informazioni</>)}
      </Button>
    </form>
  );
}

function PackageCard({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <Card id={pkg.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card scroll-mt-24" data-testid={`card-coaching-${pkg.id}`}>
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${pkg.gradient}`} />
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]">
            <div className="relative h-64 md:h-full overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card/30" />
              <div className="absolute top-5 left-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center shadow-xl ring-4 ring-white/20`}>
                  <pkg.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <Badge className="bg-white/95 dark:bg-black/70 text-foreground border-0 backdrop-blur-md px-4 py-2 text-sm font-bold shadow-lg">
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  {pkg.price} euro
                </Badge>
                <Badge variant="secondary" className="bg-white/95 dark:bg-black/70 border-0 backdrop-blur-md px-3 py-2 text-xs font-medium shadow-lg">
                  <Clock className="w-3 h-3 mr-1" />
                  {pkg.duration}
                </Badge>
              </div>
            </div>
            <div className="p-7 md:p-8 lg:p-10">
              <div className="mb-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1.5 tracking-tight">{pkg.title}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>{pkg.subtitle}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">{pkg.description}</p>
              <button
                type="button"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className={`inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors ${detailsOpen ? "text-muted-foreground" : "text-primary hover:text-primary/80"}`}
                data-testid={`button-coaching-details-${pkg.id}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {detailsOpen ? "Chiudi dettagli" : "Scopri di più"}
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
                    <div className={`rounded-xl p-5 mb-5 ${pkg.accentBg} border border-border/30`}>
                      <div className="space-y-3">
                        {pkg.fullDescription.map((paragraph, i) => (
                          <p key={i} className="text-sm text-foreground/80 leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {pkg.highlight && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{pkg.highlight}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${pkg.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-foreground leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 pt-6 border-t border-border/50">
                <Button
                  size="lg"
                  className={`rounded-xl ${!formOpen ? `bg-gradient-to-r ${pkg.gradient} hover:opacity-90 text-white shadow-lg` : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                  onClick={() => setFormOpen(!formOpen)}
                  data-testid={`button-coaching-toggle-form-${pkg.id}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Richiedi Informazioni
                  {formOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
              </div>
              {pkg.reviewSlug && (
                <CourseReviewsInline productSlug={pkg.reviewSlug} />
              )}
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
                <div className={`border-t border-border/50 ${pkg.accentBg}`}>
                  <div className="max-w-3xl mx-auto">
                    <CoachingContactForm packageTitle={pkg.title} gradient={pkg.gradient} />
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

export default function LanguageCoachingPage() {
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
      <Navigation />
      <main>
        <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-violet-900 to-purple-950 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-indigo-400 top-[-200px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-violet-500 bottom-[-150px] left-[-100px] animation-delay-2000" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-blue-400 top-[30%] left-[60%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-6 px-5 py-2 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Percorsi Esclusivi 1-to-1
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
              >
                Language{" "}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Coaching
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg sm:text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed"
              >
                Non un corso di lingua. Un percorso di trasformazione che cambia il modo in cui comunichi, pensi e ti presenti al mondo.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed italic"
              >
                Forse sai già che c'è una differenza tra conoscere una lingua e padroneggiarla davvero. Il coaching ti porta dall'altra parte.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-white/90 text-base px-8 py-6 rounded-xl font-bold shadow-2xl shadow-black/20"
                  onClick={() => document.querySelector("#packages")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="button-coaching-discover"
                >
                  Scopri i Percorsi
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-6 rounded-xl"
                  onClick={() => document.querySelector("#philosophy")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="button-coaching-philosophy"
                >
                  <Heart className="mr-2 w-5 h-5" />
                  La Nostra Filosofia
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-8 left-0 right-0"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {[
                  { icon: Shield, text: "Coach certificati madrelingua" },
                  { icon: Target, text: "Percorsi 100% personalizzati" },
                  { icon: Lightbulb, text: "Percorso su misura per te" },
                ].map((item, i) => (
                  <div key={i} className="fi-glass-card px-4 py-2.5 rounded-full flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-amber-300" />
                    <span className="text-sm text-white/90 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center py-4">
                    <Icon className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="philosophy" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-4">
                  <Compass className="w-3 h-3 mr-1" />
                  La Nostra Filosofia
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                  Perché il coaching è{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">diverso da tutto il resto</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  C'è un momento nella vita di ogni professionista in cui la lingua smette di essere qualcosa che 'studi' e diventa qualcosa che 'sei'. Il language coaching è quel momento.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {differentiators.map((diff, i) => {
                const Icon = diff.icon;
                return (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow duration-300">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{diff.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{diff.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-4">
                  <Heart className="w-3 h-3 mr-1" />
                  I 4 Pilastri
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                  Come funziona il{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Language Coaching</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Ogni percorso di coaching si fonda su quattro elementi che, insieme, creano le condizioni per un cambiamento profondo e duraturo.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coachingPillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <Card className={`h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 ${pillar.bgLight}`}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{pillar.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-950 relative overflow-hidden">
          <div className="fi-hero-orb w-[400px] h-[400px] bg-indigo-400 top-[-100px] right-[-80px] opacity-30" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-violet-500 bottom-[-100px] left-[-60px] opacity-20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center mb-14">
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-4">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Storie di Trasformazione
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  Chi lo ha vissuto, lo racconta
                </h2>
                <p className="text-lg text-white/60 max-w-2xl mx-auto">
                  Ogni percorso di coaching è unico. Ma c'è un filo comune: il momento in cui smetti di tradurre e inizi a pensare nella nuova lingua.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((t, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="fi-glass-card rounded-2xl p-6 h-full flex flex-col">
                    <Quote className="w-8 h-8 text-amber-300/60 mb-3 flex-shrink-0" />
                    <p className="text-white/85 leading-relaxed text-sm flex-1 italic">"{t.text}"</p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-amber-300 font-semibold text-sm">{t.author}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-14">
                <Badge variant="secondary" className="mb-4">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  I Percorsi di Coaching
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                  Scegli il percorso che{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">parla di te</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Non esiste un percorso 'migliore' in assoluto. Esiste quello giusto per te, in questo momento della tua vita. E forse sai già quale ti sta chiamando.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-8 max-w-6xl mx-auto">
              {packages.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Il primo passo è già stato fatto
                </h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
                  Il fatto che tu sia arrivato fin qui dice qualcosa di importante su di te. Dice che sei pronto per un livello diverso. Che non ti accontenti di 'cavartela'. Che vuoi padroneggiare la lingua con la stessa sicurezza con cui padroneggi il tuo lavoro.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  Contattaci per scoprire il percorso più adatto a te: ti aiuteremo a capire dove sei, dove vuoi arrivare, e come raggiungerlo nel modo più naturale ed efficace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white text-base px-8 py-6 rounded-xl font-bold shadow-xl"
                    onClick={() => document.querySelector("#packages")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid="button-coaching-cta-bottom"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Richiedi Informazioni
                  </Button>
                  <Link href="/formazione-in-presenza">
                    <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl" data-testid="button-coaching-corsi">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Scopri i Corsi Tradizionali
                    </Button>
                  </Link>
                  <Link href="/test-di-livello">
                    <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950" data-testid="button-coaching-test">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Fai il Test di Livello
                    </Button>
                  </Link>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  Oppure chiamaci al <a href="tel:+390444321601" className="text-primary hover:underline font-medium">0444 321601</a> per parlare direttamente con noi
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}