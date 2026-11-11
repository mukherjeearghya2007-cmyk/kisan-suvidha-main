import React, { useMemo } from 'react';
import { FarmerProfile, Language, Scheme, UserAccount } from '../types';
import { schemeService } from '../utils/schemeService';
import { authService } from '../utils/authService';
import { verifiedAlerts } from '../data/alerts';
import { translations } from '../translations';
import { evaluateAllSchemes } from '../utils/eligibilityEngine';
import { 
  User, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Bookmark,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  Layers,
  Sprout
} from 'lucide-react';

interface FarmerDashboardPageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  currentUser: UserAccount | null;
  onNavigate: (tab: string, schemeId?: string) => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({
  language,
  activeFarmer,
  currentUser,
  onNavigate,
  onOpenEditProfile,
  onLogout
}) => {
  const t = translations[language];

  // Dynamic schemes repository
  const allSchemes = useMemo(() => schemeService.getAllSchemes(), []);
  
  // Saved schemes for authenticated farmer
  const savedSchemeIds = useMemo(() => {
    return activeFarmer.savedSchemeIds || authService.getFarmerProfile(currentUser?.id).savedSchemeIds || [];
  }, [activeFarmer, currentUser]);

  // Evaluate schemes
  const evaluations = useMemo(() => {
    return evaluateAllSchemes(activeFarmer, allSchemes, language);
  }, [activeFarmer, allSchemes, language]);

  // Count breakdowns
  const counts = useMemo(() => {
    let eligible = 0;
    let partial = 0;
    let notEligible = 0;

    Object.values(evaluations).forEach((res) => {
      if (res.status === 'eligible') eligible++;
      else if (res.status === 'partially_eligible') partial++;
      else notEligible++;
    });

    return { eligible, partial, notEligible, total: allSchemes.length };
  }, [evaluations, allSchemes]);

  // Recommended schemes: eligible first, then partial
  const recommendedSchemes = useMemo(() => {
    return [...allSchemes].sort((a, b) => {
      const statusA = evaluations[a.id]?.status;
      const statusB = evaluations[b.id]?.status;
      const rank = { eligible: 1, partially_eligible: 2, not_eligible: 3 };
      return (rank[statusA] || 3) - (rank[statusB] || 3);
    }).slice(0, 5);
  }, [allSchemes, evaluations]);

  // Saved scheme items
  const savedSchemes = useMemo(() => {
    return allSchemes.filter(s => savedSchemeIds.includes(s.id));
  }, [allSchemes, savedSchemeIds]);

  // Deadlines
  const upcomingAlerts = useMemo(() => {
    return verifiedAlerts.filter(a => a.deadline).slice(0, 3);
  }, []);

  // Completeness percentage
  const completionPercent = useMemo(() => {
    if (activeFarmer.profileCompletionPercent) return activeFarmer.profileCompletionPercent;
    let points = 0;
    const total = 10;
    if (activeFarmer.name?.trim()) points++;
    if (activeFarmer.state?.trim()) points++;
    if (activeFarmer.district?.trim()) points++;
    if (activeFarmer.village?.trim()) points++;
    if (activeFarmer.landholdingAcres !== undefined && activeFarmer.landholdingAcres > 0) points++;
    if (activeFarmer.landOwnership) points++;
    if ((activeFarmer.cropType?.length ?? 0) > 0) points++;
    if (activeFarmer.irrigationAvailability) points++;
    if ((activeFarmer.farmingNeeds?.length ?? 0) > 0) points++;
    if ((activeFarmer.alliedActivities?.length ?? 0) > 0) points++;
    return Math.round((points / total) * 100);
  }, [activeFarmer]);

  // If user is not logged in, show a dedicated welcoming login/registration prompt
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center mx-auto border border-emerald-200">
            <User className="w-8 h-8 text-emerald-800" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
              Farmer Dashboard
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Please sign in to your farmer account to view your personalized dashboard, check eligibility evaluations, save schemes, and manage application checklists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Farmer Account</span>
            </button>
          </div>

          <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-left max-w-2xl mx-auto">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <p className="font-bold text-stone-900">Explore Schemes</p>
              <p className="text-stone-500 mt-0.5">Browse 30+ central and state government welfare programs anytime.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <p className="font-bold text-stone-900">Eligibility Checker</p>
              <p className="text-stone-500 mt-0.5">Test statutory rules instantly with our interactive questionnaire.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <p className="font-bold text-stone-900">AI Assistant</p>
              <p className="text-stone-500 mt-0.5">Ask questions via voice or text in English, Hindi, and Marathi.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Farmer Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Welcome Banner & Farm Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Registered Farmer Profile Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.dashboard.welcome} {currentUser.fullName}
          </h1>

          {/* Current Farm Parameters: Real data only */}
          {activeFarmer.landholdingAcres !== undefined && activeFarmer.landOwnership ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600">
              <span className="flex items-center gap-1 font-semibold text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {[activeFarmer.village, activeFarmer.district, activeFarmer.state].filter(Boolean).join(', ') || currentUser.state}
                </span>
              </span>
              <span>·</span>
              <span>Landholding: <strong>{activeFarmer.landholdingAcres} Acres {activeFarmer.farmerCategory ? `(${activeFarmer.farmerCategory})` : ''}</strong></span>
              <span>·</span>
              <span>Ownership: <strong className="capitalize">{activeFarmer.landOwnership} cultivator</strong></span>
              {activeFarmer.irrigationAvailability && (
                <>
                  <span>·</span>
                  <span>Irrigation: <strong className="capitalize">{activeFarmer.irrigationAvailability.replace('_', ' ')}</strong></span>
                </>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-bold">Profile Incomplete – Add Your Farming Details to get accurate statutory scheme results.</span>
              </div>
              <button
                onClick={onOpenEditProfile}
                className="px-3.5 py-1.5 bg-[#14532D] text-white font-bold rounded-lg hover:bg-[#0f4022] transition-colors cursor-pointer shrink-0 self-start sm:self-auto text-xs"
              >
                Complete Profile
              </button>
            </div>
          )}

          {/* Allied Activities & Farming Needs Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">Allied & Needs:</span>
            {activeFarmer.alliedActivities && activeFarmer.alliedActivities.length > 0 ? (
              activeFarmer.alliedActivities.map((act) => (
                <span key={act} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-medium capitalize">
                  {act.replace('_', ' ')}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-stone-400 italic">None specified</span>
            )}
            {activeFarmer.farmingNeeds && activeFarmer.farmingNeeds.map((need) => (
              <span key={need} className="px-2 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-md text-[11px] font-medium capitalize">
                {need.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenEditProfile}
            className="px-4 py-2.5 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-xl transition-colors cursor-pointer"
          >
            {t.dashboard.editProfile}
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

      </div>

      {/* PROFILE COMPLETION METER */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Farmer Profile Completeness</span>
            <span className="text-[#14532D] font-extrabold">{completionPercent}% Complete</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#14532D] h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">
            {completionPercent < 100 
              ? 'Complete your crop details, irrigation type, and land verification to get the most accurate statutory scheme recommendations.'
              : 'Your profile has all required statutory parameters verified for automated welfare scheme evaluation.'}
          </p>
        </div>
        {completionPercent < 100 && (
          <button
            onClick={onOpenEditProfile}
            className="px-3.5 py-2 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-xl transition-colors shrink-0 cursor-pointer self-start md:self-auto"
          >
            Complete Profile Info
          </button>
        )}
      </div>

      {/* STATS BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* GREEN: Likely Eligible */}
        <div 
          onClick={() => onNavigate('checker')}
          className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Likely Eligible
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-950 mt-3 font-tabular">
            {counts.eligible}
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-medium">
            All mandatory rules satisfied
          </p>
        </div>

        {/* YELLOW: Insufficient Information */}
        <div 
          onClick={() => onNavigate('checker')}
          className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Insufficient Information
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-950 mt-3 font-tabular">
            {counts.partial}
          </p>
          <p className="text-xs text-amber-700 mt-1 font-medium">
            Profile or verification details needed
          </p>
        </div>

        {/* RED: Not Currently Eligible */}
        <div 
          onClick={() => onNavigate('checker')}
          className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Not Currently Eligible
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-700" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-950 mt-3 font-tabular">
            {counts.notEligible}
          </p>
          <p className="text-xs text-red-700 mt-1 font-medium">
            Statutory criteria or exclusion confirmed
          </p>
        </div>

      </div>

      {/* QUICK WORKSPACE ACTION STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('finder')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs transition-all text-left flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">{t.nav.schemeFinder}</p>
            <p className="text-[11px] text-stone-500">Explore nationwide schemes ({allSchemes.length} total)</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('checker')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs transition-all text-left flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">{t.nav.eligibilityChecker}</p>
            <p className="text-[11px] text-stone-500">Run 25-point rule audit on your profile</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ai')}
          className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs transition-all text-left flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">{t.nav.aiAssistant}</p>
            <p className="text-[11px] text-stone-500">Multilingual audio & voice queries</p>
          </div>
        </button>
      </div>

      {/* SAVED SCHEMES / BOOKMARKS SECTION */}
      {savedSchemes.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>My Saved Schemes ({savedSchemes.length})</span>
            </h2>
            <button
              onClick={() => onNavigate('finder')}
              className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer"
            >
              Explore More Schemes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSchemes.map((scheme) => {
              const res = evaluations[scheme.id];
              const isEligible = res?.status === 'eligible';
              const isPartial = res?.status === 'partially_eligible';

              return (
                <div key={scheme.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-emerald-800">{scheme.category}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isEligible ? 'bg-emerald-100 text-emerald-800' : isPartial ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isEligible ? 'Eligible' : isPartial ? 'Partially' : 'Ineligible'}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug">
                      {scheme.localNames?.[language] || scheme.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-900 mt-1">
                      {scheme.benefitsAmount}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => onNavigate('guidance', scheme.id)}
                      className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Documents</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recommended Government Schemes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#14532D]" />
              <span>{t.dashboard.recommendedSchemes}</span>
            </h2>
            <button
              onClick={() => onNavigate('finder')}
              className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer"
            >
              View All ({allSchemes.length})
            </button>
          </div>

          <div className="space-y-3.5">
            {recommendedSchemes.map((scheme) => {
              const res = evaluations[scheme.id];
              const isEligible = res?.status === 'eligible';
              const isPartial = res?.status === 'partially_eligible';

              return (
                <div
                  key={scheme.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#14532D]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#65A30D]">
                        {scheme.category}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isEligible
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isEligible ? t.common.eligible : isPartial ? t.common.partiallyEligible : t.common.notEligible}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {scheme.localNames?.[language] || scheme.name}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {scheme.benefits?.[language] || scheme.benefits?.['en']}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {scheme.benefitsAmount}
                    </span>
                    <button
                      onClick={() => onNavigate('guidance', scheme.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Prepare Docs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deadlines, Alerts & Application Readiness */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t.dashboard.upcomingDeadlines}</span>
              </h3>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer"
              >
                All
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      Last Date: {alert.deadline}
                    </span>
                    {alert.isUrgent && (
                      <span className="text-[10px] text-amber-800 font-bold">Urgent</span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 pt-1 line-clamp-1">
                    {alert.title[language]}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {alert.description[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Readiness Progress */}
          <div className="bg-gradient-to-br from-[#14532D] to-[#0D381E] text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-300" />
              <h3 className="text-sm font-bold tracking-tight">
                {t.dashboard.applicationProgress}
              </h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Have your 7/12 extract, Aadhaar eKYC, and bank passbook ready to apply on official portals without agent fees.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('guidance')}
                className="w-full py-2.5 px-4 text-xs font-bold text-[#14532D] bg-white hover:bg-stone-100 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{t.dashboard.viewGuidance}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FarmerDashboardPage;
