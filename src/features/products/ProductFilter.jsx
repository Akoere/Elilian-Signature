/**
 * File: ProductFilter.jsx
 * Purpose: Presentational UI for selecting sorting options.
 * Dependencies: React
 * Notes: Fully controlled component, takes currentSort and onChange.
 */
import React from 'react';

export const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'PRICE_ASC' },
  { label: 'Price: High to Low', value: 'PRICE_DESC' },
  { label: 'Newest Arrivals', value: 'CREATED_DESC' },
];

export const parseSortOption = (sortString) => {
  switch (sortString) {
    case 'PRICE_ASC':
      return { sortKey: 'PRICE', reverse: false };
    case 'PRICE_DESC':
      return { sortKey: 'PRICE', reverse: true };
    case 'CREATED_DESC':
      return { sortKey: 'CREATED', reverse: true };
    default:
      return { sortKey: null, reverse: false };
  }
};

export const ProductFilter = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="sort"
            value={currentSort || ''}
            onChange={(e) => onSortChange(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-[#C0522C] focus:outline-none focus:ring-[#C0522C] sm:text-sm shadow-sm cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
