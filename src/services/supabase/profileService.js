/**
 * File: profileService.js
 * Purpose: Handles reading/writing user profile data.
 * Dependencies: supabase client
 * Notes: Profiles table must exist and track the auth.users table.
 */
import { supabase } from './client';

/**
 * Fetches a user's profile.
 *
 * @param {string} userId - UUID of the user
 * @returns {Promise<Object>} User profile object
 *
 * Side Effects:
 * - Queries Supabase profiles table
 *
 * Edge Cases:
 * - Profile doesn't exist yet
 */
export const getProfile = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Rows not found"

  return data;
};

/**
 * Upserts user profile data.
 *
 * @param {string} userId - UUID of the user
 * @param {Object} profileData - Data to update (e.g., full_name, avatar_url)
 * @returns {Promise<Object>} Updated profile
 *
 * Side Effects:
 * - Modifies Supabase profiles table
 *
 * Edge Cases:
 * - Invalid fields
 */
export const upsertProfile = async (userId, profileData) => {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  
  return data;
};
