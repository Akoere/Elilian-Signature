/**
 * File: WishlistPage.jsx
 * Purpose: Page dedicated to displaying saved products.
 * Dependencies: useWishlist, ProductCard
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from './useWishlist';
import { ProductCard } from '../../components/ecommerce/ProductCard';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

export const WishlistPage = () => {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-[70vh]">
      <div className="border-b border-gray-200 pb-8 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-light tracking-widest text-[#1A1A1A]">
            Your Wishlist
          </h1>
          <p className="mt-2 text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        
        {items.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="text-sm text-gray-400 hover:text-red-500 underline transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      <div className="pt-12 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
              Save your favorite items here to easily find them later.
            </p>
            <Link to={ROUTES.HOME}>
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 xl:gap-x-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
