import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEPARTMENTS,
  CATEGORIES,
  STARTUPS,
  CHALLENGES,
  APPLICATIONS,
  PILOTS,
  PROCUREMENT_RECORDS,
  INITIAL_NOTIFICATIONS,
  RECENT_ACTIVITIES
} from '../data/mockData';
import { challengeService } from '../services/challengeService';
import { applicationService } from '../services/applicationService';
import { pilotService } from '../services/pilotService';
import { procurementService } from '../services/procurementService';
import { notificationService } from '../services/notificationService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [applications, setApplications] = useState(APPLICATIONS);
  const [pilots, setPilots] = useState(PILOTS);
  const [procurementRecords, setProcurementRecords] = useState(PROCUREMENT_RECORDS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [recentActivities, setRecentActivities] = useState(RECENT_ACTIVITIES);
  const [toasts, setToasts] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Active Role and User Persona
  // Valid roles: "Government", "Startup", "Expert"
  const [currentRole, setCurrentRoleState] = useState("Government");
  const [currentUser, setCurrentUser] = useState({
    name: "Dr. K. Srinivas, IAS",
    designation: "Principal Secretary & Mission Director",
    department: "Water Resources & Innovation Mission",
    role: "Government",
    email: "dir.innovate@gov.in",
    avatar: "KS"
  });

  // Attempt background sync with backend if live
  useEffect(() => {
    let isMounted = true;
    const syncBackendData = async () => {
      try {
        const [chRes, notifRes] = await Promise.allSettled([
          challengeService.getChallenges(),
          notificationService.getNotifications()
        ]);

        if (isMounted) {
          if (chRes.status === 'fulfilled' && chRes.value?.data?.challenges?.length > 0) {
            setIsBackendConnected(true);
          }
          if (notifRes.status === 'fulfilled' && notifRes.value?.data?.notifications?.length > 0) {
            setNotifications(notifRes.value.data.notifications);
          }
        }
      } catch {
        // Safe offline mode fallback
      }
    };

    syncBackendData();
    return () => { isMounted = false; };
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
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

  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    if (role === "Government") {
      setCurrentUser({
        name: "Dr. K. Srinivas, IAS",
        designation: "Principal Secretary & Mission Director",
        department: "Water Resources & Innovation Mission",
        role: "Government",
        email: "dir.innovate@gov.in",
        avatar: "KS"
      });
    } else if (role === "Startup") {
      setCurrentUser({
        name: "Dr. Arvind Subramaniam",
        designation: "Co-Founder & CEO",
        startupName: "AquaTech Solutions",
        startupId: "startup-1",
        role: "Startup",
        email: "contact@aquatech.io",
        avatar: "AS"
      });
    } else if (role === "Expert" || role === "Expert / Evaluator") {
      setCurrentRoleState("Expert");
      setCurrentUser({
        name: "Dr. Ramesh Chandra",
        designation: "Chairperson, Technical Screening & Evaluation Committee",
        institution: "National Innovation Council / IIT Delhi",
        role: "Expert",
        email: "r.chandra@nic.in",
        avatar: "RC"
      });
    }
    addToast(`Switched active workspace to ${role} Portal`, "info");
  };

  // 1. Challenge Handlers
  const publishChallenge = async (challengeData, isDraft = false) => {
    const newChallenge = {
      id: `CH-2026-00${challenges.length + 1}`,
      ...challengeData,
      status: isDraft ? "Draft" : "Published",
      applicationsCount: 0
    };
    setChallenges(prev => [newChallenge, ...prev]);
    logActivity(
      `${isDraft ? "Drafted" : "Published"} Challenge: ${challengeData.title}`,
      challengeData.department,
      isDraft ? "Draft Created" : "Challenge Published",
      isDraft ? "Draft" : "Published",
      isDraft ? "slate" : "blue"
    );
    triggerNotification(
      "New Challenge Published",
      `${challengeData.department} announced challenge: ${challengeData.title}`,
      "Startup",
      "info"
    );
    addToast(isDraft ? "Challenge saved as draft" : "Challenge published successfully!", "success");

    // Asynchronously dispatch to real backend
    try {
      await challengeService.createChallenge({
        title: challengeData.title,
        problem_statement: challengeData.problemStatement || challengeData.description,
        category: challengeData.category,
        technical_requirements: challengeData.technicalRequirements,
        pilot_guidelines: challengeData.pilotGuidelines,
        status: isDraft ? 'draft' : 'published'
      });
    } catch (err) {
      console.warn('Backend challenge sync note:', err.message);
    }

    return newChallenge;
  };

  // 2. Application Handlers
  const submitApplication = async (appData) => {
    const newApp = {
      id: `APP-2026-0${applications.length + 1}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: "Submitted",
      eligibility: "Under Review",
      scores: {
        technicalFeasibility: 0,
        innovation: 0,
        costEffectiveness: 0,
        scalability: 0,
        risk: 0,
        overallScore: 0
      },
      ...appData
    };
    setApplications(prev => [newApp, ...prev]);
    setChallenges(prev => prev.map(c => c.id === appData.challengeId ? { ...c, applicationsCount: (c.applicationsCount || 0) + 1 } : c));
    
    logActivity(
      `${appData.startupName} applied for ${appData.challengeTitle}`,
      appData.department,
      "New Application",
      "Submitted",
      "blue"
    );
    triggerNotification(
      "New Application Received",
      `${appData.startupName} submitted a proposal for '${appData.challengeTitle}'`,
      "Government",
      "info"
    );
    triggerNotification(
      "Evaluation Queue Updated",
      `New proposal by ${appData.startupName} assigned for evaluation.`,
      "Expert",
      "info"
    );
    addToast("Application submitted successfully!", "success");

    // Asynchronously dispatch to real backend
    try {
      await applicationService.submitApplication({
        challenge_id: appData.challengeId,
        proposal: appData.proposalText || appData.solutionOverview,
        technical_solution: appData.technicalSolution,
        estimated_cost: appData.estimatedCost
      });
    } catch (err) {
      console.warn('Backend application sync note:', err.message);
    }

    return newApp;
  };

  const updateApplicationStatus = async (appId, status, recommendation = "") => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status,
          expertRecommendation: recommendation || app.expertRecommendation
        };
      }
      return app;
    }));
    const app = applications.find(a => a.id === appId);
    if (app) {
      logActivity(
        `Application ${app.startupName} status updated to: ${status}`,
        app.department,
        "Application Updated",
        status,
        status === "Selected" || status === "Shortlisted" ? "green" : status === "Rejected" ? "red" : "blue"
      );
      triggerNotification(
        `Application ${status}`,
        `Your application for '${app.challengeTitle}' is now marked as '${status}'.`,
        "Startup",
        status === "Selected" ? "success" : "info"
      );
    }
    addToast(`Application status updated to ${status}`, "success");

    // Asynchronously dispatch to backend
    try {
      await applicationService.updateStatus(appId, status.toLowerCase().replace(/\s+/g, '_'), recommendation);
    } catch (err) {
      console.warn('Backend application status sync note:', err.message);
    }
  };

  const submitExpertEvaluation = async (appId, scores, recommendation, actionType = "Recommend") => {
    const overall = (
      (scores.technicalFeasibility * 0.25) +
      (scores.innovation * 0.20) +
      (scores.costEffectiveness * 0.20) +
      (scores.scalability * 0.20) +
      (scores.risk * 0.15)
    ).toFixed(2);

    const numericOverall = parseFloat(overall);

    let nextStatus = "Under Evaluation";
    if (actionType === "Shortlist") nextStatus = "Shortlisted";
    else if (actionType === "Recommend") nextStatus = "Selected";
    else if (actionType === "Reject") nextStatus = "Rejected";

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: nextStatus,
          scores: {
            ...scores,
            overallScore: numericOverall
          },
          expertRecommendation: recommendation,
          evaluatedBy: currentUser.name,
          evaluationDate: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    }));

    const app = applications.find(a => a.id === appId);
    logActivity(
      `Expert score logged for ${app?.startupName || 'Startup'} (${numericOverall}/10)`,
      app?.department || "Gov",
      "Evaluation Completed",
      `Score: ${numericOverall}`,
      "green"
    );
    triggerNotification(
      "Evaluation Submitted",
      `${currentUser.name} completed evaluation for ${app?.startupName} (Score: ${numericOverall}/10).`,
      "Government",
      "success"
    );
    addToast("Evaluation scorecard submitted successfully!", "success");

    // Asynchronously dispatch to backend
    try {
      await applicationService.submitEvaluation(appId, {
        technical_feasibility: scores.technicalFeasibility,
        innovation_ip: scores.innovation,
        cost_effectiveness: scores.costEffectiveness,
        scalability: scores.scalability,
        implementation_risk: scores.risk,
        recommendation,
        comments: `Action: ${actionType}`
      });
    } catch (err) {
      console.warn('Backend evaluation sync note:', err.message);
    }
  };

  // 3. Pilot & Evidence Handlers
  const uploadPilotEvidence = async (pilotId, milestoneId, fileData) => {
    setPilots(prev => prev.map(pilot => {
      if (pilot.id === pilotId) {
        const updatedMilestones = pilot.milestones.map(m => {
          if (m.id === milestoneId) {
            const existingEvidence = m.evidence || [];
            const newEv = {
              name: fileData.name,
              date: new Date().toISOString().split('T')[0],
              type: fileData.type || "Document",
              status: "Pending Review"
            };
            return {
              ...m,
              evidence: [newEv, ...existingEvidence]
            };
          }
          return m;
        });
        return { ...pilot, milestones: updatedMilestones };
      }
      return pilot;
    }));

    const p = pilots.find(x => x.id === pilotId);
    logActivity(
      `Evidence uploaded: ${fileData.name}`,
      p?.department || "Department",
      "Evidence Upload",
      "Pending Review",
      "blue"
    );
    triggerNotification(
      "New Pilot Evidence Uploaded",
      `${p?.startupName} uploaded evidence '${fileData.name}' for verification.`,
      "Expert",
      "info"
    );
    triggerNotification(
      "Pilot Evidence Submitted",
      `Evidence file '${fileData.name}' received for ${p?.challengeTitle}.`,
      "Government",
      "info"
    );
    addToast(`File "${fileData.name}" uploaded successfully for verification`, "success");

    // Asynchronously dispatch to backend
    try {
      await pilotService.uploadEvidence(pilotId, {
        milestone_id: milestoneId,
        file_name: fileData.name,
        evidence_type: fileData.type || 'Document'
      });
    } catch (err) {
      console.warn('Backend evidence sync note:', err.message);
    }
  };

  const verifyEvidence = async (pilotId, milestoneId, fileName, status) => {
    setPilots(prev => prev.map(pilot => {
      if (pilot.id === pilotId) {
        const updatedMilestones = pilot.milestones.map(m => {
          if (m.id === milestoneId) {
            const updatedEv = (m.evidence || []).map(ev => {
              if (ev.name === fileName) {
                return { ...ev, status };
              }
              return ev;
            });
            return { ...m, evidence: updatedEv };
          }
          return m;
        });
        return { ...pilot, milestones: updatedMilestones };
      }
      return pilot;
    }));
    addToast(`Evidence "${fileName}" marked as ${status}`, "info");

    try {
      await pilotService.verifyEvidence(fileName, status.toLowerCase().replace(/\s+/g, '_'));
    } catch (err) {
      console.warn('Backend verify evidence note:', err.message);
    }
  };

  const submitPilotValidation = async (pilotId, validationStatus, comments) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        return {
          ...p,
          status: validationStatus === "Validated" ? "Validation" : p.status,
          expertValidation: {
            expertName: currentUser.name,
            validationStatus,
            validationDate: new Date().toISOString().split('T')[0],
            comments
          }
        };
      }
      return p;
    }));
    const p = pilots.find(x => x.id === pilotId);
    logActivity(
      `Pilot validation report submitted for ${p?.startupName} (${validationStatus})`,
      p?.department || "Gov",
      "Pilot Validation",
      validationStatus,
      validationStatus === "Validated" ? "green" : "orange"
    );
    triggerNotification(
      "Pilot Validation Signed Off",
      `Final validation for '${p?.challengeTitle}' submitted: ${validationStatus}.`,
      "Government",
      validationStatus === "Validated" ? "success" : "warning"
    );
    addToast(`Pilot validation result "${validationStatus}" recorded!`, "success");

    try {
      await pilotService.submitValidation(pilotId, {
        final_result: validationStatus === 'Validated' ? 'approved' : 'rejected',
        comments
      });
    } catch (err) {
      console.warn('Backend validation sync note:', err.message);
    }
  };

  // 4. Procurement & Payments Handlers
  const approveProcurement = async (procurementId) => {
    setProcurementRecords(prev => prev.map(pr => {
      if (pr.id === procurementId) {
        return {
          ...pr,
          procurementStatus: "Procured",
          scaleUpStatus: "Scaled",
          orderDate: new Date().toISOString().split('T')[0]
        };
      }
      return pr;
    }));
    const pr = procurementRecords.find(p => p.id === procurementId);
    logActivity(
      `Direct Procurement Approved: ${pr?.solutionName}`,
      pr?.department || "Gov",
      "Procurement Approved",
      "Procured & Scaled",
      "green"
    );
    triggerNotification(
      "Procurement Contract Executed",
      `Direct Procurement Order executed for ${pr?.solutionName} (${pr?.contractValue}).`,
      "Startup",
      "success"
    );
    addToast("Procurement approved and Direct Procurement Order (DPO) issued!", "success");

    try {
      await procurementService.updateStatus(procurementId, 'approved');
    } catch (err) {
      console.warn('Backend procurement approve note:', err.message);
    }
  };

  const updateMilestonePayment = async (procurementId, milestoneIndex, status) => {
    setProcurementRecords(prev => prev.map(pr => {
      if (pr.id === procurementId) {
        const updated = [...pr.paymentMilestones];
        if (updated[milestoneIndex]) {
          updated[milestoneIndex] = { ...updated[milestoneIndex], status };
        }
        return { ...pr, paymentMilestones: updated };
      }
      return pr;
    }));
    addToast(`Milestone payment status updated to ${status}`, "success");
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, is_read: true } : n));
    try {
      notificationService.markAsRead(id);
    } catch {}
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, is_read: true })));
    try {
      notificationService.markAllAsRead();
    } catch {}
  };

  return (
    <AppContext.Provider value={{
      DEPARTMENTS,
      CATEGORIES,
      STARTUPS,
      challenges,
      applications,
      pilots,
      procurementRecords,
      notifications,
      recentActivities,
      toasts,
      currentRole,
      currentUser,
      isBackendConnected,
      setCurrentRole,
      addToast,
      publishChallenge,
      submitApplication,
      updateApplicationStatus,
      submitExpertEvaluation,
      uploadPilotEvidence,
      verifyEvidence,
      submitPilotValidation,
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
