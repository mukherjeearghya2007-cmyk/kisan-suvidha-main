import { AlertItem } from '../types';

export const verifiedAlerts: AlertItem[] = [
  {
    id: 'alert-pmk-19',
    title: {
      en: 'PM-KISAN: Mandatory e-KYC & Land Seeding Completion Notice',
      hi: 'पीएम-किसान: ई-केवाईसी और लैंड सीडिंग पूरा करने की अनिवार्य सूचना',
      mr: 'पीएम-किसान: ई-केवायसी आणि लँड सीडिंग पूर्ण करण्याची अधिकृत सूचना'
    },
    description: {
      en: 'The Ministry of Agriculture has reiterated that upcoming 19th installment transfers will strictly require active biometric/OTP e-KYC and verified land seeding on the state land records portal. Farmers with unseeded accounts can complete biometric eKYC at their nearest CSC centre or via the PM-KISAN facial recognition app.',
      hi: 'कृषि मंत्रालय ने सूचित किया है कि आगामी 19वीं किस्त का अंतरण केवल उन्हीं किसानों को होगा जिनका ई-केवाईसी और लैंड सीडिंग सत्यापित है। किसान अपने नज़दीकी सीएससी केंद्र या पीएम-किसान फेस ऑथेंटिकेशन ऐप से इसे तुरंत पूरा करें।',
      mr: 'कृषी मंत्रालयाने स्पष्ट केले आहे की आगामी १९ वा हप्ता केवळ ज्यांचे ई-केवायसी आणि लँड सीडिंग पूर्ण आहे अशाच शेतकऱ्यांच्या खात्यात जमा होईल. शेतकऱ्यांनी जवळच्या सीएससी केंद्रात किंवा फेस ॲपद्वारे त्वरित ई-केवायसी पूर्ण करावे.'
    },
    date: '2026-10-25',
    deadline: '2026-11-30',
    type: 'deadline',
    schemeId: 'pm-kisan',
    isUrgent: true,
    verified: true,
    sourceUrl: 'https://pmkisan.gov.in',
    officialReference: 'MoA&FW Gazette Circular Ref: 18-02/2026-DBT'
  },
  {
    id: 'alert-pmfby-rabi',
    title: {
      en: 'PMFBY: Rabi Season Crop Insurance Enrollment Active Window',
      hi: 'पीएमएफबीवाई: रबी सीज़न 2026-27 फसल बीमा नामांकन विंडो प्रारंभ',
      mr: 'पीएमएफबीवाय: रब्बी हंगाम २०२६-२७ पीक विमा नोंदणी सुरू'
    },
    description: {
      en: 'Enrollment for Rabi crops (Wheat, Gram, Mustard, Barley) is now active across notified clusters. Non-loanee farmers can enroll through the PMFBY portal or their local Common Service Center (CSC) with sowing declarations before the state-wise closing date of December 31.',
      hi: 'अधिसूचित क्षेत्रों में रबी फसलों (गेहूं, चना, सरसों, जौ) के लिए फसल बीमा नामांकन शुरू हो चुका है। गैर-ऋणी किसान 31 दिसंबर की राज्यवार अंतिम तारीख से पहले सीएससी या पोर्टल से पंजीकरण करा सकते हैं।',
      mr: 'रब्बी पिकांसाठी (गहू, हरभरा, मोहरी) पीक विमा नोंदणी सुरू झाली आहे. ३१ डिसेंबर पूर्वी शेतकऱ्यांनी सीएससी किंवा पोर्टलवरून पेरणी प्रमाणपत्रासह नोंदणी करावी.'
    },
    date: '2026-10-20',
    deadline: '2026-12-31',
    type: 'deadline',
    schemeId: 'pmfby',
    isUrgent: true,
    verified: true,
    sourceUrl: 'https://pmfby.gov.in',
    officialReference: 'PMFBY Operational Guidelines Notif: 13015/02/2026-Credit-II'
  },
  {
    id: 'alert-kusum-b',
    title: {
      en: 'PM-KUSUM Component B: New Online Application Allotment Opened',
      hi: 'पीएम-कुसुम कंपोनेंट बी: नए सोलर कृषि पंप आवेदन पोर्टल खुले',
      mr: 'पीएम-कुसुम घटक ब: नवीन सौर कृषी पंप अर्ज वाटप सुरू'
    },
    description: {
      en: 'State nodal agencies (including MEDA Maharashtra and UPNEDA Uttar Pradesh) have opened new quota allocations for 3 HP, 5 HP and 7.5 HP standalone solar water pumps for non-electrified agricultural fields under 60% combined subsidy.',
      hi: 'राज्य नवीकरणीय ऊर्जा निगमों ने गैर-विद्युतीकृत कृषि खेतों के लिए 60% सब्सिडी पर 3, 5 और 7.5 एचपी सोलर पंपों के नए आवेदन स्वीकार करना शुरू कर दिया है।',
      mr: 'वीज जोडणी नसलेल्या शेतांसाठी ६०% अनुदानावर ३, ५ आणि ७.५ एचपी सौर पंपांचे नवीन अर्ज महावितरण व महाऊर्जा पोर्टलवर सुरू झाले आहेत.'
    },
    date: '2026-10-18',
    deadline: '2026-12-15',
    type: 'announcement',
    schemeId: 'pm-kusum',
    isUrgent: false,
    verified: true,
    sourceUrl: 'https://pmkusum.mnre.gov.in',
    officialReference: 'MNRE Solar Agriculture Pump Allocation Circular: 32/28/2026-SPV'
  },
  {
    id: 'alert-kcc-sat',
    title: {
      en: 'RBI & NABARD: Nationwide Special Kisan Credit Card Saturation Drive',
      hi: 'आरबीआई एवं नाबार्ड: देशव्यापी विशेष केसीसी संतृप्ति अभियान जारी',
      mr: 'नाबार्ड व आरबीआय: देशव्यापी विशेष केसीसी मोहीम'
    },
    description: {
      en: 'Rural bank branches have been instructed to conduct weekly camps on Tuesdays to process pending Kisan Credit Card applications within 14 working days without collateral requirement up to ₹1.6 lakh.',
      hi: 'ग्रामीण बैंक शाखाओं को निर्देश दिए गए हैं कि वे हर मंगलवार को विशेष शिविर लगाकर लंबित केसीसी आवेदनों को 14 कार्य दिवसों में निपटाएं। ₹1.6 लाख तक किसी बंधक की आवश्यकता नहीं।',
      mr: 'ग्रामीण बँकांना दर मंगळवारी शिबिर लावून १४ दिवसांत केसीसी अर्ज मंजूर करण्याचे आदेश देण्यात आले आहेत. ₹१.६ लाखांपर्यंत तारणमुक्त कर्ज उपलब्ध.'
    },
    date: '2026-10-12',
    type: 'scheme_update',
    schemeId: 'kcc',
    isUrgent: false,
    verified: true,
    sourceUrl: 'https://www.nabard.org',
    officialReference: 'NABARD Rural Credit Directive Ref: NB.DoR-GBS/412/2026'
  },
  {
    id: 'alert-namo-4',
    title: {
      en: 'Maharashtra: Namo Shetkari Mahasanman Nidhi Installment Release Schedule',
      hi: 'महाराष्ट्र: नमो शेतकरी महासंमान निधि किस्त अंतरण कैलेंडर',
      mr: 'महाराष्ट्र: नमो शेतकरी महासन्मान निधी हप्ता जमा वेळापत्रक'
    },
    description: {
      en: 'The Maharashtra Agriculture Department has announced the disbursement of the state supplementary ₹2,000 installment alongside the central PM-KISAN cycle to over 90 lakh verified state farmers.',
      hi: 'महाराष्ट्र कृषि विभाग ने 90 लाख से अधिक पात्र किसानों के खातों में राज्य के ₹2,000 की पूरक किस्त सीधे डीबीटी द्वारा भेजने का आदेश जारी किया है।',
      mr: 'महाराष्ट्र कृषी विभागाने राज्यातील ९० लाखांहून अधिक पात्र शेतकऱ्यांच्या खात्यात ₹२,००० चा पूरक हप्ता डीबीटी द्वारे वर्ग करण्याचे जाहीर केले आहे.'
    },
    date: '2026-10-08',
    type: 'scheme_update',
    schemeId: 'namo-shetkari',
    isUrgent: false,
    verified: true,
    sourceUrl: 'https://krishi.maharashtra.gov.in',
    officialReference: 'Maharashtra Govt Resolution: कृयो-२०२६/प्र.क्र.८५/११-अ'
  }
];
