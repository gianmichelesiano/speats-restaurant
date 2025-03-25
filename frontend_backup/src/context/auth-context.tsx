import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../stores/authStore';
import { createSupabaseClient } from '../utils/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  user: {
    id: string;
    email: string;
    role?: string[];
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Use a stable reference to the Supabase client
  const supabase = createSupabaseClient();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if we already have a session in the store
      if (auth.accessToken && auth.user) {
        setIsLoading(false);
        return;
      }
      
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        auth.setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
        });
        auth.setAccessToken(data.session.access_token);
      } else {
        // Only fetch user if we don't have a session
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          auth.setUser({
            id: userData.user.id,
            email: userData.user.email || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [auth, supabase]);

  useEffect(() => {
    let isMounted = true;

    // Initial fetch
    if (isMounted) {
      fetchUser();
    }

    // Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && session) {
          auth.setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          auth.setAccessToken(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          auth.setUser(null);
          auth.resetAccessToken();
        }
      }
    );

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [auth, fetchUser, supabase]);

  const value = {
    isAuthenticated: !!auth.user,
    isLoading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    fetchUserData: auth.fetchUserData,
    user: auth.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
