/**
 * File: authService.js
 * Purpose: Abstraction layer for Supabase Authentication.
 * Dependencies: supabase client
 * Notes: All auth operations (signup, login, signout, session checks) happen here.
 */
import { supabase } from './client';

/**
 * Signs up a new user with email and password.
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Optional user metadata (e.g., full_name)
 * @returns {Promise<Object>} The authenticated user object
 *
 * Side Effects:
 * - Calls Supabase Auth API
 *
 * Edge Cases:
 * - Invalid email format or password entirely too short
 * - Network error
 */
export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) throw error;
  return data.user;
};

/**
 * Signs in an existing user.
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} The authenticated user object
 *
 * Side Effects:
 * - Calls Supabase Auth API
 *
 * Edge Cases:
 * - Incorrect credentials
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

/**
 * Signs out the current user.
 *
 * @returns {Promise<void>}
 *
 * Side Effects:
 * - Clears local session via Supabase GoTrue
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Fetches the current active session.
 *
 * @returns {Promise<Object|null>} The session object or null
 *
 * Side Effects:
 * - Checks local storage/network for session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
