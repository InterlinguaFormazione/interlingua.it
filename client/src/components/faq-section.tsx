import { useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Come posso iscrivermi a un corso?",
    answer: "Puoi iscriverti compilando il modulo di contatto sul nostro sito, chiamandoci al +39 0444 321601, o scrivendoci su WhatsApp. Ti contatteremo entro 24 ore per guidarti nella scelta e completare l'iscrizione."
  },
  {
    question: "Rilasciate un certificato a fine corso?",
    answer: "Sì, tutti i nostri corsi prevedono il rilascio di un certificato di partecipazione o competenza. Per i corsi di lingua, rilasciamo certificati allineati al Quadro Comune Europeo (QCER)."
  },
  {
    question: "Qual è la politica di cancellazione?",
    answer: "Puoi cancellare la tua iscrizione gratuitamente fino a 7 giorni prima dell'inizio del corso. Dopo tale termine, è possibile trasferire l'iscrizione a un'altra sessione o a un'altra persona."
  },
  {
    question: "Quali metodi di pagamento accettate?",
    answer: "Accettiamo bonifico bancario, carta di credito/debito e PayPal. Per i corsi di importo superiore a €500, offriamo la possibilità di pagamento rateizzato."
  },
  {
    question: "I corsi sono in presenza o online?",
    answer: "Offriamo entrambe le modalità. La maggior parte dei corsi si svolge in presenza nelle nostre sedi di Vicenza e Thiene, ma molti sono disponibili anche in formato online o ibrido."
  },
  {
    question: "Come scelgo il corso giusto per me?",
    answer: "Offriamo una consulenza formativa gratuita e personalizzata per aiutarti a individuare il percorso più adatto ai tuoi obiettivi. Contattaci e un nostro consulente ti guiderà nella scelta."
  },
  {
    question: "Accettate la Carta Cultura / 18app?",
    answer: "Sì, siamo un ente accreditato e accettiamo la Carta Cultura per i corsi di lingua. Contattaci per verificare l'idoneità del corso che ti interessa."
  },
  {
    question: "I corsi di AI richiedono competenze tecniche?",
    answer: "No, i nostri corsi su ChatGPT, Copilot e AI sono progettati per tutti i livelli. Partiamo dalle basi e arriviamo all'uso avanzato, senza necessità di conoscenze di programmazione."
  },
];

export function FAQSection() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "faq-schema";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4" />
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Domande Frequenti
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Hai delle{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Domande?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trova le risposte alle domande più comuni sui nostri corsi e servizi.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-xl border bg-card p-0 overflow-hidden"
              data-testid={`faq-item-${index}`}
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 font-medium hover:bg-muted/50 transition-colors list-none">
                <span className="pr-4">{faq.question}</span>
                <span className="text-primary shrink-0 transition-transform group-open:rotate-45 text-xl">+</span>
              </summary>
              <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
