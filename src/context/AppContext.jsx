import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from '../config/constants';
import { challengeService } from '../services/challengeService';
import { applicationService } from '../services/applicationService';
import { pilotService } from '../services/pilotService';
import { procurementService } from '../services/procurementService';
import { notificationService } from '../services/notificationService';
import { departmentService } from '../services/departmentService';
import { startupService } from '../services/startupService';
import { auditService } from '../services/auditService';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Normalization Helpers to bridge database models to UI models seamlessly
export const normalizeChallenge = (c) => {
  if (!c) return null;
  return {
    ...c,
    id: c.id,
    title: c.title || '',
    problemStatement: c.problem_statement || c.problemStatement || c.problemDescription || '',
    problemDescription: c.problem_statement || c.problemDescription || c.problemStatement || '',
    category: c.category || 'General',
    status: c.status === 'published' ? 'Published' : c.status === 'closed' ? 'Closed' : 'Draft',
    rawStatus: c.status,
    department: c.government_departments?.name || c.department || 'Government Department',
    departmentId: c.department_id || c.departmentId,
    budget: c.budget || (c.estimated_budget ? `₹ ${Number(c.estimated_budget).toLocaleString('en-IN')}` : (c.budgetNumeric ? `₹ ${Number(c.budgetNumeric).toLocaleString('en-IN')}` : '₹ 75,00,000')),
    budgetNumeric: c.budgetNumeric || (c.estimated_budget ? Number(c.estimated_budget) : 7500000),
    deadline: c.deadline || c.submission_deadline || c.application_deadline || (c.created_at ? new Date(new Date(c.created_at).getTime() + 90*24*60*60*1000).toISOString().split('T')[0] : '2026-11-30'),
    location: c.location || c.pilot_location || 'Pan-India / Pilot Zones',
    pilotDuration: c.pilotDuration || c.pilot_duration || (c.duration_days ? `${c.duration_days} Days` : '6 Months'),
    applicationsCount: c.applicationsCount !== undefined ? c.applicationsCount : (c.applications?.[0]?.count || 0),
    technicalRequirements: c.technical_requirements || c.technicalRequirements || c.requiredTechnology || '',
    pilotGuidelines: c.pilot_guidelines || c.pilotGuidelines || c.pilotRequirements || '',
    expectedSolution: c.expected_solution || c.expectedSolution || '',
    eligibilityCriteria: c.eligibility_criteria || c.eligibilityCriteria || '',
    createdDate: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '',
    publishedDate: c.published_at ? new Date(c.published_at).toISOString().split('T')[0] : ''
  };
};

export const normalizeApplication = (a) => {
  if (!a) return null;
  const ev = a.evaluations?.[0];
  const asg = a.expert_assignments?.[0];
  const det = a.details || {};
  const costVal = a.estimated_cost !== undefined && a.estimated_cost !== null
    ? (typeof a.estimated_cost === 'number' ? `₹ ${Number(a.estimated_cost).toLocaleString('en-IN')}` : String(a.estimated_cost).startsWith('₹') ? a.estimated_cost : `₹ ${Number(String(a.estimated_cost).replace(/[^0-9.-]+/g, '') || 0).toLocaleString('en-IN')}`)
    : 'To be determined';

  let evaluationStatus = 'Evaluation Pending';
  if (a.status === 'selected') {
    evaluationStatus = 'Selected for Pilot';
  } else if (a.status === 'shortlisted') {
    evaluationStatus = 'Shortlisted';
  } else if (a.status === 'rejected') {
    evaluationStatus = 'Rejected';
  } else if (ev && Number(ev.weighted_score) > 0) {
    evaluationStatus = 'Evaluation Completed';
  } else if (asg) {
    evaluationStatus = 'Expert Assigned';
  }

  return {
    ...a,
    id: a.id,
    challengeId: a.challenge_id || a.challengeId,
    challengeTitle: a.challenges?.title || a.challengeTitle || 'Challenge Proposal',
    startupId: a.startup_id || a.startupId,
    startupName: a.startups?.name || a.startupName || 'Startup',
    department: a.challenges?.government_departments?.name || a.department || 'Government Department',
    category: a.challenges?.category || a.category || 'General',
    proposalText: a.proposal || det.proposal || '',
    proposedSolution: a.proposal || '',
    solutionOverview: a.proposal || '',
    technicalSolution: a.technical_solution || a.proposal || '',
    estimatedCost: costVal,
    rawEstimatedCost: Number(typeof a.estimated_cost === 'number' ? a.estimated_cost : String(a.estimated_cost || '0').replace(/[^0-9.-]+/g, '') || 0),
    status: a.status === 'under_review' ? 'under_review' : a.status === 'shortlisted' ? 'shortlisted' : a.status === 'selected' ? 'selected' : a.status === 'rejected' ? 'rejected' : a.status || 'under_review',
    rawStatus: a.status || 'under_review',
    statusDisplay: a.status === 'under_review' ? 'Under Review' : a.status === 'shortlisted' ? 'Shortlisted' : a.status === 'selected' ? 'Selected for Pilot' : a.status === 'rejected' ? 'Rejected' : a.status || 'Under Review',
    evaluationStatus,
    eligibility: a.dpiit_verified ? 'Verified (DPIIT)' : 'Verification Pending',
    dpiitVerified: Boolean(a.dpiit_verified),
    submittedDate: a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : 'Recent',
    updatedDate: a.updated_at ? new Date(a.updated_at).toISOString().split('T')[0] : 'Recent',
    // Details Fields
    solutionTitle: det.solution_title || a.solution_title || a.challenges?.title || 'Proposed Innovation Solution',
    problemUnderstanding: det.problem_understanding || a.problem_understanding || '',
    technologyUsed: det.technology_used || a.technology_used || '',
    innovationUsp: det.innovation_usp || a.innovation_usp || '',
    expectedOutcome: det.expected_outcome || a.expected_outcome || '',
    implementationPlan: det.implementation_plan || a.implementation_plan || '',
    implementationTimeline: det.implementation_timeline || a.implementation_timeline || '',
    infrastructureRequirements: det.infrastructure_requirements || a.infrastructure_requirements || '',
    teamResources: det.team_resources || a.team_resources || '',
    costBreakdown: det.cost_breakdown || a.cost_breakdown || '',
    maintenanceCost: Number(det.maintenance_cost || a.maintenance_cost || 0),
    pilotDurationDays: parseInt(det.pilot_duration_days || a.pilot_duration_days || 180, 10),
    kpis: det.kpis || a.kpis || '',
    previousExperience: det.previous_experience || a.previous_experience || '',
    documents: a.documents || a.application_documents || [],
    details: a.details || null,
    scores: ev && Number(ev.weighted_score) > 0 ? {
      technicalFeasibility: Number(ev.technical_feasibility) || 0,
      innovation: Number(ev.innovation_ip) || 0,
      costEffectiveness: Number(ev.cost_effectiveness) || 0,
      scalability: Number(ev.scalability) || 0,
      risk: Number(ev.implementation_risk) || 0,
      overallScore: Number(ev.weighted_score) || 0
    } : null,
    expertRecommendation: ev?.recommendation || '',
    evaluationComments: ev?.comments || '',
    evaluatedBy: ev?.experts?.profiles?.full_name || '',
    evaluationDate: ev?.created_at ? new Date(ev.created_at).toISOString().split('T')[0] : '',
    expertAssigned: Boolean(asg),
    assignedExpertName: asg?.experts?.profiles?.full_name || '',
    startups: a.startups || null
  };
};

export const normalizePilot = (p) => {
  if (!p) return null;
  const val = p.validations?.[0];
  const milestones = (p.pilot_milestones || []).map(m => ({
    ...m,
    id: m.id,
    title: m.title || '',
    description: m.description || '',
    targetDate: m.target_date || '',
    status: m.status === 'completed' || m.status === 'verified' ? 'Completed' : m.status === 'in_progress' ? 'In Progress' : 'Pending',
    rawStatus: m.status,
    progress: m.status === 'completed' || m.status === 'verified' ? 100 : m.status === 'in_progress' ? 50 : 0,
    completedAt: m.completed_at || null,
    evidence: (m.pilot_evidence || []).map(e => ({
      id: e.id,
      name: e.file_name,
      fileName: e.file_name,
      fileUrl: e.file_url,
      downloadUrl: e.downloadUrl || e.file_url,
      type: e.evidence_type || 'Document',
      status: e.verification_status === 'verified' ? 'Verified' : e.verification_status === 'rejected' ? 'Rejected' : 'Pending Review',
      rawStatus: e.verification_status,
      date: e.created_at ? new Date(e.created_at).toISOString().split('T')[0] : ''
    }))
  }));

  return {
    ...p,
    id: p.id,
    applicationId: p.application_id,
    challengeTitle: p.applications?.challenges?.title || 'Sandbox Pilot',
    startupName: p.startups?.name || 'Startup Founder',
    department: p.applications?.challenges?.government_departments?.name || 'Government Department',
    category: p.applications?.challenges?.category || 'General',
    location: p.location || 'Municipal Pilot Zone',
    duration: `${p.duration_days || 180} Days`,
    durationDays: p.duration_days || 180,
    status: p.status === 'approved' ? 'Approved' : p.status === 'in_progress' ? 'Ongoing' : p.status === 'completed' ? 'Completed' : p.status === 'failed' ? 'Failed' : 'Validation',
    rawStatus: p.status,
    overallProgress: p.progress || 0,
    baselineValue: p.baseline_value,
    targetValue: p.target_value,
    actualValue: p.actual_value,
    milestones,
    expertValidation: val ? {
      expertName: val.experts?.profiles?.full_name || 'Independent Expert',
      validationStatus: val.final_result === 'approved' ? 'Validated' : val.final_result,
      validationDate: val.signed_at ? new Date(val.signed_at).toISOString().split('T')[0] : '',
      comments: val.comments || ''
    } : null
  };
};

export const normalizeProcurement = (pr) => {
  if (!pr) return null;
  const milestones = (pr.payments || []).map(pm => ({
    ...pm,
    id: pm.id,
    milestoneName: pm.milestone_name || 'Payment Milestone',
    amount: pr.total_amount ? `₹ ${Number(pm.amount || 0).toLocaleString('en-IN')}` : '₹ 0',
    rawAmount: Number(pm.amount || 0),
    status: pm.status === 'released' ? 'Paid' : pm.status === 'approved' ? 'Approved' : 'Pending',
    rawStatus: pm.status,
    releasedAt: pm.released_at || null
  }));

  return {
    ...pr,
    id: pr.id,
    pilotId: pr.pilot_id,
    startupName: pr.startups?.name || 'Startup',
    solutionName: pr.pilots?.applications?.challenges?.title || `Sanction Order ${pr.procurement_order}`,
    department: pr.government_departments?.name || 'Government Department',
    orderNumber: pr.procurement_order,
    orderDate: pr.created_at ? new Date(pr.created_at).toISOString().split('T')[0] : '',
    contractValue: pr.total_amount ? `₹ ${Number(pr.total_amount).toLocaleString('en-IN')}` : '₹ 0',
    rawContractValue: Number(pr.total_amount || 0),
    procurementStatus: pr.status === 'completed' ? 'Procured' : pr.status === 'approved' ? 'Approved' : 'Pending',
    scaleUpStatus: pr.status === 'completed' ? 'Scaled' : 'Pending',
    rawStatus: pr.status,
    tenderExemption: pr.tender_exemption_certificate,
    paymentMilestones: milestones
  };
};

export const AppProvider = ({ children }) => {
  // Real database state backed by Supabase APIs
  const [challenges, setChallenges] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [procurementRecords, setProcurementRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [startups, setStartups] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Authentication State
  const [authSession, setAuthSession] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Active Role and Persona State
  const [currentRole, setCurrentRoleState] = useState("Government");
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "Government Officer",
    designation: "Officer in Charge",
    department: "Government Department",
    role: "Government",
    email: "officer@gov.in",
    avatar: "GO"
  });

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Apply authoritative backend profile to user session
  const applyProfile = (profile) => {
    if (!profile) return;
    setAuthProfile(profile);
    const roleLower = (profile.role || '').toLowerCase();
    const isAdmin = Boolean(profile.is_admin);

    if (roleLower === 'government') {
      setCurrentRoleState(isAdmin ? 'Admin' : 'Government');
      setCurrentUser({
        id: profile.id,
        name: profile.full_name || (isAdmin ? 'Platform Administrator' : 'Government Officer'),
        designation: isAdmin ? 'Platform Administrator' : 'Government Officer',
        department: profile.department?.name || profile.organization || 'Government Department',
        departmentId: profile.department_id,
        role: isAdmin ? 'Admin' : 'Government',
        isAdmin,
        email: profile.email,
        avatar: (profile.full_name || 'GO').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      });
    } else if (roleLower === 'startup') {
      setCurrentRoleState('Startup');
      setCurrentUser({
        id: profile.id,
        name: profile.full_name || 'Startup Founder',
        designation: 'Founder / CEO',
        startupName: profile.startup?.name || profile.organization || 'DPIIT Startup',
        startupId: profile.startup?.id,
        role: 'Startup',
        isAdmin: false,
        email: profile.email,
        avatar: (profile.full_name || 'ST').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      });
    } else if (roleLower === 'expert') {
      setCurrentRoleState('Expert');
      setCurrentUser({
        id: profile.id,
        name: profile.full_name || 'Technical Expert',
        designation: 'Technical Screening & Evaluation Panel',
        institution: profile.expert?.organization || profile.organization || 'Expert Evaluator Panel',
        role: 'Expert',
        isAdmin: false,
        email: profile.email,
        avatar: (profile.full_name || 'EX').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      });
    }
  };

  // Unified Data Fetcher from Real Backend REST APIs
  const refreshData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const [
        chRes,
        appRes,
        pilotRes,
        procRes,
        notifRes,
        deptRes,
        startupRes,
        auditRes
      ] = await Promise.allSettled([
        challengeService.getChallenges(),
        applicationService.getApplications(),
        pilotService.getPilots(),
        procurementService.getProcurements(),
        notificationService.getNotifications(),
        departmentService.getDepartments(),
        startupService.getStartups(),
        auditService.getAuditLogs({ limit: 20 })
      ]);

      if (chRes.status === 'fulfilled' && chRes.value?.data?.challenges) {
        setChallenges(chRes.value.data.challenges.map(normalizeChallenge));
        setIsBackendConnected(true);
      }

      if (appRes.status === 'fulfilled' && appRes.value?.data?.applications) {
        setApplications(appRes.value.data.applications.map(normalizeApplication));
      }

      if (pilotRes.status === 'fulfilled' && pilotRes.value?.data?.pilots) {
        setPilots(pilotRes.value.data.pilots.map(normalizePilot));
      }

      if (procRes.status === 'fulfilled' && procRes.value?.data?.procurements) {
        setProcurementRecords(procRes.value.data.procurements.map(normalizeProcurement));
      }

      if (notifRes.status === 'fulfilled' && notifRes.value?.data?.notifications) {
        setNotifications(notifRes.value.data.notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          read: Boolean(n.is_read),
          is_read: Boolean(n.is_read),
          timestamp: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'
        })));
      }

      if (deptRes.status === 'fulfilled' && deptRes.value?.data?.departments) {
        setDepartments(deptRes.value.data.departments);
      }

      if (startupRes.status === 'fulfilled' && startupRes.value?.data?.startups) {
        setStartups(startupRes.value.data.startups);
      }

      if (auditRes.status === 'fulfilled' && auditRes.value?.data?.logs) {
        setRecentActivities(auditRes.value.data.logs.map(log => ({
          id: log.id,
          title: log.description || log.action,
          department: log.entity_type || 'System',
          type: log.action,
          badge: log.entity_type,
          statusColor: 'blue',
          timestamp: log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        })));
      }
    } catch (err) {
      console.warn('Data sync warning:', err.message);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Restore session on mount & subscribe to auth changes
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          if (isMounted) setIsAuthLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          if (isMounted) {
            setAuthSession(null);
            setAuthProfile(null);
            setIsAuthLoading(false);
          }
          return;
        }

        if (isMounted) setAuthSession(session);

        try {
          const profileRes = await authService.getProfile();
          const profile = profileRes?.data?.profile;
          if (profile && isMounted) {
            if (profile.is_active === false) {
              await supabase.auth.signOut();
              setAuthSession(null);
              setAuthProfile(null);
            } else {
              applyProfile(profile);
            }
          }
        } catch (err) {
          console.warn('Session profile fetch warning:', err.message);
        }
      } catch (err) {
        console.error('Session restoration error:', err);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT' || !session) {
        setAuthSession(null);
        setAuthProfile(null);
        setIsAuthLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setAuthSession(session);
        try {
          const profileRes = await authService.getProfile();
          const profile = profileRes?.data?.profile;
          if (profile && isMounted) {
            if (profile.is_active === false) {
              await supabase.auth.signOut();
              setAuthSession(null);
              setAuthProfile(null);
            } else {
              applyProfile(profile);
            }
          }
        } catch {}
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sync real data when authenticated session changes or mounts
  useEffect(() => {
    refreshData();
  }, [authSession?.access_token, refreshData]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    setAuthSession(null);
    setAuthProfile(null);
    setCurrentRoleState('Government');
    addToast('Logged out of SolutionBridge', 'info');
  };

  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    addToast(`Switched active workspace to ${role} Portal`, "info");
    refreshData();
  };

  const logActivity = (title, department, type = "Action", badge = "Updated", statusColor = "blue") => {
    const newAct = {
      id: `act-${Date.now()}`,
      title,
      department,
      type,
      badge,
      statusColor,
      timestamp: "Just now"
    };
    setRecentActivities(prev => [newAct, ...prev]);
  };

  const triggerNotification = (title, message, role = "Government", type = "info") => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      role,
      type,
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Challenge Permission Check Helper
  const canManageChallenge = useCallback((ch, user = currentUser) => {
    if (!user || !ch) return false;
    if (user.isAdmin || user.role === 'Admin') return true;
    if (user.role !== 'Government' && user.role !== 'government') return false;

    // Check matching department ID
    const uDeptId = user.departmentId || user.department_id;
    const chDeptId = ch.departmentId || ch.department_id;
    if (uDeptId && chDeptId && String(uDeptId) === String(chDeptId)) {
      return true;
    }

    // Check matching department name (ignoring case, spaces, and punctuation)
    const uDeptName = (user.department || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const chDeptName = (ch.department || ch.government_departments?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (uDeptName && chDeptName) {
      if (uDeptName === chDeptName || uDeptName.includes(chDeptName) || chDeptName.includes(uDeptName)) {
        return true;
      }
    }

    return false;
  }, [currentUser]);

  // 1. Challenge Handlers
  const publishChallenge = async (challengeData, isDraft = false) => {
    try {
      let deptId = challengeData.departmentId || challengeData.department_id;
      if (!deptId && challengeData.department) {
        const found = departments.find(d => d.name === challengeData.department || d.id === challengeData.department);
        if (found) deptId = found.id;
      }
      if (!deptId && currentUser.departmentId) {
        deptId = currentUser.departmentId;
      }

      const response = await challengeService.createChallenge({
        title: challengeData.title,
        problem_statement: challengeData.problemStatement || challengeData.problemDescription || challengeData.description,
        category: challengeData.category,
        department_id: deptId,
        technical_requirements: challengeData.technicalRequirements,
        pilot_guidelines: challengeData.pilotGuidelines,
        status: isDraft ? 'draft' : 'published'
      });

      const savedChallenge = response?.data?.challenge ? normalizeChallenge(response.data.challenge) : null;

      if (savedChallenge) {
        setChallenges(prev => [savedChallenge, ...prev.filter(c => c.id !== savedChallenge.id)]);
      }

      addToast(isDraft ? "Challenge saved as draft" : "Challenge published successfully!", "success");
      refreshData();
      return savedChallenge;
    } catch (err) {
      addToast(err.message || "Failed to create challenge", "error");
      throw err;
    }
  };

  const updateChallenge = async (id, updateData) => {
    try {
      const response = await challengeService.updateChallenge(id, {
        title: updateData.title,
        problem_statement: updateData.problemStatement || updateData.problemDescription,
        category: updateData.category,
        technical_requirements: updateData.technicalRequirements,
        pilot_guidelines: updateData.pilotGuidelines,
        status: updateData.status ? updateData.status.toLowerCase() : undefined
      });

      const updated = response?.data?.challenge ? normalizeChallenge(response.data.challenge) : null;
      if (updated) {
        setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
      }

      addToast("Problem statement updated successfully", "success");
      refreshData();
      return updated;
    } catch (err) {
      addToast(err.message || "Failed to update challenge", "error");
      throw err;
    }
  };

  const deleteChallenge = async (id) => {
    try {
      await challengeService.deleteChallenge(id);
      setChallenges(prev => prev.filter(c => c.id !== id));
      addToast("Challenge removed successfully", "success");
      refreshData();
      return true;
    } catch (err) {
      addToast(err.message || "Failed to delete challenge", "error");
      throw err;
    }
  };

  const closeChallenge = async (id) => {
    try {
      await challengeService.closeChallenge(id);
      setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: 'Closed', rawStatus: 'closed' } : c));
      addToast("Challenge marked as closed", "info");
      refreshData();
      return true;
    } catch (err) {
      addToast(err.message || "Failed to close challenge", "error");
      throw err;
    }
  };

  // 2. Application Handlers
  const submitApplication = async (appData) => {
    try {
      const response = await applicationService.submitApplication({
        challenge_id: appData.challenge_id || appData.challengeId,
        proposal: appData.proposal || appData.proposalText || appData.proposedSolution || appData.solutionOverview || appData.solutionDescription,
        technical_solution: appData.technical_solution || appData.technicalSolution || appData.technicalApproach,
        estimated_cost: appData.estimated_cost !== undefined ? appData.estimated_cost : appData.estimatedCost,
        details: appData.details || {
          solution_title: appData.solution_title || appData.solutionTitle,
          problem_understanding: appData.problem_understanding || appData.problemUnderstanding,
          technology_used: appData.technology_used || appData.technologyUsed,
          innovation_usp: appData.innovation_usp || appData.innovationUsp,
          expected_outcome: appData.expected_outcome || appData.expectedOutcome,
          implementation_plan: appData.implementation_plan || appData.implementationPlan,
          implementation_timeline: appData.implementation_timeline || appData.implementationTimeline,
          infrastructure_requirements: appData.infrastructure_requirements || appData.infrastructureRequirements,
          team_resources: appData.team_resources || appData.teamResources,
          cost_breakdown: appData.cost_breakdown || appData.costBreakdown,
          maintenance_cost: appData.maintenance_cost !== undefined ? appData.maintenance_cost : appData.maintenanceCost,
          pilot_duration_days: appData.pilot_duration_days !== undefined ? appData.pilot_duration_days : appData.pilotDurationDays,
          kpis: appData.kpis,
          previous_experience: appData.previous_experience || appData.previousExperience
        },
        documents: appData.documents || []
      });

      const newApp = response?.data?.application ? normalizeApplication(response.data.application) : null;
      if (newApp) {
        setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
      }

      addToast("Application submitted successfully!", "success");
      await refreshData();
      return newApp;
    } catch (err) {
      addToast(err.message || "Failed to submit application", "error");
      throw err;
    }
  };

  const updateApplicationStatus = async (appId, status, recommendation = "") => {
    try {
      const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
      await applicationService.updateStatus(appId, normalizedStatus, recommendation);
      addToast(`Application status updated to ${status}`, "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to update application status", "error");
    }
  };

  const submitExpertEvaluation = async (appId, scores, recommendation, actionType = "Recommend") => {
    try {
      await applicationService.submitEvaluation(appId, {
        technical_feasibility: scores.technicalFeasibility,
        innovation_ip: scores.innovation,
        cost_effectiveness: scores.costEffectiveness,
        scalability: scores.scalability,
        implementation_risk: scores.risk,
        recommendation: recommendation || (actionType === 'Reject' ? 'Reject' : 'Recommend for Pilot'),
        comments: `Action: ${actionType}`
      });

      addToast("Evaluation scorecard submitted successfully!", "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to submit evaluation", "error");
    }
  };

  // 3. Pilot & Evidence Handlers
  const createPilot = async (pilotData) => {
    try {
      const response = await pilotService.createPilot({
        application_id: pilotData.applicationId || pilotData.application_id,
        location: pilotData.location,
        duration_days: pilotData.durationDays || pilotData.duration_days,
        baseline_value: pilotData.baselineValue || pilotData.baseline_value,
        target_value: pilotData.targetValue || pilotData.target_value,
        milestones: pilotData.milestones
      });

      addToast("Sandbox pilot created successfully!", "success");
      refreshData();
      return response?.data?.pilot;
    } catch (err) {
      addToast(err.message || "Failed to create pilot", "error");
      throw err;
    }
  };

  const uploadPilotEvidence = async (pilotId, milestoneId, fileData) => {
    try {
      await pilotService.uploadEvidence(pilotId, {
        milestone_id: milestoneId,
        file_name: fileData.name,
        evidence_type: fileData.type || 'Document'
      });

      addToast(`Evidence "${fileData.name}" uploaded successfully for verification`, "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to upload evidence", "error");
    }
  };

  const verifyEvidence = async (evidenceId, status, comments = '') => {
    try {
      await pilotService.verifyEvidence(evidenceId, status.toLowerCase().replace(/\s+/g, '_'), comments);
      addToast(`Evidence marked as ${status}`, "info");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to verify evidence", "error");
    }
  };

  const submitPilotValidation = async (pilotId, validationStatus, comments) => {
    try {
      const finalResult = validationStatus === 'Validated' || validationStatus === 'approved' ? 'approved' : 'rejected';
      await pilotService.submitValidation(pilotId, {
        final_result: finalResult,
        evidence_verified: true,
        performance_verified: true,
        comments
      });

      addToast(`Pilot validation recorded: ${validationStatus}!`, "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to record pilot validation", "error");
    }
  };

  // 4. Procurement & Payments Handlers
  const createProcurement = async (procurementData) => {
    try {
      const response = await procurementService.createProcurement(procurementData);
      addToast("Direct Procurement Order issued successfully!", "success");
      refreshData();
      return response?.data?.procurement;
    } catch (err) {
      addToast(err.message || "Failed to issue procurement order", "error");
      throw err;
    }
  };

  const approveProcurement = async (procurementId) => {
    try {
      await procurementService.updateStatus(procurementId, 'approved');
      addToast("Procurement approved and Direct Procurement Order (DPO) issued!", "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to approve procurement", "error");
    }
  };

  const updateMilestonePayment = async (paymentId, status) => {
    try {
      await procurementService.updatePaymentStatus(paymentId, status.toLowerCase());
      addToast(`Milestone payment status updated to ${status}`, "success");
      refreshData();
    } catch (err) {
      addToast(err.message || "Failed to update payment status", "error");
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, is_read: true } : n));
    try {
      await notificationService.markAsRead(id);
    } catch {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch {}
  };

  // Computed list of department name strings from database or defaults
  const DEPARTMENTS = departments.length > 0 
    ? departments.map(d => d.name)
    : [
        "Water Resources Department",
        "Health & Family Welfare Department",
        "Municipal Administration & Urban Development",
        "Agriculture & Farmers Empowerment",
        "Transport & Urban Mobility Department",
        "Renewable Energy & Environment"
      ];

  return (
    <AppContext.Provider value={{
      DEPARTMENTS,
      CATEGORIES,
      STARTUPS: startups,
      challenges,
      applications,
      pilots,
      procurementRecords,
      notifications,
      recentActivities,
      departments,
      startups,
      toasts,
      currentRole,
      currentUser,
      isBackendConnected,
      isDataLoading,
      refreshData,
      authSession,
      authProfile,
      isAuthenticated: Boolean(authSession && authProfile),
      isAuthLoading,
      applyProfile,
      logout,
      setCurrentRole,
      addToast,
      publishChallenge,
      updateChallenge,
      deleteChallenge,
      closeChallenge,
      canManageChallenge,
      submitApplication,
      updateApplicationStatus,
      submitExpertEvaluation,
      createPilot,
      uploadPilotEvidence,
      verifyEvidence,
      submitPilotValidation,
      createProcurement,
      approveProcurement,
      updateMilestonePayment,
      markNotificationRead,
      markAllNotificationsRead,
      logActivity,
      triggerNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
