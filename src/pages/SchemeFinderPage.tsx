import React, { useState, useMemo, useEffect } from 'react';
import { Scheme, Language, FarmerProfile } from '../types';
import { schemeService, ALL_INDIAN_STATES_AND_UTS, ALL_28_SCHEME_CATEGORIES } from '../utils/schemeService';
import { authService } from '../utils/authService';
import { translations } from '../translations';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck, 
  X, 
  Phone, 
  Bookmark,
  MapPin,
  Tag,
  Building2,
  Check
} from 'lucide-react';

interface SchemeFinderPageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  onNavigateToChecker: (schemeId?: string) => void;
  onNavigateToGuidance: (schemeId: string) => void;
}

export const SchemeFinderPage: React.FC<SchemeFinderPageProps> = ({
  language,
  activeFarmer,
  onNavigateToChecker,
  onNavigateToGuidance
}) => {
  const t = translations[language];

  // Dynamic scheme repository
  const [schemes, setSchemes] = useState<Scheme[]>(() => schemeService.getAllSchemes());
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    return activeFarmer.savedSchemeIds || authService.getFarmerProfile().savedSchemeIds || [];
  });
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedFunding, setSelectedFunding] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  // Selected Scheme for Detail Modal
  const [activeModalScheme, setActiveModalScheme] = useState<Scheme | null>(null);

  // Refresh schemes on mount
  useEffect(() => {
    setSchemes(schemeService.getAllSchemes());
  }, []);

  const handleToggleBookmark = (schemeId: string, schemeName: string) => {
    const updated = authService.toggleSavedScheme(schemeId);
    setSavedSchemeIds(updated);
    const isSaved = updated.includes(schemeId);
    setBookmarkToast(isSaved ? `"${schemeName}" added to Saved Schemes` : `"${schemeName}" removed from Saved Schemes`);
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  // Filtered schemes logic
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      // Search match across English and local translated fields
      const query = searchQuery.toLowerCase().trim();
      const localName = scheme.localNames ? (scheme.localNames[language] || '') : '';
      const benefitsText = scheme.benefits ? (scheme.benefits[language] || '') : '';
      const descText = scheme.description ? (scheme.description[language] || '') : '';

      const nameMatch = 
        !query ||
        scheme.name.toLowerCase().includes(query) ||
        localName.toLowerCase().includes(query) ||
        benefitsText.toLowerCase().includes(query) ||
        descText.toLowerCase().includes(query) ||
        scheme.category.toLowerCase().includes(query) ||
        (scheme.districtCoverage && scheme.districtCoverage.some(d => d.toLowerCase().includes(query)));

      // Category match
      const categoryMatch = selectedCategory === 'all' || scheme.category === selectedCategory;

      // State coverage match
      const stateMatch = 
        selectedState === 'all' ||
        scheme.stateCoverage.includes('All India') ||
        scheme.stateCoverage.includes(selectedState);

      // Funding match
      const fundingMatch = 
        selectedFunding === 'all' || 
        scheme.type === selectedFunding ||
        (selectedFunding === 'central' && scheme.type === 'central') ||
        (selectedFunding === 'state' && (scheme.type === 'state' || scheme.type === 'ut'));

      // Status match
      const statusMatch = 
        selectedStatus === 'all' ||
        (selectedStatus === 'open' && scheme.isOpen) ||
        (selectedStatus === 'closed' && !scheme.isOpen);

      // Crop match
      const cropMatch = 
        selectedCrop === 'all' ||
        scheme.cropCoverage.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()) || c === 'All Crops');

      return nameMatch && categoryMatch && stateMatch && fundingMatch && statusMatch && cropMatch;
    });
  }, [schemes, searchQuery, selectedCategory, selectedState, selectedFunding, selectedStatus, selectedCrop, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Toast Notification */}
      {bookmarkToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14532D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Bookmark className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{bookmarkToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>National Central, State & District Scheme Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.finder.title}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {t.finder.subtitle} Showing official schemes across all 28 Indian States, 8 UTs, and Central Ministries.
          </p>
        </div>

        {/* Quick Database Statistics Pill */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs text-xs text-stone-600">
          <span className="font-bold text-[#14532D]">{schemes.length} Total Schemes</span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold">{schemes.filter(s => s.type === 'central').length} Central</span>
          <span>·</span>
          <span className="text-amber-800 font-semibold">{schemes.filter(s => s.type === 'state').length} State</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.finder.searchPlaceholder} (e.g., PM-Kisan, Drip Irrigation, Dairy, Maharashtra, Soil...)`}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-stone-800 bg-stone-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Category Filter (All 28 standard categories) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
              {t.finder.filterCategory}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#14532D]"
            >
              <option value="all">All 28 Categories</option>
              {ALL_28_SCHEME_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* State & Union Territory Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
              State / Union Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#14532D]"
            >
              <option value="all">All States & UTs</option>
              {ALL_INDIAN_STATES_AND_UTS.filter(s => s !== 'All India').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Government Funding Type */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
              {t.finder.filterFunding}
            </label>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#14532D]"
            >
              <option value="all">{t.finder.allFunding}</option>
              <option value="central">{t.finder.central} & Centrally Sponsored</option>
              <option value="state">{t.finder.state} & District Specific</option>
            </select>
          </div>

          {/* Application Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
              {t.finder.filterPeriod}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#14532D]"
            >
              <option value="all">{t.finder.allStatus}</option>
              <option value="open">Active / Open Applications</option>
              <option value="closed">Closed / Seasonal Pause</option>
            </select>
          </div>

          {/* Crop Filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
              {t.finder.filterCrop}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#14532D]"
            >
              <option value="all">{t.finder.allCrops}</option>
              <option value="Cotton">Cotton / कापूस / कपास</option>
              <option value="Soybean">Soybean / सोयाबीन</option>
              <option value="Wheat">Wheat / गहू / गेहूं</option>
              <option value="Paddy">Paddy / भात / धान</option>
              <option value="Sugarcane">Sugarcane / ऊस / गन्ना</option>
              <option value="Pulses">Pulses / डाळी / दालें</option>
              <option value="Horticulture">Horticulture / फलोत्पादन</option>
              <option value="Dairy">Dairy & Fodder / दुग्ध</option>
            </select>
          </div>

        </div>

        {/* Active Filters Clear Button if applicable */}
        {(searchQuery || selectedCategory !== 'all' || selectedState !== 'all' || selectedFunding !== 'all' || selectedStatus !== 'all' || selectedCrop !== 'all') && (
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-stone-500 font-medium">
              Showing {filteredSchemes.length} of {schemes.length} schemes
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedState('all');
                setSelectedFunding('all');
                setSelectedStatus('all');
                setSelectedCrop('all');
              }}
              className="text-[#14532D] font-bold hover:underline cursor-pointer"
            >
              {t.finder.clearFilters}
            </button>
          </div>
        )}
      </div>

      {/* Scheme Cards Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <p className="text-base font-semibold text-stone-700">{t.finder.noResults}</p>
          <p className="text-xs text-stone-500 mt-1">Try resetting the state or category filter to discover more national welfare programs.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedState('all');
              setSelectedFunding('all');
              setSelectedStatus('all');
              setSelectedCrop('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-xl transition-colors cursor-pointer"
          >
            {t.finder.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            // Check eligibility for active farmer
            const evalResult = evaluateSchemeEligibility(activeFarmer, scheme, language);
            const statusConfig = {
              eligible: {
                label: 'Likely Eligible',
                bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                icon: CheckCircle2,
                dot: 'bg-emerald-600'
              },
              partially_eligible: {
                label: 'Insufficient Information',
                bg: 'bg-amber-50 text-amber-900 border-amber-200',
                icon: AlertCircle,
                dot: 'bg-amber-500'
              },
              not_eligible: {
                label: 'Not Currently Eligible',
                bg: 'bg-red-50 text-red-800 border-red-200',
                icon: XCircle,
                dot: 'bg-red-500'
              }
            }[evalResult.status];

            const StatusIcon = statusConfig.icon;
            const isBookmarked = savedSchemeIds.includes(scheme.id);

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  
                  {/* Card Metadata Top */}
                  <div className="flex items-start justify-between gap-2 text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-[#14532D] uppercase tracking-wide text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      {scheme.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleBookmark(scheme.id, scheme.name)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-50 border-amber-300 text-amber-600' 
                            : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-amber-600'
                        }`}
                        title={isBookmarked ? 'Remove from saved' : 'Save scheme to profile'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Scheme Title */}
                  <h3 className="text-lg font-bold text-stone-900 leading-snug">
                    {scheme.localNames?.[language] || scheme.name}
                  </h3>

                  {/* Geographical Scope Tag */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{scheme.stateCoverage.join(', ')}</span>
                    </span>
                    <span>·</span>
                    <span className="capitalize font-medium text-stone-600">
                      {scheme.type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Benefits Amount Highlight */}
                  <div className="mt-3 inline-block px-3 py-1 bg-amber-50 rounded-lg border border-amber-200/80 text-xs font-bold text-amber-900">
                    {scheme.benefitsAmount}
                  </div>

                  {/* Brief description */}
                  <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                    {scheme.description?.[language] || scheme.description?.['en']}
                  </p>

                  {/* Eligibility Quick Strip for Active Farmer */}
                  <div className={`mt-4 p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${statusConfig.bg}`}>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="w-4 h-4 shrink-0" />
                      <span>{activeFarmer.name?.trim() ? `${activeFarmer.name.split(' ')[0]}: ${statusConfig.label}` : statusConfig.label}</span>
                    </div>
                    <button
                      onClick={() => onNavigateToChecker(scheme.id)}
                      className="text-[11px] underline font-bold hover:opacity-80 cursor-pointer"
                    >
                      Verify Rules
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalScheme(scheme)}
                    className="px-3 py-2 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-lg transition-colors cursor-pointer"
                  >
                    {t.finder.viewDetails}
                  </button>

                  <button
                    onClick={() => onNavigateToGuidance(scheme.id)}
                    className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Guidance</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INDIVIDUAL SCHEME DETAIL MODAL */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-200">
              <div className="pr-8">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#65A30D]">
                    {activeModalScheme.category}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs font-semibold text-stone-600 capitalize">
                    {activeModalScheme.type.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#14532D] leading-snug">
                  {activeModalScheme.localNames?.[language] || activeModalScheme.name}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {activeModalScheme.department?.[language] || activeModalScheme.department?.['en']}
                </p>
              </div>
              <button
                onClick={() => setActiveModalScheme(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scheme Benefit Banner */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {t.finder.benefits} ({activeModalScheme.benefitsAmount})
              </p>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {activeModalScheme.benefits?.[language] || activeModalScheme.benefits?.['en']}
              </p>
            </div>

            {/* Eligibility Rules Overview */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {t.finder.eligibilitySummary}
              </h3>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {activeModalScheme.eligibilityOverview?.[language] || activeModalScheme.eligibilityOverview?.['en']}
                </p>
                <div className="pt-2 text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>States: {activeModalScheme.stateCoverage.join(', ')}</span>
                  <span>·</span>
                  <span>Crops: {activeModalScheme.cropCoverage.join(', ')}</span>
                  <span>·</span>
                  <span>{t.finder.lastVerified}: {activeModalScheme.lastVerifiedDate}</span>
                </div>
              </div>
            </div>

            {/* Mandatory Required Documents List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                {t.finder.requiredDocs}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeModalScheme.requiredDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <p className="font-bold text-stone-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#14532D]" />
                      <span>{doc.name?.[language] || doc.name?.['en']}</span>
                      {doc.isMandatory && (
                        <span className="text-[10px] text-red-600 font-semibold uppercase">({t.common.mandatory})</span>
                      )}
                    </p>
                    <p className="text-stone-600 mt-1 text-[11px]">{doc.description?.[language] || doc.description?.['en']}</p>
                    <p className="text-stone-400 mt-1 text-[10px]">Source: {doc.issuingAuthority?.[language] || doc.issuingAuthority?.['en']}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Links & Actions */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href={activeModalScheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <span>Launch Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const sid = activeModalScheme.id;
                    setActiveModalScheme(null);
                    onNavigateToChecker(sid);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-xl transition-colors cursor-pointer"
                >
                  Test 25-Point Eligibility Rules
                </button>

                <button
                  onClick={() => {
                    const sid = activeModalScheme.id;
                    setActiveModalScheme(null);
                    onNavigateToGuidance(sid);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                >
                  Prepare Documents
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
