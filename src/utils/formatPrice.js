/**
 * File: formatPrice.js
 * Purpose: Provides a consistent way to format currency across the application.
 * Dependencies: None
 * Notes: Handles fallback to USD if NGN isn't the active currency.
 */

/**
 * Formats a number into a localized currency string.
 *
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - ISO currency code (e.g., 'NGN', 'USD')
 * @returns {string} Formatted currency string
 *
 * Side Effects:
 * - None (pure function)
 *
 * Edge Cases:
 * - Invalid amount defaults to 0
 * - Unknown currency code falls back to 'USD'
 */
export const formatPrice = (amount, currencyCode = 'USD') => {
  const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(validAmount);
  } catch (error) {
    // Fallback if currency code is somehow invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(validAmount);
  }
};
