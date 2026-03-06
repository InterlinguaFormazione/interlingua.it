import { motion } from "framer-motion";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { Breadcrumb } from "@/components/breadcrumb";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { bandiCards } from "@/data/bandi-data";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function BandiECorsiPage() {
  useSEO({
    title: "Bandi e Corsi Finanziati | Formazione Linguistica Finanziata | SkillCraft-Interlingua",
    description: "Bandi e corsi di lingue finanziati a Vicenza e Veneto. Scopri le opportunità di formazione linguistica gratuita o agevolata per privati e aziende.",
    canonical: "/bandi-e-corsi-finanziati",
  });
  const activeBandi = bandiCards.filter(b => b.status === "active");
  const expiredBandi = bandiCards.filter(b => b.status === "expired");

  const sections = Array.from(new Set(activeBandi.map(b => b.section)));

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: "Bandi e Corsi Finanziati", href: "/bandi-e-corsi-finanziati" }]} schemaOnly />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" data-testid="badge-contributi">
              Contributi per la Formazione
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="heading-corsi-finanziati">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Corsi Finanziati
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-intro">
              Interlingua Formazione, in qualità di Ente formativo accreditato nella Regione del Veneto,
              è in grado di individuare le opportunità derivanti da Bandi Pubblici e da Fondi
              Interprofessionali per le aziende.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Questi fondi consentono alle aziende di accedere a corsi di formazione interamente
              finanziati e di usufruire delle agevolazioni previste.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Il nostro staff vi assisterà nelle pratiche documentali necessarie per ottenere il
              finanziamento. Per maggiori dettagli sui corsi finanziati e le attività disponibili,
              compilate il modulo di richiesta informazioni.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-bandi-attivi">
                Bandi Attivi
              </h2>
            </div>
            <p className="text-muted-foreground">
              Opportunità di formazione finanziata attualmente disponibili
            </p>
          </motion.div>

          {sections.map((sectionName) => {
            const sectionCards = activeBandi.filter(b => b.section === sectionName);
            return (
              <div key={sectionName} className="mb-12">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold mb-6 text-primary border-l-4 border-primary pl-4"
                  data-testid={`heading-section-${sectionName.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {sectionName}
                </motion.h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionCards.map((bando, index) => (
                    <BandoCardComponent key={bando.id} bando={bando} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="heading-bandi-scaduti">
                Bandi Scaduti
              </h2>
            </div>
            <p className="text-muted-foreground">
              Bandi e corsi finanziati precedenti
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredBandi.map((bando, index) => (
              <BandoCardComponent key={bando.id} bando={bando} index={index} expired />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BandoCardComponent({ bando, index, expired = false }: { bando: typeof bandiCards[0]; index: number; expired?: boolean }) {
  const cardContent = (
    <Card
      className={`overflow-hidden h-full group transition-all duration-300 ${expired ? "opacity-80" : ""}`}
      data-testid={`card-bando-${bando.id}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={bando.image}
          alt={bando.title}
          className="w-full h-48 object-contain bg-white transition-transform duration-500"
          data-testid={`img-bando-${bando.id}`}
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={bando.status === "active"
              ? "bg-green-500/90 text-white border-0"
              : "bg-gray-500/90 text-white border-0"
            }
            data-testid={`badge-status-${bando.id}`}
          >
            {bando.status === "active" ? "Attivo" : "Scaduto"}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-sm mb-1 line-clamp-2" data-testid={`text-title-${bando.id}`}>
          {bando.title}
        </h4>
        {bando.subtitle && (
          <p className="text-primary font-semibold text-base mb-2" data-testid={`text-subtitle-${bando.id}`}>
            {bando.subtitle}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 whitespace-pre-line" data-testid={`text-desc-${bando.id}`}>
          {bando.description}
        </p>
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          Maggiori informazioni
          {bando.externalLink ? (
            <ExternalLink className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </div>
      </div>
    </Card>
  );

  if (bando.externalLink) {
    return (
      <motion.a
        href={bando.link}
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        data-testid={`link-bando-${bando.id}`}
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={bando.link} data-testid={`link-bando-${bando.id}`}>
        {cardContent}
      </Link>
    </motion.div>
  );
}
