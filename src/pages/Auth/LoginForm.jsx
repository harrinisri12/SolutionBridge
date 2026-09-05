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
  const { setCurrentRole, addToast } = useApp();

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
       * 3. Profile/role retrieval
       */
      const authResult = await authService.login(
        normalizedEmail,
        password
      );

      /*
       * The stakeholder role must come from the authenticated
       * user's database profile.
       *
       * Never trust the role selected in the login UI.
       */
      const backendRole = authResult?.profile?.role
        || authResult?.role;

      if (!backendRole) {
        throw new Error(
          'Your account is authenticated, but no stakeholder role is assigned to your profile. Please contact SolutionBridge Support.'
        );
      }

      const normalizedRole = backendRole.toLowerCase();

      const roleMap = {
        government: 'Government',
        startup: 'Startup',
        expert: 'Expert'
      };

      const detectedRole = roleMap[normalizedRole];

      if (!detectedRole) {
        throw new Error(
          'Your account has an invalid stakeholder role. Please contact SolutionBridge Support.'
        );
      }

      /*
       * The role selected on the login page is only UI context.
       *
       * The authenticated database role is authoritative.
       */
      if (detectedRole !== selectedRole) {
        await authService.logout();

        throw new Error(
          `This account is registered as ${detectedRole}. Please select ${detectedRole} and sign in again.`
        );
      }

      /*
       * Store the authenticated role globally.
       */
      setCurrentRole(detectedRole);

      /*
       * Show successful authentication message.
       */
      addToast(
        `Successfully authenticated as ${detectedRole}`,
        'success'
      );

      /*
       * Redirect to the existing stakeholder portal.
       */
      const portalPaths = {
        Government: '/gov/overview',
        Startup: '/startup/overview',
        Expert: '/expert/overview'
      };

      navigate(portalPaths[detectedRole], {
        replace: true
      });

    } catch (err) {
      console.error('Login failed:', err);

      let message =
        'Unable to sign in. Please check your email and password.';

      /*
       * Supabase authentication errors
       */
      if (err?.message) {
        const lowerMessage = err.message.toLowerCase();

        if (
          lowerMessage.includes('invalid login credentials')
        ) {
          message =
            'Invalid email or password. Please check your credentials and try again.';
        } else if (
          lowerMessage.includes('email not confirmed')
        ) {
          message =
            'Your email address has not been confirmed. Please confirm your email before signing in.';
        } else if (
          lowerMessage.includes('too many requests')
        ) {
          message =
            'Too many login attempts. Please wait a moment and try again.';
        } else if (
          lowerMessage.includes('profile')
        ) {
          message = err.message;
        } else if (
          lowerMessage.includes('stakeholder')
        ) {
          message = err.message;
        } else if (
          lowerMessage.includes('account')
        ) {
          message = err.message;
        } else {
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
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-slate-700 flex items-start gap-2 text-xs">
          <Shield className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />

          <div>
            <span className="font-semibold block text-slate-900">
              Government Administrative Provisioning
            </span>

            <span className="text-[11px] text-slate-500">
              Government accounts are provisioned by authorized administrators.
            </span>
          </div>
        </div>
      )}

      {/* Expert Account Rule */}
      {selectedRole === 'Expert' && (
        <div className="bg-purple-50/80 border border-purple-200 rounded-md p-3 text-purple-900 flex items-start gap-2 text-xs">
          <UserCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />

          <div>
            <span className="font-semibold block text-purple-950">
              Expert Panel Accreditation
            </span>

            <span className="text-[11px] text-purple-800">
              Expert accounts are created by authorized Government administrators.
            </span>
          </div>
        </div>
      )}

      {/* Startup Registration */}
      {selectedRole === 'Startup' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-900 flex items-center justify-between gap-3 text-xs">

          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-blue-700 shrink-0" />

            <div>
              <span className="font-bold text-slate-900 block">
                New to SolutionBridge?
              </span>

              <span className="text-[11px] text-slate-600">
                DPIIT startups can register publicly
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenStartupRegister}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 font-bold rounded border border-blue-300 text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            Create Startup Account
          </button>
        </div>
      )}

      {/* Login Error */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-rose-50 border border-rose-200 text-rose-800 rounded-md p-3 text-xs flex items-start gap-2 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

          <div>
            <span className="font-bold block text-rose-900">
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
          className="block text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1"
        >
          Email Address{' '}
          <span className="text-rose-600">*</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
            className={`block w-full pl-9 pr-3 py-2 border rounded-md text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              emailError
                ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                : 'border-slate-300 focus:border-blue-600'
            }`}
          />
        </div>

        {emailError && (
          <p
            id="email-error"
            className="mt-1 text-xs text-rose-600 font-medium"
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
            className="block text-xs font-semibold text-slate-800 uppercase tracking-wide"
          >
            Password{' '}
            <span className="text-rose-600">*</span>
          </label>

          <button
            type="button"
            onClick={onOpenForgotModal}
            className="text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
            className={`block w-full pl-9 pr-10 py-2 border rounded-md text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              passwordError
                ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                : 'border-slate-300 focus:border-blue-600'
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
            className="mt-1 text-xs text-rose-600 font-medium"
          >
            {passwordError}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between text-xs pt-0.5">

        <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
          />

          <span>
            Remember me on this device
          </span>
        </label>

        <span className="text-[11px] text-slate-400 font-mono">
          TLS 1.3 Secure
        </span>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          className="w-full text-sm font-bold bg-blue-700 hover:bg-blue-800 active:bg-blue-900 py-2.5"
          icon={ArrowRight}
          iconPosition="right"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>

      {/* Support */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">

        <div className="flex items-center gap-1 text-slate-500">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />

          <span>
            Need help signing in?
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSupportModal}
          className="font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
        >
          Contact SolutionBridge Support
        </button>
      </div>

      {/* Terms */}
      <p className="text-[11px] text-slate-500 text-center leading-normal pt-1">
        By signing in, you agree to the platform's{' '}
        <span className="text-slate-700 underline cursor-pointer">
          Terms of Use
        </span>{' '}
        and{' '}
        <span className="text-slate-700 underline cursor-pointer">
          Privacy Policy
        </span>.
      </p>

    </form>
  );
};

export default LoginForm;