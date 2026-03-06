/**
 * File: useWishlist.js
 * Purpose: Global state for saved products (wishlist).
 * Dependencies: zustand
 * Notes: Persists wishlist to local storage so users don't lose saved items.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [], // Array of product objects
      lastUpdatedAt: 0, // Track when the local store was last genuinely modified
      
      addToWishlist: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product], lastUpdatedAt: Date.now() });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
          lastUpdatedAt: Date.now()
        });
      },

      toggleWishlist: (product) => {
        const { items, addToWishlist, removeFromWishlist } = get();
        if (items.find((item) => item.id === product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      
      clearWishlist: () => set({ items: [], lastUpdatedAt: Date.now() }),
      
      // For syncing purposes (bypasses lastUpdatedAt so we don't trigger a push loop)
      setWishlist: (newItems) => set({ items: newItems }),
      
      wishlistCount: () => get().items.length,
    }),
    {
      name: 'elilian-signature-wishlist',
    }
  )
);
