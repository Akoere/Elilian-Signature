/**
 * File: WishlistSync.jsx
 * Purpose: Headless component to sync local Zustand wishlist with Supabase.
 * Dependencies: React, useAuth, useWishlist, wishlistService
 */
import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from './useWishlist';
import { getWishlist, updateWishlist } from '../../services/supabase/wishlistService';

export const WishlistSync = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, setWishlist } = useWishlist();
  
  // Track the DB initialization state to avoid pushing local items before fetching
  const isInitialized = useRef(false);

  // Sync effect: When user logs in or out
  useEffect(() => {
    let mounted = true;

    const syncWishlistOnLogin = async () => {
      if (!user) {
        // User logged out
        isInitialized.current = false;
        return;
      }

      isInitialized.current = false;

      try {
        // Fetch from DB
        const dbItems = await getWishlist(user.id);
        
        if (mounted) {
          const currentLocalState = useWishlist.getState();
          const currentLocalItems = currentLocalState.items;
          const localLastUpdated = currentLocalState.lastUpdatedAt || 0;
          
          let mergedItems = [];
          let needsDbUpdate = false;

          if (dbItems.length > 0 && currentLocalItems.length === 0) {
            // Case 1: DB has items, local is empty. 
            // Was it explicitly cleared recently, or is this just a fresh login on a new device?
            // If they just logged in, lastUpdatedAt will usually be 0 (or very old compared to now)
            // But if they just hit "Clear Wishlist" and reloaded, lastUpdatedAt is very recent.
            // Let's check if the local store was actively modified in the last hour.
            const OneHour = 60 * 60 * 1000;
            const wasRecentlyClearedLocally = (Date.now() - localLastUpdated) < OneHour;
            
            if (wasRecentlyClearedLocally && localLastUpdated !== 0) {
              // They actively cleared it, so the DB should become empty too
              mergedItems = [];
              needsDbUpdate = true;
            } else {
              // Fresh login on new device, restore from DB
              mergedItems = dbItems;
              needsDbUpdate = false;
            }
          } else {
            // Case 2: Standard merge of items
            const dbItemIds = new Set(dbItems.map((item) => item.id));
            const newLocalItems = currentLocalItems.filter((item) => !dbItemIds.has(item.id));
            
            mergedItems = [...dbItems, ...newLocalItems];
            
            // Only push if we actually added new items to the DB's knowledge
            if (newLocalItems.length > 0) {
              needsDbUpdate = true;
            }
          }

          // Update local store with the reconciled list without triggering a new push loop
          setWishlist(mergedItems);
          
          // We are now ready to allow normal automatic pushes TO the db moving forward
          isInitialized.current = true;
          
          if (needsDbUpdate) {
            await updateWishlist(user.id, mergedItems);
          }
        }
      } catch (error) {
        console.error('Failed to sync wishlist on login:', error);
        // If fetch fails, we still allow initialization so they can use local at least
        if (mounted) isInitialized.current = true; 
      }
    };

    if (!authLoading) {
      syncWishlistOnLogin();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading, setWishlist]); // Runs when auth state changes

  // Push effect: When local wishlist changes, push to DB if logged in and initialized
  useEffect(() => {
    const pushWishlistToDb = async () => {
      if (user && isInitialized.current) {
        try {
          await updateWishlist(user.id, items);
        } catch (error) {
          console.error('Failed to update wishlist in DB:', error);
        }
      }
    };

    pushWishlistToDb();
  }, [items, user]); // Run when items change

  return null; // Headless component, renders nothing
};
