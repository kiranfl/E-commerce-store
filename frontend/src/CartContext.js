import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "portfolio-shop-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  const persist = useCallback(next => {
    setItems(next);
    saveCart(next);
  }, []);

  const addItem = useCallback(
    product => {
      const id = product._id;
      setItems(prev => {
        const idx = prev.findIndex(i => i.productId === id);
        let next;
        if (idx === -1) {
          next = [
            ...prev,
            {
              productId: id,
              name: product.name,
              price: product.price,
              qty: 1,
              image: product.image || ""
            }
          ];
        } else {
          next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        }
        saveCart(next);
        return next;
      });
    },
    [setItems]
  );

  const setQty = useCallback((productId, qty) => {
    const q = Math.max(1, Math.floor(Number(qty) || 1));
    setItems(prev => {
      const next = prev.map(i => (i.productId === productId ? { ...i, qty: q } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback(productId => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQty,
      removeItem,
      clearCart,
      totalQty,
      subtotal
    }),
    [items, addItem, setQty, removeItem, clearCart, totalQty, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
