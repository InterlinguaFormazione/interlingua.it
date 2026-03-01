import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { SHOP_PRODUCTS, type ShopProduct, formatPriceDisplay } from "@shared/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { SiPaypal, SiVisa, SiMastercard } from "react-icons/si";

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
  const cart = useCart();
  const { toast } = useToast();
  const hasOptions = product.options && product.options.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      transition={{ duration: 0.3, delay: index * 0.03 }}
      layout
      className="h-full"
    >
      <Card
        className="h-full group relative overflow-hidden border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
        data-testid={`card-product-${product.slug}`}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass} opacity-70 group-hover:opacity-100 transition-opacity`} />

        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-5 pb-3 flex-grow">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                {categoryConfig && <categoryConfig.icon className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h3
              className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2"
              data-testid={`text-product-name-${product.slug}`}
            >
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <ul className="space-y-1.5 mb-3">
              {product.features.slice(0, 2).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{product.duration}</span>
            </div>
          </div>

          <div className="px-5 pb-5 mt-auto">
            <div className="border-t border-border/40 pt-3 flex items-end justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground block mb-0.5">
                  {product.priceRange ? "Da" : "Prezzo"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-foreground">
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
              </div>
              <div className="flex items-center gap-1.5">
                {!hasOptions && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 border-border/50 hover:bg-muted"
                    onClick={handleAddToCart}
                    data-testid={`button-cart-${product.slug}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}
                <Link href={`/shop/checkout/${product.slug}`}>
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white border-0 shadow-sm transition-all duration-300 group/btn h-9`}
                    data-testid={`button-buy-${product.slug}`}
                  >
                    {hasOptions ? "Configura" : "Acquista"}
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,67%,20%)] via-[hsl(222,67%,30%)] to-[hsl(240,60%,25%)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500 rounded-full blur-[120px]" />
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
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <ShoppingBag className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">Catalogo Corsi</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight" data-testid="text-shop-title">
              Investi nel Tuo{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Futuro Professionale
              </span>
            </h1>

            <p className="text-base text-white/60 max-w-xl mx-auto mb-6">
              {SHOP_PRODUCTS.length} corsi di formazione linguistica e professionale. Pagamento sicuro con PayPal.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <SiPaypal className="w-5 h-4" style={{ filter: "brightness(2)" }} />
                <SiVisa className="w-6 h-4" />
                <SiMastercard className="w-6 h-4" />
              </div>
              <span className="text-white/20">|</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 h-8"
                onClick={() => setLocation("/shop/dashboard")}
                data-testid="button-area-clienti"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Area Clienti
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </section>

      <main className="flex-grow -mt-4 relative z-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca un corso..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-lg border-border/50 bg-card"
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

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORY_CONFIG.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  const count = categoryCounts[cat.key] || 0;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-card hover:bg-muted text-muted-foreground border border-border/40"
                      }`}
                      data-testid={`button-filter-${cat.key.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                      <span className={`text-[10px] px-1 py-0.5 rounded ${isActive ? "bg-white/20" : "bg-muted"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {activeCategory === "Tutti" && search.length === 0
                ? "Tutti i Corsi"
                : activeCategory === "Tutti"
                  ? "Risultati ricerca"
                  : activeCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "corso" : "corsi"}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-base font-medium mb-1">Nessun corso trovato</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Prova a cambiare i criteri di ricerca.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearch(""); setActiveCategory("Tutti"); }}
                  data-testid="button-show-all-courses"
                >
                  Mostra tutti
                </Button>
              </motion.div>
            ) : (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            className="mt-14"
          >
            <div className="rounded-xl bg-muted/50 border border-border/40 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Pagamento Sicuro</h3>
                    <p className="text-xs text-muted-foreground">
                      Transazioni crittografate tramite PayPal, Visa e Mastercard
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SiPaypal className="w-8 h-5 text-[#003087] dark:text-[#0070ba]" />
                  <SiVisa className="w-8 h-5 text-[#1a1f71] dark:text-blue-400" />
                  <SiMastercard className="w-8 h-5 text-[#eb001b] dark:text-red-400" />
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
