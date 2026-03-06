/**
 * File: collectionsService.js
 * Purpose: Handles fetching collections from Shopify API.
 * Dependencies: shopifyFetch from client.js
 * Notes: Queries for categories/collections. Flattens connection edges.
 */
import { shopifyFetch } from './client';

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query getCollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
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
  }
`;

/**
 * Fetches all available collections.
 *
 * @param {number} first - Number of collections to fetch (default: 20)
 * @returns {Promise<Array>} Array of collections
 *
 * Side Effects:
 * - Network call to Shopify
 */
export const getCollections = async (first = 20) => {
  const data = await shopifyFetch(COLLECTIONS_QUERY, { first });
  return data.collections.edges.map(edge => edge.node);
};

/**
 * Fetches a specific collection by handle with its products.
 *
 * @param {string} handle - Collection handle
 * @param {Object} options - Query configuration
 * @param {number} options.first - Number of products to fetch
 * @param {string|null} options.sortKey - Shopify ProductCollectionSortKeys
 * @param {boolean} options.reverse - Sort direction
 * @returns {Promise<Object|null>} Collection object or null
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Collection not found
 */
export const getCollectionByHandle = async (handle, { first = 50, sortKey = null, reverse = false } = {}) => {
  const variables = { handle, first };
  if (sortKey) variables.sortKey = sortKey;
  if (reverse) variables.reverse = reverse;

  const data = await shopifyFetch(COLLECTION_BY_HANDLE_QUERY, variables);
  if (!data.collection) return null;
  
  return {
    ...data.collection,
    products: data.collection.products.edges.map(edge => ({
      ...edge.node,
      variants: edge.node.variants.edges.map(v => v.node),
      images: edge.node.images.edges.map(i => i.node)
    }))
  };
};
