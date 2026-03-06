import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Loader2, ShieldCheck, MessageSquareHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

const GOOGLE_REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJDWsIWn0xf0cR9w29gPorTls";
const GOOGLE_WRITE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJDWsIWn0xf0cR9w29gPorTls";
const QUALITY_URL = "https://quality-skillcraft.interlingua.it/";

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

interface SatisfactionComment {
  id: string;
  comment: string;
  author: string;
  course: string;
  date: string;
}

interface SatisfactionData {
  total: number;
  comments: SatisfactionComment[];
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

function formatCourseName(course: string): string {
  if (!course || course === "ND ND") return "";
  return course
    .replace(/\s*-\s*\d+$/, "")
    .replace(/\s*-\s*EXCEL$/i, "")
    .replace(/^ND ND\s*-\s*/, "")
    .trim();
}

function getInitials(name: string): string {
  return name
    .split(/[\s/]+/)
    .filter(p => p.length > 1 && p !== "SRL" && p !== "S.r.l." && p !== "srl")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection() {
  const [googleIndex, setGoogleIndex] = useState(0);
  const [satIndex, setSatIndex] = useState(0);

  const { data: googleData, isLoading: googleLoading } = useQuery<ReviewsData>({
    queryKey: ["/api/reviews"],
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: satData, isLoading: satLoading } = useQuery<SatisfactionData>({
    queryKey: ["/api/satisfaction-comments"],
    staleTime: 60 * 60 * 1000,
  });

  const googleReviews = googleData?.reviews || fallbackReviews.slice(0, 5);
  const rating = googleData?.rating || 4.8;
  const totalReviews = googleData?.totalReviews || 102;
  const satisfactionComments = satData?.comments || [];
  const totalSatisfaction = satData?.total || 0;

  useEffect(() => {
    if (googleReviews.length <= 3) return;
    const interval = setInterval(() => {
      setGoogleIndex((prev) => (prev + 1) % googleReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [googleReviews.length]);

  useEffect(() => {
    if (satisfactionComments.length <= 3) return;
    const interval = setInterval(() => {
      setSatIndex((prev) => (prev + 1) % satisfactionComments.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [satisfactionComments.length]);

  const getVisible = <T,>(items: T[], start: number, count = 3): T[] => {
    const visible = [];
    for (let i = 0; i < Math.min(count, items.length); i++) {
      visible.push(items[(start + i) % items.length]);
    }
    return visible;
  };

  const visibleGoogle = getVisible(googleReviews, googleIndex);
  const visibleSat = getVisible(satisfactionComments, satIndex);

  return (
    <section id="testimonials" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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

        <div className="mb-6 flex items-center justify-between">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card border hover-elevate"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{rating.toFixed(1)}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const fillPercent = Math.min(1, Math.max(0, rating - (i - 1)));
                    return (
                      <div key={i} className="relative h-3.5 w-3.5">
                        <Star className="h-3.5 w-3.5 fill-gray-300 text-gray-300 absolute" />
                        <div className="overflow-hidden absolute" style={{ width: `${fillPercent * 100}%` }}>
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <span className="text-muted-foreground text-xs">{totalReviews} recensioni</span>
            </div>
          </a>
          <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" data-testid="button-write-review">
              Lascia una Recensione
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 ml-1.5" />
            </Button>
          </a>
        </div>

        <div className="relative min-h-[200px] mb-16">
          {googleLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleGoogle.map((review) => (
                  <motion.div
                    key={`g-${review.id}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    layout
                  >
                    <Card className="h-full hover-elevate relative" data-testid={`testimonial-google-${review.id}`}>
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
                              <AvatarImage src={review.avatar} alt={review.name} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{review.name}</p>
                            <p className="text-xs text-muted-foreground">{review.relativeTime || review.role}</p>
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

        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card border">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div className="flex flex-col items-start">
              <span className="font-bold text-sm">Feedback Verificati</span>
              <span className="text-muted-foreground text-xs">
                {totalSatisfaction > 0 ? `${totalSatisfaction.toLocaleString("it-IT")} questionari compilati` : "Questionari di soddisfazione"}
              </span>
            </div>
          </div>
          <a href={QUALITY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" data-testid="button-quality-portal">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
              Portale Qualità
            </Button>
          </a>
        </div>

        <div className="relative min-h-[200px]">
          {satLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : satisfactionComments.length === 0 ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Nessun feedback disponibile al momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleSat.map((item) => {
                  const courseName = formatCourseName(item.course);
                  return (
                    <motion.div
                      key={`s-${item.id}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      layout
                    >
                      <Card className="h-full hover-elevate relative" data-testid={`testimonial-sat-${item.id}`}>
                        <CardContent className="pt-6">
                          <Quote className="h-8 w-8 text-emerald-500/20 absolute top-4 right-4" />
                          <div className="flex items-center gap-1.5 mb-4">
                            <MessageSquareHeart className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Feedback Verificato</span>
                          </div>
                          <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                            "{item.comment}"
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-emerald-500/20">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                                {getInitials(item.author)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm" data-testid={`text-sat-author-${item.id}`}>{item.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {[courseName, item.date ? new Date(item.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : ""].filter(Boolean).join(" · ") || "Questionario di Soddisfazione"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
