import { motion } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@shared/schema";

const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJDWsIWn0xf0cR9w29gPorTls";
import testimonial1 from "@/assets/images/testimonial-1.jpg";
import testimonial2 from "@/assets/images/testimonial-2.jpg";
import testimonial3 from "@/assets/images/testimonial-3.jpg";

const testimonialImages: Record<string, string> = {
  "1": testimonial2,
  "2": testimonial1,
  "3": testimonial2,
  "4": testimonial3,
  "5": testimonial2,
  "6": testimonial1,
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Fong Marcolongo",
    role: "Studente di Italiano",
    content: "Roberto is a wonderful Italian teacher. I really enjoyed how he wanted to get to know me so he could bring the curiosity into his lessons. He was consistently encouraging me to flex my Italian muscle. Anyone looking for an Italian teacher should definitely consider him.",
    rating: 5,
  },
  {
    id: "2",
    name: "Nordic Industrial Flat",
    role: "Speakers' Corner",
    content: "Speakers' Corner è un servizio on-line utilissimo per l'apprendimento della terminologia inglese e per esercitarsi nella conversazione durante la lezione via zoom. Ogni settimana la lezione è tenuta da un insegnante madrelingua che coinvolge gli studenti in brillanti conversazioni.",
    rating: 5,
  },
  {
    id: "3",
    name: "Popa Ileana",
    role: "Corso di Conversazione",
    content: "Ho partecipato alla prima conversazione di questo corso, per me è stato bello incontrare persone nuove e essere in grado di capirle mentre parlavano. Avere il modo di parlare ed ascoltare gli altri ci aiuta sempre.",
    rating: 5,
  },
  {
    id: "4",
    name: "Alessio Gallone",
    role: "Studente",
    content: "Esperienza molto positiva. Docenti preparati e ambiente stimolante per l'apprendimento.",
    rating: 5,
  },
  {
    id: "5",
    name: "Lucia Triolo",
    role: "Studente",
    content: "Ottima esperienza formativa. Professionalità e competenza contraddistinguono tutto il team di Interlingua.",
    rating: 5,
  },
  {
    id: "6",
    name: "Will Barnes",
    role: "Studente",
    content: "Great language school with professional and friendly teachers. Highly recommended for anyone wanting to learn Italian or improve their English skills.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Le storie di successo dei nostri studenti sono la nostra più grande soddisfazione.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/80 text-yellow-400/80'}`} />
              ))}
            </div>
            <span className="font-bold">4.8</span>
            <span className="text-muted-foreground text-sm">su Google (102 recensioni)</span>
          </div>
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
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage 
                          src={testimonialImages[testimonial.id]} 
                          alt={testimonial.name}
                          className="object-cover"
                        />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" data-testid="button-google-reviews">
              Vedi Tutte le Recensioni su Google
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
