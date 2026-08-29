import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, ClipboardCheck, Award, Zap, Shield, Sparkles, Building2, Rocket, FileCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('government');

  const steps = [
    { num: "01", title: "Problem Definition", desc: "Government departments identify pressing public sector problems and publish them as Challenges with clear budgets and success metrics." },
    { num: "02", title: "Startup Discover & Apply", desc: "Startups browse open challenges and submit detailed implementation proposals and cost structures directly on the marketplace." },
    { num: "03", title: "Expert Grading", desc: "Independent scientific and domain experts evaluate proposals using weighted grading scorecards to ensure transparency." },
    { num: "04", title: "Pilot Run & Logs", desc: "Selected startups enter a contract and launch pilots. Key performance indicators (KPIs) are recorded continuously in real-time." },
    { num: "05", title: "Third-party Audit", desc: "Independent validators review baseline vs actual logs, verify outcome claims, and upload audit verification seals." },
    { num: "06", title: "Wider Scaling", desc: "Successful pilots with verified KPI achievements are selected for national scale-up, and payments are unlocked." }
  ];

  const lifecycleStages = [
    { title: "Define Challenges", icon: Target, desc: "Departments draft requirements, budgets, and targeted KPIs." },
    { title: "Evaluate Proposers", icon: Award, desc: "Panels score solutions based on cost, feasibility, and safety." },
    { title: "Deploy Pilots", icon: Zap, desc: "Integrate sandboxes in real-world facilities (clinics, transit hubs)." },
    { title: "Audit Evidence", icon: ClipboardCheck, desc: "Verify results through independent third-party assessors." },
    { title: "Scale Deployment", icon: FileCheck, desc: "Roll out successful solutions across the wider state." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 relative select-none">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-40 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-white shadow-xs">
            SB
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-slate-900">GovProcure</h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SolutionBridge</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-all cursor-pointer">
            Explore Marketplace
          </button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-sm font-semibold rounded-lg text-white shadow-xs transition-all cursor-pointer">
            Sign In to Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-8 lg:px-24 bg-gradient-to-b from-blue-900 to-indigo-950 text-white">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3.5 py-1 text-xs font-bold tracking-wide text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            National GovTech Innovation Pipeline
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Innovation Procurement Platform
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-200 tracking-wide">
            From Government Problem to Proven Innovation
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
            A state-of-the-art framework connecting government departments, startups, experts, and independent validators. Discover innovators, manage sandboxed pilots, track real-time KPIs, audit claims, and scale solutions with complete regulatory transparency.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                navigate('/login');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              Explore Challenges
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigate('/login');
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-bold rounded-xl cursor-pointer transition-all"
            >
              Register as Startup
            </button>
            <button
              onClick={() => {
                navigate('/login');
              }}
              className="px-6 py-3 bg-indigo-700/50 hover:bg-indigo-700/70 border border-indigo-500/30 text-sm font-bold rounded-xl cursor-pointer transition-all"
            >
              Government Login
            </button>
          </div>
        </div>
      </section>

      {/* Innovation Procurement Lifecycle */}
      <section className="py-16 px-8 lg:px-24 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-4">
          Innovation Procurement Lifecycle
        </h2>
        <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto mb-12">
          An end-to-end sandbox-to-procurement journey configured for institutional accountability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {lifecycleStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex flex-col gap-3 relative">
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-blue-50 border border-blue-200 shadow-xs flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-blue-600 uppercase font-extrabold tracking-wider leading-none">Stage 0{idx+1}</span>
                <h3 className="font-bold text-sm text-slate-800">{stage.title}</h3>
                <p className="text-xs text-slate-500 leading-normal">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-100 px-8 lg:px-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto mb-12">
            Follow the transparent workflow path from challenge launch to deployment decision.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span className="text-3xl font-black text-blue-600/30 leading-none mt-0.5">{step.num}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1.5">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Tabs */}
      <section className="py-16 px-8 lg:px-24 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-4">
          Stakeholder Gateways
        </h2>
        <p className="text-center text-sm text-slate-500 max-w-2xl mx-auto mb-12">
          Specific modules tailor-made for different participants in the procurement lifecycle.
        </p>

        {/* Tab Header */}
        <div className="flex flex-wrap justify-center border-b border-slate-200 mb-8">
          {[
            { id: 'government', label: 'Government Departments', icon: Building2 },
            { id: 'startups', label: 'Startups & Innovators', icon: Rocket },
            { id: 'experts', label: 'Subject Matter Experts', icon: Award },
            { id: 'validators', label: 'Independent Validators', icon: ClipboardCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 text-blue-700 bg-blue-50/20'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
          {activeTab === 'government' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal Features</span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">Modernize Public Infrastructure</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Government administrators can formalize operational bottlenecks into standardized challenges, configure rigorous KPIs with specified baselines, and review expert-scored rankings. Deploy active sandboxed trials without heavy administrative overhead.
                </p>
                <ul className="text-xs font-semibold text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">✓ Multi-stage interactive challenge wizards</li>
                  <li className="flex items-center gap-2">✓ Real-time baseline and actual metric comparisons</li>
                  <li className="flex items-center gap-2">✓ One-click contract audits and scale-up controls</li>
                </ul>
              </div>
              <div className="bg-blue-50/50 p-6 border border-blue-100 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interface Sneak-Peek</span>
                <div className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Triage Time Pilot</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200">Active</span>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between text-[10px] font-medium text-slate-500">
                      <span>Waiting Time (Baseline 120m)</span>
                      <span className="font-bold text-slate-800">Target: 80m | Act: 72m</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'startups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal Features</span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">Fast-Track Government Procurement</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Bypass traditional long-winded bidding cycles. Submit dynamic solutions to active agency challenges. Conduct controlled pilots in real public-sector operations, verify compliance, invoice milestones, and secure long-term scale-up contracts.
                </p>
                <ul className="text-xs font-semibold text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">✓ Structured multi-step application wizards</li>
                  <li className="flex items-center gap-2">✓ Document manager for certifications and audits</li>
                  <li className="flex items-center gap-2">✓ Milestone dashboard for immediate invoicing</li>
                </ul>
              </div>
              <div className="bg-emerald-50/50 p-6 border border-emerald-100 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interface Sneak-Peek</span>
                <div className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800">Invoicing Status</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Paid</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700 mt-1">
                    <span>Milestone 1: Equipment Deploy</span>
                    <span className="font-bold text-slate-900">$24,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal Features</span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">Unbiased Academic & Technical Review</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Grade incoming startup proposals using standardized matrices configured with specific weights for feasibility, cost, team capacity, and information security. Auto-calculate weighted scores to generate clean ranking logs.
                </p>
                <ul className="text-xs font-semibold text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">✓ Structured scorecards with automated backend sum-totals</li>
                  <li className="flex items-center gap-2">✓ Domain-isolated proposal routing lists</li>
                  <li className="flex items-center gap-2">✓ Direct recommendation toggles</li>
                </ul>
              </div>
              <div className="bg-purple-50/50 p-6 border border-purple-100 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interface Sneak-Peek</span>
                <div className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <span>Grading Matrix</span>
                    <span className="text-purple-700">87/100</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 space-y-1">
                    <div className="flex justify-between"><span>Tech Feasibility (20%)</span><span className="font-bold">90/100</span></div>
                    <div className="flex justify-between"><span>Cost Effect (15%)</span><span className="font-bold">80/100</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validators' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Portal Features</span>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">Independent Efficacy Auditing</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Ensure the integrity of procurement decisions. Third-party validators review raw evidence, compare startup claims with physical logs, and issue verification status markers.
                </p>
                <ul className="text-xs font-semibold text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">✓ Side-by-side claim verification panel</li>
                  <li className="flex items-center gap-2">✓ Mock audit documentation uploaders</li>
                  <li className="flex items-center gap-2">✓ Verified vs Not Verified status selectors</li>
                </ul>
              </div>
              <div className="bg-teal-50/50 p-6 border border-teal-100 rounded-xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interface Sneak-Peek</span>
                <div className="bg-white p-4 border border-slate-100 rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    <span>Audit Verdict</span>
                    <span className="text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded text-[10px]">Verified</span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    <div className="flex justify-between mt-1"><span>Startup Claimed</span><span className="font-bold">40% reduction</span></div>
                    <div className="flex justify-between"><span>Audited Reality</span><span className="font-bold">37% reduction</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Security and Transparency */}
      <section className="py-16 bg-slate-900 text-white px-8 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Security & Regulatory Transparency
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every transition—from application screening to expert evaluation scores and financial transactions—is recorded in the immutable platform system log. Ensure complete alignment with public financial guidelines and audit trails.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-extrabold text-blue-400">100%</span>
                <span className="text-xs text-slate-400">Audit trail compliance</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-extrabold text-blue-400">Real-time</span>
                <span className="text-xs text-slate-400">KPI verification</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider text-left">Live Simulator Log Feed</span>
            <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-300 text-left bg-slate-950 p-4 border border-slate-900 rounded-lg overflow-hidden h-36">
              <p className="text-emerald-400">{"[SECURE] Connected to local session engine."}</p>
              <p>{"[AUDIT] Govt Officer created Challenge CH-2026-001"}</p>
              <p>{"[AUDIT] Startup HealthTech Solutions applied. Proposals saved."}</p>
              <p className="text-blue-400">{"[AUDIT] Expert graded: 87/100 (Problem Understanding weight=15%)"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 px-8 text-center text-xs border-t border-slate-900">
        <p>© 2026 GovProcure Solutions. Powered by Google Antigravity IDE. All rights reserved.</p>
        <p className="mt-2 text-[10px] text-slate-600">Administered under National Procurement Sandbox Guideline No. 431/2026.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
