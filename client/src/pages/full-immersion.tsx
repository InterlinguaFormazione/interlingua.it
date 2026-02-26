import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Mountain,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Award,
  Sparkles,
  MapPin,
  BookOpen,
  Target,
  TrendingUp,
  Quote,
  Phone,
  Mail,
  Globe,
  Heart,
  GraduationCap,
  UserCheck,
  Languages,
  Mic2,
  Briefcase,
  Brain,
  ArrowDown,
  Play,
  Zap,
} from "lucide-react";
import fullImmersionImage from "@assets/Full-Immersion-Workshop-di-Lingua-Inglese_1772143747179.jpg";

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

const programTopics = [
  {
    title: "Language Studies",
    description: "Approccio attivo alla lingua e alla grammatica orientato all'uso reale, con Task-Based Learning personalizzato e interattivo — dalla scrittura di email alla gestione di dialoghi professionali.",
    icon: Languages,
    gradient: "from-primary to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Small Talk & Ear Training",
    description: "Conversazione, comprensione orale e pronuncia attraverso roleplay, giochi d'aula, mirroring e imitation learning. Si lavora su scioltezza e spontaneità, superando blocchi linguistici.",
    icon: Mic2,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    title: "Specialist & Executive Language",
    description: "Linguaggio specifico del proprio contesto: business, tecnico, accademico. Contenuti adattati al profilo dei partecipanti con Experiential Learning e Design Thinking.",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Specialist & Executive Mindset",
    description: "Comunicazione efficace, intelligenza emotiva e crescita personale. Public speaking, leadership, team-working e creatività attraverso metodologie esperienziali e game-based learning.",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/30",
  },
];

const testimonials = [
  { text: "It's been a very helpful course during which I could practise and improve my English skills, meet new people and make unforgettable experiences! I felt 100% part of the team and together we had such a lot of fun. Can't wait till the next course!", author: "Vanessa Martini" },
  { text: "Avete ideato dei moduli efficienti. Perfetto equilibrio tra impegno richiesto, tempo di studio e risultati ottenuti.", author: "Vera Chiozzotto" },
  { text: "Le giornate volano e ogni giorno si migliora sostanzialmente.", author: "Linda" },
  { text: "Quello che colpisce di più del full immersion è l'altissima qualità dell'insegnamento.", author: "Chiara" },
  { text: "Mi ha colpito l'ambiente informale e spontaneo, nonostante molti studenti fossero CEO, dirigenti o manager.", author: "Partecipante weekend esperienziale" },
  { text: "Ho vissuto una settimana full immersion con Interlingua. Professionalità, motivazione e una grande carica di energia sono solo alcuni degli ingredienti di questa bellissima e riuscitissima esperienza. Grazie e... spero a presto!", author: "Laura Bertolino" },
  { text: "Mi è piaciuto soprattutto che ogni materia ci faceva portare avanti un lavoro o un progetto, quindi non si vedeva l'ora di ricominciare al cambio dell'ora.", author: "Andrea" },
  { text: "I don't like studying English, so this is perfect because you study leadership and marketing, and you learn English!", author: "Paolo" },
  { text: "Mi ha stupito il metodo CLIL: con questo metodo ci si dimentica davvero di parlare una lingua straniera!", author: "Elena" },
  { text: "Mi ha sorpreso la professionalità e la passione trasmessa durante le lezioni.", author: "Michele Dominici" },
  { text: "Approccio dinamico e interattivo, pieno di diverse attività: il public speaking, l'ascolto, attività pratiche, il gioco.", author: "Mauro" },
  { text: "Corso molto dinamico, il tempo vola e solo alla fine ti accorgi di quanto hai imparato!", author: "Giampietro" },
];

const formats = [
  {
    title: "FIW Collettivo",
    subtitle: "5-8 partecipanti",
    description: "Il formato più amato: un piccolo gruppo di persone motivate che condividono la stessa settimana di immersione totale. L'energia del gruppo diventa il motore del tuo apprendimento.",
    features: ["5 giorni intensivi (lun-ven)", "30+ ore frontali, dalle 9:00 alle 16:30", "Team di coach madrelingua", "Livelli da A2 a C1", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-primary to-blue-600",
    icon: Users,
    popular: true,
  },
  {
    title: "FIW Semi-Individuale",
    subtitle: "2-4 partecipanti",
    description: "Un'attenzione più mirata in un gruppo ristretto, dove ogni conversazione diventa un'opportunità su misura e i tuoi obiettivi specifici guidano il percorso fin dal primo giorno.",
    features: ["5 giorni intensivi (lun-ven)", "Percorso personalizzato e mirato", "Conversazioni reali e sfide pratiche", "Team di coach madrelingua dedicato", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-emerald-500 to-teal-600",
    icon: UserCheck,
    popular: false,
  },
  {
    title: "FIW Individuale",
    subtitle: "1 partecipante",
    description: "Un'esperienza esclusiva costruita interamente intorno a te: i tuoi obiettivi, il tuo stile, il tuo ritmo. Un team di 3-4 coach madrelingua dedicati lavora con te per una settimana.",
    features: ["5 giorni intensivi (lun-ven)", "3-4 coach madrelingua dedicati", "Programma 100% personalizzato", "Obiettivi specifici professionali", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-violet-500 to-purple-600",
    icon: GraduationCap,
    popular: false,
  },
  {
    title: "Experiential Weekend",
    subtitle: "The Spirit of Leadership",
    description: "Un weekend sui Colli Berici tra cavalli, natura e sfide di leadership, tutto in inglese. Torni a casa con un inglese migliore e una nuova consapevolezza di quello che sei capace di fare.",
    features: ["2 giorni immersivi (sab-dom)", "Equitazione, leadership e team building", "Attività outdoor ed esperienziali", "Colli Berici, provincia di Vicenza"],
    color: "from-amber-500 to-orange-600",
    icon: Mountain,
    popular: false,
  },
];

export default function FullImmersionPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main>
        <section ref={heroRef} className="relative pt-32 pb-28 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[600px] h-[600px] bg-blue-400 top-[-200px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-indigo-500 bottom-[-150px] left-[-100px] animation-delay-2000" />
          <div className="fi-hero-orb w-[300px] h-[300px] bg-cyan-400 top-[30%] left-[60%] animate-pulse-glow" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm" data-testid="badge-fi-label">
                    <Mountain className="w-3.5 h-3.5 mr-1.5" />
                    Full Immersion Workshop
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
                  data-testid="text-fi-title"
                >
                  E Se Bastasse
                  <br />
                  <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    Una Settimana?
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-xl text-white/85 mb-4 leading-relaxed max-w-xl"
                >
                  Sai già che il tuo inglese potrebbe essere migliore. Forse lo senti quando cerchi una parola che è lì, sulla punta della lingua, ma non esce. O quando capisci tutto, ma rispondere ti sembra un'altra cosa.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-lg text-white/65 mb-10 leading-relaxed max-w-xl"
                >
                  In cinque giorni di immersione totale, il tuo inglese smette di essere qualcosa che sai e diventa qualcosa che sei.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="flex flex-wrap gap-4 mb-10"
                >
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <Calendar className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Durata</p>
                      <p className="font-bold text-white">5 giorni intensivi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <Clock className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Ore frontali</p>
                      <p className="font-bold text-white">30+ ore</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                    <div>
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">Dove</p>
                      <p className="font-bold text-white">Vicenza</p>
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
                    onClick={() => document.querySelector("#contact-section")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid="button-fi-cta"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Voglio Partecipare
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => document.querySelector("#formats-section")?.scrollIntoView({ behavior: "smooth" })}
                    data-testid="button-fi-formats"
                  >
                    Scopri i Formati
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative lg:pl-8 hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-400/20 via-transparent to-blue-400/20 rounded-[2rem] blur-3xl animate-pulse-glow" />
                  <img
                    src={fullImmersionImage}
                    alt="Full Immersion Workshop di lingua inglese"
                    className="relative rounded-[2rem] w-full max-w-lg mx-auto shadow-2xl shadow-black/30 border-2 border-white/15"
                    loading="lazy"
                    decoding="async"
                    data-testid="img-fi-hero"
                  />
                  <div className="absolute -bottom-6 -left-6 animate-float-slow">
                    <div className="fi-glass-card rounded-2xl shadow-2xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">+1 Livello QCER</p>
                          <p className="text-xs text-muted-foreground">In una settimana</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 animate-float">
                    <div className="fi-glass-card rounded-2xl shadow-2xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Heart className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">98%</p>
                          <p className="text-xs text-muted-foreground">Lo rifarebbero</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
            >
              <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Scopri di più</span>
              <ArrowDown className="w-5 h-5 text-white/40 animate-bounce" />
            </motion.div>
          </motion.div>
        </section>

        <section className="py-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection>
                <div className="text-center mb-14">
                  <Badge variant="secondary" className="mb-5 px-5 py-2">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    Un Livello in Una Settimana
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight" data-testid="text-fi-intro-title">
                    Metodologia
                    <span className="block gradient-text">Immersiva ed Esperienziale</span>
                  </h2>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Hai mai pensato a quanto potrebbe cambiare il tuo inglese... senza dover partire per l'estero? I nostri workshop rappresentano un'alternativa concreta e stimolante ai soggiorni studio tradizionali. Molte persone — professionisti, studenti, lavoratori — scoprono che basta la giusta esperienza, nel contesto giusto, per fare un vero salto di qualità.
                  </p>
                  <p>
                    Per cinque giorni entrerai in un ambiente dove si comunica, si pensa e si vive in inglese. Un programma superintensivo di almeno 30 ore frontali, dalle 9:00 alle 16:30, che puoi prolungare fino alle 18:00 con attività esperienziali. Il tutto basato sul metodo Interlingua, che unisce l'experiential learning al Task-Based Learning e al CLIL (Content and Language Integrated Learning). Non impari solo l'inglese: lo vivi.
                  </p>
                  <p>
                    E ciò che costruisci durante la settimana continua a crescere: 3 mesi di accesso a un corso online completo sulla nostra piattaforma 24/7, più sessioni di conversazione con coach madrelingua nello Speaker's Corner.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.25}>
                <div className="relative my-12 py-8 px-6 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl opacity-50" />
                  <p className="text-xl md:text-2xl font-bold text-foreground text-center leading-relaxed relative">
                    Non si tratta solo di imparare...
                    <br />
                    <span className="gradient-text">Si tratta di scoprire quanto l'inglese che hai dentro può diventare parte di te.</span>
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.35}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { icon: Clock, value: 30, suffix: "+", label: "Ore frontali", color: "from-primary to-blue-600" },
                    { icon: Users, value: 8, suffix: "", label: "Partecipanti max", color: "from-emerald-500 to-teal-600" },
                    { icon: Award, value: 1, suffix: "", label: "Livello QCER in più", color: "from-amber-500 to-orange-600" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-3xl md:text-4xl font-bold text-foreground">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <Target className="w-3.5 h-3.5 mr-1.5" />
                  Programma Interdisciplinare
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fi-program-title">
                  Quattro Aree Tematiche
                  <span className="block gradient-text">Quattro Docenti Madrelingua</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Quattro sessioni da 90 minuti al giorno, ciascuna guidata da un coach madrelingua esperto nel proprio topic. Il programma è customizzato e interdisciplinare.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {programTopics.map((topic, index) => (
                <AnimatedSection key={index} delay={index * 0.1} className="h-full">
                  <Card
                    className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500 h-full ${topic.bgLight}`}
                    data-testid={`card-fi-topic-${index}`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${topic.gradient}`} />
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${topic.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                    <CardContent className="p-8 relative">
                      <div className="flex items-start gap-5 mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <topic.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <AnimatedSection>
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-5 px-5 py-2">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    La Settimana Tipo
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fi-day-title">
                    Come Si Vive il
                    <span className="gradient-text"> Full Immersion</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Ogni giorno i topic ruotano, per tenerti sempre stimolato e farti vivere la lingua da prospettive diverse. Il venerdi si conclude con l'Elevator Pitch: la tua presentazione finale in inglese.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-xl bg-card" data-testid="table-fi-schedule">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="p-4 text-left text-muted-foreground font-semibold border-b border-border/50 w-[130px] bg-muted/30">Orario</th>
                        <th className="p-4 text-center font-bold text-white bg-gradient-to-b from-primary to-primary/90">Lunedi</th>
                        <th className="p-4 text-center font-bold text-white bg-gradient-to-b from-primary/90 to-primary/80">Martedi</th>
                        <th className="p-4 text-center font-bold text-white bg-gradient-to-b from-primary/80 to-primary/70">Mercoledi</th>
                        <th className="p-4 text-center font-bold text-white bg-gradient-to-b from-primary/70 to-primary/60">Giovedi</th>
                        <th className="p-4 text-center font-bold text-white bg-gradient-to-b from-primary/60 to-primary/50">Venerdi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20">
                        <td className="p-4 font-semibold text-foreground bg-muted/20">9,00-10,30</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-amber-50/60 dark:bg-amber-950/20">Small Talk & Ear Training</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-violet-50/60 dark:bg-violet-950/20">B&E Mindset</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-blue-50/60 dark:bg-blue-950/20">Language Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-emerald-50/60 dark:bg-emerald-950/20">B&E Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-amber-50/60 dark:bg-amber-950/20">Small Talk & Ear Training</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="p-4 font-semibold text-foreground bg-muted/20">10,30-12,00</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-violet-50/60 dark:bg-violet-950/20">B&E Mindset</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-blue-50/60 dark:bg-blue-950/20">Language Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-emerald-50/60 dark:bg-emerald-950/20">B&E Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-amber-50/60 dark:bg-amber-950/20">Small Talk & Ear Training</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-violet-50/60 dark:bg-violet-950/20">B&E Mindset</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="p-4 font-semibold text-foreground bg-muted/20">12,00-13,30</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-blue-50/60 dark:bg-blue-950/20">Language Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-emerald-50/60 dark:bg-emerald-950/20">B&E Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-amber-50/60 dark:bg-amber-950/20">Small Talk & Ear Training</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-violet-50/60 dark:bg-violet-950/20">B&E Mindset</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-orange-50/60 dark:bg-orange-950/20 font-medium italic">Final Event Preparation</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="p-4 font-semibold text-foreground bg-muted/20">13,30-15,00</td>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground italic bg-muted/20">
                          <span className="inline-flex items-center gap-2"><Play className="w-4 h-4" /> Lunch-break</span>
                        </td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="p-4 font-semibold text-foreground bg-muted/20">15,00-16,30</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-emerald-50/60 dark:bg-emerald-950/20">B&E Studies</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-amber-50/60 dark:bg-amber-950/20">Small Talk & Ear Training</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-violet-50/60 dark:bg-violet-950/20">B&E Mindset</td>
                        <td className="p-4 text-center text-muted-foreground fi-schedule-cell bg-blue-50/60 dark:bg-blue-950/20">Language Studies</td>
                        <td className="p-4 text-center fi-schedule-cell bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 font-bold text-foreground">Final Event (Elevator Pitch)</td>
                      </tr>
                      <tr>
                        <td className="p-4 bg-muted/20">
                          <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-0.5">Potenziamento</span>
                          <span className="font-semibold text-foreground">16,30-18,00</span>
                        </td>
                        <td className="p-4 text-center font-bold text-primary fi-schedule-cell bg-primary/8">Extension</td>
                        <td className="p-4 text-center font-bold text-primary fi-schedule-cell bg-primary/8">Extension</td>
                        <td className="p-4 text-center font-bold text-primary fi-schedule-cell bg-primary/8">Extension</td>
                        <td className="p-4 text-center font-bold text-primary fi-schedule-cell bg-primary/8">Extension</td>
                        <td className="p-4 text-center text-muted-foreground"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4 tracking-wide">
                  B&E Studies = Specialist & Executive Language | B&E Mindset = Specialist & Executive Mindset
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section id="formats-section" className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Il Corso Giusto per Te
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fi-formats-title">
                  Scegli il Tuo
                  <span className="gradient-text"> Formato</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ogni persona ha il suo modo di imparare. Per questo abbiamo creato formati diversi, ognuno pensato per un tipo diverso di esperienza. Quello che li accomuna è il risultato.
                </p>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {formats.map((format, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <Card
                    className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500 ${format.popular ? "ring-2 ring-primary/30" : ""}`}
                    data-testid={`card-fi-format-${index}`}
                  >
                    {format.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-lg px-3 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Più richiesto
                        </Badge>
                      </div>
                    )}
                    <div className={`h-2 bg-gradient-to-r ${format.color}`} />
                    <CardContent className="p-8 relative">
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${format.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                      <div className="flex items-center gap-5 mb-5">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${format.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <format.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{format.title}</h3>
                          <p className="text-sm font-medium text-muted-foreground">{format.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{format.description}</p>
                      <div className="space-y-3">
                        {format.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 group/item">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${format.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-sm text-foreground group-hover/item:text-primary transition-colors">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <AnimatedSection>
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-5 px-5 py-2">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    Risultati Garantiti
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fi-results-title">
                    Competenze e
                    <span className="gradient-text"> Risultati</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Chi partecipa ottiene risultati migliori rispetto ai format tradizionali: punteggi superiori nei test finali, soddisfazione più alta, un cambiamento tangibile e misurabile. La formula intensiva permette di affidarsi pienamente al team docente in ogni fase — fino all'Elevator Pitch finale.
                  </p>
                </div>
              </AnimatedSection>

              <div className="grid sm:grid-cols-3 gap-6 mb-16">
                {[
                  { icon: Globe, title: "Comunicazione orale e scritta in contesti professionali", gradient: "from-primary to-blue-600" },
                  { icon: Users, title: "Consapevolezza e gestione delle differenze interculturali", gradient: "from-emerald-500 to-teal-600" },
                  { icon: Brain, title: "Leadership, team-working, public speaking e pensiero creativo", gradient: "from-violet-500 to-purple-600" },
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-shadow duration-500 text-center">
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r ${item.gradient} rounded-full`} />
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-relaxed">{item.title}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.2}>
                <div className="relative rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                  <div className="relative p-10">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Foundation e Consolidation</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        L'esperienza non si conclude con l'ultima lezione. Dopo la settimana intensiva, hai accesso automatico a un programma di consolidamento.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-foreground">3 Mesi di E-Learning</h4>
                            <p className="text-xs text-muted-foreground font-medium">Piattaforma interattiva 24/7</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Contenuti strutturati per il consolidamento — grammatica, listening, reading, writing, pronuncia — sempre disponibili, quando e dove vuoi.
                        </p>
                      </div>
                      <div className="group p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Mic2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-foreground">3 Mesi di Speaker's Corner</h4>
                            <p className="text-xs text-muted-foreground font-medium">Conversazione con coach madrelingua</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Sessioni di conversazione per mantenere attiva e fluida la tua capacità di esprimerti in inglese. Prenota quando vuoi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16">
                <AnimatedSection>
                  <div>
                    <Badge variant="secondary" className="mb-5 px-5 py-2">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      A Chi è Rivolto
                    </Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight" data-testid="text-fi-audience-title">
                      Per Chi Vuole
                      <span className="gradient-text"> Fare il Salto</span>
                    </h2>
                    <div className="space-y-5 text-muted-foreground leading-relaxed">
                      <p>
                        Professionisti, studenti universitari, freelance, viaggiatori, insegnanti — chiunque voglia migliorare rapidamente fluidità e sicurezza in inglese, per usarlo con naturalezza in contesti professionali e nella vita quotidiana.
                      </p>
                      <p>
                        Particolarmente adatto a chi ha poco tempo e impegni che rendono difficile seguire corsi regolari. In una sola settimana, un'esperienza intensiva e su misura che sblocca il tuo inglese in modo diretto e duraturo.
                      </p>
                      <div className="relative p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 mt-6">
                        <p className="font-semibold text-foreground text-sm">
                          Quando il metodo si adatta a te — e non il contrario — scoprire quanto puoi evolvere diventa solo questione di giorni.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.15}>
                  <div>
                    <Badge variant="secondary" className="mb-5 px-5 py-2">
                      <Award className="w-3.5 h-3.5 mr-1.5" />
                      Livelli e Requisiti
                    </Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight" data-testid="text-fi-levels-title">
                      Livelli
                      <span className="gradient-text"> Disponibili</span>
                    </h2>
                    <div className="space-y-3 mb-8">
                      {[
                        { level: "A2", name: "Pre-intermediate", color: "from-sky-500 to-blue-600" },
                        { level: "B1", name: "Intermediate", color: "from-primary to-blue-600" },
                        { level: "B2", name: "Upper-intermediate", color: "from-indigo-500 to-violet-600" },
                        { level: "C1", name: "Advanced", color: "from-violet-500 to-purple-600" },
                      ].map((item) => (
                        <div key={item.level} className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {item.level}
                          </div>
                          <span className="text-foreground font-semibold">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Test di ingresso online incluso.
                      </p>
                      <p>
                        Aperto a tutti con conoscenza minima dell'inglese. Accesso con corso A2+ negli ultimi 3 anni con Interlingua, oppure superando il test online con almeno il 40%.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        <section className="py-28 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <Star className="w-3.5 h-3.5 mr-1.5" />
                  Parola di Chi C'era
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fi-testimonials-title">
                  Non Crederci Sulla Parola.
                  <span className="gradient-text"> Credi a Loro.</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Sono tornati a casa con un inglese migliore e la voglia di rifarlo. Ecco cosa dicono.
                </p>
              </div>
            </AnimatedSection>
            <div className="relative max-w-7xl mx-auto overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <div className="flex animate-marquee gap-6 py-4" style={{ width: "max-content" }}>
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <Card
                    key={index}
                    className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl w-[360px] flex-shrink-0"
                    data-testid={`card-fi-testimonial-${index % testimonials.length}`}
                  >
                    <CardContent className="p-7">
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-primary/15 mb-3" />
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-white">{testimonial.author[0]}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{testimonial.author}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact-section" className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[500px] h-[500px] bg-cyan-400 top-[-150px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-blue-500 bottom-[-100px] left-[-100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-bold text-white/90 tracking-wide">Posti Limitati</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight tracking-tight" data-testid="text-fi-cta-title">
                  La Prossima Settimana
                  <br />
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    Che Cambierà il Tuo Inglese
                  </span>
                </h2>
                <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  I gruppi sono piccoli. I posti si esauriscono. Se stai leggendo fin qui, qualcosa ti dice che è il momento giusto.
                </p>
                <p className="text-lg text-white/55 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Contattaci per scoprire le prossime date e riservare il tuo posto. Una chiacchierata al telefono o un'email: è tutto quello che serve per iniziare.
                </p>
                <div className="flex flex-wrap justify-center gap-5">
                  <Button
                    size="lg"
                    className="h-16 px-10 text-lg rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-bold"
                    asChild
                    data-testid="button-fi-call"
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
                    data-testid="button-fi-email"
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
