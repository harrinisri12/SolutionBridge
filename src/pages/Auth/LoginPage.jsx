import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User, Building, Award, ClipboardCheck, CreditCard, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { setCurrentRole, addToast } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Government");
  const [email, setEmail] = useState("s.jenkins@health.gov");
  const [password, setPassword] = useState("••••••••");

  const roles = [
    { id: "Government", label: "Government Officer", icon: Building, email: "s.jenkins@health.gov", desc: "Publish challenges, approve contracts" },
    { id: "Startup", label: "Startup User", icon: User, email: "info@healthtech.com", desc: "Discover challenges, submit applications" },
    { id: "Expert", label: "Expert Evaluator", icon: Award, email: "r.chandra@nationalsci.org", desc: "Grade applications, run rankings" },
    { id: "Validator", label: "Independent Validator", icon: ClipboardCheck, email: "audit@independentvalidate.org", desc: "Verify and audit KPI results" },
    { id: "Finance", label: "Finance Officer", icon: CreditCard, email: "a.pendelton@finance.gov", desc: "Authorize milestone payouts" }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setEmail(role.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      addToast("Please enter an email address", "error");
      return;
    }
    
    // Set global context role
    setCurrentRole(selectedRole);
    addToast(`Successfully logged in as ${selectedRole}`, "success");

    // Route to dashboard
    if (selectedRole === "Government") navigate("/gov/dashboard");
    else if (selectedRole === "Startup") navigate("/startup/dashboard");
    else if (selectedRole === "Expert") navigate("/expert/dashboard");
    else if (selectedRole === "Validator") navigate("/validator/dashboard");
    else if (selectedRole === "Finance") navigate("/finance/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative select-none">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg mx-auto text-xl">
          SB
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          GovProcure
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500">
          Innovation Procurement Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Grid Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Select Portal Access Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleRoleSelect(r)}
                      className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all hover:bg-slate-50/80 ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-500/50" 
                          : "border-slate-200"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-bold ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                          {r.label}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                          {r.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Simulated Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-hidden focus:border-blue-600 transition-colors"
                placeholder="name@agency.gov"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-hidden focus:border-blue-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-900 font-semibold cursor-pointer">
                  Remember simulator credentials
                </label>
              </div>
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                Forgot password?
              </span>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                Access Simulation Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            Note: This is a **frontend-only secure prototype environment**. No data is sent to external servers. Use any password to log in.
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
