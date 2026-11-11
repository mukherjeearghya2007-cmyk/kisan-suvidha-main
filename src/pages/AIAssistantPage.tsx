import React, { useState, useEffect, useRef } from 'react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../translations';
import { queryFarmerAssistant, ChatMessage } from '../utils/aiKnowledgeBase';
import { kisanApi } from '../services/kisanApi';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  User,
  Bot,
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface AIAssistantPageProps {
  language: Language;
  activeFarmer: FarmerProfile;
  onNavigateToScheme?: (schemeId: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  language,
  activeFarmer,
  onNavigateToScheme
}) => {
  const t = translations[language];
  const [sessionId, setSessionId] = useState<string>(() => `kisan-session-${Date.now()}`);

  // Initial welcome message in native language
  const initialMessages: Record<Language, ChatMessage[]> = {
    en: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `Namaste ${activeFarmer.name || 'Farmer'}! I am your Kisan Suvidha AI Assistant. I operate through controlled backend tools connected directly to our government welfare database. I can check statutory eligibility, look up mandatory paperwork (like 7/12, eKYC), and provide verified scheme guidance in English, Hindi, or Marathi. How can I assist your farm today?`,
        timestamp: 'Just now',
        agentMode: 'Government Database Connected'
      }
    ],
    hi: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `नमस्ते ${activeFarmer.name || 'किसान'} जी! मैं आपका किसान सुविधा एआई सहायक हूँ जो सीधे सरकारी डेटाबेस और वैधानिक नियमों से जुड़ा हुआ है। मैं योजनाओं की पात्रता, आवश्यक कागजातों (जैसे खसरा-खतौनी, ई-केवाईसी) और सरकारी प्रक्रियाओं की सत्यापित जानकारी देता हूँ। आप बोलकर या लिखकर सवाल पूछ सकते हैं।`,
        timestamp: 'अभी',
        agentMode: 'सरकारी डेटाबेस से कनेक्टेड'
      }
    ],
    mr: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `नमस्कार ${activeFarmer.name || 'शेतकरी'} जी! मी आपला किसान सुविधा एआई सहाय्यक आहे. मी थेट अधिकृत सरकारी डेटाबेस व नियमांशी जोडलेला आहे. मी आपल्याला कृषी योजना, आवश्यक कागदपत्रे (उदा. ७/१२, ई-केवायसी), पात्रता अटी आणि अर्ज प्रक्रियेबद्दल अधिकृत माहिती देतो. आपण बोलून किंवा टाईप करून प्रश्न विचारू शकता.`,
        timestamp: 'आत्ता',
        agentMode: 'अधिकृत डेटाबेसशी जोडलेले'
      }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages[language]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in 3 languages
  const suggestedQuestions: Record<Language, string[]> = {
    en: [
      'What documents are needed for PM-KISAN registration?',
      'Can tenant or sharecropper farmers get crop insurance in PMFBY?',
      'How much subsidy is available for solar water pumps under PM-KUSUM?',
      'What is the interest rate and limit for Kisan Credit Card (KCC)?',
      'What additional subsidy does Maharashtra provide under Namo Shetkari?'
    ],
    hi: [
      'पीएम-किसान में नए पंजीकरण के लिए कौन से दस्तावेज़ चाहिए?',
      'क्या बटाईदार किसान भी प्रधानमंत्री फसल बीमा योजना का लाभ ले सकते हैं?',
      'पीएम-कुसुम योजना में सोलर पंप पर कितनी सरकारी सब्सिडी मिलती है?',
      'किसान क्रेडिट कार्ड (KCC) पर ब्याज दर और ऋण सीमा कितनी है?',
      'महाराष्ट्र में नमो शेतकरी महासंमान योजना के तहत कितने रुपये मिलते हैं?'
    ],
    mr: [
      'पीएम-किसान योजनेसाठी कोणती कागदपत्रे आवश्यक आहेत?',
      'भाडेकरू किंवा कुळ शेतकऱ्यांना पीक विम्याचा लाभ मिळतो का?',
      'पीएम-कुसुम योजनेतून सौर कृषी पंपावर किती अनुदान मिळते?',
      'किसान क्रेडिट कार्डवर (KCC) किती टक्के व्याजदराने कर्ज मिळते?',
      'महाराष्ट्रात नमो शेतकरी महासन्मान निधी योजनेचे किती पैसे मिळतात?'
    ]
  };

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle send user query to backend AI Agent with controlled tools
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const agentResult = await kisanApi.aiAgent.chat(query, {
        language,
        activeFarmer,
        sessionId
      });

      if (agentResult.sessionId) {
        setSessionId(agentResult.sessionId);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: agentResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceSchemeId: agentResult.sources?.[0],
        toolsInvoked: agentResult.toolsInvoked,
        agentMode: agentResult.agentMode
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const localResult = queryFarmerAssistant(query, language, activeFarmer);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: localResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceSchemeId: localResult.sourceSchemeId,
        officialUrl: localResult.officialUrl,
        agentMode: 'Offline Verified Knowledge Retrieval'
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Speech Recognition Handling (Microphone input)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.ai.micNotSupported);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Text to Speech (Read Aloud)
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const clearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages(initialMessages[language]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Multilingual Voice & Text Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.ai.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.ai.subtitle}
          </p>
        </div>

        <button
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.ai.clearChat}</span>
        </button>
      </div>

      {/* Verified Scheme Disclaimer Banner */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold mb-0.5">Zero AI Hallucination Policy:</p>
          <p>{t.ai.disclaimer}</p>
        </div>
      </div>

      {/* Main Chat Viewport */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-[#14532D] text-white' : 'bg-emerald-100 text-[#14532D]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-[#14532D] text-white rounded-tr-xs'
                    : 'bg-stone-50 text-stone-800 border border-stone-200/90 rounded-tl-xs shadow-2xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Actions for Assistant Bubble */}
                  {!isUser && (
                    <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14532D] hover:underline cursor-pointer"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? t.ai.stopSpeaking : t.ai.readAloud}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {msg.sourceSchemeId && onNavigateToScheme && (
                          <button
                            onClick={() => onNavigateToScheme(msg.sourceSchemeId!)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                          >
                            <span>View Scheme Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}

                        {msg.officialUrl && (
                          <a
                            href={msg.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-sm items-center text-xs text-stone-500 italic">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <p>{t.ai.typing}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Strip */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-500 shrink-0 uppercase tracking-wider pl-1">
            Suggested:
          </span>
          {suggestedQuestions[language].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 text-xs bg-white hover:bg-stone-100 rounded-lg border border-stone-200 text-stone-700 transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Voice and Text Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
          
          {/* Microphone Voice Button */}
          <button
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Input (Microphone)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#14532D]" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={isListening ? t.ai.listening : t.ai.inputPlaceholder}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-xs sm:text-sm text-stone-800 bg-stone-50/60"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3 bg-[#14532D] hover:bg-[#0f4022] disabled:opacity-40 disabled:hover:bg-[#14532D] text-white rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
};
