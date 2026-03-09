/**
 * File: useCart.js
 * Purpose: Global state for the shopping cart.
 * Dependencies: zustand
 * Notes: Persists cart to local storage so users don't lose items on refresh.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastUpdatedAt: 0,
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (product, variant, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.variant.id === variant.id
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems, lastUpdatedAt: Date.now() });
        } else {
          set({ items: [...items, { product, variant, quantity }], lastUpdatedAt: Date.now() });
        }
      },

      removeFromCart: (variantId) => {
        set({
          items: get().items.filter((item) => item.variant.id !== variantId),
          lastUpdatedAt: Date.now()
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) return get().removeFromCart(variantId);

        const newItems = get().items.map((item) =>
          item.variant.id === variantId ? { ...item, quantity } : item
        );
        set({ items: newItems, lastUpdatedAt: Date.now() });
      },

      clearCart: () => set({ items: [], lastUpdatedAt: Date.now() }),
      
      // For syncing purposes (bypasses lastUpdatedAt so we don't trigger a push loop)
      setCart: (newItems) => set({ items: newItems }),

      // Helpers
      cartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.variant?.price?.amount || 0);
          return total + (price * item.quantity);
        }, 0);
      },

      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      cartCurrency: () => {
        if (get().items.length > 0) {
          return get().items[0].variant?.price?.currencyCode || 'USD';
        }
        return 'USD';
      }
    }),
    {
      name: 'elilian-signature-cart',
      // We don't want to persist the `isOpen` state across page reloads
      partialize: (state) => ({ items: state.items, lastUpdatedAt: state.lastUpdatedAt }),
    }
  )
);
