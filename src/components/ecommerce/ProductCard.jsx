/**
 * File: ProductCard.jsx
 * Purpose: Displays a single product preview inside a product grid.
 * Dependencies: react-router-dom, formatPrice
 * Notes: Stateless UI component.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../features/wishlist/useWishlist';

export const ProductCard = ({ product }) => {
  const { handle, title, variants, images } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const price = variants?.[0]?.price?.amount;
  const currencyCode = variants?.[0]?.price?.currencyCode || 'USD';
  const imageUrl = images?.[0]?.url;
  const imageAlt = images?.[0]?.altText || title;

  return (
    <Link to={`/product/${handle}`} className="group relative block overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">
      <div className="aspect-[4/5] w-full bg-gray-100 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      {/* Wishlist Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-[#C0522C] shadow-sm transition-all focus:outline-none"
        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg 
          className={`h-5 w-5 transition-colors ${isInWishlist(product.id) ? 'fill-[#C0522C] text-[#C0522C]' : 'fill-transparent'}`} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="p-4">
        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C0522C] transition-colors">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-[#1B1F3B]">
          {price ? formatPrice(parseFloat(price), currencyCode) : 'From $0.00'}
        </p>
      </div>
    </Link>
  );
};
