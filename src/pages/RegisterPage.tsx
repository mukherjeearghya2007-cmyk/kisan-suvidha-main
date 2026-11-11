import React, { useState, useEffect, useRef } from 'react';
import { Language, UserAccount } from '../types';
import { KisanLogo } from '../components/KisanLogo';
import { authService } from '../utils/authService';
import { ALL_INDIAN_STATES_AND_UTS } from '../utils/schemeService';
import { getDistrictsForState } from '../data/indianDistricts';
import { translations } from '../translations';
import { 
  speakText, 
  stopSpeaking, 
  listenOnce, 
  isSpeechRecognitionSupported, 
  extractMobileNumber, 
  matchSpokenState, 
  matchSpokenLanguage 
} from '../utils/voiceAssistant';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

interface RegisterPageProps {
  language: Language;
  onRegisterSuccess: (user: UserAccount) => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
}

type VoiceStep = 'idle' | 'name' | 'mobile' | 'state' | 'district' | 'lang' | 'completed';

export const RegisterPage: React.FC<RegisterPageProps> = ({
  language,
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateHome
}) => {
  const t = translations[language];

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status & Submission
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice Assistant State
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStep, setVoiceStep] = useState<VoiceStep>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const cancelSpeechRef = useRef<(() => void) | null>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  // Multilingual Voice Strings
  const vText = {
    en: {
      voiceBtn: 'Fill Details Using Voice',
      voiceSub: 'Speak your name, phone, state & district in English, हिंदी or मराठी',
      modalTitle: 'Voice Registration Assistant',
      micNotice: 'Microphone permission is required to listen to your responses.',
      startPrompt: 'Click start to begin voice registration. I will guide you question by question.',
      step1Prompt: 'Namaste! Welcome to Kisan Suvidha. I can help you complete your registration. What is your full name?',
      step1Field: 'Full Name',
      step2Prompt: 'Thank you. Please tell me your 10-digit mobile number.',
      step2Field: 'Mobile Number',
      step3Prompt: 'Which state is your farm located in?',
      step3Field: 'State',
      step4Prompt: 'Which district do you live in?',
      step4Field: 'District',
      step5Prompt: 'What is your preferred language? English, Hindi, or Marathi?',
      step5Field: 'Preferred Language',
      completedPrompt: 'Great! I have filled your basic information into the form. For your security, passwords cannot be spoken aloud. Please set your private password manually below and click Register.',
      listening: 'Listening... Please speak now',
      recognized: 'Recognized answer:',
      repeat: 'Repeat Answer',
      next: 'Next Question',
      done: 'Done & Review Form',
      stop: 'Stop Voice Input',
      passNotice: 'Security Notice: Passwords and password confirmation must always be typed manually.',
      unsupported: 'Voice recognition is not supported in this browser. Please type your details manually.',
      denied: 'Microphone access was denied. Please allow microphone permissions in your browser or type manually.'
    },
    hi: {
      voiceBtn: 'बोलकर विवरण भरें (आवाज़ से)',
      voiceSub: 'अपना नाम, मोबाइल, राज्य और ज़िला हिंदी, मराठी या अंग्रेज़ी में बोलें',
      modalTitle: 'वॉइस पंजीकरण सहायक',
      micNotice: 'बोलकर विवरण भरने के लिए माइक्रोफ़ोन की अनुमति जरूरी है।',
      startPrompt: 'शुरू करने के लिए नीचे क्लिक करें। मैं एक-एक करके आसान सवाल पूछूँगा।',
      step1Prompt: 'नमस्ते! किसान सुविधा में आपका स्वागत है। मैं पंजीकरण में आपकी मदद करूँगा। आपका पूरा नाम क्या है?',
      step1Field: 'पूरा नाम',
      step2Prompt: 'धन्यवाद। कृपया अपना 10 अंकों का मोबाइल नंबर बताएं।',
      step2Field: 'मोबाइल नंबर',
      step3Prompt: 'आप किस राज्य में खेती करते हैं?',
      step3Field: 'राज्य',
      step4Prompt: 'आपका ज़िला कौन सा है?',
      step4Field: 'ज़िला',
      step5Prompt: 'आपकी पसंदीदा भाषा कौन सी है? हिंदी, मराठी या अंग्रेज़ी?',
      step5Field: 'पसंदीदा भाषा',
      completedPrompt: 'बहुत बढ़िया! मैंने आपका विवरण फॉर्म में भर दिया है। आपकी सुरक्षा के लिए पासवर्ड बोलकर नहीं लिया जा सकता। कृपया नीचे सुरक्षित पासवर्ड खुद टाइप करें और खाता बनाएं पर क्लिक करें।',
      listening: 'सुन रहे हैं... कृपया अब बोलें',
      recognized: 'पहचाना गया उत्तर:',
      repeat: 'दोबारा बोलें',
      next: 'अगला सवाल',
      done: 'हो गया, फॉर्म देखें',
      stop: 'वॉइस बंद करें',
      passNotice: 'सुरक्षा सूचना: पासवर्ड और पुष्टि हमेशा हाथों से टाइप करें।',
      unsupported: 'इस ब्राउज़र में वॉइस सुविधा उपलब्ध नहीं है। कृपया विवरण खुद टाइप करें।',
      denied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में अनुमति दें या नीचे टाइप करें।'
    },
    mr: {
      voiceBtn: 'बोलून माहिती भरा (आवाजाने)',
      voiceSub: 'आपले नाव, मोबाईल, राज्य आणि जिल्हा मराठी, हिंदी किंवा इंग्रजीत सांगा',
      modalTitle: 'व्हॉइस नोंदणी सहाय्यक',
      micNotice: 'आवाजाने माहिती भरण्यासाठी मायक्रोफोन परवानगी आवश्यक आहे.',
      startPrompt: 'सुरू करण्यासाठी खाली क्लिक करा. मी एक-एक करून सोपे प्रश्न विचारेन.',
      step1Prompt: 'नमस्कार! किसान सुविधा मध्ये आपले स्वागत आहे. मी आपली नोंदणी करण्यास मदत करतो. आपले पूर्ण नाव काय आहे?',
      step1Field: 'पूर्ण नाव',
      step2Prompt: 'धन्यवाद. कृपया आपला १० अंकी मोबाईल क्रमांक सांगा.',
      step2Field: 'मोबाईल क्रमांक',
      step3Prompt: 'आपण कोणत्या राज्यात शेती करता?',
      step3Field: 'राज्य',
      step4Prompt: 'आपला जिल्हा कोणता आहे?',
      step4Field: 'जिल्हा',
      step5Prompt: 'आपली पसंतीची भाषा कोणती आहे? मराठी, हिंदी की इंग्रजी?',
      step5Field: 'पसंतीची भाषा',
      completedPrompt: 'उत्तम! मी आपला शेती तपशील फॉर्ममध्ये भरला आहे. आपल्या सुरक्षेसाठी पासवर्ड बोलून घेतला जात नाही. कृपया खाली स्वतःचा पासवर्ड टाईप करा आणि खाते तयार करा वर क्लिक करा.',
      listening: 'ऐकत आहोत... कृपया आता बोला',
      recognized: 'ओळखलेले उत्तर:',
      repeat: 'पुन्हा बोला',
      next: 'पुढील प्रश्न',
      done: 'झाले, फॉर्म तपासा',
      stop: 'व्हॉइस बंद करा',
      passNotice: 'सुरक्षा सूचना: पासवर्ड आणि पुष्टी नेहमी स्वतः हाताने टाईप करा.',
      unsupported: 'या ब्राऊझरमध्ये व्हॉइस सुविधा उपलब्ध नाही. कृपया माहिती स्वतः टाईप करा.',
      denied: 'मायक्रोफोन परवानगी नाकारली गेली. कृपया ब्राऊझरमध्ये परवानगी द्या किंवा खाली टाईप करा.'
    }
  }[preferredLang];

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (stopListeningRef.current) stopListeningRef.current();
    };
  }, []);

  // Handle current voice step transition and voice prompting
  const runVoiceStep = (step: VoiceStep) => {
    setVoiceStep(step);
    setVoiceError('');
    setVoiceTranscript('');
    stopSpeaking();
    if (stopListeningRef.current) stopListeningRef.current();

    let promptText = '';
    switch (step) {
      case 'name':
        promptText = vText.step1Prompt;
        break;
      case 'mobile':
        promptText = vText.step2Prompt;
        break;
      case 'state':
        promptText = vText.step3Prompt;
        break;
      case 'district':
        promptText = vText.step4Prompt;
        break;
      case 'lang':
        promptText = vText.step5Prompt;
        break;
      case 'completed':
        promptText = vText.completedPrompt;
        break;
      default:
        return;
    }

    setIsSpeaking(true);
    cancelSpeechRef.current = speakText(
      promptText,
      preferredLang,
      () => {
        setIsSpeaking(false);
        // After speaking question, auto-start listening (unless it's the final completed message)
        if (step !== 'completed') {
          startListeningForStep(step);
        }
      },
      (err) => {
        setIsSpeaking(false);
        if (step !== 'completed') {
          startListeningForStep(step);
        }
      }
    );
  };

  // Start listening to the microphone for the active step
  const startListeningForStep = (step: VoiceStep) => {
    if (!isSpeechRecognitionSupported()) {
      setVoiceError(vText.unsupported);
      return;
    }

    setVoiceError('');
    setVoiceTranscript('');

    stopListeningRef.current = listenOnce({
      language: preferredLang,
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (errType, message) => {
        setIsListening(false);
        if (errType === 'PERMISSION_DENIED') {
          setVoiceError(vText.denied);
        } else if (errType === 'SPEECH_NOT_SUPPORTED') {
          setVoiceError(vText.unsupported);
        } else if (errType === 'NO_SPEECH') {
          setVoiceError('No speech detected. Please click Repeat Answer to try again, or type below.');
        } else {
          setVoiceError(message || 'Could not understand. Please repeat or type manually.');
        }
      },
      onResult: (spokenText) => {
        setVoiceTranscript(spokenText);
        handleStepResult(step, spokenText);
      }
    });
  };

  // Process the spoken answer into the right state field
  const handleStepResult = (step: VoiceStep, answer: string) => {
    switch (step) {
      case 'name': {
        const cleanedName = answer.replace(/[.,!]/g, '').trim();
        setFullName(cleanedName);
        setTimeout(() => runVoiceStep('mobile'), 1200);
        break;
      }
      case 'mobile': {
        const num = extractMobileNumber(answer);
        if (num.length > 0) {
          setMobile(num);
          setTimeout(() => runVoiceStep('state'), 1200);
        } else {
          setVoiceError('Please speak your 10-digit mobile number clearly.');
        }
        break;
      }
      case 'state': {
        const matched = matchSpokenState(answer);
        if (matched) {
          setState(matched);
          setTimeout(() => runVoiceStep('district'), 1200);
        } else {
          // Keep raw answer or default
          setVoiceError(`Heard "${answer}". Please choose or confirm your state.`);
          setTimeout(() => runVoiceStep('district'), 1500);
        }
        break;
      }
      case 'district': {
        const cleanedDistrict = answer.replace(/[.,!]/g, '').trim();
        setDistrict(cleanedDistrict);
        setTimeout(() => runVoiceStep('lang'), 1200);
        break;
      }
      case 'lang': {
        const matchedLang = matchSpokenLanguage(answer);
        if (matchedLang) {
          setPreferredLang(matchedLang);
        }
        setTimeout(() => runVoiceStep('completed'), 1200);
        break;
      }
      default:
        break;
    }
  };

  const handleStartVoice = () => {
    setVoiceActive(true);
    runVoiceStep('name');
  };

  const handleStopVoice = () => {
    stopSpeaking();
    if (stopListeningRef.current) stopListeningRef.current();
    setIsListening(false);
    setIsSpeaking(false);
    setVoiceActive(false);
    setVoiceStep('idle');
  };

  // Farmer form submit handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name as in land records or Aadhaar.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Mobile number must be exactly 10 digits.');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address, or leave it blank.');
        return;
      }
    }

    if (!district.trim()) {
      setErrorMessage('Please enter your district name.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setIsSubmitting(true);
    const result = authService.register(
      {
        fullName,
        email: email.trim() || undefined,
        mobile: cleanMobile,
        state,
        district,
        village: village.trim() || undefined,
        preferredLanguage: preferredLang
      },
      password
    );
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMessage('Farmer account created successfully! Opening your dashboard...');
      setTimeout(() => {
        onRegisterSuccess(result.user!);
      }, 700);
    } else {
      setErrorMessage(result.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full space-y-6">
        
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
            Create Farmer Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
            Join Kisan Suvidha for personalized welfare scheme recommendations, eligibility assessments, and document roadmaps.
          </p>
        </div>

        {/* VOICE REGISTRATION ASSISTANT BANNER BUTTON */}
        {!voiceActive ? (
          <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all hover:border-emerald-600/50">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Voice-Assisted Registration</span>
              </div>
              <p className="text-xs text-stone-600 leading-snug">
                {vText.voiceSub}
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartVoice}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{vText.voiceBtn}</span>
            </button>
          </div>
        ) : (
          /* ACTIVE INTERACTIVE VOICE ASSISTANT CARD */
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-emerald-500/50 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {vText.modalTitle}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    Step {voiceStep === 'name' ? '1 of 5' : voiceStep === 'mobile' ? '2 of 5' : voiceStep === 'state' ? '3 of 5' : voiceStep === 'district' ? '4 of 5' : voiceStep === 'lang' ? '5 of 5' : 'Complete'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStopVoice}
                className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
                title={vText.stop}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Speaking / Question Display */}
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/60">
                <Volume2 className={`w-5 h-5 text-amber-400 shrink-0 mt-0.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <p className="text-xs sm:text-sm font-medium text-emerald-100 leading-relaxed">
                  {voiceStep === 'name' && vText.step1Prompt}
                  {voiceStep === 'mobile' && vText.step2Prompt}
                  {voiceStep === 'state' && vText.step3Prompt}
                  {voiceStep === 'district' && vText.step4Prompt}
                  {voiceStep === 'lang' && vText.step5Prompt}
                  {voiceStep === 'completed' && vText.completedPrompt}
                </p>
              </div>

              {/* Listening Indicator */}
              {isListening && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-amber-300 animate-pulse bg-emerald-900/40 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>{vText.listening}</span>
                </div>
              )}

              {/* Recognized Answer */}
              {voiceTranscript && (
                <div className="bg-emerald-900/90 p-3 rounded-xl border border-emerald-600/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-300 block text-[11px]">{vText.recognized}</span>
                    <span className="font-bold text-amber-300 text-sm">{voiceTranscript}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              )}

              {/* Voice Error notice */}
              {voiceError && (
                <div className="bg-red-950/80 p-3 rounded-xl border border-red-500/50 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{voiceError}</span>
                </div>
              )}
            </div>

            {/* Voice Assistant Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runVoiceStep(voiceStep)}
                  disabled={isSpeaking || isListening}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>{vText.repeat}</span>
                </button>

                {voiceStep !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceStep === 'name') runVoiceStep('mobile');
                      else if (voiceStep === 'mobile') runVoiceStep('state');
                      else if (voiceStep === 'state') runVoiceStep('district');
                      else if (voiceStep === 'district') runVoiceStep('lang');
                      else if (voiceStep === 'lang') runVoiceStep('completed');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{vText.next}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleStopVoice}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {voiceStep === 'completed' ? vText.done : vText.stop}
              </button>
            </div>

            <p className="text-[11px] text-amber-200/80 italic text-center">
              🔒 {vText.passNotice}
            </p>
          </div>
        )}

        {/* Status Messages */}
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

        {/* Farmer Registration Form */}
        <form onSubmit={handleRegister} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Farmer Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Baliram Patil"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
              required
            />
          </div>

          {/* 2. Mobile Number & 3. Email Address (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mobile Number (10 digits) *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9823456789"
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
              />
            </div>
          </div>

          {/* 6. State, 7. District, and Village */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                State *
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:outline-hidden focus:border-[#14532D]"
              >
                {ALL_INDIAN_STATES_AND_UTS.filter(s => s !== 'All India').map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:outline-hidden focus:border-[#14532D]"
                required
              >
                <option value="">Select district</option>
                {getDistrictsForState(state).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Village / Panchayat (Optional)
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Ghatanji"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
              />
            </div>
          </div>

          {/* 8. Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Preferred Language for Assistance *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreferredLang('en')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  preferredLang === 'en'
                    ? 'border-[#14532D] bg-[#14532D] text-white shadow-xs'
                    : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-[#14532D]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPreferredLang('hi')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  preferredLang === 'hi'
                    ? 'border-[#14532D] bg-[#14532D] text-white shadow-xs'
                    : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-[#14532D]'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setPreferredLang('mr')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  preferredLang === 'mr'
                    ? 'border-[#14532D] bg-[#14532D] text-white shadow-xs'
                    : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-[#14532D]'
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>
          </div>

          {/* 4. Password & 5. Confirm Password (Always Manual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Create Password * (Type manually)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#14532D]"
                required
              />
            </div>
          </div>

          {/* Terms Acceptance */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 leading-snug">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded text-[#14532D] focus:ring-[#14532D] border-stone-300 mt-0.5"
              />
              <span>
                I agree to the Terms of Service & Privacy Policy. My personal farm data is kept strictly confidential and used only for statutory scheme eligibility checks.
              </span>
            </label>
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#0f4022] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Register Farmer Account'}</span>
            </button>
          </div>

          {/* Link to Login */}
          <div className="pt-3 text-center border-t border-stone-100 text-xs text-stone-600">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-[#14532D] hover:underline cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>

        </form>

        <p className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Government of India & State Agriculture Scheme Discovery</span>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
