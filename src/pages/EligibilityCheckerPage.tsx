import React, { useState, useMemo, useEffect } from 'react';
import { Scheme, Language, FarmerProfile, EligibilityResult } from '../types';
import { schemeService, ALL_INDIAN_STATES_AND_UTS } from '../utils/schemeService';
import { translations } from '../translations';
import { evaluateSchemeEligibility, evaluateAllSchemes } from '../utils/eligibilityEngine';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ExternalLink, 
  Sliders, 
  RotateCcw,
  User,
  Info,
  Check,
  ChevronDown,
  Layers,
  FileCheck,
  Save,
  Edit3
} from 'lucide-react';

interface EligibilityCheckerPageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  onUpdateFarmer: (updated: FarmerProfile) => void;
  initialSchemeId?: string;
  onNavigateToGuidance: (schemeId: string) => void;
}

export const EligibilityCheckerPage: React.FC<EligibilityCheckerPageProps> = ({
  language,
  activeFarmer,
  onUpdateFarmer,
  initialSchemeId,
  onNavigateToGuidance
}) => {
  const t = translations[language];

  // Dynamic schemes repository
  const schemes = useMemo(() => schemeService.getAllSchemes(), []);

  // Selected scheme for focused audit view or 'all'
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId || 'all');
  
  // Interactive Questionnaire Drawer toggle (open by default if profile is incomplete)
  const isProfileIncomplete = useMemo(() => {
    return (
      !activeFarmer.state ||
      activeFarmer.landholdingAcres === undefined ||
      !activeFarmer.landOwnership ||
      activeFarmer.isIncomeTaxPayee === 'not_sure' ||
      activeFarmer.isIncomeTaxPayee === undefined
    );
  }, [activeFarmer]);

  const [showInteractiveEditor, setShowInteractiveEditor] = useState<boolean>(true);

  // Local state for interactive questionnaire testing
  const [testAnswers, setTestAnswers] = useState<FarmerProfile>(() => ({
    ...activeFarmer,
    state: activeFarmer.state || '',
    landholdingAcres: activeFarmer.landholdingAcres,
    landOwnership: activeFarmer.landOwnership || '',
    irrigationAvailability: activeFarmer.irrigationAvailability || '',
    isIncomeTaxPayee: activeFarmer.isIncomeTaxPayee ?? '',
    hasAadhaarLinkedBankDBT: activeFarmer.hasAadhaarLinkedBankDBT ?? '',
    hasLandRecords712: activeFarmer.hasLandRecords712 ?? '',
    previousSubsidyAvailed: activeFarmer.previousSubsidyAvailed ?? ''
  }));

  // Track if changes are modified compared to saved activeFarmer profile
  const [isModified, setIsModified] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Sync test answers when activeFarmer changes externally
  useEffect(() => {
    setTestAnswers({
      ...activeFarmer,
      state: activeFarmer.state || '',
      landholdingAcres: activeFarmer.landholdingAcres,
      landOwnership: activeFarmer.landOwnership || '',
      irrigationAvailability: activeFarmer.irrigationAvailability || '',
      isIncomeTaxPayee: activeFarmer.isIncomeTaxPayee ?? '',
      hasAadhaarLinkedBankDBT: activeFarmer.hasAadhaarLinkedBankDBT ?? '',
      hasLandRecords712: activeFarmer.hasLandRecords712 ?? '',
      previousSubsidyAvailed: activeFarmer.previousSubsidyAvailed ?? ''
    });
    setIsModified(false);
  }, [activeFarmer]);

  // Current scheme object if one selected
  const activeScheme = useMemo(() => {
    return schemes.find(s => s.id === selectedSchemeId) || null;
  }, [schemes, selectedSchemeId]);

  // Evaluations for all schemes using current test answers
  const allEvaluations = useMemo(() => {
    return evaluateAllSchemes(testAnswers, schemes, language);
  }, [testAnswers, schemes, language]);

  // Focused evaluation if single scheme selected
  const focusedEvaluation = useMemo(() => {
    if (!activeScheme) return null;
    return evaluateSchemeEligibility(testAnswers, activeScheme, language);
  }, [testAnswers, activeScheme, language]);

  // Handler for tweaking individual parameters in questionnaire
  const handleFieldChange = (field: keyof FarmerProfile, value: any) => {
    setTestAnswers(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  // Reset questionnaire back to saved profile details
  const handleResetToSaved = () => {
    setTestAnswers({
      ...activeFarmer,
      state: activeFarmer.state || '',
      landholdingAcres: activeFarmer.landholdingAcres,
      landOwnership: activeFarmer.landOwnership || '',
      irrigationAvailability: activeFarmer.irrigationAvailability || '',
      isIncomeTaxPayee: activeFarmer.isIncomeTaxPayee ?? '',
      hasAadhaarLinkedBankDBT: activeFarmer.hasAadhaarLinkedBankDBT ?? '',
      hasLandRecords712: activeFarmer.hasLandRecords712 ?? '',
      previousSubsidyAvailed: activeFarmer.previousSubsidyAvailed ?? ''
    });
    setIsModified(false);
  };

  // Save modified parameters permanently to profile in localStorage
  const handleSaveChanges = () => {
    onUpdateFarmer(testAnswers);
    setIsModified(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  // Helper formatting for Current Farm Parameters
  const farmParametersSummary = useMemo(() => {
    const parts: string[] = [];
    if (activeFarmer.state) parts.push(activeFarmer.state);
    if (activeFarmer.landholdingAcres !== undefined && activeFarmer.landholdingAcres > 0) {
      parts.push(`${activeFarmer.landholdingAcres} Acres`);
    }
    if (activeFarmer.landOwnership) {
      const ownershipMap: Record<string, string> = {
        owner: 'Land Owner Cultivator',
        tenant: 'Tenant Farmer',
        sharecropper: 'Sharecropper',
        joint: 'Joint Land Ownership',
        landless: 'Landless Farmer'
      };
      parts.push(ownershipMap[activeFarmer.landOwnership] || activeFarmer.landOwnership);
    }
    return parts;
  }, [activeFarmer]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14532D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Profile updated and saved to your account!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>25-Condition Statutory Rule Engine (No AI Guesswork)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.checker.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.checker.subtitle}
          </p>
        </div>

        {/* Current Farm Parameters Badge (Displays actual entered info or Profile Incomplete) */}
        <div className="bg-white p-3 px-4 rounded-2xl border border-stone-200 shadow-xs self-start md:self-auto w-full sm:w-auto">
          <div className="text-xs">
            <p className="font-bold text-stone-900">Current Farm Parameters</p>
            {farmParametersSummary.length > 0 ? (
              <p className="text-stone-600 font-medium mt-0.5">
                {farmParametersSummary.join(' · ')}
              </p>
            ) : (
              <p className="text-amber-800 font-semibold mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Profile Incomplete – Add Your Farming Details</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scheme Selection & Questionnaire Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Scheme Selector Dropdown */}
        <div className="flex-1 max-w-md">
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
            {t.checker.chooseScheme}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-semibold text-xs sm:text-sm focus:outline-hidden focus:border-[#14532D]"
          >
            <option value="all">⚡ {t.checker.evaluateAll} ({schemes.length} Schemes)</option>
            {schemes.map((scheme) => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.localNames?.[language] || scheme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Interactive Farm Parameters */}
        <div className="flex items-end">
          <button
            onClick={() => setShowInteractiveEditor(!showInteractiveEditor)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showInteractiveEditor 
                ? 'bg-[#14532D] text-white shadow-xs' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{showInteractiveEditor ? 'Hide Assessment Parameters' : 'Edit Assessment Parameters'}</span>
          </button>
        </div>
      </div>

      {/* ================= INTERACTIVE FARM PARAMETERS PANEL ================= */}
      {showInteractiveEditor && (
        <div className="bg-[#FAF9F5] p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Interactive Farm Parameters & Questionnaire
                </h3>
                {isModified ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                    Testing Modified Answers
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px]">
                    Loaded from Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Adjust any answers below to see immediate statutory rule recalculations. All dropdowns are neutral and interactive.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isModified && (
                <button
                  type="button"
                  onClick={handleResetToSaved}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Saved</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!isModified}
                className="px-4 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes to Profile</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Field 1: Land Ownership / Cultivator Status */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Land Ownership / Cultivator:
              </label>
              <select
                value={testAnswers.landOwnership || ''}
                onChange={(e) => handleFieldChange('landOwnership', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select your land ownership status</option>
                <option value="owner">Land Owner Cultivator</option>
                <option value="tenant">Tenant Farmer (Bataidar)</option>
                <option value="sharecropper">Sharecropper</option>
                <option value="joint">Joint Land Ownership</option>
                <option value="landless">Landless Farmer</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Field 2: Total Landholding (manual entry, NO default 2.5) */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Landholding:
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={testAnswers.landholdingAcres !== undefined ? testAnswers.landholdingAcres : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  handleFieldChange('landholdingAcres', val === '' ? undefined : parseFloat(val));
                }}
                placeholder="Enter your landholding in acres"
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              />
            </div>

            {/* Field 3: Farmer State */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Farmer State:
              </label>
              <select
                value={testAnswers.state || ''}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select your state</option>
                {ALL_INDIAN_STATES_AND_UTS.filter(s => s !== 'All India').map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Field 4: Irrigation Water Source */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Irrigation Water Source:
              </label>
              <select
                value={testAnswers.irrigationAvailability || ''}
                onChange={(e) => handleFieldChange('irrigationAvailability', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select water source</option>
                <option value="rainfed">Rainfed (Dryland / No Source)</option>
                <option value="well_borewell">Well / Borewell</option>
                <option value="canal">Canal Irrigation</option>
                <option value="river">River / Lift</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Field 5: Income Tax Payer */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Income Tax Payer:
              </label>
              <select
                value={String(testAnswers.isIncomeTaxPayee ?? '')}
                onChange={(e) => handleFieldChange('isIncomeTaxPayee', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select Yes / No / Not Sure</option>
                <option value="no">No (Not an Income Tax Payee)</option>
                <option value="yes">Yes (Paid Income Tax)</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>

            {/* Field 6: Bank Aadhaar-DBT Status */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Bank Aadhaar-DBT Status:
              </label>
              <select
                value={String(testAnswers.hasAadhaarLinkedBankDBT ?? '')}
                onChange={(e) => handleFieldChange('hasAadhaarLinkedBankDBT', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select status</option>
                <option value="yes">Yes (Active & Seeded in Bank)</option>
                <option value="no">No (Not Linked / Inactive)</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>

            {/* Field 7: Land Record Availability */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Land Record Availability:
              </label>
              <select
                value={String(testAnswers.hasLandRecords712 ?? '')}
                onChange={(e) => handleFieldChange('hasLandRecords712', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select status</option>
                <option value="yes">Yes (Available Digitized RoR / 7/12)</option>
                <option value="no">No (No Land Title in Name)</option>
                <option value="applied">Applied For</option>
                <option value="not_applicable">Not Applicable</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>

            {/* Field 8: Previous Machinery Subsidy */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Previous Machinery Subsidy:
              </label>
              <select
                value={String(testAnswers.previousSubsidyAvailed ?? '')}
                onChange={(e) => handleFieldChange('previousSubsidyAvailed', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              >
                <option value="">Select Yes / No / Not Sure</option>
                <option value="no">No (No machinery subsidy in last 5 years)</option>
                <option value="yes">Yes (Subsidized machinery received)</option>
                <option value="not_sure">Not Sure</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* CLASSIFICATION KEY / LEGEND */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        
        {/* A. Likely Eligible */}
        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-900">Likely Eligible</p>
            <p className="text-emerald-800 text-[11px] mt-0.5 leading-snug">
              All evaluated mandatory conditions are confirmed and satisfied based on your answers.
            </p>
          </div>
        </div>

        {/* B. Insufficient Information */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Insufficient Information</p>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-snug">
              Required profile fields are unanswered or marked 'Not Sure'. Provide missing details to verify.
            </p>
          </div>
        </div>

        {/* C. Not Currently Eligible */}
        <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 flex items-start gap-2.5">
          <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Not Currently Eligible</p>
            <p className="text-red-800 text-[11px] mt-0.5 leading-snug">
              A mandatory requirement or statutory exclusion rule was confirmed not met.
            </p>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: SINGLE SCHEME 25-POINT AUDIT */}
      {activeScheme && focusedEvaluation && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header of Single Scheme */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#65A30D]">
                {activeScheme.category} · {activeScheme.type === 'central' ? 'Central Sector' : 'State Scheme'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#14532D]">
                {activeScheme.localNames[language] || activeScheme.name}
              </h2>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-xs sm:text-sm ${
              focusedEvaluation.status === 'eligible'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : focusedEvaluation.status === 'partially_eligible'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              {focusedEvaluation.status === 'eligible' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {focusedEvaluation.status === 'partially_eligible' && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {focusedEvaluation.status === 'not_eligible' && <XCircle className="w-5 h-5 text-red-600" />}
              <span>
                {focusedEvaluation.status === 'eligible' 
                  ? 'Likely Eligible' 
                  : focusedEvaluation.status === 'partially_eligible' 
                  ? 'Insufficient Information' 
                  : 'Not Currently Eligible'}
              </span>
            </div>
          </div>

          {/* Verification Result Summary */}
          <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
            focusedEvaluation.status === 'eligible'
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
              : focusedEvaluation.status === 'partially_eligible'
              ? 'bg-amber-50/50 border-amber-200 text-amber-900'
              : 'bg-red-50/50 border-red-200 text-red-900'
          }`}>
            <p className="font-bold mb-1">
              Assessment Summary:
            </p>
            <p>{focusedEvaluation.summary}</p>
          </div>

          {/* 3 Columns: Matched Rules, Failed Rules, Missing Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Matched Conditions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                <span>Satisfied Criteria</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-tabular">
                  {focusedEvaluation.matchedRules.length}
                </span>
              </h3>

              {focusedEvaluation.matchedRules.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                  None of the mandatory conditions were matched yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {focusedEvaluation.matchedRules.map((evalItem, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <p className="font-bold text-emerald-950 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{evalItem.rule.label[language]}</span>
                      </p>
                      <p className="text-emerald-800 text-[11px] pl-5 leading-relaxed">
                        {evalItem.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Failed Disqualifying Criteria */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center justify-between">
                <span>Failed Disqualifications</span>
                <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded-full font-tabular">
                  {focusedEvaluation.failedRules.length}
                </span>
              </h3>

              {focusedEvaluation.failedRules.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                  No mandatory criteria failed. Zero disqualifications detected.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {focusedEvaluation.failedRules.map((evalItem, idx) => (
                    <div key={idx} className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-xs space-y-1">
                      <p className="font-bold text-red-950 flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                        <span>{evalItem.rule.label[language]}</span>
                      </p>
                      <p className="text-red-800 text-[11px] pl-5 leading-relaxed">
                        {evalItem.message}
                      </p>
                      {evalItem.remedy && (
                        <p className="text-stone-700 text-[11px] pl-5 font-semibold pt-1">
                          Remedy: {evalItem.remedy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Missing Information Needed */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                <span>Information Still Required</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-tabular">
                  {focusedEvaluation.missingRules.length}
                </span>
              </h3>

              {focusedEvaluation.missingRules.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
                  Profile is complete for this scheme. No missing records.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {focusedEvaluation.missingRules.map((evalItem, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1">
                      <p className="font-bold text-amber-950 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{evalItem.rule.label[language]}</span>
                      </p>
                      <p className="text-amber-800 text-[11px] pl-5 leading-relaxed">
                        {evalItem.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Next Steps & Portal Link */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Recommended Next Action Steps
            </h3>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
              {focusedEvaluation.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToGuidance(activeScheme.id)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>{t.checker.prepareDocs}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={activeScheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.checker.openPortal}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedSchemeId('all')}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer ml-auto"
              >
                ← Back to All Schemes Overview
              </button>
            </div>
          </div>

          {/* Official Disclaimer */}
          <p className="text-[11px] text-stone-500 italic pt-2">
            Notice: Eligibility evaluations reflect statutory operational guidelines and responses entered above. Final sanction and benefit transfers remain subject to verification and approval by the concerned Government Department.
          </p>

        </div>
      )}

      {/* VIEW MODE 2: ALL SCHEMES MATRIX / OVERVIEW */}
      {selectedSchemeId === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Evaluated Schemes for Farmer Parameters ({testAnswers.state || 'Unspecified State'})
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Real-time rule evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme) => {
              const res = allEvaluations[scheme.id] || { status: 'partially_eligible', matchedRules: [], failedRules: [], missingRules: [], nextSteps: [], summary: '' };
              const isEligible = res.status === 'eligible';
              const isPartial = res.status === 'partially_eligible';
              const isNotEligible = res.status === 'not_eligible';

              return (
                <div
                  key={scheme.id}
                  className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isEligible
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : isPartial
                      ? 'bg-white border-amber-300 shadow-xs'
                      : 'bg-white border-stone-200 opacity-90'
                  }`}
                >
                  <div>
                    {/* Top Status Strip */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        {scheme.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isEligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isEligible && <CheckCircle2 className="w-3 h-3" />}
                        {isPartial && <AlertCircle className="w-3 h-3" />}
                        {isNotEligible && <XCircle className="w-3 h-3" />}
                        <span>
                          {isEligible 
                            ? 'Likely Eligible' 
                            : isPartial 
                            ? 'Insufficient Information' 
                            : 'Not Currently Eligible'}
                        </span>
                      </span>
                    </div>

                    {/* Scheme Title */}
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {scheme.localNames?.[language] || scheme.name}
                    </h3>

                    {/* Summary text */}
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {res.summary}
                    </p>

                    {/* Rule count pills */}
                    <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
                      <span className="text-emerald-700 font-semibold">
                        ✓ {res.matchedRules.length} Matched
                      </span>
                      {res.failedRules.length > 0 && (
                        <span className="text-red-600 font-semibold">
                          ✕ {res.failedRules.length} Failed
                        </span>
                      )}
                      {res.missingRules.length > 0 && (
                        <span className="text-amber-600 font-semibold">
                          ? {res.missingRules.length} Missing Info
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedSchemeId(scheme.id)}
                      className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View 25-Point Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onNavigateToGuidance(scheme.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Docs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default EligibilityCheckerPage;
