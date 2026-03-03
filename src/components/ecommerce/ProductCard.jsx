/**
 * File: ProductCard.jsx
 * Purpose: Displays a single product preview inside a product grid.
 * Dependencies: react-router-dom, formatPrice
 * Notes: Stateless UI component.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

export const ProductCard = ({ product }) => {
  const { handle, title, variants, images } = product;
  
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
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C0522C] transition-colors">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-[#1B1F3B]">
          {price ? formatPrice(parseFloat(price), currencyCode) : 'From $0.00'}
        </p>
      </div>
    </Link>
  );
};
