import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Award, 
  Users, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Building2, 
  GraduationCap,
  Briefcase,
  School,
  Building,
  MapPin,
  Phone,
  Mail,
  Star,
  Sparkles,
  Heart,
  Globe,
  Trophy,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

import aboutTeamImage from "@/assets/images/about-team.jpg";
import aboutTeachingImage from "@assets/digitalizzazione-tecnologie_1772392734563.webp";
import aboutVicenzaImage from "@/assets/images/about-vicenza.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const timelineEvents = [
  { year: "1992", event: "Fondazione di Interlingua come agenzia di traduzioni e corsi aziendali", highlight: false },
  { year: "1993", event: "Apertura della prima sede operativa a Vicenza", highlight: false },
  { year: "1998", event: "Inaugurazione della seconda sede a Thiene", highlight: false },
  { year: "2000", event: "Introduzione del Sistema di Gestione della Qualità", highlight: false },
  { year: "2003", event: "Primo ente di formazione linguistica accreditato in Veneto", highlight: true },
  { year: "2013", event: "Nuova sede in Viale Mazzini 27, Vicenza", highlight: false },
  { year: "2024", event: "Lancio di SkillCraft-Interlingua con AI e competenze digitali", highlight: true },
];

const stats = [
  { value: "30+", label: "Anni di Esperienza", icon: Trophy },
  { value: "15.000+", label: "Studenti Formati", icon: Users },
  { value: "500+", label: "Aziende Partner", icon: Building2 },
  { value: "50+", label: "Docenti Madrelingua", icon: GraduationCap },
];

const values = [
  { 
    icon: Target, 
    title: "Qualità", 
    description: "Standard formativi elevati con docenti qualificati e metodologie all'avanguardia",
    color: "from-purple-500 to-purple-600"
  },
  { 
    icon: Heart, 
    title: "Passione", 
    description: "Amore per l'insegnamento e dedizione al successo di ogni singolo studente",
    color: "from-pink-500 to-pink-600"
  },
  { 
    icon: Sparkles, 
    title: "Innovazione", 
    description: "Costante evoluzione metodologica integrando AI e tecnologie digitali",
    color: "from-teal-500 to-teal-600"
  },
  { 
    icon: Globe, 
    title: "Internazionalità", 
    description: "Network globale di docenti e partnership con istituzioni internazionali",
    color: "from-blue-500 to-blue-600"
  },
];

const methodologyPoints = [
  { title: "CLIL", description: "Content and Language Integrated Learning per contenuti professionali" },
  { title: "TBL", description: "Task-Based Learning con attività reali e materiali autentici" },
  { title: "TPR", description: "Total Physical Response e approccio multisensoriale" },
  { title: "Design Thinking", description: "Co-progettazione e problem solving creativo" },
];

const clientCategories = [
  {
    title: "Imprese",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    sectors: ["Metalmeccanica", "Oreficeria", "Industria chimica", "Tessile", "Alimentare"]
  },
  {
    title: "Servizi",
    icon: Briefcase,
    color: "from-green-500 to-green-600",
    sectors: ["Turismo", "Trasporti", "Energia", "Aeronautica", "Sanità"]
  },
  {
    title: "Professionisti",
    icon: GraduationCap,
    color: "from-purple-500 to-purple-600",
    sectors: ["Legale", "Brevetti", "Architettura", "Risorse Umane"]
  },
  {
    title: "Scuole",
    icon: School,
    color: "from-orange-500 to-orange-600",
    sectors: ["Lettorato", "Formazione docenti", "Progetti educativi"]
  },
  {
    title: "PA",
    icon: Building,
    color: "from-teal-500 to-teal-600",
    sectors: ["Enti locali", "Aggiornamento", "Progetti formativi"]
  },
];

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative pt-28 md:pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <Link href="/">
            <Button variant="ghost" className="mb-8" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1" />
                Dal 1993
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                La Tua Crescita è la{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Nostra Missione
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Oltre 30 anni di esperienza nella formazione professionale. 
                Primo ente accreditato in Veneto, oggi leader nell'integrazione di lingue, 
                AI e competenze digitali.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/#courses">
                  <Button size="lg" data-testid="button-discover-courses">
                    Scopri i Corsi
                  </Button>
                </Link>
                <Link href="/#contact">
                  <Button variant="outline" size="lg" data-testid="button-contact">
                    Contattaci
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={aboutTeamImage} 
                  alt="Il nostro team" 
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-lg font-medium">
                    Un team di esperti al tuo servizio
                  </p>
                  <p className="text-white/80 text-sm">
                    Docenti madrelingua qualificati e appassionati
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm opacity-90">Anni di esperienza</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <Card className="p-6 h-full hover-elevate transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">I Nostri Valori</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cosa Ci Rende Unici
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I principi che guidano ogni nostro corso e ogni interazione con i nostri studenti
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full group hover-elevate transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color}`} />
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${value.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4">Il Nostro Metodo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Una Metodologia{" "}
                <span className="text-primary">Innovativa</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Abbiamo sviluppato una metodologia didattica unica che punta all'acquisizione 
                completa e funzionale delle competenze. L'apprendimento è immediato e concreto, 
                basato su situazioni comunicative autentiche.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {methodologyPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 h-full">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{point.title}</h4>
                          <p className="text-sm text-muted-foreground">{point.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={aboutTeachingImage} 
                  alt="Metodologia didattica" 
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <Card className="absolute -bottom-8 -left-8 p-6 shadow-xl max-w-xs">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-bold">Ente Accreditato</div>
                    <div className="text-sm text-muted-foreground">Regione Veneto</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Primo ente di formazione linguistica accreditato in Veneto dal 2003
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">La Nostra Storia</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Un Percorso di Crescita
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dal 1992 ad oggi, una storia di innovazione e dedizione alla formazione
            </p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />
            
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left order-1'}`}>
                  <Card className={`p-5 ${event.highlight ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <div className={`text-2xl font-bold ${event.highlight ? 'text-primary' : ''} mb-2`}>
                      {event.year}
                    </div>
                    <p className="text-muted-foreground">{event.event}</p>
                    {event.highlight && (
                      <Badge className="mt-3" variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Milestone
                      </Badge>
                    )}
                  </Card>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-4 ${event.highlight ? 'bg-primary border-primary' : 'bg-background border-muted-foreground/30'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={aboutVicenzaImage} 
                  alt="Vicenza, sede Interlingua" 
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-4">Le Nostre Sedi</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nel Cuore del{" "}
                <span className="text-primary">Veneto</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Due sedi strategiche per essere sempre vicini ai nostri studenti, 
                con la possibilità di frequentare anche online da qualsiasi luogo.
              </p>
              
              <div className="space-y-4">
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Vicenza - Centro Storico</h4>
                      <p className="text-muted-foreground">Viale Mazzini 27, nel cuore della città del Palladio</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Thiene</h4>
                      <p className="text-muted-foreground">Sede operativa dal 1998, punto di riferimento per l'Alto Vicentino</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-5 border-dashed">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Online - Ovunque Tu Sia</h4>
                      <p className="text-muted-foreground">Piattaforma e-learning e lezioni live via Zoom</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" id="team">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">Il Nostro Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Le Persone Dietro <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SkillCraft</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un team di professionisti appassionati con esperienza internazionale nella formazione
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              Staff Amministrativo
            </h3>
            <p className="text-muted-foreground mb-6">La direzione e il team che gestisce le attività formative</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                name: "Giulia Ciampalini",
                role: "CEO e Direttrice",
                bio: "Formazione Corporate e Finanziata",
                image: "/images/team/giulia-corporate.webp",
              },
              {
                name: "Giulia",
                role: "Responsabile Sede Vicenza",
                bio: "Interlingua Vicenza, Corsi online e Traduzioni",
                image: "/images/team/giulia-vicenza.webp",
              },
              {
                name: "Elena",
                role: "Responsabile Sede Thiene",
                bio: "Interlingua Thiene e Corsi online",
                image: "/images/team/elena-thiene.webp",
              },
              {
                name: "Michela",
                role: "Formazione Corporate e Finanziata",
                bio: "Coordinamento dei progetti formativi aziendali e dei bandi di formazione finanziata",
                image: "/images/team/michela-corporate.webp",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name + member.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover-elevate overflow-hidden" data-testid={`card-admin-${index}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-lg mb-1 truncate">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs whitespace-normal text-center leading-snug">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Team Docenti
            </h3>
            <p className="text-muted-foreground mb-6">I nostri insegnanti madrelingua e formatori qualificati</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                name: "Mark",
                role: "Tutor di Inglese e Coordinatore Tutors",
                image: "/images/team/docenti/mark.jpg",
              },
              {
                name: "Giulia",
                role: "Tutor di Inglese e Italiano e Formatore CLIL",
                image: "/images/team/docenti/giulia-docente.jpg",
              },
              {
                name: "James",
                role: "Tutor di Inglese",
                image: "/images/team/docenti/james.jpg",
              },
              {
                name: "Will",
                role: "Tutor di Inglese e Coach certificato",
                image: "/images/team/docenti/will.jpg",
              },
              {
                name: "Marcus",
                role: "Tutor di Inglese e Formatore CLIL",
                image: "/images/team/docenti/marcus.jpg",
              },
              {
                name: "Ruben",
                role: "Tutor di Spagnolo",
                image: "/images/team/docenti/ruben.jpg",
              },
              {
                name: "Magalì",
                role: "Tutor di Francese",
                image: "/images/team/docenti/magali.jpg",
              },
              {
                name: "Paola",
                role: "Tutor di Tedesco Commerciale",
                image: "/images/team/docenti/paola.jpg",
              },
              {
                name: "Mara",
                role: "Tutor di Tedesco e Italiano",
                image: "/images/team/docenti/mara.jpg",
              },
              {
                name: "Laila",
                role: "Tutor di Portoghese",
                image: "/images/team/docenti/laila.jpg",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name + member.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full text-center hover-elevate overflow-hidden" data-testid={`card-teacher-${index}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs whitespace-normal text-center leading-snug">{member.role}</Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              I Nostri Esperti
            </h3>
            <p className="text-muted-foreground mb-6">Professionisti specializzati in competenze digitali, trasversali e gestionali</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                name: "Valentino Spolaore",
                role: "Digital Skills & Data Analytics",
                bio: "Appassionato di tecnologia e formazione, Valentino trasforma dati in insight e idee in progetti concreti. Docente universitario e formatore aziendale specializzato in Excel Avanzato, Google Suite, UX/UI Design e Power BI.",
                image: "/images/team/docenti/valentino.jpg",
              },
              {
                name: "Maurizia Moltoni Sartori",
                role: "Competenze Trasversali & Coaching",
                bio: "Da oltre vent'anni si dedica alla formazione e allo sviluppo del potenziale degli adulti. Specializzata in comunicazione, leadership, team building e gestione delle emozioni con metodologie esperienziali coinvolgenti.",
                image: "/images/team/docenti/maurizia.jpg",
              },
              {
                name: "Ampelia Berto",
                role: "Lean Management & Continuous Improvement",
                bio: "Laureata in statistica con quasi 30 anni di esperienza manageriale, insegna Lean, Six Sigma, Agile e Scrum con un approccio pragmatico. Per lei, queste non sono solo metodologie, ma un mindset che trasforma il modo di lavorare e innovare.",
                image: "/images/team/docenti/ampelia.jpg",
              },
              {
                name: "Stephanie Vella",
                role: "Coach e Formatore CLIL",
                bio: "Coach professionista e formatrice CLIL con esperienza nella formazione linguistica integrata e nello sviluppo delle competenze comunicative.",
                image: "/images/team/docenti/stephanie.jpg",
              },
              {
                name: "Andrea",
                role: "Intelligenza Artificiale & AI Ambassador",
                bio: "Esperto di Intelligenza Artificiale e AI Ambassador presso SkillCraft. Si occupa di applicazioni pratiche dell'AI per aziende e professionisti, aiutando a integrare queste tecnologie nei processi aziendali per migliorarne l'efficienza e l'innovazione.",
                image: "/images/team/docenti/andrea.jpg",
              },
              {
                name: "Laura Bau",
                role: "Web Marketing & AI",
                bio: "Convinta che il marketing e la tecnologia abbiano il potere di trasformare le aziende. La sua passione nasce negli USA, dove ha studiato Sales & Marketing e Business Analytics. Aiuta le aziende a sfruttare al meglio gli strumenti digitali e l'AI per migliorare le loro strategie di business.",
                image: "/images/team/docenti/laura.jpg",
              },
              {
                name: "Alberto Arsie",
                role: "Video Marketing & Produzione Multimediale",
                bio: "Videomaker e fotografo professionista dal 2006. Gestisce Media Lab, dove si occupa di produzione video, cinema, animazioni 3D e formazione multimediale. Crede nel potere dell'immagine per trasmettere emozioni e messaggi unici.",
                image: "/images/team/docenti/alberto.jpg",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover-elevate overflow-hidden" data-testid={`card-expert-${index}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-lg mb-1 truncate">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs whitespace-normal text-center leading-snug">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground line-clamp-4">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">I Nostri Clienti</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chi Si Affida a Noi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Collaboriamo con le realtà più prestigiose del territorio veneto e non solo
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {clientCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 h-full text-center group hover-elevate transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold mb-3">{category.title}</h3>
                  <div className="space-y-1">
                    {category.sectors.slice(0, 3).map((sector) => (
                      <div key={sector} className="text-xs text-muted-foreground">
                        {sector}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Inizia il Tuo Percorso
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Contattaci per scoprire come possiamo aiutarti a raggiungere i tuoi obiettivi 
                  formativi e professionali.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/#contact">
                    <Button size="lg" className="min-w-[200px]" data-testid="button-contact-cta">
                      <Mail className="w-4 h-4 mr-2" />
                      Contattaci Ora
                    </Button>
                  </Link>
                  <Link href="/#courses">
                    <Button variant="outline" size="lg" className="min-w-[200px]" data-testid="button-courses-cta">
                      Esplora i Corsi
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 pt-8 border-t border-border/50 grid sm:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium">+39 0444 321601</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">infocorsi@skillcraft.interlingua.it</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
