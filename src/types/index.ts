export type CompanyRank = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'

export type CompanyStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED'

export type ApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'

export type CreditStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'

export type RedemptionOptionType =
  | 'CARBON_OFFSET_CERTIFICATE'
  | 'ESG_REPORTING_CLAIM'
  | 'COMPLIANCE_ADJUSTMENT'
  | 'NET_ZERO_NEUTRALIZATION'

export type RedemptionStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED'

export type ParcelStatus = 'AVAILABLE' | 'ALLOTTED' | 'MONITORED'

export type DegradationLevel = 'Low' | 'Medium' | 'High'

export interface LandParcel {
  id: string
  location: string
  area: number
  areaHectares?: number
  state: string
  stateCode?: string
  latitude?: number
  longitude?: number
  lat?: number
  lng?: number
  degradation?: DegradationLevel
  forestType?: string
  status?: string
  allottedOn?: string
  allottedTo?: string
  sector?: string
  companyId?: string | number
}

export interface LandApplication {
  id: number
  companyId: number
  parcelId: string
  status: ApplicationStatus | string
  submittedAt: string
  decidedAt?: string
  decidedBy?: string
  decisionReason?: string
}

export interface CreditAccount {
  companyId?: number
  earned: number
  redeemed: number
  available: number
  inPipeline: number
  totalEarned?: number
}

export interface CreditLedgerEntry {
  id: number | string
  date: string
  activity: string
  parcelId: string
  credits: number
  status?: string
  type?: string
  verificationMethod?: string
}

export type CreditEntry = CreditLedgerEntry


export interface RedemptionRecord {
  id: number | string
  date?: string
  requestedAt?: string
  purpose?: string
  credits?: number
  creditsUsed?: number
  status: string
  option?: RedemptionOptionType
}

export interface Company {
  id: number
  name: string
  cin: string
  CIN?: string
  gstin?: string
  pan?: string
  sector: string
  state: string
  contactPerson?: string
  email: string
  phone?: string
  annualTurnoverCrores?: number
  rank?: CompanyRank
  status: CompanyStatus
  username?: string
  registeredAt?: string
  registeredOn?: string
  rejectionReason?: string
}

export interface AuthUser {
  id: number
  name: string
  CIN?: string
  cin?: string
  gstin?: string
  pan?: string
  sector: string
  state: string
  contactPerson?: string
  email: string
  phone?: string
  annualTurnoverCrores?: number
  rank?: CompanyRank
  status?: CompanyStatus | string
  registeredOn?: string
  token?: string
  credentials?: { username: string }
  allocatedParcels: LandParcel[]
  pendingParcels: Array<{
    id: string
    location: string
    area: number
    state: string
    appliedOn: string
  }>
  credits: CreditAccount
  ledger: CreditLedgerEntry[]
  redemptionHistory: RedemptionRecord[]
}

export interface OfficerInfo {
  name: string
  role: string
  region: string
  employeeId: string
  ministry: string
  avatar?: string
  username?: string
}

export interface AdminStats {
  totalCompanies: number
  pendingCompanyVerifications: number
  pendingApplications: number
  pendingCreditApprovals: number
  totalCreditsIssued: number
  totalCreditsRedeemed: number
  totalLandAllocatedHectares: number
  totalAvailableParcels: number
}

export interface CompanyVerificationResult {
  gstinValid: boolean
  panValid: boolean
  cinValid: boolean
  panMatchesGstin: boolean
  validOverall: boolean
  suggestedRank: CompanyRank
  maxAreaAllowedHa: number
  summaryMessage: string
}
