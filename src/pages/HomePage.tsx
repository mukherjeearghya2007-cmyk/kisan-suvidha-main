import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { KisanLogo } from '../components/KisanLogo';
import { OfficialHelplines } from '../components/OfficialHelplines';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  language: Language;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onNavigate
}) => {
  const t = translations[language];

  const featureCards = [
    {
      id: 'finder',
      icon: Search,
      title: language === 'hi' ? 'स्मार्ट योजना खोजक' : language === 'mr' ? 'स्मार्ट योजना शोधक' : 'Smart Scheme Finder',
      desc: language === 'hi' ? 'फसल, भूमि जोत, श्रेणी और राज्य के अनुसार सत्यापित केंद्रीय और राज्य सरकारी योजनाओं को खोजें।' : language === 'mr' ? 'पीक, जमीन, वर्ग आणि राज्यानुसार अधिकृत सरकारी योजना शोधा.' : 'Search verified central and state schemes by crop, land size, category, and state.',
      actionText: language === 'hi' ? 'योजनाएं खोजें' : language === 'mr' ? 'योजना शोधा' : 'Explore Schemes',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'checker',
      icon: ShieldCheck,
      title: language === 'hi' ? 'पात्रता जांच' : language === 'mr' ? 'पात्रता पडताळणी' : 'Eligibility Checker',
      desc: language === 'hi' ? '25 सरकारी मापदंडों पर आधारित निष्पक्ष नियम जांच। हरा (पात्र), पीला (संभावित) व लाल (अपात्र) परिणाम।' : language === 'mr' ? '२५ अधिकृत निकषांवर पारदर्शक तपासणी. हिरवा (पात्र), पिवळा (संभाव्य) व लाल (अपात्र) निकाल.' : 'Rigorous statutory rule engine. Instant Green, Yellow, and Red verified eligibility results.',
      actionText: language === 'hi' ? 'पात्रता जांचें' : language === 'mr' ? 'पात्रता तपासा' : 'Check Eligibility',
      color: 'bg-amber-50 text-amber-900 border-amber-200'
    },
    {
      id: 'ai',
      icon: Sparkles,
      title: language === 'hi' ? 'किसान एआई सहायक' : language === 'mr' ? 'किसान एआय सहाय्यक' : 'Conversational AI Assistant',
      desc: language === 'hi' ? 'हिंदी, मराठी और अंग्रेजी में बोलकर या लिखकर सवाल पूछें। केवल सरकारी गजट से सत्यापित सटीक उत्तर।' : language === 'mr' ? 'मराठी, हिंदी आणि इंग्रजीत बोलून किंवा लिहून प्रश्न विचारा. केवळ अधिकृत माहिती.' : 'Ask questions via voice or text in English, Hindi, and Marathi with verified official answers.',
      actionText: language === 'hi' ? 'सवाल पूछें' : language === 'mr' ? 'प्रश्न विचारा' : 'Ask a Question',
      color: 'bg-blue-50 text-blue-900 border-blue-200'
    },
    {
      id: 'guidance',
      icon: FileText,
      title: language === 'hi' ? 'आवेदन व दस्तावेज़ गाइड' : language === 'mr' ? 'अर्ज व कागदपत्रे गाइड' : 'Required Documents Roadmap',
      desc: language === 'hi' ? '7/12, आधार और बैंक पासबुक की डिजिटल चेकलिस्ट। तहसील के अनावश्यक चक्कर लगाने से बचें।' : language === 'mr' ? '७/१२, आधार व बँक पासबुक डिजिटल चेकलिस्ट. सेतू किंवा तहसीलचे हेलपाटे वाचवा.' : 'Checklist of mandatory paperwork and step-by-step instructions for official portals.',
      actionText: language === 'hi' ? 'दस्तावेज़ देखें' : language === 'mr' ? 'कागदपत्रे पहा' : 'Required Documents',
      color: 'bg-stone-50 text-stone-900 border-stone-200'
    },
    {
      id: 'alerts',
      icon: Bell,
      title: language === 'hi' ? 'सत्यापित अलर्ट व अंतिम तिथियां' : language === 'mr' ? 'योजनांच्या अंतिम मुदती' : 'Scheme Deadlines & Alerts',
      desc: language === 'hi' ? 'रबी/खरीफ बीमा अंतिम तिथियां, सोलर पंप कोटे और सरकारी किस्तों के सत्यापित अलर्ट।' : language === 'mr' ? 'रब्बी/खरीप पीक विमा मुदती, सौर पंप कोटे आणि शासकीय हप्त्यांचे अधिकृत अलर्ट.' : 'Up-to-date deadlines on subsidy application windows, installments, and seasonal cutoffs.',
      actionText: language === 'hi' ? 'अलर्ट देखें' : language === 'mr' ? 'अलर्ट पहा' : 'View Deadlines',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F2E8] via-[#FAF9F5] to-white pt-10 sm:pt-16 pb-16 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Supporting Text, and Primary CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#14532D] text-xs font-semibold tracking-wide border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{t.home.heroBadge}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14532D] tracking-tight leading-[1.15]">
                {t.home.heroHeading}
              </h1>

              {/* Supporting Subtext */}
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
                {t.home.heroSubheading}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('checker')}
                  className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <span>{t.home.startNow}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onNavigate('finder')}
                  className="px-6 py-3.5 text-sm sm:text-base font-bold text-[#14532D] bg-white hover:bg-stone-50 rounded-xl border border-stone-300 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#65A30D]" />
                  <span>{t.home.exploreSchemes}</span>
                </button>

                <button
                  onClick={() => onNavigate('ai')}
                  className="px-5 py-3.5 text-sm font-semibold text-stone-700 hover:text-[#14532D] bg-[#F5F2E8] hover:bg-[#ece6d5] rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-stone-200/80"
                >
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>{t.home.talkToAI}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual with Clean Transparent SVG Logo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90 text-center">
                
                {/* Decorative background subtle glow */}
                <div className="absolute inset-0 bg-radial from-amber-100/30 via-emerald-100/20 to-transparent rounded-3xl pointer-events-none"></div>

                {/* Clean Transparent SVG Logo */}
                <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 mb-4 transition-transform hover:scale-102 flex items-center justify-center">
                  <KisanLogo className="w-full h-full drop-shadow-md" />
                </div>

                <h3 className="text-2xl font-bold text-[#14532D] tracking-tight">
                  {t.brand.name}
                </h3>
                <p className="text-sm font-semibold text-[#65A30D] mt-1">
                  {t.brand.tagline}
                </p>

                {/* 3 Core Principles */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-stone-200 text-left">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <p className="text-[11px] text-stone-500 font-medium">Verification</p>
                    <p className="text-xs font-bold text-[#14532D]">25 Rules</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <p className="text-[11px] text-stone-500 font-medium">Languages</p>
                    <p className="text-xs font-bold text-[#14532D]">EN / HI / MR</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <p className="text-[11px] text-stone-500 font-medium">Middlemen</p>
                    <p className="text-xs font-bold text-emerald-700">0% Cut</p>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => onNavigate('finder')}
                    className="w-full py-2.5 px-4 text-xs font-bold text-[#14532D] bg-[#F5F2E8] hover:bg-[#eae3d0] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Explore All Government Schemes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.home.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t.home.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md hover:border-[#14532D]/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#14532D] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#14532D]">
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-[#F5F2E8]/60 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
              {t.home.howItWorksTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              {t.home.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.steps.map((step) => (
              <div 
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs relative"
              >
                <div className="text-3xl font-extrabold text-amber-500/80 font-mono mb-2">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS FOR SMALL & MARGINAL FARMERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <span>Farmer First</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
              {t.home.benefitsTitle}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t.home.benefitsSubtitle}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('checker')}
                className="px-5 py-3 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.home.startNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.home.benefitsList.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* OFFICIAL GOVERNMENT FARMER HELPLINES (EXACTLY 2 VERIFIED CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OfficialHelplines language={language} />
      </section>

      {/* FINAL STRAIGHTFORWARD CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
          {t.home.ctaHeading}
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          {t.home.ctaSubheading}
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('checker')}
            className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2 active:scale-98"
          >
            <span>{t.home.ctaButton}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
