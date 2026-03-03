/**
 * File: OrdersPage.jsx
 * Purpose: Displays authenticated user's order history.
 * Dependencies: react-query, ordersService, AuthContext, formatPrice
 * Notes: Acts as both order history and post-checkout confirmation view.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/supabase/ordersService';
import { formatPrice } from '../../utils/formatPrice';

export const OrdersPage = () => {
  const { user } = useAuth();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrdersByUser(user.id),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#FAF8F5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1B1F3B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-red-500 bg-[#FAF8F5]">
        <p>Failed to load orders.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-8">
          Order History
        </h1>

        {(!orders || orders.length === 0) ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">When you purchase items, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
                <div className="flex items-center p-4 border-b border-gray-200 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6 bg-gray-50">
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-900">Order number</dt>
                    <dd className="mt-1 text-sm text-gray-500 break-all">{order.id.split('-')[0].toUpperCase()}</dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="text-sm font-medium text-gray-900">Date placed</dt>
                    <dd className="mt-1 text-sm text-gray-500">
                      <time dateTime={order.created_at}>{new Date(order.created_at).toLocaleDateString()}</time>
                    </dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="text-sm font-medium text-gray-900">Total amount</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {formatPrice(order.total_amount / 100, order.currency)}
                    </dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="text-sm font-medium text-gray-900">Payment</dt>
                    <dd className="mt-1 text-sm text-gray-500 capitalize">{order.payment_provider}</dd>
                  </div>
                </div>

                {/* Products */}
                <h4 className="sr-only">Items</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="p-4 sm:p-6 flex items-center gap-6">
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between font-medium text-gray-900">
                            <h5>{item.title}</h5>
                            <p className="ml-4">{formatPrice(parseFloat(item.price) * item.quantity, order.currency)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
