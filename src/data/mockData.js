// ==========================================
// GOVERNMENT INNOVATION PROCUREMENT PLATFORM
// Real-world Government Mock Dataset
// ==========================================

export const DEPARTMENTS = [
  "Water Resources Department",
  "Health & Family Welfare Department",
  "Municipal Administration & Urban Development",
  "Agriculture & Farmers Empowerment",
  "Transport & Urban Mobility Department",
  "Renewable Energy & Environment"
];

export const CATEGORIES = [
  "Water",
  "Healthcare",
  "Agriculture",
  "Transport",
  "Energy",
  "Waste Management",
  "Public Safety"
];

export const STARTUPS = [
  {
    id: "startup-1",
    name: "AquaTech Solutions",
    email: "contact@aquatech.io",
    phone: "+91 98450 12345",
    registrationDetails: "CIN: U74999KA2021PTC148920 (Inc. 2021)",
    recognition: "DPIIT Recognized (DPIIT-837482)",
    sector: "Water",
    founder: "Dr. Arvind Subramaniam",
    teamSize: "24 members",
    location: "Bengaluru, Karnataka",
    technologies: ["IoT Spectrophotometry", "Edge Computing", "LoRaWAN", "AI Anomaly Detection"],
    solution: "Self-cleaning spectrophotometric IoT sensors providing real-time potable water contamination early warnings within 10 minutes.",
    certifications: ["ISO 9001:2015", "NABL Accredited Lab Partner", "CE Certified", "RoHS Compliant"],
    documents: [
      { id: "doc-101", name: "DPIIT_Startup_Certificate.pdf", size: "1.2 MB", uploadDate: "2026-06-12" },
      { id: "doc-102", name: "NABL_Test_Validation_Report.pdf", size: "3.4 MB", uploadDate: "2026-07-05" },
      { id: "doc-103", name: "Detailed_Project_Report_DPR.pdf", size: "5.1 MB", uploadDate: "2026-07-15" }
    ]
  },
  {
    id: "startup-2",
    name: "GreenGrid Innovations",
    email: "info@greengrid.tech",
    phone: "+91 97110 44556",
    registrationDetails: "CIN: U40106DL2020PTC368112 (Inc. 2020)",
    recognition: "DPIIT Recognized (DPIIT-910293)",
    sector: "Energy",
    founder: "Meera Nair",
    teamSize: "18 members",
    location: "New Delhi, NCR",
    technologies: ["Smart Microgrid Controller", "AI Load Forecasting", "SCADA Integration"],
    solution: "Edge-intelligent solar microgrid synchronization and battery optimization controllers reducing diesel generator reliance by 45%.",
    certifications: ["ISO 27001", "IEEE 1547 Standard Compliant"],
    documents: [
      { id: "doc-201", name: "DPIIT_Recognition_GreenGrid.pdf", size: "1.1 MB", uploadDate: "2026-05-18" },
      { id: "doc-202", name: "Microgrid_Simulation_Benchmarking.pdf", size: "4.2 MB", uploadDate: "2026-06-20" }
    ]
  },
  {
    id: "startup-3",
    name: "SmartFarm Technologies",
    email: "hello@smartfarmtech.in",
    phone: "+91 94480 88990",
    registrationDetails: "CIN: U01100MH2022PTC379201 (Inc. 2022)",
    recognition: "DPIIT Recognized (DPIIT-371829)",
    sector: "Agriculture",
    founder: "Rajeshwar Patil",
    teamSize: "15 members",
    location: "Pune, Maharashtra",
    technologies: ["Multispectral Drone Imaging", "Soil Microbiome Probes", "Weather AI"],
    solution: "Hyperlocal soil moisture sensing network integrated with autonomous drone pest surveillance to reduce agricultural water consumption by 35%.",
    certifications: ["DGCA Type Certified Drone", "ISO 9001"],
    documents: [
      { id: "doc-301", name: "DGCA_Commercial_Drone_License.pdf", size: "1.8 MB", uploadDate: "2026-06-10" },
      { id: "doc-302", name: "ICAR_Pest_Reduction_Trial_Data.pdf", size: "3.7 MB", uploadDate: "2026-07-02" }
    ]
  },
  {
    id: "startup-4",
    name: "CivicSense Labs",
    email: "partners@civicsense.org",
    phone: "+91 98200 66778",
    registrationDetails: "CIN: U72900TG2021PTC154210 (Inc. 2021)",
    recognition: "DPIIT Recognized (DPIIT-839210)",
    sector: "Transport",
    founder: "Ananya Deshmukh",
    teamSize: "22 members",
    location: "Hyderabad, Telangana",
    technologies: ["Computer Vision", "Edge AI Cameras", "Dynamic Traffic Signal Timing"],
    solution: "Adaptive AI camera system that analyzes urban intersection traffic congestion in real time to dynamically adjust signal cycle lengths and clear emergency lanes.",
    certifications: ["ISO 27001", "C-DAC Certified Algorithm"],
    documents: [
      { id: "doc-401", name: "Traffic_Flow_Pilot_Results.pdf", size: "2.9 MB", uploadDate: "2026-07-11" }
    ]
  },
  {
    id: "startup-5",
    name: "AuraMed Diagnostics",
    email: "support@auramed.health",
    phone: "+91 99100 23456",
    registrationDetails: "CIN: U85100KA2020PTC139882 (Inc. 2020)",
    recognition: "DPIIT Recognized (DPIIT-554433)",
    sector: "Healthcare",
    founder: "Dr. Sneha Roy",
    teamSize: "30 members",
    location: "Bengaluru, Karnataka",
    technologies: ["AI Diagnostic Triage", "Portable Point-of-Care Hardware", "Telemedicine Cloud"],
    solution: "Solar-powered, backpack-portable clinic diagnostic kits enabling non-invasive 12-lead ECG, blood profiles, and instant tele-consultation in remote primary health centres.",
    certifications: ["CDSCO Approved Medical Device", "ISO 13485", "HIPAA Compliant"],
    documents: [
      { id: "doc-501", name: "CDSCO_Device_Approval.pdf", size: "2.4 MB", uploadDate: "2026-05-10" },
      { id: "doc-502", name: "Clinical_Trial_Efficacy_AIIMS.pdf", size: "6.2 MB", uploadDate: "2026-06-25" }
    ]
  },
  {
    id: "startup-6",
    name: "EcoBin Robotics",
    email: "sales@ecobinrobotics.com",
    phone: "+91 98800 11223",
    registrationDetails: "CIN: U29300TN2022PTC149110 (Inc. 2022)",
    recognition: "DPIIT Recognized (DPIIT-667788)",
    sector: "Waste Management",
    founder: "Karthik Sundaram",
    teamSize: "14 members",
    location: "Chennai, Tamil Nadu",
    technologies: ["Hyperspectral Optical Sorting", "Robotic Arms", "Pneumatic Ejectors"],
    solution: "High-speed automated municipal solid waste sorting robotic line segregating 94% dry recyclables at 1.5 tons/hour throughput.",
    certifications: ["ISO 14001", "CPCB Clean Tech Certified"],
    documents: [
      { id: "doc-601", name: "CPCB_Compliance_Testing.pdf", size: "2.1 MB", uploadDate: "2026-07-28" }
    ]
  },
  {
    id: "startup-7",
    name: "SafeNet Surveillance",
    email: "security@safenet.ai",
    phone: "+91 98765 99887",
    registrationDetails: "CIN: U74999MH2021PTC362019 (Inc. 2021)",
    recognition: "DPIIT Recognized (DPIIT-778899)",
    sector: "Public Safety",
    founder: "Vikram Malhotra",
    teamSize: "20 members",
    location: "Mumbai, Maharashtra",
    technologies: ["Acoustic Sensor Triangulation", "Edge Vision", "GIS Heatmap"],
    solution: "Instant acoustic & vision-based crowd panic and incident detection system for high-density railway stations and public gatherings.",
    certifications: ["ISO 27001", "STQC Security Certified"],
    documents: [
      { id: "doc-701", name: "STQC_Cybersecurity_Audit.pdf", size: "1.9 MB", uploadDate: "2026-08-01" }
    ]
  }
];

export const CHALLENGES = [
  {
    id: "CH-2026-001",
    title: "Real-time Potable Water Quality Monitoring in Municipal Reservoirs",
    department: "Water Resources Department",
    category: "Water",
    budget: "₹ 85,00,000",
    budgetNumeric: 8500000,
    deadline: "2026-09-30",
    status: "Published", // Draft, Published, Closed
    applicationsCount: 14,
    pilotDuration: "6 Months",
    location: "Varanasi & Kanpur Urban Reservoirs",
    problemDescription: "Traditional manual grab sampling of municipal water distribution networks takes 24 to 72 hours for laboratory bacteriological and chemical assays. Sudden contamination events or pipeline leaks can go undetected for days, posing severe public health risks to over 1.8 million citizens.",
    expectedSolution: "Autonomous, self-cleaning inline sensor nodes capable of continuous spectrophotometric measurement of turbidity, free chlorine, pH, conductivity, dissolved oxygen, and heavy metal traces with cellular/LoRaWAN telemetry.",
    eligibilityCriteria: "DPIIT recognized startups with minimum TRL-7 prototype, demonstrated field reliability under Indian water conditions, and ISO 9001 / NABL compliance.",
    requiredTechnology: "IoT Spectrophotometry, Edge Processing, Long-life Battery / Solar harvesting, LoRaWAN",
    pilotRequirements: "Deploy 25 continuous monitoring nodes across 5 critical reservoir inlets and distribution pump houses for 6 months. Maintain 99.5% uptime and detect anomalies within 15 minutes of occurrence."
  },
  {
    id: "CH-2026-002",
    title: "Portable Point-of-Care Diagnostic Kits for Rural Primary Health Centres",
    department: "Health & Family Welfare Department",
    category: "Healthcare",
    budget: "₹ 1,20,00,000",
    budgetNumeric: 12000000,
    deadline: "2026-10-15",
    status: "Published",
    applicationsCount: 22,
    pilotDuration: "6 Months",
    location: "Koppal & Raichur Rural PHCs, Karnataka",
    problemDescription: "Primary Health Centres in remote tribal and rural areas suffer from acute shortage of medical specialists. Patients travel over 45 km for basic cardiac, blood, and vital screenings, causing delayed clinical intervention and high out-of-pocket costs.",
    expectedSolution: "Battery-operated, ruggedized diagnostic kits that enable Accredited Social Health Activists (ASHA) and PHC nurses to perform automated 12-lead ECG, basic biochemistry, HbA1c, and tele-triage with distant specialists via low-bandwidth satellite/cellular links.",
    eligibilityCriteria: "CDSCO registered medical device startup or certified ISO 13485 manufacturer with validated clinical trial data from a recognized medical institution.",
    requiredTechnology: "Edge AI diagnostic triage, Portable multi-parameter hardware, Telemedicine Cloud, Solar backup",
    pilotRequirements: "Deploy 40 diagnostic kits across 20 remote PHCs. Conduct at least 2,500 patient diagnostic sessions and achieve >85% diagnostic concordance with senior medical officers."
  },
  {
    id: "CH-2026-003",
    title: "AI-Powered Dynamic Traffic Congestion Control & Emergency Corridor Management",
    department: "Transport & Urban Mobility Department",
    category: "Transport",
    budget: "₹ 95,00,000",
    budgetNumeric: 9500000,
    deadline: "2026-10-05",
    status: "Published",
    applicationsCount: 18,
    pilotDuration: "4 Months",
    location: "Ring Road Corridor, Hyderabad",
    problemDescription: "Fixed-time traffic signals fail to adapt to unpredictable peak-hour surges and VIP/ambulance movements, resulting in average corridor travel delays of 48 minutes and elevated vehicular emissions.",
    expectedSolution: "Vision-based edge sensors that compute real-time queue lengths and vehicle classifications to dynamically adjust green signal phases and automatically preempt signals for emergency vehicles.",
    eligibilityCriteria: "Startups with functional computer vision traffic algorithms, proven integration with standard ITS signal controllers, and DPIIT recognition.",
    requiredTechnology: "Computer Vision, Edge GPU compute, ITS Controller APIs, 5G/4G telemetry",
    pilotRequirements: "Integrate with 12 consecutive high-density intersections along the corridor. Achieve at least 20% reduction in average commute delay and 40% reduction in ambulance transit delay."
  },
  {
    id: "CH-2026-004",
    title: "Autonomous High-Throughput Optical Municipal Dry Waste Segregation",
    department: "Municipal Administration & Urban Development",
    category: "Waste Management",
    budget: "₹ 1,10,00,000",
    budgetNumeric: 11000000,
    deadline: "2026-11-01",
    status: "Published",
    applicationsCount: 11,
    pilotDuration: "5 Months",
    location: "Okhla Waste Recovery Facility, New Delhi",
    problemDescription: "Manual sorting of mixed municipal dry waste is hazardous, slow, and yields purity below 60%, causing valuable plastics, paper, and metals to end up in landfills.",
    expectedSolution: "Automated robotic or pneumatic sorting system utilizing hyperspectral imaging and AI classification to segregate PET, HDPE, cardboard, and aluminium cans at >= 1.5 tons/hr.",
    eligibilityCriteria: "Indian hardware startup with working conveyor sorting prototype and minimum 6 months continuous mechanical operational track record.",
    requiredTechnology: "Hyperspectral Vision, Deep Learning, Delta Robots / High-speed Air Jets",
    pilotRequirements: "Process 250 tons of incoming municipal dry waste. Achieve >= 90% purity of sorted fractions with zero human contact."
  },
  {
    id: "CH-2026-005",
    title: "Precision Micro-Irrigation & Crop Disease Forecasting via Drone IoT",
    department: "Agriculture & Farmers Empowerment",
    category: "Agriculture",
    budget: "₹ 75,00,000",
    budgetNumeric: 7500000,
    deadline: "2026-08-20",
    status: "Closed",
    applicationsCount: 16,
    pilotDuration: "6 Months",
    location: "Baramati Agri Cluster, Maharashtra",
    problemDescription: "Smallholder farmers face 30% yield losses from unmonitored fungal blights and over-irrigate fields by 40% due to lack of localized soil-atmosphere moisture data.",
    expectedSolution: "Multi-spectral drone crop health index mapping paired with solar-powered soil probes providing automated vernacular advisory and drip valve automation.",
    eligibilityCriteria: "DPIIT recognized startup with DGCA certified drone pilot operators and agronomic validation partner.",
    requiredTechnology: "Multispectral UAV, Soil Moisture Micro-probes, Vernacular Voice AI",
    pilotRequirements: "Cover 1,200 acres across 350 farmer holdings. Demonstrate 25% water saving and 20% reduction in chemical fungicide usage."
  },
  {
    id: "CH-2026-006",
    title: "Decentralized Solar Microgrid Synchronization for Rural Healthcare Facilities",
    department: "Renewable Energy & Environment",
    category: "Energy",
    budget: "₹ 60,00,000",
    budgetNumeric: 6000000,
    deadline: "2026-11-20",
    status: "Draft",
    applicationsCount: 5,
    pilotDuration: "4 Months",
    location: "Sundarbans Delta, West Bengal",
    problemDescription: "Island healthcare centres face frequent grid blackout spans up to 14 hours, jeopardizing vaccine cold chains and operating theatre readiness.",
    expectedSolution: "Intelligent microgrid controller that seamlessly balances rooftop solar, lithium battery storage, and biomass generator with sub-second switchover.",
    eligibilityCriteria: "Startups with power electronics expertise and certified battery management systems.",
    requiredTechnology: "BMS, Edge Grid Controller, IoT Monitoring",
    pilotRequirements: "Install controllers in 8 island clinics. Guarantee 100% uninterrupted power for vaccine cold storage across 120 days."
  }
];

export const APPLICATIONS = [
  {
    id: "APP-2026-001",
    startupId: "startup-1",
    startupName: "AquaTech Solutions",
    challengeId: "CH-2026-001",
    challengeTitle: "Real-time Potable Water Quality Monitoring in Municipal Reservoirs",
    department: "Water Resources Department",
    category: "Water",
    submittedDate: "2026-07-20",
    status: "Selected", // Submitted, Under Evaluation, Shortlisted, Selected, Rejected
    eligibility: "Eligible", // Eligible, Ineligible, Under Review
    estimatedCost: "₹ 78,50,000",
    proposedSolution: "Deploy AquaSense-X inline optical spectrophotometer arrays with patented ultrasonic anti-biofouling transducers. Continuous 6-channel telemetry transmits directly to state water board dashboard.",
    technicalApproach: "Multi-wavelength UV-Vis absorption spectroscopy coupled with on-sensor edge inference to detect chemical anomalies in < 8 minutes without consumable chemical reagents.",
    expectedImpact: "Eliminates 90% manual sampling overhead; detects contamination pulses within 10 minutes; protects 1.8M residents from waterborne contagion.",
    documents: [
      { name: "Technical_Proposal_AquaTech.pdf", size: "4.2 MB" },
      { name: "Bill_of_Materials_Costing.pdf", size: "1.8 MB" },
      { name: "NABL_Test_Validation.pdf", size: "3.1 MB" }
    ],
    scores: {
      technicalFeasibility: 9.2,
      innovation: 8.9,
      costEffectiveness: 8.6,
      scalability: 9.0,
      risk: 8.5,
      overallScore: 8.84
    },
    expertRecommendation: "Recommend for Pilot. Proven field trials and high hardware maturity (TRL-8). Anti-biofouling mechanism addresses the primary failure mode of municipal water sensors.",
    evaluatedBy: "Dr. Ramesh Chandra (National Water Tech Expert)",
    evaluationDate: "2026-08-05"
  },
  {
    id: "APP-2026-002",
    startupId: "startup-4",
    startupName: "CivicSense Labs",
    challengeId: "CH-2026-003",
    challengeTitle: "AI-Powered Dynamic Traffic Congestion Control & Emergency Corridor Management",
    department: "Transport & Urban Mobility Department",
    category: "Transport",
    submittedDate: "2026-07-24",
    status: "Selected",
    eligibility: "Eligible",
    estimatedCost: "₹ 88,00,000",
    proposedSolution: "CivicFlow Edge-Vision dynamic signal controllers utilizing existing municipal CCTV cameras augmented with 4K edge AI compute boxes at 12 key intersections.",
    technicalApproach: "YOLO-v8 optimized edge models running on Jetson Orin modules compute real-time saturation flow rates and automatically inject signal priority for registered emergency sirens via GPS beaconing.",
    expectedImpact: "Reduces peak-hour commute times by 23% and guarantees green wave corridors for ambulances with under 30-second preemption.",
    documents: [
      { name: "ITS_Architecture_Document.pdf", size: "5.4 MB" },
      { name: "Traffic_Simulation_Model.pdf", size: "3.9 MB" }
    ],
    scores: {
      technicalFeasibility: 8.8,
      innovation: 9.0,
      costEffectiveness: 8.7,
      scalability: 9.2,
      risk: 8.4,
      overallScore: 8.82
    },
    expertRecommendation: "Strongly Recommended. Software-defined approach avoids expensive road digging or loop detector installation.",
    evaluatedBy: "Prof. K. Venkatesh (IIT Transport Engineering)",
    evaluationDate: "2026-08-08"
  },
  {
    id: "APP-2026-003",
    startupId: "startup-5",
    startupName: "AuraMed Diagnostics",
    challengeId: "CH-2026-002",
    challengeTitle: "Portable Point-of-Care Diagnostic Kits for Rural Primary Health Centres",
    department: "Health & Family Welfare Department",
    category: "Healthcare",
    submittedDate: "2026-07-28",
    status: "Shortlisted",
    eligibility: "Eligible",
    estimatedCost: "₹ 1,12,00,000",
    proposedSolution: "AuraCare Mobile Clinic Kit: 14 kg solar-rechargeable rugged suitcase housing 12-lead ECG, multi-parameter vital monitor, dry biochemistry reader, and offline-first Android tele-triage tablet.",
    technicalApproach: "Integrated medical-grade sensors with automated diagnostic algorithm flagging critical ECG arrhythmias and diabetic ketoacidosis risk to district nodal hospital in < 60 seconds.",
    expectedImpact: "Enables 3,000+ monthly rural diagnostic tests at 1/5th traditional cost with zero travel required by patients.",
    documents: [
      { name: "CDSCO_Device_License.pdf", size: "2.5 MB" },
      { name: "AIIMS_Clinical_Trial_Summary.pdf", size: "6.1 MB" }
    ],
    scores: {
      technicalFeasibility: 9.4,
      innovation: 8.8,
      costEffectiveness: 8.9,
      scalability: 9.3,
      risk: 8.6,
      overallScore: 9.00
    },
    expertRecommendation: "Top shortlisted applicant. CDSCO certification verified. Ready for immediate deployment in Koppal rural cluster.",
    evaluatedBy: "Dr. Anjali Deshmukh (Director, Public Health Research)",
    evaluationDate: "2026-08-14"
  },
  {
    id: "APP-2026-004",
    startupId: "startup-3",
    startupName: "SmartFarm Technologies",
    challengeId: "CH-2026-005",
    challengeTitle: "Precision Micro-Irrigation & Crop Disease Forecasting via Drone IoT",
    department: "Agriculture & Farmers Empowerment",
    category: "Agriculture",
    submittedDate: "2026-08-02",
    status: "Selected",
    eligibility: "Eligible",
    estimatedCost: "₹ 68,00,000",
    proposedSolution: "AgriVision Autonomous UAV surveillance and loRaWAN underground soil probe network generating weekly NDVI crop stress maps with automated WhatsApp/SMS farmer advisories.",
    technicalApproach: "Edge multi-spectral reflectance indexing paired with localized weather micro-stations to compute evapotranspiration and trigger automated drip solenoids.",
    expectedImpact: "Demonstrated 28% water savings and 22% reduction in synthetic fungicide applications across 1,200 acres.",
    documents: [
      { name: "DGCA_Type_Certificate.pdf", size: "1.7 MB" },
      { name: "ICAR_Validation_Certificate.pdf", size: "3.3 MB" }
    ],
    scores: {
      technicalFeasibility: 8.7,
      innovation: 8.5,
      costEffectiveness: 9.1,
      scalability: 8.8,
      risk: 8.3,
      overallScore: 8.68
    },
    expertRecommendation: "Recommended. Very practical farmer advisory model with clear measurable water efficiency metrics.",
    evaluatedBy: "Dr. B. K. Hegde (Agri-Innovation Board)",
    evaluationDate: "2026-08-16"
  },
  {
    id: "APP-2026-005",
    startupId: "startup-2",
    startupName: "GreenGrid Innovations",
    challengeId: "CH-2026-006",
    challengeTitle: "Decentralized Solar Microgrid Synchronization for Rural Healthcare Facilities",
    department: "Renewable Energy & Environment",
    category: "Energy",
    submittedDate: "2026-08-08",
    status: "Under Evaluation",
    eligibility: "Eligible",
    estimatedCost: "₹ 54,00,000",
    proposedSolution: "GreenSync Intelligent Microgrid Controller with modular lithium-iron phosphate battery integration and 20ms seamless islanding transfer switch.",
    technicalApproach: "DSP-based inverter synchronization algorithms guaranteeing IEEE-1547 compliance and remote battery state-of-health tracking via NB-IoT.",
    expectedImpact: "Zero medical equipment downtime during grid cuts and 45% diesel fuel savings.",
    documents: [
      { name: "Microgrid_Electrical_Schematics.pdf", size: "4.8 MB" }
    ],
    scores: {
      technicalFeasibility: 8.2,
      innovation: 8.0,
      costEffectiveness: 8.5,
      scalability: 8.4,
      risk: 7.9,
      overallScore: 8.20
    },
    expertRecommendation: "Solid technical approach. Evaluator review in progress.",
    evaluatedBy: "Dr. P. S. Murthy (Renewable Energy Institute)",
    evaluationDate: "2026-08-20"
  },
  {
    id: "APP-2026-006",
    startupId: "startup-6",
    startupName: "EcoBin Robotics",
    challengeId: "CH-2026-004",
    challengeTitle: "Autonomous High-Throughput Optical Municipal Dry Waste Segregation",
    department: "Municipal Administration & Urban Development",
    category: "Waste Management",
    submittedDate: "2026-08-10",
    status: "Shortlisted",
    eligibility: "Eligible",
    estimatedCost: "₹ 98,00,000",
    proposedSolution: "SortBot-3000: Dual-lane high-speed optical sorter featuring near-infrared material recognition and 48-channel high-speed pneumatic air ejection nozzles.",
    technicalApproach: "NIR hyperspectral spectroscopy analyzes polymer absorption bands at 120 scans/second, triggering millisecond pneumatic blasts to segregate 5 distinct polymer types.",
    expectedImpact: "Achieves 94% dry recyclable segregation purity at 1.8 tons/hr, reducing landfill volume by 65%.",
    documents: [
      { name: "Material_Sorting_Throughput_Data.pdf", size: "3.6 MB" }
    ],
    scores: {
      technicalFeasibility: 8.9,
      innovation: 9.1,
      costEffectiveness: 8.4,
      scalability: 8.6,
      risk: 8.0,
      overallScore: 8.60
    },
    expertRecommendation: "Shortlisted. Recommend prototype inspection at vendor facility before pilot sanction.",
    evaluatedBy: "Er. S. Qureshi (CPCB Waste Management Panel)",
    evaluationDate: "2026-08-22"
  },
  {
    id: "APP-2026-007",
    startupId: "startup-7",
    startupName: "SafeNet Surveillance",
    challengeId: "CH-2026-003",
    challengeTitle: "AI-Powered Dynamic Traffic Congestion Control & Emergency Corridor Management",
    department: "Transport & Urban Mobility Department",
    category: "Transport",
    submittedDate: "2026-08-12",
    status: "Rejected",
    eligibility: "Ineligible",
    estimatedCost: "₹ 1,30,00,000",
    proposedSolution: "Acoustic crowd monitor repurposing traffic cameras for decibel spike detection.",
    technicalApproach: "Lacks native ITS traffic signal controller interface; primarily designed for acoustic crime monitoring rather than vehicular signal cycle optimization.",
    expectedImpact: "Limited relevance to traffic queue optimization requirement.",
    documents: [
      { name: "Acoustic_Monitor_Overview.pdf", size: "2.1 MB" }
    ],
    scores: {
      technicalFeasibility: 5.2,
      innovation: 6.0,
      costEffectiveness: 4.8,
      scalability: 5.5,
      risk: 4.0,
      overallScore: 5.10
    },
    expertRecommendation: "Rejected. Solution does not address dynamic green signal phase timing or ITS controller integration.",
    evaluatedBy: "Prof. K. Venkatesh (IIT Transport Engineering)",
    evaluationDate: "2026-08-18"
  }
];

export const PILOTS = [
  {
    id: "PILOT-2026-001",
    challengeId: "CH-2026-001",
    challengeTitle: "Real-time Potable Water Quality Monitoring in Municipal Reservoirs",
    startupId: "startup-1",
    startupName: "AquaTech Solutions",
    department: "Water Resources Department",
    category: "Water",
    location: "Varanasi Urban Water Works (5 Reservoirs, 25 Inlets)",
    duration: "6 Months",
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    overallProgress: 88,
    status: "Validation", // Not Started, Ongoing, Validation, Completed
    budget: "₹ 85,00,000",
    milestones: [
      {
        id: "m-1",
        title: "Milestone 1: Sensor Hardware Fabrication & Site Preparation",
        description: "Fabricate 25 AquaSense-X spectrophotometric units, calibrate in NABL lab, and prepare physical mounting fixtures across 5 Varanasi reservoirs.",
        progress: 100,
        status: "Completed",
        completionDate: "2026-03-25",
        budgetShare: 1700000,
        evidence: [
          { name: "NABL_Pre_Deployment_Calibration.pdf", date: "2026-03-20", type: "Report", status: "Verified" },
          { name: "Site_Preparation_Photos.zip", date: "2026-03-24", type: "Photos", status: "Verified" }
        ]
      },
      {
        id: "m-2",
        title: "Milestone 2: Field Installation & Network Commissioning",
        description: "Complete physical installation of all 25 nodes, establish LoRaWAN gateway links, and verify real-time data ingestion into State Water Portal.",
        progress: 100,
        status: "Completed",
        completionDate: "2026-04-28",
        budgetShare: 2125000,
        evidence: [
          { name: "Telemetry_Link_Commissioning_Signoff.pdf", date: "2026-04-26", type: "Document", status: "Verified" },
          { name: "Installation_Inspection_Logs.pdf", date: "2026-04-28", type: "Report", status: "Verified" }
        ]
      },
      {
        id: "m-3",
        title: "Milestone 3: 90-Day Continuous Baseline Data Collection & AI Anomaly Training",
        description: "Maintain 99.5% sensor telemetry uptime, log 1.2M water parameter readings, and train localized anomaly detection baseline models.",
        progress: 100,
        status: "Completed",
        completionDate: "2026-07-20",
        budgetShare: 2125000,
        evidence: [
          { name: "90_Day_Telemetry_Uptime_Audit.pdf", date: "2026-07-18", type: "Test Results", status: "Verified" },
          { name: "Water_Quality_Trend_Dataset.csv", date: "2026-07-19", type: "Data", status: "Verified" }
        ]
      },
      {
        id: "m-4",
        title: "Milestone 4: Performance Target Validation & Early Warning Trials",
        description: "Simulate controlled chemical spike events in test flume and validate early warning latency under 10 minutes with zero false negatives.",
        progress: 90,
        status: "In Progress",
        completionDate: "2026-08-25",
        budgetShare: 1700000,
        evidence: [
          { name: "Controlled_Spike_Spur_Trial_Report.pdf", date: "2026-08-20", type: "Report", status: "Verified" },
          { name: "Video_Telemetry_Latency_Demonstration.mp4", date: "2026-08-22", type: "Video", status: "Verified" }
        ]
      },
      {
        id: "m-5",
        title: "Milestone 5: Final Independent Audit, Validation & Handover",
        description: "Independent water testing committee validation, final impact analysis, and knowledge transfer to municipal engineering team.",
        progress: 50,
        status: "Under Review",
        completionDate: "2026-08-31",
        budgetShare: 850000,
        evidence: [
          { name: "Draft_Final_Pilot_Summary_Report.pdf", date: "2026-08-28", type: "Report", status: "Pending Review" }
        ]
      }
    ],
    kpiData: [
      { metric: "Contamination Detection Latency", baseline: "48 Hours", target: "15 Minutes", actual: "8.5 Minutes", unit: "min", targetNumeric: 15, actualNumeric: 8.5, status: "PASSED" },
      { metric: "Sensor Telemetry Uptime", baseline: "75.0%", target: "99.0%", actual: "99.6%", unit: "%", targetNumeric: 99.0, actualNumeric: 99.6, status: "PASSED" },
      { metric: "Chemical Parameter Accuracy (vs Lab)", baseline: "60.0%", target: "90.0%", actual: "94.2%", unit: "%", targetNumeric: 90.0, actualNumeric: 94.2, status: "PASSED" },
      { metric: "Manual Testing Cost Reduction", baseline: "0%", target: "30.0%", actual: "38.5%", unit: "%", targetNumeric: 30.0, actualNumeric: 38.5, status: "PASSED" }
    ],
    performanceChart: {
      labels: ["Month 1 (Apr)", "Month 2 (May)", "Month 3 (Jun)", "Month 4 (Jul)", "Month 5 (Aug)"],
      detectionLatency: [45, 18, 12, 9, 8.5],
      targetLatency: [15, 15, 15, 15, 15],
      uptime: [96.2, 98.4, 99.1, 99.4, 99.6]
    },
    expertValidation: {
      expertName: "Dr. Ramesh Chandra (Scientific Evaluator & Water Board Advisor)",
      validationStatus: "Validated", // Validated, Needs Clarification, Not Validated
      validationDate: "2026-08-29",
      comments: "The pilot has conclusively validated the AquaSense-X system under harsh river intake conditions. Contamination alert latency averaged 8.5 minutes (target was < 15 min), and sensor uptime exceeded 99.5%. Strongly recommend for statewide municipal adoption under Direct Procurement."
    }
  },
  {
    id: "PILOT-2026-002",
    challengeId: "CH-2026-003",
    challengeTitle: "AI-Powered Dynamic Traffic Congestion Control & Emergency Corridor Management",
    startupId: "startup-4",
    startupName: "CivicSense Labs",
    department: "Transport & Urban Mobility Department",
    category: "Transport",
    location: "Ring Road Corridor, Hyderabad (12 Intersections)",
    duration: "4 Months",
    startDate: "2026-04-15",
    endDate: "2026-08-15",
    overallProgress: 100,
    status: "Completed",
    budget: "₹ 95,00,000",
    milestones: [
      { id: "pm-1", title: "Milestone 1: Edge GPU Box Integration at 12 Junctions", progress: 100, status: "Completed", budgetShare: 2375000 },
      { id: "pm-2", title: "Milestone 2: ITS Signal Controller Protocol Sync", progress: 100, status: "Completed", budgetShare: 2850000 },
      { id: "pm-3", title: "Milestone 3: Dynamic Adaptive Signal Control Live Deployment", progress: 100, status: "Completed", budgetShare: 2850000 },
      { id: "pm-4", title: "Milestone 4: Emergency Corridor Preemption Proof-of-Concept", progress: 100, status: "Completed", budgetShare: 1425000 }
    ],
    kpiData: [
      { metric: "Corridor Peak Delay", baseline: "48 min", target: "38 min (-20%)", actual: "35 min (-27%)", unit: "min", status: "PASSED" },
      { metric: "Ambulance Transit Delay", baseline: "18 min", target: "11 min (-40%)", actual: "9.5 min (-47%)", unit: "min", status: "PASSED" },
      { metric: "Intersection Throughput", baseline: "2,400 vph", target: "2,800 vph", actual: "3,050 vph", unit: "vph", status: "PASSED" }
    ],
    performanceChart: {
      labels: ["Baseline", "Week 4", "Week 8", "Week 12", "Final (Week 16)"],
      corridorDelay: [48, 44, 40, 37, 35],
      targetDelay: [38, 38, 38, 38, 38]
    },
    expertValidation: {
      expertName: "Prof. K. Venkatesh (IIT Transport Engineering)",
      validationStatus: "Validated",
      validationDate: "2026-08-20",
      comments: "Exceptional outcome. Peak vehicular delay fell by 27% and emergency response transit improved by 47%. Ready for city-wide expansion."
    }
  },
  {
    id: "PILOT-2026-003",
    challengeId: "CH-2026-005",
    challengeTitle: "Precision Micro-Irrigation & Crop Disease Forecasting via Drone IoT",
    startupId: "startup-3",
    startupName: "SmartFarm Technologies",
    department: "Agriculture & Farmers Empowerment",
    category: "Agriculture",
    location: "Baramati Agri Cluster, Maharashtra (1,200 Acres)",
    duration: "6 Months",
    startDate: "2026-05-01",
    endDate: "2026-10-31",
    overallProgress: 65,
    status: "Ongoing",
    budget: "₹ 75,00,000",
    milestones: [
      { id: "am-1", title: "Milestone 1: Soil Probe Network Grid Deployment", progress: 100, status: "Completed", budgetShare: 1875000 },
      { id: "am-2", title: "Milestone 2: Weekly Multispectral Drone Survey Flights", progress: 100, status: "Completed", budgetShare: 2250000 },
      { id: "am-3", title: "Milestone 3: Vernacular Advisory Engine WhatsApp Rollout", progress: 60, status: "In Progress", budgetShare: 1875000 },
      { id: "am-4", title: "Milestone 4: Harvest Water Audit & Yield Verification", progress: 0, status: "Pending", budgetShare: 1500000 }
    ],
    kpiData: [
      { metric: "Irrigation Water Saving", baseline: "0%", target: "25.0%", actual: "28.4%", unit: "%", status: "PASSED" },
      { metric: "Fungicide Spray Reduction", baseline: "0%", target: "20.0%", actual: "22.0%", unit: "%", status: "PASSED" },
      { metric: "Farmer Adoption Rate", baseline: "0%", target: "80.0%", actual: "86.5%", unit: "%", status: "PASSED" }
    ],
    performanceChart: {
      labels: ["May", "Jun", "Jul", "Aug (Current)"],
      waterSaving: [5, 14, 22, 28.4],
      targetSaving: [25, 25, 25, 25]
    },
    expertValidation: {
      expertName: "Dr. B. K. Hegde (Agri-Innovation Board)",
      validationStatus: "Under Review",
      validationDate: "2026-08-25",
      comments: "Interim results show impressive water conservation across 350 farmer plots. Final validation due post-Kharif harvest."
    }
  }
];

export const PROCUREMENT_RECORDS = [
  {
    id: "PROC-2026-001",
    pilotId: "PILOT-2026-001",
    startupName: "AquaTech Solutions",
    solutionName: "AquaSense-X Inline Potable Water Quality Monitoring System",
    department: "Water Resources Department",
    pilotResult: "100% Validated (8.5 min alert latency, 99.6% uptime)",
    contractValue: "₹ 4,20,00,000",
    units: "150 Monitoring Stations across 12 Municipal Corporations",
    procurementStatus: "Procurement in Progress", // Pending, Approved, Procurement in Progress, Procured, Scaled
    scaleUpStatus: "Statewide Expansion Approved",
    orderDate: "2026-08-28",
    paymentMilestones: [
      { milestone: "Initial Mobilization & Component Sourcing (30%)", amount: "₹ 1,26,00,000", completion: "100%", status: "Paid" },
      { milestone: "Batch-1 50 Units Delivery & Field QC (35%)", amount: "₹ 1,47,00,000", completion: "75%", status: "Approved" },
      { milestone: "Batch-2 100 Units Statewide Deployment (25%)", amount: "₹ 1,05,00,000", completion: "0%", status: "Pending" },
      { milestone: "Final SLA & 1-Year AMC Handover (10%)", amount: "₹ 42,00,000", completion: "0%", status: "Pending" }
    ]
  },
  {
    id: "PROC-2026-002",
    pilotId: "PILOT-2026-002",
    startupName: "CivicSense Labs",
    solutionName: "CivicFlow Adaptive AI Traffic Signal Management Suite",
    department: "Transport & Urban Mobility Department",
    pilotResult: "100% Validated (27% commute reduction, 47% ambulance transit speedup)",
    contractValue: "₹ 6,80,00,000",
    units: "85 Major Arterial Intersections, Cyberabad & Hyderabad",
    procurementStatus: "Procured",
    scaleUpStatus: "Scaled",
    orderDate: "2026-08-15",
    paymentMilestones: [
      { milestone: "Hardware & Edge Compute Delivery (40%)", amount: "₹ 2,72,00,000", completion: "100%", status: "Paid" },
      { milestone: "Corridor System Integration (40%)", amount: "₹ 2,72,00,000", completion: "100%", status: "Paid" },
      { milestone: "Full Commissioning & SLA Audit (20%)", amount: "₹ 1,36,00,000", completion: "100%", status: "Paid" }
    ]
  },
  {
    id: "PROC-2026-003",
    pilotId: "PILOT-2025-089",
    startupName: "AuraMed Diagnostics",
    solutionName: "AuraCare Tele-Clinic Point-of-Care Diagnostic Suitcases",
    department: "Health & Family Welfare Department",
    pilotResult: "Validated in 20 Rural Health Sub-Centres (2,800 tests conducted)",
    contractValue: "₹ 5,10,00,000",
    units: "120 Rural Primary Health Centres",
    procurementStatus: "Procured",
    scaleUpStatus: "Scaled",
    orderDate: "2026-06-10",
    paymentMilestones: [
      { milestone: "Supply of 120 Diagnostic Kits (50%)", amount: "₹ 2,55,00,000", completion: "100%", status: "Paid" },
      { milestone: "Nurse/ASHA Training Certification (30%)", amount: "₹ 1,53,00,000", completion: "100%", status: "Paid" },
      { milestone: "Cloud Integration & Telemedicine SLA (20%)", amount: "₹ 1,02,00,000", completion: "100%", status: "Paid" }
    ]
  },
  {
    id: "PROC-2026-004",
    pilotId: "PILOT-2025-072",
    startupName: "GreenGrid Innovations",
    solutionName: "GreenSync Microgrid Optimization Controllers",
    department: "Renewable Energy & Environment",
    pilotResult: "Validated across 8 Island Clinics (Zero Blackouts)",
    contractValue: "₹ 2,40,00,000",
    units: "45 Primary Health Centres & Community Centres",
    procurementStatus: "Approved",
    scaleUpStatus: "Sanctioned for Tender Exemption",
    orderDate: "2026-07-30",
    paymentMilestones: [
      { milestone: "Controller Fabrication (40%)", amount: "₹ 96,00,000", completion: "100%", status: "Paid" },
      { milestone: "Island Installation (40%)", amount: "₹ 96,00,000", completion: "50%", status: "Approved" },
      { milestone: "Final Verification (20%)", amount: "₹ 48,00,000", completion: "0%", status: "Pending" }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Pilot Validation Completed",
    message: "Dr. Ramesh Chandra submitted final verification for 'AquaTech Solutions' on Water Quality Monitoring.",
    timestamp: "10 minutes ago",
    role: "Government",
    read: false,
    type: "success"
  },
  {
    id: "notif-2",
    title: "New Application Received",
    message: "CivicSense Labs submitted proposal for 'AI-Powered Dynamic Traffic Congestion Control'.",
    timestamp: "1 hour ago",
    role: "Government",
    read: false,
    type: "info"
  },
  {
    id: "notif-3",
    title: "Milestone Evidence Submitted",
    message: "AquaTech Solutions uploaded Milestone 4 Test Reports for review.",
    timestamp: "3 hours ago",
    role: "Expert",
    read: false,
    type: "info"
  },
  {
    id: "notif-4",
    title: "Direct Procurement Approved",
    message: "State Procurement Committee approved DPO contract for CivicSense Labs (₹ 6.80 Cr).",
    timestamp: "1 day ago",
    role: "Startup",
    read: true,
    type: "success"
  },
  {
    id: "notif-5",
    title: "Milestone Payment Disbursed",
    message: "Treasury disbursed ₹ 21,25,000 for Milestone 3 completion.",
    timestamp: "2 days ago",
    role: "Startup",
    read: true,
    type: "success"
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: "act-1",
    type: "Procurement Approved",
    title: "Direct Procurement Approved for CivicSense Labs",
    department: "Transport & Urban Mobility",
    timestamp: "28 Aug 2026, 14:30",
    badge: "Procured",
    statusColor: "green"
  },
  {
    id: "act-2",
    type: "Evidence Submitted",
    title: "Milestone 4 Performance Evidence Uploaded by AquaTech",
    department: "Water Resources",
    timestamp: "27 Aug 2026, 17:15",
    badge: "Evidence Uploaded",
    statusColor: "blue"
  },
  {
    id: "act-3",
    type: "Pilot Milestone Completed",
    title: "Milestone 3 (90-Day Baseline) Verified by Evaluator",
    department: "Water Resources",
    timestamp: "25 Aug 2026, 11:00",
    badge: "Milestone Verified",
    statusColor: "green"
  },
  {
    id: "act-4",
    type: "Expert Evaluation Completed",
    title: "Evaluation Submitted for AuraMed Diagnostics (Score: 9.0/10)",
    department: "Health & Family Welfare",
    timestamp: "24 Aug 2026, 16:45",
    badge: "Evaluated",
    statusColor: "green"
  },
  {
    id: "act-5",
    type: "New Startup Application",
    title: "EcoBin Robotics applied for Municipal Dry Waste Sorting",
    department: "Municipal Administration",
    timestamp: "22 Aug 2026, 09:30",
    badge: "New Application",
    statusColor: "blue"
  }
];
