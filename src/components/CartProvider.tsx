'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { priceItem, type CartItem, type PricedLine } from '@/lib/cart';

type Ctx = {
  items: CartItem[];
  lines: (PricedLine & { key: string })[];
  count: number;
  add: (item: Omit<CartItem, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'party-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<Ctx>(() => {
    const lines = items.flatMap((i) => {
      const l = priceItem(i);
      return l ? [{ ...l, key: i.key }] : [];
    });
    return {
      items,
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      add: (item) =>
        setItems((prev) => {
          const same = prev.find((p) => p.productId === item.productId && p.themeId === item.themeId && p.guests === item.guests);
          if (same) return prev.map((p) => (p === same ? { ...p, qty: Math.min(10, p.qty + item.qty) } : p));
          return [...prev, { ...item, key: crypto.randomUUID() }];
        }),
      setQty: (key, qty) => setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, Math.min(10, qty)) } : p))),
      remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
