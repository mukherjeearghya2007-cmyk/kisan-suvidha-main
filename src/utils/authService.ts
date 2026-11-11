import { UserAccount, FarmerProfile, Language, ApplicationDraft, DocumentChecklistStatus } from '../types';

const USERS_STORAGE_KEY = 'kisan_users_v3';
const CURRENT_SESSION_KEY = 'kisan_session_v3';
const PROFILES_STORAGE_KEY = 'kisan_profiles_v3';
const PASSWORDS_STORAGE_KEY = 'kisan_passwords_v3';
const SAVED_SCHEMES_KEY = 'kisan_saved_schemes_v3';
const DRAFTS_KEY = 'kisan_application_drafts_v3';

// Clean default profile for unauthenticated visitors - NO hardcoded assumptions
export const cleanAnonymousProfile: FarmerProfile = {
  id: 'guest-farmer',
  name: '',
  state: '',
  district: '',
  village: '',
  pincode: '',
  preferredLanguage: 'en',
  farmerCategory: undefined,
  farmingType: '',
  landholdingAcres: undefined,
  landholdingUnit: 'acres',
  landOwnership: '',
  irrigationAvailability: '',
  cropType: [],
  farmingNeeds: [],
  alliedActivities: [],
  hasAadhaarLinkedBankDBT: 'not_sure',
  isBankDBTEnabled: 'not_sure',
  hasLandRecords712: 'not_sure',
  isIncomeTaxPayee: 'not_sure',
  holdsConstitutionalPost: 'not_sure',
  isInstitutionalLandholder: 'not_sure',
  previousSubsidyAvailed: 'not_sure',
  hasFarmerRegistrationId: 'not_sure',
  savedSchemeIds: [],
  profileCompletionPercent: 0
};

// Internal storage helpers
function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getStoredPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function savePasswords(map: Record<string, string>) {
  localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(map));
}

export const authService = {
  // Current active session (null when visitor is not logged in)
  getCurrentUser(): UserAccount | null {
    try {
      const raw = localStorage.getItem(CURRENT_SESSION_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw);
      // Ensure user belongs to valid account
      if (user && user.id && user.fullName) {
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // Log in farmer using Mobile Number OR Email
  login(identifier: string, pass: string, rememberMe = true): { success: boolean; user?: UserAccount; error?: string } {
    const rawInput = identifier.trim();
    if (!rawInput) {
      return { success: false, error: 'Please enter your mobile number or email address.' };
    }

    const cleanMobile = rawInput.replace(/\D/g, '');
    const isMobile = cleanMobile.length === 10;
    const normalizedEmail = rawInput.toLowerCase();

    const users = getAllUsers();
    const user = users.find(u => {
      if (isMobile && u.mobile === cleanMobile) return true;
      return u.email.toLowerCase() === normalizedEmail;
    });

    if (!user) {
      return { 
        success: false, 
        error: isMobile 
          ? 'No registered farmer account found with this mobile number.' 
          : 'No registered farmer account found with this email address.' 
      };
    }

    const passwords = getStoredPasswords();
    const expectedPass = passwords[user.id] || passwords[user.email] || passwords[user.mobile];

    if (!expectedPass || pass !== expectedPass) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Save session
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  // Register new Farmer account
  register(userData: {
    fullName: string;
    email?: string;
    mobile: string;
    state: string;
    district: string;
    village?: string;
    preferredLanguage?: Language;
  }, password: string): { success: boolean; user?: UserAccount; error?: string } {
    // Validations
    if (!userData.fullName.trim()) {
      return { success: false, error: 'Farmer full name is required.' };
    }

    const cleanMobile = userData.mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      return { success: false, error: 'Mobile number must be exactly 10 digits.' };
    }

    const rawEmail = userData.email?.trim() || '';
    if (rawEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawEmail)) {
        return { success: false, error: 'Please provide a valid email address, or leave it blank.' };
      }
    }

    const effectiveEmail = rawEmail.toLowerCase() || `${cleanMobile}@kisan.in`;

    if (!userData.district.trim()) {
      return { success: false, error: 'District name is required.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const users = getAllUsers();
    // Check if email or mobile already registered
    if (rawEmail && users.some(u => u.email.toLowerCase() === rawEmail.toLowerCase())) {
      return { success: false, error: 'An account with this email address is already registered. Please log in.' };
    }
    if (users.some(u => u.mobile === cleanMobile)) {
      return { success: false, error: 'This mobile number is already registered. Please log in.' };
    }

    const newId = `farmer-${Date.now()}`;
    const newUser: UserAccount = {
      id: newId,
      email: effectiveEmail,
      fullName: userData.fullName.trim(),
      mobile: cleanMobile,
      role: 'farmer',
      createdAt: new Date().toISOString(),
      state: userData.state,
      district: userData.district.trim(),
      village: userData.village?.trim() || '',
      emailVerified: true
    };

    // Save user
    users.push(newUser);
    saveUsers(users);

    // Save password
    const passwords = getStoredPasswords();
    passwords[newId] = password;
    passwords[newUser.email] = password;
    passwords[cleanMobile] = password;
    savePasswords(passwords);

    // Initialize clean profile for this registered farmer
    // Initialize clean unpopulated profile for this registered farmer
    const newProfile: FarmerProfile = {
      id: `prof-${newId}`,
      userId: newId,
      name: newUser.fullName,
      state: newUser.state,
      district: newUser.district,
      taluka: '',
      village: newUser.village,
      pincode: '',
      preferredLanguage: userData.preferredLanguage || 'en',
      farmerCategory: undefined,
      farmingType: '',
      landholdingAcres: undefined,
      landholdingUnit: 'acres',
      landOwnership: '',
      irrigationAvailability: '',
      cropType: [],
      farmingNeeds: [],
      alliedActivities: [],
      isIncomeTaxPayee: 'not_sure',
      hasAadhaarLinkedBankDBT: 'not_sure',
      isBankDBTEnabled: 'not_sure',
      hasLandRecords712: 'not_sure',
      previousSubsidyAvailed: 'not_sure',
      hasFarmerRegistrationId: 'not_sure',
      holdsConstitutionalPost: 'not_sure',
      isInstitutionalLandholder: 'not_sure',
      savedSchemeIds: [],
      profileCompletionPercent: 0,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`${PROFILES_STORAGE_KEY}_${newId}`, JSON.stringify(newProfile));

    // Automatically establish active session
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  // Log out current session
  logout(): void {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  // Reset password for farmer
  resetPassword(identifier: string, newPass: string): { success: boolean; error?: string } {
    const raw = identifier.trim().toLowerCase();
    const cleanMobile = raw.replace(/\D/g, '');
    const users = getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === raw || (cleanMobile.length === 10 && u.mobile === cleanMobile));

    if (!user) {
      return { success: false, error: 'No account found with this email or mobile number.' };
    }

    if (!newPass || newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const passwords = getStoredPasswords();
    passwords[user.id] = newPass;
    passwords[user.email] = newPass;
    savePasswords(passwords);

    return { success: true };
  },

  // Delete farmer account
  deleteAccount(userId: string): { success: boolean } {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);

    localStorage.removeItem(`${PROFILES_STORAGE_KEY}_${userId}`);
    const passwords = getStoredPasswords();
    delete passwords[userId];
    savePasswords(passwords);

    const current = authService.getCurrentUser();
    if (current?.id === userId) {
      authService.logout();
    }

    return { success: true };
  },

  // Get profile of specific user (or clean profile if anonymous)
  getFarmerProfile(userId?: string): FarmerProfile {
    const uid = userId || authService.getCurrentUser()?.id;
    if (!uid) {
      return cleanAnonymousProfile;
    }

    try {
      const raw = localStorage.getItem(`${PROFILES_STORAGE_KEY}_${uid}`);
      if (raw) return JSON.parse(raw);

      // Create initial clean unpopulated profile for user if missing
      const user = getAllUsers().find(u => u.id === uid);
      const initial: FarmerProfile = {
        id: `prof-${uid}`,
        userId: uid,
        name: user?.fullName || '',
        state: user?.state || '',
        district: user?.district || '',
        taluka: '',
        village: user?.village || '',
        pincode: '',
        preferredLanguage: 'en',
        farmerCategory: undefined,
        farmingType: '',
        landholdingAcres: undefined,
        landholdingUnit: 'acres',
        landOwnership: '',
        irrigationAvailability: '',
        cropType: [],
        farmingNeeds: [],
        alliedActivities: [],
        isIncomeTaxPayee: 'not_sure',
        hasAadhaarLinkedBankDBT: 'not_sure',
        isBankDBTEnabled: 'not_sure',
        hasLandRecords712: 'not_sure',
        previousSubsidyAvailed: 'not_sure',
        hasFarmerRegistrationId: 'not_sure',
        holdsConstitutionalPost: 'not_sure',
        isInstitutionalLandholder: 'not_sure',
        savedSchemeIds: [],
        profileCompletionPercent: 0,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`${PROFILES_STORAGE_KEY}_${uid}`, JSON.stringify(initial));
      return initial;
    } catch (e) {
      return cleanAnonymousProfile;
    }
  },

  // Save profile updates with accurate completion calculation
  saveFarmerProfile(profile: FarmerProfile): void {
    const uid = profile.userId || authService.getCurrentUser()?.id;
    if (!uid) return;

    // Calculate profile completion percentage based on actual filled answers
    let completedPoints = 0;
    const totalPoints = 12;
    if (profile.name?.trim()) completedPoints++;
    if (profile.state?.trim()) completedPoints++;
    if (profile.district?.trim()) completedPoints++;
    if (profile.taluka?.trim() || profile.village?.trim()) completedPoints++;
    if (profile.farmingType?.trim()) completedPoints++;
    if (profile.landOwnership && profile.landOwnership !== '') completedPoints++;
    if (profile.landholdingAcres !== undefined && Number(profile.landholdingAcres) > 0) completedPoints++;
    if (profile.cropType && profile.cropType.length > 0) completedPoints++;
    if (profile.irrigationAvailability && profile.irrigationAvailability !== '') completedPoints++;
    if (profile.isIncomeTaxPayee && profile.isIncomeTaxPayee !== 'not_sure') completedPoints++;
    if (profile.hasAadhaarLinkedBankDBT && profile.hasAadhaarLinkedBankDBT !== 'not_sure') completedPoints++;
    if (profile.hasLandRecords712 && profile.hasLandRecords712 !== 'not_sure') completedPoints++;

    const updatedProfile: FarmerProfile = {
      ...profile,
      userId: uid,
      profileCompletionPercent: Math.round((completedPoints / totalPoints) * 100),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`${PROFILES_STORAGE_KEY}_${uid}`, JSON.stringify(updatedProfile));
  },

  // Document Checklist Status storage per user and scheme
  getDocumentStatuses(schemeId: string, userId?: string): Record<string, DocumentChecklistStatus> {
    const uid = userId || authService.getCurrentUser()?.id || 'guest';
    const key = `kisan_doc_statuses_v3_${uid}_${schemeId}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  },

  saveDocumentStatuses(schemeId: string, statuses: Record<string, DocumentChecklistStatus>, userId?: string): void {
    const uid = userId || authService.getCurrentUser()?.id || 'guest';
    const key = `kisan_doc_statuses_v3_${uid}_${schemeId}`;
    localStorage.setItem(key, JSON.stringify(statuses));
  },

  // Toggle Saved Scheme
  toggleSavedScheme(schemeId: string, userId?: string): string[] {
    const uid = userId || authService.getCurrentUser()?.id;
    if (!uid) {
      // Store in session guest storage
      try {
        const guestSaved = JSON.parse(localStorage.getItem('guest_saved_schemes') || '[]');
        const updated = guestSaved.includes(schemeId)
          ? guestSaved.filter((id: string) => id !== schemeId)
          : [...guestSaved, schemeId];
        localStorage.setItem('guest_saved_schemes', JSON.stringify(updated));
        return updated;
      } catch (e) {
        return [];
      }
    }

    const profile = authService.getFarmerProfile(uid);
    let current = profile.savedSchemeIds || [];

    if (current.includes(schemeId)) {
      current = current.filter(id => id !== schemeId);
    } else {
      current = [...current, schemeId];
    }

    profile.savedSchemeIds = current;
    authService.saveFarmerProfile(profile);
    return current;
  },

  // Application Drafts
  saveApplicationDraft(draft: ApplicationDraft, userId?: string): void {
    const uid = userId || authService.getCurrentUser()?.id || 'guest';
    const key = `${DRAFTS_KEY}_${uid}_${draft.schemeId}`;
    localStorage.setItem(key, JSON.stringify(draft));
  },

  getApplicationDraft(schemeId: string, userId?: string): ApplicationDraft | null {
    const uid = userId || authService.getCurrentUser()?.id || 'guest';
    const key = `${DRAFTS_KEY}_${uid}_${schemeId}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
};
