import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { SHOP_PRODUCTS, type ShopProduct } from "@shared/products";
import {
  ShoppingBag,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  User,
} from "lucide-react";

const CATEGORIES = [
  "Tutti",
  "Formazione in Presenza",
  "Corsi E-Learning",
  "Language Coaching",
  "Corsi di Italiano per Stranieri",
];

function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <Card className="h-full hover-elevate group relative overflow-hidden" data-testid={`card-product-${product.slug}`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant="secondary" className="text-xs shrink-0">
            {product.category}
          </Badge>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.slug}`}>
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {product.description}
        </p>

        <ul className="space-y-1.5 mb-5">
          {product.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{product.duration}</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-primary">&euro;{parseFloat(product.price).toFixed(0)}</span>
            <span className="text-sm text-muted-foreground ml-1">/{product.priceLabel}</span>
          </div>
          <Link href={`/shop/checkout/${product.slug}`}>
            <Button size="sm" data-testid={`button-buy-${product.slug}`}>
              Acquista
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tutti");

  const filtered = SHOP_PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "Tutti" || p.category === activeCategory;
    const matchesSearch =
      search.length === 0 ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Shop Corsi
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-shop-title">
              Acquista il Tuo Corso Online
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Scegli tra i nostri corsi di formazione linguistica e professionale. Pagamento sicuro con PayPal, Visa e Mastercard.
            </p>
            <Button variant="outline" size="sm" onClick={() => setLocation("/shop/dashboard")} data-testid="button-area-clienti">
              <User className="w-4 h-4 mr-1" />
              Area Clienti
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca un corso..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`button-filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {cat === "Tutti" ? cat : cat.split(" ").slice(0, 2).join(" ")}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nessun corso trovato per i criteri selezionati.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
