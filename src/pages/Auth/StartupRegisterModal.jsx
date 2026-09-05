import React, { useState } from 'react';
import { Rocket, ShieldCheck, CheckCircle2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import { authService } from '../../services/authService';

const StartupRegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    startupName: '',
    dpiitNumber: '',
    founderName: '',
    email: '',
    sector: 'Water',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleReset = () => {
    setFormData({
      startupName: '',
      dpiitNumber: '',
      founderName: '',
      email: '',
      sector: 'Water',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setRegisterError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (registerError) {
      setRegisterError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startupName.trim()) {
      newErrors.startupName = 'Startup / Company Name is required.';
    }

    if (!formData.dpiitNumber.trim()) {
      newErrors.dpiitNumber = 'DPIIT Recognition Number is required.';
    }

    if (!formData.founderName.trim()) {
      newErrors.founderName = 'Founder / Authorized Representative is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Official Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setRegisterError('');

    try {
      await authService.signupStartup({
        full_name: formData.founderName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        startup_name: formData.startupName.trim(),
        dpiit_number: formData.dpiitNumber.trim(),
        sector: formData.sector,
        organization: formData.startupName.trim()
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onRegisterSuccess) {
          onRegisterSuccess(formData.email.trim().toLowerCase());
        }
        handleClose();
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      setRegisterError(
        err?.message || 'Unable to complete registration. Please try again.'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="DPIIT Startup Registration"
      subtitle="Public-sector innovation onboarding for recognized technology startups"
      maxWidth="max-w-lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Startup Account Registered!
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your DPIIT profile has been verified. Redirecting you to sign in to the Startup Portal...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Open Public Registration for Startups</span>
              <p className="text-[11px] text-blue-800 leading-snug mt-0.5">
                Indian technology startups registered under DPIIT can create an account to discover and apply for government challenges.
              </p>
            </div>
          </div>

          {registerError && (
            <div
              role="alert"
              className="bg-rose-50 border border-rose-200 text-rose-800 rounded-md p-3 text-xs flex items-start gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-900">Registration Failed</span>
                <span>{registerError}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Startup / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="startupName"
              value={formData.startupName}
              onChange={handleChange}
              placeholder="e.g., AquaTech Solutions Pvt Ltd"
              className={`w-full px-3 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                errors.startupName
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-blue-600'
              }`}
            />
            {errors.startupName && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.startupName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                DPIIT Recognition Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="dpiitNumber"
                value={formData.dpiitNumber}
                onChange={handleChange}
                placeholder="DPIIT-XXXXXX"
                className={`w-full px-3 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono ${
                  errors.dpiitNumber
                    ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.dpiitNumber && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.dpiitNumber}</p>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Primary Technology Sector
              </label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
              >
                <option value="Water">Water & Sanitation</option>
                <option value="Healthcare">Healthcare & MedTech</option>
                <option value="Transport">Transport & Mobility</option>
                <option value="Agriculture">Agriculture & Agritech</option>
                <option value="Energy">Clean Energy & Microgrids</option>
                <option value="Waste">Waste Management</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Founder / Authorized Rep <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="founderName"
                value={formData.founderName}
                onChange={handleChange}
                placeholder="Dr. Arvind Subramaniam"
                className={`w-full px-3 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.founderName
                    ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.founderName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.founderName}</p>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Official Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@aquatech.io"
                className={`w-full px-3 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-blue-600'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  className={`w-full pl-9 pr-10 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                    errors.password
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">Minimum 8 characters</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full pl-9 pr-10 py-2 border rounded-md text-slate-900 bg-white placeholder-slate-400 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-600 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={isSubmitting}
              icon={Rocket}
            >
              Complete Registration
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default StartupRegisterModal;
