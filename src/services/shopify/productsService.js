/**
 * File: productsService.js
 * Purpose: Handles fetching products from Shopify API.
 * Dependencies: shopifyFetch from client.js
 * Notes: All GraphQL queries for products live here. Result nodes are flattened for easier UI consumption.
 */
import { shopifyFetch } from './client';

const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
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

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      options {
        name
        values
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

/**
 * Fetches a paginated list of products.
 *
 * @param {Object} params - Query parameters
 * @param {number} params.first - Number of products to fetch
 * @param {string} [params.after] - Cursor to fetch products after
 * @returns {Promise<Object>} Object containing products array and pageInfo
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Empty response
 */
export const getProducts = async ({ first = 12, after } = {}) => {
  const data = await shopifyFetch(PRODUCTS_QUERY, { first, after });
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

/**
 * Fetches a single product by its handle.
 *
 * @param {string} handle - The product handle (slug)
 * @returns {Promise<Object|null>} The product object or null
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Product not found returns null
 */
export const getProductByHandle = async (handle) => {
  const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data.product) return null;
  
  return {
    ...data.product,
    variants: data.product.variants.edges.map(v => v.node),
    images: data.product.images.edges.map(i => i.node)
  };
};

const PRODUCT_RECOMMENDATIONS_QUERY = `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      variants(first: 1) {
        edges {
          node {
            id
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
`;

/**
 * Fetches recommended products for a given product ID.
 *
 * @param {string} productId - The Shopify product ID
 * @returns {Promise<Array>} Array of recommended products
 */
export const getRecommendedProducts = async (productId) => {
  const data = await shopifyFetch(PRODUCT_RECOMMENDATIONS_QUERY, { productId });
  if (!data.productRecommendations) return [];
  
  return data.productRecommendations.map(product => ({
    ...product,
    variants: product.variants.edges.map(v => v.node),
    images: product.images.edges.map(i => i.node)
  }));
};
