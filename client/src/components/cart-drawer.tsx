import { useCart } from "@/lib/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col" data-testid="cart-drawer">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrello
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-1" data-testid="badge-cart-count">
                {totalItems} {totalItems === 1 ? "articolo" : "articoli"}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Gestisci gli articoli nel tuo carrello</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium mb-1">Il carrello è vuoto</p>
              <p className="text-sm text-muted-foreground">Esplora il catalogo e aggiungi i corsi che ti interessano.</p>
            </div>
            <Link href="/shop">
              <Button variant="outline" onClick={() => setIsOpen(false)} data-testid="button-browse-shop">
                Vai allo Shop
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto py-4 space-y-4">
              {items.map((item, index) => (
                <div key={`${item.product.slug}-${JSON.stringify(item.selectedOptions)}`} className="rounded-xl border bg-card p-4" data-testid={`cart-item-${index}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-sm leading-tight truncate" data-testid={`cart-item-name-${index}`}>
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.product.category}</p>
                      {Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-[10px] py-0 px-1.5">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(index)}
                      data-testid={`button-remove-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-qty-minus-${index}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center" data-testid={`text-qty-${index}`}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        data-testid={`button-qty-plus-${index}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-primary" data-testid={`text-item-price-${index}`}>
                      &euro;{(parseFloat(item.effectivePrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Totale</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">&euro;{totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/shop/checkout">
                <Button
                  className="w-full h-12 text-base font-semibold"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-checkout"
                >
                  Procedi al Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={clearCart}
                data-testid="button-clear-cart"
              >
                Svuota carrello
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
