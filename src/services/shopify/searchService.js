/**
 * File: searchService.js
 * Purpose: Handles searching products in Shopify API.
 * Dependencies: shopifyFetch from client.js
 * Notes: Full text search query.
 */
import { shopifyFetch } from './client';

const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, after: $after, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
 * @param {Object} options - Search configuration
 * @param {number} options.first - Number of results to fetch
 * @param {string} [options.after] - Cursor to fetch products after
 * @param {string|null} options.sortKey - Shopify ProductSortKeys (e.g. 'PRICE')
 * @param {boolean} options.reverse - Sort direction
 * @returns {Promise<Object>} Object containing products array and pageInfo
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Empty query string returns empty array
 */
export const searchProducts = async (query, { first = 12, after, sortKey = null, reverse = false } = {}) => {
  if (!query || query.trim() === '') return [];
  
  const variables = { query, first, after };
  if (sortKey) variables.sortKey = sortKey;
  if (reverse) variables.reverse = reverse;

  const data = await shopifyFetch(SEARCH_PRODUCTS_QUERY, variables);
  return {
    products: data.products.edges.map(edge => ({
      ...edge.node,
      variants: edge.node.variants.edges.map(v => v.node),
      images: edge.node.images.edges.map(i => i.node)
    })),
    pageInfo: data.products.pageInfo,
    cursor: data.products.pageInfo.endCursor
  };
};
