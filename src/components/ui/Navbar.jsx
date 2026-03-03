/**
 * File: Navbar.jsx
 * Purpose: Global navigation header with dynamic collections mega menu and mobile hamburger.
 * Dependencies: react-router-dom, useCart, useAuth, react-query, collectionsService
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../features/cart/useCart';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { signOut } from '../../services/supabase/authService';
import { getCollections } from '../../services/shopify/collectionsService';

export const Navbar = () => {
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const collectionsRef = useRef(null);

  const { data: collections = [] } = useQuery({
    queryKey: ['collections-nav'],
    queryFn: () => getCollections(20),
    staleTime: 1000 * 60 * 5,
  });

  // Close collections dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">

          {/* Logo */}
          <Link to={ROUTES.HOME} onClick={closeAll} className="flex items-center hover:opacity-80 transition-opacity shrink-0">
            <img src="/logo.png" alt="Elilian Signature" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-6">

            {/* Collections Dropdown */}
            <div className="relative" ref={collectionsRef}>
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#C0522C] transition-colors py-2"
              >
                Collections
                <svg className={`h-4 w-4 transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {collectionsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[480px] bg-white border border-gray-100 rounded-xl shadow-2xl p-6 z-50">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#C0522C] mb-4">Shop by Category</p>
                  {collections.length === 0 ? (
                    <p className="text-sm text-gray-400">No collections available.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/search/${collection.handle}`}
                          onClick={closeAll}
                          className="group flex items-center gap-3 rounded-lg p-3 hover:bg-[#FAF8F5] transition-colors"
                        >
                          {collection.image?.url ? (
                            <img src={collection.image.url} alt={collection.image.altText || collection.title} className="h-10 w-10 rounded-md object-cover shrink-0 border border-gray-100" />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-[#FAF8F5] border border-gray-100 flex items-center justify-center shrink-0">
                              <svg className="h-5 w-5 text-[#C0522C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-800 group-hover:text-[#C0522C] transition-colors capitalize">
                            {collection.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to={ROUTES.SEARCH} onClick={closeAll} className="text-sm font-medium text-[#C0522C] hover:underline">
                      View all products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to={ROUTES.SEARCH} className="text-sm font-medium text-gray-700 hover:text-[#C0522C] transition-colors">Search</Link>

            {user ? (
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                <Link to={ROUTES.ORDERS} className="hover:text-[#C0522C]">Orders</Link>
                <button onClick={signOut} className="hover:text-[#C0522C]">Sign out</button>
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-700 hover:text-[#C0522C]">Sign in</Link>
            )}

            <div className="h-6 w-px bg-gray-200" />

            {/* Cart */}
            <button className="relative p-2 -mr-2 text-gray-700 hover:text-[#C0522C] transition-colors" onClick={openCart}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount() > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#C0522C] rounded-full">
                  {itemCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button className="relative p-2 text-gray-700 hover:text-[#C0522C] transition-colors" onClick={openCart}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount() > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#C0522C] rounded-full">
                  {itemCount()}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-700 hover:text-[#C0522C]">
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {/* Collections List */}
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C0522C] px-3 pt-2 pb-1">Collections</p>
          {collections.length === 0 ? (
            <p className="text-sm text-gray-400 px-3">No collections yet.</p>
          ) : (
            collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/search/${collection.handle}`}
                onClick={closeAll}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#C0522C] transition-colors"
              >
                {collection.image?.url && (
                  <img src={collection.image.url} alt="" className="h-8 w-8 rounded object-cover border border-gray-100" />
                )}
                {collection.title}
              </Link>
            ))
          )}

          <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
            <Link to={ROUTES.SEARCH} onClick={closeAll} className="flex px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#C0522C]">Search</Link>
            {user ? (
              <>
                <Link to={ROUTES.ORDERS} onClick={closeAll} className="flex px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#C0522C]">Orders</Link>
                <button onClick={() => { signOut(); closeAll(); }} className="flex w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#C0522C]">Sign out</button>
              </>
            ) : (
              <Link to={ROUTES.LOGIN} onClick={closeAll} className="flex px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#C0522C]">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
