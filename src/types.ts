export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'farmer' | 'admin';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  createdAt: string;
  state: string;
  district: string;
  village: string;
  emailVerified: boolean;
}

export type LandOwnershipType = 'owner' | 'tenant' | 'sharecropper' | 'oral_lessee' | 'landless';

export type FarmerCategoryType = 'marginal' | 'small' | 'medium' | 'large' | 'women_farmer';

export type IrrigationType = 'rainfed' | 'well_borewell' | 'canal' | 'drip_sprinkler' | 'none';

export type AlliedActivityType = 
  | 'dairy'
  | 'poultry'
  | 'goat_sheep'
  | 'fisheries'
  | 'beekeeping'
  | 'sericulture'
  | 'horticulture'
  | 'food_processing'
  | 'agri_business'
  | 'fpo_member'
  | 'organic_farming'
  | 'storage_warehousing'
  | 'agroforestry';

export type FarmingRequirementType = 
  | 'financial_assistance'
  | 'crop_insurance'
  | 'agricultural_loans'
  | 'irrigation'
  | 'seeds_fertilizers'
  | 'farm_machinery'
  | 'solar_pumps'
  | 'livestock'
  | 'fisheries'
  | 'storage_warehousing'
  | 'agricultural_marketing'
  | 'training_education'
  | 'agricultural_infrastructure'
  | 'disaster_relief'
  | 'startup_entrepreneurship';

export interface FarmerProfile {
  id: string;
  userId?: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  state: string;
  district: string;
  taluka?: string;
  village: string;
  pincode: string;
  preferredLanguage: Language;
  
  // Farming Details
  primaryOccupation?: string;
  farmingType?: string;
  farmerCategory?: FarmerCategoryType;
  landholdingAcres?: number;
  landholdingUnit?: 'acres' | 'hectares';
  landOwnership?: LandOwnershipType | string;
  landType?: 'irrigated' | 'dryland' | 'waste_land' | 'fallow';
  irrigationAvailability?: IrrigationType | string;
  cropType: string[];
  cropSeason?: 'Kharif' | 'Rabi' | 'Zaid' | 'Annual' | 'Perennial';
  isOrganicFarmer?: boolean;
  
  // Allied Activities (Multi-select)
  alliedActivities?: AlliedActivityType[];
  
  // Financial & Beneficiary
  annualFamilyIncome?: number; // In Rupees
  socialCategory?: 'General' | 'OBC' | 'SC' | 'ST';
  isTribalOrSpecialRegion?: boolean;
  isWomenFarmerHead?: boolean;
  existingBenefits?: string[];
  
  // Farming Needs (Multi-select)
  farmingNeeds: string[];
  
  // Extended verification fields for Universal Eligibility Checker (Supports Yes / No / Not Sure / Applied)
  isIncomeTaxPayee?: boolean | string; // PM-KISAN exclusion
  holdsConstitutionalPost?: boolean | string; // PM-KISAN exclusion
  isInstitutionalLandholder?: boolean | string; // PM-KISAN exclusion
  hasAadhaarLinkedBankDBT?: boolean | string;
  isBankDBTEnabled?: boolean | string; // DBT/NPCI bank status
  hasLandRecords712?: boolean | string; // 7/12 extract or RoR / Khasra-Khatauni
  hasKisanCreditCard?: boolean | string;
  hasSoilHealthCard?: boolean | string;
  previousSubsidyAvailed?: boolean | string;
  hasFarmerRegistrationId?: boolean | string; // Valid farmer registration or ID
  
  // Bookmarked and Application Drafts
  savedSchemeIds?: string[];
  profileCompletionPercent?: number;
  updatedAt?: string;
}

export type EligibilityOperator = 
  | 'eq'
  | 'neq'
  | 'gte'
  | 'lte'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_false'
  | 'is_true'
  | 'all_in';

export interface LocalizedText {
  en: string;
  hi: string;
  mr: string;
}

export interface EligibilityRule {
  id: string;
  conditionNumber: number; // 1 to 28 conditions
  conditionName: string;
  field: string;
  label: LocalizedText;
  operator: EligibilityOperator;
  expectedValue: any;
  isMandatory: boolean;
  isExclusion?: boolean; // If true, matching this rule disqualifies the farmer
  explanation: LocalizedText;
  failureReason: LocalizedText;
  missingReason?: LocalizedText;
  remedyStep?: LocalizedText;
}

export interface RuleEvaluation {
  rule: EligibilityRule;
  status: 'matched' | 'failed' | 'missing';
  actualValue: any;
  message: string;
  remedy?: string;
}

export interface EligibilityResult {
  schemeId: string;
  status: 'eligible' | 'partially_eligible' | 'not_eligible'; // GREEN, YELLOW, RED
  matchedRules: RuleEvaluation[];
  failedRules: RuleEvaluation[];
  missingRules: RuleEvaluation[];
  summary: string;
  nextSteps: string[];
  verifiedRuleCount: number;
}

export interface DocumentRequirement {
  id: string;
  name: LocalizedText;
  isMandatory: boolean;
  description: LocalizedText;
  issuingAuthority: LocalizedText;
  helpTip: LocalizedText;
}

// 28 Standard Categories defined by specification
export type SchemeCategoryType = 
  | 'Income Support & Direct Assistance'
  | 'Crop Insurance & Risk Protection'
  | 'Agricultural Loans & Credit'
  | 'Irrigation & Water Conservation'
  | 'Farm Machinery & Equipment'
  | 'Seeds, Fertilizers & Agricultural Inputs'
  | 'Soil Health & Land Development'
  | 'Horticulture & Plantation'
  | 'Organic & Natural Farming'
  | 'Dairy & Livestock Development'
  | 'Poultry, Goat & Sheep Farming'
  | 'Fisheries & Aquaculture'
  | 'Agricultural Storage & Warehouses'
  | 'Food Processing & Value Addition'
  | 'Agricultural Marketing & MSP'
  | 'FPOs & Cooperatives'
  | 'Solar Pumps & Renewable Energy'
  | 'Climate-Resilient Agriculture'
  | 'Agricultural Training & Technology'
  | 'Agri Startups & Entrepreneurship'
  | 'Women Farmer Welfare'
  | 'Small & Marginal Farmer Support'
  | 'Tribal & Region-Specific Support'
  | 'Farmer Pension & Social Security'
  | 'Disaster Relief & Crop Compensation'
  | 'Land Infrastructure & Development'
  | 'Beekeeping & Allied Activities'
  | 'Rural Infrastructure & Community Farming';

export type SchemeStatusType = 
  | 'active'
  | 'application_open'
  | 'application_closed'
  | 'temporarily_suspended'
  | 'announced'
  | 'expired'
  | 'status_unknown';

export type DataVerificationStatusType = 
  | 'verified'
  | 'pending_verification'
  | 'outdated'
  | 'conflicting'
  | 'archived';

export interface Scheme {
  id: string;
  name: string;
  alternativeNames?: string[];
  localNames: LocalizedText;
  department: LocalizedText;
  category: SchemeCategoryType;
  subcategory?: string;
  type: 'central' | 'state' | 'ut';
  stateCoverage: string[]; // ['All India'] or specific state names
  districtCoverage?: string[]; // Specific districts where applicable
  cropCoverage: string[];
  targetBeneficiaries?: string[];
  applicableActivities?: AlliedActivityType[];
  benefits: LocalizedText;
  benefitsAmount: string;
  description: LocalizedText;
  eligibilityOverview: LocalizedText;
  rules: EligibilityRule[];
  requiredDocuments: DocumentRequirement[];
  applicationSteps: LocalizedText[];
  officialUrl: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  applicationPeriod: string;
  isOpen: boolean;
  schemeStatus: SchemeStatusType;
  verificationStatus: DataVerificationStatusType;
  helpline: string;
  badge?: string;
  isDistrictSpecific?: boolean;
}

export interface AlertItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  date: string;
  deadline?: string;
  type: 'deadline' | 'announcement' | 'scheme_update';
  schemeId?: string;
  state?: string;
  isUrgent?: boolean;
  sourceUrl: string;
  verified: boolean;
  officialReference: string;
}

export type DocumentChecklistStatus = 
  | 'not_provided' 
  | 'collected' 
  | 'uploaded' 
  | 'submitted' 
  | 'verified'
  | 'not_started' 
  | 'scanned' 
  | 'ready';

export interface ApplicationDraft {
  schemeId: string;
  updatedAt: string;
  documentStatus: Record<string, DocumentChecklistStatus>;
  notes: string;
  completedSteps: number[];
}
