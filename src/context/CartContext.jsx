import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'shop_cart';

function getSavedCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);

  const persist = useCallback((nextItems) => {
    setCartItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        const updated = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: existing.quantity + qty } : item
        );
        persist(updated);
        return updated;
      }
      const newItems = [...prevItems, { ...product, quantity: qty }];
      persist(newItems);
      return newItems;
    });
  }, [persist]);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter((item) => item.id !== productId);
      persist(filtered);
      return filtered;
    });
  }, [persist]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    persist([]);
  }, [persist]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, cartCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }
  return context;
}

