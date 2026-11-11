import React, { useState, useEffect } from 'react';
import { Language, UserAccount } from '../types';
import { translations } from '../translations';
import { KisanLogo } from './KisanLogo';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  ChevronDown, 
  LogIn, 
  UserPlus, 
  Settings, 
  LogOut, 
  Bookmark, 
  Phone,
  ShieldCheck,
  Check
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = translations[language];

  // Close menus when window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'finder', label: t.nav.schemeFinder },
    { id: 'checker', label: t.nav.eligibilityChecker },
    { id: 'dashboard', label: t.nav.farmerDashboard },
    { id: 'ai', label: t.nav.aiAssistant },
    { id: 'guidance', label: t.nav.applicationGuidance },
    { id: 'alerts', label: t.nav.alerts },
    { id: 'about', label: t.nav.aboutUs },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setLangDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-stone-200 shadow-xs w-full max-w-full">
      {/* Top micro bar with verified government toll-free numbers */}
      <div className="bg-[#14532D] text-emerald-100 text-xs py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 border-b border-emerald-900/40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-3 w-full">
          {/* Tagline / Government Platform Notice */}
          <div className="flex items-center gap-1.5 text-center sm:text-left min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 hidden sm:inline-block"></span>
            <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs truncate">
              {t.brand.tagline}
            </span>
          </div>

          {/* Toll-Free Helplines: Always wrapped, never break mid-digit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs min-w-0">
            <div className="inline-flex items-center gap-1 text-emerald-100 shrink-0">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
              <span className="text-emerald-200 hidden xs:inline">Kisan Call Centre:</span>
              <span className="text-emerald-200 xs:hidden">KCC:</span>
              <a 
                href="tel:18001801551" 
                className="font-mono font-bold text-amber-300 hover:text-white underline cursor-pointer whitespace-nowrap tracking-wide"
                title="Call Kisan Call Centre Toll-Free (1800-180-1551)"
              >
                1800-180-1551
              </a>
              <span className="text-emerald-300/70 hidden md:inline text-[10px]">(Toll-Free)</span>
            </div>

            <span className="text-emerald-500/50 hidden sm:inline">|</span>

            <div className="inline-flex items-center gap-1 text-emerald-100 shrink-0">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
              <span className="text-emerald-200 hidden xs:inline">Crop Insurance:</span>
              <span className="text-emerald-200 xs:hidden">PMFBY:</span>
              <a 
                href="tel:14447" 
                className="font-mono font-bold text-amber-300 hover:text-white underline cursor-pointer whitespace-nowrap tracking-wide"
                title="Call Krishi Rakshak Crop Insurance Helpline (14447)"
              >
                14447
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 xl:gap-4 w-full min-w-0">
          
          {/* Brand Zone: Authentic Original Shield Logo + Responsive Title & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 min-w-0 group select-none py-1"
          >
            <div className="transition-transform group-hover:scale-105 shrink-0 flex items-center justify-center">
              <KisanLogo className="w-9 h-9 sm:w-11 sm:h-11 xl:w-12 xl:h-12 drop-shadow-xs" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-base sm:text-xl xl:text-2xl font-bold tracking-tight text-[#14532D] leading-tight font-sans truncate">
                {t.brand.name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 tracking-tight leading-tight hidden xs:block truncate max-w-[150px] sm:max-w-[220px] 2xl:max-w-none">
                {t.brand.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links: Visible only on xl screens (>= 1280px) to prevent layout blowout */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 shrink min-w-0">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2 2xl:px-2.5 py-1.5 text-xs 2xl:text-[13px] font-semibold whitespace-nowrap rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#14532D] bg-[#F5F2E8] font-bold shadow-2xs'
                      : 'text-stone-700 hover:text-[#14532D] hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone: Language Selector, Auth Buttons, Hamburger Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setUserMenuOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200 cursor-pointer shrink-0"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
                <span className="uppercase font-bold tracking-wide text-[11px] sm:text-xs">
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'म'}
                </span>
                <span className="hidden md:inline text-stone-500 font-normal text-xs">
                  {language === 'en' ? '(English)' : language === 'hi' ? '(हिंदी)' : '(मराठी)'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-500 shrink-0" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-stone-50 cursor-pointer ${language === 'en' ? 'text-[#14532D] font-bold bg-[#F5F2E8]' : 'text-stone-700'}`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5 text-[#14532D]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-stone-50 cursor-pointer ${language === 'hi' ? 'text-[#14532D] font-bold bg-[#F5F2E8]' : 'text-stone-700'}`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <Check className="w-3.5 h-3.5 text-[#14532D]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('mr')}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-stone-50 cursor-pointer ${language === 'mr' ? 'text-[#14532D] font-bold bg-[#F5F2E8]' : 'text-stone-700'}`}
                  >
                    <span>मराठी (Marathi)</span>
                    {language === 'mr' && <Check className="w-3.5 h-3.5 text-[#14532D]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated Farmer Menu OR Sign In / Register Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-all cursor-pointer shrink-0"
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#14532D] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left min-w-0">
                    <span className="text-xs font-bold text-[#14532D] truncate max-w-[100px] lg:max-w-[120px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold truncate">
                      Registered Farmer
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-emerald-800 shrink-0 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.mobile ? `+91 ${currentUser.mobile}` : currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        Farmer Account
                      </span>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{t.nav.farmerDashboard}</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Saved Schemes & Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-stone-500 shrink-0" />
                      <span>Account Settings</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-[#14532D] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.nav.login}</span>
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="hidden md:flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.nav.signup}</span>
                </button>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Toggle (Shown on screens < xl) */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setLangDropdownOpen(false);
                setUserMenuOpen(false);
              }}
              className="xl:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 hover:text-[#14532D] transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#14532D]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible when mobileMenuOpen is true on < xl viewports) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-4">
            
            {/* Language Quick Switcher in Mobile Drawer */}
            <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-stone-200">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#14532D]" />
                <span>Preferred Language / भाषा निवडा / भाषा चुनें</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => handleLanguageChange('mr')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer ${
                    language === 'mr'
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* Authenticated Farmer Profile Card if logged in */}
            {currentUser && (
              <div className="p-3 bg-[#F5F2E8] rounded-xl flex items-center justify-between border border-amber-200/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#14532D] truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-stone-600 truncate">{currentUser.state} · Registered Farmer</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#14532D] rounded-lg shrink-0 cursor-pointer"
                >
                  Dashboard
                </button>
              </div>
            )}

            {/* Navigation Links list with touch-friendly targets */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-1">
                Navigation
              </p>
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'text-[#14532D] bg-[#F5F2E8] font-bold border border-emerald-200/50'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#14532D]"></span>}
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth and Action Section */}
            <div className="pt-3 border-t border-stone-200 space-y-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full py-2.5 px-4 text-xs font-bold text-left text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-stone-600 shrink-0" />
                    <span>Account Settings & Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold text-center text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors block cursor-pointer border border-rose-200"
                  >
                    Sign Out ({currentUser.fullName})
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="py-2.5 px-4 text-xs font-bold text-center text-[#14532D] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border border-emerald-200"
                  >
                    {t.nav.login}
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="py-2.5 px-4 text-xs font-bold text-center text-white bg-[#14532D] hover:bg-[#0f4022] rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    {t.nav.signup}
                  </button>
                </div>
              )}
            </div>

            {/* Helpline quick dial inside mobile drawer */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Verified Farmer Toll-Free Helplines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:18001801551"
                  className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-stone-800 font-semibold"
                >
                  <span className="text-[11px] text-emerald-800">Kisan Call Centre</span>
                  <span className="font-mono font-bold text-emerald-900">1800-180-1551</span>
                </a>
                <a
                  href="tel:14447"
                  className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-stone-800 font-semibold"
                >
                  <span className="text-[11px] text-emerald-800">Crop Insurance</span>
                  <span className="font-mono font-bold text-emerald-900">14447</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
