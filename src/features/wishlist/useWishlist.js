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
      
      addToWishlist: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
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
      
      clearWishlist: () => set({ items: [] }),
      
      wishlistCount: () => get().items.length,
    }),
    {
      name: 'elilian-signature-wishlist',
    }
  )
);
