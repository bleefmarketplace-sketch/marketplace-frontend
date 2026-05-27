import { create } from 'zustand';
import { Product } from '@/components/types';
import { getCookie, setCookie } from 'cookies-next';

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string; // Links to backend cart_items.id for PATCH/DELETE operations
}

interface CartState {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

// Helper: Retrieve or generate a cryptographically secure anonymous session UUID
export const getOrCreateCartSession = (): string => {
  let sessionId = getCookie('bleef_cart_session') as string;
  if (!sessionId) {
    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setCookie('bleef_cart_session', sessionId, { maxAge: 30 * 24 * 60 * 60, path: '/' });
  }
  return sessionId;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Hydrate local cache store directly from database
  fetchCart: async () => {
    try {
      const sessionId = getOrCreateCartSession();
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (res.ok) {
        const dbItems = await res.json();



        // Map database structure to expected frontend schema
        const mappedItems = dbItems?.data.map((dbItem: { id: string; quantity: number; product: Product }) => ({
          ...dbItem.product,
          id: dbItem.product.id,       // Product ID
          cartItemId: dbItem.id,       // DB CartItem ID
          quantity: dbItem.quantity
        }));

        set({ items: mappedItems });
      }
    } catch (e) {
      console.error("Failed to fetch cart from database:", e);
    }
  },

  // Add crop to cart in database, then refresh state
  addItem: async (product, quantity) => {
    try {
      const sessionId = getOrCreateCartSession();
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          sessionId
        })
      });

      if (res.ok) {
        await get().fetchCart();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add item to cart");
      }
    } catch (e: unknown) {
      console.error("Error adding to cart:", e);
      throw e;
    }
  },

  // Remove specific item from database, and update cache
  removeItem: async (productId) => {
    try {
      const sessionId = getOrCreateCartSession();
      const targetItem = get().items.find(item => item.id === productId);
      if (!targetItem || !targetItem.cartItemId) return;

      const res = await fetch(`/api/cart/${targetItem.cartItemId}?sessionId=${sessionId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        set({ items: get().items.filter(item => item.id !== productId) });
      }
    } catch (e) {
      console.error("Error removing cart item:", e);
    }
  },

  // Update quantity in database, and update cache
  updateQuantity: async (productId, quantity) => {
    try {
      const sessionId = getOrCreateCartSession();
      const targetItem = get().items.find(item => item.id === productId);
      if (!targetItem || !targetItem.cartItemId) return;

      if (quantity <= 0) {
        await get().removeItem(productId);
        return;
      }

      const res = await fetch(`/api/cart/${targetItem.cartItemId}?sessionId=${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      if (res.ok) {
        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      } else {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update quantity");
      }
    } catch (e: unknown) {
      console.error("Error updating cart quantity:", e);
      throw e;
    }
  },

  // Wipe cart cache
  clearCart: async () => {
    // Note: Items are removed individually from DB on checkout success. 
    // This clears local cache instantly.
    set({ items: [] });
  },

  // Sum total value of items in cart
  getTotalPrice: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  // Count unique products in cart
  getItemCount: () => {
    return get().items.length;
  }
}));