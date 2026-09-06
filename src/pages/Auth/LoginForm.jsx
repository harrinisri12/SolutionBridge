import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Rocket,
  AlertCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import Button from '../../components/Common/Button';
import { authService } from '../../services/authService';

const LoginForm = ({
  selectedRole,
  onOpenStartupRegister,
  onOpenForgotModal,
  onOpenSupportModal
}) => {
  const navigate = useNavigate();
  const { applyProfile, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email.trim()) {
      setEmailError('Please enter your registered email address.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email format.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      /*
       * Authenticate against Supabase.
       *
       * authService.login() performs:
       * 1. Supabase email/password authentication
       * 2. Backend /auth/me request
       * 3. Profile/role retrieval & verification
       */
      const authResult = await authService.login(
        normalizedEmail,
        password
      );

      const profile = authResult?.profile;

      if (!profile) {
        throw new Error(
          'Your account is authenticated, but no stakeholder profile is assigned. Please contact SolutionBridge Support.'
        );
      }

      /*
       * Check whether the account is active.
       */
      if (profile.is_active === false) {
        await authService.logout();

        throw new Error(
          'Your SolutionBridge account has been deactivated. Please contact an authorized administrator.'
        );
      }

      /*
       * Get the authoritative role from the database.
       *
       * Admin accounts are represented as:
       * role = government
       * is_admin = true
       */
      const backendRole = (profile.role || '').toLowerCase();
      const isAdmin = Boolean(profile.is_admin);

      /*
       * Synchronize authenticated profile with AppContext.
       */
      if (applyProfile) {
        applyProfile(profile);
      }

      /*
       * Normalize the selected platform from the login UI.
       *
       * Expected values:
       * Startup
       * Government
       * Expert
       */
      const selectedPlatform = (selectedRole || '').toLowerCase();

      let targetPath = '';
      let roleDisplayName = '';

      /*
       * ============================================================
       * STARTUP LOGIN
       * ============================================================
       *
       * Only startup accounts can enter through the Startup portal.
       */
      if (selectedPlatform === 'startup') {
        if (backendRole !== 'startup') {
          throw new Error(
            'Wrong platform. This account is not registered as a Startup account.'
          );
        }

        targetPath = '/startup/overview';
        roleDisplayName = 'Startup Founder';
      }

      /*
       * ============================================================
       * GOVERNMENT LOGIN
       * ============================================================
       *
       * Both Government Officers and Platform Administrators
       * use the Government login page.
       *
       * Government Officer:
       * role = government
       * is_admin = false
       *
       * Platform Administrator:
       * role = government
       * is_admin = true
       *
       * Therefore:
       *
       * Government Officer -> /gov/overview
       * Administrator      -> /admin/overview
       */
      else if (selectedPlatform === 'government') {
        if (backendRole !== 'government') {
          throw new Error(
            'Wrong platform. This account is not registered as a Government account.'
          );
        }

        if (isAdmin) {
          targetPath = '/admin/overview';
          roleDisplayName = 'Platform Administrator';
        } else {
          targetPath = '/gov/overview';
          roleDisplayName = 'Government Officer';
        }
      }

      /*
       * ============================================================
       * EXPERT LOGIN
       * ============================================================
       *
       * Only expert accounts can enter through the Expert portal.
       */
      else if (selectedPlatform === 'expert') {
        if (backendRole !== 'expert') {
          throw new Error(
            'Wrong platform. This account is not registered as an Expert account.'
          );
        }

        targetPath = '/expert/overview';
        roleDisplayName = 'Expert Evaluator';
      }

      /*
       * ============================================================
       * INVALID PLATFORM
       * ============================================================
       */
      else {
        throw new Error(
          'Please select a valid login platform.'
        );
      }

      /*
       * ============================================================
       * SUCCESS
       * ============================================================
       */
      addToast(
        `Successfully authenticated as ${roleDisplayName}`,
        'success'
      );

      /*
       * Redirect only after:
       *
       * 1. Supabase authentication succeeds
       * 2. Profile exists
       * 3. Account is active
       * 4. Selected platform matches the account
       */
      navigate(targetPath, {
        replace: true
      });

    } catch (err) {
      console.error('Login failed:', err);

      let message =
        'Unable to sign in. Please check your email and password.';

      if (err?.message) {
        const lowerMessage = err.message.toLowerCase();

        /*
         * Wrong platform
         */
        if (lowerMessage.includes('wrong platform')) {
          message = err.message;
        }

        /*
         * Supabase authentication errors
         */
        else if (
          lowerMessage.includes('invalid login credentials')
        ) {
          message =
            'Invalid email or password. Please check your credentials and try again.';
        }

        /*
         * Email confirmation
         */
        else if (
          lowerMessage.includes('email not confirmed')
        ) {
          message =
            'Your email address has not been confirmed. Please confirm your email before signing in.';
        }

        /*
         * Rate limiting
         */
        else if (
          lowerMessage.includes('too many requests')
        ) {
          message =
            'Too many login attempts. Please wait a moment and try again.';
        }

        /*
         * Profile-related errors
         */
        else if (
          lowerMessage.includes('profile')
        ) {
          message = err.message;
        }

        /*
         * Stakeholder-related errors
         */
        else if (
          lowerMessage.includes('stakeholder')
        ) {
          message = err.message;
        }

        /*
         * Account-related errors
         */
        else if (
          lowerMessage.includes('account')
        ) {
          message = err.message;
        }

        /*
         * Other backend/auth errors
         */
        else {
          message = err.message;
        }
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >

      {/* Government Account Rule */}
      {selectedRole === 'Government' && (
        <div className="bg-[#eff4ff] border border-[#d5e3fc] rounded-md p-3 text-[#001428] flex items-start gap-2 text-xs">
          <Shield className="w-4 h-4 text-[#045eb2] shrink-0 mt-0.5" />

          <div>
            <span className="font-semibold block text-[#001428]">
              Government Administrative Provisioning
            </span>

            <span className="text-[11px] text-[#43474d]">
              Government accounts are provisioned by authorized administrators.
            </span>
          </div>
        </div>
      )}

      {/* Expert Account Rule */}
      {selectedRole === 'Expert' && (
        <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-md p-3 text-[#001428] flex items-start gap-2 text-xs">
          <UserCheck className="w-4 h-4 text-[#4f46e5] shrink-0 mt-0.5" />

          <div>
            <span className="font-semibold block text-[#001428]">
              Expert Panel Accreditation
            </span>

            <span className="text-[11px] text-[#43474d]">
              Expert accounts are created by authorized Government administrators.
            </span>
          </div>
        </div>
      )}

      {/* Startup Registration */}
      {selectedRole === 'Startup' && (
        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-md p-3 text-[#001428] flex items-center justify-between gap-3 text-xs">

          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#0d9488] shrink-0" />

            <div>
              <span className="font-bold text-[#001428] block">
                New to SolutionBridge?
              </span>

              <span className="text-[11px] text-[#43474d]">
                DPIIT startups can register publicly
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenStartupRegister}
            className="px-2.5 py-1 bg-white hover:bg-[#f0fdfa] text-[#0d9488] font-bold rounded border border-[#99f6e4] text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            Create Startup Account
          </button>
        </div>
      )}

      {/* Login Error */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] rounded-md p-3 text-xs flex items-start gap-2 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />

          <div>
            <span className="font-bold block text-[#7f1d1d]">
              Sign-in Failed
            </span>

            <span>
              {errorMessage}
            </span>
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-[11px] font-bold text-[#001428] uppercase tracking-wide mb-1"
        >
          Email Address{' '}
          <span className="text-rose-600">*</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8993a4]">
            <Mail className="w-4 h-4" />
          </div>

          <input
            id="login-email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);

              if (emailError) {
                setEmailError('');
              }

              if (errorMessage) {
                setErrorMessage('');
              }
            }}
            placeholder="Enter your registered email"
            aria-invalid={!!emailError}
            aria-describedby={
              emailError ? 'email-error' : undefined
            }
            className={`block w-full pl-9 pr-3 py-2 border rounded-md text-xs sm:text-sm text-[#001428] bg-white placeholder-[#8993a4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#045eb2] ${
              emailError
                ? 'border-[#fca5a5] bg-[#fef2f2]/30 text-[#991b1b] focus:border-[#dc2626] focus:ring-[#dc2626]'
                : 'border-[#e2e8f0] focus:border-[#045eb2]'
            }`}
          />
        </div>

        {emailError && (
          <p
            id="email-error"
            className="mt-1 text-xs text-[#dc2626] font-medium"
          >
            {emailError}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1">

          <label
            htmlFor="login-password"
            className="block text-[11px] font-bold text-[#001428] uppercase tracking-wide"
          >
            Password{' '}
            <span className="text-rose-600">*</span>
          </label>

          <button
            type="button"
            onClick={onOpenForgotModal}
            className="text-xs font-semibold text-[#045eb2] hover:text-[#034a8f] hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8993a4]">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);

              if (passwordError) {
                setPasswordError('');
              }

              if (errorMessage) {
                setErrorMessage('');
              }
            }}
            placeholder="Enter your password"
            aria-invalid={!!passwordError}
            aria-describedby={
              passwordError ? 'password-error' : undefined
            }
            className={`block w-full pl-9 pr-10 py-2 border rounded-md text-xs sm:text-sm text-[#001428] bg-white placeholder-[#8993a4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#045eb2] ${
              passwordError
                ? 'border-[#fca5a5] bg-[#fef2f2]/30 text-[#991b1b] focus:border-[#dc2626] focus:ring-[#dc2626]'
                : 'border-[#e2e8f0] focus:border-[#045eb2]'
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8993a4] hover:text-[#001428] cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {passwordError && (
          <p
            id="password-error"
            className="mt-1 text-xs text-[#dc2626] font-medium"
          >
            {passwordError}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between text-xs pt-0.5">

        <label className="flex items-center gap-2 text-[#43474d] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
            className="w-4 h-4 rounded border-[#cbd5e1] text-[#045eb2] focus:ring-[#045eb2] focus:ring-offset-0"
          />

          <span className="text-xs font-medium">
            Remember me on this device
          </span>
        </label>

        <span className="text-[10px] text-[#8993a4] font-mono">
          TLS 1.3 Secure
        </span>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-md bg-[#045eb2] hover:bg-[#034a8f] active:bg-[#003264] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Support */}
      <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#43474d]">

        <div className="flex items-center gap-1 text-[#64748b]">
          <HelpCircle className="w-3.5 h-3.5 text-[#8993a4]" />

          <span>
            Need help signing in?
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSupportModal}
          className="font-semibold text-[#045eb2] hover:text-[#034a8f] hover:underline cursor-pointer"
        >
          Contact Support Desk
        </button>
      </div>

      {/* Terms */}
      <p className="text-[10px] text-[#8993a4] text-center leading-normal pt-1">
        By signing in, you agree to the platform's{' '}
        <span className="text-[#43474d] underline cursor-pointer">
          Terms of Use
        </span>{' '}
        and{' '}
        <span className="text-[#43474d] underline cursor-pointer">
          Privacy Policy
        </span>.
      </p>

    </form>
  );
};

export default LoginForm;