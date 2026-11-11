/**
 * Kisan Suvidha Unified API Service Layer
 * Connects frontend features to the Django REST Framework backend with zero-failure offline fallback.
 */
import { apiRequest, checkBackendHealth, tokenStorage } from './apiClient';
import { authService, cleanAnonymousProfile } from '../utils/authService';
import { verifiedSchemes } from '../data/schemes';
import { verifiedAlerts } from '../data/alerts';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { queryFarmerAssistant } from '../utils/aiKnowledgeBase';
import { 
  UserAccount, 
  FarmerProfile, 
  Scheme, 
  EligibilityResult, 
  AlertItem, 
  Language, 
  ApplicationDraft 
} from '../types';

export const kisanApi = {
  // 1. Health & Server Status
  checkHealth: async () => {
    return await checkBackendHealth();
  },

  // 2. Authentication APIs
  auth: {
    register: async (payload: {
      full_name: string;
      email?: string;
      mobile?: string;
      password: string;
      state?: string;
      district?: string;
      village?: string;
    }): Promise<{ success: boolean; user?: UserAccount; error?: string; fromBackend: boolean }> => {
      const res = await apiRequest<{ success: boolean; token?: string; user?: any; errors?: any }>(
        '/auth/register/',
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      if (res.fromBackend && res.success && res.data) {
        if (res.data.token) {
          tokenStorage.set(res.data.token);
        }
        const backendUser: UserAccount = {
          id: res.data.user.id,
          email: res.data.user.email || '',
          fullName: res.data.user.full_name,
          mobile: res.data.user.mobile || '',
          role: res.data.user.role || 'farmer',
          createdAt: res.data.user.created_at,
          state: res.data.user.state || '',
          district: res.data.user.district || '',
          village: res.data.user.village || '',
          emailVerified: res.data.user.email_verified || false
        };
        // Also sync to local session so existing frontend hooks find it immediately
        localStorage.setItem('kisan_session_v3', JSON.stringify(backendUser));
        return { success: true, user: backendUser, fromBackend: true };
      }

      // Fallback to local authService if Django backend is offline
      const localRes = authService.register(
        {
          fullName: payload.full_name,
          email: payload.email,
          mobile: payload.mobile || '',
          state: payload.state || '',
          district: payload.district || '',
          village: payload.village || ''
        },
        payload.password
      );
      return { ...localRes, fromBackend: false };
    },

    login: async (identifier: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string; fromBackend: boolean }> => {
      const res = await apiRequest<{ success: boolean; token?: string; user?: any }>(
        '/auth/login/',
        {
          method: 'POST',
          body: JSON.stringify({ identifier, password })
        }
      );

      if (res.fromBackend && res.success && res.data) {
        if (res.data.token) {
          tokenStorage.set(res.data.token);
        }
        const backendUser: UserAccount = {
          id: res.data.user.id,
          email: res.data.user.email || '',
          fullName: res.data.user.full_name,
          mobile: res.data.user.mobile || '',
          role: res.data.user.role || 'farmer',
          createdAt: res.data.user.created_at,
          state: res.data.user.state || '',
          district: res.data.user.district || '',
          village: res.data.user.village || '',
          emailVerified: res.data.user.email_verified || false
        };
        localStorage.setItem('kisan_session_v3', JSON.stringify(backendUser));
        return { success: true, user: backendUser, fromBackend: true };
      }

      // Fallback to local authService if Django backend is offline
      const localRes = authService.login(identifier, password);
      return { ...localRes, fromBackend: false };
    },

    logout: async () => {
      await apiRequest('/auth/logout/', { method: 'POST' });
      tokenStorage.clear();
      authService.logout();
    },

    getMe: async (): Promise<UserAccount | null> => {
      const res = await apiRequest<{ success: boolean; user: any }>('/auth/me/');
      if (res.fromBackend && res.success && res.data?.user) {
        return {
          id: res.data.user.id,
          email: res.data.user.email || '',
          fullName: res.data.user.full_name,
          mobile: res.data.user.mobile || '',
          role: res.data.user.role || 'farmer',
          createdAt: res.data.user.created_at,
          state: res.data.user.state || '',
          district: res.data.user.district || '',
          village: res.data.user.village || '',
          emailVerified: res.data.user.email_verified || false
        };
      }
      return authService.getCurrentUser();
    }
  },

  // 3. Farmer Profile APIs
  profile: {
    get: async (userId?: string): Promise<FarmerProfile> => {
      const res = await apiRequest<{ success: boolean; profile: any }>('/profiles/me/');
      if (res.fromBackend && res.success && res.data?.profile) {
        const p = res.data.profile;
        return {
          id: p.id,
          userId: p.userId,
          name: p.name || '',
          state: p.state || '',
          district: p.district || '',
          taluka: p.taluka || '',
          village: p.village || '',
          pincode: p.pincode || '',
          preferredLanguage: p.preferred_language || 'en',
          primaryOccupation: p.primary_occupation,
          farmingType: p.farming_type,
          farmerCategory: p.farmer_category,
          landholdingAcres: p.landholding_acres,
          landholdingUnit: p.landholding_unit || 'acres',
          landOwnership: p.land_ownership,
          landType: p.land_type,
          irrigationAvailability: p.irrigation_availability,
          cropType: p.crop_type || [],
          cropSeason: p.crop_season,
          isOrganicFarmer: p.is_organic_farmer,
          alliedActivities: p.allied_activities || [],
          annualFamilyIncome: p.annual_family_income,
          socialCategory: p.social_category,
          isTribalOrSpecialRegion: p.is_tribal_or_special_region,
          isWomenFarmerHead: p.is_women_farmer_head,
          farmingNeeds: p.farming_needs || [],
          isIncomeTaxPayee: p.is_income_tax_payee,
          holdsConstitutionalPost: p.holds_constitutional_post,
          isInstitutionalLandholder: p.is_institutional_landholder,
          hasAadhaarLinkedBankDBT: p.has_aadhaar_linked_bank_dbt,
          isBankDBTEnabled: p.is_bank_dbt_enabled,
          hasLandRecords712: p.has_land_records_712,
          hasKisanCreditCard: p.has_kisan_credit_card,
          hasSoilHealthCard: p.has_soil_health_card,
          previousSubsidyAvailed: p.previous_subsidy_availed,
          hasFarmerRegistrationId: p.has_farmer_registration_id,
          profileCompletionPercent: p.profile_completion_percent,
          updatedAt: p.updated_at
        };
      }

      if (userId) {
        return authService.getFarmerProfile(userId);
      }
      return cleanAnonymousProfile;
    },

    save: async (profile: FarmerProfile): Promise<{ success: boolean; profile: FarmerProfile; fromBackend: boolean }> => {
      const payload = {
        name: profile.name,
        state: profile.state,
        district: profile.district,
        taluka: profile.taluka,
        village: profile.village,
        pincode: profile.pincode,
        preferred_language: profile.preferredLanguage,
        primary_occupation: profile.primaryOccupation,
        farming_type: profile.farmingType,
        farmer_category: profile.farmerCategory,
        landholding_acres: profile.landholdingAcres,
        landholding_unit: profile.landholdingUnit,
        land_ownership: profile.landOwnership,
        land_type: profile.landType,
        irrigation_availability: profile.irrigationAvailability,
        crop_type: profile.cropType,
        crop_season: profile.cropSeason,
        is_organic_farmer: profile.isOrganicFarmer,
        allied_activities: profile.alliedActivities,
        annual_family_income: profile.annualFamilyIncome,
        social_category: profile.socialCategory,
        is_tribal_or_special_region: profile.isTribalOrSpecialRegion,
        is_women_farmer_head: profile.isWomenFarmerHead,
        farming_needs: profile.farmingNeeds,
        is_income_tax_payee: profile.isIncomeTaxPayee,
        holds_constitutional_post: profile.holdsConstitutionalPost,
        is_institutional_landholder: profile.isInstitutionalLandholder,
        has_aadhaar_linked_bank_dbt: profile.hasAadhaarLinkedBankDBT,
        is_bank_dbt_enabled: profile.isBankDBTEnabled,
        has_land_records_712: profile.hasLandRecords712,
        has_kisan_credit_card: profile.hasKisanCreditCard,
        has_soil_health_card: profile.hasSoilHealthCard,
        previous_subsidy_availed: profile.previousSubsidyAvailed,
        has_farmer_registration_id: profile.hasFarmerRegistrationId
      };

      const res = await apiRequest<{ success: boolean; profile: any }>('/profiles/me/', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.fromBackend && res.success) {
        // Also update local storage cache for immediate reactivity
        authService.saveFarmerProfile(profile);
        return { success: true, profile, fromBackend: true };
      }

      authService.saveFarmerProfile(profile);
      return { success: true, profile, fromBackend: false };
    }
  },

  // 4. Schemes APIs
  schemes: {
    list: async (filters: { query?: string; state?: string; category?: string; crop?: string; type?: string } = {}): Promise<Scheme[]> => {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.crop) params.append('crop', filters.crop);
      if (filters.type) params.append('type', filters.type);

      const res = await apiRequest<{ success: boolean; schemes: Scheme[] }>(`/schemes/?${params.toString()}`);
      if (res.fromBackend && res.success && Array.isArray(res.data?.schemes) && res.data.schemes.length > 0) {
        return res.data.schemes;
      }
      // Fallback to verified schemes collection
      return verifiedSchemes;
    },

    get: async (id: string): Promise<Scheme | undefined> => {
      const res = await apiRequest<{ success: boolean; scheme: Scheme }>(`/schemes/${id}/`);
      if (res.fromBackend && res.success && res.data?.scheme) {
        return res.data.scheme;
      }
      return verifiedSchemes.find(s => s.id === id);
    }
  },

  // 5. Deterministic Eligibility Engine API
  eligibility: {
    check: async (
      schemeId: string, 
      farmerProfile: FarmerProfile, 
      lang: Language = 'en'
    ): Promise<EligibilityResult> => {
      const res = await apiRequest<{ success: boolean; result: any }>(
        '/eligibility/check/',
        {
          method: 'POST',
          body: JSON.stringify({
            scheme_id: schemeId,
            lang,
            profile: {
              land_ownership: farmerProfile.landOwnership,
              landholding_acres: farmerProfile.landholdingAcres,
              irrigation_availability: farmerProfile.irrigationAvailability,
              crop_type: farmerProfile.cropType,
              state: farmerProfile.state,
              social_category: farmerProfile.socialCategory,
              has_aadhaar_linked_bank_dbt: farmerProfile.hasAadhaarLinkedBankDBT,
              is_income_tax_payee: farmerProfile.isIncomeTaxPayee,
              has_land_records_712: farmerProfile.hasLandRecords712
            }
          })
        }
      );

      if (res.fromBackend && res.success && res.data?.result) {
        const r = res.data.result;
        return {
          schemeId: r.scheme_id,
          status: r.status,
          matchedRules: r.matched_rules || [],
          failedRules: r.failed_rules || [],
          missingRules: r.missing_rules || [],
          summary: r.summary,
          nextSteps: r.next_steps || [],
          verifiedRuleCount: r.verified_rule_count || 0
        };
      }

      // Deterministic fallback to local rule engine
      const scheme = verifiedSchemes.find(s => s.id === schemeId);
      if (scheme) {
        return evaluateSchemeEligibility(farmerProfile, scheme, lang);
      }
      return {
        schemeId,
        status: 'partially_eligible',
        matchedRules: [],
        failedRules: [],
        missingRules: [],
        summary: 'Statutory verification pending.',
        nextSteps: [],
        verifiedRuleCount: 0
      };
    }
  },

  // 6. Gemini-Powered AI Agent with Controlled Backend Tools
  aiAgent: {
    chat: async (
      message: string,
      options: {
        sessionId?: string;
        language?: Language;
        activeFarmer?: FarmerProfile;
      } = {}
    ): Promise<{
      response: string;
      sessionId?: string;
      toolsInvoked?: any[];
      sources?: string[];
      agentMode?: string;
      fromBackend: boolean;
    }> => {
      const res = await apiRequest<{
        success: boolean;
        response: string;
        session_id: string;
        tools_invoked: any[];
        sources: string[];
        agent_mode: string;
      }>(
        '/ai/chat/',
        {
          method: 'POST',
          body: JSON.stringify({
            message,
            session_id: options.sessionId,
            language: options.language || 'en',
            profile: options.activeFarmer ? {
              name: options.activeFarmer.name,
              state: options.activeFarmer.state,
              district: options.activeFarmer.district,
              village: options.activeFarmer.village,
              landholding_acres: options.activeFarmer.landholdingAcres,
              land_ownership: options.activeFarmer.landOwnership,
              crop_type: options.activeFarmer.cropType,
              has_aadhaar_linked_bank_dbt: options.activeFarmer.hasAadhaarLinkedBankDBT
            } : undefined
          })
        }
      );

      if (res.fromBackend && res.success && res.data) {
        return {
          response: res.data.response,
          sessionId: res.data.session_id,
          toolsInvoked: res.data.tools_invoked || [],
          sources: res.data.sources || [],
          agentMode: res.data.agent_mode,
          fromBackend: true
        };
      }

      // Offline fallback grounded in verified knowledge base
      const localRes = queryFarmerAssistant(message, options.language || 'en', options.activeFarmer);
      return {
        response: localRes.response,
        sessionId: options.sessionId || 'local-session',
        toolsInvoked: [{ tool: 'knowledge_base_retrieval', args: { query: message } }],
        sources: localRes.sourceSchemeId ? [localRes.sourceSchemeId] : [],
        agentMode: 'Offline Verified Knowledge Retrieval',
        fromBackend: false
      };
    }
  },

  // 7. Saved Schemes & Application Progress
  saved: {
    list: async (userId?: string): Promise<string[]> => {
      const res = await apiRequest<{ success: boolean; scheme_ids: string[] }>('/saved/');
      if (res.fromBackend && res.success && Array.isArray(res.data?.scheme_ids)) {
        return res.data.scheme_ids;
      }
      if (userId) {
        const p = authService.getFarmerProfile(userId);
        return p.savedSchemeIds || [];
      }
      return [];
    },

    toggle: async (schemeId: string, userId?: string): Promise<{ isSaved: boolean; schemeIds: string[] }> => {
      const res = await apiRequest<{ success: boolean; is_saved: boolean; scheme_ids: string[] }>(
        '/saved/toggle/',
        {
          method: 'POST',
          body: JSON.stringify({ scheme_id: schemeId })
        }
      );

      if (res.fromBackend && res.success && res.data) {
        if (userId) {
          authService.toggleSavedScheme(schemeId, userId);
        }
        return {
          isSaved: res.data.is_saved,
          schemeIds: res.data.scheme_ids
        };
      }

      if (userId) {
        const schemeIds = authService.toggleSavedScheme(schemeId, userId);
        const isSaved = schemeIds.includes(schemeId);
        return { isSaved, schemeIds };
      }
      return { isSaved: false, schemeIds: [] };
    },

    getDraft: async (schemeId: string, userId?: string): Promise<ApplicationDraft> => {
      const res = await apiRequest<{ success: boolean; draft: any }>(`/saved/drafts/${schemeId}/`);
      if (res.fromBackend && res.success && res.data?.draft) {
        const d = res.data.draft;
        return {
          schemeId: d.scheme_id,
          documentStatus: d.document_status || {},
          completedSteps: d.completed_steps || [],
          notes: d.notes || '',
          updatedAt: d.updated_at
        };
      }
      if (userId) {
        const localDraft = authService.getApplicationDraft(schemeId, userId);
        if (localDraft) {
          return localDraft;
        }
      }
      return {
        schemeId,
        documentStatus: {},
        completedSteps: [],
        notes: '',
        updatedAt: new Date().toISOString()
      };
    },

    saveDraft: async (draft: ApplicationDraft, userId?: string) => {
      await apiRequest(`/saved/drafts/${draft.schemeId}/`, {
        method: 'POST',
        body: JSON.stringify({
          document_status: draft.documentStatus,
          completed_steps: draft.completedSteps,
          notes: draft.notes
        })
      });
      if (userId) {
        authService.saveApplicationDraft(draft, userId);
      }
    }
  },

  // 8. Alerts & Deadlines APIs
  alerts: {
    list: async (filters: { state?: string; urgent?: boolean } = {}): Promise<AlertItem[]> => {
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.urgent) params.append('urgent', 'true');

      const res = await apiRequest<{ success: boolean; alerts: AlertItem[] }>(`/alerts/?${params.toString()}`);
      if (res.fromBackend && res.success && Array.isArray(res.data?.alerts) && res.data.alerts.length > 0) {
        return res.data.alerts;
      }
      return verifiedAlerts;
    }
  }
};
