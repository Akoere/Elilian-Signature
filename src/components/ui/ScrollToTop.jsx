/**
 * File: ScrollToTop.jsx
 * Purpose: Automatically scrolls the window to the top on route changes.
 * Dependencies: react, react-router-dom
 * Notes: Needed because react-router preserves scroll position between navigation.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Headless component
};
