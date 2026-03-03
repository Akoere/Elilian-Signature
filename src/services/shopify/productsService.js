/**
 * File: productsService.js
 * Purpose: Handles fetching products from Shopify API.
 * Dependencies: shopifyFetch from client.js
 * Notes: All GraphQL queries for products live here. Result nodes are flattened for easier UI consumption.
 */
import { shopifyFetch } from './client';

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
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
 * @returns {Promise<Array>} Array of products with flattened variants/images
 *
 * Side Effects:
 * - Network call to Shopify
 *
 * Edge Cases:
 * - Empty response
 */
export const getProducts = async ({ first = 24 } = {}) => {
  const data = await shopifyFetch(PRODUCTS_QUERY, { first });
  return data.products.edges.map(edge => ({
    ...edge.node,
    variants: edge.node.variants.edges.map(v => v.node),
    images: edge.node.images.edges.map(i => i.node)
  }));
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
