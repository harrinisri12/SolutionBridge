import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  ArrowLeft,
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
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans selection:bg-[#eff4ff] selection:text-[#045eb2]">
      
      {/* ========================================================================= */}
      {/* 1. GOVERNMENT-STYLE TOP HEADER WITH BACK NAVIGATION */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40 shadow-xs">
        {/* Tricolor National Stripe */}
        <div className="gov-header-stripe" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Left: Emblem Crest & Mission Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#001428] text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs border border-[#0f2942] shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#001428] tracking-wide">
                Government of India
              </div>
              <div className="text-[10px] text-[#64748b] font-medium tracking-wide">
                Innovation Procurement Mission
              </div>
            </div>
          </div>

          {/* Right: Back to Public Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#001428] hover:text-[#045eb2] hover:bg-[#eff4ff] transition-colors cursor-pointer border border-[#e2e8f0] shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to SolutionBridge</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CENTERED AUTHENTICATION CARD */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-xl w-full">
          <div className="p-6 sm:p-8 bg-white border border-[#e2e8f0] rounded-lg shadow-sm">
            
            {/* Card Header */}
            <div className="pb-4 mb-5 border-b border-[#f1f5f9]">
              <h2 className="text-xl font-extrabold text-[#001428] tracking-tight">
                Sign in to SolutionBridge
              </h2>
              <p className="text-xs text-[#64748b] mt-1">
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
          <p className="text-[#43474d] leading-relaxed">
            Enter your official registered email address. Password reset instructions will be dispatched to your nodal address or security administrator.
          </p>
          <div>
            <label className="block font-bold text-[#001428] uppercase mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. dir.innovate@gov.in"
              className="w-full px-3 py-2 border border-[#cbd5e1] rounded-md text-[#001428] bg-white focus:ring-2 focus:ring-[#045eb2] focus:outline-none"
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
        <div className="space-y-3.5 text-xs text-[#001428]">
          <div className="p-3 bg-[#f8f9ff] border border-[#e2e8f0] rounded-md space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#001428]">
              <Headphones className="w-4 h-4 text-[#045eb2]" />
              <span>Dedicated Stakeholder Support Desk</span>
            </div>
            <p className="text-[11px] text-[#43474d] leading-snug">
              For technical access issues, administrative provisioning, or DPIIT recognition validation, reach out to the project helpdesk.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Email: <strong className="text-[#045eb2]">support.innovate@gov.in</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Toll Free: <strong>1800-11-2026 (GovTech Desk)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Hours: <strong>09:30 AM – 06:00 PM IST (Mon–Fri)</strong></span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e2e8f0] flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsSupportModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#001428] text-[#8993a4] py-3 px-6 border-t border-[#0f2942] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © 2026 SolutionBridge. Innovation Procurement Mission, Government of India.
          </div>
          <div className="flex gap-4 text-[#8993a4]">
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
