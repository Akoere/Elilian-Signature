/**
 * File: AuthContext.jsx
 * Purpose: Provides global access to authentication state.
 * Dependencies: React, authService
 * Notes: Manages user, session, and loading states.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase/client';
import { getSession } from '../services/supabase/authService';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fetch initial session
    const loadSession = async () => {
      try {
        const activeSession = await getSession();
        if (mounted) {
          setSession(activeSession);
          setUser(activeSession?.user || null);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
