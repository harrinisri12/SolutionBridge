import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/Common/PortalLayout';
import LoginPage from '../pages/Auth/LoginPage';
import LandingPage from '../pages/Landing/LandingPage';

// Government Pages (5 Strict Divisions)
import GovOverview from '../pages/Government/GovOverview';
import GovChallenges from '../pages/Government/GovChallenges';
import GovApplications from '../pages/Government/GovApplications';
import GovPilots from '../pages/Government/GovPilots';
import GovProcurement from '../pages/Government/GovProcurement';

// Startup Pages (4 Strict Divisions)
import StartupOverview from '../pages/Startup/StartupOverview';
import StartupChallenges from '../pages/Startup/StartupChallenges';
import StartupPilot from '../pages/Startup/StartupPilot';
import StartupPayments from '../pages/Startup/StartupPayments';

// Expert Pages (3 Strict Divisions)
import ExpertOverview from '../pages/Expert/ExpertOverview';
import ExpertEvaluation from '../pages/Expert/ExpertEvaluation';
import ExpertValidation from '../pages/Expert/ExpertValidation';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Authentication */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 1. GOVERNMENT PORTAL (5 Divisions) */}
      <Route element={<PortalLayout />}>
        <Route path="/gov/overview" element={<GovOverview />} />
        <Route path="/gov/dashboard" element={<Navigate to="/gov/overview" replace />} />
        <Route path="/gov/challenges" element={<GovChallenges />} />
        <Route path="/gov/applications" element={<GovApplications />} />
        <Route path="/gov/pilots" element={<GovPilots />} />
        <Route path="/gov/procurement" element={<GovProcurement />} />
        {/* Aliases for compatibility */}
        <Route path="/gov/screening" element={<Navigate to="/gov/applications" replace />} />
        <Route path="/gov/ranking" element={<Navigate to="/gov/applications" replace />} />
        <Route path="/gov/kpis" element={<Navigate to="/gov/pilots" replace />} />
        <Route path="/gov/validation" element={<Navigate to="/gov/pilots" replace />} />
        <Route path="/gov/contracts" element={<Navigate to="/gov/procurement" replace />} />
        <Route path="/gov/payments" element={<Navigate to="/gov/procurement" replace />} />
        <Route path="/gov/scale-up" element={<Navigate to="/gov/procurement" replace />} />
        <Route path="/gov/reports" element={<Navigate to="/gov/procurement" replace />} />
      </Route>

      {/* 2. STARTUP PORTAL (4 Divisions) */}
      <Route element={<PortalLayout />}>
        <Route path="/startup/overview" element={<StartupOverview />} />
        <Route path="/startup/dashboard" element={<Navigate to="/startup/overview" replace />} />
        <Route path="/startup/challenges" element={<StartupChallenges />} />
        <Route path="/startup/pilot" element={<StartupPilot />} />
        <Route path="/startup/my-pilot" element={<Navigate to="/startup/pilot" replace />} />
        <Route path="/startup/pilots" element={<Navigate to="/startup/pilot" replace />} />
        <Route path="/startup/payments" element={<StartupPayments />} />
        <Route path="/startup/applications" element={<Navigate to="/startup/payments" replace />} />
      </Route>

      {/* 3. EXPERT / EVALUATOR PORTAL (3 Divisions) */}
      <Route element={<PortalLayout />}>
        <Route path="/expert/overview" element={<ExpertOverview />} />
        <Route path="/expert/dashboard" element={<Navigate to="/expert/overview" replace />} />
        <Route path="/expert/evaluation" element={<ExpertEvaluation />} />
        <Route path="/expert/evaluations" element={<Navigate to="/expert/evaluation" replace />} />
        <Route path="/expert/validation" element={<ExpertValidation />} />
      </Route>

      {/* Fallback to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
