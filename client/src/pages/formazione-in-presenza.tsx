import { useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
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
} from "lucide-react";
import { Link } from "wouter";
import lingueStraniereImage from "@assets/lingue-straniere_1772143318023.webp";
import languageCoachingImage from "@assets/Language_Coaching_1772143397641.webp";
import managementImage from "@assets/management-leadership_1772143822898.webp";
import categoryPresence from "@/assets/images/category-presence.jpg";
import courseIndividual from "@/assets/images/course-individual.jpg";
import courseExcel from "@/assets/images/course-excel.jpg";
import courseAi from "@/assets/images/course-ai.jpg";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const courses = [
  {
    id: "corsi-gruppo",
    title: "Corsi di Gruppo",
    subtitle: "Lingue straniere per tutti i livelli",
    description: "Formazione linguistica strutturata, efficace e certificata per inglese, francese, tedesco, spagnolo, russo e italiano per stranieri, suddivisa per livello QCER.",
    image: lingueStraniereImage,
    price: "340",
    duration: "12 settimane",
    gradient: "from-purple-500 to-purple-600",
    icon: Globe,
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
    description: "Formazione linguistica modulare per 1 o 2 partecipanti in inglese, francese, tedesco, spagnolo, russo o italiano, per la massima personalizzazione del percorso.",
    image: courseIndividual,
    price: "da 300",
    duration: "Modulare",
    gradient: "from-indigo-500 to-indigo-600",
    icon: UserCheck,
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
    description: "Formazione linguistica modulare per 1 partecipante in inglese, francese, tedesco o spagnolo. Un percorso ibrido che combina lezioni in sede con la piattaforma e-learning 24/7.",
    image: languageCoachingImage,
    price: "645",
    duration: "12 settimane",
    gradient: "from-teal-500 to-teal-600",
    icon: Monitor,
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
    description: "Impara a utilizzare Office in modo efficace, a gestire dati, report e formule con Excel, e a sfruttare l'intero pacchetto incluso Copilot per velocizzare e semplificare il lavoro quotidiano.",
    image: courseExcel,
    price: "340",
    duration: "Corso completo",
    gradient: "from-blue-500 to-blue-600",
    icon: Cpu,
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
    description: "Impara a utilizzare strumenti e applicazioni di AI per aumentare la produttività, scrivere testi più efficaci, velocizzare e automatizzare il lavoro e stimolare la creatività.",
    image: courseAi,
    price: "340",
    duration: "Corso completo",
    gradient: "from-amber-500 to-orange-600",
    icon: Brain,
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

export default function FormazioneInPresenzaPage() {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main>
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={categoryPresence}
              alt="Formazione in presenza"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <Badge className="mb-6 bg-white/15 text-white border-white/20 backdrop-blur-sm px-4 py-2" data-testid="badge-fip-label">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                Corsi in Sede
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight" data-testid="text-fip-title">
                Formazione
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  in Presenza
                </span>
              </h1>
              <p className="text-xl text-white/85 mb-8 leading-relaxed max-w-2xl">
                Lingue, competenze digitali e crescita professionale. Corsi strutturati con docenti qualificati nella nostra sede di Vicenza e Thiene, certificati e riconosciuti.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-white/90 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                  Vicenza e Thiene
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-white/90 text-sm">
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  Nuovi corsi da febbraio 2026
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-white/90 text-sm">
                  <CreditCard className="w-4 h-4 text-cyan-300" />
                  Carta Cultura Giovani
                </div>
              </div>
              <Button
                size="lg"
                className="h-14 px-10 text-base rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-bold"
                onClick={() => document.querySelector("#contact-section")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-fip-cta"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Richiedi Informazioni
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Catalogo Corsi
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fip-catalog-title">
                  I Nostri Corsi
                  <span className="gradient-text"> in Sede</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Tutti i corsi si svolgono presso le nostre sedi di Vicenza e Thiene, con docenti madrelingua o qualificati, in piccoli gruppi per garantire la massima efficacia.
                </p>
              </div>
            </AnimatedSection>

            <div className="space-y-10 max-w-5xl mx-auto">
              {courses.map((course, index) => (
                <AnimatedSection key={course.id} delay={index * 0.08}>
                  <Card
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-500"
                    data-testid={`card-fip-course-${course.id}`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${course.gradient}`} />
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
                        <div className="relative h-56 md:h-full overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/10 md:bg-gradient-to-r md:from-transparent md:to-card/20" />
                          <div className="absolute top-4 left-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg`}>
                              <course.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-black/60 text-white border-0 backdrop-blur-md px-3 py-1.5 text-xs font-bold">
                              <CreditCard className="w-3 h-3 mr-1" />
                              {course.price === "Su richiesta" ? course.price : `${course.price} euro`}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-1">{course.title}</h3>
                              <p className="text-sm font-medium text-primary">{course.subtitle}</p>
                            </div>
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed my-4">{course.description}</p>
                          {course.highlight && (
                            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                              <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{course.highlight}</p>
                            </div>
                          )}
                          <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
                            {course.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  Perché Sceglierci
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight" data-testid="text-fip-why-title">
                  Il Metodo
                  <span className="gradient-text"> Interlingua</span>
                </h2>
              </div>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Users, title: "Piccoli Gruppi", desc: "Massima attenzione per ogni partecipante", gradient: "from-purple-500 to-purple-600" },
                { icon: Globe, title: "Docenti Madrelingua", desc: "Insegnanti qualificati e certificati", gradient: "from-blue-500 to-blue-600" },
                { icon: Award, title: "Certificazione", desc: "Attestato con livello QCER raggiunto", gradient: "from-emerald-500 to-teal-600" },
                { icon: Monitor, title: "E-Learning Incluso", desc: "Piattaforma interattiva 24/7", gradient: "from-amber-500 to-orange-600" },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-5 px-5 py-2">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Scopri di Più
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">
                  Esplora Anche i Nostri
                  <span className="gradient-text"> Percorsi Intensivi</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <Link href="/full-immersion">
                    <Card className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 cursor-pointer h-full" data-testid="link-fip-immersion">
                      <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Full Immersion Workshop</h3>
                        <p className="text-sm text-muted-foreground mb-3">Un livello QCER in una settimana. 30+ ore frontali con team di coach madrelingua.</p>
                        <span className="inline-flex items-center gap-1 text-primary font-medium text-sm">
                          Scopri di più <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/speakers-corner">
                    <Card className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 cursor-pointer h-full" data-testid="link-fip-speakers">
                      <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Speaker's Corner</h3>
                        <p className="text-sm text-muted-foreground mb-3">Pratica la conversazione in inglese ogni venerdi con docenti madrelingua.</p>
                        <span className="inline-flex items-center gap-1 text-primary font-medium text-sm">
                          Scopri di più <ArrowRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="contact-section" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 animate-gradient-shift" />
          <div className="fi-hero-orb w-[500px] h-[500px] bg-cyan-400 top-[-150px] right-[-100px]" />
          <div className="fi-hero-orb w-[400px] h-[400px] bg-blue-500 bottom-[-100px] left-[-100px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  <span className="text-sm font-bold text-white/90 tracking-wide">Iscrizioni Aperte</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight tracking-tight" data-testid="text-fip-cta-title">
                  Inizia il Tuo
                  <br />
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    Percorso Formativo
                  </span>
                </h2>
                <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Contattaci per informazioni su date, livelli disponibili e prezzi. Ti aiutiamo a trovare il corso perfetto per i tuoi obiettivi.
                </p>
                <p className="text-lg text-white/55 mb-12 max-w-2xl mx-auto leading-relaxed">
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
