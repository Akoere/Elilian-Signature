/**
 * File: App.jsx
 * Purpose: Root application component.
 * Dependencies: React Router, Auth Context, QueryClient
 * Notes: Centralizes all routes and global providers.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { ProductsPage } from './features/products/ProductsPage';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import { CollectionsPage } from './features/products/CollectionsPage';
import { SearchPage } from './features/products/SearchPage';
import { CheckoutPage } from './features/checkout/CheckoutPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { CartDrawer } from './components/ecommerce/CartDrawer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { ROUTES } from './constants/routes';

// Global layout wrapper with Navbar and CartDrawer
const DefaultLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col font-sans text-[#1A1A1A]">
    <Navbar />
    <main className="flex-1 shrink-0 bg-[#FAF8F5]">
      {children}
    </main>
    <Footer />
    <CartDrawer />
    <WhatsAppButton />
    {/* Global Toast Container */}
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        style: {
          background: '#1B1F3B',
          color: '#fff',
        },
      }}
    />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DefaultLayout>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<ProductsPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

            {/* Protected Routes */}
            <Route 
              path={ROUTES.CHECKOUT} 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.ORDERS} 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          </DefaultLayout>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
