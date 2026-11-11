import React from 'react';
import { Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface OfficialHelplinesProps {
  language: Language;
}

export const OfficialHelplines: React.FC<OfficialHelplinesProps> = ({ language }) => {
  const content = {
    en: {
      sectionTitle: 'Official Government Farmer Helplines',
      sectionSubtitle: 'Direct, toll-free assistance operated by the Ministry of Agriculture and Farmers Welfare, Government of India.',
      disclaimer: 'Notice: Kisan Suvidha provides verified scheme guidance. The helplines below are operated directly by official Government of India departments.',
      card1Title: 'Kisan Call Centre (KCC)',
      card1Dept: 'Department of Agriculture & Farmers Welfare',
      card1Desc: 'Toll-free agricultural assistance for farmers in multiple Indian languages covering crop advisories, technical queries, and welfare schemes.',
      card1Hours: 'Operates 6:00 AM to 10:00 PM (All 7 Days)',
      card1LinkText: 'Visit Kisan Call Centre Portal',
      card2Title: 'Crop Insurance Helpline',
      card2Name: 'Krishi Rakshak Portal & Helpline (KRPH)',
      card2Dept: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      card2Desc: 'Assistance with crop insurance queries, grievances, claim settlement status, and reporting localized crop loss under PMFBY.',
      card2Hours: 'National Toll-Free Service',
      card2LinkText: 'Visit PMFBY Official Portal',
      callNow: 'Click to Call Toll-Free'
    },
    hi: {
      sectionTitle: 'आधिकारिक सरकारी किसान हेल्पलाइन',
      sectionSubtitle: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार द्वारा संचालित निःशुल्क हेल्पलाइन।',
      disclaimer: 'सूचना: किसान सुविधा केवल सत्यापित जानकारी प्रदान करता है। नीचे दी गई हेल्पलाइन सीधे भारत सरकार के विभागों द्वारा संचालित हैं।',
      card1Title: 'किसान कॉल सेंटर (KCC)',
      card1Dept: 'कृषि एवं किसान कल्याण विभाग',
      card1Desc: 'सभी भारतीय भाषाओं में किसानों के लिए फसल सलाह, तकनीकी मार्गदर्शन और योजनाओं की निःशुल्क टेलीफोनिक सहायता।',
      card1Hours: 'सुबह 6:00 बजे से रात 10:00 बजे तक (सप्ताह के सातों दिन)',
      card1LinkText: 'किसान कॉल सेंटर पोर्टल खोलें',
      card2Title: 'फसल बीमा हेल्पलाइन',
      card2Name: 'कृषि रक्षक पोर्टल एवं हेल्पलाइन (KRPH)',
      card2Dept: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      card2Desc: 'फसल बीमा संबंधित प्रश्नों, शिकायतों, क्लेम स्थिति और फसल क्षति दर्ज कराने के लिए आधिकारिक राष्ट्रीय सहायता।',
      card2Hours: 'राष्ट्रीय टोल-फ्री सेवा',
      card2LinkText: 'PMFBY आधिकारिक पोर्टल खोलें',
      callNow: 'टोल-फ्री कॉल करें'
    },
    mr: {
      sectionTitle: 'अधिकृत शासकीय शेतकरी हेल्पलाइन',
      sectionSubtitle: 'कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार द्वारे संचलित थेट विनामूल्य हेल्पलाइन.',
      disclaimer: 'सूचना: किसान सुविधा अधिकृत मार्गदर्शन प्रदान करते. खालील हेल्पलाइन थेट भारत सरकारच्या विभागांद्वारे चालवल्या जातात.',
      card1Title: 'किसान कॉल सेंटर (KCC)',
      card1Dept: 'कृषी आणि शेतकरी कल्याण विभाग',
      card1Desc: 'विविध भारतीय भाषांमध्ये पिकांचा सल्ला, तांत्रिक मार्गदर्शन आणि योजनांसाठी शेतकऱ्यांना थेट मोफत मार्गदर्शन.',
      card1Hours: 'सकाळी ६:०० ते रात्री १०:०० (आठवड्याचे सातही दिवस)',
      card1LinkText: 'किसान कॉल सेंटर पोर्टल उघडा',
      card2Title: 'पीक विमा हेल्पलाइन',
      card2Name: 'कृषी रक्षक पोर्टल आणि हेल्पलाइन (KRPH)',
      card2Dept: 'प्रधानमंत्री पीक विमा योजना (PMFBY)',
      card2Desc: 'पीक विमा शंका, तक्रारी निवारण, नुकसान भरपाई स्थिती आणि स्थानिक पीक नुकसानीची नोंदणी करण्यासाठी अधिकृत मदत.',
      card2Hours: 'राष्ट्रीय टोल-फ्री सेवा',
      card2LinkText: 'PMFBY अधिकृत पोर्टल उघडा',
      callNow: 'टोल-फ्री कॉल करा'
    }
  }[language];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#14532D] text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Government of India Verified Contacts</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
          {content.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          {content.sectionSubtitle}
        </p>
      </div>

      {/* Exactly TWO Contact Cards in Clean 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-stretch">
        
        {/* Card 1: Kisan Call Centre (KCC) */}
        <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all h-full space-y-6 min-w-0">
          <div className="space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                  {content.card1Dept}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5 tracking-tight">
                  {content.card1Title}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#14532D] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-800" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {content.card1Desc}
            </p>

            <p className="text-[11px] font-medium text-stone-500">
              🕒 {content.card1Hours}
            </p>
          </div>

          {/* Clean Vertical Stack Inside Card Boundaries */}
          <div className="pt-5 border-t border-stone-200/90 space-y-3 w-full min-w-0">
            {/* 1. Phone number in a prominent green call button */}
            <a
              href="tel:18001801551"
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-mono font-bold text-base sm:text-lg whitespace-nowrap shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5 min-w-0"
              title="Call Kisan Call Centre Toll-Free"
            >
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap tracking-wide select-all">1800-180-1551</span>
            </a>

            {/* 2. Official Portal link below phone number on its own row */}
            <div className="pt-0.5 min-w-0">
              <a
                href="https://dackkms.gov.in/account/aboutus.aspx"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#14532D] hover:text-[#0f4022] hover:underline transition-colors min-w-0 group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span className="truncate">{content.card1LinkText}</span>
              </a>
            </div>

            {/* 3. Short call instruction below the link */}
            <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
              <span>✓</span>
              <span>{content.callNow} (Toll-Free · All 7 Days)</span>
            </p>
          </div>
        </div>

        {/* Card 2: Crop Insurance Helpline - Krishi Rakshak Portal & Helpline (KRPH) */}
        <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all h-full space-y-6 min-w-0">
          <div className="space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                  {content.card2Dept}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5 tracking-tight">
                  {content.card2Title}
                </h3>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5 truncate">
                  {content.card2Name}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#14532D] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-800" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {content.card2Desc}
            </p>

            <p className="text-[11px] font-medium text-stone-500">
              🕒 {content.card2Hours}
            </p>
          </div>

          {/* Clean Vertical Stack Inside Card Boundaries */}
          <div className="pt-5 border-t border-stone-200/90 space-y-3 w-full min-w-0">
            {/* 1. Phone number in a prominent green call button */}
            <a
              href="tel:14447"
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-mono font-bold text-base sm:text-lg whitespace-nowrap shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5 min-w-0"
              title="Call Krishi Rakshak PMFBY Helpline"
            >
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap tracking-wide select-all">14447</span>
            </a>

            {/* 2. Official Portal link below phone number on its own row */}
            <div className="pt-0.5 min-w-0">
              <a
                href="https://pmfby.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#14532D] hover:text-[#0f4022] hover:underline transition-colors min-w-0 group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span className="truncate">{content.card2LinkText}</span>
              </a>
            </div>

            {/* 3. Short call instruction below the link */}
            <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
              <span>✓</span>
              <span>{content.callNow} (Toll-Free PMFBY Helpline)</span>
            </p>
          </div>
        </div>

      </div>

      <p className="text-center text-[11px] text-stone-500 pt-2">
        {content.disclaimer}
      </p>
    </div>
  );
};

export default OfficialHelplines;
