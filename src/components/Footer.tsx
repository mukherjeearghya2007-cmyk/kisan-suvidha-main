import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { KisanLogo } from './KisanLogo';
import { Phone, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#0D381E] text-stone-300 border-t border-emerald-950 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: Brand & Official Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <KisanLogo className="w-12 h-12 shrink-0 drop-shadow-sm" />
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{t.brand.name}</h3>
                <p className="text-xs text-emerald-300 font-semibold">{t.brand.tagline}</p>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {language === 'hi' 
                ? 'भारतीय किसानों के लिए पारदर्शी सरकारी कल्याण योजना खोजक। पात्रता नियमों की सटीक समझ, आवश्यक कागजात और सीधे आधिकारिक सरकारी पोर्टल पर आवेदन।'
                : language === 'mr'
                ? 'भारतीय शेतकऱ्यांसाठी पारदर्शक शासकीय कल्याणकारी योजना शोधक. पात्रता नियमांची अचूक तपासणी, कागदपत्रे आणि थेट अधिकृत पोर्टलवर अर्ज.'
                : 'Government welfare scheme discovery and eligibility assistant for Indian farmers. Providing transparent statutory rule checks, document roadmaps, and direct official application links.'}
            </p>
            <div className="pt-2 text-xs text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-Middleman Guidance</span>
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-b border-emerald-900/80 pb-2">
              {language === 'hi' ? 'महत्वपूर्ण लिंक' : language === 'mr' ? 'महत्त्वाचे दुवे' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('finder')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.schemeFinder}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checker')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.eligibilityChecker}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.farmerDashboard}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.aiAssistant}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guidance')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.applicationGuidance}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('alerts')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.alerts}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  {t.nav.aboutUs}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Government Portals Directory */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-b border-emerald-900/80 pb-2">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टल्स' : language === 'mr' ? 'अधिकृत सरकारी पोर्टल्स' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://pmkisan.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pmfby.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>PM Fasal Bima Yojana (PMFBY)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pmkusum.mnre.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>PM-KUSUM Solar Pump Portal</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://myscheme.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>myScheme Central Platform</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://soilhealth.dac.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>National Soil Health Portal</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Approved Government Farmer Helplines (Exactly 2 Cards) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase border-b border-emerald-900/80 pb-2">
              {language === 'hi' ? 'आधिकारिक हेल्पलाइन' : language === 'mr' ? 'अधिकृत हेल्पलाइन' : 'Official Helplines'}
            </h4>
            <div className="space-y-3 text-xs">
              {/* Card 1: Kisan Call Centre */}
              <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-900/90 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Kisan Call Centre (KCC)
                </p>
                <a 
                  href="tel:18001801551" 
                  className="text-amber-300 font-mono font-bold text-sm block hover:underline whitespace-nowrap"
                >
                  1800-180-1551
                </a>
                <p className="text-[11px] text-stone-400">Toll-free · 6:00 AM to 10:00 PM</p>
                <a 
                  href="https://dackkms.gov.in/account/aboutus.aspx"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 pt-1 truncate"
                >
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">Visit KCC Portal</span>
                </a>
              </div>

              {/* Card 2: Crop Insurance Helpline */}
              <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-900/90 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Krishi Rakshak Helpline (KRPH)
                </p>
                <a 
                  href="tel:14447" 
                  className="text-amber-300 font-mono font-bold text-sm block hover:underline whitespace-nowrap"
                >
                  14447
                </a>
                <p className="text-[11px] text-stone-400">PMFBY Crop Insurance & Grievances</p>
                <a 
                  href="https://pmfby.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 pt-1 truncate"
                >
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">Visit PMFBY Portal</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Helpline Information Strip */}
        <div className="pt-8 pb-4">
          <div className="bg-[#14532D] rounded-2xl px-5 py-3.5 border border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Tagline on the Left */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-white tracking-wide text-xs sm:text-sm">
                {t.brand.tagline}
              </span>
            </div>

            {/* Both Helpline Labels and Numbers Neatly on the Right */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-5 text-[11px] sm:text-xs text-emerald-100">
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-emerald-200">Kisan Call Centre:</span>
                <a 
                  href="tel:18001801551" 
                  className="font-mono font-bold text-amber-300 hover:text-white underline whitespace-nowrap tracking-wide"
                >
                  1800-180-1551
                </a>
              </div>

              <span className="text-emerald-500/50 hidden sm:inline">|</span>

              <div className="inline-flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-emerald-200">Crop Insurance:</span>
                <a 
                  href="tel:14447" 
                  className="font-mono font-bold text-amber-300 hover:text-white underline whitespace-nowrap tracking-wide"
                >
                  14447
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Policies & Official Disclaimers */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3 border-t border-emerald-950/80">
          <p>© 2026 Kisan Suvidha. Sahi Yojana. Sahi Kisan. Sahi Suvidha.</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-emerald-800">|</span>
            <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span className="text-emerald-800">|</span>
            <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Official Disclaimer
            </button>
            <span className="text-emerald-800">|</span>
            <span className="text-emerald-300 font-medium">English · हिंदी · मराठी</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
