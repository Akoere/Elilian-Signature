/**
 * File: client.js
 * Purpose: Initializes the Shopify Storefront API client and provides generic fetcher.
 * Dependencies: @shopify/storefront-api-client
 * Notes: Uses API version from env or defaults to '2024-04'.
 */
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const publicAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-04';

if (!storeDomain || !publicAccessToken) {
  throw new Error('Missing Shopify environment variables');
}

// Convert react-supabase-testing.myshopify.com to the full domain https://react-supabase-testing.myshopify.com correctly
const domain = storeDomain.startsWith('http') ? storeDomain : `https://${storeDomain}`;

export const shopifyClient = createStorefrontApiClient({
  storeDomain: domain,
  apiVersion,
  publicAccessToken,
});

/**
 * Generic fetcher for Shopify GraphQL queries.
 *
 * @param {string} query - The GraphQL query string
 * @param {Object} variables - Query variables
 * @returns {Promise<Object>} The query result data or throws an error
 *
 * Side Effects:
 * - Makes a network request to Shopify Storefront API
 *
 * Edge Cases:
 * - Network failures are thrown
 * - GraphQL validation errors are logged and thrown
 */
export const shopifyFetch = async (query, variables = {}) => {
  try {
    const { data, errors } = await shopifyClient.request(query, { variables });
    
    if (errors) {
      console.error('Shopify GraphQL Errors:', errors);
      throw new Error(errors.message || 'Failed to fetch from Shopify');
    }
    
    return data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
};
