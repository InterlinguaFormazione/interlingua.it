import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import fullImmersionImage from "@assets/Full-Immersion-Workshop-di-Lingua-Inglese_1772143747179.jpg";

const programTopics = [
  {
    title: "Language Studies",
    description: "Approccio attivo alla lingua e alla grammatica orientato all'uso reale, con Task-Based Learning personalizzato e interattivo — dalla scrittura di email alla gestione di dialoghi professionali.",
    icon: Languages,
    gradient: "from-primary to-blue-600",
  },
  {
    title: "Small Talk & Ear Training",
    description: "Conversazione, comprensione orale e pronuncia attraverso roleplay, giochi d'aula, mirroring e imitation learning. Si lavora su scioltezza e spontaneità, superando blocchi linguistici.",
    icon: Mic2,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Specialist & Executive Language",
    description: "Linguaggio specifico del proprio contesto: business, tecnico, accademico. Contenuti adattati al profilo dei partecipanti con Experiential Learning e Design Thinking.",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Specialist & Executive Mindset",
    description: "Comunicazione efficace, intelligenza emotiva e crescita personale. Public speaking, leadership, team-working e creatività attraverso metodologie esperienziali e game-based learning.",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
  },
];

const testimonials = [
  {
    text: "It's been a very helpful course during which I could practise and improve my English skills, meet new people and make unforgettable experiences! I felt 100% part of the team and together we had such a lot of fun. Can't wait till the next course!",
    author: "Vanessa Martini",
  },
  {
    text: "Avete ideato dei moduli efficienti. Perfetto equilibrio tra impegno richiesto, tempo di studio e risultati ottenuti.",
    author: "Vera Chiozzotto",
  },
  {
    text: "Le giornate volano e ogni giorno si migliora sostanzialmente.",
    author: "Linda",
  },
  {
    text: "Quello che colpisce di più del full immersion è l'altissima qualità dell'insegnamento.",
    author: "Chiara",
  },
  {
    text: "Mi ha colpito l'ambiente informale e spontaneo, nonostante molti studenti fossero CEO, dirigenti o manager.",
    author: "Partecipante weekend esperienziale",
  },
  {
    text: "Ho vissuto una settimana full immersion con Interlingua. Professionalità, motivazione e una grande carica di energia sono solo alcuni degli ingredienti di questa bellissima e riuscitissima esperienza. Grazie e... spero a presto!",
    author: "Laura Bertolino",
  },
  {
    text: "Mi è piaciuto soprattutto che ogni materia ci faceva portare avanti un lavoro o un progetto, quindi non si vedeva l'ora di ricominciare al cambio dell'ora.",
    author: "Andrea",
  },
  {
    text: "I don't like studying English, so this is perfect because you study leadership and marketing, and you learn English!",
    author: "Paolo",
  },
  {
    text: "Mi ha stupito il metodo CLIL: con questo metodo ci si dimentica davvero di parlare una lingua straniera!",
    author: "Elena",
  },
  {
    text: "Mi ha sorpreso la professionalità e la passione trasmessa durante le lezioni.",
    author: "Michele Dominici",
  },
  {
    text: "Approccio dinamico e interattivo, pieno di diverse attività: il public speaking, l'ascolto, attività pratiche, il gioco.",
    author: "Mauro",
  },
  {
    text: "Corso molto dinamico, il tempo vola e solo alla fine ti accorgi di quanto hai imparato!",
    author: "Giampietro",
  },
];

const formats = [
  {
    title: "FIW Collettivo",
    subtitle: "5-8 partecipanti",
    description: "Il formato più amato: un piccolo gruppo di persone motivate che condividono la stessa settimana di immersione totale. L'energia del gruppo diventa il motore del tuo apprendimento.",
    features: ["5 giorni intensivi (lun-ven)", "30+ ore frontali, dalle 9:00 alle 16:30", "Team di coach madrelingua", "Livelli da A2 a C1", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-primary to-blue-600",
    icon: Users,
  },
  {
    title: "FIW Semi-Individuale",
    subtitle: "2-4 partecipanti",
    description: "Un'attenzione più mirata in un gruppo ristretto, dove ogni conversazione diventa un'opportunità su misura e i tuoi obiettivi specifici guidano il percorso fin dal primo giorno.",
    features: ["5 giorni intensivi (lun-ven)", "Percorso personalizzato e mirato", "Conversazioni reali e sfide pratiche", "Team di coach madrelingua dedicato", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-emerald-500 to-teal-600",
    icon: UserCheck,
  },
  {
    title: "FIW Individuale",
    subtitle: "1 partecipante",
    description: "Un'esperienza esclusiva costruita interamente intorno a te: i tuoi obiettivi, il tuo stile, il tuo ritmo. Un team di 3-4 coach madrelingua dedicati lavora con te per una settimana.",
    features: ["5 giorni intensivi (lun-ven)", "3-4 coach madrelingua dedicati", "Programma 100% personalizzato", "Obiettivi specifici professionali", "Convenzioni B&B e hotel a Vicenza"],
    color: "from-violet-500 to-purple-600",
    icon: GraduationCap,
  },
  {
    title: "Experiential Weekend",
    subtitle: "The Spirit of Leadership",
    description: "Un weekend sui Colli Berici tra cavalli, natura e sfide di leadership, tutto in inglese. Torni a casa con un inglese migliore e una nuova consapevolezza di quello che sei capace di fare.",
    features: ["2 giorni immersivi (sab-dom)", "Equitazione, leadership e team building", "Attività outdoor ed esperienziali", "Colli Berici, provincia di Vicenza"],
    color: "from-amber-500 to-orange-600",
    icon: Mountain,
  },
];

export default function FullImmersionPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="relative pt-36 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-1.5" data-testid="badge-fi-label">
                  <Mountain className="w-3 h-3 mr-1" />
                  Full Immersion Workshop
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-fi-title">
                  E Se Bastasse<br />Una Settimana?
                </h1>
                <p className="text-xl text-white/90 mb-4 leading-relaxed max-w-xl">
                  Sai già che il tuo inglese potrebbe essere migliore. Forse lo senti quando cerchi una parola che è lì, sulla punta della lingua, ma non esce. O quando capisci tutto, ma rispondere ti sembra un'altra cosa.
                </p>
                <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">
                  In cinque giorni di immersione totale, il tuo inglese smette di essere qualcosa che sai e diventa qualcosa che sei. I nostri docenti madrelingua sanno esattamente come guidarti in quel passaggio, nel modo più naturale possibile.
                </p>

                <div className="flex flex-wrap gap-6 mb-10">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/15">
                    <Calendar className="w-5 h-5 text-white/90" />
                    <div>
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Durata</p>
                      <p className="font-semibold text-white">5 giorni intensivi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/15">
                    <MapPin className="w-5 h-5 text-white/90" />
                    <div>
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Dove</p>
                      <p className="font-semibold text-white">Vicenza</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl"
                    onClick={() => {
                      const el = document.querySelector("#contact-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-fi-cta"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Voglio Partecipare
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => {
                      const el = document.querySelector("#formats-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-fi-formats"
                  >
                    Scopri i Formati
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="relative lg:pl-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-primary/5 to-blue-400/20 rounded-3xl blur-2xl" />
                  <img
                    src={fullImmersionImage}
                    alt="Full Immersion Workshop di lingua inglese"
                    className="relative rounded-3xl w-full max-w-lg mx-auto shadow-2xl shadow-black/20 border border-white/20"
                    loading="lazy"
                    decoding="async"
                    data-testid="img-fi-hero"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl border border-border/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">+1 Livello QCER</p>
                        <p className="text-xs text-muted-foreground">In una settimana</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-xl border border-border/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">98%</p>
                        <p className="text-xs text-muted-foreground">Lo rifarebbero</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Un Livello in Una Settimana
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="text-fi-intro-title">
                  Metodologia Immersiva ed Esperienziale
                </h2>
              </div>
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
              <p className="text-xl font-semibold text-foreground text-center py-8">
                Non si tratta solo di imparare...<br />
                Si tratta di scoprire quanto l'inglese che hai dentro può diventare parte di te.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="text-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">30+</p>
                  <p className="text-xs text-muted-foreground">Ore frontali</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">1-8</p>
                  <p className="text-xs text-muted-foreground">Partecipanti</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">+1</p>
                  <p className="text-xs text-muted-foreground">Livello QCER</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Target className="w-3 h-3 mr-1" />
                Programma Interdisciplinare
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-program-title">
                Quattro Aree Tematiche, Quattro Docenti
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Quattro sessioni da 90 minuti al giorno, ciascuna guidata da un coach madrelingua esperto nel proprio topic. Il programma è customizzato e interdisciplinare: ogni partecipante diventa protagonista attivo del proprio apprendimento.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
              {programTopics.map((topic, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  data-testid={`card-fi-topic-${index}`}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${topic.gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{topic.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Calendar className="w-3 h-3 mr-1" />
                  La Settimana Tipo
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-day-title">
                  Come Si Vive il Full Immersion
                </h2>
              </div>
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                Ogni giorno i topic ruotano, per tenerti sempre stimolato e farti vivere la lingua da prospettive diverse. Il venerdi si conclude con l'Elevator Pitch: la tua presentazione finale in inglese.
              </p>
              <div className="overflow-x-auto" data-testid="table-fi-schedule">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-muted-foreground font-medium border-b border-border/50 w-[130px]">Orario</th>
                      <th className="p-3 text-center font-bold text-white bg-primary rounded-tl-lg">Lunedi</th>
                      <th className="p-3 text-center font-bold text-white bg-primary/90">Martedi</th>
                      <th className="p-3 text-center font-bold text-white bg-primary/80">Mercoledi</th>
                      <th className="p-3 text-center font-bold text-white bg-primary/70">Giovedi</th>
                      <th className="p-3 text-center font-bold text-white bg-primary/60 rounded-tr-lg">Venerdi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">9,00-10,30</td>
                      <td className="p-3 text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20">Small Talk & Ear Training</td>
                      <td className="p-3 text-center text-muted-foreground bg-violet-50/50 dark:bg-violet-950/20">B&E Mindset</td>
                      <td className="p-3 text-center text-muted-foreground bg-primary/5">Language Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20">B&E Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20">Small Talk & Ear Training</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">10,30-12,00</td>
                      <td className="p-3 text-center text-muted-foreground bg-violet-50/50 dark:bg-violet-950/20">B&E Mindset</td>
                      <td className="p-3 text-center text-muted-foreground bg-primary/5">Language Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20">B&E Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20">Small Talk & Ear Training</td>
                      <td className="p-3 text-center text-muted-foreground bg-violet-50/50 dark:bg-violet-950/20">B&E Mindset</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">12,00-13,30</td>
                      <td className="p-3 text-center text-muted-foreground bg-primary/5">Language Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20">B&E Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20">Small Talk & Ear Training</td>
                      <td className="p-3 text-center text-muted-foreground bg-violet-50/50 dark:bg-violet-950/20">B&E Mindset</td>
                      <td className="p-3 text-center text-muted-foreground bg-amber-50/50 dark:bg-amber-950/20 font-medium italic">Final Event Preparation</td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/30">
                      <td className="p-3 font-medium text-foreground">13,30-15,00</td>
                      <td className="p-3 text-center text-muted-foreground italic">Lunch-break</td>
                      <td className="p-3 text-center text-muted-foreground italic">Lunch-break</td>
                      <td className="p-3 text-center text-muted-foreground italic">Lunch-break</td>
                      <td className="p-3 text-center text-muted-foreground italic">Lunch-break</td>
                      <td className="p-3 text-center text-muted-foreground italic">Lunch-break</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">15,00-16,30</td>
                      <td className="p-3 text-center text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20">B&E Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20">Small Talk & Ear Training</td>
                      <td className="p-3 text-center text-muted-foreground bg-violet-50/50 dark:bg-violet-950/20">B&E Mindset</td>
                      <td className="p-3 text-center text-muted-foreground bg-primary/5">Language Studies</td>
                      <td className="p-3 text-center text-muted-foreground bg-amber-50/50 dark:bg-amber-950/20 font-semibold">Final Event (Elevator Pitch)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        <span className="text-xs uppercase tracking-wider text-primary font-bold block">Potenziamento</span>
                        16,30-18,00
                      </td>
                      <td className="p-3 text-center font-semibold text-primary bg-primary/10">Extension</td>
                      <td className="p-3 text-center font-semibold text-primary bg-primary/10">Extension</td>
                      <td className="p-3 text-center font-semibold text-primary bg-primary/10">Extension</td>
                      <td className="p-3 text-center font-semibold text-primary bg-primary/10">Extension</td>
                      <td className="p-3 text-center text-muted-foreground"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-6">
                B&E Studies = Specialist & Executive Language | B&E Mindset = Specialist & Executive Mindset
              </p>
            </div>
          </div>
        </section>

        <section id="formats-section" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Calendar className="w-3 h-3 mr-1" />
                Il Corso Giusto per Te
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-formats-title">
                Scegli il Tuo Formato
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ogni persona ha il suo modo di imparare. Per questo abbiamo creato formati diversi, ognuno pensato per un tipo diverso di esperienza. Quello che li accomuna è il risultato.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {formats.map((format, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
                  data-testid={`card-fi-format-${index}`}
                >
                  <div className={`h-2 bg-gradient-to-r ${format.color}`} />
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${format.color} flex items-center justify-center shadow-md`}>
                        <format.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{format.title}</h3>
                        <p className="text-sm text-muted-foreground">{format.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{format.description}</p>
                    <div className="space-y-3">
                      {format.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Award className="w-3 h-3 mr-1" />
                  Risultati Garantiti
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-results-title">
                  Competenze e Risultati
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Chi partecipa ottiene risultati migliori rispetto ai format tradizionali: punteggi superiori nei test finali, soddisfazione più alta, un cambiamento tangibile e misurabile. La formula intensiva permette di affidarsi pienamente al team docente in ogni fase — lezione, esercitazione, consolidamento, verifica — fino all'Elevator Pitch finale.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">Comunicazione orale e scritta in contesti professionali</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">Consapevolezza e gestione delle differenze interculturali</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">Leadership, team-working, public speaking e pensiero creativo</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">Foundation e Consolidation</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  L'esperienza non si conclude con l'ultima lezione. Dopo la settimana intensiva, hai accesso automatico a un programma di consolidamento per valorizzare al massimo il tuo investimento.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">3 Mesi di E-Learning</h3>
                        <p className="text-sm text-muted-foreground">Piattaforma interattiva 24/7</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Contenuti strutturati per il consolidamento — grammatica, listening, reading, writing, pronuncia — sempre disponibili, quando e dove vuoi.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Mic2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">3 Mesi di Speaker's Corner</h3>
                        <p className="text-sm text-muted-foreground">Conversazione con coach madrelingua</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sessioni di conversazione per mantenere attiva e fluida la tua capacità di esprimerti in inglese. Prenota quando vuoi.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                    <Users className="w-3 h-3 mr-1" />
                    A Chi è Rivolto
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-fi-audience-title">
                    Per Chi Vuole Fare il Salto
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Professionisti, studenti universitari, freelance, viaggiatori, insegnanti — chiunque voglia migliorare rapidamente fluidità e sicurezza in inglese, per usarlo con naturalezza in contesti professionali e nella vita quotidiana.
                    </p>
                    <p>
                      Particolarmente adatto a chi ha poco tempo e impegni che rendono difficile seguire corsi regolari. In una sola settimana, un'esperienza intensiva e su misura che sblocca il tuo inglese in modo diretto e duraturo.
                    </p>
                    <p className="font-medium text-foreground">
                      Quando il metodo si adatta a te — e non il contrario — scoprire quanto puoi evolvere diventa solo questione di giorni.
                    </p>
                  </div>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                    <Award className="w-3 h-3 mr-1" />
                    Livelli e Requisiti
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-fi-levels-title">
                    Livelli Disponibili
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { level: "A2", name: "Pre-intermediate" },
                      { level: "B1", name: "Intermediate" },
                      { level: "B2", name: "Upper-intermediate" },
                      { level: "C1", name: "Advanced" },
                    ].map((item) => (
                      <div key={item.level} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.level}
                        </div>
                        <span className="text-foreground font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">Test di ingresso online incluso.</p>
                    <p>
                      Aperto a tutti con conoscenza minima dell'inglese. Accesso con corso A2+ negli ultimi 3 anni con Interlingua, oppure superando il test online con almeno il 40%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Star className="w-3 h-3 mr-1" />
                Parola di Chi C'era
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-testimonials-title">
                Non Crederci Sulla Parola. Credi a Loro.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sono tornati a casa con un inglese migliore e la voglia di rifarlo. Ecco cosa dicono.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                  data-testid={`card-fi-testimonial-${index}`}
                >
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-primary/20 mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{testimonial.author[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact-section" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white/90">Posti Limitati</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" data-testid="text-fi-cta-title">
                La Prossima Settimana Che Cambierà il Tuo Inglese
              </h2>
              <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                I gruppi sono piccoli. I posti si esauriscono. Se stai leggendo fin qui, qualcosa ti dice che è il momento giusto.
              </p>
              <p className="text-lg text-white/65 mb-10 max-w-2xl mx-auto leading-relaxed">
                Contattaci per scoprire le prossime date e riservare il tuo posto. Una chiacchierata al telefono o un'email: è tutto quello che serve per iniziare.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl"
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
                  className="h-14 px-8 text-base rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
