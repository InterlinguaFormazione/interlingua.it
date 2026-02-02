import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ExternalLink, Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJDWsIWn0xf0cR9w29gPorTls";
const GOOGLE_WRITE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJDWsIWn0xf0cR9w29gPorTls";

interface GoogleReview {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string | null;
  relativeTime: string;
}

interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

const fallbackReviews: GoogleReview[] = [
  {
    id: "1",
    name: "Fong Marcolongo",
    role: "Google Review",
    content: "Roberto is a wonderful Italian teacher. I really enjoyed how he wanted to get to know me so he could bring the curiosity into his lessons. He was consistently encouraging me to flex my Italian muscle.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
  {
    id: "2",
    name: "Nordic Industrial Flat",
    role: "Google Review",
    content: "Speakers' Corner è un servizio on-line utilissimo per l'apprendimento della terminologia inglese e per esercitarsi nella conversazione durante la lezione via zoom.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
  {
    id: "3",
    name: "Popa Ileana",
    role: "Google Review",
    content: "Ho partecipato alla prima conversazione di questo corso, per me è stato bello incontrare persone nuove e essere in grado di capirle mentre parlavano.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
  {
    id: "4",
    name: "Alessio Gallone",
    role: "Google Review",
    content: "Esperienza molto positiva. Docenti preparati e ambiente stimolante per l'apprendimento.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
  {
    id: "5",
    name: "Lucia Triolo",
    role: "Google Review",
    content: "Ottima esperienza formativa. Professionalità e competenza contraddistinguono tutto il team di Interlingua.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
  {
    id: "6",
    name: "Will Barnes",
    role: "Google Review",
    content: "Great language school with professional and friendly teachers. Highly recommended for anyone wanting to learn Italian or improve their English skills.",
    rating: 5,
    avatar: null,
    relativeTime: "",
  },
];

const additionalReviews: GoogleReview[] = [
  {
    id: "extra-1",
    name: "Lucia Triolo",
    role: "Google Review",
    content: "Ottima esperienza formativa. Professionalità e competenza contraddistinguono tutto il team di Interlingua.",
    rating: 5,
    avatar: null,
    relativeTime: "7 mesi fa",
  },
];

export function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const { data, isLoading } = useQuery<ReviewsData>({
    queryKey: ["/api/reviews"],
    staleTime: 24 * 60 * 60 * 1000,
  });

  const allReviews = data?.reviews || fallbackReviews.slice(0, 5);
  const rating = data?.rating || 4.8;
  const totalReviews = data?.totalReviews || 102;

  useEffect(() => {
    if (allReviews.length <= 3) return;
    
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allReviews.length]);

  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % allReviews.length;
      visible.push(allReviews[index]);
    }
    return visible;
  };

  const visibleReviews = getVisibleReviews();

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
          <a 
            href={GOOGLE_REVIEWS_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-card border hover-elevate"
          >
            <SiGoogle className="h-6 w-6 text-[#4285F4]" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{rating.toFixed(1)}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i <= Math.floor(rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : i <= rating 
                            ? 'fill-yellow-400/50 text-yellow-400/50'
                            : 'fill-gray-300 text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground text-xs">Basato su {totalReviews} recensioni</span>
            </div>
          </a>
        </motion.div>

        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    layout
                  >
                    <Card 
                      className="h-full hover-elevate relative"
                      data-testid={`testimonial-${review.id}`}
                    >
                      <CardContent className="pt-6">
                        <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                        
                        <div className="flex items-center gap-1 mb-4">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                          "{review.content}"
                        </p>

                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            {review.avatar && (
                              <AvatarImage 
                                src={review.avatar} 
                                alt={review.name}
                                className="object-cover"
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{review.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {review.relativeTime || review.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" data-testid="button-write-review">
              Lascia una Recensione
              <Star className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" data-testid="button-google-reviews">
              Vedi Tutte le Recensioni
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
