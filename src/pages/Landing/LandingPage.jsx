import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroIllustration from '../../assets/hero-illustration.png';
import {
  Shield,
  Building2,
  Rocket,
  Award,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
  FileText,
  ClipboardCheck,
  Scale,
  Lock,
  Check,
  Sparkles,
  Layers,
  Search,
  Menu,
  X,
  Target,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll handler for anchor links
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoleNavigation = (roleKey) => {
    navigate('/login', { state: { role: roleKey } });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] font-sans flex flex-col selection:bg-[#d5e3fc] selection:text-[#001428]">
      
      {/* ========================================================================= */}
      {/* 1. GOVERNMENT-STYLE TOP HEADER & NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-xs">
        {/* Official Top National Banner Stripe */}
        <div className="gov-header-stripe" />

        {/* Main Branding & Navigation Header */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Indian Gov-style Emblem & SolutionBridge Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0f2942] text-[#89f5e7] flex items-center justify-center font-bold text-base shadow-xs border border-[#7991af]/30 shrink-0">
              <Shield className="w-4.5 h-4.5 text-[#89f5e7]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#001428] tracking-tight leading-none">
                  SolutionBridge
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#003971] border border-[#d5e3fc] uppercase tracking-wider">
                  National Portal
                </span>
              </div>
              <span className="text-[11px] text-[#43474d] font-medium tracking-wide mt-0.5">
                From Problems to Proven Public Solutions
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#43474d]">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#045eb2] transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-[#045eb2] transition-colors cursor-pointer py-1"
            >
              Portals
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#045eb2] transition-colors cursor-pointer py-1"
            >
              Platform Capabilities
            </button>
            <button
              onClick={() => scrollToSection('transparency')}
              className="hover:text-[#045eb2] transition-colors cursor-pointer py-1"
            >
              Governance & Audit
            </button>
          </nav>

          {/* Right: Login & Mobile Menu Action */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-[#eff4ff] border border-[#d5e3fc] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#003971]">
              <span className="w-2 h-2 rounded-full bg-[#0d9488] inline-block animate-pulse"></span>
              <span>NIC Cloud: Active</span>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2942] hover:bg-[#001428] text-white text-xs font-bold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#89f5e7]" />
              <span>Portal Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#43474d] hover:text-[#001428] hover:bg-[#eff4ff] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-medium shadow-md">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              About Platform
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              Stakeholders & Portals
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollToSection('pilots')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              Pilot Framework
            </button>
            <button
              onClick={() => scrollToSection('transparency')}
              className="block w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-slate-800"
            >
              Transparency & Governance
            </button>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 bg-blue-700 text-white font-bold text-center rounded-md"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative bg-white border-b border-[#e2e8f0] py-14 lg:py-20 overflow-hidden">
        {/* Subtle geometric government grid backdrop */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#001428_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Content (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Institutional pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff] border border-[#d5e3fc] text-[#003971] text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-[#045eb2] shrink-0" />
                <span>National Innovation Procurement & Sandbox Platform • GFR Rule 194</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#001428] tracking-tight leading-[1.15]">
                Bridging Public Sector Challenges with Proven Startup Innovation
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#43474d] leading-relaxed max-w-2xl font-normal">
                SolutionBridge connects government departments with DPIIT-recognized technology startups to identify, pilot in controlled sandboxes, empirically validate, and directly procure innovative solutions for real-world public infrastructure.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#0f2942] hover:bg-[#001428] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#89f5e7]" />
                  <span>Explore Government Challenges</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white hover:bg-[#eff4ff] text-[#0d1c2e] border border-[#c3c6ce] text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-[#045eb2]" />
                  <span>Register as DPIIT Startup</span>
                </button>
              </div>

              {/* Text link for Gov / Expert Login */}
              <div className="pt-1 flex items-center gap-2 text-xs font-medium text-[#74777e]">
                <span>Are you a Public Procurement Officer or Evaluator?</span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#045eb2] hover:text-[#003971] font-bold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Government / Expert Login</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Hero Image / Innovation Sandbox Graphic */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="relative w-full max-w-md xl:max-w-lg mx-auto">
                {/* Subtle ambient backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#045eb2]/10 via-[#0d9488]/10 to-transparent rounded-2xl blur-xl -z-10 pointer-events-none" />
                
                {/* Image Container with clean border & shadow */}
                <div className="relative overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-md p-2">
                  <img
                    src={heroIllustration}
                    alt="GovTech Innovation Ecosystem & Digital Sandbox Platform"
                    className="w-full h-auto object-contain rounded-lg"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRUST / PLATFORM STRIP */}
      {/* ========================================================================= */}
      <section className="bg-[#eff4ff] border-b border-[#d5e3fc] py-6 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003971]">
              Built for transparent, empirical, and compliant public innovation
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Pillar 1 */}
            <div className="bg-white p-4 rounded-md border border-[#d5e3fc] shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#045eb2] flex items-center justify-center shrink-0 border border-[#d5e3fc]">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#001428] truncate">DPIIT Startup Ecosystem</div>
                <div className="text-[11px] text-[#74777e] truncate">Recognized Deep-Tech Innovators</div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-4 rounded-md border border-[#d5e3fc] shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#0f2942] flex items-center justify-center shrink-0 border border-[#d5e3fc]">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#001428] truncate">Government Departments</div>
                <div className="text-[11px] text-[#74777e] truncate">Central & State Procuring Entities</div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-4 rounded-md border border-[#d5e3fc] shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#4f46e5] flex items-center justify-center shrink-0 border border-[#d5e3fc]">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#001428] truncate">Independent Experts</div>
                <div className="text-[11px] text-[#74777e] truncate">Scientific & Evaluation Panels</div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-4 rounded-md border border-[#d5e3fc] shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#0d9488] flex items-center justify-center shrink-0 border border-[#d5e3fc]">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#001428] truncate">Evidence-Based Procurement</div>
                <div className="text-[11px] text-[#74777e] truncate">Verified Performance Audits</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW SOLUTIONBRIDGE WORKS (6-STEP LIFECYCLE) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-14 sm:py-18 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003971] bg-[#eff4ff] border border-[#d5e3fc] px-2.5 py-1 rounded shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-[#045eb2]" />
              <span>End-to-End Procurement Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001428] tracking-tight">
              From Problem to Procurement
            </h2>
            <p className="text-sm sm:text-base text-[#43474d] leading-relaxed">
              A structured six-step workflow ensuring administrative accountability, empirical verification, and direct procurement qualification for validated innovations.
            </p>
          </div>

          {/* 6-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#003971] bg-[#eff4ff] px-2.5 py-1 rounded border border-[#d5e3fc]">
                  01 — Define
                </span>
                <Target className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Problem Definition</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                Government departments identify real-world public sector challenges and define clear technical requirements, target KPIs, and allocated budgets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#002e29] bg-[#89f5e7]/40 px-2.5 py-1 rounded border border-[#0d9488]/30">
                  02 — Discover
                </span>
                <Rocket className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Startup Proposals</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                DPIIT-recognized startups discover relevant challenges, verify eligibility criteria, and submit detailed technical proposals and milestone plans.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#312e81] bg-[#e0e7ff] px-2.5 py-1 rounded border border-[#c7d2fe]">
                  03 — Evaluate
                </span>
                <Award className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Expert Scoring</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                Independent technical panels evaluate proposals using a weighted 5-factor scorecard (Feasibility, Innovation, Cost, Scale, Risk) to shortlist top solutions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#78350f] bg-[#fef3c7] px-2.5 py-1 rounded border border-[#fde68a]">
                  04 — Pilot
                </span>
                <Zap className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Controlled Sandboxes</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                Selected startups deploy solutions in real-world facilities (e.g., reservoirs, hospitals, transit corridors) with real-time KPI telemetry monitoring.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#134e4a] bg-[#ccfbf1] px-2.5 py-1 rounded border border-[#99f6e4]">
                  05 — Validate
                </span>
                <ShieldCheck className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Outcome Verification</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                Independent evaluators audit field test reports, verify actual metrics against historical baselines and target KPIs, and submit validation sign-offs.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-6 border border-[#e2e8f0] rounded-md hover:border-[#045eb2] transition-colors shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-[#003971] bg-[#eff4ff] px-2.5 py-1 rounded border border-[#d5e3fc]">
                  06 — Procure
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#74777e]" />
              </div>
              <h3 className="text-base font-bold text-[#001428] mb-2">Procurement & Scale</h3>
              <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                Successfully validated solutions receive Direct Procurement Orders (DPO) under tender exemption rules with automated milestone treasury disbursements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ROLE-BASED ENTRY SECTION */}
      {/* ========================================================================= */}
      <section id="stakeholders" className="py-14 sm:py-18 bg-[#f8f9ff] border-b border-[#e2e8f0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#43474d] bg-white border border-[#e2e8f0] px-2.5 py-1 rounded shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-[#045eb2]" />
              <span>Role-Tailored Workspaces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001428] tracking-tight">
              Built for Every Stakeholder
            </h2>
            <p className="text-sm sm:text-base text-[#43474d] leading-relaxed">
              Purpose-built interfaces tailored to the distinct workflows of government officers, startup founders, and technical evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Role 1: Government */}
            <div className="bg-white p-6 sm:p-8 border border-[#e2e8f0] rounded-lg flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#0f2942] text-white flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-6 h-6 text-[#89f5e7]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#045eb2]">Procuring Entity</span>
                  <h3 className="text-lg font-bold text-[#001428] mt-0.5">Government Departments</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  Identify challenges, evaluate proposals, run sandboxed pilots, and procure proven innovations through structured public workflows.
                </p>
                <div className="pt-2 border-t border-[#eff4ff] space-y-2 text-xs text-[#0d1c2e]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#045eb2] shrink-0" />
                    <span>Publish departmental problem statements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#045eb2] shrink-0" />
                    <span>Real-time sandbox telemetry & KPI tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#045eb2] shrink-0" />
                    <span>Direct Procurement Order (DPO) issuance</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Government')}
                  className="w-full py-2.5 px-4 rounded-md bg-[#0f2942] hover:bg-[#001428] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Government Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role 2: Startups */}
            <div className="bg-white p-6 sm:p-8 border-2 border-[#045eb2]/40 rounded-lg flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#eff4ff] text-[#003971] border border-[#d5e3fc] rounded">
                  Open Submissions
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#045eb2] text-white flex items-center justify-center font-bold shadow-xs">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#045eb2]">DPIIT Innovators</span>
                  <h3 className="text-lg font-bold text-[#001428] mt-0.5">Startups & Innovators</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  Discover public-sector challenges and bring innovative technology into real-world deployment with transparent milestone disbursements.
                </p>
                <div className="pt-2 border-t border-[#eff4ff] space-y-2 text-xs text-[#0d1c2e]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                    <span>Browse sector-wise government challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                    <span>Submit DPRs & upload field pilot evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                    <span>Automated milestone treasury disbursements</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="w-full py-2.5 px-4 rounded-md bg-[#045eb2] hover:bg-[#003971] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Explore Challenges</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role 3: Experts */}
            <div className="bg-white p-6 sm:p-8 border border-[#e2e8f0] rounded-lg flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4f46e5]">Technical Screening</span>
                  <h3 className="text-lg font-bold text-[#001428] mt-0.5">Expert Evaluators</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  Provide independent technical evaluation and validate pilot outcomes with rigorous scientific and operational scorecards.
                </p>
                <div className="pt-2 border-t border-[#eff4ff] space-y-2 text-xs text-[#0d1c2e]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
                    <span>5-factor weighted technical evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
                    <span>NABL lab test & telemetry verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
                    <span>Independent sign-off for DPO eligibility</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Expert / Evaluator')}
                  className="w-full py-2.5 px-4 rounded-md bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Expert Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FEATURE / VALUE SECTION */}
      {/* ========================================================================= */}
      <section id="features" className="py-14 sm:py-18 bg-[#f8f9ff] border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#045eb2] bg-[#eff4ff] border border-[#d5e3fc] px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered for Integrity & Speed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001428] tracking-tight">
              Why SolutionBridge?
            </h2>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              Designed specifically to resolve the institutional bottlenecks of government technology procurement while upholding public finance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#045eb2]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#eff4ff] text-[#045eb2] flex items-center justify-center mb-4 border border-[#d5e3fc]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Structured Problem Statements
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Standardized challenge definitions with operational boundaries, target metrics, and defined pilot funding caps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#0d9488]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center mb-4 border border-[#ccfbf1]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Rule-Based Startup Eligibility
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Automated screening on DPIIT recognition, prototype readiness (TRL-7+), and compliance certifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#4f46e5]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center mb-4 border border-[#e0e7ff]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Weighted Expert Evaluation
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Standardized 10-point scoring matrix spanning technical feasibility, innovation, cost-benefit, and risk mitigation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#d97706]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#fffbeb] text-[#d97706] flex items-center justify-center mb-4 border border-[#fef3c7]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Pilot KPI Monitoring
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Continuous telemetry, sensor uptime tracking, and milestone-linked evidence validation in real field conditions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#0d9488]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center mb-4 border border-[#ccfbf1]">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Independent Validation
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Third-party scientific and audit committee validation comparing baseline vs actual measured performance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white border border-[#e2e8f0] rounded-lg shadow-xs hover:border-[#045eb2]/40 transition-colors">
              <div className="w-10 h-10 rounded-md bg-[#eff4ff] text-[#045eb2] flex items-center justify-center mb-4 border border-[#d5e3fc]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#001428] mb-1.5">
                Transparent Procurement Workflow
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Legitimate tender exemption qualification, Direct Procurement Orders (DPO), and automated milestone disbursements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TRANSPARENCY SECTION */}
      {/* ========================================================================= */}
      <section id="transparency" className="py-14 sm:py-18 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#43474d] bg-[#f8f9ff] border border-[#e2e8f0] px-2.5 py-1 rounded shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#045eb2]" />
              <span>Institutional Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001428] tracking-tight">
              Transparent by Design
            </h2>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              Every phase of the innovation lifecycle creates an immutable, verifiable public record—protecting public funds while accelerating adoption.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Principle 1 */}
            <div className="p-5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#045eb2] flex items-center justify-center font-bold mb-3 border border-[#d5e3fc]">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#001428] mb-1">
                Defined Evaluation Criteria
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Pre-published evaluation parameters and scoring weights published alongside the challenge notice.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center font-bold mb-3 border border-[#e0e7ff]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#001428] mb-1">
                Independent Expert Review
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Multi-member scientific panels evaluate proposals with blind grading and conflict disclosures.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center font-bold mb-3 border border-[#ccfbf1]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#001428] mb-1">
                Evidence-Backed Validation
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Physical test reports, NABL certificates, and automated IoT telemetry logs uploaded to the portal.
              </p>
            </div>

            {/* Principle 4 */}
            <div className="p-5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg">
              <div className="w-8 h-8 rounded bg-[#eff4ff] text-[#001428] flex items-center justify-center font-bold mb-3 border border-[#d5e3fc]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#001428] mb-1">
                Traceable Procurement Workflow
              </h3>
              <p className="text-xs text-[#43474d] leading-relaxed">
                Complete audit log from problem submission to milestone disbursement under public financial norms.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CALL TO ACTION SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[#001428] text-white py-14 sm:py-16 border-b border-[#0f2942]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2942] border border-[#045eb2]/40 text-[#89f5e7] text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Accelerating Public Sector Innovation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Have a Government Problem to Solve?
          </h2>

          <p className="text-xs sm:text-sm text-[#d5e3fc] max-w-2xl mx-auto leading-relaxed font-normal">
            Bring the challenge to the innovation ecosystem and discover solutions that can be tested, validated, and scaled across state and national infrastructure.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => handleRoleNavigation('Startup')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#045eb2] hover:bg-[#034a8f] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleRoleNavigation('Startup')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#0f2942] hover:bg-[#163859] text-white border border-[#045eb2]/50 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-[#89f5e7]" />
              <span>Startup Registration</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-[#8993a4]">
            Government departments can publish challenges directly from the{' '}
            <button
              onClick={() => handleRoleNavigation('Government')}
              className="text-[#89f5e7] hover:underline font-semibold cursor-pointer"
            >
              Government Portal
            </button>
            .
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. GOVERNMENT PORTAL FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#001428] text-[#8993a4] text-xs border-t border-[#0f2942]">
        
        {/* Tricolor stripe on top of footer */}
        <div className="gov-header-stripe" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Brand Column (2 cols wide on desktop) */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#045eb2] flex items-center justify-center font-bold text-white shadow-xs">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white tracking-wide block">
                    SolutionBridge
                  </span>
                  <span className="text-[10px] text-[#d5e3fc]/70 font-medium">
                    From Problems to Proven Solutions
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#8993a4] leading-relaxed max-w-sm">
                National Innovation Procurement Platform facilitating problem definition, sandbox testing, independent validation, and direct procurement for DPIIT-recognized startups.
              </p>

              <div className="text-[11px] text-[#8993a4] space-y-1">
                <div className="font-medium text-[#d5e3fc]">Innovation Procurement Mission</div>
                <div>Government of India</div>
              </div>
            </div>

            {/* Column: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleRoleNavigation('Startup')} className="hover:text-white transition-colors cursor-pointer">
                    Challenges
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleNavigation('Startup')} className="hover:text-white transition-colors cursor-pointer">
                    Startups
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleNavigation('Expert / Evaluator')} className="hover:text-white transition-colors cursor-pointer">
                    Experts
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* Column: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => scrollToSection('transparency')} className="hover:text-white transition-colors cursor-pointer">
                    Guidelines
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">
                    Evaluation Framework
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pilots')} className="hover:text-white transition-colors cursor-pointer">
                    Pilot Framework
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('stakeholders')} className="hover:text-white transition-colors cursor-pointer">
                    Procurement Rules
                  </button>
                </li>
              </ul>
            </div>

            {/* Column: Support & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Support & Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#help" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="hover:text-white transition-colors">
                    Contact Officers
                  </a>
                </li>
                <li>
                  <span className="text-[#64748b]">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-[#64748b]">Terms of Use</span>
                </li>
                <li>
                  <span className="text-[#64748b]">Accessibility</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-10 pt-6 border-t border-[#0f2942] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8993a4]">
            <div>
              © 2026 SolutionBridge. Innovation Procurement Platform.
            </div>
            <div className="flex items-center gap-4 text-[#8993a4]">
              <span>Standard Public Procurement Protocol</span>
              <span>•</span>
              <span>GovCloud Secure Node</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
