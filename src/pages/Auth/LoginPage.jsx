import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Building2,
  Rocket,
  Award,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import Button from '../../components/Common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useApp();

  const [selectedRole, setSelectedRole] = useState('Government');
  const [email, setEmail] = useState('dir.innovate@gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const roleConfigs = {
    Government: {
      email: 'dir.innovate@gov.in',
      roleLabel: 'Government Department',
      subtitle: 'Ministry / State Innovation Cells & Procuring Entities',
      icon: Building2,
      path: '/gov/overview',
      accentColor: 'border-blue-600 bg-blue-50/50'
    },
    Startup: {
      email: 'contact@aquatech.io',
      roleLabel: 'Startup Founder',
      subtitle: 'DPIIT Registered Innovators & Deep-Tech Enterprises',
      icon: Rocket,
      path: '/startup/overview',
      accentColor: 'border-emerald-600 bg-emerald-50/50'
    },
    'Expert / Evaluator': {
      email: 'r.chandra@nic.in',
      roleLabel: 'Expert / Evaluator',
      subtitle: 'Technical Screening Committee & Pilot Validators',
      icon: Award,
      path: '/expert/overview',
      accentColor: 'border-purple-600 bg-purple-50/50'
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(roleConfigs[roleKey].email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const actualRole = selectedRole === 'Expert / Evaluator' ? 'Expert' : selectedRole;
    setCurrentRole(actualRole);
    navigate(roleConfigs[selectedRole].path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      {/* Top National Header Stripe */}
      <div className="gov-header-stripe" />

      {/* Top Banner */}
      <header className="bg-slate-900 text-white py-3 px-6 border-b border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                Government of India • Ministry of Electronics & IT / DPIIT
              </div>
              <div className="text-sm font-bold tracking-wide text-white">
                SolutionBridge — From Problems to Proven Solution
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Secure GovCloud Sandbox
            </span>
            <span>SIH Prototype 2026</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Card */}
          <div className="gov-card shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b border-slate-800">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/30 border border-blue-400/40 text-white mb-3">
                <FileCheck2 className="w-6 h-6 text-blue-300" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                SolutionBridge
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                From problems to proven solution • National Innovation Procurement Platform
              </p>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8 bg-white">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Select Your Portal Access Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.keys(roleConfigs).map((roleKey) => {
                      const cfg = roleConfigs[roleKey];
                      const Icon = cfg.icon;
                      const isSelected = selectedRole === roleKey;

                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => handleRoleSelect(roleKey)}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected ? 'text-blue-600' : 'text-slate-500'
                              }`}
                            />
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <div className="text-xs font-bold leading-tight">
                            {roleKey}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {cfg.subtitle.split(' ')[0]} Access
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Official Email Address / SSO ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@organization.gov.in"
                      className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase">
                      Password / 2FA Token
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Prototype: Password reset email dispatched to authorized official.');
                      }}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Remember Me checkbox */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember session on secure workstation</span>
                  </label>
                  <span className="text-slate-400">v2.4.0 (SIH-Prod)</span>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-sm font-semibold"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Log In to {selectedRole} Portal
                </Button>
              </form>

              {/* Registration footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>New DPIIT Startup or Evaluator?</span>
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRoleSelect('Startup');
                  }}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Register / Onboard with DPIIT
                </a>
              </div>
            </div>
          </div>

          {/* Quick SIH Demo Credentials Banner */}
          <div className="mt-4 p-3.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 shadow-xs flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-semibold block">
                SIH Evaluator Quick Access:
              </strong>
              <span className="text-slate-500">
                Click any role above to pre-fill credentials & jump into the live workflow.
              </span>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-medium rounded text-[11px] border border-emerald-200">
              Mock Engine Ready
            </span>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 SolutionBridge — From Problems to Proven Solution. Designed for Government Innovation Lifecycle.
          </div>
          <div className="flex gap-4 text-slate-400 text-xs">
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Public Procurement</a>
            <a href="#help" className="hover:text-white">Helpdesk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
