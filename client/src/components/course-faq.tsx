import { useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FAQItem {
  question: string;
  answer: string;
}

function useFAQJsonLd(faqs: FAQItem[], pageUrl: string) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: `https://skillcraft-interlingua.it${pageUrl}`,
      mainEntity: faqs.map((faq) => ({
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
    script.setAttribute("data-faq-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
}

export function CourseFAQ({
  faqs,
  pageUrl,
  title = "Domande Frequenti",
  subtitle = "Trova le risposte alle domande più comuni su questo corso.",
}: {
  faqs: FAQItem[];
  pageUrl: string;
  title?: string;
  subtitle?: string;
}) {
  useFAQJsonLd(faqs, pageUrl);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4" />
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            {title}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-faq-title">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-xl border bg-card p-0 overflow-hidden"
              data-testid={`faq-course-item-${index}`}
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
