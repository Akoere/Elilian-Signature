import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProductByHandle } from '../../services/shopify/productsService';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../ui/Button';
import { LogoLoader } from '../ui/LogoLoader';
import { useCart } from '../../features/cart/useCart';

export const QuickViewModal = ({ isOpen, onClose, productHandle }) => {
  const { addToCart } = useCart();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['quickViewProduct', productHandle],
    queryFn: () => getProductByHandle(productHandle),
    enabled: isOpen && !!productHandle,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 bg-white/80 text-gray-400 hover:text-[#C0522C] hover:bg-white shadow-sm transition-all focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col h-[80vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-64 md:h-[500px] items-center justify-center">
              <LogoLoader />
            </div>
          ) : error || !product ? (
            <div className="flex h-64 md:h-[500px] flex-col items-center justify-center text-center p-6">
              <p className="text-gray-500 mb-4">Error loading product details.</p>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gray-100 relative aspect-square md:aspect-auto md:h-[500px] flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].altText || product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">{product.title}</h2>
                <p className="mt-2 text-2xl font-semibold text-[#C0522C]">
                  {product.variants?.[0]?.price ? formatPrice(parseFloat(product.variants[0].price.amount), product.variants[0].price.currencyCode) : ''}
                </p>
                
                <div 
                  className="mt-4 text-gray-600 line-clamp-4 prose prose-sm sm:prose-base font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
                
                <div className="mt-8 flex flex-col gap-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                       if (product.variants?.[0]?.availableForSale) {
                           addToCart(product, product.variants[0], 1);
                           onClose();
                       }
                    }}
                    disabled={!product.variants?.[0]?.availableForSale}
                  >
                     {product.variants?.[0]?.availableForSale ? 'Add to cart' : 'Out of stock'}
                  </Button>
                  <Link 
                    to={`/product/${product.handle}`}
                    className="w-full block"
                    onClick={onClose}
                  >
                    <Button variant="outline" className="w-full" size="lg">
                      View full details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
