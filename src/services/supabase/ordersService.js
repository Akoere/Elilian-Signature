/**
 * File: ordersService.js
 * Purpose: Handles reading/writing order history.
 * Dependencies: supabase client
 * Notes: Requires an 'orders' table in Supabase.
 */
import { supabase } from './client';

/**
 * Creates a new order record after successful checkout.
 *
 * @param {Object} orderData - The order details
 * @param {string} orderData.user_id - UUID of the user
 * @param {number} orderData.total_amount - Total price paid
 * @param {string} orderData.currency - E.g., 'USD' or 'NGN'
 * @param {string} orderData.payment_provider - 'stripe' or 'paystack'
 * @param {string} orderData.payment_intent_id - Provider's transaction ID
 * @param {Object} orderData.shipping_address - JSON address payload
 * @param {Array} orderData.items - JSON array of cart items
 * @returns {Promise<Object>} Created order record
 *
 * Side Effects:
 * - Inserts into Supabase orders table
 *
 * Edge Cases:
 * - Missing required fields
 */
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Retrieves all orders for a specific user.
 *
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} Array of order objects, sorted by created_at desc
 *
 * Side Effects:
 * - Queries Supabase orders table
 */
export const getOrdersByUser = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Retrieves a single order by its ID.
 *
 * @param {string} orderId - UUID of the order
 * @param {string} userId - UUID of the user (for RLS enforcement from client side)
 * @returns {Promise<Object>} Order object
 *
 * Side Effects:
 * - Queries Supabase orders table
 *
 * Edge Cases:
 * - Order not found
 * - Unauthorized read
 */
export const getOrderById = async (orderId, userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};
