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
  Zap,
  Globe,
  Heart,
  Coffee,
} from "lucide-react";
import fullImmersionImage from "@assets/Full-Immersion-Workshop-di-Lingua-Inglese_1772143747179.jpg";

const benefits = [
  {
    icon: TrendingUp,
    title: "Un Livello in Una Settimana",
    description: "Forse non te ne accorgi subito, ma già dal secondo giorno qualcosa dentro di te inizia a cambiare. Le parole arrivano più facilmente, le frasi si formano da sole. E quando venerdì ti rendi conto di aver fatto un salto di un intero livello QCER, capisci che il cambiamento era già iniziato prima ancora che potessi notarlo.",
    gradient: "from-primary/10 to-blue-500/10",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Solo Inglese. Naturalmente.",
    description: "C'è quel momento, forse al secondo caffè, forse durante una risata, in cui ti accorgi che stai pensando in inglese. Non stai più traducendo. Il tuo cervello ha semplicemente scelto la via più naturale, e tu puoi goderti la sensazione di esprimerti con una fluidità che non sapevi di avere.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
  {
    icon: Users,
    title: "Persone Come Te",
    description: "Quando sei circondato da persone che condividono la tua stessa curiosità e la tua stessa voglia di crescere, succede qualcosa di speciale. In gruppi di massimo 12, ognuno trova il proprio spazio per esprimersi, e tu scopri che gli altri sono la risorsa più preziosa per il tuo apprendimento.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: Award,
    title: "Guide che Ispirano",
    description: "Ci sono insegnanti che spiegano, e poi ci sono quelli che ti fanno sentire capace. I nostri docenti madrelingua hanno quel dono raro di creare uno spazio in cui ti senti libero di provare, di sbagliare, di scoprire che sai molto più di quanto pensavi.",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600",
  },
];

const programFeatures = [
  "Moduli progettati per massimizzare ogni singola ora",
  "Perfetto equilibrio tra impegno, pratica e risultati",
  "Progetti reali e simulazioni professionali",
  "Attività collaborative che ti fanno dimenticare di stare studiando",
  "Tutti i materiali didattici inclusi",
  "Attestato di partecipazione con livello QCER raggiunto",
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
    text: "Ho vissuto una settimana full immersion con Interlingua. Professionalità, motivazione e una grande carica di energia sono solo alcuni degli ingredienti di questa bellissima e riuscitissima esperienza.",
    author: "Laura Bertolino",
  },
];

const formats = [
  {
    title: "Full Immersion Workshop",
    subtitle: "Cinque giorni che portano lontano",
    description: "Alcune persone vanno a Londra per migliorare l'inglese. Altre scelgono di venire a Vicenza, dove tutto è progettato perché il cambiamento accada nel modo più profondo e naturale possibile. E spesso, chi sceglie questa strada, si sorprende di quanto lontano arriva restando vicino a casa.",
    features: ["5 giorni intensivi (lun-ven)", "6 ore al giorno di pratica attiva", "Dal livello A2 al C1", "In sede a Vicenza"],
    color: "from-primary to-blue-600",
    icon: BookOpen,
  },
  {
    title: "Experiential Weekend",
    subtitle: "Quando il corpo impara insieme alla mente",
    description: "Ci sono esperienze che ti cambiano senza che tu te ne renda conto. Un weekend sui Colli Berici, tra cavalli, natura e sfide di leadership, tutto in inglese. Quando torni a casa, porti con te qualcosa di più di un inglese migliore: porti una nuova consapevolezza di quello che sei capace di fare.",
    features: ["2 giorni immersivi (sab-dom)", "Attività outdoor ed equitazione", "Leadership & team building", "Colli Berici, provincia di Vicenza"],
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
                  Sai già che il tuo inglese potrebbe essere migliore. Forse lo senti quando cerchi una parola che è lì, sulla punta della lingua, ma non esce. O quando capisci tutto, ma rispondere ti sembra un'altra cosa. Quella sensazione ti sta dicendo qualcosa.
                </p>
                <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">
                  In cinque giorni di immersione totale, succede qualcosa che mesi di studio tradizionale non riescono a darti: il tuo inglese smette di essere qualcosa che sai e diventa qualcosa che sei. I nostri docenti madrelingua sanno esattamente come guidarti in quel passaggio, nel modo più naturale possibile.
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

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                Perché Funziona
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-benefits-title">
                Quello Che Succede Dentro di Te
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                Alcune cose si capiscono solo vivendole. Chi ha partecipato racconta sempre dello stesso momento: quel punto in cui smetti di pensare all'inglese come a qualcosa di difficile e inizi semplicemente a usarlo. Come se una porta che era sempre stata lì si fosse finalmente aperta.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                  data-testid={`card-fi-benefit-${index}`}
                >
                  <CardContent className="pt-8 pb-6 text-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mx-auto mb-5`}>
                        <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-foreground mb-2 text-lg">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Coffee className="w-3 h-3 mr-1" />
                  Una Giornata Tipo
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-day-title">
                  Lasciati Portare dalla Giornata
                </h2>
              </div>
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                Non sai ancora esattamente cosa accadrà, ma puoi già immaginarlo. Arrivi la mattina, e qualcosa nell'aria ti dice che questa non sarà una giornata qualunque. Ogni momento è pensato per farti dimenticare che stai imparando, e lasciarti semplicemente vivere l'inglese come se fosse sempre stato parte di te.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { time: "9:00 - 10:30", title: "Warm-up & Discussion", desc: "Ti ritrovi a discutere di qualcosa che ti appassiona, e senza accorgertene stai già parlando con una scioltezza che ieri non avevi. Le parole iniziano a venire da sole.", icon: Sparkles },
                  { time: "10:30 - 11:00", title: "Coffee Break", desc: "È durante il caffè che succedono le cose più interessanti. Quando parli perché vuoi, non perché devi, scopri qualcosa di nuovo su te stesso e sul tuo inglese.", icon: Coffee },
                  { time: "11:00 - 13:00", title: "Workshop Intensivo", desc: "Presentazioni, negoziazioni, simulazioni. Ogni attività ti fa sentire un po' più sicuro di prima, e quel senso di sicurezza resta con te anche dopo.", icon: Target },
                  { time: "14:00 - 16:00", title: "Progetto di Gruppo", desc: "Lavori con persone che, come te, hanno scelto di fare questo passo. E mentre costruite qualcosa insieme, vi accorgete che l'inglese è diventato semplicemente il vostro modo di comunicare.", icon: Users },
                ].map((slot, index) => (
                  <div
                    key={index}
                    className="group relative flex gap-5 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    data-testid={`slot-fi-${index}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-primary-foreground shadow-md shadow-primary/25">
                        <slot.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{slot.time}</p>
                      <h3 className="font-bold text-foreground text-lg mb-1">{slot.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{slot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="formats-section" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Calendar className="w-3 h-3 mr-1" />
                Due Modi per Immergersi
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-formats-title">
                Scegli la Tua Avventura
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Due formati, un solo obiettivo: farti vivere l'inglese come non l'hai mai vissuto.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Target className="w-3 h-3 mr-1" />
                  Tutto Incluso
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-program-title">
                  Cosa Porti a Casa
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Oltre a un inglese che finalmente funziona nella vita reale.
                </p>
              </div>
              <Card className="overflow-hidden border-primary/20 shadow-xl shadow-primary/5" data-testid="card-fi-program">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-1">
                  <CardContent className="p-8 md:p-10 bg-card rounded-lg">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {programFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">30+</p>
                        <p className="text-xs text-muted-foreground">Ore di pratica</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">Max 12</p>
                        <p className="text-xs text-muted-foreground">Partecipanti</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">+1</p>
                        <p className="text-xs text-muted-foreground">Livello QCER</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
