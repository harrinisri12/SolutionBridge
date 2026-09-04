import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  Rocket,
  Award,
  ArrowLeft,
  CheckCircle2,
  Target,
  Zap,
  ShieldCheck,
  Lock,
  Headphones,
  Mail,
  Phone
} from 'lucide-react';
import RoleSelector from './RoleSelector';
import LoginForm from './LoginForm';
import StartupRegisterModal from './StartupRegisterModal';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';

const LoginPage = () => {
  const location = useLocation();

  // Normalize incoming location.state role if present (e.g. from Landing page)
  const getInitialRole = () => {
    const passedRole = location.state?.role;
    if (passedRole === 'Expert' || passedRole === 'Expert / Evaluator') return 'Expert';
    if (passedRole === 'Startup') return 'Startup';
    return 'Government';
  };

  const [selectedRole, setSelectedRole] = useState(getInitialRole);
  const [isStartupRegisterOpen, setIsStartupRegisterOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================================= */}
      {/* 1. GOVERNMENT-STYLE TOP HEADER WITH BACK NAVIGATION */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Tricolor National Stripe */}
        <div className="gov-header-stripe" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Left: Emblem Crest & Mission Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs border border-slate-800 shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-wide">
                Government of India
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                Innovation Procurement Mission
              </div>
            </div>
          </div>

          {/* Right: Back to Public Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-blue-800 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to SolutionBridge</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN MAIN AUTHENTICATION CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT PANEL: Branding & 6-Stage Innovation Lifecycle (7 Cols) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-lg p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col justify-between">
            
            {/* Top Branding */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                    Public Sector Innovation Engine
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                SolutionBridge
              </h1>

              <p className="text-sm font-semibold text-blue-200 mt-0.5">
                From Problems to Proven Solutions
              </p>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                Connecting government departments with innovative startups to test, validate, and scale technology solutions for real-world public challenges.
              </p>

              {/* 6-Stage Lifecycle Vertical Flow */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Innovation Procurement Lifecycle
                </span>

                <div className="space-y-2">
                  
                  {/* 01 Define */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-6 h-6 rounded bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">01 Define</div>
                      <div className="text-[10px] text-slate-400 truncate">Departments identify pressing public problems</div>
                    </div>
                  </div>

                  <div className="w-px h-1.5 bg-slate-700 ml-5" />

                  {/* 02 Discover */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-6 h-6 rounded bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Rocket className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">02 Discover</div>
                      <div className="text-[10px] text-slate-400 truncate">DPIIT startups discover challenges & submit proposals</div>
                    </div>
                  </div>

                  <div className="w-px h-1.5 bg-slate-700 ml-5" />

                  {/* 03 Evaluate */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-6 h-6 rounded bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">03 Evaluate</div>
                      <div className="text-[10px] text-slate-400 truncate">Independent experts score on 5-factor scorecard</div>
                    </div>
                  </div>

                  <div className="w-px h-1.5 bg-slate-700 ml-5" />

                  {/* 04 Pilot */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-6 h-6 rounded bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">04 Pilot</div>
                      <div className="text-[10px] text-slate-400 truncate">Controlled real-world trials with telemetry logs</div>
                    </div>
                  </div>

                  <div className="w-px h-1.5 bg-slate-700 ml-5" />

                  {/* 05 Validate */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                    <div className="w-6 h-6 rounded bg-teal-600/30 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">05 Validate</div>
                      <div className="text-[10px] text-slate-400 truncate">Empirical baseline vs actual KPI audit verification</div>
                    </div>
                  </div>

                  <div className="w-px h-1.5 bg-slate-700 ml-5" />

                  {/* 06 Procure */}
                  <div className="flex items-center gap-3 p-2 rounded bg-slate-800/80 border border-emerald-500/50">
                    <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-emerald-300">06 Procure</div>
                      <div className="text-[10px] text-slate-300 truncate">Direct Procurement Order (DPO) & milestone release</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Stakeholder Security Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Secure access for authorized stakeholders:
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] font-medium text-slate-300">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  Government Departments
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                  <Rocket className="w-3 h-3 text-emerald-400" />
                  DPIIT Startups
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-purple-400" />
                  Expert Evaluators
                </span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT PANEL: Centered Authentication Card (6 Cols) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="gov-card p-6 sm:p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
              
              {/* Card Header */}
              <div className="pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Sign in to SolutionBridge
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                    <Lock className="w-3 h-3" />
                    SSO Auth
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Access your stakeholder workspace
                </p>
              </div>

              {/* Stakeholder Role Selector (3 choices) */}
              <div className="mb-5">
                <RoleSelector
                  selectedRole={selectedRole}
                  onSelectRole={handleRoleSelect}
                />
              </div>

              {/* Login Form */}
              <LoginForm
                key={selectedRole}
                selectedRole={selectedRole}
                onOpenStartupRegister={() => setIsStartupRegisterOpen(true)}
                onOpenForgotModal={() => setIsForgotModalOpen(true)}
                onOpenSupportModal={() => setIsSupportModalOpen(true)}
              />

            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. MODALS (Startup Registration, Forgot Password, Helpdesk) */}
      {/* ========================================================================= */}
      
      {/* Startup Registration Modal */}
      <StartupRegisterModal
        isOpen={isStartupRegisterOpen}
        onClose={() => setIsStartupRegisterOpen(false)}
        onRegisterSuccess={() => {
          setSelectedRole('Startup');
        }}
      />

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Credentials"
        subtitle="Public sector credentials recovery system"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Enter your official registered email address. Password reset instructions will be dispatched to your nodal address or security administrator.
          </p>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. dir.innovate@gov.in"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Password reset link has been dispatched to your official email.');
                setIsForgotModalOpen(false);
              }}
            >
              Dispatch Reset Link
            </Button>
          </div>
        </div>
      </Modal>

      {/* SolutionBridge Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="SolutionBridge Helpdesk & Support"
        subtitle="Assistance for Government Departments, Startups, and Evaluators"
        maxWidth="max-w-md"
      >
        <div className="space-y-3.5 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Headphones className="w-4 h-4 text-blue-700" />
              <span>Dedicated Stakeholder Support Desk</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              For technical access issues, administrative provisioning, or DPIIT recognition validation, reach out to the project helpdesk.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email: <strong className="text-blue-700">support.innovate@gov.in</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Toll Free: <strong>1800-11-2026 (GovTech Desk)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Hours: <strong>09:30 AM – 06:00 PM IST (Mon–Fri)</strong></span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsSupportModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 text-slate-400 py-3 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © 2026 SolutionBridge. Innovation Procurement Mission, Government of India.
          </div>
          <div className="flex gap-4 text-slate-400">
            <span>GovCloud TLS 1.3 Certified</span>
            <span>•</span>
            <span>NIC Sandbox Security Verified</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LoginPage;
