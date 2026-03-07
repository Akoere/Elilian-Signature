/**
 * File: CollectionsPage.jsx
 * Purpose: Browsing products filtered by collection handle.
 * Dependencies: react-query, collectionsService, ProductCard
 * Notes: Uses handle from params to fetch collection products.
 */
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getCollectionByHandle } from '../../services/shopify/collectionsService';
import { ProductCard } from '../../components/ecommerce/ProductCard';
import { LogoLoader } from '../../components/ui/LogoLoader';
import { ProductFilter, parseSortOption } from './ProductFilter';

export const CollectionsPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || '';

  const { 
    data: collectionData, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['collection', collection, initialSort],
    queryFn: ({ pageParam = undefined }) => getCollectionByHandle(collection, { first: 12, after: pageParam, ...parseSortOption(initialSort) }),
    getNextPageParam: (lastPage) => lastPage?.pageInfo?.hasNextPage ? lastPage.cursor : undefined,
    enabled: !!collection,
  });

  const products = collectionData?.pages.flatMap(page => page?.products || []) || [];
  const collectionInfo = collectionData?.pages[0]; // Title and description are the same for all pages

  const handleSortChange = (newSort) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newSort) {
        newParams.set('sort', newSort);
      } else {
        newParams.delete('sort');
      }
      return newParams;
    });
  };

  if (isLoading) {
    return <LogoLoader />;
  }

  if (error || !collectionInfo) {
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
          {collectionInfo.title}
        </h1>
        {collectionInfo.description && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
            {collectionInfo.description}
          </p>
        )}
      </div>

      <div className="pt-8 mb-4">
        {products?.length > 0 && (
          <ProductFilter currentSort={initialSort} onSortChange={handleSortChange} />
        )}
      </div>

      <div className="pt-12 pb-24">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 xl:gap-x-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No products match this collection.
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
      </div>
    </div>
  );
};
