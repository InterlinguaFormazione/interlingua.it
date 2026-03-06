import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useSEO } from "@/hooks/use-seo";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  Star,
  Sparkles,
  Navigation as NavigationIcon,
  Car,
  Train,
  Globe,
} from "lucide-react";
import { Link } from "wouter";
import vicenzaCity from "@assets/vicenza_1772179633305.jpg";
import classroomVicenza from "@assets/corso-di-inglese-vicenza_1769355404957.jpg";
import aboutTeaching from "@/assets/images/about-teaching.jpg";
import thieneTown from "@/assets/images/thiene-town.png";

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

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const locations = [
  {
    name: "Sede di Vicenza",
    subtitle: "Sede Principale — dal 1993",
    address: "Viale Giuseppe Mazzini, 27",
    city: "36100 Vicenza (VI)",
    phone: "+39 0444 321601",
    email: "infocorsi@skillcraft.interlingua.it",
    hours: [
      { days: "Lunedì - Giovedì", time: "8:30 - 12:30 / 15:30 - 20:00" },
      { days: "Venerdì", time: "8:30 - 12:30 / 15:30 - 19:00" },
      { days: "Sabato - Domenica", time: "Chiuso" },
    ],
    description: "La nostra sede principale nel cuore di Vicenza, la città del Palladio. Facilmente raggiungibile a piedi dal centro storico, offre aule moderne e tecnologicamente attrezzate per corsi individuali e di gruppo.",
    features: ["Aule multimediali", "Parcheggio nelle vicinanze", "Zona centrale", "Accessibile"],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.6!2d11.5478!3d45.5493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477f2e0b2a5d9f5f%3A0x0!2sViale+Giuseppe+Mazzini+27+Vicenza!5e0!3m2!1sit!2sit!4v1",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    accent: "blue",
    directions: [
      { icon: Car, text: "A4 Autostrada — uscita Vicenza Ovest, 10 min dal casello" },
      { icon: Train, text: "Stazione FS Vicenza — 15 min a piedi o 5 min in autobus (linea 1)" },
    ],
  },
  {
    name: "Sede di Thiene",
    subtitle: "Alto Vicentino — dal 1998",
    address: "Corso Garibaldi, 174",
    city: "36016 Thiene (VI)",
    phone: "+39 0445 382744",
    email: "infocorsi@skillcraft.interlingua.it",
    hours: [
      { days: "Lunedì - Venerdì", time: "14:00 - 20:00" },
      { days: "Sabato - Domenica", time: "Chiuso" },
    ],
    description: "Il punto di riferimento per la formazione linguistica nell'Alto Vicentino. Situata nel centro di Thiene, la sede offre un ambiente accogliente e professionale per studenti e professionisti della zona.",
    features: ["Ambiente accogliente", "Facile parcheggio", "Centro città", "Accessibile"],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2790.5!2d11.4767!3d45.7084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477f2e0b2a5d9f5f%3A0x0!2sCorso+Garibaldi+174+Thiene!5e0!3m2!1sit!2sit!4v1",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accent: "emerald",
    directions: [
      { icon: Car, text: "Superstrada Pedemontana — uscita Thiene, 5 min dal casello" },
      { icon: Train, text: "Stazione FTV Thiene — 10 min a piedi lungo Corso Garibaldi" },
    ],
  },
];

const highlights = [
  { icon: GraduationCap, label: "30+ anni di esperienza", desc: "Formazione dal 1993" },
  { icon: Users, label: "2 sedi operative", desc: "Vicenza e Thiene" },
  { icon: Globe, label: "10+ lingue insegnate", desc: "Docenti qualificati" },
  { icon: Star, label: "15.000+ studenti formati", desc: "Privati e aziende" },
];

export default function SediPage() {
  useSEO({
    title: "Le Nostre Sedi | Vicenza e Thiene | SkillCraft-Interlingua",
    description: "Sedi SkillCraft-Interlingua: Viale Mazzini 27, Vicenza e Thiene. Scuola di lingue dal 1993. Raggiungi facilmente le nostre aule per i corsi di lingue.",
    canonical: "/sedi",
  });
  const heroRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen relative">
      <Breadcrumb items={[{ label: "Le Nostre Sedi", href: "/sedi" }]} schemaOnly />
      <Navigation />
      <main>
        <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 animate-gradient-shift" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="fi-hero-orb w-[500px] h-[500px] bg-blue-500/15 -top-20 -right-20" />
            <div className="fi-hero-orb w-[400px] h-[400px] bg-indigo-500/10 bottom-0 -left-20" />
            <div className="fi-hero-orb w-[300px] h-[300px] bg-violet-500/10 top-1/3 right-1/4" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />
          </div>

          <motion.div style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" /> Vicenza e Thiene
                </Badge>
              </motion.div>

              <motion.h1
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6"
              >
                <span className="text-white">Le Nostre </span>
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Sedi</span>
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Due sedi nel cuore del Vicentino per essere sempre vicini a te. Vieni a trovarci per scoprire i nostri corsi e servizi.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a href="#vicenza">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-white text-blue-700 hover:bg-white/90 shadow-2xl font-bold" data-testid="button-go-vicenza">
                    <Building2 className="w-5 h-5 mr-2" /> Sede Vicenza
                  </Button>
                </a>
                <a href="#thiene">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm font-medium" data-testid="button-go-thiene">
                    <Building2 className="w-5 h-5 mr-2" /> Sede Thiene
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto"
              >
                {highlights.map((h, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md px-4 py-4 rounded-2xl border border-white/10 text-center">
                    <h.icon className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
                    <p className="text-white font-bold text-sm">{h.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{h.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="relative py-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Dove Siamo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="gradient-text">Due sedi, una missione</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Dal 1993 formiamo professionisti e studenti con passione e competenza. Le nostre sedi sono progettate per offrirti il miglior ambiente di apprendimento.
              </p>
            </AnimatedSection>

            {locations.map((loc, idx) => (
              <AnimatedSection key={loc.name} className="mb-20">
                <div id={idx === 0 ? "vicenza" : "thiene"} className="scroll-mt-24" />
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="order-2 lg:order-1">
                    <Card className="rounded-3xl border-0 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden bg-white dark:bg-slate-800/80">
                      <div className={`h-2 bg-gradient-to-r ${loc.gradient}`} />
                      <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${loc.gradient} flex items-center justify-center shadow-lg`}>
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-extrabold text-foreground" data-testid={`text-location-name-${idx}`}>{loc.name}</h3>
                            <p className="text-sm text-muted-foreground">{loc.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mt-4 mb-6">{loc.description}</p>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className={`w-5 h-5 mt-0.5 text-${loc.accent}-500 shrink-0`} />
                            <div>
                              <p className="font-semibold text-foreground">{loc.address}</p>
                              <p className="text-sm text-muted-foreground">{loc.city}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Phone className={`w-5 h-5 text-${loc.accent}-500 shrink-0`} />
                            <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="font-semibold text-foreground hover:underline" data-testid={`link-phone-${idx}`}>
                              {loc.phone}
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            <Mail className={`w-5 h-5 text-${loc.accent}-500 shrink-0`} />
                            <a href={`mailto:${loc.email}`} className="text-sm text-muted-foreground hover:underline" data-testid={`link-email-${idx}`}>
                              {loc.email}
                            </a>
                          </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className={`w-4 h-4 text-${loc.accent}-500`} />
                            <span className="font-bold text-sm text-foreground">Orari Segreteria</span>
                          </div>
                          <div className="space-y-2">
                            {loc.hours.map((h, i) => (
                              <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{h.days}</span>
                                <span className={`font-semibold ${h.time === "Chiuso" ? "text-red-500" : "text-foreground"}`}>{h.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Servizi</p>
                          <div className="flex flex-wrap gap-2">
                            {loc.features.map((f, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-foreground px-3 py-1.5 rounded-full">
                                <CheckCircle className="w-3 h-3 text-green-500" /> {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Come Raggiungerci</p>
                          {loc.directions.map((d, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <d.icon className={`w-4 h-4 text-${loc.accent}-500 shrink-0`} />
                              <span>{d.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                          <a href={`tel:${loc.phone.replace(/\s/g, "")}`}>
                            <Button className={`rounded-xl bg-gradient-to-r ${loc.gradient} text-white shadow-lg hover:opacity-90`} data-testid={`button-call-${idx}`}>
                              <Phone className="w-4 h-4 mr-2" /> Chiama
                            </Button>
                          </a>
                          <a href={`mailto:${loc.email}`}>
                            <Button variant="outline" className="rounded-xl" data-testid={`button-email-${idx}`}>
                              <Mail className="w-4 h-4 mr-2" /> Scrivi
                            </Button>
                          </a>
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address + ", " + loc.city)}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="rounded-xl" data-testid={`button-directions-${idx}`}>
                              <NavigationIcon className="w-4 h-4 mr-2" /> Indicazioni
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="order-1 lg:order-2 space-y-5">
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800">
                      <iframe
                        src={loc.mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mappa ${loc.name}`}
                        className="w-full"
                        data-testid={`map-${idx}`}
                      />
                    </div>

                    {idx === 0 && (
                      <>
                        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
                          <img
                            src={vicenzaCity}
                            alt="Piazza dei Signori e Basilica Palladiana — Vicenza"
                            className="w-full h-52 object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-sm font-semibold text-foreground">Piazza dei Signori — Basilica Palladiana</p>
                            <p className="text-xs text-muted-foreground mt-1">A pochi passi dalla nostra sede nel centro storico</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                            <img
                              src={classroomVicenza}
                              alt="Lezione in aula — Sede di Vicenza"
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="bg-white dark:bg-slate-800 px-4 py-3">
                              <p className="text-xs font-semibold text-foreground">Le nostre aule</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Lezione in sede</p>
                            </div>
                          </div>
                          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                            <img
                              src="/images/team/giulia-vicenza.webp"
                              alt="Giulia — Responsabile sede Vicenza"
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="bg-white dark:bg-slate-800 px-4 py-3">
                              <p className="text-xs font-semibold text-foreground">Giulia</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Responsabile sede</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {idx === 1 && (
                      <>
                        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
                          <img
                            src={thieneTown}
                            alt="Corso Garibaldi — Thiene, ai piedi dell'Altopiano di Asiago"
                            className="w-full h-52 object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-sm font-semibold text-foreground">Thiene — Città ai piedi dell'Altopiano</p>
                            <p className="text-xs text-muted-foreground mt-1">Corso Garibaldi, cuore del centro storico</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                            <img
                              src={aboutTeaching}
                              alt="Formazione linguistica — Sede di Thiene"
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="bg-white dark:bg-slate-800 px-4 py-3">
                              <p className="text-xs font-semibold text-foreground">Formazione</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Corsi di lingua</p>
                            </div>
                          </div>
                          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                            <img
                              src="/images/team/elena-thiene.webp"
                              alt="Elena — Responsabile sede Thiene"
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="bg-white dark:bg-slate-800 px-4 py-3">
                              <p className="text-xs font-semibold text-foreground">Elena</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Responsabile sede</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="fi-hero-orb w-[400px] h-[400px] bg-blue-500/10 -top-20 right-1/4" />
            <div className="fi-hero-orb w-[300px] h-[300px] bg-cyan-500/10 bottom-0 -left-10" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  <span className="text-white">Vieni a </span>
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Trovarci</span>
                </h2>
                <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Prenota una consulenza gratuita o passa a trovarci per scoprire il corso più adatto a te.
                </p>
                <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Il nostro team è pronto ad accoglierti e guidarti nella scelta del percorso formativo ideale.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-cyan-300" />
                      <h3 className="text-lg font-bold text-white">Vicenza</h3>
                    </div>
                    <p className="text-sm text-white/60 mb-3">Viale Giuseppe Mazzini 27</p>
                    <a href="tel:+390444321601" className="inline-flex items-center gap-2 text-white hover:text-cyan-300 transition-colors font-semibold" data-testid="button-sedi-call-vicenza">
                      <Phone className="w-4 h-4" />
                      0444 321601
                    </a>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-indigo-300" />
                      <h3 className="text-lg font-bold text-white">Thiene</h3>
                    </div>
                    <p className="text-sm text-white/60 mb-3">Corso Garibaldi 174</p>
                    <a href="tel:+390445382744" className="inline-flex items-center gap-2 text-white hover:text-indigo-300 transition-colors font-semibold" data-testid="button-sedi-call-thiene">
                      <Phone className="w-4 h-4" />
                      0445 382744
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-5">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/25 text-white hover:bg-white/10 backdrop-blur-sm font-medium" asChild data-testid="button-sedi-email">
                    <a href="mailto:infocorsi@skillcraft.interlingua.it">
                      <Mail className="w-5 h-5 mr-2" />
                      infocorsi@skillcraft.interlingua.it
                    </a>
                  </Button>
                  <Link href="/test-di-livello">
                    <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 font-bold" data-testid="button-sedi-test">
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