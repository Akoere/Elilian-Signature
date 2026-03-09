/**
 * File: cartService.js
 * Purpose: Handles reading/writing user cart data to Supabase.
 * Dependencies: supabase client
 */
import { supabase } from './client';

/**
 * Fetches a user's cart from the database.
 *
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} Array of product items
 */
export const getCart = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('carts')
    .select('items')
    .eq('user_id', userId)
    .single();

  if (error) {
    // Pts "Rows not found", return an empty array gracefully
    if (error.code === 'PGRST116') {
      return [];
    }
    throw error;
  }

  return data?.items || [];
};

/**
 * Upserts a user's entire cart to the database.
 *
 * @param {string} userId - UUID of the user
 * @param {Array} items - Array of product items
 * @returns {Promise<Object>} Updated cart row
 */
export const updateCart = async (userId, items) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('carts')
    .upsert({ user_id: userId, items, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  
  return data;
};
