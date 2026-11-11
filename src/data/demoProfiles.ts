import { FarmerProfile } from '../types';

// Neutral, unpopulated baseline farmer profile with zero assumed selections or prefilled answers
export const defaultFarmerProfile: FarmerProfile = {
  id: 'guest-farmer',
  name: '',
  state: '',
  district: '',
  village: '',
  pincode: '',
  cropType: [],
  landholdingAcres: undefined,
  landOwnership: '',
  farmerCategory: undefined,
  farmingNeeds: [],
  irrigationAvailability: '',
  preferredLanguage: 'en',
  hasAadhaarLinkedBankDBT: 'not_sure',
  hasLandRecords712: 'not_sure',
  isIncomeTaxPayee: 'not_sure',
  holdsConstitutionalPost: 'not_sure',
  isInstitutionalLandholder: 'not_sure',
  previousSubsidyAvailed: 'not_sure',
  savedSchemeIds: [],
  profileCompletionPercent: 0
};

export const demoProfiles: FarmerProfile[] = [];
