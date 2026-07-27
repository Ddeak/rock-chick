'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import { cartReducer, type CartAction, type CartItem } from '@/lib/cart';

const STORAGE_KEY = 'rock-chick-cart';

interface StoredCart {
  items: CartItem[];
  pickupDate: string | null;
}

interface CartContextValue {
  items: CartItem[];
  dispatch: Dispatch<CartAction>;
  pickupDate: string | null;
  setPickupDate: (date: string | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load any persisted cart after mount only, to avoid a server/client
  // hydration mismatch (the server always renders an empty cart).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredCart;
        dispatch({ type: 'HYDRATE', items: parsed.items ?? [] });
        setPickupDate(parsed.pickupDate ?? null);
      }
    } catch {
      // Ignore malformed/inaccessible storage; start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const toStore: StoredCart = { items, pickupDate };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [items, pickupDate, isHydrated]);

  return (
    <CartContext.Provider value={{ items, dispatch, pickupDate, setPickupDate }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
