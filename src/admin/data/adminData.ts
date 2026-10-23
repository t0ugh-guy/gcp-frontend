// Admin-only mock data — do NOT import company credentials from here
// Shared company/parcel data stays in src/data/companies.ts

export interface OfficerInfo {
  name: string
  role: string
  region: string
  employeeId: string
  ministry: string
  avatar: string
}

export interface AdminPendingApplication {
  id: string
  companyId: string
  companyName: string
  parcelId: string
  parcelLocation: string
  area: number
  state: string
  forestType: string
  degradation: string
  appliedOn: string
  status: string
  contactPerson: string
  email: string
  sector: string
}

export interface VerificationTimelineItem {
  month: string
  canopyDensity: number
  forestCover: number
  label: string
}

export interface VerificationRecord {
  id: string
  parcelId: string
  parcelLocation: string
  companyName: string
  state: string
  area: number
  startDate: string
  lastVerified: string
  verifiedBy: number
  requiredVerifications: number
  status: string
  timeline: VerificationTimelineItem[]
  currentCanopy: number
  forestCoverIncrease: number
  aiInsights: string[]
  flagged: boolean
}

export interface CreditApprovalRecord {
  id: string
  companyName: string
  parcelId: string
  area: number
  canopyIncrease: number
  calculatedCredits: number
  status: string
  submittedOn: string
  formula: string
}

export interface ActivityLog {
  id: string
  timestamp: string
  type: string
  company: string
  detail: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

export interface SystemAlert {
  id: string
  type: 'warning' | 'info' | 'success' | 'error'
  message: string
  date: string
}

export const ADMIN_CREDENTIALS = {
  username: 'admin_gcp',
  password: 'admin@2024',
}

export const adminOfficer: OfficerInfo = {
  name: 'Dr. Arvind Sharma',
  role: 'Regional Environmental Officer',
  region: 'Central India Zone',
  employeeId: 'IFS-2014-0473',
  ministry: 'Ministry of Environment, Forest & Climate Change',
  avatar: 'A',
}

// Pending applications (companies that applied for parcels)
export const pendingApplications: AdminPendingApplication[] = [
  {
    id: 'APP-2025-001',
    companyId: 'tata',
    companyName: 'Tata Power Ltd.',
    parcelId: 'GCP-KA-PEND-005',
    parcelLocation: 'Bandipur Buffer, Karnataka',
    area: 7.5,
    state: 'Karnataka',
    forestType: 'Tropical Dry',
    degradation: 'Medium',
    appliedOn: '10 Mar 2025',
    status: 'Pending',
    contactPerson: 'Rohan Mehta',
    email: 'rohan.mehta@tatapower.com',
    sector: 'Energy',
  },
  {
    id: 'APP-2025-002',
    companyId: 'infosys',
    companyName: 'Infosys Ltd.',
    parcelId: 'GCP-MH-PEND-031',
    parcelLocation: 'Melghat Buffer, Maharashtra',
    area: 14.2,
    state: 'Maharashtra',
    forestType: 'Tropical Moist',
    degradation: 'High',
    appliedOn: '22 Feb 2025',
    status: 'Pending',
    contactPerson: 'Priya Nair',
    email: 'priya.nair@infosys.com',
    sector: 'IT Services',
  },
  {
    id: 'APP-2025-003',
    companyId: 'mahindra',
    companyName: 'Mahindra & Mahindra Ltd.',
    parcelId: 'GCP-AS-PEND-007',
    parcelLocation: 'Kaziranga Fringe, Assam',
    area: 7.8,
    state: 'Assam',
    forestType: 'Alluvial Grassland',
    degradation: 'Medium',
    appliedOn: '01 Apr 2025',
    status: 'Pending',
    contactPerson: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@mahindra.com',
    sector: 'Automobile',
  },
  {
    id: 'APP-2025-004',
    companyId: 'reliance',
    companyName: 'Reliance Industries Ltd.',
    parcelId: 'GCP-CG-AVL-024',
    parcelLocation: 'Bastar Forest Zone, Chhattisgarh',
    area: 18.0,
    state: 'Chhattisgarh',
    forestType: 'Tropical Moist',
    degradation: 'High',
    appliedOn: '05 Apr 2025',
    status: 'Pending',
    contactPerson: 'Vikram Joshi',
    email: 'vikram.joshi@ril.com',
    sector: 'Petrochemicals',
  },
  {
    id: 'APP-2025-005',
    companyId: 'adani',
    companyName: 'Adani Green Energy Ltd.',
    parcelId: 'GCP-WB-AVL-011',
    parcelLocation: 'Sundarbans Fringe, West Bengal',
    area: 5.5,
    state: 'West Bengal',
    forestType: 'Mangrove',
    degradation: 'High',
    appliedOn: '08 Apr 2025',
    status: 'Pending',
    contactPerson: 'Deepa Sharma',
    email: 'deepa.sharma@adanigreen.com',
    sector: 'Renewable Energy',
  },
]

// Restoration verification records
export const verificationRecords: VerificationRecord[] = [
  {
    id: 'VER-2025-001',
    parcelId: 'GCP-MH-2024-001',
    parcelLocation: 'Palghar Forest Belt, Maharashtra',
    companyName: 'Tata Power Ltd.',
    state: 'Maharashtra',
    area: 18.5,
    startDate: '15 Apr 2024',
    lastVerified: '10 Mar 2025',
    verifiedBy: 3,
    requiredVerifications: 5,
    status: 'Verification In Progress',
    timeline: [
      { month: 'Month 0', canopyDensity: 12, forestCover: 8, label: 'Apr 2024' },
      { month: 'Month 6', canopyDensity: 28, forestCover: 22, label: 'Oct 2024' },
      { month: 'Month 12', canopyDensity: 47, forestCover: 38, label: 'Apr 2025' },
      { month: 'Current', canopyDensity: 53, forestCover: 44, label: 'Apr 2025' },
    ],
    currentCanopy: 53,
    forestCoverIncrease: 44,
    aiInsights: [
      'Significant canopy growth observed in northern sector — 23% above baseline.',
      'Native species regeneration detected across 78% of plot boundary.',
      'Soil moisture retention improved by 31% since restoration began.',
      'Invasive species presence reduced from 42% to 14% of total area.',
    ],
    flagged: false,
  },
  {
    id: 'VER-2025-002',
    parcelId: 'GCP-KA-2024-022',
    parcelLocation: 'Bandipur Buffer Zone, Karnataka',
    companyName: 'Infosys Ltd.',
    state: 'Karnataka',
    area: 12.0,
    startDate: '18 Jun 2024',
    lastVerified: '05 Mar 2025',
    verifiedBy: 2,
    requiredVerifications: 5,
    status: 'Pending Verification',
    timeline: [
      { month: 'Month 0', canopyDensity: 9, forestCover: 6, label: 'Jun 2024' },
      { month: 'Month 6', canopyDensity: 21, forestCover: 17, label: 'Dec 2024' },
      { month: 'Month 12', canopyDensity: 38, forestCover: 30, label: 'Jun 2025' },
      { month: 'Current', canopyDensity: 41, forestCover: 33, label: 'Apr 2025' },
    ],
    currentCanopy: 41,
    forestCoverIncrease: 33,
    aiInsights: [
      'Steady growth pattern consistent with tropical dry forest restoration protocols.',
      'Water conservation measures showing measurable improvement in vegetation density.',
      'Bird species count increased by 18 during latest biodiversity survey.',
    ],
    flagged: false,
  },
  {
    id: 'VER-2025-003',
    parcelId: 'GCP-GJ-2024-009',
    parcelLocation: 'Gir Periphery Zone, Gujarat',
    companyName: 'Ultratech Cement Ltd.',
    state: 'Gujarat',
    area: 21.2,
    startDate: '10 Aug 2024',
    lastVerified: '20 Feb 2025',
    verifiedBy: 4,
    requiredVerifications: 5,
    status: 'Ready for Approval',
    timeline: [
      { month: 'Month 0', canopyDensity: 15, forestCover: 11, label: 'Aug 2024' },
      { month: 'Month 6', canopyDensity: 34, forestCover: 28, label: 'Feb 2025' },
      { month: 'Month 12', canopyDensity: 59, forestCover: 51, label: 'Aug 2025' },
      { month: 'Current', canopyDensity: 62, forestCover: 54, label: 'Apr 2025' },
    ],
    currentCanopy: 62,
    forestCoverIncrease: 54,
    aiInsights: [
      'Exceptional canopy growth — exceeds ministry target of 55% by Month 12.',
      'Ground-truthing confirms satellite data with 94% accuracy.',
      'Carbon sequestration estimated at 1,240 tCO₂e annually.',
      'Project eligible for premium Green Credit multiplier (1.2x).',
    ],
    flagged: false,
  },
  {
    id: 'VER-2025-004',
    parcelId: 'GCP-HP-2024-014',
    parcelLocation: 'Kangra Valley, Himachal Pradesh',
    companyName: 'Mahindra & Mahindra Ltd.',
    state: 'Himachal Pradesh',
    area: 6.5,
    startDate: '20 Sep 2024',
    lastVerified: '15 Jan 2025',
    verifiedBy: 1,
    requiredVerifications: 5,
    status: 'Flagged — Low Growth',
    timeline: [
      { month: 'Month 0', canopyDensity: 18, forestCover: 14, label: 'Sep 2024' },
      { month: 'Month 6', canopyDensity: 22, forestCover: 17, label: 'Mar 2025' },
      { month: 'Month 12', canopyDensity: 27, forestCover: 21, label: 'Sep 2025' },
      { month: 'Current', canopyDensity: 24, forestCover: 19, label: 'Apr 2025' },
    ],
    currentCanopy: 24,
    forestCoverIncrease: 19,
    aiInsights: [
      'Growth rate significantly below expected threshold for Himalayan temperate forests.',
      'Frost damage detected in eastern quadrant — may require remediation.',
      'Recommend manual inspection and supplementary planting plan.',
    ],
    flagged: true,
  },
]

// Credit approval records
export const creditApprovalRecords: CreditApprovalRecord[] = [
  {
    id: 'CRD-2025-001',
    companyName: 'Tata Power Ltd.',
    parcelId: 'GCP-MH-2024-001',
    area: 18.5,
    canopyIncrease: 53,
    calculatedCredits: 980,
    status: 'Pending Approval',
    submittedOn: '12 Mar 2025',
    formula: '18.5 × 53 = 980.5',
  },
  {
    id: 'CRD-2025-002',
    companyName: 'Infosys Ltd.',
    parcelId: 'GCP-KA-2024-022',
    area: 12.0,
    canopyIncrease: 41,
    calculatedCredits: 492,
    status: 'On Hold',
    submittedOn: '08 Mar 2025',
    formula: '12.0 × 41 = 492.0',
  },
  {
    id: 'CRD-2025-003',
    companyName: 'Ultratech Cement Ltd.',
    parcelId: 'GCP-GJ-2024-009',
    area: 21.2,
    canopyIncrease: 62,
    calculatedCredits: 1314,
    status: 'Approved',
    submittedOn: '24 Feb 2025',
    formula: '21.2 × 62 = 1314.4',
  },
  {
    id: 'CRD-2025-004',
    companyName: 'Ultratech Cement Ltd.',
    parcelId: 'GCP-OR-2024-031',
    area: 17.5,
    canopyIncrease: 48,
    calculatedCredits: 840,
    status: 'Pending Approval',
    submittedOn: '28 Mar 2025',
    formula: '17.5 × 48 = 840.0',
  },
  {
    id: 'CRD-2025-005',
    companyName: 'Mahindra & Mahindra Ltd.',
    parcelId: 'GCP-HP-2024-014',
    area: 6.5,
    canopyIncrease: 24,
    calculatedCredits: 156,
    status: 'Rejected',
    submittedOn: '20 Jan 2025',
    formula: '6.5 × 24 = 156.0',
  },
]

// Land overview (combines allocated and available)
export const landOverviewData = {
  stats: {
    totalAvailable: 5,
    totalAllocated: 12,
    totalRestored: 3,
    activeProjects: 12,
    totalAreaAvailable: 46.6,
    totalAreaAllocated: 140.5,
  },
  stateDistribution: [
    { state: 'Maharashtra', area: 32.7, parcels: 3 },
    { state: 'Karnataka', area: 19.5, parcels: 2 },
    { state: 'Gujarat', area: 21.2, parcels: 1 },
    { state: 'Rajasthan', area: 23.8, parcels: 2 },
    { state: 'Odisha', area: 17.5, parcels: 1 },
    { state: 'Himachal Pradesh', area: 12.5, parcels: 2 },
    { state: 'Uttarakhand', area: 20.3, parcels: 2 },
    { state: 'Tamil Nadu', area: 9.5, parcels: 1 },
    { state: 'Assam', area: 7.8, parcels: 1 },
    { state: 'Madhya Pradesh', area: 13.0, parcels: 1 },
  ],
  restorationProgress: [
    { month: 'Nov 2024', canopy: 22, cover: 18 },
    { month: 'Dec 2024', canopy: 28, cover: 23 },
    { month: 'Jan 2025', canopy: 33, cover: 27 },
    { month: 'Feb 2025', canopy: 39, cover: 32 },
    { month: 'Mar 2025', canopy: 45, cover: 37 },
    { month: 'Apr 2025', canopy: 52, cover: 43 },
  ],
}

// Activity logs
export const activityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '16 Apr 2025, 10:22 AM',
    type: 'Parcel Assigned',
    company: 'Tata Power Ltd.',
    detail: 'Parcel GCP-MH-2024-001 assigned in Palghar, Maharashtra',
    severity: 'success',
  },
  {
    id: 'LOG-002',
    timestamp: '14 Apr 2025, 03:45 PM',
    type: 'Application Received',
    company: 'Adani Green Energy Ltd.',
    detail: 'New application for Sundarbans Fringe, West Bengal (5.5 ha)',
    severity: 'info',
  },
  {
    id: 'LOG-003',
    timestamp: '12 Apr 2025, 11:10 AM',
    type: 'Restoration Approved',
    company: 'Ultratech Cement Ltd.',
    detail: 'Gir Periphery Zone restoration verified — 62% canopy density achieved',
    severity: 'success',
  },
  {
    id: 'LOG-004',
    timestamp: '10 Apr 2025, 09:30 AM',
    type: 'Credits Issued',
    company: 'Ultratech Cement Ltd.',
    detail: '1,314 Green Credits approved for GCP-GJ-2024-009',
    severity: 'success',
  },
  {
    id: 'LOG-005',
    timestamp: '08 Apr 2025, 02:15 PM',
    type: 'Flag Raised',
    company: 'Mahindra & Mahindra Ltd.',
    detail: 'Kangra Valley project flagged — growth below threshold (24%)',
    severity: 'error',
  },
  {
    id: 'LOG-006',
    timestamp: '05 Apr 2025, 04:00 PM',
    type: 'Application Received',
    company: 'Reliance Industries Ltd.',
    detail: 'New application for Bastar Forest Zone, Chhattisgarh (18 ha)',
    severity: 'info',
  },
  {
    id: 'LOG-007',
    timestamp: '02 Apr 2025, 10:45 AM',
    type: 'Credits On Hold',
    company: 'Infosys Ltd.',
    detail: 'Credit approval for GCP-KA-2024-022 placed on hold pending manual verification',
    severity: 'warning',
  },
  {
    id: 'LOG-008',
    timestamp: '28 Mar 2025, 03:20 PM',
    type: 'Parcel Assigned',
    company: 'Ultratech Cement Ltd.',
    detail: 'Parcel GCP-OR-2024-031 assigned in Simlipal, Odisha',
    severity: 'success',
  },
  {
    id: 'LOG-009',
    timestamp: '22 Mar 2025, 11:00 AM',
    type: 'Manual Inspection',
    company: 'Mahindra & Mahindra Ltd.',
    detail: 'Manual inspection scheduled for Kangra Valley parcel',
    severity: 'warning',
  },
  {
    id: 'LOG-010',
    timestamp: '15 Mar 2025, 09:15 AM',
    type: 'Application Rejected',
    company: 'Tata Power Ltd.',
    detail: 'Application APP-2024-089 rejected — parcel outside eligible zone',
    severity: 'error',
  },
]

// System alerts for dashboard
export const systemAlerts: SystemAlert[] = [
  {
    id: 'ALT-001',
    type: 'warning',
    message: 'Mahindra & Mahindra — Kangra Valley project growth rate critically low (24%). Manual inspection recommended.',
    date: '16 Apr 2025',
  },
  {
    id: 'ALT-002',
    type: 'info',
    message: '5 new applications pending review. Oldest application: 22 Feb 2025 (Infosys — Melghat Buffer).',
    date: '15 Apr 2025',
  },
  {
    id: 'ALT-003',
    type: 'warning',
    message: 'Infosys — GCP-KA-2024-022 credit approval on hold for 25+ days. Action required.',
    date: '14 Apr 2025',
  },
  {
    id: 'ALT-004',
    type: 'success',
    message: 'Ultratech Cement — Gir Periphery restoration exceeds ministry targets. Premium multiplier eligible.',
    date: '12 Apr 2025',
  },
]
