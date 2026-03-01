import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { ShopProduct } from "@shared/products";
import { getEffectivePrice, getProductBySlug } from "@shared/products";

export interface CartItem {
  product: ShopProduct;
  selectedOptions: Record<string, string>;
  effectivePrice: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: ShopProduct, selectedOptions?: Record<string, string>) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function serializeCart(items: CartItem[]) {
  return items.map(item => ({
    slug: item.product.slug,
    selectedOptions: item.selectedOptions,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("shop_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        const restored: CartItem[] = [];
        for (const entry of parsed) {
          const product = getProductBySlug(entry.slug);
          if (product) {
            restored.push({
              product,
              selectedOptions: entry.selectedOptions || {},
              effectivePrice: getEffectivePrice(product, entry.selectedOptions || {}),
              quantity: entry.quantity || 1,
            });
          }
        }
        return restored;
      }
    } catch {}
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shop_cart", JSON.stringify(serializeCart(items)));
  }, [items]);

  const addItem = useCallback((product: ShopProduct, selectedOptions: Record<string, string> = {}) => {
    const normalizedOptions = Object.keys(selectedOptions).sort().reduce((acc, key) => {
      acc[key] = selectedOptions[key];
      return acc;
    }, {} as Record<string, string>);
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.slug === product.slug &&
          JSON.stringify(Object.keys(item.selectedOptions).sort().reduce((acc, k) => { acc[k] = item.selectedOptions[k]; return acc; }, {} as Record<string, string>)) === JSON.stringify(normalizedOptions)
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, {
        product,
        selectedOptions: normalizedOptions,
        effectivePrice: getEffectivePrice(product, normalizedOptions),
        quantity: 1,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.effectivePrice) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
