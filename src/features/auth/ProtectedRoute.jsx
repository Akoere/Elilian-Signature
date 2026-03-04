/**
 * File: ProtectedRoute.jsx
 * Purpose: Restricts access to authenticated users only.
 * Dependencies: react-router-dom, AuthContext
 * Notes: Redirects to /login if unauthenticated.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { LogoLoader } from '../../components/ui/LogoLoader';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LogoLoader />;
  }

  if (!user) {
    // Store where they tried to go so we can redirect them back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};
