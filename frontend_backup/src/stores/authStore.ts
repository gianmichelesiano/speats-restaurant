import Cookies from 'js-cookie';
import { create } from 'zustand';
import { createSupabaseClient } from '../utils/supabase/client';

// Use the same storage key as in the Supabase client configuration
const ACCESS_TOKEN = 'supabase.auth.token';

interface AuthUser {
  id: string;
  email: string;
  role?: string[];
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
    signIn: (email: string, password: string) => Promise<{ error: any | null }>;
    signUp: (email: string, password: string) => Promise<{ error: any | null }>;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
    fetchUserData: () => Promise<void>;
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = Cookies.get(ACCESS_TOKEN);
  const initToken = cookieState ? cookieState : '';
  
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, accessToken);
          return { ...state, auth: { ...state.auth, accessToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '' } };
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          };
        }),
      signIn: async (email: string, password: string) => {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (data.session) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: { id: data.user?.id || '', email: data.user?.email || '' },
              accessToken: data.session.access_token,
            },
          }));
          Cookies.set(ACCESS_TOKEN, data.session.access_token);
          
          // Fetch additional user data after successful login
          const auth = get().auth;
          auth.fetchUserData();
        }
        
        return { error };
      },
      signUp: async (email: string, password: string) => {
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        return { error };
      },
      signOut: async () => {
        try {
          const supabase = createSupabaseClient();
          // Clear local session first
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
            },
          }));
          Cookies.remove(ACCESS_TOKEN);
          
          // Then sign out from Supabase
          await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
          console.error('Error during sign out:', error);
          // Even if there's an error, we should still clear local state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
            },
          }));
          Cookies.remove(ACCESS_TOKEN);
        }
      },
      getToken: async () => {
        const supabase = createSupabaseClient();
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
      },
      fetchUserData: async () => {
        try {
          // First check if we already have a user in the store
          const currentUser = get().auth.user;
          const currentToken = get().auth.accessToken;
          
          // If we already have a user and token, try to get data from the session first
          if (currentUser && currentToken) {
            const supabase = createSupabaseClient();
            const { data: sessionData } = await supabase.auth.getSession();
            
            // If we have a valid session, use that data
            if (sessionData.session) {
              set((state) => ({
                ...state,
                auth: {
                  ...state.auth,
                  user: {
                    id: sessionData.session.user.id,
                    email: sessionData.session.user.email || '',
                  },
                  accessToken: sessionData.session.access_token,
                },
              }));
              
              if (sessionData.session.access_token !== currentToken) {
                Cookies.set(ACCESS_TOKEN, sessionData.session.access_token);
              }
              
              return;
            }
          }
          
          // If we don't have a user or session, try to get user data
          const supabase = createSupabaseClient();
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }
          
          if (data.user) {
            // You can also fetch additional user data from your database here
            // For example: const userProfile = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            
            set((state) => ({
              ...state,
              auth: {
                ...state.auth,
                user: {
                  id: data.user.id,
                  email: data.user.email || '',
                  // Add additional user data from your database if needed
                  // role: userProfile?.data?.role || [],
                },
              },
            }));
          }
        } catch (error) {
          console.error('Error in fetchUserData:', error);
        }
      },
    },
  };
});

export const useAuth = () => useAuthStore((state) => state.auth);
