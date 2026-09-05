import {
  supabase,
  isSupabaseConfigured
} from '../lib/supabaseClient';

import { api } from './api';

export const authService = {

  /**
   * Login using Supabase Authentication.
   *
   * The stakeholder role is retrieved from
   * public.profiles through the backend.
   */
  async login(email, password) {

    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase authentication is not configured. Please configure the frontend environment variables.'
      );
    }

    const {
      data: authData,
      error: authError
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw authError;
    }

    if (!authData?.session) {
      throw new Error(
        'Authentication succeeded but no active session was created.'
      );
    }

    let profileResponse;

    try {
      profileResponse = await api.get('/auth/me');
    } catch (error) {

      await supabase.auth.signOut();

      throw new Error(
        error?.message ||
        'Unable to retrieve your SolutionBridge profile.'
      );
    }

    const profile =
      profileResponse?.data?.profile;

    if (!profile) {

      await supabase.auth.signOut();

      throw new Error(
        'No SolutionBridge profile is associated with this account.'
      );
    }

    const validRoles = [
      'government',
      'startup',
      'expert'
    ];

    const role =
      profile.role?.toLowerCase();

    if (!validRoles.includes(role)) {

      await supabase.auth.signOut();

      throw new Error(
        'Your account does not have a valid SolutionBridge stakeholder role.'
      );
    }

    if (profile.is_active === false) {

      await supabase.auth.signOut();

      throw new Error(
        'Your SolutionBridge account has been deactivated. Please contact an authorized administrator.'
      );
    }

    return {
      session: authData.session,
      user: authData.user,
      profile,
      role
    };
  },


  /**
   * Public Startup Registration
   *
   * Flow:
   *
   * 1. Create Supabase Auth user
   * 2. Get access token directly from signup response
   * 3. Send that token to backend
   * 4. Backend creates startup record
   */
  async signupStartup(formData) {

    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase authentication is not configured.'
      );
    }

    /*
     * Accept multiple possible field names so the
     * registration UI and service remain compatible.
     */

    const companyName =
      formData?.companyName ||
      formData?.company_name ||
      formData?.startup_name ||
      formData?.startupName ||
      formData?.organization ||
      '';

    const dpiitNumber =
      formData?.dpiitNumber ||
      formData?.dpiit_number ||
      formData?.dpiitRecognitionNumber ||
      '';

    const sector =
      formData?.sector ||
      formData?.technologySector ||
      '';

    const founderName =
      formData?.founderName ||
      formData?.founder_name ||
      formData?.full_name ||
      formData?.fullName ||
      formData?.founder ||
      '';

    const email =
      formData?.email ||
      formData?.officialEmail ||
      formData?.official_email ||
      '';

    const password =
      formData?.password ||
      '';

    const confirmPassword =
      formData?.confirmPassword ||
      formData?.confirm_password ||
      '';


    /*
     * Validation
     */

    if (!email.trim()) {
      throw new Error(
        'Official email address is required.'
      );
    }

    if (!password) {
      throw new Error(
        'Password is required.'
      );
    }

    if (!founderName.trim()) {
      throw new Error(
        'Founder / Authorized Representative name is required.'
      );
    }

    if (!companyName.trim()) {
      throw new Error(
        'Startup / Company Name is required.'
      );
    }

    if (!dpiitNumber.trim()) {
      throw new Error(
        'DPIIT Recognition Number is required.'
      );
    }

    if (password.length < 8) {
      throw new Error(
        'Password must contain at least 8 characters.'
      );
    }

    if (
      confirmPassword &&
      password !== confirmPassword
    ) {
      throw new Error(
        'Password and Confirm Password do not match.'
      );
    }


    /*
     * Normalize values.
     */

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedFounderName =
      founderName.trim();

    const normalizedCompanyName =
      companyName.trim();

    const normalizedDpiitNumber =
      dpiitNumber.trim();


    /*
     * --------------------------------------------------
     * STEP 1
     * Create Supabase Auth user
     * --------------------------------------------------
     */

    const {
      data,
      error
    } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: normalizedFounderName,
          phone: '',
          organization: normalizedCompanyName,
          role: 'startup'
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.user) {
      throw new Error(
        'Startup account could not be created.'
      );
    }


    /*
     * --------------------------------------------------
     * STEP 2
     * Get access token
     * --------------------------------------------------
     *
     * We intentionally use the token returned directly
     * by signUp().
     *
     * This avoids a race condition where getSession()
     * may not yet contain the newly-created session.
     */

    const accessToken =
      data?.session?.access_token;


    /*
     * --------------------------------------------------
     * STEP 3
     * Email confirmation handling
     * --------------------------------------------------
     */

    if (!accessToken) {

      return {
        ...data,

        requiresEmailConfirmation: true,

        registrationCompleted: false,

        message:
          'Your account was created. Please confirm your email before continuing.'
      };
    }


    /*
     * --------------------------------------------------
     * STEP 4
     * Register startup in SolutionBridge backend
     * --------------------------------------------------
     *
     * IMPORTANT:
     *
     * The Authorization header is explicitly supplied
     * using the access token returned by Supabase.
     */

    try {

      await api.post(
        '/auth/register-startup',

        {
          email: normalizedEmail,

          full_name:
            normalizedFounderName,

          phone: '',

          organization:
            normalizedCompanyName,

          company_name:
            normalizedCompanyName,

          dpiit_number:
            normalizedDpiitNumber,

          sector:
            sector || 'Technology'
        },

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    } catch (backendError) {

      console.error(
        'Startup backend registration failed:',
        backendError
      );

      throw new Error(
        backendError?.message ||
        'Supabase account was created, but the SolutionBridge startup profile could not be completed.'
      );
    }


    /*
     * --------------------------------------------------
     * STEP 5
     * Registration completed
     * --------------------------------------------------
     */

    return {
      ...data,

      requiresEmailConfirmation: false,

      registrationCompleted: true,

      message:
        'Startup account created successfully.'
    };
  },


  /**
   * Logout current Supabase session.
   */
  async logout() {

    if (!isSupabaseConfigured) {
      return;
    }

    const {
      error
    } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },


  /**
   * Retrieve current SolutionBridge profile.
   */
  async getProfile() {
    return api.get('/auth/me');
  },


  /**
   * Retrieve current Supabase session.
   */
  async getSession() {

    if (!isSupabaseConfigured) {
      return null;
    }

    const {
      data,
      error
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data?.session || null;
  }
};

export default authService;