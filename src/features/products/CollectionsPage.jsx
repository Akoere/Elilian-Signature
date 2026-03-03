/**
 * File: CollectionsPage.jsx
 * Purpose: Browsing products filtered by collection handle.
 * Dependencies: react-query, collectionsService, ProductCard
 * Notes: Uses handle from params to fetch collection products.
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCollectionByHandle } from '../../services/shopify/collectionsService';
import { ProductCard } from '../../components/ecommerce/ProductCard';

export const CollectionsPage = () => {
  const { collection } = useParams();

  const { data: collectionData, isLoading, error } = useQuery({
    queryKey: ['collection', collection],
    queryFn: () => getCollectionByHandle(collection),
    enabled: !!collection,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#FAF8F5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1B1F3B]"></div>
      </div>
    );
  }

  if (error || !collectionData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center pb-20 bg-[#FAF8F5]">
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">Collection Not Found</h2>
        <p className="text-gray-500">Could not load the requested category.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-screen">
      <div className="border-b border-gray-200 pb-10 pt-10 text-center">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-[#1A1A1A] capitalize">
          {collectionData.title}
        </h1>
        {collectionData.description && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
            {collectionData.description}
          </p>
        )}
      </div>

      <div className="pt-12 pb-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {collectionData.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {(!collectionData.products || collectionData.products.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No products match this collection.
          </div>
        )}
      </div>
    </div>
  );
};
