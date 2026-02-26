import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const comparisons = [
  { feature: "Formazione AI applicata (ChatGPT, Copilot, Automazione)", us: true, others: "Raro" },
  { feature: "Corsi di lingue straniere", us: true, others: true },
  { feature: "Percorsi personalizzati su obiettivi specifici", us: true, others: "Parziale" },
  { feature: "Accreditamento Regione Veneto", us: true, others: "Alcuni" },
  { feature: "6 aree formative integrate in un unico centro", us: true, others: false },
  { feature: "Formazione esperienziale e outdoor", us: true, others: "Raro" },
  { feature: "Corsi online e in presenza", us: true, others: true },
  { feature: "Oltre 30 anni di esperienza sul territorio", us: true, others: "Alcuni" },
  { feature: "Supporto e follow-up post-corso", us: true, others: "Parziale" },
  { feature: "Consulenza formativa gratuita e personalizzata", us: true, others: "Raro" },
];

function StatusIcon({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
        <X className="w-4 h-4 text-red-500" />
      </div>
    );
  }
  return <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{value}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4" />
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            I Nostri Vantaggi
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Perché Scegliere{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Noi
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un confronto trasparente: ecco cosa ci distingue nel panorama della formazione professionale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="grid grid-cols-[1fr_auto_auto] items-center">
                <div className="p-4 font-semibold text-sm text-muted-foreground">Caratteristica</div>
                <div className="p-4 w-32 text-center font-bold text-sm bg-primary/10 border-x border-primary/20">SkillCraft</div>
                <div className="p-4 w-28 text-center font-semibold text-sm text-muted-foreground">Media settore</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_auto_auto] items-center border-t"
                  data-testid={`comparison-row-${index}`}
                >
                  <div className="p-4 text-sm">{item.feature}</div>
                  <div className="p-4 w-32 flex justify-center bg-primary/5 border-x border-primary/10">
                    <StatusIcon value={item.us} />
                  </div>
                  <div className="p-4 w-28 flex justify-center">
                    <StatusIcon value={item.others} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-4">
            * Il confronto si basa sulla nostra esperienza nel mercato della formazione professionale in Veneto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
