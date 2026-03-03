/**
 * File: routes.js
 * Purpose: Centralizes all application route paths to avoid magic strings.
 * Dependencies: None
 * Notes: Use these constants in React Router and Link components.
 */

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  COLLECTIONS: '/search/:collection',
  PRODUCT_DETAIL: '/product/:handle',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
};
