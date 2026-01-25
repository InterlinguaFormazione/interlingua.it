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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const timelineEvents = [
  { year: "1992", event: "Fondazione di Interlingua come agenzia di traduzioni e corsi aziendali" },
  { year: "1993", event: "Apertura della prima sede operativa a Vicenza, in Viale Roma" },
  { year: "1998", event: "Inaugurazione della seconda sede a Thiene" },
  { year: "2000", event: "Introduzione del Sistema di Gestione della Qualità Interlingua" },
  { year: "2001", event: "Trasferimento della sede operativa in Stradella dei Filippini, Vicenza" },
  { year: "2003", event: "Primo ente di formazione linguistica accreditato in Veneto" },
  { year: "2013", event: "Trasferimento della sede attuale in Viale Mazzini 27, Vicenza" },
];

const clientCategories = [
  {
    title: "Imprese",
    icon: Building2,
    description: "Collaboriamo con numerose aziende venete tra le più prestigiose",
    sectors: ["Metalmeccanica", "Oreficeria", "Industria chimica", "Tessile e abbigliamento", "Industria alimentare"]
  },
  {
    title: "Aziende di Servizi",
    icon: Briefcase,
    description: "Operiamo in ambiti ad alta specializzazione",
    sectors: ["Turismo", "Trasporto commerciale e pubblico", "Energia elettrica e termica", "Aeronautica civile e militare", "Settore medico e sanitario"]
  },
  {
    title: "Studi Professionali",
    icon: GraduationCap,
    description: "Team di docenti specializzati in diversi settori della consulenza",
    sectors: ["Legale e notarile", "Proprietà intellettuale e brevetti", "Architettura e ingegneria civile", "Gestione e sviluppo delle Risorse Umane"]
  },
  {
    title: "Istituti Scolastici",
    icon: School,
    description: "Progetti di lettorato linguistico e aggiornamento docenti",
    sectors: ["Scuole di ogni ordine e grado", "Progetti educativi", "Formazione docenti"]
  },
  {
    title: "Pubblica Amministrazione",
    icon: Building,
    description: "Collaboriamo con enti e amministrazioni locali",
    sectors: ["Formazione professionale", "Aggiornamento personale", "Progetti formativi"]
  }
];

const methodologyPoints = [
  "CLIL (Content and Language Integrated Learning) per contenuti professionali",
  "TBL (Task-Based Learning) con attività reali e materiali autentici",
  "TPR (Total Physical Response) e approccio multisensoriale",
  "Roleplay, focus group, case study e project work",
  "Design thinking e co-progettazione",
  "Simulazioni e analisi video"
];

const competencies = [
  { category: "Soft Skills", items: ["Leadership", "Comunicazione efficace", "Public speaking", "Gestione del tempo"] },
  { category: "Competenze Strategiche", items: ["Digital marketing", "Project management", "Tecniche di vendita", "Negoziazione"] },
  { category: "Competenze Personali", items: ["Innovazione", "Team working", "Problem solving", "Pensiero critico"] }
];

export default function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 md:pt-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Badge className="mb-4">Dal 1993</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chi Siamo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Interlingua Formazione: oltre 30 anni di eccellenza nella formazione linguistica e professionale in Veneto
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">La Nostra Missione</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Il primo obiettivo di <strong className="text-foreground">Interlingua</strong> è lo <strong className="text-foreground">sviluppo effettivo, rapido e duraturo</strong> della competenza linguistica dei partecipanti, con il fine ultimo di raggiungere una <strong className="text-foreground">reale abilità comunicativa</strong> nei contesti autentici in cui ogni studente utilizza la lingua.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Interlingua Formazione ha ideato una metodologia didattica unica, in costante evoluzione, che punta a un'acquisizione completa e funzionale delle competenze linguistiche. L'apprendimento è immediato e concreto, basato su situazioni comunicative autentiche ricreate in aula attraverso roleplay, focus group, case study e project work.
              </p>
            </div>
            
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Metodologia CLIL e Task-Based Learning
              </h3>
              <ul className="space-y-3">
                {methodologyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold">Competenze Trasversali</h2>
          </div>
          
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Grazie al nostro approccio, ci siamo specializzati nella progettazione di percorsi non linguistici in lingua straniera, avvalendoci di trainer internazionali qualificati in diverse discipline.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {competencies.map((comp, index) => (
              <Card key={comp.category} className="p-6">
                <h3 className="font-semibold text-lg mb-4">{comp.category}</h3>
                <ul className="space-y-2">
                  {comp.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Il Nostro Team</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Docenti Madrelingua</h3>
              <p className="text-muted-foreground mb-4">
                Tutti i docenti, formatori e coach di Interlingua sono madrelingua e in possesso di specializzazioni nell'insegnamento della propria lingua madre. Partecipano regolarmente a seminari di aggiornamento metodologico per mantenere elevati gli standard formativi.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Comunicazione efficace</Badge>
                <Badge variant="secondary">Marketing</Badge>
                <Badge variant="secondary">Tecniche di presentazione</Badge>
                <Badge variant="secondary">Customer care</Badge>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Coordinamento Didattico</h3>
              <p className="text-muted-foreground mb-4">
                Il Coordinatore Didattico si occupa della progettazione e sviluppo del metodo Interlingua, dell'orientamento ai percorsi formativi, del bilancio delle competenze e del monitoraggio mensile della qualità formativa.
              </p>
              <p className="text-muted-foreground">
                Le Assistenti di Coordinamento, presenti in ciascuna sede, curano il reclutamento dei docenti, l'organizzazione dei corsi e il monitoraggio costante di presenze, soddisfazione e progressi degli studenti.
              </p>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold">La Nostra Storia</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{event.year.slice(-2)}</span>
                  </div>
                  <Card className="p-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-bold text-primary">{event.year}</span>
                      <span className="text-muted-foreground">{event.event}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-lg mb-3">Ente di Formazione Accreditato</h3>
            <p className="text-muted-foreground">
              Dal 2003 Interlingua è inserita nell'elenco regionale degli Organismi di Formazione Accreditati dalla Regione Veneto, diventando il <strong className="text-foreground">primo ente di formazione linguistica accreditato in Veneto</strong>. L'accreditamento comporta verifiche rigorose e periodiche da parte degli enti pubblici, garantendo qualità, affidabilità e trasparenza dei percorsi formativi.
            </p>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">I Nostri Clienti</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientCategories.map((category, index) => (
              <Card key={category.title} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <category.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <ul className="space-y-1">
                  {category.sectors.map((sector) => (
                    <li key={sector} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {sector}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Vuoi Saperne di Più?</h2>
              <p className="text-muted-foreground mb-6">
                Contattaci per scoprire come possiamo aiutarti a raggiungere i tuoi obiettivi formativi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#contact">
                  <Button size="lg" data-testid="button-contact-cta">
                    <Mail className="w-4 h-4 mr-2" />
                    Contattaci
                  </Button>
                </Link>
                <Link href="/corsi">
                  <Button variant="outline" size="lg" data-testid="button-courses-cta">
                    Scopri i Corsi
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Viale Mazzini 27, Vicenza</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+39 0444 321 654</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
