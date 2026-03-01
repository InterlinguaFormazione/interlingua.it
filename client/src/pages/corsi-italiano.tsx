import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CourseReviewsInline } from "@/components/product-reviews";
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
  MapPin,
  Send,
  Loader2,
  GraduationCap,
  Heart,
  Landmark,
  Palette,
  Sun,
  Coffee,
  Languages,
  Target,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";
import courseItalianImage from "@assets/Learn_Italin_in_Vicenza_1772214851188.png";
import aboutVicenzaImage from "@assets/vicenza_1772179633305.jpg";

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

type Lang = "it" | "en";

const content = {
  it: {
    badge: "Italiano per Stranieri",
    heroTitle1: "Impara l'Italiano",
    heroTitle2: "a Vicenza",
    heroSubtitle: "Interlingua insegna italiano per uso professionale e quotidiano. Negli anni abbiamo raggiunto un alto riconoscimento e un apprezzamento a livello mondiale.",
    heroCta: "Scopri i Corsi",
    heroCtaSecondary: "Richiedi Informazioni",
    vicenzaTitle: "Vicenza: La Città del Palladio",
    vicenzaText: "Vicenza è un gioiello incastonato nel cuore del Veneto, dove ogni via racconta secoli di storia, arte e bellezza. Patrimonio UNESCO grazie ai capolavori di Andrea Palladio \u2014 dalla maestosa Basilica Palladiana alla scenografica Villa La Rotonda \u2014 la città incanta con i suoi eleganti palazzi, le piazze animate e un'atmosfera che unisce tradizione e vivacità contemporanea. Ai piedi dei dolci colli Berici, a meno di un'ora da Venezia, Verona e le Dolomiti, Vicenza offre un'esperienza unica: passeggiare tra portici rinascimentali, gustare la cucina veneta in osterie storiche, esplorare mercati e botteghe artigiane, e vivere il calore autentico di una città a misura d'uomo. Studiare italiano qui significa immergersi nella vera Italia.",
    culturalTourism: "Turismo Culturale",
    whyUsTitle: "Perché Scegliere Interlingua",
    whyUs: [
      {
        title: "Apprezzamento Mondiale",
        description: "Interlingua è un'organizzazione di formazione linguistica che insegna italiano per uso professionale e quotidiano. Negli anni abbiamo raggiunto un alto riconoscimento e un apprezzamento a livello mondiale. Siamo anche l'unica scuola a Vicenza a offrire corsi collettivi di italiano su base giornaliera.",
        icon: Globe,
      },
      {
        title: "Alta Qualità Didattica",
        description: "Ciò che rende Interlingua unica è l'approccio individualistico. I nostri corsi di italiano sono molto piccoli: 5-6 persone in media, così i nostri insegnanti e lo staff conoscono ogni singolo studente, garantendo la massima dedizione e cura. Classi piccole significano alta qualità, più personalizzazione e più divertimento!",
        icon: Award,
      },
      {
        title: "Approccio Moderno",
        description: "I nostri corsi di italiano utilizzano un'ampia varietà di materiale autentico, fornendo sempre informazioni attuali sulla cultura italiana. L'approccio è completamente comunicativo, con metodi moderni: la grammatica è una parte importante delle lezioni ma viene presentata nel modo più naturale, così gli studenti spesso non si accorgono di stare imparando le regole.",
        icon: Sparkles,
      },
      {
        title: "Apprendimento Efficace",
        description: "Durante le lezioni gli studenti praticano attraverso drammatizzazione, lavoro di gruppo, progetti outdoor e altri strumenti di apprendimento all'avanguardia. Le quattro abilità linguistiche vengono sviluppate progressivamente, così i nostri studenti migliorano parlato, comprensione, scrittura e lettura allo stesso tempo.",
        icon: Target,
      },
    ],
    coursesTitle: "Scegli il Tuo Corso",
    courses: [
      {
        title: "Intensivo Collettivo 15",
        subtitle: "15 lezioni a settimana",
        schedule: "3 lezioni al giorno",
        price: "275",
        period: "/settimana",
        features: [
          "3-4 lezioni al giorno",
          "Da lunedì a venerdì, dalle 9:30 alle 12:00",
          "15 minuti di pausa",
          "Inizio ogni lunedì, tutto l'anno",
          "Tassa di iscrizione: 50,00 euro",
        ],
        popular: true,
      },
      {
        title: "Intensivo Collettivo 20",
        subtitle: "20 lezioni a settimana",
        schedule: "4 lezioni al giorno",
        price: "360",
        period: "/settimana",
        features: [
          "4 lezioni al giorno",
          "Da lunedì a venerdì, dalle 9:30 alle 13:00",
          "15 minuti di pausa",
          "Inizio ogni lunedì, tutto l'anno",
          "Tassa di iscrizione: 50,00 euro",
        ],
        popular: false,
      },
    ],
    enrollmentNote: "Tassa di iscrizione: 50,00 euro (una tantum)",
    accommodationTitle: "Hai Bisogno di Alloggio?",
    accommodationText: "Possiamo aiutarti a trovare il posto perfetto dove soggiornare durante il tuo corso. Dai B&B alle camere in affitto, Vicenza offre molte opzioni a misura di studente.",
    statsStudents: "Studenti",
    statsNationalities: "Nazionalità",
    statsYears: "Anni di esperienza",
    statsSatisfaction: "Soddisfazione",
    testimonialsTitle: "Cosa Dicono i Nostri Studenti",
    formTitle: "Richiedi Informazioni",
    formSubtitle: "Compila il modulo e ti contatteremo con tutte le informazioni sui nostri corsi di italiano.",
    formName: "Nome",
    formSurname: "Cognome",
    formEmail: "Email",
    formPhone: "Telefono",
    formNationality: "Nazionalità",
    formLevel: "Livello di Italiano",
    formCourse: "Corso di Interesse",
    formAccommodation: "Hai bisogno di alloggio?",
    formMessage: "Il tuo messaggio",
    formNewsletter: "Iscrivimi alla newsletter",
    formGdpr: "Acconsento al trattamento dei dati personali",
    formSubmit: "Invia Richiesta",
    formSuccess: "Richiesta inviata! Ti contatteremo al più presto.",
    formError: "Si è verificato un errore. Riprova più tardi.",
    formRequired: "Campo obbligatorio",
    formEmailInvalid: "Email non valida",
    formGdprRequired: "Devi accettare il trattamento dei dati",
    levelOptions: [
      { value: "principiante", label: "Principiante (A1)" },
      { value: "elementare", label: "Elementare (A2)" },
      { value: "intermedio", label: "Intermedio (B1)" },
      { value: "intermedio-alto", label: "Intermedio Alto (B2)" },
      { value: "avanzato", label: "Avanzato (C1)" },
    ],
    courseOptions: [
      { value: "collettivo-15", label: "Intensivo Collettivo 15 (€275/sett.)" },
      { value: "collettivo-20", label: "Intensivo Collettivo 20 (€360/sett.)" },
      { value: "individuale", label: "Lezioni Individuali" },
      { value: "altro", label: "Altro / Non sono sicuro" },
    ],
    accommodationOptions: [
      { value: "si", label: "Si, ho bisogno di alloggio" },
      { value: "no", label: "No, grazie" },
    ],
    yes: "Si",
    no: "No",
  },
  en: {
    badge: "Italian for Foreigners",
    heroTitle1: "Learn Italian",
    heroTitle2: "in Vicenza",
    heroSubtitle: "Interlingua is a language training organisation which teaches Italian for both professional and everyday use. Over the years we have achieved high recognition and world-wide appreciation.",
    heroCta: "Explore Courses",
    heroCtaSecondary: "Request Information",
    vicenzaTitle: "Vicenza: City of Palladio",
    vicenzaText: "Vicenza is a jewel nestled in the heart of the Veneto region, where every street tells centuries of history, art and beauty. A UNESCO World Heritage Site thanks to the masterpieces of Andrea Palladio \u2014 from the majestic Basilica Palladiana to the iconic Villa La Rotonda \u2014 the city enchants with its elegant palaces, lively piazzas and an atmosphere that blends tradition with contemporary vibrancy. Set at the foot of the gentle Berici hills, less than an hour from Venice, Verona and the Dolomites, Vicenza offers a truly unique experience: strolling under Renaissance arcades, savouring Venetian cuisine in historic osterias, exploring artisan workshops and local markets, and feeling the warm, authentic spirit of a city built on a human scale. Studying Italian here means immersing yourself in the real Italy.",
    culturalTourism: "Cultural Tourism",
    whyUsTitle: "Why Choose Interlingua",
    whyUs: [
      {
        title: "World-Wide Appreciation",
        description: "Interlingua is a language training organisation which teaches Italian for both professional and everyday use. Over the years Interlingua has achieved high recognition and world-wide appreciation. It is also the only school in Vicenza to offer collective Italian classes on a daily basis.",
        icon: Globe,
      },
      {
        title: "High Quality Tuition",
        description: "What makes Interlingua unique is the \"individualistic approach\". Our Italian language courses are very small: 5-6 people on average, so our teachers and school staff get to know each single student, guaranteeing them the utmost dedication and care. Small classes mean high quality tuition, more customisation and of course more fun!",
        icon: Award,
      },
      {
        title: "Modern Approach",
        description: "Our Italian courses employ a wide variety of authentic material, so that students are always provided with modern information about Italian culture. The approach to language teaching is completely communicative, using modern methods, although grammar is not neglected: it is presented in the most natural way, so that students often do not even realise they are learning it.",
        icon: Sparkles,
      },
      {
        title: "Effective Learning",
        description: "During the lessons students will be asked to practise through dramatisation, group-work, outdoor group-projects, and other up-to-date learning instruments. The four language skills are developed progressively, so our students improve their speaking, understanding, writing and reading abilities at the same time.",
        icon: Target,
      },
    ],
    coursesTitle: "Choose Your Course",
    courses: [
      {
        title: "Intensive Collective 15",
        subtitle: "15 lessons per week",
        schedule: "3 lessons per day",
        price: "275",
        period: "/week",
        features: [
          "3-4 lessons per day",
          "Monday to Friday, from 9:30 to 12:00",
          "15-minute break",
          "Starts every Monday throughout the year",
          "Enrolment fee: 50.00 euro",
        ],
        popular: true,
      },
      {
        title: "Intensive Collective 20",
        subtitle: "20 lessons per week",
        schedule: "4 lessons per day",
        price: "360",
        period: "/week",
        features: [
          "4 lessons per day",
          "Monday to Friday, from 9:30 to 13:00",
          "15-minute break",
          "Starts every Monday throughout the year",
          "Enrolment fee: 50.00 euro",
        ],
        popular: false,
      },
    ],
    enrollmentNote: "Enrolment fee: 50.00 euro (one-time)",
    accommodationTitle: "Need Accommodation?",
    accommodationText: "We can help you find the perfect place to stay during your course. From B&Bs to rental rooms, Vicenza offers many student-friendly options.",
    statsStudents: "Students",
    statsNationalities: "Nationalities",
    statsYears: "Years of Experience",
    statsSatisfaction: "Satisfaction",
    testimonialsTitle: "What Our Students Say",
    formTitle: "Request Information",
    formSubtitle: "Fill in the form and we will contact you with all the information about our Italian courses.",
    formName: "First Name",
    formSurname: "Last Name",
    formEmail: "Email",
    formPhone: "Phone",
    formNationality: "Nationality",
    formLevel: "Italian Level",
    formCourse: "Course Interest",
    formAccommodation: "Do you need accommodation?",
    formMessage: "Your message",
    formNewsletter: "Subscribe to our newsletter",
    formGdpr: "I consent to the processing of personal data",
    formSubmit: "Send Request",
    formSuccess: "Request sent! We will contact you shortly.",
    formError: "An error occurred. Please try again later.",
    formRequired: "Required field",
    formEmailInvalid: "Invalid email",
    formGdprRequired: "You must accept the data processing",
    levelOptions: [
      { value: "principiante", label: "Beginner (A1)" },
      { value: "elementare", label: "Elementary (A2)" },
      { value: "intermedio", label: "Intermediate (B1)" },
      { value: "intermedio-alto", label: "Upper Intermediate (B2)" },
      { value: "avanzato", label: "Advanced (C1)" },
    ],
    courseOptions: [
      { value: "collettivo-15", label: "Intensive Collective 15 (€275/wk)" },
      { value: "collettivo-20", label: "Intensive Collective 20 (€360/wk)" },
      { value: "individuale", label: "Individual Lessons" },
      { value: "altro", label: "Other / I'm not sure" },
    ],
    accommodationOptions: [
      { value: "si", label: "Yes, I need accommodation" },
      { value: "no", label: "No, thank you" },
    ],
    yes: "Yes",
    no: "No",
  },
};

const testimonials = [
  { text: "Le lezioni sono state fantastiche! I professori sono molto preparati e le classi piccole permettono di imparare velocemente. Vicenza è una città bellissima per vivere.", textEn: "The lessons were fantastic! The teachers are very well prepared and the small classes allow you to learn quickly. Vicenza is a beautiful city to live in.", author: "Sarah M.", country: "Germany" },
  { text: "Ho scelto Interlingua per l'approccio comunicativo e non me ne sono pentita. In sole due settimane ho fatto progressi incredibili.", textEn: "I chose Interlingua for the communicative approach and I don't regret it. In just two weeks I made incredible progress.", author: "Thomas K.", country: "UK" },
  { text: "L'atmosfera è accogliente e familiare. I docenti sono appassionati e ogni lezione è diversa dall'altra.", textEn: "The atmosphere is welcoming and familiar. The teachers are passionate and every lesson is different.", author: "Marie L.", country: "France" },
  { text: "Studiare italiano a Vicenza è stata un'esperienza indimenticabile. La città, il cibo, la cultura: tutto perfetto!", textEn: "Studying Italian in Vicenza was an unforgettable experience. The city, the food, the culture: everything was perfect!", author: "James W.", country: "USA" },
];

export default function CorsiItalianoPage() {
  const [lang, setLang] = useState<Lang>("it");
  const t = content[lang];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newsletter, setNewsletter] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [livello, setLivello] = useState("");
  const [corsoInterest, setCorsoInterest] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const { toast } = useToast();

  const validate = (fd: FormData) => {
    const errs: Record<string, string> = {};
    if (!fd.get("fname")) errs.fname = t.formRequired;
    if (!fd.get("lname")) errs.lname = t.formRequired;
    const email = fd.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t.formEmailInvalid;
    if (!fd.get("nationality")) errs.nationality = t.formRequired;
    if (!livello) errs.livello = t.formRequired;
    if (!gdpr) errs.gdpr = t.formGdprRequired;
    return errs;
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const courseLabel = t.courseOptions.find(o => o.value === corsoInterest)?.label || corsoInterest;
      const levelLabel = t.levelOptions.find(o => o.value === livello)?.label || livello;
      const nationalityLabel = lang === "it" ? "Nazionalità" : "Nationality";
      const levelKey = lang === "it" ? "Livello" : "Level";
      const courseKey = lang === "it" ? "Corso" : "Course";
      const accommodationKey = lang === "it" ? "Alloggio" : "Accommodation";
      const parts = [
        `${nationalityLabel}: ${formData.get("nationality")}`,
        `${levelKey}: ${levelLabel}`,
        corsoInterest ? `${courseKey}: ${courseLabel}` : "",
        accommodation ? `${accommodationKey}: ${accommodation === "si" ? t.yes : t.no}` : "",
        newsletter ? "Newsletter: Si" : "",
        formData.get("message") ? `\n${formData.get("message")}` : "",
      ].filter(Boolean);

      const courseInterestValue = corsoInterest
        ? `Italian for Foreigners: ${courseLabel}`
        : "Italian for Foreigners";

      const body = {
        name: `${formData.get("fname")} ${formData.get("lname")}`,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        courseInterest: courseInterestValue,
        message: parts.join("\n"),
      };

      await apiRequest("POST", "/api/contact", body);
    },
    onSuccess: () => {
      toast({ title: lang === "it" ? "Richiesta inviata" : "Request sent", description: t.formSuccess });
      setSuccess(true);
    },
    onError: () => {
      toast({ title: lang === "it" ? "Errore" : "Error", description: t.formError, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const fd = new FormData(e.currentTarget);
    const validationErrors = validate(fd);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    mutation.mutate(fd);
  };

  if (success) {
    return (
      <div className="min-h-screen relative">
        <Navigation />
        <main className="pt-40 pb-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4" data-testid="text-success-title">{t.formSuccess}</h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                {lang === "it"
                  ? "Ti contatteremo al più presto con tutte le informazioni sui nostri corsi di italiano."
                  : "We will contact you shortly with all the information about our Italian courses."}
              </p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main>
        <div className="fixed top-32 right-4 z-40">
          <div className="flex rounded-full bg-card border shadow-lg overflow-hidden">
            <button
              onClick={() => setLang("it")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "it" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              data-testid="button-lang-it"
            >
              IT
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              data-testid="button-lang-en"
            >
              EN
            </button>
          </div>
        </div>

        <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-green-400 top-[-200px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-emerald-500 bottom-[-150px] left-[-100px] animation-delay-2000" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-teal-400 top-[30%] left-[60%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm" data-testid="badge-italian-label">
                    <Languages className="w-3.5 h-3.5 mr-1.5" />
                    {t.badge}
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
                  data-testid="text-italian-title"
                >
                  {t.heroTitle1}{" "}
                  <span className="bg-gradient-to-r from-green-200 via-white to-red-200 bg-clip-text text-transparent">
                    {t.heroTitle2}
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl text-green-100/90 mb-10 leading-relaxed max-w-xl"
                  data-testid="text-italian-subtitle"
                >
                  {t.heroSubtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 shadow-xl" onClick={() => document.querySelector("#italian-courses")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-italian-cta">
                    {t.heroCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" onClick={() => document.querySelector("#italian-contact")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-italian-contact">
                    <Mail className="mr-2 h-5 w-5" />
                    {t.heroCtaSecondary}
                  </Button>
                  <Link href="/test-di-livello">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" data-testid="button-italian-test">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Test di Livello
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-3xl blur-2xl" />
                  <img
                    src={courseItalianImage}
                    alt={lang === "it" ? "Corso di italiano a Vicenza" : "Italian course in Vicenza"}
                    className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
                    loading="eager"
                    width={520}
                    height={380}
                  />
                  <div className="absolute -bottom-6 -left-6 fi-glass-card p-4 rounded-xl shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">Vicenza</div>
                        <div className="text-green-200/80 text-sm">{lang === "it" ? "Patrimonio UNESCO" : "UNESCO Heritage"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="py-12 bg-card border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: 500, suffix: "+", label: t.statsStudents, icon: Users },
                { value: 30, suffix: "+", label: t.statsNationalities, icon: Globe },
                { value: 30, suffix: "+", label: t.statsYears, icon: Calendar },
                { value: 98, suffix: "%", label: t.statsSatisfaction, icon: Star },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <stat.icon className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-200/30 to-teal-200/30 dark:from-green-900/20 dark:to-teal-900/20 rounded-3xl blur-xl" />
                  <img
                    src={aboutVicenzaImage}
                    alt="Vicenza"
                    className="relative rounded-2xl shadow-lg w-full"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white border-0 shadow-lg">
                      <Landmark className="w-3 h-3 mr-1" />
                      {t.culturalTourism}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-vicenza-title">{t.vicenzaTitle}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t.vicenzaText}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Landmark, label: lang === "it" ? "Patrimonio UNESCO" : "UNESCO Heritage" },
                      { icon: Sun, label: lang === "it" ? "Clima Mediterraneo" : "Mediterranean Climate" },
                      { icon: Palette, label: lang === "it" ? "Arte e Cultura" : "Art & Culture" },
                      { icon: Coffee, label: lang === "it" ? "Cucina Italiana" : "Italian Cuisine" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                        <item.icon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">
                <Award className="w-3 h-3 mr-1" />
                {lang === "it" ? "I Nostri Punti di Forza" : "Our Strengths"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-whyus-title">{t.whyUsTitle}</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {t.whyUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <Card className="h-full hover-elevate">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 shrink-0">
                            <Icon className="w-6 h-6 text-green-700 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section id="italian-courses" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">
                <BookOpen className="w-3 h-3 mr-1" />
                {lang === "it" ? "Corsi Disponibili" : "Available Courses"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-courses-title">{t.coursesTitle}</h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {t.courses.map((course, i) => (
                <AnimatedSection key={i} delay={i * 0.15}>
                  <Card className={`h-full relative overflow-hidden ${course.popular ? "border-green-500 shadow-lg shadow-green-500/10" : ""}`}>
                    {course.popular && (
                      <div className="absolute top-0 right-0">
                        <Badge className="rounded-none rounded-bl-lg bg-green-600 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          {lang === "it" ? "Più Popolare" : "Most Popular"}
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-1" data-testid={`text-course-title-${i}`}>{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                      </div>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-green-700 dark:text-green-400">&euro;{course.price}</span>
                        <span className="text-muted-foreground">{course.period}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {course.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full bg-green-700 hover:bg-green-800 text-white"
                        onClick={() => document.querySelector("#italian-contact")?.scrollIntoView({ behavior: "smooth" })}
                        data-testid={`button-course-info-${i}`}
                      >
                        {t.heroCtaSecondary}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="text-center mt-8">
              <p className="text-sm text-muted-foreground">{t.enrollmentNote}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="mt-12 max-w-2xl mx-auto">
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 shrink-0">
                    <Heart className="w-6 h-6 text-green-700 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{t.accommodationTitle}</h3>
                    <p className="text-sm text-muted-foreground">{t.accommodationText}</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">
                <Star className="w-3 h-3 mr-1" />
                {lang === "it" ? "Recensioni" : "Reviews"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-testimonials-title">{t.testimonialsTitle}</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic leading-relaxed mb-4">
                        "{lang === "it" ? item.text : item.textEn}"
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>{item.author}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-muted-foreground">{item.country}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="italian-contact" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-14">
              <Badge variant="secondary" className="mb-4">
                <Send className="w-3 h-3 mr-1" />
                {lang === "it" ? "Contattaci" : "Contact Us"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-form-title">{t.formTitle}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.formSubtitle}</p>
            </AnimatedSection>

            <AnimatedSection className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fname">{t.formName} *</Label>
                        <Input id="fname" name="fname" data-testid="input-fname" className="mt-1" />
                        {submitted && errors.fname && <p className="text-xs text-destructive mt-1">{errors.fname}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lname">{t.formSurname} *</Label>
                        <Input id="lname" name="lname" data-testid="input-lname" className="mt-1" />
                        {submitted && errors.lname && <p className="text-xs text-destructive mt-1">{errors.lname}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{t.formEmail} *</Label>
                        <Input id="email" name="email" type="email" data-testid="input-email" className="mt-1" />
                        {submitted && errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">{t.formPhone}</Label>
                        <Input id="phone" name="phone" type="tel" data-testid="input-phone" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nationality">{t.formNationality} *</Label>
                      <Input id="nationality" name="nationality" data-testid="input-nationality" className="mt-1" />
                      {submitted && errors.nationality && <p className="text-xs text-destructive mt-1">{errors.nationality}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>{t.formLevel} *</Label>
                        <Select value={livello} onValueChange={setLivello}>
                          <SelectTrigger className="mt-1" data-testid="select-level">
                            <SelectValue placeholder={lang === "it" ? "Seleziona livello" : "Select level"} />
                          </SelectTrigger>
                          <SelectContent>
                            {t.levelOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {submitted && errors.livello && <p className="text-xs text-destructive mt-1">{errors.livello}</p>}
                      </div>
                      <div>
                        <Label>{t.formCourse}</Label>
                        <Select value={corsoInterest} onValueChange={setCorsoInterest}>
                          <SelectTrigger className="mt-1" data-testid="select-course">
                            <SelectValue placeholder={lang === "it" ? "Seleziona corso" : "Select course"} />
                          </SelectTrigger>
                          <SelectContent>
                            {t.courseOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>{t.formAccommodation}</Label>
                      <Select value={accommodation} onValueChange={setAccommodation}>
                        <SelectTrigger className="mt-1" data-testid="select-accommodation">
                          <SelectValue placeholder={lang === "it" ? "Seleziona" : "Select"} />
                        </SelectTrigger>
                        <SelectContent>
                          {t.accommodationOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">{t.formMessage}</Label>
                      <Textarea id="message" name="message" rows={4} data-testid="input-message" className="mt-1" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(c) => setNewsletter(c === true)} data-testid="checkbox-newsletter" />
                        <Label htmlFor="newsletter" className="text-sm cursor-pointer">{t.formNewsletter}</Label>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox id="gdpr" checked={gdpr} onCheckedChange={(c) => setGdpr(c === true)} data-testid="checkbox-gdpr" className="mt-0.5" />
                        <Label htmlFor="gdpr" className="text-sm cursor-pointer">{t.formGdpr} *</Label>
                      </div>
                      {submitted && errors.gdpr && <p className="text-xs text-destructive">{errors.gdpr}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white" disabled={mutation.isPending} data-testid="button-submit-contact">
                      {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      {t.formSubmit}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="mt-10 text-center">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Vicenza: Viale Mazzini, 27</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Tel. 0444 321601</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@interlingua.it</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <CourseReviewsInline productSlug="italiano-intensivo-15" />
        <CourseReviewsInline productSlug="italiano-intensivo-20" />
      </main>
      <Footer />
    </div>
  );
}