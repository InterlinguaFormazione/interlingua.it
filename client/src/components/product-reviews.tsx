import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueries, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { SHOP_PRODUCTS } from "@shared/products";
import type { ProductReview } from "@shared/schema";
import {
  Star,
  MessageSquare,
  User,
  ShieldCheck,
  Send,
  ThumbsUp,
} from "lucide-react";

function StarRating({ rating, size = "sm", interactive = false, onChange }: {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "lg" ? "w-7 h-7" : size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= (hovered || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  const date = new Date(review.createdAt!);
  const formattedDate = date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const product = SHOP_PRODUCTS.find(p => p.slug === review.productSlug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{review.authorName}</span>
                {review.verified && (
                  <Badge variant="secondary" className="text-[10px] gap-1 py-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Acquisto verificato
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formattedDate}</span>
                {product && <span>· {product.name}</span>}
              </div>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
        {review.title && (
          <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      </Card>
    </motion.div>
  );
}

function ReviewForm({ productSlugs, onSuccess }: { productSlugs: string[]; onSuccess: () => void }) {
  const [rating, setRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(productSlugs[0] || "");
  const { toast } = useToast();

  const products = SHOP_PRODUCTS.filter(p => productSlugs.includes(p.slug));

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/shop/reviews", {
        productSlug: selectedSlug,
        authorName,
        authorEmail,
        rating,
        title: title || null,
        comment,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Recensione inviata",
        description: data.message,
      });
      setRating(0);
      setAuthorName("");
      setAuthorEmail("");
      setTitle("");
      setComment("");
      productSlugs.forEach(slug => {
        queryClient.invalidateQueries({ queryKey: [`/api/shop/reviews/${slug}`] });
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Non è stato possibile inviare la recensione.",
        variant: "destructive",
      });
    },
  });

  const canSubmit = rating > 0 && authorName.trim() && authorEmail.trim() && comment.trim() && selectedSlug;

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Scrivi una Recensione
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Condividi la tua esperienza. Le recensioni dei clienti verificati vengono pubblicate automaticamente.
      </p>

      <div className="space-y-4">
        {products.length > 1 && (
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Quale corso vuoi recensire? *</Label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              data-testid="select-review-product"
            >
              {products.map(p => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label className="text-sm font-medium mb-2 block">La tua valutazione *</Label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          {rating === 0 && (
            <p className="text-xs text-muted-foreground mt-1">Clicca sulle stelle per valutare</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="review-name" className="text-sm font-medium mb-1.5 block">Nome *</Label>
            <Input
              id="review-name"
              placeholder="Il tuo nome"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              data-testid="input-review-name"
            />
          </div>
          <div>
            <Label htmlFor="review-email" className="text-sm font-medium mb-1.5 block">Email *</Label>
            <Input
              id="review-email"
              type="email"
              placeholder="La tua email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              data-testid="input-review-email"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Non verrà pubblicata</p>
          </div>
        </div>

        <div>
          <Label htmlFor="review-title" className="text-sm font-medium mb-1.5 block">Titolo (opzionale)</Label>
          <Input
            id="review-title"
            placeholder="Riassumi la tua esperienza"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="input-review-title"
          />
        </div>

        <div>
          <Label htmlFor="review-comment" className="text-sm font-medium mb-1.5 block">La tua recensione *</Label>
          <Textarea
            id="review-comment"
            placeholder="Racconta la tua esperienza con questo corso..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            data-testid="input-review-comment"
          />
        </div>

        <Button
          onClick={() => submitMutation.mutate()}
          disabled={!canSubmit || submitMutation.isPending}
          className="w-full sm:w-auto"
          data-testid="button-submit-review"
        >
          {submitMutation.isPending ? (
            "Invio in corso..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Invia Recensione
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

export function ProductReviewsSection({ productSlugs }: { productSlugs: string[] }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.location.hash === "#reviews" && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  const reviewQueries = useQueries({
    queries: productSlugs.map(slug => ({
      queryKey: [`/api/shop/reviews/${slug}`],
      queryFn: async () => {
        const res = await fetch(`/api/shop/reviews/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json() as Promise<ProductReview[]>;
      },
    })),
  });

  const allReviews = reviewQueries
    .flatMap(q => q.data || [])
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

  const isLoading = reviewQueries.some(q => q.isLoading);

  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: allReviews.filter((r) => r.rating === stars).length,
    percentage: allReviews.length > 0
      ? (allReviews.filter((r) => r.rating === stars).length / allReviews.length) * 100
      : 0,
  }));

  return (
    <section className="py-16" id="reviews" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2">
                <MessageSquare className="w-7 h-7 text-primary" />
                Recensioni dei Clienti
                {allReviews.length > 0 && (
                  <Badge variant="secondary">{allReviews.length}</Badge>
                )}
              </h2>
              <p className="text-muted-foreground">
                Cosa dicono i nostri studenti di questi corsi
              </p>
            </div>
            {!showReviewForm && (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(true)}
                data-testid="button-write-review"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Scrivi una recensione
              </Button>
            )}
          </div>

          {allReviews.length > 0 && (
            <Card className="p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="text-center min-w-[100px]">
                  <div className="text-4xl font-extrabold mb-1">{avgRating.toFixed(1)}</div>
                  <StarRating rating={Math.round(avgRating)} size="md" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {allReviews.length} {allReviews.length === 1 ? "recensione" : "recensioni"}
                  </p>
                </div>
                <div className="flex-grow space-y-1.5 w-full">
                  {ratingDistribution.map((d) => (
                    <div key={d.stars} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8 text-right">{d.stars} ★</span>
                      <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <ReviewForm
                  productSlugs={productSlugs}
                  onSuccess={() => setShowReviewForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : allReviews.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-semibold text-lg mb-1">Nessuna recensione ancora</p>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                Sii il primo a condividere la tua esperienza con i nostri corsi!
              </p>
              {!showReviewForm && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  data-testid="button-first-review"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Scrivi la prima recensione
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {allReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
