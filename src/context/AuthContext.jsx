import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './useAuth';

const getFriendlyAuthError = (error, fallbackMessage) => {
  const message = error?.message || '';
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('fetch error')
  ) {
    return 'Unable to reach the authentication service. Check your connection and try again.';
  }

  if (
    normalizedMessage.includes('rate limit') || 
    normalizedMessage.includes('too many requests')
  ) {
    return 'You are doing that too often. Please wait a moment and try again.';
  }

  return fallbackMessage || message || 'An unexpected authentication error occurred. Please try again.';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthError('');
      } catch (error) {
        console.error('Unexpected error while loading the Supabase session:', error);

        if (!isMounted) {
          return;
        }

        setSession(null);
        setUser(null);
        setAuthError(
          getFriendlyAuthError(
            error,
            'Unable to verify your session right now. Please refresh and try again.'
          )
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthError('');
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase signOut failed:', error);
        setAuthError(
          getFriendlyAuthError(error, 'We could not sign you out right now. Please try again.')
        );
        return false;
      }

      setUser(null);
      setSession(null);
      setAuthError('');
      return true;
    } catch (error) {
      console.error('Unexpected error during signOut:', error);
      setAuthError('We could not sign you out right now. Please try again.');
      return false;
    }
  };

  const clearAuthError = () => {
    setAuthError('');
  };

  const value = {
    user,
    session,
    loading,
    authError,
    clearAuthError,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
