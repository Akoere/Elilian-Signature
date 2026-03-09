/**
 * File: CartSync.jsx
 * Purpose: Headless component to sync local Zustand cart with Supabase.
 * Dependencies: React, useAuth, useCart, cartService
 */
import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCart, updateCart } from '../../services/supabase/cartService';
import { supabase } from '../../services/supabase/client';
import { useCart } from './useCart';

export const CartSync = () => {
  const { user, loading: authLoading } = useAuth();
  const items = useCart((state) => state.items);
  const setCart = useCart((state) => state.setCart);
  const lastUpdatedAt = useCart((state) => state.lastUpdatedAt);
  
  // Track the DB initialization state to avoid pushing local items before fetching
  const isInitialized = useRef(false);

  // Sync effect: When user logs in or out
  useEffect(() => {
    let mounted = true;

    const syncCartOnLogin = async () => {
      if (!user) {
        // User logged out
        isInitialized.current = false;
        return;
      }

      isInitialized.current = false;

      try {
        // Fetch from DB
        const dbItems = await getCart(user.id);
        
        if (mounted) {
          const currentLocalState = useCart.getState();
          const currentLocalItems = currentLocalState.items;
          const localLastUpdated = currentLocalState.lastUpdatedAt || 0;
          
          let mergedItems = [];
          let needsDbUpdate = false;

          if (dbItems.length > 0 && currentLocalItems.length === 0) {
            // Case 1: DB has items, local is empty. 
            // Was it explicitly cleared recently (e.g., checkout)?
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
            // For carts, if an item exists in both, we should sum quantities or just take local.
            // A simple implementation: keep local if conflict, otherwise merge.
            
            const dbItemMap = new Map();
            dbItems.forEach(item => dbItemMap.set(item.variant.id, item));
            
            // Build merged list prioritizing local quantities
            mergedItems = [...currentLocalItems];
            const localVariantIds = new Set(currentLocalItems.map(i => i.variant.id));
            
            for (const dbItem of dbItems) {
              if (!localVariantIds.has(dbItem.variant.id)) {
                mergedItems.push(dbItem);
              }
            }
            
            // If local and db were different, update DB
            if (currentLocalItems.length > 0 || dbItems.length !== mergedItems.length) {
              needsDbUpdate = true;
            }
          }

          // Update local store with the reconciled list without triggering a new push loop
          setCart(mergedItems);
          
          // We are now ready to allow normal automatic pushes TO the db moving forward
          isInitialized.current = true;
          
          if (needsDbUpdate) {
            await updateCart(user.id, mergedItems);
          }
        }
      } catch (error) {
        console.error('Failed to sync cart on login:', error);
        // If fetch fails, we still allow initialization so they can use local at least
        if (mounted) isInitialized.current = true; 
      }
    };

    if (!authLoading) {
      syncCartOnLogin();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading, setCart]); // Runs when auth state changes

  // Real-time subscription effect: Listen for changes from OTHER devices
  useEffect(() => {
    if (!user || !isInitialized.current) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'carts',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // payload.new contains the updated row (including items)
          if (payload.new && payload.new.items) {
             // We use setCart which bypasses updating lastUpdatedAt.
             // This ensures we don't accidentally trigger the "Push effect" below
             // and create an infinite loop of reading -> writing -> reading.
             setCart(payload.new.items);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, setCart]);

  // Push effect: When local cart changes, push to DB if logged in and initialized
  useEffect(() => {
    const pushCartToDb = async () => {
      if (user && isInitialized.current) {
        try {
          // Find if we actually need an update. If a user just logged in, lastUpdatedAt 
          // might be old, so only sync if it changed recently and explicitly.
          const currentLocalState = useCart.getState();
          await updateCart(user.id, currentLocalState.items);
        } catch (error) {
          console.error('Failed to update cart in DB:', error);
        }
      }
    };

    // Debounce pushing to DB heavily to prevent spamming the backend if user clicks quickly
    // 2.5 seconds wait ensures they are done modifying quantity before a cloud sync happens.
    const timeoutId = setTimeout(() => {
      pushCartToDb();
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [lastUpdatedAt, items, user]); // Only run when a GENUINE local update happens (lastUpdatedAt changes)

  return null; // Headless component, renders nothing
};
