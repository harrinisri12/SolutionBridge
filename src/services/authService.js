import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { api } from './api';

export const authService = {
  /**
   * Log in user with email & password
   */
  async login(email, password) {
    if (!isSupabaseConfigured) {
      // Mock / Offline login fallback based on role
      return {
        user: { email },
        role: email.includes('gov') ? 'government' : email.includes('nic') || email.includes('expert') ? 'expert' : 'startup'
      };
    }

    // 1. Supabase Auth Sign In
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw authError;
    }

    // 2. Fetch User Profile from Backend
    try {
      const response = await api.get('/auth/me');
      return {
        session: authData.session,
        user: authData.user,
        profile: response.data.profile,
        role: response.data.profile.role
      };
    } catch {
      // Return basic auth data if profile fetch fails
      return {
        session: authData.session,
        user: authData.user
      };
    }
  },

  /**
   * Register a new Startup account (Public registration strictly locked to startups)
   */
  async signupStartup(formData) {
    const {
      full_name,
      email,
      password,
      phone,
      organization,
      startup_name,
      dpiit_number,
      sector,
      website
    } = formData;

    if (!isSupabaseConfigured) {
      return { success: true, message: 'Startup registered in demo mode' };
    }

    // 1. Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          organization: organization || startup_name,
          role: 'startup'
        }
      }
    });

    if (authError) {
      throw authError;
    }

    // 2. If session established, register startup company profile via backend
    if (authData.session) {
      try {
        await api.post('/auth/register-startup', {
          full_name,
          phone,
          organization,
          startup_name,
          dpiit_number,
          sector,
          website
        });
      } catch (backendErr) {
        console.warn('Backend startup record registration warning:', backendErr);
      }
    }

    return authData;
  },

  /**
   * Log out active session
   */
  async logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Get current authenticated profile from backend
   */
  async getProfile() {
    return api.get('/auth/me');
  },

  /**
   * Check session status
   */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};

export default authService;
