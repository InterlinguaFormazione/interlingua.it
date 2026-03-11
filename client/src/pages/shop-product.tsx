import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useParams } from "wouter";
import { SHOP_PRODUCTS, getEffectivePrice } from "@shared/products";
import { ShopProductSchema } from "@/components/seo-schemas";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductReview } from "@shared/schema";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  GraduationCap,
  Monitor,
  Headphones,
  Globe,
  Sparkles,
  MessageSquare,
  User,
  ShieldCheck,
  Send,
  ThumbsUp,
} from "lucide-react";

import imgCorsiGruppo from "@assets/shop/group-classroom.png";
import imgIndividualiPresenza from "@assets/shop/individual-lesson.png";
import imgIndividualeBlended from "@assets/shop/individuale-blended.png";
import imgCorsoBooster from "@assets/shop/corso-booster.png";
import imgOffice from "@assets/shop/office-digital-skills.png";
import imgAI from "@assets/shop/ai-course.png";
import imgFullImmersion from "@assets/shop/full-immersion.png";
import imgCamclassSelf from "@assets/shop/e-learning-online.png";
import imgCamclassGruppo from "@assets/shop/camclass-gruppo.png";
import imgCamclassIndividuale from "@assets/shop/camclass-individuale.png";
import imgCertificazione from "@assets/shop/certification.png";
import imgConversazione from "@assets/shop/conversazione-individuale.png";
import imgCamclassMini from "@assets/shop/camclass-minigruppi.png";
import imgCoachingInSede from "@assets/shop/coaching-in-sede.png";
import imgCoachingBlended from "@assets/shop/coaching-blended.png";
import imgCoachingOnline from "@assets/shop/coaching-online.png";
import imgFluencyCoaching from "@assets/shop/fluency-coaching.png";
import imgItalianoIntensivo15 from "@assets/shop/italian-course.png";
import imgItalianoIntensivo20 from "@assets/shop/italiano-intensivo-20.png";
import imgItalianoPresenza from "@assets/shop/italiano-individuale-presenza.png";
import imgItalianoOnline from "@assets/shop/italiano-individuale-online.png";

const PRODUCT_IMAGES: Record<string, string> = {
  "corsi-gruppo": imgCorsiGruppo,
  "individuali-presenza": imgIndividualiPresenza,
  "individuale-blended": imgIndividualeBlended,
  "corso-booster": imgCorsoBooster,
  "office-senza-segreti": imgOffice,
  "ai-senza-segreti": imgAI,
  "full-immersion": imgFullImmersion,
  "camclass-selflearning": imgCamclassSelf,
  "camclass-gruppo": imgCamclassGruppo,
  "camclass-individuale": imgCamclassIndividuale,
  "preparazione-certificazione": imgCertificazione,
  "conversazione-individuale": imgConversazione,
  "camclass-minigruppi": imgCamclassMini,
  "coaching-in-sede": imgCoachingInSede,
  "coaching-blended": imgCoachingBlended,
  "coaching-online": imgCoachingOnline,
  "fluency-coaching": imgFluencyCoaching,
  "italiano-intensivo-15": imgItalianoIntensivo15,
  "italiano-intensivo-20": imgItalianoIntensivo20,
  "italiano-individuale-presenza": imgItalianoPresenza,
  "italiano-individuale-online": imgItalianoOnline,
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string }> = {
  "Formazione in Presenza": { icon: GraduationCap, color: "from-blue-600 to-indigo-500" },
  "Corsi E-Learning": { icon: Monitor, color: "from-emerald-600 to-teal-500" },
  "Language Coaching": { icon: Headphones, color: "from-violet-600 to-purple-500" },
  "Corsi di Italiano per Stranieri": { icon: Globe, color: "from-orange-500 to-amber-500" },
};

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
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{review.authorName}</span>
                {review.verified && (
                  <Badge variant="secondary" className="text-[10px] gap-1 py-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Acquisto verificato
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
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

function ReviewForm({ productSlug, onSuccess }: { productSlug: string; onSuccess: () => void }) {
  const [rating, setRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/shop/reviews", {
        productSlug,
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
      queryClient.invalidateQueries({ queryKey: [`/api/shop/reviews/${productSlug}`] });
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

  const canSubmit = rating > 0 && authorName.trim() && authorEmail.trim() && comment.trim();

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Scrivi una Recensione
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Condividi la tua esperienza con questo corso. Le recensioni dei clienti verificati vengono pubblicate automaticamente.
      </p>

      <div className="space-y-4">
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

export default function ShopProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const product = SHOP_PRODUCTS.find((p) => p.slug === slug);
  const cart = useCart();
  const { toast } = useToast();

  const categoryConfig = product ? CATEGORY_CONFIG[product.category] : null;
  const gradientClass = categoryConfig?.color || "from-primary to-blue-400";
  const CategoryIcon = categoryConfig?.icon || Sparkles;
  const heroImage = product ? PRODUCT_IMAGES[product.slug] : undefined;

  const effectivePrice = product ? getEffectivePrice(product, selectedOptions) : "0";
  const hasAllOptions = product?.options ? product.options.every((opt) => selectedOptions[opt.name]) : true;

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<ProductReview[]>({
    queryKey: [`/api/shop/reviews/${slug}`],
    enabled: !!slug,
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Prodotto non trovato</p>
            <Link href="/shop">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna allo Shop
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
      : 0,
  }));

  const hasValidVariation = !product?.variations || product.variations.some((v) =>
    Object.entries(v.options).every(([k, val]) => selectedOptions[k] === val)
  );

  const handleAddToCart = () => {
    if (product.options && product.options.length > 0 && !hasAllOptions) {
      toast({ title: "Seleziona le opzioni", description: "Configura tutte le opzioni prima di aggiungere al carrello.", variant: "destructive" });
      return;
    }
    if (product.variations && !hasValidVariation) {
      toast({ title: "Combinazione non disponibile", description: "La combinazione selezionata non è disponibile. Prova un'altra configurazione.", variant: "destructive" });
      return;
    }
    cart.addItem(product, selectedOptions);
    toast({ title: "Aggiunto al carrello", description: product.name });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ShopProductSchema
        name={product.name}
        description={product.description}
        price={product.price}
        slug={product.slug}
        category={product.category}
      />
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} schemaOnly />
      <Navigation />

      <section className={`relative pt-28 pb-16 overflow-hidden`}>
        {heroImage && (
          <img
            src={heroImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} ${heroImage ? "opacity-50" : "opacity-90"}`} />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/shop">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 mb-6" data-testid="button-back-shop">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Torna allo Shop
            </Button>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CategoryIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">{product.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 max-w-3xl" data-testid="text-product-title">
            {product.name}
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mb-6">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm font-medium text-white">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-white/50">
                  ({reviews.length} {reviews.length === 1 ? "recensione" : "recensioni"})
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span className="text-sm text-white/80">{product.duration}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow -mt-6 relative z-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="font-bold text-xl mb-4">Cosa include</h2>
                <ul className="space-y-3">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Recensioni
                    {reviews.length > 0 && (
                      <Badge variant="secondary" className="ml-1">{reviews.length}</Badge>
                    )}
                  </h2>
                  {!showReviewForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewForm(true)}
                      data-testid="button-write-review"
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Scrivi una recensione
                    </Button>
                  )}
                </div>

                {reviews.length > 0 && (
                  <Card className="p-5 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-extrabold mb-1">{avgRating.toFixed(1)}</div>
                        <StarRating rating={Math.round(avgRating)} size="md" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {reviews.length} {reviews.length === 1 ? "recensione" : "recensioni"}
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
                      className="mb-6 overflow-hidden"
                    >
                      <ReviewForm
                        productSlug={product.slug}
                        onSuccess={() => setShowReviewForm(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-5 animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                        <div className="h-3 bg-muted rounded w-full mb-2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </Card>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <ThumbsUp className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-semibold mb-1">Nessuna recensione ancora</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sii il primo a recensire questo corso!
                    </p>
                    {!showReviewForm && (
                      <Button
                        variant="outline"
                        size="sm"
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
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6 shadow-lg border-primary/20">
                  {product.options && product.options.length > 0 && (() => {
                    const priceDrivingKeys = new Set(
                      (product.variations || []).flatMap((v) => Object.keys(v.options))
                    );
                    return (
                    <div className="space-y-3 mb-5 pb-5 border-b border-border/40">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Configura il corso</p>
                      {product.options.map((opt) => {
                        const isPriceDriving = priceDrivingKeys.has(opt.name);
                        return (
                        <div key={opt.name}>
                          <Label className="text-sm font-medium mb-1.5 block">{opt.label}</Label>
                          <div className="space-y-1">
                            {opt.values.map((v) => {
                              const isSelected = selectedOptions[opt.name] === v;
                              let priceForValue: string | null = null;
                              if (isPriceDriving && product.variations) {
                                const match = product.variations.find((var_) =>
                                  Object.entries(var_.options).every(([k, val]) => {
                                    if (k === opt.name) return val === v;
                                    return !selectedOptions[k] || selectedOptions[k] === val;
                                  })
                                );
                                if (match) priceForValue = match.price;
                              }
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: v }))}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                    isSelected
                                      ? "bg-primary/10 border border-primary/30 text-primary font-medium"
                                      : "bg-muted/50 hover:bg-muted border border-transparent"
                                  }`}
                                  data-testid={`option-${opt.name}-${v}`}
                                >
                                  <span className="line-clamp-1 mr-2">{v}</span>
                                  {priceForValue && (
                                    <span className={`text-xs font-semibold shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                                      &euro;{parseFloat(priceForValue).toFixed(0)}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    );
                  })()}

                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                      {product.variations && hasAllOptions && hasValidVariation ? "Prezzo" : product.priceRange ? "A partire da" : "Prezzo"}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold">
                        &euro;{product.variations && hasAllOptions && hasValidVariation
                          ? parseFloat(effectivePrice).toFixed(2)
                          : product.priceRange
                            ? parseFloat(product.priceRange.min).toFixed(0)
                            : parseFloat(product.price).toFixed(0)
                        }
                      </span>
                      {!product.variations && !product.priceRange && product.priceLabel && (
                        <span className="text-sm text-muted-foreground">/{product.priceLabel}</span>
                      )}
                      {product.priceRange && !(hasAllOptions && hasValidVariation) && (
                        <span className="text-sm text-muted-foreground">
                          - &euro;{parseFloat(product.priceRange.max).toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    <Link href={`/shop/checkout/${product.slug}`}>
                      <Button
                        className={`w-full bg-gradient-to-r ${gradientClass} text-white border-0 shadow-md hover:shadow-lg h-11`}
                        data-testid="button-buy-now"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Acquista Ora
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full h-11"
                      onClick={handleAddToCart}
                      data-testid="button-add-cart"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Aggiungi al Carrello
                    </Button>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Conferma immediata via email</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Pagamento sicuro con PayPal</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{product.duration}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
