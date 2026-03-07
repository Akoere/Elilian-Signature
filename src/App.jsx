/**
 * File: App.jsx
 * Purpose: Root application component.
 * Dependencies: React Router, Auth Context, QueryClient
 * Notes: Centralizes all routes and global providers.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';

// Lazy load feature components for code splitting
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./features/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const ProductsPage = lazy(() => import('./features/products/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./features/products/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CollectionsPage = lazy(() => import('./features/products/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const SearchPage = lazy(() => import('./features/products/SearchPage').then(m => ({ default: m.SearchPage })));
const WishlistPage = lazy(() => import('./features/wishlist/WishlistPage').then(m => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('./features/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrdersPage = lazy(() => import('./features/orders/OrdersPage').then(m => ({ default: m.OrdersPage })));
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { CartDrawer } from './components/ecommerce/CartDrawer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { ROUTES } from './constants/routes';

import { WishlistSync } from './features/wishlist/WishlistSync';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { LogoLoader } from './components/ui/LogoLoader';

import { GlobalErrorBoundary } from './components/ui/GlobalErrorBoundary';

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <LogoLoader size="lg" />
  </div>
);

// Global layout wrapper with Navbar and CartDrawer
const DefaultLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col font-sans text-[#1A1A1A]">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 shrink-0 bg-[#FAF8F5]">
      {children}
    </main>
    <Footer />
    <CartDrawer />
    <WishlistSync />
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
    <GlobalErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <DefaultLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<ProductsPage />} />
              <Route path={ROUTES.SEARCH} element={<SearchPage />} />
              <Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />
              <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
              <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

              {/* Protected Routes */}
              <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
              
              <Route 
                path={ROUTES.ORDERS} 
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
          </DefaultLayout>
        </BrowserRouter>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
