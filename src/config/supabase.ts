import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that we have the necessary credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export types for TypeScript
export type SupabaseClient = typeof supabase;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Helper function to get authentication status
export const getAuthStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting auth status:', error);
    return null;
  }
};

// Helper function for sign up
export const signUp = async (email: string, password: string, data?: any) => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: data || {},
      },
    });
    if (error) throw error;
    return { success: true, data: authData };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message };
  }
};

// Helper function for sign in
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
};

// Helper function for sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

// Helper function for password reset
export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};

export default supabase;
