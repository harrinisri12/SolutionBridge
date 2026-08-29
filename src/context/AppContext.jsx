import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEPARTMENTS,
  STARTUPS,
  CHALLENGES,
  INITIAL_APPLICATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_PILOTS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // State variables
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [evaluations, setEvaluations] = useState(INITIAL_EVALUATIONS);
  const [pilots, setPilots] = useState(INITIAL_PILOTS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState([]);
  
  // Toast notifications helper
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  
  // Simulation Role State
  const [currentRole, setCurrentRoleState] = useState("Government"); // Government, Startup, Expert, Validator, Finance
  const [currentUser, setCurrentUser] = useState({
    name: "Sarah Jenkins (Director of Innovation)",
    department: "Health Department",
    role: "Government",
    email: "s.jenkins@health.gov"
  });

  // Sync current user when currentRole changes
  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    if (role === "Government") {
      setCurrentUser({
        name: "Sarah Jenkins (Director of Innovation)",
        department: "Health Department",
        role: "Government",
        email: "s.jenkins@health.gov"
      });
    } else if (role === "Startup") {
      setCurrentUser({
        name: "HealthTech Solutions Team",
        role: "Startup",
        email: "info@healthtech.com",
        startupId: "startup-1"
      });
    } else if (role === "Expert") {
      setCurrentUser({
        name: "Dr. Ramesh Chandra (Scientific Advisor)",
        role: "Expert",
        email: "r.chandra@nationalsci.org"
      });
    } else if (role === "Validator") {
      setCurrentUser({
        name: "Independent Auditor Group",
        role: "Validator",
        email: "audit@independentvalidate.org"
      });
    } else if (role === "Finance") {
      setCurrentUser({
        name: "Arthur Pendelton (Chief Finance Officer)",
        role: "Finance",
        email: "a.pendelton@finance.gov"
      });
    }
    
    // Add log
    logAction(
      `Role Impersonator`,
      `Switched session to ${role} role`,
      "Session Control",
      "Success"
    );
  };

  // Helper log functions
  const logAction = (user, action, module, status) => {
    const timestamp = new Date().toLocaleString();
    const newLog = {
      id: `log-${Date.now()}`,
      user,
      action,
      module,
      date: timestamp,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerNotification = (title, message, role) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      read: false,
      role
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Challenge Actions
  const publishChallenge = (challengeData) => {
    const newChallenge = {
      id: `CH-2026-00${challenges.length + 1}`,
      ...challengeData,
      status: "Open"
    };
    setChallenges(prev => [...prev, newChallenge]);
    logAction(currentUser.name, `Created & Published Challenge: ${challengeData.title}`, "Challenges", "Success");
    triggerNotification("New Challenge Published", `Health Department published '${challengeData.title}'`, "Startup");
    return newChallenge;
  };

  // 2. Application Actions
  const submitApplication = (appData) => {
    const newApp = {
      id: `app-${Date.now().toString().slice(-4)}`,
      status: "Submitted",
      submittedDate: new Date().toISOString().split('T')[0],
      ...appData
    };
    setApplications(prev => [...prev, newApp]);
    
    const startupName = STARTUPS.find(s => s.id === appData.startupId)?.name || "Fictional Startup";
    const challengeTitle = challenges.find(c => c.id === appData.challengeId)?.title || "Challenge";
    
    logAction(startupName, `Submitted Application for Challenge ID: ${appData.challengeId}`, "Applications", "Success");
    triggerNotification("Application Submitted", `${startupName} applied for '${challengeTitle}'`, "Government");
    return newApp;
  };

  // 3. Screening / Eligibility Actions
  const updateApplicationStatus = (appId, status, comment) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const startupName = STARTUPS.find(s => s.id === app.startupId)?.name || "Startup";
        const challengeTitle = challenges.find(c => c.id === app.challengeId)?.title || "Challenge";
        
        logAction(currentUser.name, `Updated application status for ${startupName} to: ${status}`, "Screening", "Success");
        triggerNotification(
          `Application Status Updated`, 
          `Your application for '${challengeTitle}' is now marked as '${status}'`, 
          "Startup"
        );
        return { ...app, status, screeningComment: comment };
      }
      return app;
    }));
  };

  // 4. Expert Evaluation
  const submitEvaluation = (evalData) => {
    const newEval = {
      id: `eval-${Date.now().toString().slice(-3)}`,
      submittedDate: new Date().toISOString().split('T')[0],
      ...evalData
    };
    setEvaluations(prev => [...prev, newEval]);

    // Automatically update the application status to 'Under Review' when evaluated
    setApplications(prev => prev.map(app => {
      if (app.id === evalData.applicationId) {
        return { ...app, status: "Under Review" };
      }
      return app;
    }));

    const app = applications.find(a => a.id === evalData.applicationId);
    const startupName = STARTUPS.find(s => s.id === app?.startupId)?.name || "Startup";
    
    logAction(currentUser.name, `Submitted evaluation for ${startupName}`, "Evaluations", "Success");
    triggerNotification("Evaluation Completed", `Expert ${evalData.expertName} submitted evaluation for ${startupName}`, "Government");
  };

  // 5. Pilot Creation
  const createPilot = (pilotData) => {
    const newPilot = {
      id: `pilot-${Date.now().toString().slice(-3)}`,
      ...pilotData,
      status: "Planning", // Planning, Active, Completed, Validated, Scaled
      contractApproved: false,
      validationDetails: {
        status: "Unverified",
        validatorClaimant: "",
        validatorResult: "",
        validatorComments: "",
        validatorFile: ""
      },
      scaleUpScore: 0,
      scaleUpStatus: "Under Review"
    };

    setPilots(prev => [...prev, newPilot]);

    // Also pre-create payment requests for the finance dashboard linked to these milestones
    const initialPayments = pilotData.milestones.map((m, index) => ({
      id: `pay-${Date.now().toString().slice(-3)}-${index}`,
      pilotId: newPilot.id,
      pilotTitle: pilotData.challengeTitle,
      startupName: pilotData.startupName,
      milestoneId: m.id || `m-${index + 1}`,
      milestoneTitle: m.title,
      percentage: m.weight,
      amount: m.budgetShare,
      status: index === 0 ? "Pending Approval" : "Draft", // First milestone immediately requestable
      invoiceDate: index === 0 ? new Date().toISOString().split('T')[0] : null,
      paidDate: null
    }));
    
    setPayments(prev => [...prev, ...initialPayments]);

    // Set the original challenge status to "Pilot Selected"
    setChallenges(prev => prev.map(c => {
      if (c.id === pilotData.challengeId) {
        return { ...c, status: "Pilot Selected" };
      }
      return c;
    }));

    // Update application status to Pilot Selected
    setApplications(prev => prev.map(app => {
      if (app.challengeId === pilotData.challengeId && app.startupId === pilotData.startupId) {
        return { ...app, status: "Pilot Selected" };
      } else if (app.challengeId === pilotData.challengeId) {
        return { ...app, status: "Rejected" };
      }
      return app;
    }));

    logAction(currentUser.name, `Created Pilot for ${pilotData.startupName}`, "Pilot Management", "Success");
    triggerNotification("Pilot Initiated", `A pilot project was initiated for '${pilotData.challengeTitle}' with ${pilotData.startupName}`, "Startup");
    return newPilot;
  };

  // 6. Contract Approvals
  const approveContract = (pilotId) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        logAction(currentUser.name, `Approved contract for pilot: ${p.challengeTitle}`, "Contracts", "Success");
        triggerNotification("Contract Approved", `The contract for '${p.challengeTitle}' has been approved. Pilot status set to Active.`, "Startup");
        return { ...p, contractApproved: true, status: "Active" };
      }
      return p;
    }));
  };

  const requestContractChanges = (pilotId, notes) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        logAction(currentUser.name, `Requested contract changes: ${notes}`, "Contracts", "Success");
        triggerNotification("Contract Revision Requested", `Changes requested on contract terms: "${notes}"`, "Government");
        return { ...p, contractApproved: false, contractNotes: notes };
      }
      return p;
    }));
  };

  // 7. KPI Tracker (update actual metrics)
  const updateKPIValues = (pilotId, updatedKpis) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        // Calculate pass/fail based on target values
        const evaluatedKpis = updatedKpis.map(kpi => {
          let isPass = false;
          const baseline = parseFloat(kpi.baseline);
          const target = parseFloat(kpi.target);
          const actual = parseFloat(kpi.actual);
          
          if (!isNaN(actual)) {
            // Check if baseline -> target is decreasing (e.g. waiting time) or increasing (e.g. accuracy)
            const targetImproving = target > baseline;
            if (targetImproving) {
              isPass = actual >= target;
            } else {
              isPass = actual <= target;
            }
          }
          
          return {
            ...kpi,
            status: isNaN(actual) ? "PENDING" : (isPass ? "PASSED" : "FAILED")
          };
        });

        logAction(currentUser.name, `Logged actual values for KPIs on pilot: ${p.challengeTitle}`, "KPIs", "Success");
        return { ...p, kpis: evaluatedKpis };
      }
      return p;
    }));
  };

  // 8. Independent Validator Actions
  const submitValidation = (pilotId, validatorClaimant, validatorResult, validatorComments, status) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        const nextStatus = status === "Verified" ? "Validated" : "Active";
        
        logAction(currentUser.name, `Validated pilot metrics: ${status} (${validatorResult})`, "Validation", "Success");
        triggerNotification("Validation Audit Complete", `Validator marked results for '${p.challengeTitle}' as ${status}.`, "Government");
        
        return {
          ...p,
          status: nextStatus,
          validationDetails: {
            status,
            validatorClaimant,
            validatorResult,
            validatorComments,
            validatorFile: "Independent_Audit_Report.pdf"
          }
        };
      }
      return p;
    }));
  };

  // 9. Payment Management
  const updatePaymentStatus = (paymentId, status) => {
    setPayments(prev => prev.map(pay => {
      if (pay.id === paymentId) {
        const timestamp = status === "Paid" ? new Date().toISOString().split('T')[0] : null;
        
        // Find pilot and update milestone status
        setPilots(currentPilots => currentPilots.map(p => {
          if (p.id === pay.pilotId) {
            const updatedMilestones = p.milestones.map(m => {
              if (m.id === pay.milestoneId) {
                return { ...m, status: status === "Paid" ? "Paid" : "In Progress" };
              }
              return m;
            });
            
            // Check if all milestones are paid, and update pilot state
            const allCompleted = updatedMilestones.every(m => m.status === "Paid");
            let nextPilotStatus = p.status;
            if (allCompleted && p.status === "Active") {
              nextPilotStatus = "Completed";
            }

            return { ...p, milestones: updatedMilestones, status: nextPilotStatus };
          }
          return p;
        }));

        // Trigger notifications
        triggerNotification(
          "Payment Status Updated", 
          `Milestone payment of $${pay.amount} is now ${status}`, 
          "Startup"
        );
        logAction(currentUser.name, `Updated payment request state to: ${status} for ${pay.startupName}`, "Payments", "Success");

        return { ...pay, status, paidDate: timestamp };
      }
      return pay;
    }));
  };

  // Function for Startup to request/invoice a milestone
  const requestMilestonePayment = (pilotId, milestoneId) => {
    setPayments(prev => {
      // Look for a payment that matches and is in "Draft"
      let found = false;
      let targetMilestoneTitle = "Milestone";
      const updated = prev.map(pay => {
        if (pay.pilotId === pilotId && pay.milestoneId === milestoneId && (pay.status === "Draft" || pay.status === "Rejected")) {
          found = true;
          targetMilestoneTitle = pay.milestoneTitle;
          return { ...pay, status: "Pending Approval", invoiceDate: new Date().toISOString().split('T')[0] };
        }
        return pay;
      });
      if (found) {
        const p = pilots.find(x => x.id === pilotId);
        logAction(p?.startupName || "Startup", `Invoiced milestone payment request for pilot: ${p?.challengeTitle}`, "Payments", "Success");
        triggerNotification("New Invoice Received", `${p?.startupName} submitted an invoice for ${targetMilestoneTitle}`, "Finance");
        return updated;
      }
      return prev;
    });
  };

  // 10. Scale-Up Decision
  const submitScaleUpDecision = (pilotId, decision, comments) => {
    setPilots(prev => prev.map(p => {
      if (p.id === pilotId) {
        let finalStatus = "Validated";
        if (decision === "Scale Up") {
          finalStatus = "Scaled";
        }
        
        logAction(currentUser.name, `Final scale decision for ${p.startupName}: ${decision}`, "Scale-Up", "Success");
        triggerNotification("Scale-Up Decision Made", `Government finalized scale-up decision for '${p.challengeTitle}': ${decision}`, "Startup");
        
        return {
          ...p,
          status: finalStatus,
          scaleUpStatus: decision,
          scaleUpComments: comments
        };
      }
      return p;
    }));
  };

  // Notification read helper
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      challenges,
      applications,
      evaluations,
      pilots,
      payments,
      notifications,
      auditLogs,
      currentRole,
      currentUser,
      toasts,
      addToast,
      setCurrentRole,
      publishChallenge,
      submitApplication,
      updateApplicationStatus,
      submitEvaluation,
      createPilot,
      approveContract,
      requestContractChanges,
      updateKPIValues,
      submitValidation,
      updatePaymentStatus,
      requestMilestonePayment,
      submitScaleUpDecision,
      markNotificationRead,
      markAllNotificationsRead,
      logAction,
      triggerNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
