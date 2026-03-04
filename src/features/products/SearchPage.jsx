/**
 * File: SearchPage.jsx
 * Purpose: Searching products.
 * Dependencies: react-query, searchService, ProductCard, Input, Button
 * Notes: Implements a simple query parameter search.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../../services/shopify/searchService';
import { ProductCard } from '../../components/ecommerce/ProductCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LogoLoader } from '../../components/ui/LogoLoader';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchInputValue, setSearchInputValue] = useState(initialQuery);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', initialQuery],
    queryFn: () => searchProducts(initialQuery),
    enabled: initialQuery.trim().length > 0,
  });

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInputValue(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setSearchParams({ q: searchInputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-screen">
      <div className="border-b border-gray-200 pb-10 pt-10 text-center">
        <h1 className="text-4xl font-serif font-light tracking-widest text-[#1A1A1A]">
          Search Products
        </h1>
        <div className="mx-auto mt-6 max-w-xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for handmade items, dresses, bags..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className="pt-12 pb-24">
        {isLoading && (
          <LogoLoader size="sm" />
        )}

        {error && (
          <div className="text-center text-red-500 my-10">Failed to perform search.</div>
        )}

        {!isLoading && !error && searchResults && searchResults.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 xl:gap-x-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && searchResults && searchResults.length === 0 && initialQuery && (
          <div className="text-center py-12 text-gray-500">
            No products found matching "{initialQuery}".
          </div>
        )}

        {!initialQuery && (
          <div className="text-center py-12 text-gray-500">
            Enter a search term above to find products.
          </div>
        )}
      </div>
    </div>
  );
};
