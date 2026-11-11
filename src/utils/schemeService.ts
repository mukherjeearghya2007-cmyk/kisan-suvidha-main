import { Scheme, SchemeCategoryType, SchemeStatusType, DataVerificationStatusType } from '../types';
import { verifiedSchemes } from '../data/schemes';

const SCHEMES_STORAGE_KEY = 'kisan_dynamic_schemes_v2';

export const ALL_INDIAN_STATES_AND_UTS = [
  'All India',
  // 28 States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const ALL_28_SCHEME_CATEGORIES: SchemeCategoryType[] = [
  'Income Support & Direct Assistance',
  'Crop Insurance & Risk Protection',
  'Agricultural Loans & Credit',
  'Irrigation & Water Conservation',
  'Farm Machinery & Equipment',
  'Seeds, Fertilizers & Agricultural Inputs',
  'Soil Health & Land Development',
  'Horticulture & Plantation',
  'Organic & Natural Farming',
  'Dairy & Livestock Development',
  'Poultry, Goat & Sheep Farming',
  'Fisheries & Aquaculture',
  'Agricultural Storage & Warehouses',
  'Food Processing & Value Addition',
  'Agricultural Marketing & MSP',
  'FPOs & Cooperatives',
  'Solar Pumps & Renewable Energy',
  'Climate-Resilient Agriculture',
  'Agricultural Training & Technology',
  'Agri Startups & Entrepreneurship',
  'Women Farmer Welfare',
  'Small & Marginal Farmer Support',
  'Tribal & Region-Specific Support',
  'Farmer Pension & Social Security',
  'Disaster Relief & Crop Compensation',
  'Land Infrastructure & Development',
  'Beekeeping & Allied Activities',
  'Rural Infrastructure & Community Farming'
];

export interface SchemeDatabaseReport {
  totalSchemes: number;
  totalCentralSchemes: number;
  totalStateSchemes: number;
  totalUTSchemes: number;
  totalDistrictSpecificSchemes: number;
  statusCounts: Record<SchemeStatusType, number>;
  verificationCounts: Record<DataVerificationStatusType, number>;
  stateBreakdown: Record<string, number>;
  categoryBreakdown: Record<SchemeCategoryType, number>;
  duplicateCandidatesCount: number;
}

export const schemeService = {
  // Retrieve all schemes (merges stored modifications with verified dataset)
  getAllSchemes(): Scheme[] {
    try {
      const raw = localStorage.getItem(SCHEMES_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(verifiedSchemes));
        return verifiedSchemes;
      }
      const parsed: Scheme[] = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(verifiedSchemes));
        return verifiedSchemes;
      }
      return parsed;
    } catch (e) {
      return verifiedSchemes;
    }
  },

  // Save schemes back to persistent storage
  saveSchemes(schemes: Scheme[]): void {
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(schemes));
  },

  // Add new scheme
  addScheme(newScheme: Scheme): { success: boolean; error?: string } {
    const schemes = schemeService.getAllSchemes();

    // Check duplicate name or officialUrl
    const duplicate = schemes.find(
      s => s.name.toLowerCase() === newScheme.name.toLowerCase() ||
      (s.officialUrl && s.officialUrl === newScheme.officialUrl && s.id !== newScheme.id)
    );

    if (duplicate) {
      return { 
        success: false, 
        error: `Potential duplicate detected! Matches existing scheme: "${duplicate.name}" (ID: ${duplicate.id}).` 
      };
    }

    schemes.unshift(newScheme);
    schemeService.saveSchemes(schemes);
    return { success: true };
  },

  // Edit existing scheme
  updateScheme(updatedScheme: Scheme): { success: boolean } {
    const schemes = schemeService.getAllSchemes();
    const idx = schemes.findIndex(s => s.id === updatedScheme.id);
    if (idx === -1) {
      schemes.unshift(updatedScheme);
    } else {
      schemes[idx] = updatedScheme;
    }
    schemeService.saveSchemes(schemes);
    return { success: true };
  },

  // Delete scheme
  deleteScheme(schemeId: string): { success: boolean } {
    const schemes = schemeService.getAllSchemes().filter(s => s.id !== schemeId);
    schemeService.saveSchemes(schemes);
    return { success: true };
  },

  // Find duplicates
  detectDuplicates(): { original: Scheme; duplicate: Scheme; reason: string }[] {
    const schemes = schemeService.getAllSchemes();
    const duplicates: { original: Scheme; duplicate: Scheme; reason: string }[] = [];

    for (let i = 0; i < schemes.length; i++) {
      for (let j = i + 1; j < schemes.length; j++) {
        const a = schemes[i];
        const b = schemes[j];

        if (a.name.toLowerCase().trim() === b.name.toLowerCase().trim()) {
          duplicates.push({ original: a, duplicate: b, reason: 'Identical Scheme Name' });
        } else if (a.officialUrl && b.officialUrl && a.officialUrl === b.officialUrl) {
          duplicates.push({ original: a, duplicate: b, reason: 'Identical Official URL' });
        }
      }
    }

    return duplicates;
  },

  // Import JSON schemes
  importJSON(jsonText: string): { success: boolean; importedCount: number; errors: string[] } {
    try {
      const parsed = JSON.parse(jsonText);
      const items: Scheme[] = Array.isArray(parsed) ? parsed : [parsed];
      const errors: string[] = [];
      let importedCount = 0;

      const current = schemeService.getAllSchemes();

      items.forEach((item, index) => {
        if (!item.name || !item.id || !item.category) {
          errors.push(`Row ${index + 1}: Missing mandatory fields (id, name, or category).`);
          return;
        }

        const existingIdx = current.findIndex(s => s.id === item.id);
        if (existingIdx !== -1) {
          current[existingIdx] = { ...current[existingIdx], ...item };
        } else {
          current.push(item);
        }
        importedCount++;
      });

      schemeService.saveSchemes(current);
      return { success: true, importedCount, errors };
    } catch (e: any) {
      return { success: false, importedCount: 0, errors: [e.message || 'Invalid JSON syntax.'] };
    }
  },

  // Export all schemes as JSON
  exportJSON(): string {
    const schemes = schemeService.getAllSchemes();
    return JSON.stringify(schemes, null, 2);
  },

  // Reset to verified base dataset
  resetToVerifiedDefaults(): void {
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(verifiedSchemes));
  },

  // Calculate comprehensive database report
  generateDatabaseReport(): SchemeDatabaseReport {
    const schemes = schemeService.getAllSchemes();

    let totalCentralSchemes = 0;
    let totalStateSchemes = 0;
    let totalUTSchemes = 0;
    let totalDistrictSpecificSchemes = 0;

    const statusCounts: Record<SchemeStatusType, number> = {
      active: 0,
      application_open: 0,
      application_closed: 0,
      temporarily_suspended: 0,
      announced: 0,
      expired: 0,
      status_unknown: 0
    };

    const verificationCounts: Record<DataVerificationStatusType, number> = {
      verified: 0,
      pending_verification: 0,
      outdated: 0,
      conflicting: 0,
      archived: 0
    };

    const stateBreakdown: Record<string, number> = {};
    const categoryBreakdown: Record<SchemeCategoryType, number> = {} as any;

    ALL_28_SCHEME_CATEGORIES.forEach(cat => {
      categoryBreakdown[cat] = 0;
    });

    ALL_INDIAN_STATES_AND_UTS.forEach(state => {
      stateBreakdown[state] = 0;
    });

    schemes.forEach((s) => {
      if (s.type === 'central') totalCentralSchemes++;
      else if (s.type === 'ut') totalUTSchemes++;
      else totalStateSchemes++;

      if (s.isDistrictSpecific) totalDistrictSpecificSchemes++;

      if (s.schemeStatus && statusCounts[s.schemeStatus] !== undefined) {
        statusCounts[s.schemeStatus]++;
      } else {
        statusCounts['active']++;
      }

      if (s.verificationStatus && verificationCounts[s.verificationStatus] !== undefined) {
        verificationCounts[s.verificationStatus]++;
      } else {
        verificationCounts['verified']++;
      }

      if (s.category && categoryBreakdown[s.category] !== undefined) {
        categoryBreakdown[s.category]++;
      }

      s.stateCoverage.forEach((st) => {
        stateBreakdown[st] = (stateBreakdown[st] || 0) + 1;
      });
    });

    const duplicates = schemeService.detectDuplicates();

    return {
      totalSchemes: schemes.length,
      totalCentralSchemes,
      totalStateSchemes,
      totalUTSchemes,
      totalDistrictSpecificSchemes,
      statusCounts,
      verificationCounts,
      stateBreakdown,
      categoryBreakdown,
      duplicateCandidatesCount: duplicates.length
    };
  }
};
