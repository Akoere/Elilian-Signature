/**
 * File: ProductsPage.jsx
 * Purpose: Main storefront homepage displaying products.
 * Dependencies: react-query, productsService, ProductCard
 * Notes: Uses React Query to fetch and cache Shopify products.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/shopify/productsService';
import { ProductCard } from '../../components/ecommerce/ProductCard';
import { LogoLoader } from '../../components/ui/LogoLoader';

export const ProductsPage = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ first: 24 }),
  });

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
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            No products found in the store. Please check Shopify admin.
          </div>
        )}
      </section>
    </div>
  );
};
