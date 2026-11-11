import React, { useState, useEffect } from 'react';
import { 
  FarmerProfile, 
  Language, 
  LandOwnershipType, 
  FarmerCategoryType, 
  IrrigationType 
} from '../types';
import { translations } from '../translations';
import { ALL_INDIAN_STATES_AND_UTS } from '../utils/schemeService';
import { getDistrictsForState } from '../data/indianDistricts';
import { 
  UserCheck, 
  Save, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Sprout, 
  CreditCard, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FarmerRegistrationPageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  onSaveProfile: (profile: FarmerProfile) => void;
  onNavigateToDashboard: () => void;
}

const FARMING_TYPES = [
  { id: 'crop_farming', label: 'Crop Farming (धान्य / पिके शेती)' },
  { id: 'horticulture', label: 'Horticulture & Fruits (फलोत्पादन / बागवानी)' },
  { id: 'dairy', label: 'Dairy Farming (दुग्ध व्यवसाय)' },
  { id: 'poultry', label: 'Poultry Farming (कुक्कुटपालन)' },
  { id: 'fisheries', label: 'Fisheries (मत्स्यपालन)' },
  { id: 'mixed', label: 'Mixed Farming (मिश्र शेती)' },
  { id: 'other', label: 'Other (इतर)' }
];

const LAND_OWNERSHIP_OPTIONS = [
  { id: 'owner', label: 'Land Owner Cultivator (स्वतःची जमीन मालक)' },
  { id: 'tenant', label: 'Tenant Farmer / Bataidar (बटाईदार / भाडेपट्टा शेतकरी)' },
  { id: 'sharecropper', label: 'Sharecropper (हिस्सेदार)' },
  { id: 'joint', label: 'Joint Land Ownership (सामायिक मालकी)' },
  { id: 'landless', label: 'Landless Farmer (भूमिहीन शेतकरी)' },
  { id: 'other', label: 'Other (इतर)' }
];

const IRRIGATION_OPTIONS = [
  { id: 'rainfed', label: 'Rainfed (जिरायती / कोरडवाहू)' },
  { id: 'well_borewell', label: 'Well / Borewell (विहीर / कूपनलिका)' },
  { id: 'canal', label: 'Canal (कालवा / नहर)' },
  { id: 'river', label: 'River / Lift Irrigation (नदी / उपसा सिंचन)' },
  { id: 'drip', label: 'Drip Irrigation (ठिबक सिंचन)' },
  { id: 'sprinkler', label: 'Sprinkler (तुषार सिंचन)' },
  { id: 'other', label: 'Other (इतर)' }
];

const POPULAR_CROPS = [
  'Wheat (गहू / गेहूं)',
  'Paddy / Rice (भात / धान)',
  'Cotton (कापूस / कपास)',
  'Soybean (सोयाबीन)',
  'Sugarcane (ऊस / गन्ना)',
  'Gram / Chana (हरभरा / चना)',
  'Tur / Arhar (तूर / अरहर)',
  'Maize (मका / मक्का)',
  'Bajra / Millets (बाजरी / बाजरा)',
  'Mustard (मोहरी / सरसों)',
  'Onion (कांदा / प्याज)',
  'Vegetables (भाजीपाला / सब्जियां)',
  'Fruits / Mango / Banana (फळे)'
];

export const FarmerRegistrationPage: React.FC<FarmerRegistrationPageProps> = ({
  language,
  activeFarmer,
  onSaveProfile,
  onNavigateToDashboard
}) => {
  const t = translations[language];

  // Active step (1: Personal & Location, 2: Farming Details, 3: Financial & Scheme Status)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state initialized from activeFarmer profile (without hardcoded defaults)
  const [formData, setFormData] = useState<FarmerProfile>({
    ...activeFarmer,
    name: activeFarmer.name || '',
    state: activeFarmer.state || '',
    district: activeFarmer.district || '',
    taluka: activeFarmer.taluka || '',
    village: activeFarmer.village || '',
    preferredLanguage: activeFarmer.preferredLanguage || language,
    farmingType: activeFarmer.farmingType || '',
    landOwnership: activeFarmer.landOwnership || '',
    landholdingAcres: activeFarmer.landholdingAcres,
    cropType: activeFarmer.cropType || [],
    irrigationAvailability: activeFarmer.irrigationAvailability || '',
    isIncomeTaxPayee: activeFarmer.isIncomeTaxPayee ?? 'not_sure',
    hasAadhaarLinkedBankDBT: activeFarmer.hasAadhaarLinkedBankDBT ?? 'not_sure',
    isBankDBTEnabled: activeFarmer.isBankDBTEnabled ?? 'not_sure',
    hasLandRecords712: activeFarmer.hasLandRecords712 ?? 'not_sure',
    previousSubsidyAvailed: activeFarmer.previousSubsidyAvailed ?? 'not_sure',
    hasFarmerRegistrationId: activeFarmer.hasFarmerRegistrationId ?? 'not_sure'
  });

  // Custom other inputs
  const [otherCropInput, setOtherCropInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Available districts dependent on selected state
  const availableDistricts = React.useMemo(() => {
    return getDistrictsForState(formData.state);
  }, [formData.state]);

  // When state changes, if district is no longer valid, clear it
  const handleStateChange = (newState: string) => {
    setFormData(prev => ({
      ...prev,
      state: newState,
      district: '' // Reset district when state changes
    }));
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name?.trim()) {
        errs.name = language === 'hi' ? 'कृपया किसान का नाम दर्ज करें' : language === 'mr' ? 'कृपया शेतकऱ्याचे नाव प्रविष्ट करा' : 'Full Name is required';
      }
      if (!formData.state?.trim()) {
        errs.state = language === 'hi' ? 'कृपया राज्य चुनें' : language === 'mr' ? 'कृपया राज्य निवडा' : 'State selection is required';
      }
      if (!formData.district?.trim()) {
        errs.district = language === 'hi' ? 'कृपया ज़िला चुनें' : language === 'mr' ? 'कृपया जिल्हा निवडा' : 'District selection is required';
      }
    } else if (step === 2) {
      if (formData.landholdingAcres !== undefined && formData.landholdingAcres < 0) {
        errs.landholdingAcres = 'Landholding must be a positive decimal number (e.g. 1.5, 3.25)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle crop selection
  const handleToggleCrop = (crop: string) => {
    const current = formData.cropType || [];
    if (current.includes(crop)) {
      setFormData(prev => ({
        ...prev,
        cropType: current.filter(c => c !== crop)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cropType: [...current, crop]
      }));
    }
  };

  const handleAddOtherCrop = () => {
    if (!otherCropInput.trim()) return;
    const current = formData.cropType || [];
    if (!current.includes(otherCropInput.trim())) {
      setFormData(prev => ({
        ...prev,
        cropType: [...current, otherCropInput.trim()]
      }));
    }
    setOtherCropInput('');
  };

  // Save current profile state to storage and notify
  const handleSaveAndComplete = (isContinueLater = false) => {
    if (!isContinueLater && !validateStep(currentStep)) return;

    // Calculate category from acres if entered
    let category: FarmerCategoryType | undefined = undefined;
    if (formData.landholdingAcres !== undefined && formData.landholdingAcres > 0) {
      category = formData.landholdingAcres < 2.5 
        ? 'marginal' 
        : formData.landholdingAcres <= 5.0 
        ? 'small' 
        : formData.landholdingAcres <= 10.0 
        ? 'medium' 
        : 'large';
    }

    const updatedProfile: FarmerProfile = {
      ...formData,
      farmerCategory: category,
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(updatedProfile);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      onNavigateToDashboard();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Step-by-Step Farmer Profile Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
          {language === 'hi' ? 'किसान प्रोफ़ाइल सेटअप' : language === 'mr' ? 'शेतकरी प्रोफाइल तपशील' : 'Farmer Profile Setup'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Complete your profile to unlock statutory eligibility assessments, scheme matching, and customized document roadmaps. All details remain confidential.
        </p>
      </div>

      {/* MULTI-STEP PROGRESS INDICATOR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs font-bold">
          <span className="text-[#14532D]">
            Step {currentStep} of 3: {
              currentStep === 1 
                ? 'Personal & Location Details' 
                : currentStep === 2 
                ? 'Farming & Land Details' 
                : 'Financial & Statutory Verification'
            }
          </span>
          <span className="text-stone-500 font-medium">
            {currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%'}
          </span>
        </div>

        {/* 3 Step Pill Bars */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentStep >= 1 ? 'bg-[#14532D]' : 'bg-stone-200'
            }`}
          />
          <button
            type="button"
            onClick={() => validateStep(1) && setCurrentStep(2)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentStep >= 2 ? 'bg-[#14532D]' : 'bg-stone-200'
            }`}
          />
          <button
            type="button"
            onClick={() => validateStep(1) && validateStep(2) && setCurrentStep(3)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentStep === 3 ? 'bg-[#14532D]' : 'bg-stone-200'
            }`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-500 font-semibold">
          <span className={currentStep === 1 ? 'text-[#14532D] font-bold' : ''}>1. Identity & State</span>
          <span className={currentStep === 2 ? 'text-[#14532D] font-bold text-center' : 'text-center'}>2. Land & Crops</span>
          <span className={currentStep === 3 ? 'text-[#14532D] font-bold text-right' : 'text-right'}>3. Statutory Checks</span>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Profile saved successfully! Opening your personalized dashboard...</span>
        </div>
      )}

      {/* MAIN STEP FORM CONTAINER */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">

        {/* ================= STEP 1: PERSONAL & LOCATION DETAILS ================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#14532D]" />
                <span>Personal and Location Details</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Government schemes require accurate state and district verification for state-specific funds and local quota allocations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name (as registered in land records or Aadhaar) *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Baliram Patil"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm focus:outline-hidden focus:border-[#14532D]"
                />
                {errors.name && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.name}</p>}
              </div>

              {/* State Dropdown */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  State / Union Territory *
                </label>
                <select
                  value={formData.state || ''}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-[#14532D]"
                >
                  <option value="">Select your state</option>
                  {ALL_INDIAN_STATES_AND_UTS.filter(s => s !== 'All India').map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.state}</p>}
              </div>

              {/* District Dropdown (Dependent on State) */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  District * (Updates with state selection)
                </label>
                <select
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  disabled={!formData.state}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-[#14532D] disabled:opacity-50"
                >
                  <option value="">
                    {formData.state ? 'Select your district' : 'Please select state first'}
                  </option>
                  {availableDistricts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.district}</p>}
              </div>

              {/* Taluka / Tehsil */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Taluka / Tehsil / Block
                </label>
                <input
                  type="text"
                  value={formData.taluka || ''}
                  onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  placeholder="e.g. Ghatanji / Baramati"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm focus:outline-hidden focus:border-[#14532D]"
                />
              </div>

              {/* Village */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Village / Gram Panchayat
                </label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Sayat / Pimpalgaon"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm focus:outline-hidden focus:border-[#14532D]"
                />
              </div>

              {/* Preferred Language */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Preferred Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLanguage: 'en' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.preferredLanguage === 'en'
                        ? 'bg-[#14532D] text-white border-[#14532D]'
                        : 'bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLanguage: 'hi' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.preferredLanguage === 'hi'
                        ? 'bg-[#14532D] text-white border-[#14532D]'
                        : 'bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLanguage: 'mr' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.preferredLanguage === 'mr'
                        ? 'bg-[#14532D] text-white border-[#14532D]'
                        : 'bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: FARMING DETAILS ================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#14532D]" />
                <span>Farming and Landholding Details</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Schemes such as PM-KISAN, PMFBY, and solar irrigation evaluate land ownership status, holding size, and crop types.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Type of Farming */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Type of Farming:
                </label>
                <select
                  value={formData.farmingType || ''}
                  onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-900 bg-white"
                >
                  <option value="">Select an option</option>
                  {FARMING_TYPES.map(ft => (
                    <option key={ft.id} value={ft.id}>{ft.label}</option>
                  ))}
                </select>
              </div>

              {/* Land Ownership / Cultivator Status */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Land Ownership / Cultivator Status:
                </label>
                <select
                  value={formData.landOwnership || ''}
                  onChange={(e) => setFormData({ ...formData, landOwnership: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-900 bg-white"
                >
                  <option value="">Select your land ownership status</option>
                  {LAND_OWNERSHIP_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Total Landholding in Acres (Manual decimal entry, NO 2.5 default!) */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Total Landholding in Acres (manual entry):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.landholdingAcres !== undefined ? formData.landholdingAcres : ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setFormData({
                      ...formData,
                      landholdingAcres: raw === '' ? undefined : parseFloat(raw)
                    });
                  }}
                  placeholder="Enter your landholding in acres (e.g. 1.5, 3.25)"
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-900 bg-white"
                />
                {errors.landholdingAcres && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.landholdingAcres}</p>
                )}
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Small & Marginal farmers (up to 5.0 acres) receive prioritized subsidies in many central & state schemes.
                </p>
              </div>

              {/* Irrigation Water Source */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Irrigation Water Source:
                </label>
                <select
                  value={formData.irrigationAvailability || ''}
                  onChange={(e) => setFormData({ ...formData, irrigationAvailability: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-900 bg-white"
                >
                  <option value="">Select water source</option>
                  {IRRIGATION_OPTIONS.map(irr => (
                    <option key={irr.id} value={irr.id}>{irr.label}</option>
                  ))}
                </select>
              </div>

              {/* Main Crops Cultivated (Multi-Select) */}
              <div className="sm:col-span-2 pt-2">
                <label className="block font-bold text-stone-700 mb-1.5">
                  Main Crops Cultivated (select all that apply):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_CROPS.map((crop) => {
                    const isSelected = (formData.cropType || []).includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleToggleCrop(crop)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[#14532D] border-[#14532D] text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span className="truncate">{crop}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Other Crop */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={otherCropInput}
                    onChange={(e) => setOtherCropInput(e.target.value)}
                    placeholder="Other crop (e.g. Ginger, Turmeric, Apple...)"
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherCrop}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    + Add Other Crop
                  </button>
                </div>

                {/* Selected Crops Summary */}
                {formData.cropType && formData.cropType.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] font-bold text-stone-500">Selected:</span>
                    {formData.cropType.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#14532D] text-xs font-semibold flex items-center gap-1">
                        <span>{c}</span>
                        <button type="button" onClick={() => handleToggleCrop(c)} className="cursor-pointer text-emerald-800 hover:text-black">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: FINANCIAL & SCHEME-RELATED DETAILS ================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#14532D]" />
                <span>Financial and Statutory Eligibility Questions</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Answer these 6 statutory eligibility questions. We do NOT collect Aadhaar numbers, bank account numbers, or OTPs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Question 1: Income Tax Payer */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  1. Are you an Income Tax Payer?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  PM-KISAN excludes income tax payees from direct cash assistance under Section 3 guidelines.
                </p>
                <select
                  value={String(formData.isIncomeTaxPayee ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, isIncomeTaxPayee: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select Yes / No / Not Sure</option>
                  <option value="no">No (Not an income tax payer)</option>
                  <option value="yes">Yes (Paid income tax in last assessment year)</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              {/* Question 2: Aadhaar Linked with Bank */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  2. Is your bank account linked with Aadhaar?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Required for central Direct Benefit Transfer (DBT) verification.
                </p>
                <select
                  value={String(formData.hasAadhaarLinkedBankDBT ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, hasAadhaarLinkedBankDBT: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select Yes / No / Not Sure</option>
                  <option value="yes">Yes (Aadhaar linked with bank account)</option>
                  <option value="no">No (Not linked yet)</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              {/* Question 3: DBT / NPCI Enabled */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  3. Is your bank account enabled for DBT/NPCI payments?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  NPCI seeding enables automatic transfer of government subsidies.
                </p>
                <select
                  value={String(formData.isBankDBTEnabled ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, isBankDBTEnabled: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select Yes / No / Not Sure</option>
                  <option value="yes">Yes (DBT / NPCI payment enabled)</option>
                  <option value="no">No (Pending bank mandate)</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              {/* Question 4: Land Ownership Record Available */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  4. Is your land ownership record (7/12, Khasra-Khatauni, RoR) available?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Digitized land record in farmer's name or family partition.
                </p>
                <select
                  value={String(formData.hasLandRecords712 ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, hasLandRecords712: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select status</option>
                  <option value="yes">Yes (Available digitized RoR / 7/12 in name)</option>
                  <option value="no">No (No land records in name)</option>
                  <option value="applied">Applied For (Revenue mutation in process)</option>
                  <option value="not_applicable">Not Applicable (Tenant / Landless)</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              {/* Question 5: Machinery Subsidy in 5 Years */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  5. Have you received an agricultural machinery subsidy in the previous 5 years?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  SMAM / Sub-Mission on Agricultural Mechanization imposes cooling-off rules between subsidies.
                </p>
                <select
                  value={String(formData.previousSubsidyAvailed ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, previousSubsidyAvailed: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select Yes / No / Not Sure</option>
                  <option value="no">No (No machinery subsidy received in last 5 years)</option>
                  <option value="yes">Yes (Subsidized tractor/equipment received)</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              {/* Question 6: Farmer Registration / ID */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <label className="block font-bold text-stone-900">
                  6. Do you have a valid farmer registration or ID, where applicable?
                </label>
                <p className="text-[11px] text-stone-500 leading-snug">
                  e.g., AgriStack Farmer ID, Kisan Portal ID, or State Farmer Registry.
                </p>
                <select
                  value={String(formData.hasFarmerRegistrationId ?? 'not_sure')}
                  onChange={(e) => setFormData({ ...formData, hasFarmerRegistrationId: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="not_sure">Select Yes / No / Not Sure</option>
                  <option value="yes">Yes (Registered on state/central farmer portal)</option>
                  <option value="no">No / Not registered</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

            </div>

            {/* Privacy Confirmation */}
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Confidentiality Notice: These answers are used exclusively within your browser session to evaluate government scheme rules. No personal data is transferred or sold.
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP ACTION NAVIGATION BUTTONS ================= */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Return to Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Save and Continue Later button */}
            <button
              type="button"
              onClick={() => handleSaveAndComplete(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Save & Continue Later</span>
            </button>

            {/* Next or Complete Button */}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveAndComplete(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile & View Eligibility</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default FarmerRegistrationPage;
