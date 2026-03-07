import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendedProducts } from '../../services/shopify/productsService';
import { ProductCard } from './ProductCard';

export const ProductRecommendations = ({ productId }) => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['productRecommendations', productId],
    queryFn: () => getRecommendedProducts(productId),
    enabled: !!productId,
  });

  if (isLoading || !recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 sm:mt-24 border-t border-gray-100 pt-10">
      <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6 px-4 sm:px-0">You May Also Like</h2>
      
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 px-4 sm:px-0 snap-x snap-mandatory hide-scroll-bar">
          {recommendations.map((product) => (
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
