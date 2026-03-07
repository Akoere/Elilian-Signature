/**
 * File: ProductsPage.jsx
 * Purpose: Main storefront homepage displaying products.
 * Dependencies: react-query, productsService, ProductCard
 * Notes: Uses React Query to fetch and cache Shopify products.
 */
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/shopify/productsService';
import { ProductCard } from '../../components/ecommerce/ProductCard';
import { LogoLoader } from '../../components/ui/LogoLoader';

export const ProductsPage = () => {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = undefined }) => getProducts({ first: 12, after: pageParam }),
    getNextPageParam: (lastPage) => lastPage.pageInfo.hasNextPage ? lastPage.cursor : undefined,
  });

  const products = data?.pages.flatMap(page => page.products) || [];

  if (isLoading) {
    return <LogoLoader />;
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-red-500">
        <p>Failed to load products.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-screen">
      <header className="mb-12 pt-8 text-center border-b border-gray-200 pb-8">
        <h1 className="text-5xl font-serif text-[#1A1A1A] mb-4">Elilian Signature</h1>
        <p className="text-lg text-[#C0522C] font-medium tracking-wide">Handmade luxury, crafted for you.</p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-[#1B1F3B]">Featured Arrivals</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 xl:gap-x-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            No products found in the store. Please check Shopify admin.
          </div>
        )}

        {hasNextPage && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-white border border-[#1A1A1A] text-[#1A1A1A] font-medium text-sm rounded-md hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
