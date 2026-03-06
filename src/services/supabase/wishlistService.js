/**
 * File: wishlistService.js
 * Purpose: Handles reading/writing user wishlist data to Supabase.
 * Dependencies: supabase client
 */
import { supabase } from './client';

/**
 * Fetches a user's wishlist from the database.
 *
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} Array of product items
 */
export const getWishlist = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('wishlists')
    .select('items')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If the error code means "Rows not found", return an empty array gracefully
    if (error.code === 'PGRST116') {
      return [];
    }
    throw error;
  }

  return data?.items || [];
};

/**
 * Upserts user's entire wishlist to the database.
 *
 * @param {string} userId - UUID of the user
 * @param {Array} items - Array of product items
 * @returns {Promise<Object>} Updated wishlist row
 */
export const updateWishlist = async (userId, items) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('wishlists')
    .upsert({ user_id: userId, items, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  
  return data;
};
