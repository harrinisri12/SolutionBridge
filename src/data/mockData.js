export const DEPARTMENTS = [
  "Health Department",
  "Rural Development",
  "Municipal Administration",
  "Agriculture Department",
  "Transport Department"
];

export const STARTUPS = [
  {
    id: "startup-1",
    name: "HealthTech Solutions",
    email: "info@healthtech.com",
    registrationDetails: "REG-987654-A (Incorporated 2021)",
    recognition: "DPIIT Recognized (DPIIT-837482)",
    sector: "Healthcare",
    technologies: ["AI/ML", "IoT Sensors", "Telemedicine", "Cloud Infrastructure"],
    team: [
      { name: "Dr. Aisha Rao", role: "CEO & Co-founder" },
      { name: "Mark Peterson", role: "CTO" },
      { name: "Sanjay Mehta", role: "Head of Operations" }
    ],
    experience: "5+ years developing digital health platforms for rural and low-resource environments. Deployed 20+ clinic kits globally.",
    certifications: ["ISO 27001", "HIPAA Compliant", "CE Certified", "GDPR Compliant"],
    solution: "A solar-powered, low-bandwidth smart telemedicine kit with integrated diagnostic sensors and AI-assisted triage capabilities.",
    documents: [
      { id: "doc-1", name: "DPIIT_Recognition_Certificate.pdf", size: "1.2 MB", uploadDate: "2026-08-10" },
      { id: "doc-2", name: "ISO27001_Compliance_Audit.pdf", size: "3.4 MB", uploadDate: "2026-08-11" },
      { id: "doc-3", name: "Clinical_Trial_Efficacy_Report.pdf", size: "4.8 MB", uploadDate: "2026-08-12" }
    ]
  },
  {
    id: "startup-2",
    name: "RuralCare Labs",
    email: "contact@ruralcare.io",
    registrationDetails: "REG-123456-B (Incorporated 2022)",
    recognition: "DPIIT Recognized (DPIIT-910293)",
    sector: "Healthcare",
    technologies: ["Telemedicine", "Edge Computing", "Mobile App"],
    team: [
      { name: "Priya Sharma", role: "Founder & CEO" },
      { name: "Amit Patel", role: "Lead Engineer" }
    ],
    experience: "3 years developing low-cost diagnostic tools for rural health workers in North India.",
    certifications: ["ISO 9001", "HIPAA Compliant"],
    solution: "Mobile offline-first diagnostic assistant utilizing edge machine learning models for visual symptom checks.",
    documents: [
      { id: "doc-4", name: "Incorporation_Certificate.pdf", size: "850 KB", uploadDate: "2026-08-15" }
    ]
  },
  {
    id: "startup-3",
    name: "MedTech Systems",
    email: "sales@medtechsystems.com",
    registrationDetails: "REG-555112-C (Incorporated 2020)",
    recognition: "DPIIT Recognized (DPIIT-281038)",
    sector: "Healthcare",
    technologies: ["AI/ML", "SaaS", "Medical Devices"],
    team: [
      { name: "Vikram Sen", role: "CEO" },
      { name: "Sarah Connor", role: "Chief Medical Officer" }
    ],
    experience: "6 years supplying high-accuracy screening equipment to regional hospitals.",
    certifications: ["ISO 13485", "CDSCO Registered"],
    solution: "AI-enhanced cardiac screening hardware that plugs directly into basic Android devices.",
    documents: [
      { id: "doc-5", name: "CDSCO_Registration_Doc.pdf", size: "2.1 MB", uploadDate: "2026-08-01" }
    ]
  },
  {
    id: "startup-4",
    name: "AgriGrow Tech",
    email: "contact@agrigrow.com",
    registrationDetails: "REG-777321-T (Incorporated 2021)",
    recognition: "DPIIT Recognized (DPIIT-371829)",
    sector: "Agriculture",
    technologies: ["Drones", "IoT Sensors", "AI/ML"],
    team: [
      { name: "Rajesh Kumar", role: "CEO & Agronomist" },
      { name: "Divya Das", role: "Hardware Architect" }
    ],
    experience: "4 years developing precision agriculture tools and drone-based multispectral indexing systems.",
    certifications: ["ISO 9001", "DGCA Drone License Certificate"],
    solution: "Smart multispectral imaging combined with soil moisture micro-probes to predict crop pests and optimize irrigation.",
    documents: [
      { id: "doc-6", name: "DGCA_Drone_License.pdf", size: "1.5 MB", uploadDate: "2026-08-18" }
    ]
  },
  {
    id: "startup-5",
    name: "EcoTransit Solutions",
    email: "hello@ecotransit.org",
    registrationDetails: "REG-888999-E (Incorporated 2022)",
    recognition: "DPIIT Recognized (DPIIT-839210)",
    sector: "Transportation",
    technologies: ["GPS Tracking", "Edge Computing", "SaaS"],
    team: [
      { name: "Kunal Shah", role: "Founder & Logistics Expert" },
      { name: "Jane Doe", role: "CTO" }
    ],
    experience: "3 years in municipal transit routing and electric vehicle battery lifecycle tracking.",
    certifications: ["ISO 14001"],
    solution: "Dynamic public transit routing algorithms powered by cellular triangulation and bus GPS data to optimize wait times.",
    documents: [
      { id: "doc-7", name: "ISO14001_Environmental_Cert.pdf", size: "1.7 MB", uploadDate: "2026-07-20" }
    ]
  },
  {
    id: "startup-6",
    name: "SmartGrid Innovations",
    email: "eng@smartgrid.io",
    registrationDetails: "REG-112233-S (Incorporated 2021)",
    recognition: "DPIIT Recognized (DPIIT-718293)",
    sector: "Energy",
    technologies: ["IoT Sensors", "Blockchain", "SaaS"],
    team: [{ name: "Alex Wong", role: "CEO" }, { name: "Ria Pillai", role: "Grid Architect" }],
    experience: "4 years in smart energy metering and local solar microgrid coordination.",
    certifications: ["IEEE Smart Grid Member", "ISO 27001"],
    solution: "A local peer-to-peer energy sharing transaction ledger and smart grid adapter to reduce grid loads.",
    documents: []
  },
  {
    id: "startup-7",
    name: "SafeWater Dynamics",
    email: "clean@safewater.net",
    registrationDetails: "REG-334455-W (Incorporated 2020)",
    recognition: "DPIIT Recognized (DPIIT-554433)",
    sector: "Water & Sanitation",
    technologies: ["IoT Sensors", "Edge Computing"],
    team: [{ name: "Nikhil Joshi", role: "CEO" }, { name: "Dr. Clara Barton", role: "Water Quality Advisor" }],
    experience: "5 years building water purification sensors and inline spectrophotometers for remote reservoirs.",
    certifications: ["NABL Certified Lab Partner", "ISO 9001"],
    solution: "Real-time, self-cleaning spectrophotometric water quality sensors that detect heavy metals and pathogens using edge analyses.",
    documents: [
      { id: "doc-8", name: "NABL_Test_Efficacy_Report.pdf", size: "3.2 MB", uploadDate: "2026-08-05" }
    ]
  }
];

export const CHALLENGES = [
  {
    id: "CH-2026-001",
    title: "Remote Patient Diagnostics in Rural Clinics",
    department: "Health Department",
    sector: "Healthcare",
    location: "Karnataka State (Rural Districts)",
    expectedOutcome: "Reduce average patient waiting and triage times in primary health centers (PHCs) by at least 30%, increase diagnostics accuracy to over 85%, and enable remote expert consults within 30 minutes.",
    requiredTechnology: "Telemedicine, Edge Triage, Diagnostic Sensors, Solar Integration",
    budget: 120000,
    pilotDuration: "6 Months",
    submissionDeadline: "2026-09-15",
    eligibilityRequirements: "Registered startup with DPIIT recognition. Minimum 2 years in digital health. ISO 27001 certification or HIPAA compliance required.",
    problemDescription: "Rural Primary Health Centers (PHCs) face acute shortages of medical specialists. Patients travel long distances only to wait for basic diagnostics. We require a deployment-ready hardware/software kit that allows local community workers to run reliable, automated diagnostic scans (ECG, vitals, basic blood analysis) and consult distant specialists in real-time under sparse power and internet conditions.",
    kpis: [
      { name: "Patient Waiting Time", baseline: 120, target: 80, unit: "minutes" },
      { name: "Diagnostic Accuracy", baseline: 65, target: 85, unit: "%" },
      { name: "Daily Consultations Completed", baseline: 8, target: 15, unit: "patients" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.15 },
      { criterion: "Technical Feasibility", weight: 0.20 },
      { criterion: "Innovation", weight: 0.15 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.15 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.10 }
    ],
    status: "Open"
  },
  {
    id: "CH-2026-002",
    title: "Real-time Reservoirs and Municipal Water Quality Monitoring",
    department: "Municipal Administration",
    sector: "Water & Sanitation",
    location: "Mumbai Metro Suburbs",
    expectedOutcome: "Provide early warnings for heavy metals or pathogen spikes within 10 minutes of contamination, eliminating periodic manual grab sampling.",
    requiredTechnology: "IoT Spectrophotometers, Edge Analysis, LoRaWAN",
    budget: 85000,
    pilotDuration: "4 Months",
    submissionDeadline: "2026-10-01",
    eligibilityRequirements: "Established startup working in water technology. Hardware must be weatherproof and run autonomously on batteries for at least 12 months.",
    problemDescription: "Traditional municipal water testing relies on physical samples collected weekly. This creates a dangerous blind spot for sudden contamination events. We seek self-cleaning, low-cost inline sensors that measure turbidity, pH, chlorine, dissolved oxygen, and heavy metals, transmitting data wirelessly to a centralized command room via municipal networks.",
    kpis: [
      { name: "Contamination Detection Latency", baseline: 4320, target: 15, unit: "minutes" },
      { name: "False Alarm Rate", baseline: 25, target: 5, unit: "%" },
      { name: "Sensor Battery Lifespan", baseline: 3, target: 12, unit: "months" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.15 },
      { criterion: "Technical Feasibility", weight: 0.25 },
      { criterion: "Innovation", weight: 0.10 },
      { criterion: "Scalability", weight: 0.20 },
      { criterion: "Cost Effectiveness", weight: 0.15 },
      { criterion: "Team Capability", weight: 0.05 },
      { criterion: "Security", weight: 0.10 }
    ],
    status: "Open"
  },
  {
    id: "CH-2026-003",
    title: "Optimized Public Transit Dispatching using Urban Congestion Analytics",
    department: "Transport Department",
    sector: "Transportation",
    location: "Bengaluru Core Ring Road",
    expectedOutcome: "Increase bus punctuality by 25% during rush hour and reduce average commuter wait times by 10 minutes.",
    requiredTechnology: "GPS Tracking, Dynamic Scheduling algorithms, Dashboard UI",
    budget: 95000,
    pilotDuration: "3 Months",
    submissionDeadline: "2026-09-30",
    eligibilityRequirements: "Startups with ready APIs or routing algorithms capable of handling at least 10,000 GPS concurrent signals.",
    problemDescription: "Buses on major arterials experience erratic bunching and long delays due to heavy traffic. We require an algorithm-driven dispatch coordinator that pulls real-time municipal vehicle coordinates, predicts congestion spikes, and dynamically triggers spacing holds or route diversions to maintain transit frequency.",
    kpis: [
      { name: "Commuter Average Wait Time", baseline: 28, target: 18, unit: "minutes" },
      { name: "Bus Schedule Adherence", baseline: 62, target: 87, unit: "%" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.10 },
      { criterion: "Technical Feasibility", weight: 0.30 },
      { criterion: "Innovation", weight: 0.20 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.10 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.05 }
    ],
    status: "Open"
  },
  {
    id: "CH-2026-004",
    title: "Early Pest and Disease Diagnosis for Arid Smallholder Farms",
    department: "Agriculture Department",
    sector: "Agriculture",
    location: "Rajasthan State (Semi-arid Zones)",
    expectedOutcome: "Identify crop infections 7 days before visual signs appear on leaves to reduce pesticide usage by 30% and boost yields by 15%.",
    requiredTechnology: "Multispectral Drone Analytics, IoT Soil Probes, Edge Computing",
    budget: 75000,
    pilotDuration: "5 Months",
    submissionDeadline: "2026-09-20",
    eligibilityRequirements: "Active agriculture technology startup. System must operate offline without high-bandwidth requirements.",
    problemDescription: "Smallholder farmers in arid areas suffer heavy losses from sudden infestations of root-rot and locust swarms. We need a system combining low-cost soil sensors and automated drone sweeps that analyzes chlorophyll signatures and moisture stresses to alert farmers before crops fail.",
    kpis: [
      { name: "Infection Detection Lead Time", baseline: 0, target: 7, unit: "days" },
      { name: "Crop Yield Boost", baseline: 0, target: 15, unit: "%" },
      { name: "Chemical Spray Reduction", baseline: 0, target: 30, unit: "%" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.20 },
      { criterion: "Technical Feasibility", weight: 0.20 },
      { criterion: "Innovation", weight: 0.15 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.15 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.05 }
    ],
    status: "Open"
  },
  {
    id: "CH-2026-005",
    title: "AI-based Automated Solid Waste Sorting for Local Recycling Units",
    department: "Municipal Administration",
    sector: "Municipal / Smart Cities",
    location: "Chennai City Recycling Centers",
    expectedOutcome: "Process 3 tons of mixed waste per hour per belt line with an accuracy score above 90% for recyclable extraction.",
    requiredTechnology: "Computer Vision, Edge Inference, Robotics Sorting Arms",
    budget: 110000,
    pilotDuration: "6 Months",
    submissionDeadline: "2026-09-10",
    eligibilityRequirements: "Prior prototypes or deployments in robotic vision or industrial automation required.",
    problemDescription: "Manual recycling sorting is hazardous and slow. We seek a computer vision and mechanical arm kit that can be bolted onto existing municipal conveyor belts to automatically identify and sort PET plastic, cardboard, glass, and aluminum containers.",
    kpis: [
      { name: "Waste Sorting Throughput", baseline: 0.8, target: 3.0, unit: "tons/hour" },
      { name: "Sorting Classification Accuracy", baseline: 55, target: 90, unit: "%" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.10 },
      { criterion: "Technical Feasibility", weight: 0.30 },
      { criterion: "Innovation", weight: 0.15 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.10 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.10 }
    ],
    status: "Open"
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    challengeId: "CH-2026-001",
    startupId: "startup-1",
    status: "Shortlisted",
    submittedDate: "2026-08-12",
    solutionDescription: "HealthTech Solutions proposes the 'Rural Diagnostics Hub' - a solar-powered rugged terminal that connects specialized Bluetooth diagnostic modules (ECG, Pulse-ox, thermometer, and blood draw analyzers) to an offline-first patient registry app. It syncs with cloud systems when signal is present, and schedules remote consult sessions with medical college experts automatically.",
    proposedTechnology: "Telemedicine Kit, Bluetooth Medical Sensors, Low-Bandwidth Syncing Engine",
    implementationPlan: "Month 1: Triage site selection and community mobilization. Month 2: Equipment deployment and local nurse training. Months 3-5: Run active consultations, track KPI logs. Month 6: Collate validation data and generate report.",
    expectedImpact: "Directly solve rural specialist deficiency. Reduce transport cost and consultation delay times for patients by 70%.",
    costProposal: [
      { item: "Hardware Kits (10 PHCs)", cost: 50000 },
      { item: "Software Licensing & Support (6 Months)", cost: 25000 },
      { item: "Field Nurse & Technical Training", cost: 15000 },
      { item: "Validation Proof & Travel Logs", cost: 10000 },
      { item: "Contingency Fund", cost: 20000 }
    ],
    teamBios: "Dr. Aisha Rao (Ex-AIMS pediatrician, 10 yrs clinical experience), Mark Peterson (M.S. Embedded Architect from MIT).",
    documents: [
      { id: "appdoc-1", name: "Technical_Proposal_Detailed.pdf", size: "2.4 MB" },
      { id: "appdoc-2", name: "Budget_Breakdown_Excel.xlsx", size: "1.1 MB" }
    ]
  },
  {
    id: "app-102",
    challengeId: "CH-2026-001",
    startupId: "startup-2",
    status: "Under Review",
    submittedDate: "2026-08-16",
    solutionDescription: "RuralCare Labs proposes using generic mobile phones for diagnostics. The app guides community health workers to take facial, throat, and skin images, utilizing lightweight local deep learning models on the phone to flag major bacterial/viral symptoms without specialized hardware sensors.",
    proposedTechnology: "Offline Edge ML Mobile App",
    implementationPlan: "Month 1: Install app on 20 health worker phones. Months 2-5: Live field logs and verification. Month 6: Final audit.",
    expectedImpact: "Zero-cost hardware solution, fits in worker pockets, scales instantly.",
    costProposal: [
      { item: "Software Customization & Models", cost: 40000 },
      { item: "Training Programs", cost: 20000 },
      { item: "Audits & Overheads", cost: 15000 }
    ],
    teamBios: "Priya Sharma (M.Tech Computer Science, 5 yrs Android experience), Amit Patel (Hardware QA).",
    documents: [
      { id: "appdoc-3", name: "Offline_ML_Models_Efficacy.pdf", size: "3.2 MB" }
    ]
  },
  {
    id: "app-103",
    challengeId: "CH-2026-001",
    startupId: "startup-3",
    status: "Eligible",
    submittedDate: "2026-08-18",
    solutionDescription: "MedTech Systems proposes 'Cardio-Check Mobile' - specialized 12-lead ECG devices that pair with Android tablets, uploading telemetry via satellite terminals.",
    proposedTechnology: "Cardiac Hardware and Satellite Terminals",
    implementationPlan: "Month 1-2: Station and hardware setup. Month 3-6: Patient triage operations.",
    expectedImpact: "Early detection of heart blocks and heart attacks in remote zones.",
    costProposal: [
      { item: "Specialized ECG Terminals (5 Units)", cost: 70000 },
      { item: "Satellite Network Subscriptions", cost: 30000 },
      { item: "Consultation Costs", cost: 20000 }
    ],
    teamBios: "Vikram Sen (Biomedical engineer, 12 patents), Sarah Connor (Biostatistician).",
    documents: []
  },
  {
    id: "app-104",
    challengeId: "CH-2026-002",
    startupId: "startup-7",
    status: "Submitted",
    submittedDate: "2026-08-19",
    solutionDescription: "SafeWater Dynamics proposes automated spectrophotometric array sensors installed inside water headers and supply lines. The units use a pneumatic pump to draw water, analyze light transmission across 6 wavelengths to detect micro-particles, and self-clean using ultrasonic waves.",
    proposedTechnology: "Spectrophotometric Sensor Modules, LoRa Transceivers, Cleaning Mechanism",
    implementationPlan: "Month 1: Prototype calibration in municipal lab. Month 2: Install at 5 main headers. Month 3-4: Auto testing and live dash monitoring.",
    expectedImpact: "Spot chemical discharges or organic contamination events immediately, preventing reservoir shutdowns.",
    costProposal: [
      { item: "Sensor Hardware (5 Stations)", cost: 45000 },
      { item: "LoRa Gateway & Dashboard Installation", cost: 20000 },
      { item: "Maintenance and Reagents", cost: 20000 }
    ],
    teamBios: "Nikhil Joshi (B.Tech Chemical Engineering), Dr. Clara Barton (Research Scientist, 15 yrs in water safety).",
    documents: [
      { id: "appdoc-4", name: "SafeWater_Spectro_Specs.pdf", size: "4.5 MB" }
    ]
  }
];

export const INITIAL_EVALUATIONS = [
  {
    id: "eval-201",
    applicationId: "app-101",
    expertId: "expert-1",
    expertName: "Dr. Ramesh Chandra (Professor, Medical Informatics)",
    scores: {
      problemUnderstanding: 90,
      technicalFeasibility: 85,
      innovation: 90,
      scalability: 95,
      costEffectiveness: 80,
      teamCapability: 95,
      security: 90
    },
    comments: "Excellent submission. The team has deep practical field understanding. The solar backup is highly practical. The diagnostic suite is comprehensive. Recommending this highly for the pilot stage.",
    submittedDate: "2026-08-25"
  },
  {
    id: "eval-202",
    applicationId: "app-102",
    expertId: "expert-1",
    expertName: "Dr. Ramesh Chandra (Professor, Medical Informatics)",
    scores: {
      problemUnderstanding: 80,
      technicalFeasibility: 60,
      innovation: 85,
      scalability: 90,
      costEffectiveness: 95,
      teamCapability: 70,
      security: 80
    },
    comments: "Innovative concept, but visual-only AI diagnosis has high false margins. Lacks diagnostic hardware checks for actual vitals (like ECG/pressure). Feasibility is questionable for complex clinical cases.",
    submittedDate: "2026-08-26"
  }
];

export const INITIAL_PILOTS = [
  {
    id: "pilot-301",
    challengeId: "CH-2026-001",
    challengeTitle: "Remote Patient Diagnostics in Rural Clinics",
    startupId: "startup-1",
    startupName: "HealthTech Solutions",
    department: "Health Department",
    location: "Karnataka State (Rural Districts)",
    startDate: "2026-09-01",
    endDate: "2027-02-28",
    budget: 120000,
    status: "Active", // Planning, Active, Completed, Validated, Scaled
    contractApproved: true,
    objectives: "Deploy smart diagnostic kits across 10 rural Primary Health Centers. Establish live connections with district hubs. Treat at least 500 patients.",
    milestones: [
      { id: "m-1", title: "Requirement Gathering & Site Setup", weight: 20, budgetShare: 24000, dueDate: "2026-09-30", status: "Paid" },
      { id: "m-2", title: "Hardware Deploy & Staff Training", weight: 20, budgetShare: 24000, dueDate: "2026-11-15", status: "Paid" },
      { id: "m-3", title: "Live Pilot Run & Triage Optimization", weight: 30, budgetShare: 36000, dueDate: "2026-12-31", status: "Pending" },
      { id: "m-4", title: "Final Evaluation & Validator Audit", weight: 30, budgetShare: 36000, dueDate: "2027-02-28", status: "Pending" }
    ],
    kpis: [
      { name: "Patient Waiting Time", baseline: 120, target: 80, actual: 72, unit: "minutes", status: "PASSED" },
      { name: "Diagnostic Accuracy", baseline: 65, target: 85, actual: 88, unit: "%", status: "PASSED" },
      { name: "Daily Consultations Completed", baseline: 8, target: 15, actual: 16, unit: "patients", status: "PASSED" }
    ],
    validationDetails: {
      status: "Unverified", // Verified, Not Verified, Unverified
      validatorClaimant: "Startup claims 40% wait reduction (72m vs 120m). Accuracy validated at 88%.",
      validatorResult: "",
      validatorComments: "",
      validatorFile: ""
    },
    scaleUpScore: 0,
    scaleUpStatus: "Under Review" // Scale Up, Improve & Retest, Reject, Under Review
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: "pay-401",
    pilotId: "pilot-301",
    pilotTitle: "Remote Patient Diagnostics in Rural Clinics",
    startupName: "HealthTech Solutions",
    milestoneId: "m-1",
    milestoneTitle: "Requirement Gathering & Site Setup",
    percentage: 20,
    amount: 24000,
    status: "Paid",
    invoiceDate: "2026-09-05",
    paidDate: "2026-09-08"
  },
  {
    id: "pay-402",
    pilotId: "pilot-301",
    pilotTitle: "Remote Patient Diagnostics in Rural Clinics",
    startupName: "HealthTech Solutions",
    milestoneId: "m-2",
    milestoneTitle: "Hardware Deploy & Staff Training",
    percentage: 20,
    amount: 24000,
    status: "Paid",
    invoiceDate: "2026-11-18",
    paidDate: "2026-11-22"
  },
  {
    id: "pay-403",
    pilotId: "pilot-301",
    pilotTitle: "Remote Patient Diagnostics in Rural Clinics",
    startupName: "HealthTech Solutions",
    milestoneId: "m-3",
    milestoneTitle: "Live Pilot Run & Triage Optimization",
    percentage: 30,
    amount: 36000,
    status: "Pending Approval",
    invoiceDate: "2026-12-28",
    paidDate: null
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Challenge Published",
    message: "Health Department has published 'Remote Patient Diagnostics in Rural Clinics'.",
    date: "2026-08-01",
    read: false,
    role: "Startup"
  },
  {
    id: "notif-2",
    title: "Application Submitted",
    message: "HealthTech Solutions has submitted an application for 'Remote Patient Diagnostics in Rural Clinics'.",
    date: "2026-08-12",
    read: true,
    role: "Government"
  },
  {
    id: "notif-3",
    title: "Evaluation Request",
    message: "Expert Ramesh Chandra was assigned to evaluate HealthTech Solutions' application.",
    date: "2026-08-14",
    read: true,
    role: "Expert"
  },
  {
    id: "notif-4",
    title: "Application Shortlisted",
    message: "Your application for Remote Patient Diagnostics has been shortlisted by the screening committee.",
    date: "2026-08-16",
    read: false,
    role: "Startup"
  }
];

export const INITIAL_AUDIT_LOGS = [
  { id: "log-1", user: "Govt Officer (Health)", action: "Published Challenge", module: "Challenges", date: "2026-08-01 10:30 AM", status: "Success" },
  { id: "log-2", user: "HealthTech Solutions", action: "Submitted Application", module: "Applications", date: "2026-08-12 04:15 PM", status: "Success" },
  { id: "log-3", user: "Govt Officer (Health)", action: "Shortlisted Application", module: "Screening", date: "2026-08-16 02:40 PM", status: "Success" },
  { id: "log-4", user: "Expert Ramesh Chandra", action: "Submitted Evaluation", module: "Evaluations", date: "2026-08-25 11:22 AM", status: "Success" }
];
