import React from 'react';
import { useRecentlyViewed } from '../../features/products/useRecentlyViewed';
import { ProductCard } from './ProductCard';

export const RecentlyViewedCarousel = ({ currentProductId }) => {
  const { items } = useRecentlyViewed();
  
  // Filter out the current product being viewed to avoid redundancy
  const displayItems = items.filter(item => item.id !== currentProductId);

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 sm:mt-24 border-t border-gray-100 pt-10">
      <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6 px-4 sm:px-0">Recently Viewed</h2>
      
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 px-4 sm:px-0 snap-x snap-mandatory hide-scroll-bar">
          {displayItems.map((product) => (
            <div key={product.id} className="min-w-[160px] w-[45vw] sm:w-[220px] flex-none snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll-bar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scroll-bar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};
