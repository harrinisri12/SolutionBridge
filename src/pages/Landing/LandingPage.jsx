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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* ========================================================================= */}
      {/* 1. GOVERNMENT-STYLE TOP HEADER & NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        {/* Tricolor National Stripe */}
        <div className="gov-header-stripe" />

        {/* Main Branding & Navigation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Indian Gov-style Emblem & SolutionBridge Brand */}
          <div className="flex items-center gap-3.5">
            {/* National Emblem Inspired Geometric Crest */}
            <div className="w-10 h-10 rounded-md bg-slate-900 text-amber-400 flex items-center justify-center font-serif font-bold text-lg shadow-sm border border-slate-800 shrink-0">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-none">
                  SolutionBridge
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                  GovTech Mission
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium tracking-wide mt-0.5">
                From Problems to Proven Solutions
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Stakeholders
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollToSection('pilots')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Pilot Framework
            </button>
            <button
              onClick={() => scrollToSection('transparency')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Transparency
            </button>
          </nav>

          {/* Right: Login & Mobile Menu Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
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
      <section className="relative bg-white border-b border-slate-200 py-12 lg:py-16 overflow-hidden">
        {/* Subtle geometric government grid backdrop */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Content (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Institutional pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>National Innovation Procurement & Sandbox Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                Bridging Government Problems with Proven Innovation
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                SolutionBridge connects government departments with DPIIT-recognized technology startups to identify, test, validate, and procure innovative solutions for real-world public challenges.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Government Challenges</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-slate-600" />
                  <span>Register as Startup</span>
                </button>
              </div>

              {/* Text link for Gov / Expert Login */}
              <div className="pt-1 flex items-center gap-2 text-xs font-medium text-slate-600">
                <span>Are you a Public Officer or Evaluator?</span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-700 hover:text-blue-900 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Government / Expert Login</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Hero Image / Innovation Sandbox Graphic (Hidden on small/medium screens to prevent moving down, scales dynamically on desktop) */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="relative w-full max-w-md xl:max-w-lg mx-auto transition-all duration-300">
                {/* Subtle ambient backdrop glow */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-transparent rounded-2xl blur-xl -z-10 pointer-events-none" />
                
                {/* Image Container with clean border & shadow */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg p-2 group hover:shadow-xl transition-all duration-300">
                  <img
                    src={heroIllustration}
                    alt="GovTech Innovation Ecosystem & Digital Sandbox Platform"
                    className="w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
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
      <section className="bg-slate-100 border-b border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Built for transparent, evidence-based public innovation
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Pillar 1 */}
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                <Rocket className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">DPIIT Startup Ecosystem</div>
                <div className="text-[11px] text-slate-500 truncate">Recognized Deep-Tech Innovators</div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Government Departments</div>
                <div className="text-[11px] text-slate-500 truncate">Central & State Procuring Entities</div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Independent Experts</div>
                <div className="text-[11px] text-slate-500 truncate">Scientific & Evaluation Panels</div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-4 rounded-md border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Evidence-Based Procurement</div>
                <div className="text-[11px] text-slate-500 truncate">Verified Performance Audits</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW SOLUTIONBRIDGE WORKS (6-STEP LIFECYCLE) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>End-to-End Procurement Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              From Problem to Procurement
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A structured six-step workflow ensuring accountability, empirical verification, and direct procurement qualification for validated innovations.
            </p>
          </div>

          {/* 6-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                  01 — Define
                </span>
                <Target className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Problem Definition</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Government departments identify real-world public sector challenges and define clear technical requirements, target KPIs, and allocated budgets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  02 — Discover
                </span>
                <Rocket className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Startup Proposals</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                DPIIT-recognized startups discover relevant challenges, verify eligibility criteria, and submit detailed technical proposals and milestone plans.
              </p>
            </div>

            {/* Step 3 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-100">
                  03 — Evaluate
                </span>
                <Award className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Expert Scoring</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Independent technical panels evaluate proposals using a weighted 5-factor scorecard (Feasibility, Innovation, Cost, Scale, Risk) to shortlist top solutions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
                  04 — Pilot
                </span>
                <Zap className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Controlled Sandboxes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selected startups deploy solutions in real-world facilities (e.g., reservoirs, hospitals, transit corridors) with real-time KPI telemetry monitoring.
              </p>
            </div>

            {/* Step 5 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-100">
                  05 — Validate
                </span>
                <ShieldCheck className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Outcome Verification</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Independent evaluators audit field test reports, verify actual metrics against historical baselines and target KPIs, and submit validation sign-offs.
              </p>
            </div>

            {/* Step 6 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                  06 — Procure
                </span>
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Procurement & Scale</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Successfully validated solutions receive Direct Procurement Orders (DPO) under tender exemption rules with automated milestone treasury disbursements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ROLE-BASED ENTRY SECTION */}
      {/* ========================================================================= */}
      <section id="stakeholders" className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Role-Tailored Workspaces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Built for Every Stakeholder
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Purpose-built interfaces tailored to the distinct workflows of government officers, startup founders, and technical evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Role 1: Government */}
            <div className="gov-card p-6 sm:p-8 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Procuring Entity</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Government Departments</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Identify challenges, evaluate solutions, run sandboxed pilots, and procure proven innovations through structured public workflows.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Publish departmental problem statements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Real-time sandbox telemetry & KPI tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Direct Procurement Order (DPO) issuance</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Government')}
                  className="w-full py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Government Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role 2: Startups */}
            <div className="gov-card p-6 sm:p-8 bg-white border-2 border-blue-600/30 rounded-lg flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Open Submissions
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">DPIIT Innovators</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Startups & Innovators</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Discover public-sector challenges and bring innovative technology into real-world deployment with transparent milestone disbursements.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Browse sector-wise government challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Submit DPRs & upload field pilot evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Automated milestone treasury disbursements</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Startup')}
                  className="w-full py-2.5 px-4 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Explore Challenges</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role 3: Experts */}
            <div className="gov-card p-6 sm:p-8 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-2xs hover:shadow-sm transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Technical Screening</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Expert Evaluators</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Provide independent technical evaluation and validate pilot outcomes with rigorous scientific and operational scorecards.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>5-factor weighted technical evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>NABL lab test & telemetry verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Independent sign-off for DPO eligibility</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleNavigation('Expert / Evaluator')}
                  className="w-full py-2.5 px-4 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
      <section id="features" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered for Integrity & Speed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Why SolutionBridge?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Designed specifically to resolve the institutional bottlenecks of government technology procurement while upholding public finance standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Structured Problem Statements
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized challenge definitions with operational boundaries, target metrics, and defined pilot funding caps.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Rule-Based Startup Eligibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated screening on DPIIT recognition, prototype readiness (TRL-7+), and compliance certifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center mb-4 border border-purple-100">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Weighted Expert Evaluation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized 10-point scoring matrix spanning technical feasibility, innovation, cost-benefit, and risk mitigation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mb-4 border border-amber-100">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Pilot KPI Monitoring
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous telemetry, sensor uptime tracking, and milestone-linked evidence validation in real field conditions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center mb-4 border border-teal-100">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Independent Validation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Third-party scientific and audit committee validation comparing baseline vs actual measured performance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="gov-card p-6 bg-white border border-slate-200 rounded-lg">
              <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-4 border border-blue-100">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                Transparent Procurement Workflow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Legitimate tender exemption qualification, Direct Procurement Orders (DPO), and automated milestone disbursements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TRANSPARENCY SECTION */}
      {/* ========================================================================= */}
      <section id="transparency" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Institutional Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Transparent by Design
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every phase of the innovation lifecycle creates an immutable, verifiable public record—protecting public funds while accelerating adoption.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 4 Transparency Principles (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Principle 1 */}
              <div className="gov-card p-5 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3 border border-blue-100">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Defined Evaluation Criteria
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pre-published evaluation parameters and scoring weights published alongside the challenge notice.
                </p>
              </div>

              {/* Principle 2 */}
              <div className="gov-card p-5 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3 border border-purple-100">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Independent Expert Review
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-member scientific panels evaluate proposals with blind grading and conflict disclosures.
                </p>
              </div>

              {/* Principle 3 */}
              <div className="gov-card p-5 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 border border-emerald-100">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Evidence-Backed Validation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Physical test reports, NABL certificates, and automated IoT telemetry logs uploaded to the portal.
                </p>
              </div>

              {/* Principle 4 */}
              <div className="gov-card p-5 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-3 border border-slate-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  Traceable Procurement Workflow
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete audit log from problem submission to milestone disbursement under public financial norms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CALL TO ACTION SECTION */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-14 sm:py-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5" />
            <span>Accelerating Public Sector Innovation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Have a Government Problem to Solve?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Bring the challenge to the innovation ecosystem and discover solutions that can be tested, validated, and scaled across state and national infrastructure.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => handleRoleNavigation('Startup')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleRoleNavigation('Startup')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>Startup Registration</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Government departments can publish challenges directly from the{' '}
            <button
              onClick={() => handleRoleNavigation('Government')}
              className="text-blue-400 hover:text-blue-300 underline font-semibold cursor-pointer"
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
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        
        {/* Tricolor stripe on top of footer */}
        <div className="gov-header-stripe" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Brand Column (2 cols wide on desktop) */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center font-bold text-white shadow-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white tracking-wide block">
                    SolutionBridge
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    From Problems to Proven Solutions
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                National Innovation Procurement Platform facilitating problem definition, sandbox testing, independent validation, and direct procurement for DPIIT-recognized startups.
              </p>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Innovation Procurement Mission</div>
                <div>Government of India</div>
              </div>
            </div>

            {/* Column: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
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
                  <span className="text-slate-500">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-slate-500">Terms of Use</span>
                </li>
                <li>
                  <span className="text-slate-500">Accessibility</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 SolutionBridge. Innovation Procurement Platform.
            </div>
            <div className="flex items-center gap-4 text-slate-500">
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
