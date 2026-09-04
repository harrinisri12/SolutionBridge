import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

        {/* Top Institutional Identity Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>National Innovation Procurement Sandbox & Marketplace</span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="hidden md:inline text-slate-400">DPIIT & Public Sector Innovation Mission</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="hidden sm:inline">GovCloud Secure Gateway</span>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Lock className="w-3 h-3" />
                Officer & Evaluator Portal
              </button>
            </div>
          </div>
        </div>

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

              {/* Key Highlights Metrics */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg">
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Evidence-Based</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">TRL 7+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Field Prototypes</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">Direct</div>
                  <div className="text-[11px] text-slate-500 font-medium">Procurement Path</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Architecture Flowchart (Right 5 Cols) */}
            <div className="lg:col-span-5">
              <div className="gov-card p-5 sm:p-6 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 shadow-md">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Innovation Lifecycle Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    6-Stage Pipeline
                  </span>
                </div>

                {/* Abstract Connected Pipeline Steps */}
                <div className="mt-4 space-y-2.5">
                  
                  {/* Step 1 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <div className="w-7 h-7 rounded bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">01. Government Problem</div>
                      <div className="text-[10px] text-slate-400 truncate">Department defines operational KPIs & budget bounds</div>
                    </div>
                    <span className="text-[9px] font-semibold text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded">Defined</span>
                  </div>

                  {/* Connecting vector */}
                  <div className="w-px h-2 bg-slate-700 ml-6" />

                  {/* Step 2 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <div className="w-7 h-7 rounded bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Rocket className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">02. Startup Solution</div>
                      <div className="text-[10px] text-slate-400 truncate">DPIIT startups submit technical DPR & prototype logs</div>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">Screened</span>
                  </div>

                  {/* Connecting vector */}
                  <div className="w-px h-2 bg-slate-700 ml-6" />

                  {/* Step 3 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <div className="w-7 h-7 rounded bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">03. Expert Evaluation</div>
                      <div className="text-[10px] text-slate-400 truncate">Domain specialists evaluate on 5-factor scorecard</div>
                    </div>
                    <span className="text-[9px] font-semibold text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded">Scored</span>
                  </div>

                  {/* Connecting vector */}
                  <div className="w-px h-2 bg-slate-700 ml-6" />

                  {/* Step 4 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <div className="w-7 h-7 rounded bg-amber-600/30 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">04. Controlled Pilot</div>
                      <div className="text-[10px] text-slate-400 truncate">Real-world trials with telemetry & evidence capture</div>
                    </div>
                    <span className="text-[9px] font-semibold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded">Telemetry</span>
                  </div>

                  {/* Connecting vector */}
                  <div className="w-px h-2 bg-slate-700 ml-6" />

                  {/* Step 5 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/80 border border-slate-700/60">
                    <div className="w-7 h-7 rounded bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">05. Independent Validation</div>
                      <div className="text-[10px] text-slate-400 truncate">Baseline vs actual outcome verification audit</div>
                    </div>
                    <span className="text-[9px] font-semibold text-teal-300 bg-teal-950 px-1.5 py-0.5 rounded">Audited</span>
                  </div>

                  {/* Connecting vector */}
                  <div className="w-px h-2 bg-slate-700 ml-6" />

                  {/* Step 6 */}
                  <div className="flex items-center gap-3 p-2.5 rounded bg-slate-800/90 border border-emerald-600/50">
                    <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-emerald-300 truncate">06. Procurement & Scale-up</div>
                      <div className="text-[10px] text-slate-300 truncate">Direct Procurement Order (DPO) & milestone release</div>
                    </div>
                    <span className="text-[9px] font-bold text-white bg-emerald-700 px-1.5 py-0.5 rounded">DPO Issued</span>
                  </div>

                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Standardized Public Innovation Protocol</span>
                  <span className="text-blue-400 font-semibold">Tender Exemption Ready</span>
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
      {/* 4. THE PROBLEM SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              <Scale className="w-3.5 h-3.5" />
              <span>Addressing the Public Procurement Gap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Government Problems Need Proven Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Government departments face complex operational and technology challenges, while innovative startups have breakthrough solutions but lack a structured, risk-mitigated pathway to public sector deployment.
            </p>
          </div>

          {/* Two Balanced Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Column 1: Government Needs */}
            <div className="gov-card p-6 sm:p-8 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
                  <div className="w-9 h-9 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Government Needs</h3>
                    <p className="text-xs text-slate-500">Public administration & infrastructure demands</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Real-World Problem Identification:</strong> Clear articulation of public pain points.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Technical Requirements & KPIs:</strong> Predefined operational benchmarks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Measurable Milestones:</strong> Phased execution with verifiable deliverables.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Sandboxed Pilot Deployment:</strong> Controlled trials to mitigate fiscal risk.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Transparent Evaluation:</strong> Objective scorecards free from subjective bias.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
                SolutionBridge provides the regulatory sandboxing needed to test before large-scale purchase.
              </div>
            </div>

            {/* Column 2: Startup Capabilities */}
            <div className="gov-card p-6 sm:p-8 bg-blue-50/40 border border-blue-200/80 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-blue-200/80 mb-5">
                  <div className="w-9 h-9 rounded bg-blue-700 text-white flex items-center justify-center font-bold">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Startup Capabilities</h3>
                    <p className="text-xs text-slate-500">Deep-tech innovation & agile deployment</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Innovative Deep-Tech:</strong> Breakthrough AI, IoT, robotics, and clean-tech solutions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Domain Expertise & Agility:</strong> Specialized technical knowledge and rapid adaptation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Rapid Prototyping:</strong> Fast iterations tailored to specific department constraints.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Field Deployment Readiness:</strong> TRL-7+ mature systems ready for live operational trials.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Scalable Architecture:</strong> High-efficiency solutions built for statewide scale.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200 text-xs text-slate-500">
                Startups receive a legitimate, merit-based entry into public sector contracts.
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
      {/* 8. EVIDENCE-BASED PILOT SECTION */}
      {/* ========================================================================= */}
      <section id="pilots" className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                <Zap className="w-3.5 h-3.5" />
                <span>Empirical Verification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Test. Measure. Validate.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Selected startups demonstrate their solutions through controlled pilot deployments. Baseline performance, target KPIs, telemetry, milestones, and evidence are tracked throughout the pilot.
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No procurement decision on slide presentations alone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real field telemetry captured from municipal sensors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pre-trial baseline vs post-pilot actual outcome benchmarking</span>
                </div>
              </div>
            </div>

            {/* Right KPI Visualization Matrix */}
            <div className="lg:col-span-7">
              <div className="gov-card p-5 sm:p-6 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-md">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
                      Sample Sandbox KPI Matrix
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Empirical verification comparison table
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Audit Status: VALIDATED
                  </span>
                </div>

                {/* KPI Comparison Rows */}
                <div className="mt-4 space-y-3">
                  
                  {/* Metric 1 */}
                  <div className="bg-slate-800/80 p-3 rounded-md border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-200">Response Time / Detection Latency</span>
                      <span className="text-emerald-400 font-mono text-[11px]">8.5 min (Target: &lt;15 min)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-slate-500">Baseline</span>
                        <span className="text-slate-300 font-bold">48 Hours</span>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-blue-400">Target Benchmark</span>
                        <span className="text-blue-300 font-bold">15.0 Minutes</span>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-700/40 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-emerald-400 font-bold">Actual Validated</span>
                        <span className="text-emerald-300 font-bold">8.5 Minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-slate-800/80 p-3 rounded-md border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-200">System Telemetry Uptime</span>
                      <span className="text-emerald-400 font-mono text-[11px]">99.6% (Target: &gt;99.0%)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-slate-500">Baseline</span>
                        <span className="text-slate-300 font-bold">75.0%</span>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-blue-400">Target Benchmark</span>
                        <span className="text-blue-300 font-bold">99.0%</span>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-700/40 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-emerald-400 font-bold">Actual Validated</span>
                        <span className="text-emerald-300 font-bold">99.6%</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-slate-800/80 p-3 rounded-md border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-200">Operational Accuracy vs NABL Lab</span>
                      <span className="text-emerald-400 font-mono text-[11px]">94.2% (Target: &gt;90.0%)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-slate-500">Baseline</span>
                        <span className="text-slate-300 font-bold">60.0%</span>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-blue-400">Target Benchmark</span>
                        <span className="text-blue-300 font-bold">90.0%</span>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-700/40 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-emerald-400 font-bold">Actual Validated</span>
                        <span className="text-emerald-300 font-bold">94.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-slate-800/80 p-3 rounded-md border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-200">Manual Testing Cost Reduction</span>
                      <span className="text-emerald-400 font-mono text-[11px]">38.5% (Target: &gt;30.0%)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-slate-500">Baseline</span>
                        <span className="text-slate-300 font-bold">0.0%</span>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-blue-400">Target Benchmark</span>
                        <span className="text-blue-300 font-bold">30.0%</span>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-700/40 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-emerald-400 font-bold">Actual Validated</span>
                        <span className="text-emerald-300 font-bold">38.5%</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                  *Illustrative sandbox evaluation model verifying compliance prior to Direct Procurement.
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TRANSPARENCY SECTION */}
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

            {/* Audit Log / Verification Visual (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="gov-card p-5 bg-white border border-slate-300 rounded-lg shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Audit & Compliance Trail</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Verifiable Record
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs font-mono text-slate-700">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Challenge CH-2026-001 Sanctioned</span>
                      <p className="text-[10px] text-slate-500 font-sans">Water Resources Dept • Budget ₹85,00,000</p>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Proposal Evaluated (Score: 8.84/10)</span>
                      <p className="text-[10px] text-slate-500 font-sans">Evaluated by Dr. Ramesh Chandra (IIT Delhi Panel)</p>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Field Pilot Sign-off (KPIs 100% Passed)</span>
                      <p className="text-[10px] text-slate-500 font-sans">NABL Lab Assays & Telemetry Log Verified</p>
                    </div>
                  </div>

                  <div className="p-2 bg-emerald-50/70 rounded border border-emerald-300 flex items-start gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-950">Direct Procurement Order DPO Issued</span>
                      <p className="text-[10px] text-emerald-800 font-sans">Tender Exemption S.O. 4522 • Treasury Disbursed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Cryptographic Seal Active</span>
                  <span className="text-slate-700 font-semibold">NIC / GovCloud Audit Node</span>
                </div>
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
