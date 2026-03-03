/**
 * File: CheckoutPage.jsx
 * Purpose: Secure checkout flow collecting shipping info and triggering Paystack payment.
 * Dependencies: useCart, AuthContext, paystackService, ordersService
 * Notes: Protected route. Paystack is the sole payment provider.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../features/cart/useCart';
import { formatPrice } from '../../utils/formatPrice';
import { initPaystackPayment } from '../../services/paystack/paystackService';
import { createOrder } from '../../services/supabase/ordersService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: 'Nigeria',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate(ROUTES.HOME);
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSuccess = async (response) => {
    try {
      const orderData = {
        user_id: user.id,
        total_amount: Math.round(cartTotal() * 100),
        currency: 'NGN',
        payment_provider: provider,
        payment_intent_id: response.reference || response.id || 'manual_test_ref',
        shipping_address: shippingInfo,
        items: items.map(item => ({
          product_id: item.product.id,
          variant_id: item.variant.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.variant.price.amount
        }))
      };

      await createOrder(orderData);
      clearCart();
      toast.success('Payment successful! Order confirmed.');
      navigate(ROUTES.ORDERS);
    } catch (error) {
      console.error('Order Creation Error:', error);
      toast.error('Payment succeeded but order creation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      return toast.error('Please fill in all shipping details');
    }

    setLoading(true);

    try {
      // Amount in kobo for NGN (multiply by 100)
      const amountInSmallestUnit = Math.round(cartTotal() * 100);

      initPaystackPayment({
        email: shippingInfo.email,
        amount: amountInSmallestUnit,
        metadata: {
          custom_fields: [{ display_name: "Customer Name", variable_name: "customer_name", value: shippingInfo.fullName }]
        },
        onSuccess: (response) => handleSuccess(response),
        onClose: () => {
          setLoading(false);
          toast.error('Payment window closed');
        }
      });
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Failed to initialize Paystack');
    }
  };


  if (items.length === 0) return null; // Let the useEffect redirect

  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto lg:max-w-none">
        <h1 className="sr-only">Checkout</h1>

        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Contact & Shipping Info</h2>

              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Email address" type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Street Address" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
                </div>
                <div>
                  <Input label="City" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <Input label="Phone Number" name="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="rounded-lg border border-[#C0522C]/30 bg-[#C0522C]/5 p-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#C0522C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <p className="text-sm font-medium text-gray-900">Paystack — Secure Payment</p>
                </div>
                <p className="mt-2 text-xs text-gray-500 ml-8">Pay via bank transfer, debit card, or USSD. Powered by Paystack.</p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-6">Order summary</h2>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <ul className="divide-y divide-gray-200 flex-col px-6">
                {items.map((item) => (
                  <li key={item.variant.id} className="flex py-6">
                    <div className="h-20 w-20 shrink-0 rounded bg-gray-100">
                      <img src={item.product.images?.[0]?.url} alt="" className="h-full w-full object-cover object-center rounded" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-2">{item.product.title}</h3>
                        <p className="ml-4 text-nowrap">{formatPrice(parseFloat(item.variant.price.amount) * item.quantity, item.variant.price.currencyCode)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.variant.title !== 'Default Title' ? item.variant.title : ''}</p>
                      <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="border-t border-gray-200 px-6 py-6 space-y-4 text-sm font-medium text-gray-900">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd>{formatPrice(cartTotal(), items[0]?.variant?.price?.currencyCode)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd>Calculated securely</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base">
                  <dt>Total</dt>
                  <dd className="text-xl text-[#C0522C]">{formatPrice(cartTotal(), items[0]?.variant?.price?.currencyCode)}</dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-6 py-6">
                <Button type="submit" size="lg" className="w-full text-base" isLoading={loading}>
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
