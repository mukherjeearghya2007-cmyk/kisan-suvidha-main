import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { KisanLogo } from '../components/KisanLogo';
import { OfficialHelplines } from '../components/OfficialHelplines';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  ExternalLink
} from 'lucide-react';

interface AboutPageProps {
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      
      {/* Page Header with Original Logo & Brand */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-3 select-none mb-1">
          <KisanLogo className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-xs" />
          <div className="text-left flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14532D] leading-none font-sans mb-1">
              {t.brand.name}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-wide leading-tight">
              {t.brand.tagline}
            </span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14532D] tracking-tight">
          {t.about.title}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">
            {t.about.missionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.about.missionDesc}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-800" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">
            {t.about.problemTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.about.problemDesc}
          </p>
        </div>

      </div>

      {/* 25-Point Statutory Verification Guarantee */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#14532D]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#14532D]">
            Deterministic Statutory Rule Verification
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
          Kisan Suvidha evaluates agricultural welfare eligibility using statutory criteria published in official government scheme guidelines and operational manuals. The platform does not use generative AI to guess eligibility rules or make promises on behalf of government departments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official Gazette Criteria</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct Portal Redirection</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Broker Commission</span>
          </div>
        </div>
      </div>

      {/* Official Government Farmer Helplines (Exactly 2 Cards) */}
      <OfficialHelplines language={language} />

      {/* Technology & Architecture Footnote */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 text-xs text-stone-600 space-y-2">
        <h3 className="font-bold text-stone-900">Architecture & Technical Standards</h3>
        <p className="leading-relaxed">
          Kisan Suvidha is built with modern, accessible web technologies (React.js, Tailwind CSS, TypeScript). It features a deterministic 25-condition rule verification engine that operates with zero-middleman architecture, strictly avoiding artificial intelligence hallucinations on statutory welfare criteria.
        </p>
      </div>

    </div>
  );
};

export default AboutPage;
