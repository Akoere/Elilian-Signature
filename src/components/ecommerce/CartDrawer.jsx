/**
 * File: CartDrawer.jsx
 * Purpose: Slide-in cart interface.
 * Dependencies: useCart, formatPrice, react-router-dom, Button
 * Notes: Renders globally at the app root level.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/useCart';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../ui/Button';

export const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, cartTotal, cartCurrency } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
        onClick={closeCart}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-serif text-[#1A1A1A]">Shopping Cart</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close cart</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-lg text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.variant.id} className="py-6 flex">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    <img
                      src={item.product?.images?.[0]?.url}
                      alt={item.product?.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-2">{item.product.title}</h3>
                        <p className="ml-4 whitespace-nowrap text-[#C0522C]">
                          {formatPrice(parseFloat(item.variant.price.amount) * item.quantity, item.variant.price.currencyCode)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        >-</button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button 
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        >+</button>
                      </div>

                      <button
                        type="button"
                        className="font-medium text-[#C0522C] hover:text-[#C0522C]/80"
                        onClick={() => removeFromCart(item.variant.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal(), cartCurrency())}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
