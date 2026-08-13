/* Clinical Warmth commerce interaction: one global cart persists across home, product details, and service routes. */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/store";

type Cart = Record<string, number>;
type CartContextValue = { cart: Cart; cartItems: typeof products; cartCount: number; addToCart: (id: string, quantity?: number) => void; updateCart: (id: string, change: number) => void; removeFromCart: (id: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const cartItems = useMemo(() => products.filter((product) => cart[product.id]), [cart]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const addToCart = (id: string, quantity = 1) => setCart((current) => ({ ...current, [id]: Math.min((current[id] || 0) + quantity, products.find((product) => product.id === id)?.stock || 99) }));
  const updateCart = (id: string, change: number) => setCart((current) => {
    const stock = products.find((product) => product.id === id)?.stock || 99;
    const next = { ...current, [id]: Math.min(stock, Math.max(0, (current[id] || 0) + change)) };
    if (next[id] === 0) delete next[id];
    return next;
  });
  const removeFromCart = (id: string) => setCart((current) => { const next = { ...current }; delete next[id]; return next; });
  return <CartContext.Provider value={{ cart, cartItems, cartCount, addToCart, updateCart, removeFromCart, clearCart: () => setCart({}) }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
