import React from 'react';
import { Button } from '../../components/ui/Button';

export const PaymentSuccessModal = ({ isOpen, onClose, onContinue, hasUser }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-xl shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 bg-transparent text-gray-400 hover:text-[#C0522C] hover:bg-black/5 shadow-sm transition-all focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-2">
          Thank you for shopping!
        </h2>
        
        <p className="text-gray-600 mb-8 font-sans text-base">
          Your payment was successful and your order has been placed. We'll send you a confirmation email shortly.
        </p>

        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onContinue} size="lg" className="w-full">
            Continue Shopping
          </Button>
          {hasUser && (
            <Button variant="outline" onClick={onClose} size="lg" className="w-full">
              View Your Orders
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
