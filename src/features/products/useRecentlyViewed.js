import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentlyViewed = create(
  persist(
    (set, get) => ({
      items: [], // Array of product objects
      
      addRecentlyViewed: (product) => {
        if (!product || !product.id) return;
        
        const { items } = get();
        // Remove product if it already exists to put it at the front
        const filteredItems = items.filter((item) => item.id !== product.id);
        
        // Add to the front (beginning of array) and keep only the last 10
        set({ 
          items: [product, ...filteredItems].slice(0, 10) 
        });
      },

      clearRecentlyViewed: () => set({ items: [] }),
    }),
    {
      name: 'elilian-signature-recently-viewed',
    }
  )
);
