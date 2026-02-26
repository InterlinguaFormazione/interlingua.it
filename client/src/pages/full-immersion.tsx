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
} from "lucide-react";
import fullImmersionImage from "@assets/Full-Immersion-Workshop-di-Lingua-Inglese_1772143747179.jpg";

const benefits = [
  {
    icon: TrendingUp,
    title: "Guadagna un Livello QCER",
    description: "Avanza di un livello in una sola settimana grazie alla pratica intensiva e costante.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600",
  },
  {
    icon: Globe,
    title: "100% in Inglese",
    description: "Immersione totale nella lingua per massimizzare l'apprendimento naturale.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Piccoli Gruppi",
    description: "Classi ridotte per garantire attenzione personalizzata e massima interazione.",
    gradient: "from-purple-500/10 to-violet-500/10",
    iconColor: "text-purple-600",
  },
  {
    icon: Award,
    title: "Docenti Madrelingua",
    description: "Staff qualificato con anni di esperienza nell'insegnamento full immersion.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
];

const programFeatures = [
  "Moduli intensivi progettati per massimizzare i risultati",
  "Perfetto equilibrio tra impegno, studio e risultati",
  "Progetti pratici e attività collaborative",
  "Simulazioni di situazioni reali e professionali",
  "Materiali didattici inclusi",
  "Attestato di partecipazione con livello raggiunto",
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
    subtitle: "Una settimana intensiva",
    description: "5 giorni di immersione totale nella lingua inglese a Vicenza. L'alternativa conveniente ed efficace ai soggiorni studio all'estero.",
    features: ["5 giorni intensivi (lun-ven)", "6 ore al giorno di lezione", "Tutti i livelli", "In sede a Vicenza"],
    color: "from-green-500 to-green-600",
    icon: BookOpen,
  },
  {
    title: "Experiential Weekend",
    subtitle: "Weekend esperienziali",
    description: "Weekend outdoor sui Colli Berici con attività esperienziali come equitazione, leadership e team building, tutto in lingua inglese.",
    features: ["2 giorni (sab-dom)", "Attività outdoor", "Leadership & team building", "Colli Berici, Vicenza"],
    color: "from-emerald-500 to-teal-600",
    icon: Mountain,
  },
];

export default function FullImmersionPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="relative pt-36 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
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
                  Impara l'Inglese nel Modo più Efficace
                </h1>
                <p className="text-xl text-white/85 mb-4 leading-relaxed max-w-xl">
                  L'alternativa conveniente ed efficace ai soggiorni studio all'estero.
                </p>
                <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">
                  Guadagna un livello QCER in una sola settimana con i nostri workshop intensivi a Vicenza.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base rounded-xl bg-white text-green-700 hover:bg-white/90 shadow-xl"
                    onClick={() => {
                      const el = document.querySelector("#contact-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    data-testid="button-fi-cta"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Richiedi Informazioni
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
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-500" />
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
                        <MapPin className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Vicenza</p>
                        <p className="text-xs text-muted-foreground">In sede e outdoor</p>
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
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                I Vantaggi
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-benefits-title">
                Perché Scegliere il Full Immersion?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un metodo collaudato che unisce intensità, qualità e risultati concreti.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-border/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-1"
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

        <section id="formats-section" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Calendar className="w-3 h-3 mr-1" />
                I Nostri Formati
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-formats-title">
                Scegli il Formato Ideale per Te
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Due esperienze immersive progettate per diverse esigenze e obiettivi.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {formats.map((format, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-border/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl"
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
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
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

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Target className="w-3 h-3 mr-1" />
                  Il Programma
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-program-title">
                  Cosa Include il Workshop
                </h2>
              </div>
              <Card className="overflow-hidden border-green-500/20 shadow-xl shadow-green-500/5" data-testid="card-fi-program">
                <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent p-1">
                  <CardContent className="p-8 md:p-10 bg-card rounded-lg">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {programFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">30+</p>
                        <p className="text-xs text-muted-foreground">Ore di lezione</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">Max 12</p>
                        <p className="text-xs text-muted-foreground">Partecipanti</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-green-600" />
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

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Star className="w-3 h-3 mr-1" />
                Testimonianze
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-fi-testimonials-title">
                Cosa Dice Chi Ha Partecipato
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Le esperienze reali dei nostri partecipanti.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-green-500/20 transition-all duration-300 hover:shadow-lg"
                  data-testid={`card-fi-testimonial-${index}`}
                >
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-green-500/30 mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">{testimonial.author[0]}</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white/90">Prossime Date</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" data-testid="text-fi-cta-title">
                Vuoi Partecipare al Prossimo Workshop?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Contattaci per scoprire le prossime date disponibili e riservare il tuo posto.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base rounded-xl bg-white text-green-700 hover:bg-white/90 shadow-xl"
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
