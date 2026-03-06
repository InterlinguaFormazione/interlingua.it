import { motion } from "framer-motion";
import { Link, useRoute } from "wouter";
import { ArrowLeft, FileText, Target, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { bandiDetails, bandiCards } from "@/data/bandi-data";

export default function BandoDetailPage() {
  const [, params] = useRoute("/bandi/:id");
  const id = params?.id;
  const detail = id ? bandiDetails[id] : null;
  const card = id ? bandiCards.find(b => b.id === id) : null;

  if (!detail) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Bando non trovato</h1>
          <p className="text-muted-foreground mb-8">
            Il bando richiesto non è stato trovato.
          </p>
          <Link href="/bandi-e-corsi-finanziati">
            <Button data-testid="button-back-bandi">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Bandi
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-28 md:pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <Link href="/bandi-e-corsi-finanziati">
            <Button variant="ghost" className="mb-8" data-testid="button-back-bandi">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna ai Bandi e Corsi Finanziati
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" data-testid="badge-program">
              {detail.programTitle}
            </Badge>
            {card && (
              <Badge
                className={`ml-2 ${card.status === "active"
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                }`}
                data-testid="badge-status"
              >
                {card.status === "active" ? "Bando Attivo" : "Bando Chiuso"}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="heading-project-title">
              {detail.projectTitle}
            </h1>
            {detail.projectCode && (
              <p className="text-lg text-muted-foreground mb-2" data-testid="text-project-code">
                Codice Progetto: {detail.projectCode}
              </p>
            )}
            {detail.approvalInfo && (
              <p className="text-muted-foreground" data-testid="text-approval">
                {detail.approvalInfo}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {detail.image && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src={detail.image}
                alt={detail.projectTitle}
                className="max-w-md w-full rounded-xl shadow-lg"
                data-testid="img-project"
              />
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold" data-testid="heading-synthesis">
                    Sintesi del Progetto
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-synthesis">
                  {detail.synthesis}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold" data-testid="heading-objectives">
                    Obiettivi e Risultati Attesi
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-objectives">
                  {detail.objectives}
                </p>
              </Card>
            </motion.div>

            {detail.stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 md:p-8 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold" data-testid="heading-stats">
                      Dati del Progetto
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {detail.stats.split("\n").map((line, i) => {
                      const [label, value] = line.split(": ");
                      return (
                        <div key={i} className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-primary" data-testid={`text-stat-value-${i}`}>
                            {value}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1" data-testid={`text-stat-label-${i}`}>
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {detail.additionalSections?.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Info className="w-5 h-5 text-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold" data-testid={`heading-additional-${i}`}>
                      {section.heading}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid={`text-additional-${i}`}>
                    {section.content}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Interessato a questo progetto?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contattaci per maggiori informazioni su come partecipare ai nostri progetti formativi finanziati.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/#contact">
                <Button size="lg" data-testid="button-contact">
                  Contattaci
                </Button>
              </Link>
              <Link href="/bandi-e-corsi-finanziati">
                <Button variant="outline" size="lg" data-testid="button-all-bandi">
                  Tutti i Bandi
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
