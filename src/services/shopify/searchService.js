/**
 * File: searchService.js
 * Purpose: Handles searching products in Shopify API.
 * Dependencies: shopifyFetch from client.js
 * Notes: Full text search query.
 */
import { shopifyFetch } from './client';

const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Searches for products matching a query string.
 *
 * @param {string} query - The search query term
 * @param {number} first - Number of results to fetch (default: 20)
 * @returns {Promise<Array>} Array of product nodes
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Empty query string returns empty array
 */
export const searchProducts = async (query, first = 20) => {
  if (!query || query.trim() === '') return [];
  
  const data = await shopifyFetch(SEARCH_PRODUCTS_QUERY, { query, first });
  return data.products.edges.map(edge => ({
    ...edge.node,
    variants: edge.node.variants.edges.map(v => v.node),
    images: edge.node.images.edges.map(i => i.node)
  }));
};
