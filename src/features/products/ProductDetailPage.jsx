/**
 * File: ProductDetailPage.jsx
 * Purpose: Displays a single product with full details, image gallery, and variants.
 * Dependencies: react-router-dom, react-query, productsService, formatPrice, Button
 * Notes: Uses Shopify product handle from URL to fetch info.
 */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getProductByHandle } from '../../services/shopify/productsService';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../../components/ui/Button';
import { LogoLoader } from '../../components/ui/LogoLoader';
import { useCart } from '../cart/useCart';
import { useWishlist } from '../wishlist/useWishlist';

export const ProductDetailPage = () => {
  const { handle } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => getProductByHandle(handle),
    enabled: !!handle,
  });

  if (isLoading) {
    return <LogoLoader />;
  }

  if (error || !product) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4 bg-[#FAF8F5]">
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  const { title, descriptionHtml, variants, images } = product;
  const initialVariant = variants?.[0];
  const price = initialVariant?.price?.amount;
  const currencyCode = initialVariant?.price?.currencyCode || 'USD';

  const handleAddToCart = () => {
    if (initialVariant?.availableForSale) {
       addToCart(product, initialVariant, 1);
       toast.success("Added to cart");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start text-left">
          {/* Image gallery */}
          <div className="flex flex-col-reverse lg:max-w-md lg:mx-auto w-full">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {images?.map((image, idx) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none ${selectedImage === idx ? 'ring-2 ring-offset-2 ring-[#C0522C]' : 'ring-1 ring-transparent border border-gray-200'}`}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img src={image.url} alt="" className="h-full w-full object-cover object-center" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="aspect-4/5 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              {images?.[selectedImage] ? (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText || title}
                  className="h-full w-full object-contain object-center sm:rounded-lg"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-serif tracking-tight text-[#1A1A1A]">{title}</h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-[#C0522C] font-semibold">
                {price ? formatPrice(parseFloat(price), currencyCode) : 'Price Unavailable'}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700 font-sans leading-relaxed prose prose-sm sm:prose-base"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            <div className="mt-10 flex gap-4">
              <Button 
                size="lg" 
                className="max-w-xs w-full"
                onClick={handleAddToCart}
                disabled={!initialVariant?.availableForSale}
              >
                {initialVariant?.availableForSale ? 'Add to cart' : 'Out of stock'}
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center justify-center rounded-md p-3 text-gray-400 hover:bg-gray-100 hover:text-[#C0522C] transition-colors border border-gray-200"
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg 
                  className={`h-6 w-6 transition-colors ${isInWishlist(product.id) ? 'fill-[#C0522C] text-[#C0522C]' : 'fill-transparent'}`} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
