import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { SHOP_PRODUCTS, type ShopProduct, formatPriceDisplay } from "@shared/products";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  GraduationCap,
  Globe,
  Monitor,
  Sparkles,
  Star,
  Shield,
  CreditCard,
  Headphones,
  BookOpen,
  Users,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  X,
} from "lucide-react";
import { SiPaypal, SiVisa, SiMastercard } from "react-icons/si";

const CATEGORY_CONFIG = [
  { key: "Tutti", label: "Tutti i Corsi", icon: Sparkles, color: "from-primary to-blue-400" },
  { key: "Formazione in Presenza", label: "In Presenza", icon: GraduationCap, color: "from-blue-600 to-indigo-500" },
  { key: "Corsi E-Learning", label: "E-Learning", icon: Monitor, color: "from-emerald-600 to-teal-500" },
  { key: "Language Coaching", label: "Coaching", icon: Headphones, color: "from-violet-600 to-purple-500" },
  { key: "Corsi di Italiano per Stranieri", label: "Italiano", icon: Globe, color: "from-orange-500 to-amber-500" },
];

const FEATURED_SLUGS = ["camclass-selflearning", "coaching-online", "full-immersion", "ai-senza-segreti"];

function ProductCard({ product, index, featured = false }: { product: ShopProduct; index: number; featured?: boolean }) {
  const categoryConfig = CATEGORY_CONFIG.find(c => c.key === product.category);
  const gradientClass = categoryConfig?.color || "from-primary to-blue-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
      className="h-full"
    >
      <Card
        className={`h-full group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 ${featured ? "ring-2 ring-primary/20" : ""}`}
        data-testid={`card-product-${product.slug}`}
      >
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradientClass}`} />

        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Popolare
            </Badge>
          </div>
        )}

        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-6 pb-4 flex-grow">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-sm`}>
                {categoryConfig && <categoryConfig.icon className="w-4 h-4 text-white" />}
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h3
              className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 leading-tight"
              data-testid={`text-product-name-${product.slug}`}
            >
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <ul className="space-y-2 mb-4">
              {product.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{product.duration}</span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0">
            <div className="border-t pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">
                    {product.priceRange ? "A partire da" : "Prezzo"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground">
                      &euro;{product.priceRange ? parseFloat(product.priceRange.min).toFixed(0) : parseFloat(product.price).toFixed(0)}
                    </span>
                    {!product.priceRange && product.priceLabel && (
                      <span className="text-xs text-muted-foreground">/{product.priceLabel}</span>
                    )}
                    {product.priceRange && (
                      <span className="text-xs text-muted-foreground">
                        - &euro;{parseFloat(product.priceRange.max).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/shop/checkout/${product.slug}`}>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                    data-testid={`button-buy-${product.slug}`}
                  >
                    Acquista
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CategoryTab({
  config,
  active,
  count,
  onClick,
}: {
  config: typeof CATEGORY_CONFIG[0];
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const Icon = config.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "bg-card hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/50"
      }`}
      data-testid={`button-filter-${config.key.toLowerCase().replace(/\s/g, "-")}`}
    >
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-muted"}`}>
        {count}
      </span>
    </button>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </div>
  );
}

export default function ShopPage() {
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

  const featuredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter(p => FEATURED_SLUGS.includes(p.slug));
  }, []);

  const showFeatured = activeCategory === "Tutti" && search.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,67%,20%)] via-[hsl(222,67%,30%)] to-[hsl(240,60%,25%)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500 rounded-full blur-[150px]" />
          <div className="absolute top-40 right-1/3 w-48 h-48 bg-cyan-400 rounded-full blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
            >
              <ShoppingBag className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">
                Catalogo Corsi Online
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight" data-testid="text-shop-title">
              Investi nel Tuo
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Futuro Professionale
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Scegli tra {SHOP_PRODUCTS.length} corsi di formazione linguistica e professionale. Pagamento sicuro con PayPal, Visa e Mastercard.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              <StatCard icon={BookOpen} value={`${SHOP_PRODUCTS.length}+`} label="Corsi disponibili" />
              <StatCard icon={Users} value="500+" label="Studenti formati" />
              <StatCard icon={Award} value="30+" label="Anni di esperienza" />
              <StatCard icon={TrendingUp} value="98%" label="Soddisfazione" />
            </div>

            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              onClick={() => setLocation("/shop/dashboard")}
              data-testid="button-area-clienti"
            >
              <User className="w-4 h-4 mr-2" />
              Area Clienti
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      <main className="flex-grow -mt-6 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex flex-col gap-5">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cerca un corso per nome, categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-border/50 shadow-sm bg-card"
                  data-testid="input-search"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Cancella ricerca"
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORY_CONFIG.map((cat) => (
                  <CategoryTab
                    key={cat.key}
                    config={cat}
                    active={activeCategory === cat.key}
                    count={categoryCounts[cat.key] || 0}
                    onClick={() => setActiveCategory(cat.key)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {showFeatured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">I Piu Richiesti</h2>
                  <p className="text-xs text-muted-foreground">I corsi preferiti dai nostri studenti</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.map((product, i) => (
                  <ProductCard key={product.slug} product={product} index={i} featured />
                ))}
              </div>
            </motion.div>
          )}

          <div className="mb-6">
            {!showFeatured && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {activeCategory === "Tutti" ? "Risultati ricerca" : activeCategory}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filtered.length} {filtered.length === 1 ? "corso" : "corsi"}
                </span>
              </div>
            )}

            {showFeatured && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Tutti i Corsi</h2>
                  <p className="text-xs text-muted-foreground">Esplora il catalogo completo</p>
                </div>
              </div>
            )}

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
                  <p className="text-lg font-medium mb-1">Nessun corso trovato</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prova a cambiare i criteri di ricerca o il filtro categoria.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSearch(""); setActiveCategory("Tutti"); }}
                    data-testid="button-show-all-courses"
                  >
                    Mostra tutti i corsi
                  </Button>
                </motion.div>
              ) : (
                <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.slug} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 mb-16"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(222,67%,25%)] to-[hsl(240,60%,20%)] p-8 md:p-12">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 rounded-full blur-[80px]" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Pagamento Sicuro e Garantito
                  </h3>
                  <p className="text-white/70 max-w-lg">
                    Acquista con serenita tramite PayPal, Visa o Mastercard. I tuoi dati sono protetti con crittografia di livello bancario.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <SiPaypal className="w-8 h-5 text-[#00457C]" style={{ filter: "brightness(2)" }} />
                    </div>
                    <div className="w-16 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <SiVisa className="w-8 h-5 text-white" />
                    </div>
                    <div className="w-16 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <SiMastercard className="w-8 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Transazione crittografata SSL 256-bit</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Pagamento Flessibile</p>
                    <p className="text-xs text-white/50">PayPal, Visa, Mastercard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">100% Sicuro</p>
                    <p className="text-xs text-white/50">Dati protetti e crittografati</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Assistenza Dedicata</p>
                    <p className="text-xs text-white/50">Supporto pre e post acquisto</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
