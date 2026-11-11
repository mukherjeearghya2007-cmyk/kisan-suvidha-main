import React, { useState, useEffect, useRef } from 'react';
import { Language, UserAccount } from '../types';
import { KisanLogo } from '../components/KisanLogo';
import { authService } from '../utils/authService';
import { translations } from '../translations';
import { 
  speakText, 
  stopSpeaking, 
  listenOnce, 
  isSpeechRecognitionSupported, 
  extractMobileNumber 
} from '../utils/voiceAssistant';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck,
  Mic,
  Volume2,
  Lock,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

interface LoginPageProps {
  language: Language;
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToSignUp: () => void;
  onNavigateHome: () => void;
  redirectNotice?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateHome,
  redirectNotice
}) => {
  const t = translations[language];
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Voice Login Assistant State
  const [showVoiceAssist, setShowVoiceAssist] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  const stopListeningRef = useRef<(() => void) | null>(null);

  // Multilingual strings for voice login assistant
  const voiceStrings = {
    en: {
      btn: 'Login Assistance',
      sub: 'Need help? Use voice assistance to speak your mobile number or hear instructions',
      title: 'Farmer Voice Login Assistant',
      spokenPrompt: 'Namaste! Welcome to Kisan Suvidha. To sign in, you can speak your registered 10-digit mobile number, or I can explain the login process. For your security, passwords must always be typed manually.',
      speakMobileBtn: 'Speak 10-Digit Mobile Number',
      speakMobilePrompt: 'Please speak your 10-digit mobile number clearly now.',
      listening: 'Listening... Please speak your 10-digit mobile number',
      recognized: 'Recognized mobile number:',
      readHelpBtn: 'Read Step-by-Step Login Instructions',
      stepInstructions: 'Step 1: Enter your 10-digit mobile number. Step 2: Type your password in the password field. Step 3: Click the Login button. If you forgot your password, click Forgot Password to set a new one.',
      forgotBtn: 'Password Recovery Assistance',
      forgotExplanation: 'If you have forgotten your password, click the Forgot Password link on the form. You can enter your mobile number and set a new password immediately.',
      securityNotice: 'Security Notice: For your account protection, passwords can never be collected or spoken aloud. Passwords must always be typed manually into the secure password field.',
      close: 'Close Voice Assistant',
      unsupported: 'Voice recognition is not supported in this browser. Please type your details manually.',
      denied: 'Microphone permission was denied. Please allow microphone access or type your credentials manually.'
    },
    hi: {
      btn: 'वॉइस लॉगिन सहायता',
      sub: 'मदद चाहिए? अपना मोबाइल नंबर बोलकर दर्ज करें या सहायता सुनें',
      title: 'किसान वॉइस लॉगिन सहायक',
      spokenPrompt: 'नमस्ते! किसान सुविधा में आपका स्वागत है। लॉगिन करने के लिए आप अपना 10 अंकों का पंजीकृत मोबाइल नंबर बोल सकते हैं, या लॉगिन प्रक्रिया सुन सकते हैं। आपकी सुरक्षा के लिए पासवर्ड हमेशा खुद टाइप करना होगा।',
      speakMobileBtn: '10 अंकों का मोबाइल नंबर बोलें',
      speakMobilePrompt: 'कृपया अपना 10 अंकों का मोबाइल नंबर अब स्पष्ट बोलें।',
      listening: 'सुन रहे हैं... कृपया अपना मोबाइल नंबर बोलें',
      recognized: 'पहचाना गया मोबाइल नंबर:',
      readHelpBtn: 'लॉगिन के आसान चरण सुनें',
      stepInstructions: 'पहला चरण: अपना 10 अंकों का मोबाइल नंबर दर्ज करें। दूसरा चरण: पासवर्ड वाले बॉक्स में अपना पासवर्ड टाइप करें। तीसरा चरण: लॉगिन बटन दबाएं। यदि पासवर्ड याद नहीं है, तो पासवर्ड भूल गए पर क्लिक करके नया पासवर्ड बना सकते हैं।',
      forgotBtn: 'पासवर्ड रीसेट करने की मदद',
      forgotExplanation: 'यदि आप अपना पासवर्ड भूल गए हैं, तो फॉर्म पर पासवर्ड भूल गए लिंक पर क्लिक करें। वहां अपना मोबाइल नंबर डालकर तुरंत नया पासवर्ड बना सकते हैं।',
      securityNotice: 'सुरक्षा सूचना: किसान की सुरक्षा के लिए पासवर्ड बोलकर नहीं लिया जा सकता। पासवर्ड हमेशा पासवर्ड बॉक्स में खुद टाइप करें।',
      close: 'वॉइस बंद करें',
      unsupported: 'इस ब्राउज़र में वॉइस सुविधा उपलब्ध नहीं है। कृपया विवरण खुद टाइप करें।',
      denied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में अनुमति दें या नीचे टाइप करें।'
    },
    mr: {
      btn: 'व्हॉइस लॉगिन मदत',
      sub: 'मदत हवी आहे? आपला मोबाईल नंबर बोलून प्रविष्ट करा किंवा सूचना ऐका',
      title: 'शेतकरी व्हॉइस लॉगिन सहाय्यक',
      spokenPrompt: 'नमस्कार! किसान सुविधा मध्ये आपले स्वागत आहे. लॉगिन करण्यासाठी आपण आपला १० अंकी नोंदणीकृत मोबाईल नंबर बोलू शकता, किंवा मदत सूचना ऐकू शकता. आपल्या सुरक्षेसाठी पासवर्ड नेहमी स्वतः हाताने टाईप करणे आवश्यक आहे.',
      speakMobileBtn: '१० अंकी मोबाईल नंबर बोला',
      speakMobilePrompt: 'कृपया आपला १० अंकी मोबाईल क्रमांक आता स्पष्ट सांगा.',
      listening: 'ऐकत आहोत... कृपया आपला मोबाईल नंबर बोला',
      recognized: 'ओळखलेला मोबाईल क्रमांक:',
      readHelpBtn: 'लॉगिनच्या सोप्या पायऱ्या ऐका',
      stepInstructions: 'पायरी १: आपला १० अंकी मोबाईल नंबर टाका. पायरी २: पासवर्ड बॉक्समध्ये आपला पासवर्ड टाईप करा. पायरी ३: लॉगिन बटण दाबा. पासवर्ड आठवत नसेल तर पासवर्ड विसरलात वर क्लिक करून नवीन पासवर्ड तयार करा.',
      forgotBtn: 'पासवर्ड रीसेटसाठी मदत',
      forgotExplanation: 'जर आपण पासवर्ड विसरला असाल, तर फॉर्मवरील पासवर्ड विसरलात लिंकवर क्लिक करा. तिथे मोबाईल नंबर टाकून त्वरित नवीन पासवर्ड तयार करू शकता.',
      securityNotice: 'सुरक्षा सूचना: शेतकरी खात्याच्या सुरक्षेसाठी पासवर्ड बोलून घेतला जात नाही. पासवर्ड नेहमी पासवर्ड बॉक्समध्ये स्वतः टाईप करा.',
      close: 'व्हॉइस बंद करा',
      unsupported: 'या ब्राऊझरमध्ये व्हॉइस सुविधा उपलब्ध नाही. कृपया माहिती स्वतः टाईप करा.',
      denied: 'मायक्रोफोन परवानगी नाकारली गेली. कृपया ब्राऊझरमध्ये परवानगी द्या किंवा खाली टाईप करा.'
    }
  }[language];

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (stopListeningRef.current) stopListeningRef.current();
    };
  }, []);

  const handleOpenVoiceAssist = () => {
    setShowVoiceAssist(true);
    setVoiceNotice('');
    setVoiceTranscript('');
    stopSpeaking();
    setIsSpeaking(true);
    speakText(voiceStrings.spokenPrompt, language, () => {
      setIsSpeaking(false);
    });
  };

  const handleCloseVoiceAssist = () => {
    stopSpeaking();
    if (stopListeningRef.current) stopListeningRef.current();
    setIsListening(false);
    setIsSpeaking(false);
    setShowVoiceAssist(false);
  };

  const handleSpeakMobileNumber = () => {
    if (!isSpeechRecognitionSupported()) {
      setVoiceNotice(voiceStrings.unsupported);
      return;
    }

    setVoiceNotice('');
    setVoiceTranscript('');
    stopSpeaking();

    // Speak prompt first
    setIsSpeaking(true);
    speakText(voiceStrings.speakMobilePrompt, language, () => {
      setIsSpeaking(false);
      // Start microphone listening
      stopListeningRef.current = listenOnce({
        language,
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
        onError: (errType, msg) => {
          setIsListening(false);
          if (errType === 'PERMISSION_DENIED') {
            setVoiceNotice(voiceStrings.denied);
          } else if (errType === 'SPEECH_NOT_SUPPORTED') {
            setVoiceNotice(voiceStrings.unsupported);
          } else {
            setVoiceNotice(msg || 'Could not understand number. Please repeat clearly.');
          }
        },
        onResult: (spokenText) => {
          const num = extractMobileNumber(spokenText);
          if (num.length > 0) {
            setVoiceTranscript(num);
            setIdentifier(num);
            setVoiceNotice(`Entered: ${num}`);
            // Acknowledge aloud
            speakText(`Thank you. Registered mobile number ${num} entered. Please type your password below.`, language);
          } else {
            setVoiceNotice(`Heard "${spokenText}". Please speak 10 digits clearly.`);
          }
        }
      });
    });
  };

  const handleReadInstructions = () => {
    stopSpeaking();
    setIsSpeaking(true);
    speakText(voiceStrings.stepInstructions, language, () => {
      setIsSpeaking(false);
    });
  };

  const handleReadForgotHelp = () => {
    stopSpeaking();
    setIsSpeaking(true);
    speakText(voiceStrings.forgotExplanation, language, () => {
      setIsSpeaking(false);
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        language === 'hi' 
          ? 'कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें' 
          : language === 'mr' 
          ? 'कृपया आपला मोबाईल नंबर किंवा ईमेल प्रविष्ट करा' 
          : 'Please enter your 10-digit mobile number or email address.'
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        language === 'hi' 
          ? 'कृपया पासवर्ड दर्ज करें' 
          : language === 'mr' 
          ? 'कृपया पासवर्ड प्रविष्ट करा' 
          : 'Please enter your password.'
      );
      return;
    }

    setIsSubmitting(true);
    const result = authService.login(identifier, password, rememberMe);
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMessage(
        language === 'hi' 
          ? 'लॉगिन सफल! डैशबोर्ड पर भेजा जा रहा है...' 
          : language === 'mr' 
          ? 'लॉगिन यशस्वी! डॅशबोर्डवर पुनर्निर्देशित करत आहे...' 
          : 'Login successful! Directing to your personal dashboard...'
      );
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 700);
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your registered mobile number or email.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setForgotError('New password must be at least 8 characters long.');
      return;
    }

    const res = authService.resetPassword(forgotIdentifier, newPassword);
    if (res.success) {
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setIdentifier(forgotIdentifier);
        setPassword(newPassword);
      }, 1400);
    } else {
      setForgotError(res.error || 'Account not found with this mobile or email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Lockup with Original Transparent Logo */}
        <div className="text-center space-y-3">
          <div 
            onClick={onNavigateHome}
            className="inline-flex items-center gap-3 cursor-pointer transition-transform hover:scale-102 select-none"
          >
            <KisanLogo className="w-13 h-13 drop-shadow-xs" />
            <div className="text-left flex flex-col justify-center">
              <span className="text-2xl font-bold tracking-tight text-[#14532D] leading-none font-sans mb-1">
                {t.brand.name}
              </span>
              <span className="text-xs font-semibold text-emerald-800 tracking-wide leading-tight">
                {t.brand.tagline}
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight pt-1">
            Welcome Back, Farmer!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
            Log in to access your farm dashboard, saved schemes, and document roadmap.
          </p>
        </div>

        {/* Route Protection Redirection Notice (if redirected from a protected route) */}
        {redirectNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium flex items-start gap-2.5 shadow-2xs animate-in fade-in">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Farmer Sign-In Required</p>
              <p className="text-[11px] text-amber-800 mt-0.5">{redirectNotice}</p>
            </div>
          </div>
        )}

        {/* VOICE LOGIN ASSISTANCE BUTTON */}
        {!showVoiceAssist ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-emerald-950 font-medium min-w-0">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">{voiceStrings.sub}</span>
            </div>
            <button
              type="button"
              onClick={handleOpenVoiceAssist}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{voiceStrings.btn}</span>
            </button>
          </div>
        ) : (
          /* ACTIVE VOICE LOGIN ASSISTANT PANEL */
          <div className="bg-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-emerald-500/50 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {voiceStrings.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseVoiceAssist}
                className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Speaking / Live Status */}
            <div className="space-y-2">
              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60 flex items-start gap-2.5">
                <Volume2 className={`w-4 h-4 text-amber-400 shrink-0 mt-0.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {voiceStrings.spokenPrompt}
                </p>
              </div>

              {isListening && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-amber-300 animate-pulse bg-emerald-900/40 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>{voiceStrings.listening}</span>
                </div>
              )}

              {voiceNotice && (
                <div className="bg-emerald-900 p-2.5 rounded-xl border border-emerald-600/60 text-xs text-amber-200">
                  {voiceNotice}
                </div>
              )}
            </div>

            {/* Voice Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSpeakMobileNumber}
                disabled={isSpeaking || isListening}
                className="p-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] border border-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                <span>{voiceStrings.speakMobileBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleReadInstructions}
                disabled={isSpeaking}
                className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{voiceStrings.readHelpBtn}</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-200/80 italic text-center">
              🔒 {voiceStrings.securityNotice}
            </p>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Farmer Login Form */}
        <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          
          {/* Mobile Number or Email */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Mobile Number or Email *
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 9823456789 or farmer@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 bg-white"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                Password * (Enter manually)
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotIdentifier(identifier);
                  setShowForgotModal(true);
                }}
                className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 bg-white"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-stone-300"
              />
              <span>Remember Me on this device</span>
            </label>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Login to Dashboard'}</span>
            </button>
          </div>

          {/* Direct link to Sign Up */}
          <div className="pt-3 text-center border-t border-stone-100 text-xs text-stone-600">
            <span>New to Kisan Suvidha? </span>
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="font-bold text-[#14532D] hover:underline cursor-pointer"
            >
              Create Farmer Account
            </button>
          </div>

        </form>

        <p className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Government of India & State Agriculture Scheme Discovery</span>
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>Reset Farmer Password</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-800 font-semibold border border-red-200">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-xs text-emerald-900 font-bold border border-emerald-300 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p>Password reset successful!</p>
                <p className="text-[11px] font-normal text-emerald-700">Logging you in with new password...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Registered Mobile or Email
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter mobile or email"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#14532D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    New Password (Min 8 chars)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#14532D]"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f4022] cursor-pointer"
                  >
                    Reset & Sign In
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
