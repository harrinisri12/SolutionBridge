import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/Common/PortalLayout';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';

// Government Pages
import GovDashboard from '../pages/Government/GovDashboard';
import GovChallenges from '../pages/Government/GovChallenges';
import CreateChallenge from '../pages/Government/CreateChallenge';
import EligibilityScreen from '../pages/Government/EligibilityScreen';
import GovPilots from '../pages/Government/GovPilots';
import PilotCreator from '../pages/Government/PilotCreator';
import ContractAdmin from '../pages/Government/ContractAdmin';
import KpiTracker from '../pages/Government/KpiTracker';
import ScaleDecision from '../pages/Government/ScaleDecision';
import Reports from '../pages/Government/Reports';
import AuditTrail from '../pages/Government/AuditTrail';
import GovNotifications from '../pages/Government/GovNotifications';

// Startup Pages
import StartupDashboard from '../pages/Startup/StartupDashboard';
import ChallengeBrowse from '../pages/Startup/ChallengeBrowse';
import ApplicationForm from '../pages/Startup/ApplicationForm';
import ProfileSettings from '../pages/Startup/ProfileSettings';

// Expert Pages
import ExpertDashboard from '../pages/Expert/ExpertDashboard';
import EvaluationForm from '../pages/Expert/EvaluationForm';
import RankingGrid from '../pages/Expert/RankingGrid';

// Validator Pages
import ValidatorDashboard from '../pages/Validator/ValidatorDashboard';

// Finance Pages
import FinanceDashboard from '../pages/Finance/FinanceDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Government Portal Routes */}
      <Route element={<PortalLayout />}>
        <Route path="/gov/dashboard" element={<GovDashboard />} />
        <Route path="/gov/challenges" element={<GovChallenges />} />
        <Route path="/gov/create-challenge" element={<CreateChallenge />} />
        <Route path="/gov/screening" element={<EligibilityScreen />} />
        <Route path="/gov/ranking" element={<RankingGrid />} />
        <Route path="/gov/pilots" element={<GovPilots />} />
        <Route path="/gov/create-pilot" element={<PilotCreator />} />
        <Route path="/gov/contracts" element={<ContractAdmin />} />
        <Route path="/gov/kpis" element={<KpiTracker />} />
        <Route path="/gov/payments" element={<FinanceDashboard />} />
        <Route path="/gov/validation" element={<ValidatorDashboard />} />
        <Route path="/gov/scale-up" element={<ScaleDecision />} />
        <Route path="/gov/reports" element={<Reports />} />
        <Route path="/gov/audit" element={<AuditTrail />} />
        <Route path="/gov/notifications" element={<GovNotifications />} />
        <Route path="/gov/settings" element={<ProfileSettings />} />
      </Route>

      {/* Startup Portal Routes */}
      <Route element={<PortalLayout />}>
        <Route path="/startup/dashboard" element={<StartupDashboard />} />
        <Route path="/startup/challenges" element={<ChallengeBrowse />} />
        <Route path="/startup/applications" element={<StartupDashboard />} />
        <Route path="/startup/apply/:challengeId" element={<ApplicationForm />} />
        <Route path="/startup/pilots" element={<StartupDashboard />} />
        <Route path="/startup/documents" element={<ProfileSettings />} />
        <Route path="/startup/payments" element={<StartupDashboard />} />
        <Route path="/startup/notifications" element={<GovNotifications />} />
        <Route path="/startup/profile" element={<ProfileSettings />} />
      </Route>

      {/* Expert Portal Routes */}
      <Route element={<PortalLayout />}>
        <Route path="/expert/dashboard" element={<ExpertDashboard />} />
        <Route path="/expert/evaluations" element={<ExpertDashboard />} />
        <Route path="/expert/evaluate/:applicationId" element={<EvaluationForm />} />
        <Route path="/expert/startups" element={<RankingGrid />} />
        <Route path="/expert/history" element={<ExpertDashboard />} />
        <Route path="/expert/notifications" element={<GovNotifications />} />
      </Route>

      {/* Validator Portal Routes */}
      <Route element={<PortalLayout />}>
        <Route path="/validator/dashboard" element={<ValidatorDashboard />} />
        <Route path="/validator/pilots" element={<ValidatorDashboard />} />
        <Route path="/validator/tasks" element={<ValidatorDashboard />} />
        <Route path="/validator/reports" element={<Reports />} />
        <Route path="/validator/notifications" element={<GovNotifications />} />
      </Route>

      {/* Finance Portal Routes */}
      <Route element={<PortalLayout />}>
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance/requests" element={<FinanceDashboard />} />
        <Route path="/finance/history" element={<FinanceDashboard />} />
        <Route path="/finance/reports" element={<Reports />} />
      </Route>

      {/* Fallback redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
