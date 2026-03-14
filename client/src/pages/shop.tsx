import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useSEO } from "@/hooks/use-seo";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { SHOP_PRODUCTS, type ShopProduct, formatPriceDisplay } from "@shared/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductReview } from "@shared/schema";
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  GraduationCap,
  Globe,
  Monitor,
  Sparkles,
  Shield,
  Headphones,
  BookOpen,
  ChevronRight,
  X,
  Award,
  Users,
  Zap,
  Star,
  MessageSquare,
} from "lucide-react";
import { SiPaypal, SiVisa, SiMastercard } from "react-icons/si";
import cartaCulturaLogo from "@assets/carte-cultura-1200x675_1772388120185.avif";

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

const CATEGORY_CONFIG = [
  { key: "Tutti", label: "Tutti", icon: Sparkles, color: "from-primary to-blue-400" },
  { key: "Formazione in Presenza", label: "In Presenza", icon: GraduationCap, color: "from-blue-600 to-indigo-500" },
  { key: "Corsi E-Learning", label: "E-Learning", icon: Monitor, color: "from-emerald-600 to-teal-500" },
  { key: "Language Coaching", label: "Coaching", icon: Headphones, color: "from-violet-600 to-purple-500" },
  { key: "Corsi di Italiano per Stranieri", label: "Italiano", icon: Globe, color: "from-orange-500 to-amber-500" },
];

function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const categoryConfig = CATEGORY_CONFIG.find(c => c.key === product.category);
  const gradientClass = categoryConfig?.color || "from-primary to-blue-400";
  const cardImage = PRODUCT_IMAGES[product.slug];
  const cart = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: reviews = [] } = useQuery<ProductReview[]>({
    queryKey: [`/api/shop/reviews/${product.slug}`],
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      setLocation(`/shop/product/${product.slug}`);
      return;
    }
    cart.addItem(product);
    toast({
      title: "Aggiunto al carrello",
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
      className="h-full"
    >
      <Card
        className="h-full group relative overflow-hidden border border-border/50 bg-card hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        data-testid={`card-product-${product.slug}`}
        onClick={() => setLocation(`/shop/product/${product.slug}`)}
      >
        <div className={`relative h-28 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
          {cardImage && (
            <img src={cardImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} ${cardImage ? "opacity-50" : "opacity-100"}`} />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {categoryConfig && <categoryConfig.icon className="w-4 h-4 text-white" />}
            </div>
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
              <Clock className="w-3 h-3 text-white/90" />
              <span className="text-[10px] font-medium text-white/90">{product.duration}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="p-5 pb-3 flex-grow">
            <h3
              className="text-[15px] font-bold mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2"
              data-testid={`text-product-name-${product.slug}`}
            >
              {product.name}
            </h3>

            {reviews.length > 0 && (
              <div
                className="flex items-center gap-1.5 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`${product.pageLink}#reviews`);
                }}
                data-testid={`link-reviews-${product.slug}`}
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground underline decoration-dotted">
                  ({reviews.length})
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <ul className="space-y-2">
              {product.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 pb-5 mt-auto">
            <div className="border-t border-border/40 pt-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-0.5 uppercase tracking-wide">
                    {product.priceRange ? "A partire da" : "Prezzo"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground">
                      &euro;{product.priceRange ? parseFloat(product.priceRange.min).toFixed(0) : parseFloat(product.price).toFixed(0)}
                    </span>
                    {!product.priceRange && product.priceLabel && (
                      <span className="text-[11px] text-muted-foreground">/{product.priceLabel}</span>
                    )}
                    {product.priceRange && (
                      <span className="text-[11px] text-muted-foreground">
                        - &euro;{parseFloat(product.priceRange.max).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[9px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded px-1.5 py-0.5 font-medium">
                    Carta della Cultura
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={`flex-1 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 h-9 text-xs`}
                  data-testid={`button-buy-${product.slug}`}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (product.options && product.options.length > 0) {
                      setLocation(`/shop/product/${product.slug}`);
                    } else {
                      setLocation(`/shop/checkout/${product.slug}`);
                    }
                  }}
                >
                  Acquista Ora
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-3"
                  data-testid={`button-cart-${product.slug}`}
                  onClick={handleAddToCart}
                  title="Aggiungi al Carrello"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ShopPage() {
  useSEO({
    title: "Acquista Corsi di Lingue Online e in Presenza | SkillCraft-Interlingua",
    description: "Acquista corsi di lingue online e in presenza a Vicenza. Inglese, tedesco, francese, spagnolo, italiano per stranieri. Pagamento sicuro con PayPal.",
    canonical: "/shop",
  });
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tutti");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tutti": SHOP_PRODUCTS.length };
    SHOP_PRODUCTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return SHOP_PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "Tutti" || p.category === activeCategory;
      const matchesSearch =
        search.length === 0 ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }]} schemaOnly />
      <Navigation />

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,67%,15%)] via-[hsl(222,67%,25%)] to-[hsl(250,60%,20%)]" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-[15%] w-72 h-72 bg-violet-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-medium text-white/90">Catalogo Corsi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]" data-testid="text-shop-title">
              Investi nel Tuo{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Futuro Professionale
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-xl mx-auto mb-8">
              {SHOP_PRODUCTS.length} corsi di formazione linguistica e professionale. Acquista online in modo sicuro.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                {[
                  { icon: Shield, label: "Pagamento Sicuro" },
                  { icon: Award, label: "Ente Accreditato" },
                  { icon: Users, label: "3000+ Studenti" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-white/40 text-xs">
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {i < 2 && <span className="ml-2 text-white/15">|</span>}
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center justify-center gap-4"
            >
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <SiPaypal className="w-5 h-4 text-white/50" />
                <SiVisa className="w-6 h-4 text-white/50" />
                <SiMastercard className="w-6 h-4 text-white/50" />
                <div className="w-px h-4 bg-white/15" />
                <img src={cartaCulturaLogo} alt="Carta della Cultura" className="h-4 w-auto rounded-lg opacity-50" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white hover:bg-white/10 h-9 rounded-full border border-white/10"
                onClick={() => setLocation("/shop/dashboard")}
                data-testid="button-area-clienti"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Area Clienti
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      <main className="flex-grow -mt-6 relative z-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <Card className="p-4 border-border/50 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-grow max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca un corso..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-10 text-sm rounded-lg border-border/50 bg-muted/50 focus:bg-card"
                    data-testid="input-search"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Cancella ricerca"
                      data-testid="button-clear-search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {CATEGORY_CONFIG.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    const count = categoryCounts[cat.key] || 0;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                          isActive
                            ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                            : "bg-muted/50 hover:bg-muted text-muted-foreground"
                        }`}
                        data-testid={`button-filter-${cat.key.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-background"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {activeCategory === "Tutti" && search.length === 0
                ? "Tutti i Corsi"
                : activeCategory === "Tutti"
                  ? "Risultati ricerca"
                  : activeCategory}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {filtered.length} {filtered.length === 1 ? "corso" : "corsi"}
            </Badge>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold mb-2">Nessun corso trovato</p>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Non abbiamo trovato corsi corrispondenti alla tua ricerca. Prova con altri termini.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setSearch(""); setActiveCategory("Tutti"); }}
                  data-testid="button-show-all-courses"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Mostra tutti i corsi
                </Button>
              </motion.div>
            ) : (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <Card className="overflow-hidden border-border/50">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5">Pagamento Sicuro</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Transazioni crittografate tramite PayPal, Visa e Mastercard
                    </p>
                  </div>
                </div>
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5">Ente Accreditato</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Accreditati dalla Regione Veneto dal 2003
                    </p>
                  </div>
                </div>
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5">Accesso Immediato</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Conferma automatica via email dopo l'acquisto
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/40 px-6 py-4 bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">Metodi di pagamento accettati</span>
                <div className="flex items-center gap-4">
                  <SiPaypal className="w-8 h-5 text-[#003087] dark:text-[#0070ba]" />
                  <SiVisa className="w-8 h-5 text-[#1a1f71] dark:text-blue-400" />
                  <SiMastercard className="w-8 h-5 text-[#eb001b] dark:text-red-400" />
                  <div className="w-px h-5 bg-border/50" />
                  <img src={cartaCulturaLogo} alt="Carta della Cultura" className="h-6 w-auto rounded-lg" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
