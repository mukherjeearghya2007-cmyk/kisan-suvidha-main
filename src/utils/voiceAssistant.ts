import { Language } from '../types';
import { ALL_INDIAN_STATES_AND_UTS } from './schemeService';

// Browser speech recognition interface declaration
interface IWindowSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindowSpeech;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
};

// Map application language to speech BCP 47 language tag
export const getSpeechLanguageCode = (lang: Language): string => {
  switch (lang) {
    case 'hi':
      return 'hi-IN';
    case 'mr':
      return 'mr-IN';
    case 'en':
    default:
      return 'en-IN';
  }
};

/**
 * Speaks text aloud in the specified language using the browser's native SpeechSynthesis.
 * Returns a cancel function to stop speech immediately.
 */
export const speakText = (
  text: string,
  lang: Language,
  onEnd?: () => void,
  onError?: (err: any) => void
): (() => void) => {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return () => {};
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLanguageCode(lang);
    utterance.rate = 0.95; // Slightly slower for maximum clarity for rural farmers
    utterance.pitch = 1.0;

    // Pick a natural voice for the language if available
    const voices = window.speechSynthesis.getVoices();
    const langCode = utterance.lang.toLowerCase();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      // Don't treat user-cancelled speech as an error
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        onError?.(e);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  } catch (err) {
    onError?.(err);
    onEnd?.();
    return () => {};
  }
};

export const stopSpeaking = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

export interface ListenOptions {
  language: Language;
  onResult: (transcript: string) => void;
  onError: (errorType: 'SPEECH_NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'NO_SPEECH' | 'UNKNOWN', message?: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Listens to farmer's voice input once using browser SpeechRecognition.
 * Returns an abort/stop function.
 */
export const listenOnce = ({
  language,
  onResult,
  onError,
  onStart,
  onEnd
}: ListenOptions): (() => void) => {
  if (!isSpeechRecognitionSupported()) {
    onError('SPEECH_NOT_SUPPORTED', 'Speech recognition is not supported in this browser. Please type your details manually.');
    return () => {};
  }

  const win = window as unknown as IWindowSpeech;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

  let recognition: any;
  try {
    recognition = new SpeechRecognitionClass();
  } catch (e) {
    onError('SPEECH_NOT_SUPPORTED', 'Failed to initialize speech recognition.');
    return () => {};
  }

  recognition.lang = getSpeechLanguageCode(language);
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let hasDeliveredResult = false;

  recognition.onstart = () => {
    onStart?.();
  };

  recognition.onresult = (event: any) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        hasDeliveredResult = true;
        onResult(transcript.trim());
      }
    }
  };

  recognition.onerror = (event: any) => {
    const err = event.error;
    if (err === 'not-allowed' || err === 'service-not-allowed') {
      onError('PERMISSION_DENIED', 'Microphone permission was denied. Please allow microphone access in your browser settings or fill fields manually.');
    } else if (err === 'no-speech') {
      onError('NO_SPEECH', 'No speech was detected. Please try speaking again or type your answer.');
    } else if (err === 'aborted') {
      // Ignored - triggered when user manually stops
    } else {
      onError('UNKNOWN', event.message || `Voice recognition error: ${err}`);
    }
  };

  recognition.onend = () => {
    if (!hasDeliveredResult) {
      // Completed without result
    }
    onEnd?.();
  };

  try {
    recognition.start();
  } catch (err) {
    onError('UNKNOWN', 'Could not start voice recognition.');
    return () => {};
  }

  return () => {
    try {
      recognition.abort();
    } catch (e) {}
  };
};

/**
 * Extracts a 10-digit mobile number from spoken transcript.
 * Converts written number words (e.g., "nine eight", "सात आठ") to digits if needed.
 */
export const extractMobileNumber = (transcript: string): string => {
  // First check if there are direct digits
  const directDigits = transcript.replace(/\D/g, '');
  if (directDigits.length >= 10) {
    return directDigits.slice(-10); // Last 10 digits
  }

  // Word-to-digit conversion dictionary for English and Hindi/Marathi
  const wordToDigitMap: Record<string, string> = {
    // English
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    // Hindi
    'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
    'पांच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
    // Marathi
    'दोन': '2', 'पाच': '5', 'सहा': '6'
  };

  const words = transcript.toLowerCase().split(/[\s,.-]+/);
  let converted = '';

  for (const w of words) {
    if (/^\d+$/.test(w)) {
      converted += w;
    } else if (wordToDigitMap[w]) {
      converted += wordToDigitMap[w];
    }
  }

  const clean = converted.replace(/\D/g, '');
  return clean.length >= 10 ? clean.slice(-10) : clean;
};

/**
 * Matches a spoken state name with ALL_INDIAN_STATES_AND_UTS.
 */
export const matchSpokenState = (spoken: string): string | null => {
  const normalized = spoken.trim().toLowerCase();

  // Direct exact match
  const found = ALL_INDIAN_STATES_AND_UTS.find(s => s.toLowerCase() === normalized);
  if (found) return found;

  // Common Hindi/Marathi state pronunciations
  const aliasMap: Record<string, string> = {
    'महाराष्ट्र': 'Maharashtra',
    'उत्तर प्रदेश': 'Uttar Pradesh',
    'यूपी': 'Uttar Pradesh',
    'up': 'Uttar Pradesh',
    'मध्य प्रदेश': 'Madhya Pradesh',
    'एमपी': 'Madhya Pradesh',
    'mp': 'Madhya Pradesh',
    'राजस्थान': 'Rajasthan',
    'पंजाब': 'Punjab',
    'गुजरात': 'Gujarat',
    'हरियाणा': 'Haryana',
    'बिहार': 'Bihar',
    'कर्नाटक': 'Karnataka',
    'तमिलनाडु': 'Tamil Nadu',
    'पश्चिम बंगाल': 'West Bengal',
    'बंगाल': 'West Bengal',
    'ओडिशा': 'Odisha',
    'उड़ीसा': 'Odisha',
    'आंध्र': 'Andhra Pradesh',
    'आंध्र प्रदेश': 'Andhra Pradesh',
    'तेलंगाना': 'Telangana',
    'असम': 'Assam',
    'केरल': 'Kerala',
    'झारखंड': 'Jharkhand',
    'छत्तीसगढ़': 'Chhattisgarh',
    'उत्तराखंड': 'Uttarakhand',
    'हिमाचल': 'Himachal Pradesh'
  };

  for (const [alias, stateName] of Object.entries(aliasMap)) {
    if (normalized.includes(alias.toLowerCase())) {
      return stateName;
    }
  }

  // Partial match in official list
  const partial = ALL_INDIAN_STATES_AND_UTS.find(s => 
    s !== 'All India' && (normalized.includes(s.toLowerCase()) || s.toLowerCase().includes(normalized))
  );

  return partial || null;
};

/**
 * Matches spoken preferred language.
 */
export const matchSpokenLanguage = (spoken: string): Language | null => {
  const lower = spoken.toLowerCase();
  if (lower.includes('hindi') || lower.includes('हिंदी') || lower.includes('हिन्दी')) {
    return 'hi';
  }
  if (lower.includes('marathi') || lower.includes('मराठी')) {
    return 'mr';
  }
  if (lower.includes('english') || lower.includes('अंग्रेजी') || lower.includes('इंग्रजी')) {
    return 'en';
  }
  return null;
};
