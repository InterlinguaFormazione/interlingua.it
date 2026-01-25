import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Testimonial } from "@shared/schema";

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marco Rossi",
    role: "Manager, Milano",
    content: "Grazie a SkillCraft-Interlingua ho finalmente raggiunto il livello C1 in inglese. I docenti sono fantastici e il metodo di insegnamento è davvero efficace. Consiglio a tutti!",
    rating: 5,
  },
  {
    id: "2",
    name: "Laura Bianchi",
    role: "Studentessa Universitaria",
    content: "Ho frequentato il corso di tedesco per prepararmi a un'opportunità di lavoro all'estero. Esperienza eccellente, atmosfera accogliente e risultati concreti.",
    rating: 5,
  },
  {
    id: "3",
    name: "Giuseppe Verdi",
    role: "Imprenditore, Roma",
    content: "Il corso di competenze digitali ha trasformato il modo in cui gestisco la mia attività. Ora sono molto più efficiente e produttivo.",
    rating: 5,
  },
  {
    id: "4",
    name: "Sofia Marino",
    role: "Insegnante, Napoli",
    content: "Ho seguito il corso di public speaking e sono rimasta colpita dalla qualità. Ora mi sento molto più sicura nelle presentazioni.",
    rating: 5,
  },
  {
    id: "5",
    name: "Alessandro Ferrari",
    role: "Ingegnere, Torino",
    content: "Flessibilità e professionalità. Ho potuto seguire le lezioni online conciliando il tutto con i miei impegni lavorativi.",
    rating: 5,
  },
  {
    id: "6",
    name: "Chiara Costa",
    role: "Designer, Firenze",
    content: "Il corso di italiano per stranieri mi ha aiutato tantissimo quando mi sono trasferita in Italia. Staff gentilissimo!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Testimonianze
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Cosa Dicono i Nostri{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Studenti
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Le storie di successo dei nostri studenti sono la nostra più grande soddisfazione.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover-elevate relative"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                    
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {testimonial.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
