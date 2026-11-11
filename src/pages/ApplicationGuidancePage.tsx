import React, { useState, useMemo, useEffect } from 'react';
import { Scheme, Language, FarmerProfile, DocumentChecklistStatus } from '../types';
import { schemeService } from '../utils/schemeService';
import { authService } from '../utils/authService';
import { translations } from '../translations';
import { 
  FileText, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Printer, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Clock,
  ArrowRight,
  HelpCircle,
  Download,
  AlertCircle
} from 'lucide-react';

interface ApplicationGuidancePageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  initialSchemeId?: string;
}

const STATUS_CONFIG: Record<DocumentChecklistStatus, {
  label: string;
  badgeClass: string;
  dot: string;
}> = {
  not_provided: {
    label: 'Not Provided',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    dot: '⚪'
  },
  collected: {
    label: 'Collected (Physical Copy)',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    dot: '🟡'
  },
  uploaded: {
    label: 'Scanned / Uploaded',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-300',
    dot: '🔵'
  },
  submitted: {
    label: 'Submitted (CSC / Portal)',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-300',
    dot: '🟣'
  },
  verified: {
    label: 'Verified by Department',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    dot: '🟢'
  },
  // Backward compatibility mappings
  not_started: {
    label: 'Not Provided',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    dot: '⚪'
  },
  scanned: {
    label: 'Scanned / Uploaded',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-300',
    dot: '🔵'
  },
  ready: {
    label: 'Collected (Physical Copy)',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    dot: '🟡'
  }
};

export const ApplicationGuidancePage: React.FC<ApplicationGuidancePageProps> = ({
  language,
  activeFarmer,
  initialSchemeId
}) => {
  const t = translations[language];

  // Dynamic scheme repository
  const schemes = useMemo(() => schemeService.getAllSchemes(), []);

  // Selected scheme
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId || schemes[0]?.id || 'pm-kisan');

  // Active scheme
  const scheme = useMemo(() => {
    return schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  }, [schemes, selectedSchemeId]);

  // Load document statuses from persistent localStorage for active farmer and scheme
  const [docStatuses, setDocStatuses] = useState<Record<string, DocumentChecklistStatus>>(() => {
    return authService.getDocumentStatuses(selectedSchemeId, activeFarmer.userId);
  });

  // When selected scheme changes, reload saved statuses for that scheme
  useEffect(() => {
    const saved = authService.getDocumentStatuses(selectedSchemeId, activeFarmer.userId);
    setDocStatuses(saved);
  }, [selectedSchemeId, activeFarmer.userId]);

  // Update document checklist status and persist immediately
  const handleUpdateDocStatus = (docId: string, status: DocumentChecklistStatus) => {
    setDocStatuses(prev => {
      const updated = {
        ...prev,
        [docId]: status
      };
      authService.saveDocumentStatuses(selectedSchemeId, updated, activeFarmer.userId);
      return updated;
    });
  };

  // Completed roadmap steps tracker
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Toggle step completion
  const toggleStep = (stepIdx: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIdx) ? prev.filter(i => i !== stepIdx) : [...prev, stepIdx]
    );
  };

  // Dynamic progress percentage calculation
  // A document counts as in-progress / ready if it is NOT 'not_provided' and NOT 'not_started'
  const progressPercent = useMemo(() => {
    const totalDocs = scheme.requiredDocuments.length;
    if (totalDocs === 0) return 0;

    let providedCount = 0;
    for (const doc of scheme.requiredDocuments) {
      const status = docStatuses[doc.id] || 'not_provided';
      if (status !== 'not_provided' && status !== 'not_started') {
        providedCount++;
      }
    }

    return Math.round((providedCount / totalDocs) * 100);
  }, [scheme, docStatuses]);

  // Draft application notes
  const [applicationNotes, setApplicationNotes] = useState<string>(
    `Application notes for ${activeFarmer.name || 'Farmer'}${activeFarmer.village ? ` (${activeFarmer.village})` : ''}.`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Personalized Document Roadmap & Portal Pre-Check</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.guidance.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.guidance.subtitle}
          </p>
        </div>

        {/* Scheme Selector */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
            {t.guidance.selectScheme}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold text-xs sm:text-sm focus:outline-hidden focus:border-[#14532D]"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.localNames?.[language] || s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold mb-0.5">Official Filing Disclaimer:</p>
          <p>
            This document roadmap is a self-assessment preparation checklist. Final application submission and benefit disbursement occur exclusively on the respective official government portals or at authorized Common Service Centres (CSC).
          </p>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: Left = Document Checklist & Progress, Right = Steps & Official Link */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personalized Document Checklist */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            
            {/* Header + Dynamic Progress Bar */}
            <div className="pb-4 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    {t.guidance.docChecklistTitle}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Track your physical paperwork readiness before starting official portal registration.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#14532D] font-tabular">
                    {progressPercent}%
                  </span>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">
                    {progressPercent === 0 ? 'Not Started' : progressPercent === 100 ? 'All Organized' : 'In Progress'}
                  </p>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-100 rounded-full h-2.5 mt-3 overflow-hidden">
                <div 
                  className="bg-[#14532D] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Document Items List */}
            <div className="space-y-4">
              {scheme.requiredDocuments.map((doc) => {
                const currentStatus: DocumentChecklistStatus = docStatuses[doc.id] || 'not_provided';
                const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.not_provided;

                return (
                  <div 
                    key={doc.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-stone-900">
                            {doc.name[language] || doc.name['en']}
                            {doc.isMandatory && (
                              <span className="text-red-600 text-xs font-normal ml-1.5">* (Mandatory)</span>
                            )}
                          </p>
                          <p className="text-xs text-stone-500">
                            Issuing Authority: {doc.issuingAuthority[language] || doc.issuingAuthority['en']}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Manual Status Selector Dropdown */}
                      <div className="shrink-0">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateDocStatus(doc.id, e.target.value as DocumentChecklistStatus)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg border focus:outline-hidden ${statusMeta.badgeClass}`}
                        >
                          <option value="not_provided">⚪ Not Provided</option>
                          <option value="collected">🟡 Collected (Physical Copy)</option>
                          <option value="uploaded">🔵 Scanned / Uploaded</option>
                          <option value="submitted">🟣 Submitted (Portal / CSC)</option>
                          <option value="verified">🟢 Verified by Department</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pl-6">
                      {doc.description[language] || doc.description['en']}
                    </p>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 flex items-start gap-1.5 ml-6">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{doc.helpTip[language] || doc.helpTip['en']}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-400 italic pt-2">
              Note: Document status is self-reported by the farmer for checklist progress tracking. Official verification is conducted exclusively by government departments.
            </p>

          </div>

          {/* Action Draft / Notes Area */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {t.guidance.applicationDraftTitle}
            </h3>
            <p className="text-xs text-stone-500">
              Note down application numbers, survey/khasra numbers, or questions for your local agriculture officer:
            </p>
            <textarea
              rows={3}
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-stone-50/50 focus:outline-hidden focus:border-[#14532D]"
              placeholder="Record survey numbers, 7/12 mutation dates, CSC reference numbers..."
            />
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-400">
                Notes are saved in your current browser session.
              </span>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document Checklist</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Step-by-Step Instructions & Official Portal Launcher */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-stone-100">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {t.guidance.stepByStep}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Official registration procedure for {scheme.localNames[language] || scheme.name}
              </p>
            </div>

            <div className="space-y-3">
              {scheme.applicationSteps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone 
                        ? 'bg-emerald-50/60 border-emerald-200' 
                        : 'bg-stone-50/80 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <button className="mt-0.5 text-[#14532D] shrink-0">
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </button>
                    <div className="text-xs leading-relaxed">
                      <p className={isDone ? 'line-through text-stone-500' : 'text-stone-800 font-medium'}>
                        {step[language] || step['en']}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Official Portal CTA */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Official Scheme Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-stone-500 text-center">
                Destination: <span className="font-mono text-stone-700">{scheme.officialUrl}</span>
              </p>
            </div>
          </div>

          {/* Helpline Card */}
          <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 text-xs space-y-2">
            <h4 className="font-bold text-stone-900">Need Assistance with this Form?</h4>
            <p className="text-stone-600 leading-relaxed">
              Visit your local Gram Panchayat, Taluka Agriculture Office, or call the official scheme helpline:
            </p>
            <p className="text-sm font-mono font-bold text-[#14532D]">{scheme.helpline}</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ApplicationGuidancePage;
