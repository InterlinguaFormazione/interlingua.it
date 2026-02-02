import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ExternalLink, Loader2 } from "lucide-react";
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
            <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
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
              <div className="flex ml-2 gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </Button>
          </a>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" data-testid="button-google-reviews">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Vedi Tutte le Recensioni
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
