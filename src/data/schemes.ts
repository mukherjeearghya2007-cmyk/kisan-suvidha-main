import { Scheme } from '../types';

export const verifiedSchemes: Scheme[] = [
  // 1. PM-KISAN (Income Support - Central)
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    alternativeNames: ['PM KISAN', 'Kisan Samman Nidhi'],
    localNames: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
      mr: 'पीएम-किसान (प्रधानमंत्री किसान सन्मान निधी)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Welfare, Ministry of Agriculture',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      mr: 'कृषी आणि शेतकरी कल्याण विभाग, भारत सरकार'
    },
    category: 'Income Support & Direct Assistance',
    subcategory: 'Direct Benefit Transfer (DBT)',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops', 'Cereals', 'Pulses', 'Oilseeds', 'Cotton', 'Horticulture'],
    targetBeneficiaries: ['Small and marginal landowners', 'All landowning farmer families'],
    applicableActivities: ['agri_business', 'horticulture'],
    benefitsAmount: '₹6,000 / year (3 installments)',
    benefits: {
      en: 'Direct Income Support of ₹6,000 annually, transferred directly via DBT into the verified bank account of the beneficiary farmer family in three equal installments of ₹2,000 each.',
      hi: 'वार्षिक ₹6,000 की सीधी आय सहायता, जो लाभार्थी किसान परिवार के बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) द्वारा ₹2,000 की तीन समान किस्तों में सीधे भेजी जाती है।',
      mr: 'वार्षिक ₹६,००० चे थेट उत्पन्न सहाय्य, जे पात्र शेतकरी कुटुंबाच्या बँक खात्यात थेट लाभ हस्तांतरणाद्वारे (DBT) ₹२,००० च्या तीन समान हप्त्यांमध्ये जमा केले जाते.'
    },
    description: {
      en: 'Flagship Central Sector Scheme providing supplemental income support to all landholding farmer families with cultivable land.',
      hi: 'खेती योग्य ज़मीन वाले सभी ज़मीन मालिक किसान परिवारों को पूरक आय सहायता प्रदान करने वाली प्रमुख केंद्रीय योजना।',
      mr: 'लागवडयोग्य जमीन असलेल्या सर्व जमीनधारक शेतकरी कुटुंबांना आर्थिक मदत देणारी केंद्र सरकारची प्रमुख योजना.'
    },
    eligibilityOverview: {
      en: 'Cultivable land ownership registered in state revenue records; Aadhaar-seeded bank account with DBT enabled; Farmer family must not fall under institutional or income tax exclusion categories.',
      hi: 'राज्य राजस्व रिकॉर्ड में पंजीकृत कृषि योग्य ज़मीन; आधार से जुड़ा डीबीटी बैंक खाता; परिवार संस्थागत या आयकर दाता अपवर्जन श्रेणी में न आता हो।',
      mr: 'महसूल नोंदींमध्ये स्वतःच्या नावावर शेतजमीन; आधार लिंक बँक खाते; आयकर दाता किंवा संस्थागत अपवर्जन नियमात नसावे.'
    },
    rules: [
      {
        id: 'pmk-rule-1',
        conditionNumber: 8,
        conditionName: 'Land Ownership Status',
        field: 'landOwnership',
        label: {
          en: 'Must be a legal landowner of cultivable farm land',
          hi: 'कृषि योग्य भूमि का कानूनी मालिकाना हक होना चाहिए',
          mr: 'लागवडयोग्य शेतजमिनीचा कायदेशीर मालक असणे आवश्यक'
        },
        operator: 'in',
        expectedValue: ['owner'],
        isMandatory: true,
        explanation: {
          en: 'Scheme benefits are restricted to cultivator families with ownership rights over land in revenue records.',
          hi: 'योजना का लाभ केवल उन्हीं कृषक परिवारों को मिलता है जिनके नाम राजस्व रिकॉर्ड में ज़मीन दर्ज है।',
          mr: 'योजनेचा लाभ केवळ ज्यांच्या नावावर महसूल नोंदीत शेतजमीन आहे अशाच शेतकरी कुटुंबांना मिळतो.'
        },
        failureReason: {
          en: 'Tenant, sharecropper, or oral lessee farmers without land title are not currently eligible under PM-KISAN central guidelines.',
          hi: 'बिना मालिकाना हक वाले बटाईदार या पट्टेदार किसान पीएम-किसान के तहत पात्र नहीं हैं।',
          mr: 'जमीन नावावर नसलेले कुळ किंवा भाडेकरू शेतकरी पीएम-किसान अंतर्गत पात्र नाहीत.'
        },
        remedyStep: {
          en: 'If you cultivate leased land, explore state tenant assistance schemes or KCC for operational credit.',
          hi: 'यदि आप पट्टे की ज़मीन पर खेती करते हैं, तो केसीसी या राज्य बटाईदार सहायता योजनाओं की जांच करें।',
          mr: 'तुम्ही भाडेतत्त्वावर शेती करत असल्यास केसीसी किंवा राज्य योजनांचा लाभ घ्या.'
        }
      },
      {
        id: 'pmk-rule-2',
        conditionNumber: 24,
        conditionName: 'Income Tax Payee Exclusion',
        field: 'isIncomeTaxPayee',
        label: {
          en: 'Must NOT be an Income Tax Payee in previous assessment year',
          hi: 'पिछले कर निर्धारण वर्ष में आयकर दाता (Income Tax Payee) नहीं होना चाहिए',
          mr: 'मागील मूल्यांकन वर्षात आयकर भरणारा (Income Tax Payee) नसावा'
        },
        operator: 'is_false',
        expectedValue: false,
        isMandatory: true,
        isExclusion: true,
        explanation: {
          en: 'All persons who paid income tax in the last assessment year are excluded from PM-KISAN benefits.',
          hi: 'गत वर्ष में आयकर का भुगतान करने वाले सभी व्यक्ति पीएम-किसान लाभ से बाहर हैं।',
          mr: 'मागील वर्षात आयकर भरलेल्या व्यक्तींना पीएम-किसान योजनेतून वगळण्यात आले आहे.'
        },
        failureReason: {
          en: 'Income tax payees are legally excluded under Section 3 of PM-KISAN Operational Guidelines.',
          hi: 'आयकर देने वाले नागरिक पीएम-किसान नियमावली के खंड 3 के तहत अपात्र हैं।',
          mr: 'आयकर भरणाऱ्या नागरिकांना नियमानुसार अपात्र ठरवले जाते.'
        }
      },
      {
        id: 'pmk-rule-4',
        conditionNumber: 20,
        conditionName: 'Aadhaar-Linked Bank DBT',
        field: 'hasAadhaarLinkedBankDBT',
        label: {
          en: 'Bank account must be seeded with Aadhaar and enabled for NPCI DBT',
          hi: 'बैंक खाता आधार से जुड़ा होना चाहिए और एनपीसीआई डीबीटी सक्रिय होना चाहिए',
          mr: 'बँक खाते आधारशी संलग्न आणि एनपीसीआय डीबीटी साठी सक्रिय असावे'
        },
        operator: 'is_true',
        expectedValue: true,
        isMandatory: true,
        explanation: {
          en: 'Installments are only released via Aadhaar-based payment system (ABPS) to the NPCI-mapped account.',
          hi: 'किस्त केवल आधार आधारित भुगतान प्रणाली (ABPS) के माध्यम से एनपीसीआई लिंक खाते में आती है।',
          mr: 'हप्त्याची रक्कम केवळ आधार आधारित पेमेंट प्रणालीद्वारे एनपीसीआय खात्यात वर्ग होते.'
        },
        failureReason: {
          en: 'Account is not linked with Aadhaar or DBT is inactive, which blocks payment transmission.',
          hi: 'खाता आधार से लिंक नहीं है या डीबीटी निष्क्रिय है, जिससे किस्त रुक जाएगी।',
          mr: 'बँक खाते आधारशी लिंक नसल्याने हप्ता जमा होणार नाही.'
        }
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-aadhaar',
        name: { en: 'Aadhaar Card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
        isMandatory: true,
        description: { en: 'Biometric identity proof for eKYC authentication on the PM-KISAN portal.', hi: 'ई-केवाईसी सत्यापन के लिए पहचान पत्र।', mr: 'ई-केवायसी पडताळणीसाठी ओळखपत्र.' },
        issuingAuthority: { en: 'UIDAI', hi: 'यूआईडीएआई (UIDAI)', mr: 'यूआयडीएआय (UIDAI)' },
        helpTip: { en: 'Ensure mobile number is linked to your Aadhaar for OTP verification.', hi: 'ओटीपी सत्यापन के लिए आधार में मोबाइल नंबर जुड़ा होना सुनिश्चित करें।', mr: 'ओटीपी साठी आधारशी मोबाईल क्रमांक जोडलेला असल्याची खात्री करा.' }
      },
      {
        id: 'doc-land',
        name: { en: 'Land Ownership Record (7/12 / Khasra-Khatauni / RoR)', hi: 'भूमि स्वामित्व दस्तावेज़ (खसरा-खतौनी / 7-12)', mr: 'जमीन मालकी उतारा (७/१२ व ८-अ)' },
        isMandatory: true,
        description: { en: 'Official revenue document showing survey number and ownership area.', hi: 'सर्वे नंबर और भूमि क्षेत्रफल दर्शाने वाला आधिकारिक राजस्व दस्तावेज़।', mr: 'गट क्रमांक आणि क्षेत्र दर्शवणारा अधिकृत महसूल उतारा.' },
        issuingAuthority: { en: 'State Revenue Department', hi: 'राज्य राजस्व विभाग', mr: 'महसूल विभाग' },
        helpTip: { en: 'Ensure your name matches the spelling on your Aadhaar card.', hi: 'सुनिश्चित करें कि नाम की स्पेलिंग आधार कार्ड से मेल खाती हो।', mr: 'उताऱ्यावरील नाव आणि आधार कार्डावरील नाव जुळत असल्याची खात्री करा.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Open official PM-KISAN portal (pmkisan.gov.in) and click "New Farmer Registration".', hi: 'चरण 1: आधिकारिक पीएम-किसान पोर्टल (pmkisan.gov.in) खोलें।', mr: 'पायरी १: अधिकृत पीएम-किसान संकेतस्थळ (pmkisan.gov.in) उघडा.' },
      { en: 'Step 2: Enter Aadhaar number, state, and mobile number to complete eKYC OTP verification.', hi: 'चरण 2: आधार नंबर और मोबाइल नंबर दर्ज करें और ओटीपी सत्यापित करें।', mr: 'पायरी २: आधार व मोबाईल क्रमांक प्रविष्ट करून ओटीपी सत्यापित करा.' },
      { en: 'Step 3: Enter land survey numbers and upload PDF copy of 7/12 or RoR (<200KB).', hi: 'चरण 3: भूमि खाता/खसरा नंबर भरें और 7/12 अपलोड करें।', mr: 'पायरी ३: गट क्रमांक भरा आणि ७/१२ प्रत अपलोड करा.' }
    ],
    officialUrl: 'https://pmkisan.gov.in',
    sourceUrl: 'https://pmkisan.gov.in/Documents/RevisedGuidelines.pdf',
    lastVerifiedDate: '2026-11-01',
    applicationPeriod: 'Open 365 Days a Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '155261 / 011-24300606',
    badge: 'Flagship Central Welfare'
  },

  // 2. PMFBY (Crop Insurance - Central)
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    alternativeNames: ['PM Fasal Bima', 'Crop Insurance Scheme'],
    localNames: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      hi: 'पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)',
      mr: 'पीएमएफबीवाय (प्रधानमंत्री पीक विमा योजना)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Welfare, GoI',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      mr: 'कृषी आणि शेतकरी कल्याण विभाग, भारत सरकार'
    },
    category: 'Crop Insurance & Risk Protection',
    subcategory: 'Multi-Peril Crop Insurance',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Food crops (Cereals, Millets, Pulses)', 'Oilseeds', 'Commercial & Horticultural Crops'],
    targetBeneficiaries: ['Loanee and non-loanee farmers', 'Tenant and sharecropper cultivators'],
    applicableActivities: ['horticulture', 'agri_business'],
    benefitsAmount: 'Up to 100% Insured Sum for Crop Loss',
    benefits: {
      en: 'Comprehensive risk insurance against drought, flood, pests, and unseasonal rainfall. Minimal farmer premium: 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.',
      hi: 'सूखा, बाढ़, कीट प्रकोप और बेमौसम बारिश से फसल सुरक्षा। खरीफ के लिए 2%, रबी के लिए 1.5% और बागवानी फसलों के लिए 5% प्रीमियम।',
      mr: 'नैसर्गिक आपत्तींपासून संपूर्ण पीक संरक्षण. खरीप पिकांसाठी २%, रब्बीसाठी १.५% आणि बागायती पिकांसाठी ५% विमा हप्ता.'
    },
    description: {
      en: 'Comprehensive national crop insurance safety net covering all stages from prevented sowing to post-harvest losses.',
      hi: 'बुवाई न हो पाने से लेकर कटाई के बाद के नुकसान तक, स्थानीय प्राकृतिक आपदाओं से किसानों को सुरक्षा देने वाला राष्ट्रीय फसल बीमा।',
      mr: 'पेरणीपासून काढणीपश्चात नुकसानापर्यंत नैसर्गिक आपत्तींपासून संरक्षण देणारे राष्ट्रीय पीक विमा कवच.'
    },
    eligibilityOverview: {
      en: 'Open to all farmers including sharecroppers and tenant farmers growing notified crops in notified insurance areas.',
      hi: 'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसानों (बटाईदार और किरायेदार सहित) के लिए खुला है।',
      mr: 'अधिसूचित क्षेत्रात अधिसूचित पिके घेणाऱ्या सर्व शेतकऱ्यांसाठी (कुळ व भाडेकरूंसह) खुले.'
    },
    rules: [
      {
        id: 'pmfby-rule-1',
        conditionNumber: 10,
        conditionName: 'Notified Crop Coverage',
        field: 'cropType',
        label: { en: 'Must cultivate a notified agricultural crop', hi: 'अधिसूचित कृषि फसल होनी चाहिए', mr: 'मान्यताप्राप्त पीक लागवड असावी' },
        operator: 'neq',
        expectedValue: [],
        isMandatory: true,
        explanation: { en: 'Covers notified crops published for the active season.', hi: 'सक्रिय मौसम की अधिसूचित फसलों पर लागू होता है।', mr: 'चालू हंगामातील अधिसूचित पिकांवर लागू होते.' },
        failureReason: { en: 'No active crops selected in farm profile.', hi: 'प्रोफ़ाइल में कोई फसल नहीं चुनी गई।', mr: 'कोणतेही पीक निवडलेले नाही.' }
      },
      {
        id: 'pmfby-rule-2',
        conditionNumber: 9,
        conditionName: 'Tenants & Owner Cultivators Allowed',
        field: 'landOwnership',
        label: { en: 'Owners, tenants and sharecroppers are all eligible', hi: 'ज़मीन मालिक, बटाईदार और किरायेदार सभी पात्र हैं', mr: 'जमीन मालक, कुळ व भाडेकरू सर्व पात्र आहेत' },
        operator: 'in',
        expectedValue: ['owner', 'tenant', 'sharecropper', 'oral_lessee'],
        isMandatory: true,
        explanation: { en: 'Tenant farmers with sowing declarations are covered.', hi: 'बुवाई घोषणा के साथ किरायेदार किसान भी कवर होते हैं।', mr: 'पेरा प्रमाणपत्रासह भाडेकरू शेतकरीही पात्र आहेत.' },
        failureReason: { en: 'Must be actively cultivating land.', hi: 'सक्रिय खेती का काम होना आवश्यक है।', mr: 'प्रत्यक्ष शेती असणे आवश्यक.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pmfby-doc-1',
        name: { en: 'Sowing Certificate / e-Pik Pahani', hi: 'बुवाई प्रमाणपत्र / ई-पीक पाहणी', mr: 'पेरा प्रमाणपत्र / ई-पीक पाहणी' },
        isMandatory: true,
        description: { en: 'Certifying crop sown in the active season.', hi: 'चालू मौसम में बोई गई फसल का प्रमाण।', mr: 'चालू हंगामात पेरलेल्या पिकाचा अधिकृत दाखला.' },
        issuingAuthority: { en: 'Talathi / Krishi Sahayak', hi: 'पटवारी / कृषि सहायक', mr: 'तलाठी / कृषी सहाय्यक' },
        helpTip: { en: 'In Maharashtra, digital e-Pik Pahani on 7/12 is valid proof.', hi: 'महाराष्ट्र में 7/12 पर ई-पीक पाहणी मान्य है।', mr: 'महाराष्ट्रात ७/१२ वरील ई-पीक पाहणी नोंद ग्राह्य धरली जाते.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Visit pmfby.gov.in or local CSC center before the seasonal cut-off date.', hi: 'चरण 1: सीज़न की अंतिम तारीख से पहले pmfby.gov.in पर जाएं।', mr: 'पायरी १: मुदतीपूर्वी pmfby.gov.in किंवा सीएससी केंद्रावर जा.' },
      { en: 'Step 2: Enter crop details, survey number, and pay subsidized farmer share premium.', hi: 'चरण 2: फसल का विवरण भरें और किसान अंश प्रीमियम जमा करें।', mr: 'पायरी २: पिकाचा तपशील भरा आणि शेतकरी हप्ता जमा करा.' }
    ],
    officialUrl: 'https://pmfby.gov.in',
    sourceUrl: 'https://pmfby.gov.in/guidelines',
    lastVerifiedDate: '2026-11-02',
    applicationPeriod: 'Seasonal: Kharif (till 31 July) / Rabi (till 31 Dec)',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '14447 (Toll-Free PMFBY Helpline)',
    badge: 'National Risk Shield'
  },

  // 3. PM-KUSUM Component B (Solar Pumps - Central/State)
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM Component B (Standalone Solar Agriculture Pumps)',
    alternativeNames: ['KUSUM Solar Pump Scheme', 'Solar Krishi Pump'],
    localNames: {
      en: 'PM-KUSUM Component B (Standalone Solar Agriculture Pumps)',
      hi: 'पीएम-कुसुम कंपोनेंट बी (सोलर कृषि पंप योजना)',
      mr: 'पीएम-कुसुम घटक ब (सौर कृषी पंप योजना)'
    },
    department: {
      en: 'Ministry of New and Renewable Energy (MNRE) & State Renewable Agencies',
      hi: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE) एवं राज्य नोडल एजेंसियां',
      mr: 'नवीन आणि नवीकरणीय ऊर्जा मंत्रालय (MNRE) व राज्य ऊर्जा एजन्सी'
    },
    category: 'Solar Pumps & Renewable Energy',
    subcategory: 'Off-grid Standalone Solar PV Pumps',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops', 'Sugarcane', 'Cotton', 'Horticulture', 'Vegetables', 'Paddy'],
    targetBeneficiaries: ['Farmers without grid electrical connection for irrigation pumps'],
    applicableActivities: ['horticulture', 'agri_business', 'dairy'],
    benefitsAmount: 'Up to 60% Combined Government Subsidy',
    benefits: {
      en: 'Provides up to 60% subsidy (30% Central + 30% State) for 3 HP, 5 HP, or 7.5 HP standalone solar water pumps. Farmer pays 40% (bank loan available up to 30%). Zero electricity bills with daytime solar pumping.',
      hi: 'स्टैंडअलोन सोलर पंप (3, 5 या 7.5 एचपी) लगाने के लिए 60% सब्सिडी (30% केंद्र + 30% राज्य)। किसान को केवल 40% देना होता है। दिन के समय मुफ्त सौर सिंचाई।',
      mr: 'सोलर कृषी पंप (३, ५ किंवा ७.५ एचपी) बसवण्यासाठी ६०% शासकीय अनुदान (३०% केंद्र + ३०% राज्य). मोफत सौर ऊर्जेवर दिवसा सुरक्षित सिंचन.'
    },
    description: {
      en: 'Replaces expensive diesel pumps with clean solar pumps in non-electrified agricultural areas.',
      hi: 'गैर-विद्युतीकृत कृषि क्षेत्रों में डीज़ल पंपों को हटाकर स्वच्छ सौर ऊर्जा पंप लगाने की योजना।',
      mr: 'वीज जोडणी नसलेल्या भागातील शेतकऱ्यांना डिझेल पंपाऐवजी सौर पंप बसवून देणारी योजना.'
    },
    eligibilityOverview: {
      en: 'Landowner farmers with verified water source (open well, borewell, farm pond) and NO existing agricultural grid electricity meter.',
      hi: 'सत्यापित जल स्रोत (कुआं/बोरवेल) वाले ज़मीन मालिक, जिनके खेत पर कोई पूर्व कृषि बिजली मीटर न हो।',
      mr: 'शेतात विहीर/बोअरवेल असलेला शेतकरी, ज्याच्याकडे पूर्वीचे कृषी वीज कनेक्शन नाही.'
    },
    rules: [
      {
        id: 'kusum-rule-1',
        conditionNumber: 8,
        conditionName: 'Cultivable Land Ownership',
        field: 'landOwnership',
        label: { en: 'Must own agricultural land in revenue records', hi: 'राजस्व रिकॉर्ड में भूमि का मालिकाना हक होना चाहिए', mr: 'महसूल नोंदीत शेतजमीन मालकी असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['owner'],
        isMandatory: true,
        explanation: { en: 'Pump is permanently installed on landowner property.', hi: 'पंप ज़मीन पर स्थायी रूप से लगता है इसलिए स्वामित्व आवश्यक है।', mr: 'पंप शेतात कायमस्वरूपी बसवला जातो.' },
        failureReason: { en: 'Tenant cultivators without long-term registered lease deed are not eligible.', hi: 'किरायेदार किसान पात्र नहीं हैं।', mr: 'भाडेकरू शेतकरी पात्र नाहीत.' }
      },
      {
        id: 'kusum-rule-2',
        conditionNumber: 12,
        conditionName: 'Confirmed Water Source',
        field: 'irrigationAvailability',
        label: { en: 'Must have active water source (Well, Borewell, Farm Pond)', hi: 'खेत में सक्रिय जल स्रोत (कुआं/बोरवेल) होना आवश्यक', mr: 'शेतात विहीर किंवा कूपनलिका असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['well_borewell', 'canal', 'drip_sprinkler'],
        isMandatory: true,
        explanation: { en: 'Pumps require verified groundwater or surface water source.', hi: 'पंप के लिए पानी का स्रोत होना आवश्यक है।', mr: 'सौर पंपासाठी पाण्याचा स्त्रोत असणे अनिवार्य आहे.' },
        failureReason: { en: 'Profile indicates rainfed land without water source.', hi: 'प्रोफ़ाइल में कोई जल स्रोत नहीं है।', mr: 'पाण्याचा कोणताही स्त्रोत उपलब्ध नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'kusum-doc-1',
        name: { en: '7/12 Extract with Water Source Entry', hi: '7/12 खतौनी (कुएं की प्रविष्टि सहित)', mr: 'पाण्याचा दाखला असलेला ७/१२ उतारा' },
        isMandatory: true,
        description: { en: 'Issued within 3 months showing well/borewell.', hi: 'कुएं/बोरवेल की प्रविष्टि वाला भू-अभिलेख।', mr: 'विहिरीची नोंद असलेला अद्ययावत ७/१२.' },
        issuingAuthority: { en: 'Revenue Department / Talathi', hi: 'राजस्व विभाग / पटवारी', mr: 'महसूल विभाग / तलाठी' },
        helpTip: { en: 'Ensure water source is recorded in 7/12 other rights.', hi: 'जांच लें कि 7/12 में कुएं की प्रविष्टि दर्ज है।', mr: '७/१२ च्या इतर हक्कात विहीर नोंद तपासा.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Open state renewable portal (e.g., Mahadiscom Solar in MH or UPNEDA).', hi: 'चरण 1: राज्य नवीकरणीय ऊर्जा पोर्टल पर जाएं।', mr: 'पायरी १: राज्य सौर ऊर्जा पोर्टलवर अर्ज करा.' },
      { en: 'Step 2: Upload land record, No-Grid Power NOC, and pay registration fee.', hi: 'चरण 2: भू-अभिलेख व अनापत्ति प्रमाण पत्र अपलोड करें।', mr: 'पायरी २: ७/१२ आणि वीज नसल्याचे प्रमाणपत्र अपलोड करा.' }
    ],
    officialUrl: 'https://pmkusum.mnre.gov.in',
    sourceUrl: 'https://mnre.gov.in/solar/schemes',
    lastVerifiedDate: '2026-10-25',
    applicationPeriod: 'District Quotas Open Annually',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-180-3333 (MNRE Helpline)',
    badge: 'Solar Irrigation Subsidy'
  },

  // 4. Kisan Credit Card (Credit & Loans - Central)
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    alternativeNames: ['KCC Crop Loan', 'Concessional Agri Credit'],
    localNames: {
      en: 'Kisan Credit Card (KCC) Scheme',
      hi: 'किसान क्रेडिट कार्ड (केसीसी) योजना',
      mr: 'किसान क्रेडिट कार्ड (केसीसी) योजना'
    },
    department: {
      en: 'Department of Financial Services, Ministry of Finance & NABARD',
      hi: 'वित्तीय सेवाएं विभाग, वित्त मंत्रालय एवं नाबार्ड',
      mr: 'वित्तीय सेवा विभाग, वित्त मंत्रालय व नाबार्ड'
    },
    category: 'Agricultural Loans & Credit',
    subcategory: 'Short-term Crop Production Credit',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops', 'Livestock', 'Dairy', 'Fisheries', 'Poultry'],
    targetBeneficiaries: ['All farmers', 'Owner cultivators', 'Tenant farmers', 'Sharecroppers', 'SHGs'],
    applicableActivities: ['dairy', 'poultry', 'fisheries', 'goat_sheep', 'beekeeping', 'horticulture'],
    benefitsAmount: 'Up to ₹3,00,000 at 4% effective interest',
    benefits: {
      en: 'Subsidized crop production loans up to ₹3,00,000 at 7% nominal interest rate, reduced to 4% per annum upon prompt repayment. Collateral-free loans available up to ₹1,60,000 for crops, dairy, and fisheries.',
      hi: 'फसल उत्पादन और पशुपालन के लिए ₹3 लाख तक का रियायती ऋण। 7% ब्याज दर, जो समय पर भुगतान पर 3% छूट के साथ 4% रह जाती है। ₹1.6 लाख तक तारणमुक्त कर्ज।',
      mr: 'बियाणे, खते आणि पीक लागवडीसाठी ₹३ लाखांपर्यंत सवलतीचे कर्ज. वेळेत परतफेड केल्यास प्रभावी व्याजदर केवळ ४%. ₹१.६ लाखांपर्यंत तारणमुक्त कर्ज.'
    },
    description: {
      en: 'Institutional, low-interest agricultural credit to shield Indian farmers from local moneylenders charging 24-36% interest.',
      hi: 'किसानों को स्थानीय साहूकारों के भारी ब्याज के जाल से बचाने के लिए संस्थागत सस्ता कृषि ऋण।',
      mr: 'सावकारांच्या जाचातून बळीराजाला वाचवणारी नाममात्र दरातील संस्थागत कृषी कर्ज योजना.'
    },
    eligibilityOverview: {
      en: 'All individual farmers, joint borrowers, tenant cultivators, and sharecroppers engaged in crop production or animal husbandry. Age: 18-75 years.',
      hi: 'फसल उत्पादन या पशुपालन में लगे सभी किसान, पट्टेदार और बटाईदार। आयु: 18-75 वर्ष।',
      mr: 'पीक उत्पादन किंवा पशुपालनात गुंतलेले सर्व शेतकरी, कुळ व भाडेकरू. वय: १८-७५ वर्षे.'
    },
    rules: [
      {
        id: 'kcc-rule-1',
        conditionNumber: 3,
        conditionName: 'Age Requirement',
        field: 'age',
        label: { en: 'Farmer age between 18 and 75 years', hi: 'किसान की आयु 18 से 75 वर्ष होनी चाहिए', mr: 'शेतकऱ्याचे वय १८ ते ७५ दरम्यान असावे' },
        operator: 'between',
        expectedValue: [18, 75],
        isMandatory: true,
        explanation: { en: 'Applicant must be an insurable adult within credit age limits.', hi: 'आवेदक बालिग होना चाहिए।', mr: 'अर्जदार सज्ञान असावा.' },
        failureReason: { en: 'Age is outside 18-75 eligibility window.', hi: 'आयु 18-75 वर्ष के बीच नहीं है।', mr: 'वय मर्यादेत बसत नाही.' }
      },
      {
        id: 'kcc-rule-2',
        conditionNumber: 9,
        conditionName: 'Tenants Permitted',
        field: 'landOwnership',
        label: { en: 'Open to both landowners and tenant farmers', hi: 'ज़मीन मालिक और बटाईदार दोनों पात्र हैं', mr: 'जमीन मालक व भाडेकरू दोघेही पात्र' },
        operator: 'in',
        expectedValue: ['owner', 'tenant', 'sharecropper', 'oral_lessee'],
        isMandatory: true,
        explanation: { en: 'Tenants can avail collateral-free KCC up to ₹1.6 lakh.', hi: 'किरायेदार किसान बिना बंधक ₹1.6 लाख तक केसीसी ले सकते हैं।', mr: 'भाडेकरू शेतकरी तारण न ठेवता ₹१.६ लाखांपर्यंत कर्ज घेऊ शकतात.' },
        failureReason: { en: 'Must be engaged in farming or allied activity.', hi: 'खेती या पशुपालन होना आवश्यक है।', mr: 'शेती असणे आवश्यक.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'kcc-doc-1',
        name: { en: 'Simplified 1-Page KCC Application Form', hi: 'सरलीकृत एक पृष्ठीय केसीसी फॉर्म', mr: '१ पानी सोपा केसीसी अर्ज' },
        isMandatory: true,
        description: { en: 'Available free at bank branches or PM-KISAN portal.', hi: 'बैंक शाखा पर निःशुल्क उपलब्ध।', mr: 'बँकेत मोफत मिळणारा अर्ज.' },
        issuingAuthority: { en: 'Bank Branch', hi: 'बैंक शाखा', mr: 'बँक शाखा' },
        helpTip: { en: 'Existing PM-KISAN farmers can use pre-filled form with Aadhaar.', hi: 'पीएम-किसान लाभार्थी केवल आधार से आवेदन कर सकते हैं।', mr: 'पीएम-किसान लाभार्थी आधारसह अर्ज करू शकतात.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Download 1-page form from pmkisan.gov.in or nearest commercial/Gramin bank branch.', hi: 'चरण 1: बैंक शाखा से 1-पेज फॉर्म प्राप्त करें।', mr: 'पायरी १: बँकेतून १ पानी अर्ज घ्या.' },
      { en: 'Step 2: Submit with Aadhaar and crop details; bank sanctions within 14 working days.', hi: 'चरण 2: आधार के साथ जमा करें; बैंक 14 दिनों में कार्ड जारी करता है।', mr: 'पायरी २: आधारसह जमा करा; १४ दिवसांत कार्ड मंजूर होते.' }
    ],
    officialUrl: 'https://myscheme.gov.in/schemes/kcc',
    sourceUrl: 'https://www.nabard.org/content1.aspx?id=599&catid=23',
    lastVerifiedDate: '2026-11-01',
    applicationPeriod: 'Open 365 Days a Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-11-2211 / 1800-425-3800',
    badge: 'Essential Working Capital'
  },

  // 5. SMAM (Farm Machinery & Equipment - Central)
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    alternativeNames: ['Farmech Scheme', 'Tractor & Machinery Subsidy'],
    localNames: {
      en: 'SMAM (Sub-Mission on Agricultural Mechanization)',
      hi: 'एसएमएएम (कृषि यंत्रीकरण पर उप-मिशन)',
      mr: 'एसएमएएम (कृषी यांत्रिकीकरण उप-अभियान)'
    },
    department: {
      en: 'Mechanization & Technology Division, Ministry of Agriculture',
      hi: 'कृषि यंत्रीकरण प्रभाग, कृषि मंत्रालय',
      mr: 'कृषी यांत्रिकीकरण विभाग, कृषी मंत्रालय'
    },
    category: 'Farm Machinery & Equipment',
    subcategory: 'Agricultural Implements Subsidy',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops', 'Sugarcane', 'Cotton', 'Wheat', 'Paddy', 'Soybean'],
    targetBeneficiaries: ['Individual farmers', 'Small/Marginal/SC/ST/Women farmers', 'Custom Hiring Centers'],
    applicableActivities: ['agri_business', 'horticulture'],
    benefitsAmount: '40% to 50% Subsidy on Agricultural Implements',
    benefits: {
      en: 'Financial assistance of 40% to 50% on purchase of tractors, rotavators, power tillers, seed drills, multi-crop threshers, and power sprayers. 50% preferential rate for Small, Marginal, SC, ST, and Women farmers.',
      hi: 'ट्रैक्टर, रोटावेटर, पावर टिलर, थ्रेशर और पावर स्प्रेयर की खरीद पर 40% से 50% सब्सिडी। छोटे, सीमांत, एससी/एसटी और महिला किसानों को 50% की विशेष छूट।',
      mr: 'ट्रॅक्टर, रोटाव्हेटर, पॉवर टिलर, पेरणी व मळणी यंत्रांवर ४०% ते ५०% शासकीय अनुदान. महिला व लहान शेतकऱ्यांना ५०% सवलत.'
    },
    description: {
      en: 'Increases farm mechanization reach to small and marginal farmers, drastically cutting manual labor cost.',
      hi: 'छोटे किसानों तक आधुनिक कृषि यंत्रों की पहुंच बढ़ाकर मजदूरी का खर्च घटाने वाली योजना।',
      mr: 'लहान शेतकऱ्यांना आधुनिक अवजारे अनुदानावर देऊन मजुरीचा खर्च वाचवणारी योजना.'
    },
    eligibilityOverview: {
      en: 'Individual farmers possessing valid agricultural land records; Has not availed government subsidy for the same category of machinery within the past 5 to 7 years.',
      hi: 'वैध कृषि भूमि रिकॉर्ड वाले किसान; जिन्होंने पिछले 5 वर्षों में उस यंत्र पर सरकारी सब्सिडी न ली हो।',
      mr: 'स्वतःच्या नावावर शेतजमीन असलेला शेतकरी; ज्याने मागील ५ वर्षांत त्याच अवजारावर अनुदान घेतलेले नसावे.'
    },
    rules: [
      {
        id: 'smam-rule-1',
        conditionNumber: 8,
        conditionName: 'Agricultural Land Title',
        field: 'landOwnership',
        label: { en: 'Must own agricultural land in revenue records', hi: 'राजस्व रिकॉर्ड में कृषि भूमि का स्वामित्व होना चाहिए', mr: 'महसूल नोंदीत शेतजमीन मालकी असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['owner'],
        isMandatory: true,
        explanation: { en: 'Machinery quotas are allocated against registered land survey numbers.', hi: 'यंत्रों का आवंटन पंजीकृत ज़मीन पर होता है।', mr: 'अवजारांचे वाटप नोंदणीकृत जमिनीवर होते.' },
        failureReason: { en: 'Land title is mandatory for asset purchase subsidies.', hi: 'ज़मीन का मालिकाना हक अनिवार्य है।', mr: 'जमीन मालकी आवश्यक आहे.' }
      },
      {
        id: 'smam-rule-2',
        conditionNumber: 18,
        conditionName: '5-Year Cooling-off Check',
        field: 'previousSubsidyAvailed',
        label: { en: 'Must not have received subsidy for same equipment in last 5 years', hi: 'पिछले 5 वर्षों में उसी यंत्र पर सब्सिडी नहीं ली होनी चाहिए', mr: 'मागील ५ वर्षांत त्याच अवजारावर अनुदान घेतलेले नसावे' },
        operator: 'is_false',
        expectedValue: false,
        isMandatory: true,
        explanation: { en: 'Mandatory 5-year gap to avoid duplication.', hi: 'एक ही यंत्र पर बार-बार सब्सिडी पर रोक है।', mr: '५ वर्षांत पुन्हा अनुदान घेण्यास बंदी.' },
        failureReason: { en: '5-year cooling off period is still active.', hi: '5 वर्ष की अवधि अभी पूरी नहीं हुई है।', mr: '५ वर्षांची मुदत संपलेली नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'smam-doc-1',
        name: { en: '7/12 Extract & 8-A Certificate', hi: '7/12 खतौनी और 8-अ प्रमाणपत्र', mr: '७/१२ उतारा आणि ८-अ नोंद' },
        isMandatory: true,
        description: { en: 'Verifying farmer ownership and landholding size.', hi: 'ज़मीन का क्षेत्रफल और मालिकाना हक।', mr: 'जमीन मालकी आणि क्षेत्र तपासण्यासाठी.' },
        issuingAuthority: { en: 'Tehsil Office / Talathi', hi: 'तहसील कार्यालय', mr: 'महसूल विभाग / तलाठी' },
        helpTip: { en: 'Upload recent digital copy with QR code.', hi: 'क्यूआर कोड वाली खतौनी लगाएं।', mr: 'क्यूआर कोड असलेला डिजिटल उतारा जोडा.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Register on agrimachinery.nic.in or state portal (e.g. MahaDBT).', hi: 'चरण 1: agrimachinery.nic.in या राज्य पोर्टल पर पंजीकरण करें।', mr: 'पायरी १: agrimachinery.nic.in किंवा महाडीबीटीवर नोंदणी करा.' },
      { en: 'Step 2: Upload dealer quotation; receive pre-sanction letter after lottery draw.', hi: 'चरण 2: डीलर का कोटेशन अपलोड करें; लॉटरी बाद स्वीकृति पत्र पाएं।', mr: 'पायरी २: विक्रेत्याचे कोटेशन अपलोड करा; सोडतीनंतर पूर्वसंमती पत्र मिळवा.' }
    ],
    officialUrl: 'https://agrimachinery.nic.in',
    sourceUrl: 'https://farmech.dac.gov.in/guidelines/smam.pdf',
    lastVerifiedDate: '2026-10-28',
    applicationPeriod: 'State Portals Open via Periodic Lottery Draws',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '011-23382937',
    badge: 'Equipment & Mechanization'
  },

  // 6. PMKSY - Per Drop More Crop (Micro Irrigation - Central/State)
  {
    id: 'pmksy-pdmc',
    name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    alternativeNames: ['Drip & Sprinkler Scheme', 'PDMC'],
    localNames: {
      en: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
      hi: 'पीएमकेएसवाई - प्रति बूंद अधिक फसल (सूक्ष्म सिंचाई योजना)',
      mr: 'पीएमकेएसवाय - प्रति थेंब अधिक पीक (ठिबक व तुषार सिंचन)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Welfare, GoI',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      mr: 'कृषी आणि शेतकरी कल्याण विभाग, भारत सरकार'
    },
    category: 'Irrigation & Water Conservation',
    subcategory: 'Drip and Sprinkler Systems',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Sugarcane', 'Cotton', 'Fruits & Vegetables', 'Pulses', 'Oilseeds', 'Spices'],
    targetBeneficiaries: ['Small and marginal farmers', 'All cultivable landholders'],
    applicableActivities: ['horticulture', 'organic_farming'],
    benefitsAmount: 'Up to 55% Subsidy for Drip & Sprinkler Systems',
    benefits: {
      en: 'Subsidy up to 55% for Small/Marginal farmers (45% for other farmers) for installing Drip Irrigation and Sprinkler Irrigation sets. Saves 40-50% water while increasing yield by 20-30%.',
      hi: 'छोटे और सीमांत किसानों के लिए 55% तक ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई पर सब्सिडी। 40-50% पानी की बचत और 20-30% अधिक उपज।',
      mr: 'लहान शेतकऱ्यांसाठी ५५% पर्यंत ठिबक व तुषार सिंचन संचावर अनुदान. पाण्याची ४०-५०% बचत आणि उत्पादनात २०-३०% वाढ.'
    },
    description: {
      en: 'Promotes micro-irrigation technologies to optimize farm water efficiency and enable fertigation.',
      hi: 'खेत स्तर पर जल उपयोग दक्षता बढ़ाने और ड्रिप के जरिए खाद (फर्टिगेशन) देने की योजना।',
      mr: 'शेतातील पाण्याची कार्यक्षमता वाढवणारी आणि विद्राव्य खतांचा वापर सुलभ करणारी सूक्ष्म सिंचन योजना.'
    },
    eligibilityOverview: {
      en: 'Farmers with cultivable land having a permanent or seasonal irrigation source (well, canal, farm pond, tube well).',
      hi: 'स्थायी या मौसमी सिंचाई स्रोत (कुआं, नहर, तालाब) वाले कृषि भूमि धारक किसान।',
      mr: 'शेतात सिंचन स्त्रोत (विहीर, कूपनलिका, शेततळे) असणारे शेतकरी.'
    },
    rules: [
      {
        id: 'pdmc-rule-1',
        conditionNumber: 12,
        conditionName: 'Water Source Requirement',
        field: 'irrigationAvailability',
        label: { en: 'Must have active water source (Well, Borewell, Canal, Pond)', hi: 'खेत में सक्रिय सिंचाई स्रोत होना अनिवार्य', mr: 'शेतात पाण्याची उपलब्धता असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['well_borewell', 'canal', 'drip_sprinkler'],
        isMandatory: true,
        explanation: { en: 'Micro-irrigation requires pressurized water discharge.', hi: 'ड्रिप सिस्टम चलाने के लिए पानी का स्रोत होना आवश्यक है।', mr: 'ठिबक चालवण्यासाठी पाण्याचा स्त्रोत आवश्यक आहे.' },
        failureReason: { en: 'Rainfed land with no water source cannot operate drip systems.', hi: 'बिना जल स्रोत की भूमि पर ड्रिप नहीं लग सकती।', mr: 'पाण्याचा स्त्रोत नसलेल्या जमिनीत ठिबक बसवणे शक्य नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pdmc-doc-1',
        name: { en: '7/12 Extract with Water Source Details', hi: 'जल स्रोत विवरण सहित 7/12 खतौनी', mr: 'पाण्याचा दाखला असलेला ७/१२' },
        isMandatory: true,
        description: { en: 'Revenue record showing survey number and crop.', hi: 'सर्वे नंबर और फसल दर्शाने वाला भू-अभिलेख।', mr: 'गट क्रमांक आणि पिकाची नोंद असलेला महसूल उतारा.' },
        issuingAuthority: { en: 'Revenue Department', hi: 'राजस्व विभाग', mr: 'महसूल विभाग' },
        helpTip: { en: 'Attach water source certificate from Patwari if not noted in 7/12.', hi: 'यदि 7/12 में दर्ज नहीं है तो पटवारी का प्रमाण पत्र लगाएं।', mr: '७/१२ वर नोंद नसल्यास तलाठ्याचा दाखला जोडा.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Apply online on state agriculture DBT portal (e.g., MahaDBT in Maharashtra).', hi: 'चरण 1: राज्य कृषि डीबीटी पोर्टल पर आवेदन करें।', mr: 'पायरी १: महाडीबीटी शेतकरी पोर्टलवर अर्ज करा.' },
      { en: 'Step 2: Obtain Pre-Sanction, purchase BIS-certified kit from empanelled dealer, and claim DBT.', hi: 'चरण 2: पूर्व-स्वीकृति मिलने पर अधिकृत डीलर से ड्रिप लगवाएं।', mr: 'पायरी २: पूर्वसंमती मिळाल्यावर पॅनलवरील विक्रेत्याकडून संच बसवून घ्या.' }
    ],
    officialUrl: 'https://pmksy.gov.in',
    sourceUrl: 'https://pmksy.gov.in/microirrigation/guidelines.aspx',
    lastVerifiedDate: '2026-10-30',
    applicationPeriod: 'State Portals Active Round the Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-180-1551',
    badge: 'Water Efficiency Subsidy'
  },

  // 7. Namo Shetkari Mahasanman Nidhi (State - Maharashtra)
  {
    id: 'namo-shetkari',
    name: 'Namo Shetkari Mahasanman Nidhi Yojana',
    alternativeNames: ['Namo Shetkari Yojana', 'Maharashtra Farmer Double Benefit'],
    localNames: {
      en: 'Namo Shetkari Mahasanman Nidhi Yojana',
      hi: 'नमो शेतकरी महासंमान निधि योजना',
      mr: 'नमो शेतकरी महासन्मान निधी योजना'
    },
    department: {
      en: 'Department of Agriculture, Government of Maharashtra',
      hi: 'कृषि विभाग, महाराष्ट्र शासन',
      mr: 'कृषी विभाग, महाराष्ट्र शासन'
    },
    category: 'Income Support & Direct Assistance',
    subcategory: 'State DBT Top-up',
    type: 'state',
    stateCoverage: ['Maharashtra'],
    cropCoverage: ['All Crops', 'Cotton', 'Soybean', 'Sugarcane', 'Onion', 'Pulses'],
    targetBeneficiaries: ['All verified PM-KISAN beneficiaries resident in Maharashtra'],
    applicableActivities: ['agri_business', 'horticulture', 'dairy'],
    benefitsAmount: '₹6,000 / year (State Top-up to PM-KISAN)',
    benefits: {
      en: 'Direct State Income Support of ₹6,000 annually in 3 installments of ₹2,000 each to all eligible PM-KISAN beneficiaries in Maharashtra, making a combined total of ₹12,000 per year per farmer family.',
      hi: 'महाराष्ट्र के सभी पात्र पीएम-किसान लाभार्थियों को ₹2,000 की 3 किस्तों में वार्षिक ₹6,000 की सीधी राज्य सहायता (कुल ₹12,000 प्रति वर्ष)।',
      mr: 'महाराष्ट्रातील सर्व पात्र पीएम-किसान शेतकऱ्यांना ₹२,००० च्या ३ हप्त्यांत वार्षिक ₹६,००० चे अतिरिक्त राज्य अनुदान (एकूण ₹१२,००० थेट लाभ).'
    },
    description: {
      en: 'Maharashtra State Government initiative supplementing central PM-KISAN with additional ₹6,000 to double direct farmer income support.',
      hi: 'महाराष्ट्र सरकार की एक प्रमुख योजना जो केंद्रीय पीएम-किसान योजना के ऊपर अतिरिक्त ₹6,000 की आर्थिक मदद प्रदान करती है।',
      mr: 'केंद्र शासनाच्या पीएम-किसान योजनेच्या धर्तीवर महाराष्ट्र शासनाने सुरू केलेली दुहेरी उत्पन्न सहाय्य योजना.'
    },
    eligibilityOverview: {
      en: 'Resident farmer of Maharashtra with landholding registered and actively receiving PM-KISAN installments.',
      hi: 'महाराष्ट्र का निवासी किसान होना चाहिए और सक्रिय रूप से पीएम-किसान की किस्तें प्राप्त कर रहा हो।',
      mr: 'महाराष्ट्रातील शेतकरी असणे आणि पीएम-किसान योजनेचा सक्रिय लाभार्थी असणे बंधनकारक.'
    },
    rules: [
      {
        id: 'namo-rule-1',
        conditionNumber: 1,
        conditionName: 'Maharashtra State Resident',
        field: 'state',
        label: { en: 'Must reside and cultivate land in Maharashtra', hi: 'महाराष्ट्र राज्य का निवासी किसान होना चाहिए', mr: 'महाराष्ट्र राज्यातील रहिवासी व शेतकरी असणे आवश्यक' },
        operator: 'eq',
        expectedValue: 'Maharashtra',
        isMandatory: true,
        explanation: { en: 'Exclusive state welfare scheme funded entirely by Maharashtra state budget.', hi: 'यह योजना केवल महाराष्ट्र राज्य के बजट से वित्तपोषित है।', mr: 'ही योजना केवळ महाराष्ट्र शासनाची राज्य योजना आहे.' },
        failureReason: { en: 'Farmer state profile is not Maharashtra.', hi: 'किसान प्रोफ़ाइल में राज्य महाराष्ट्र नहीं है।', mr: 'शेतकरी प्रोफाइलमध्ये महाराष्ट्र राज्य निवडलेले नाही.' }
      },
      {
        id: 'namo-rule-2',
        conditionNumber: 18,
        conditionName: 'PM-KISAN Active Beneficiary',
        field: 'hasAadhaarLinkedBankDBT',
        label: { en: 'Must be an active, verified PM-KISAN beneficiary', hi: 'पीएम-किसान का सक्रिय व ई-केवाईसी पूर्ण लाभार्थी होना चाहिए', mr: 'पीएम-किसान योजनेचे ई-केवायसी पूर्ण असलेले पात्र लाभार्थी' },
        operator: 'is_true',
        expectedValue: true,
        isMandatory: true,
        explanation: { en: 'State database syncs automatically with central PM-KISAN approved rolls.', hi: 'डेटाबेस सीधे केंद्रीय पीएम-किसान लाभार्थी सूची से जुड़ा है।', mr: 'डेटाबेस थेट केंद्रीय पीएम-किसान यादीशी संलग्न आहे.' },
        failureReason: { en: 'Aadhaar eKYC or PM-KISAN approval is pending.', hi: 'आधार ई-केवाईसी या पीएम-किसान पंजीकरण अधूरा है।', mr: 'ई-केवायसी किंवा पीएम-किसान मंजुरी प्रलंबित आहे.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'namo-doc-1',
        name: { en: 'PM-KISAN Beneficiary ID / Aadhaar Number', hi: 'पीएम-किसान लाभार्थी आईडी / आधार नंबर', mr: 'पीएम-किसान नोंदणी क्रमांक / आधार' },
        isMandatory: true,
        description: { en: 'Automatic eligibility pull from central portal.', hi: 'केंद्रीय डेटा से स्वचालित सत्यापन।', mr: 'केंद्रीय डेटावरून थेट पडताळणी.' },
        issuingAuthority: { en: 'Central PM-KISAN Portal', hi: 'पीएम-किसान पोर्टल', mr: 'पीएम-किसान पोर्टल' },
        helpTip: { en: 'No separate application required if PM-KISAN is active; credited automatically.', hi: 'यदि पीएम-किसान चालू है तो अलग आवेदन की जरूरत नहीं है।', mr: 'पीएम-किसान सुरू असल्यास वेगळा अर्ज करण्याची गरज नाही.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Verify eKYC on pmkisan.gov.in; amount is automatically credited by Maharashtra Agriculture Dept.', hi: 'चरण 1: pmkisan.gov.in पर ई-केवाईसी सुनिश्चित करें; राशि स्वतः खाते में आती है।', mr: 'पायरी १: ई-केवायसी पूर्ण असल्याची खात्री करा; रक्कम आपोआप खात्यात जमा होते.' }
    ],
    officialUrl: 'https://krishi.maharashtra.gov.in',
    sourceUrl: 'https://krishi.maharashtra.gov.in/namo-shetkari-guidelines',
    lastVerifiedDate: '2026-11-03',
    applicationPeriod: 'Automatic Alignment with PM-KISAN Installments',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '1800-233-4000 (Maharashtra Kisan Call Centre)',
    badge: 'Maharashtra Double Benefit'
  },

  // 8. Rashtriya Gokul Mission (Dairy & Livestock - Central)
  {
    id: 'rgm-dairy',
    name: 'Rashtriya Gokul Mission (Indigenous Breed & Dairy Development)',
    alternativeNames: ['RGM Dairy Subsidy', 'Gokul Mission'],
    localNames: {
      en: 'Rashtriya Gokul Mission (Indigenous Breed & Dairy Development)',
      hi: 'राष्ट्रीय गोकुल मिशन (डेयरी एवं देशी गोवंश विकास योजना)',
      mr: 'राष्ट्रीय गोकुळ मिशन (दुग्ध व्यवसाय व देशी गोवंश विकास)'
    },
    department: {
      en: 'Department of Animal Husbandry and Dairying, Ministry of Fisheries, Animal Husbandry & Dairying',
      hi: 'पशुपालन और डेयरी विभाग, भारत सरकार',
      mr: 'पशुसंवर्धन आणि दुग्धव्यवसाय विभाग, भारत सरकार'
    },
    category: 'Dairy & Livestock Development',
    subcategory: 'Breed Multiplication & Dairy Farm Setup',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Fodder Crops', 'Maize', 'Sorghum', 'All Crops'],
    targetBeneficiaries: ['Individual farmers', 'Dairy entrepreneurs', 'Milk cooperatives', 'Women self-help groups'],
    applicableActivities: ['dairy', 'agri_business'],
    benefitsAmount: 'Up to 50% Capital Subsidy (up to ₹2 Crore for Breed Multiplication)',
    benefits: {
      en: 'Provides 50% capital subsidy for establishing Breed Multiplication Farms (minimum 200 indigenous cattle/buffaloes), sex-sorted semen doses, and AI services. Smallholders receive subsidized high-genetic merit heifers and fodder seed minikits.',
      hi: 'देशी गोवंश प्रजनन फार्म स्थापित करने के लिए 50% तक पूंजीगत सब्सिडी। छोटे डेयरी किसानों को उच्च नस्ल की बछिया और मुफ्त चारा बीज किट उपलब्ध कराई जाती है।',
      mr: 'देशी गोवंश संवर्धन आणि डेअरी फार्म उभारण्यासाठी ५०% पर्यंत भांडवली अनुदान. लहान दूध उत्पादक शेतकऱ्यांना उच्च जनुकीय कालवडी आणि मोफत चारा बियाणे किट.'
    },
    description: {
      en: 'National mission for development and conservation of indigenous bovine breeds, genetic upgradation of bovine population, and enhancing milk production and productivity.',
      hi: 'देशी गोजातीय नस्लों के विकास और संरक्षण तथा दूध उत्पादन और उत्पादकता बढ़ाने का राष्ट्रीय मिशन।',
      mr: 'देशी गोवंशाचे संवर्धन, दुग्ध उत्पादनात वाढ आणि शेतकऱ्यांचे दुग्ध व्यवसायातून उत्पन्न दुप्पट करणारे राष्ट्रीय अभियान.'
    },
    eligibilityOverview: {
      en: 'Farmers, individual entrepreneurs, and cooperatives having land for dairy cattle shed and fodder cultivation. Minimum 3 years cattle rearing experience preferred.',
      hi: 'पशुपालन में लगे किसान जिनके पास पशु बाड़ा और चारा उगाने के लिए भूमि उपलब्ध हो।',
      mr: 'पशुपालनात गुंतलेले शेतकरी ज्यांच्याकडे गोठा व चारा उत्पादनासाठी जागा उपलब्ध आहे.'
    },
    rules: [
      {
        id: 'rgm-rule-1',
        conditionNumber: 15,
        conditionName: 'Allied Dairy Activity',
        field: 'alliedActivities',
        label: { en: 'Must be engaged in dairy farming or livestock rearing', hi: 'डेयरी या पशुपालन गतिविधि में शामिल होना चाहिए', mr: 'दुग्ध व्यवसाय किंवा पशुपालनात सक्रिय असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['dairy', 'livestock'],
        isMandatory: true,
        explanation: { en: 'Scheme benefits are dedicated to bovine milk producers and breeders.', hi: 'यह योजना विशेष रूप से डेयरी और पशुपालक किसानों के लिए है।', mr: 'ही योजना केवळ दुग्ध उत्पादक व पशुपालक शेतकऱ्यांसाठी आहे.' },
        failureReason: { en: 'Farmer profile does not include Dairy or Livestock in allied activities.', hi: 'प्रोफ़ाइल में डेयरी या पशुपालन शामिल नहीं है।', mr: 'प्रोफाइलमध्ये दुग्ध व्यवसाय निवडलेला नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'rgm-doc-1',
        name: { en: 'Land Ownership / Lease Deed for Cattle Shed & Fodder', hi: 'पशु शेड एवं चारे के लिए भूमि स्वामित्व या पट्टा दस्तावेज़', mr: 'गोठा व चाऱ्यासाठी जागेचा मालकी किंवा भाडे करार' },
        isMandatory: true,
        description: { en: 'Proof of land area for housing dairy cattle.', hi: 'पशुपालन हेतु पर्याप्त भूमि का प्रमाण।', mr: 'पशुपालनासाठी पुरेशा जागेचा पुरावा.' },
        issuingAuthority: { en: 'Revenue Dept / Local Panchayat', hi: 'राजस्व विभाग / ग्राम पंचायत', mr: 'महसूल विभाग / ग्रामपंचायत' },
        helpTip: { en: 'Minimum land requirement depends on herd size (0.5 to 2 acres).', hi: 'पशु संख्या के आधार पर 0.5 से 2 एकड़ ज़मीन आवश्यक है।', mr: 'जनावरांच्या संख्येनुसार ०.५ ते २ एकर जागा लागते.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Apply via National Livestock Mission / Rashtriya Gokul portal (nlm.udyamimitra.in) or local District Animal Husbandry Officer.', hi: 'चरण 1: nlm.udyamimitra.in पोर्टल या ज़िला पशुपालन अधिकारी से संपर्क करें।', mr: 'पायरी १: nlm.udyamimitra.in किंवा जिल्हा पशुसंवर्धन कार्यालयात अर्ज करा.' },
      { en: 'Step 2: Submit DPR with bank sanction letter; subsidy is released via SIDBI directly.', hi: 'चरण 2: बैंक लोन स्वीकृति के साथ विस्तृत प्रोजेक्ट रिपोर्ट (DPR) जमा करें।', mr: 'पायरी २: बँक कर्ज मंजुरीसह सविस्तर प्रकल्प अहवाल सादर करा.' }
    ],
    officialUrl: 'https://dahd.nic.in',
    sourceUrl: 'https://nlm.udyamimitra.in',
    lastVerifiedDate: '2026-10-20',
    applicationPeriod: 'Open Round the Year',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '011-23386035',
    badge: 'Livestock & Dairy Subsidy'
  },

  // 9. Pradhan Mantri Matsya Sampada Yojana (PMMSY - Fisheries & Aquaculture - Central)
  {
    id: 'pmmsy-fisheries',
    name: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    alternativeNames: ['PMMSY Fish Farming', 'Blue Revolution Scheme'],
    localNames: {
      en: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
      hi: 'प्रधानमंत्री मत्स्य संपदा योजना (पीएमएमएसवाई)',
      mr: 'प्रधानमंत्री मत्स्य संपदा योजना (पीएमएमएसवाय)'
    },
    department: {
      en: 'Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying',
      hi: 'मत्स्य पालन विभाग, भारत सरकार',
      mr: 'मत्स्यव्यवसाय विभाग, भारत सरकार'
    },
    category: 'Fisheries & Aquaculture',
    subcategory: 'Pond Construction & Biofloc / RAS Aquaculture',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Fish', 'Shrimp', 'Prawn', 'Aquatic Plants'],
    targetBeneficiaries: ['Fishers', 'Fish farmers', 'Fisherwomen', 'Self Help Groups', 'Youth entrepreneurs'],
    applicableActivities: ['fisheries', 'agri_business'],
    benefitsAmount: '40% to 60% Financial Assistance for Fish Ponds & Hatcheries',
    benefits: {
      en: 'Provides 40% subsidy for General category and 60% for SC, ST, and Women beneficiaries for construction of new freshwater/brackish water ponds, Biofloc systems, Recirculatory Aquaculture Systems (RAS), fish seed hatcheries, and refrigerated transport vans.',
      hi: 'नए मछली तालाबों के निर्माण, बायोफ्लॉक और आरएएस सिस्टम के लिए सामान्य वर्ग को 40% तथा महिला, एससी और एसटी वर्ग को 60% तक भारी वित्तीय सहायता।',
      mr: 'नवीन शेततळे/मत्स्यतळे खोदणे, बायोफ्लॉक आणि आरएएस मत्स्यशेतीसाठी सर्वसाधारण वर्गाला ४०% व महिला, एससी, एसटी प्रवर्गास ६०% शासकीय अनुदान.'
    },
    description: {
      en: 'Flagship national scheme for sustainable and responsible development of fisheries sector with an investment of ₹20,050 crore to double fishers’ incomes.',
      hi: 'मत्स्य पालकों की आय दोगुनी करने और आधुनिक मत्स्य पालन तकनीकों को बढ़ावा देने की ₹20,050 करोड़ की प्रमुख राष्ट्रीय योजना।',
      mr: 'मत्स्यव्यवसाय क्षेत्रात क्रांती घडवून बळीराजा व मच्छिमारांचे उत्पन्न वाढवणारी केंद्र सरकारची २०,०५० कोटींची भव्य योजना.'
    },
    eligibilityOverview: {
      en: 'Individuals, fish farmers, or groups possessing own land or minimum 7-year registered lease deed with reliable water source for pond excavation or tank installation.',
      hi: 'मछली पालन के इच्छुक किसान जिनके पास स्वयं की भूमि या 7 वर्ष का लीज पट्टा और पर्याप्त जल स्रोत हो।',
      mr: 'स्वतःची जमीन किंवा किमान ७ वर्षांचा नोंदणीकृत भाडेकरार आणि पाण्याचा पुरवठा असलेले शेतकरी व मच्छिमार.'
    },
    rules: [
      {
        id: 'pmmsy-rule-1',
        conditionNumber: 15,
        conditionName: 'Allied Fisheries Activity',
        field: 'alliedActivities',
        label: { en: 'Must be interested in fish farming or aquaculture', hi: 'मछली पालन या जलीय कृषि में रुचि होनी चाहिए', mr: 'मत्स्यशेती किंवा जलीय उत्पादनात रस असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['fisheries'],
        isMandatory: true,
        explanation: { en: 'Scheme specifically finances aquaculture pond construction and equipment.', hi: 'यह योजना मत्स्य तालाबों और उपकरणों के निर्माण के लिए है।', mr: 'ही योजना केवळ मत्स्यशेती आणि तळ्यांच्या उभारणीसाठी आहे.' },
        failureReason: { en: 'Fisheries is not selected under allied farming activities in your profile.', hi: 'प्रोफ़ाइल में मत्स्य पालन का चयन नहीं किया गया है।', mr: 'प्रोफाइलमध्ये मत्स्यव्यवसाय निवडलेला नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pmmsy-doc-1',
        name: { en: 'Land Ownership / Registered Lease Deed (Minimum 7 Years)', hi: 'भूमि स्वामित्व या 7 वर्षीय पंजीकृत लीज डीड', mr: 'जमीन मालकी किंवा किमान ७ वर्षांचा भाडेपट्टा करार' },
        isMandatory: true,
        description: { en: 'Proof of land for pond excavation.', hi: 'तालाब निर्माण हेतु ज़मीन का प्रमाण।', mr: 'तळे खोदण्यासाठी जागेचा अधिकृत पुरावा.' },
        issuingAuthority: { en: 'Revenue Department / Sub-Registrar', hi: 'उप-पंजीयक / राजस्व विभाग', mr: 'दुय्यम निबंधक / महसूल विभाग' },
        helpTip: { en: 'Clear water availability certificate is also required.', hi: 'पानी की उपलब्धता का प्रमाण भी संलग्न करें।', mr: 'पाण्याच्या उपलब्धतेचा दाखला जोडा.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Prepare Detailed Project Report (DPR) and submit on pmmsy.dof.gov.in or to District Fisheries Development Officer.', hi: 'चरण 1: विस्तृत प्रोजेक्ट रिपोर्ट (DPR) बनाएं और pmmsy.dof.gov.in पर आवेदन करें।', mr: 'पायरी १: सविस्तर प्रकल्प अहवाल (DPR) तयार करून pmmsy.dof.gov.in वर सादर करा.' },
      { en: 'Step 2: District Level Committee (DLC) verifies site and recommends state approval for subsidy release.', hi: 'चरण 2: ज़िला स्तरीय समिति भौतिक सत्यापन कर स्वीकृति देती है।', mr: 'पायरी २: जिल्हास्तरीय समितीकडून प्रत्यक्ष जागेची तपासणी करून मंजुरी दिली जाते.' }
    ],
    officialUrl: 'https://pmmsy.dof.gov.in',
    sourceUrl: 'https://dof.gov.in/pmmsy',
    lastVerifiedDate: '2026-10-22',
    applicationPeriod: 'Annual State Action Plan Windows Open',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-425-1660 (National Fisheries Development Board)',
    badge: 'Aquaculture Subsidy'
  },

  // 10. National Beekeeping & Honey Mission (NBHM - Beekeeping - Central)
  {
    id: 'nbhm-honey',
    name: 'National Beekeeping & Honey Mission (NBHM - Sweet Revolution)',
    alternativeNames: ['Sweet Revolution Scheme', 'Honey Mission'],
    localNames: {
      en: 'National Beekeeping & Honey Mission (NBHM - Sweet Revolution)',
      hi: 'राष्ट्रीय मधुमक्खी पालन एवं शहद मिशन (मीठी क्रांति योजना)',
      mr: 'राष्ट्रीय मधमाशी पालन व मध अभियान (मधुक्रांती योजना)'
    },
    department: {
      en: 'National Bee Board (NBB), Department of Agriculture & Farmers Welfare',
      hi: 'राष्ट्रीय मधुमक्खी बोर्ड (NBB), कृषि मंत्रालय',
      mr: 'राष्ट्रीय मधमाशी मंडळ (NBB), कृषी मंत्रालय'
    },
    category: 'Beekeeping & Allied Activities',
    subcategory: 'Apiary Setup & Honey Processing',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Mustard', 'Sunflower', 'Orchards', 'Apple', 'Litchi', 'Coriander', 'All Crops'],
    targetBeneficiaries: ['Individual beekeepers', 'Small/Marginal farmers', 'SHGs', 'FPOs'],
    applicableActivities: ['beekeeping', 'horticulture', 'agri_business'],
    benefitsAmount: 'Up to 80% Subsidy on Bee Boxes, Colonies & Extraction Equipment',
    benefits: {
      en: 'Provides up to 80% financial subsidy for purchase of bee boxes, honey bee colonies (Apis mellifera / Apis cerana), honey extractors, migration kits, and customized mobile honey testing labs. Boosts crop pollination yields by 20-25% while generating secondary honey income of ₹1.5-3 lakh/year.',
      hi: 'मधुमक्खी के बक्से, कालोनियों और शहद निष्कर्षण उपकरण की खरीद पर 80% तक की भारी सरकारी छूट। फसलों में परागण बढ़ने से 20-25% अधिक उपज और प्रतिवर्ष ₹1.5 से 3 लाख की अतिरिक्त शहद आय।',
      mr: 'मधमाशांच्या पेट्या, वसाहती आणि मध काढण्याच्या यंत्रांवर ८०% पर्यंत शासकीय अनुदान. पिकांमधील परागीभवनामुळे उत्पादनात २०-२५% वाढ आणि मधातून वार्षिक ₹१.५ ते ३ लाख अतिरिक्त उत्पन्न.'
    },
    description: {
      en: 'Central sector scheme under Atmanirbhar Bharat initiative to promote scientific beekeeping, increase crop productivity through pollination, and export high-value organic honey.',
      hi: 'वैज्ञानिक मधुमक्खी पालन को बढ़ावा देने, परागण के जरिए फसल उत्पादन बढ़ाने और शुद्ध जैविक शहद उत्पादन का राष्ट्रीय मिशन।',
      mr: 'वैज्ञानिक मधमाशी पालनाला चालना देऊन पिकांची उत्पादकता वाढवणारे आणि शेतकऱ्यांना जोडधंदा देणारे राष्ट्रीय अभियान.'
    },
    eligibilityOverview: {
      en: 'Open to all farmers, rural youth, and women self-help groups. Minimum 5-day scientific beekeeping training certification from KVK / NBB / ICAR is mandatory.',
      hi: 'सभी किसान और ग्रामीण युवा पात्र हैं। कृषि विज्ञान केंद्र (KVK) या राष्ट्रीय मधुमक्खी बोर्ड से 5 दिवसीय प्रशिक्षण अनिवार्य है।',
      mr: 'सर्व शेतकरी पात्र आहेत. कृषी विज्ञान केंद्र (KVK) किंवा मधमाशी मंडळाकडून ५ दिवसांचे प्रशिक्षण पूर्ण केलेले असणे आवश्यक.'
    },
    rules: [
      {
        id: 'nbhm-rule-1',
        conditionNumber: 15,
        conditionName: 'Beekeeping Activity Interest',
        field: 'alliedActivities',
        label: { en: 'Engaged in or planning beekeeping activity', hi: 'मधुमक्खी पालन में रुचि होनी चाहिए', mr: 'मधमाशी पालनात रस असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['beekeeping'],
        isMandatory: true,
        explanation: { en: 'Dedicated to scientific apiary establishment.', hi: 'यह योजना केवल मधुमक्खी पालकों के लिए है।', mr: 'ही योजना केवळ मधमाशी पालकांसाठी आहे.' },
        failureReason: { en: 'Beekeeping is not selected under allied activities in profile.', hi: 'प्रोफ़ाइल में मधुमक्खी पालन नहीं चुना गया है।', mr: 'प्रोफाइलमध्ये मधमाशी पालन निवडलेले नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'nbhm-doc-1',
        name: { en: 'Beekeeping Training Certificate from KVK / NBB / ATMA', hi: 'केवीके / राष्ट्रीय मधुमक्खी बोर्ड से प्रशिक्षण प्रमाण पत्र', mr: 'कृषी विज्ञान केंद्र (KVK) कडून मिळालेले प्रशिक्षण प्रमाणपत्र' },
        isMandatory: true,
        description: { en: 'Certifying 5-day scientific training in apiculture.', hi: '5 दिवसीय वैज्ञानिक मधुमक्खी पालन प्रशिक्षण का प्रमाण।', mr: '५ दिवसांचे शास्त्रीय प्रशिक्षण पूर्ण केल्याचा दाखला.' },
        issuingAuthority: { en: 'Krishi Vigyan Kendra (KVK) / ICAR / State KVIC', hi: 'कृषि विज्ञान केंद्र / आईसीएआर', mr: 'कृषी विज्ञान केंद्र / खादी ग्रामोद्योग मंडळ' },
        helpTip: { en: 'Training is provided free of cost at your district KVK.', hi: 'ज़िला कृषि विज्ञान केंद्र में यह प्रशिक्षण निःशुल्क दिया जाता है।', mr: 'जिल्हा कृषी विज्ञान केंद्रात हे प्रशिक्षण मोफत मिळते.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Register on Madhukranti portal (madhukranti.in) and register yourself as a beekeeper with Aadhaar.', hi: 'चरण 1: मधुक्रांति पोर्टल (madhukranti.in) पर किसान पंजीकरण करें।', mr: 'पायरी १: मधुक़्रांती पोर्टल (madhukranti.in) वर नोंदणी करा.' },
      { en: 'Step 2: Submit subsidy proposal for bee boxes and colonies through District Horticulture Officer.', hi: 'चरण 2: ज़िला उद्यान अधिकारी के माध्यम से सब्सिडी प्रस्ताव जमा करें।', mr: 'पायरी २: जिल्हा फलोत्पादन अधिकाऱ्यांमार्फत अनुदानाचा प्रस्ताव सादर करा.' }
    ],
    officialUrl: 'https://nbb.gov.in',
    sourceUrl: 'https://madhukranti.in',
    lastVerifiedDate: '2026-10-18',
    applicationPeriod: 'Open 365 Days a Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '011-23382012',
    badge: 'Sweet Revolution Apiary'
  },

  // 11. Mission for Integrated Development of Horticulture (MIDH - Central)
  {
    id: 'midh-horticulture',
    name: 'MIDH (Mission for Integrated Development of Horticulture)',
    alternativeNames: ['National Horticulture Mission', 'NHM Polyhouse Subsidy'],
    localNames: {
      en: 'MIDH (Mission for Integrated Development of Horticulture)',
      hi: 'एमआईडीएच (एकीकृत बागवानी विकास मिशन)',
      mr: 'एमआयडीएच (एकात्मिक फलोत्पादन विकास अभियान)'
    },
    department: {
      en: 'Horticulture Division, Ministry of Agriculture & Farmers Welfare',
      hi: 'उद्यान एवं बागवानी प्रभाग, कृषि मंत्रालय',
      mr: 'फलोत्पादन विभाग, कृषी मंत्रालय'
    },
    category: 'Horticulture & Plantation',
    subcategory: 'Polyhouse, Shade Net & Cold Chain',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Fruits (Mango, Banana, Pomegranate, Citrus, Grapes)', 'Vegetables', 'Flowers', 'Spices'],
    targetBeneficiaries: ['Horticultural farmers', 'Farmers growing fruits & vegetables', 'Greenhouse growers'],
    applicableActivities: ['horticulture', 'agri_business', 'organic_farming'],
    benefitsAmount: 'Up to 50% Subsidy on Polyhouse, Shade Nets & Orchard Planting',
    benefits: {
      en: 'Provides 50% capital subsidy for establishing naturally ventilated polyhouses (up to ₹4.68 lakh per 1,000 sq. meters), shade net houses, pack houses, cold storage units, and orchard establishment for mango, guava, pomegranate, and citrus fruits.',
      hi: 'पॉलीहाउस, शेडनेट हाउस, पैक हाउस, कोल्ड स्टोरेज और नए फल बाग (आम, अमरूद, अनार, संतरा) लगाने के लिए 50% तक की भारी सरकारी सब्सिडी।',
      mr: 'पॉलीहाऊस, शेडनेट हाऊस, पॅक हाऊस, शीतगृह आणि नवीन फळबाग (आंबा, डाळिंब, पेरू, संत्रा) लागवडीसाठी ५०% पर्यंत भरीव शासकीय अनुदान.'
    },
    description: {
      en: 'Centrally Sponsored Scheme for the holistic growth of the horticulture sector covering fruits, vegetables, root & tuber crops, mushrooms, spices, flowers, and plantation crops.',
      hi: 'फलों, सब्जियों, मसालों और फूलों की आधुनिक संरक्षित खेती तथा मूल्य संवर्धन को बढ़ावा देने की प्रमुख योजना।',
      mr: 'फळे, भाजीपाला, फुले व मसाल्यांच्या पिकांचा सर्वांगीण विकास करणारी आणि संरक्षित शेतीला चालना देणारी केंद्र पुरस्कृत योजना.'
    },
    eligibilityOverview: {
      en: 'Individual farmers possessing suitable cultivable agricultural land with verified perennial irrigation facility.',
      hi: 'पर्याप्त जल स्रोत और अनुकूल भूमि वाले किसान जो फल, सब्जी या संरक्षित खेती करने के इच्छुक हैं।',
      mr: 'शेतात बारमाही पाण्याची सोय आणि फलोत्पादनासाठी अनुकूल जमीन असणारे शेतकरी.'
    },
    rules: [
      {
        id: 'midh-rule-1',
        conditionNumber: 10,
        conditionName: 'Horticulture Crop Cultivation',
        field: 'cropType',
        label: { en: 'Must cultivate fruits, vegetables, flowers, or spices', hi: 'फल, सब्जी, फूल या मसाले की खेती होनी चाहिए', mr: 'फळे, भाजीपाला, फुले किंवा मसाल्यांची लागवड असावी' },
        operator: 'neq',
        expectedValue: [],
        isMandatory: true,
        explanation: { en: 'Assistance is strictly allocated for horticultural crops.', hi: 'सहायता केवल बागवानी फसलों के लिए देय है।', mr: 'अनुदान केवळ फलोत्पादन पिकांसाठीच लागू आहे.' },
        failureReason: { en: 'No crops specified in profile.', hi: 'प्रोफ़ाइल में फसल नहीं चुनी गई।', mr: 'पिके निवडलेली नाहीत.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'midh-doc-1',
        name: { en: '7/12 Extract and 8-A with Perennial Water Source', hi: 'बारहमासी जल स्रोत दर्शाने वाला 7/12 व 8-अ', mr: 'बारमाही पाण्याची नोंद असलेला ७/१२ उतारा' },
        isMandatory: true,
        description: { en: 'Showing land ownership and assured irrigation source.', hi: 'भूमि स्वामित्व और पक्के पानी का प्रमाण।', mr: 'जमीन मालकी आणि शाश्वत सिंचनाचा पुरावा.' },
        issuingAuthority: { en: 'Revenue Department', hi: 'राजस्व विभाग', mr: 'महसूल विभाग' },
        helpTip: { en: 'Polyhouses require electricity connection or solar pump on site.', hi: 'पॉलीहाउस के लिए खेत पर बिजली या सोलर पंप होना जरूरी है।', mr: 'पॉलीहाऊससाठी शेतात वीज किंवा सौर पंप आवश्यक आहे.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Apply online on state horticulture portal (e.g., MahaDBT in Maharashtra, Horticulture UP).', hi: 'चरण 1: राज्य उद्यान पोर्टल पर ऑनलाइन आवेदन करें।', mr: 'पायरी १: राज्य फलोत्पादन पोर्टलवर ऑनलाइन अर्ज करा.' },
      { en: 'Step 2: District Horticulture Officer conducts site inspection and issues Administrative Approval (Prashaskiya Manyata).', hi: 'चरण 2: ज़िला उद्यान अधिकारी द्वारा भौतिक सत्यापन कर प्रशासनिक स्वीकृति दी जाती है।', mr: 'पायरी २: जागेची पाहणी करून प्रशासकीय मान्यता दिली जाते.' }
    ],
    officialUrl: 'https://midh.gov.in',
    sourceUrl: 'https://midh.gov.in/guidelines.html',
    lastVerifiedDate: '2026-10-25',
    applicationPeriod: 'Open Round the Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '011-23381012',
    badge: 'Protected Horticulture'
  },

  // 12. Pradhan Mantri Kisan Maan Dhan Yojana (PM-KMY - Pension - Central)
  {
    id: 'pm-kmy-pension',
    name: 'PM-KMY (Pradhan Mantri Kisan Maan Dhan Yojana - Pension)',
    alternativeNames: ['Kisan Pension Scheme', 'PMKMY'],
    localNames: {
      en: 'PM-KMY (Pradhan Mantri Kisan Maan Dhan Yojana - Pension)',
      hi: 'पीएम-केएमवाई (प्रधानमंत्री किसान मानधन योजना - किसान पेंशन)',
      mr: 'पीएम-केएमवाय (प्रधानमंत्री किसान मानधन योजना - शेतकरी पेन्शन)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Welfare & Life Insurance Corporation of India (LIC)',
      hi: 'कृषि एवं किसान कल्याण विभाग एवं भारतीय जीवन बीमा निगम (LIC)',
      mr: 'कृषी मंत्रालय व भारतीय जीवन विमा निगम (LIC)'
    },
    category: 'Farmer Pension & Social Security',
    subcategory: 'Old Age Contributory Pension',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops'],
    targetBeneficiaries: ['Small and marginal farmers aged 18 to 40 years'],
    applicableActivities: ['agri_business', 'horticulture', 'dairy'],
    benefitsAmount: '₹3,000 / month Assured Pension after age 60',
    benefits: {
      en: 'Assured monthly pension of ₹3,000 to small and marginal farmers upon attaining the age of 60 years. Voluntary and contributory scheme where the farmer contributes between ₹55 to ₹200 per month (depending on entry age), and the Central Government contributes an equal matching amount.',
      hi: '60 वर्ष की आयु पूरी होने पर ₹3,000 प्रति माह की निश्चित पेंशन। किसान की आयु के अनुसार मासिक अंशदान केवल ₹55 से ₹200 है, और इतनी ही राशि केंद्र सरकार अपनी ओर से जमा करती है।',
      mr: 'वयाची ६० वर्षे पूर्ण झाल्यावर दरमहा ₹३,००० ची खात्रीशीर पेन्शन. प्रवेश वयानुसार दरमहा केवळ ₹५५ ते ₹२०० शेतकरी हप्ता, आणि तितकाच हप्ता केंद्र शासन स्वतः भरते.'
    },
    description: {
      en: 'Old age protection and social security net for small and marginal cultivators who have minimal or no personal savings to sustain them in their senior years.',
      hi: 'छोटे और सीमांत किसानों के वृद्धावस्था के लिए सामाजिक सुरक्षा और निश्चित मासिक पेंशन कवच।',
      mr: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांच्या म्हातारपणासाठी सामाजिक सुरक्षा देणारे निश्चित पेन्शन कवच.'
    },
    eligibilityOverview: {
      en: 'Small and marginal farmers owning up to 2 hectares (5 acres) of cultivable land. Entry age: 18 to 40 years. Must not be covered under other social security schemes (NPS, ESIC, PM-SYM).',
      hi: '2 हेक्टेयर (5 एकड़) तक ज़मीन वाले 18 से 40 वर्ष के छोटे/सीमांत किसान। अन्य ईएसआईसी या सरकारी पेंशन का लाभार्थी नहीं होना चाहिए।',
      mr: '२ हेक्टरपर्यंत (५ एकर) जमीन असणारे १८ ते ४० वयोगटातील लहान शेतकरी.'
    },
    rules: [
      {
        id: 'pmkmy-rule-1',
        conditionNumber: 3,
        conditionName: 'Entry Age Between 18 and 40',
        field: 'age',
        label: { en: 'Entry age must be between 18 and 40 years', hi: 'प्रवेश आयु 18 से 40 वर्ष के बीच होनी चाहिए', mr: 'प्रवेश वय १८ ते ४० वर्षांच्या दरम्यान असावे' },
        operator: 'between',
        expectedValue: [18, 40],
        isMandatory: true,
        explanation: { en: 'Actuarial contribution tables are formulated for entry between 18 and 40 years.', hi: 'योजना में शामिल होने की आयु 18 से 40 वर्ष तय है।', mr: 'योजनेत नोंदणीचे वय १८ ते ४० वर्षे आहे.' },
        failureReason: { en: 'Age exceeds 40 years or is below 18 years.', hi: 'आयु 18 से 40 वर्ष के बीच नहीं है।', mr: 'वय १८ ते ४० वर्षांच्या मर्यादेत बसत नाही.' }
      },
      {
        id: 'pmkmy-rule-2',
        conditionNumber: 7,
        conditionName: 'Maximum Landholding 5 Acres (2 Hectares)',
        field: 'landholdingAcres',
        label: { en: 'Landholding must not exceed 5 acres (2 hectares)', hi: 'ज़मीन का आकार 5 एकड़ (2 हेक्टेयर) से अधिक नहीं होना चाहिए', mr: 'जमीन ५ एकरपेक्षा (२ हेक्टर) जास्त नसावी' },
        operator: 'lte',
        expectedValue: 5.0,
        isMandatory: true,
        explanation: { en: 'Restricted strictly to small and marginal farmers.', hi: 'यह केवल छोटे और सीमांत किसानों के लिए है।', mr: 'केवळ अल्प व अत्यल्प भूधारक शेतकऱ्यांसाठी राखीव.' },
        failureReason: { en: 'Landholding exceeds 5 acres threshold for small farmers.', hi: 'ज़मीन 5 एकड़ से अधिक है।', mr: 'जमीन ५ एकरपेक्षा जास्त आहे.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pmkmy-doc-1',
        name: { en: 'Aadhaar Card and Savings Bank Passbook', hi: 'आधार कार्ड एवं बैंक पासबुक', mr: 'आधार कार्ड व बँक पासबुक' },
        isMandatory: true,
        description: { en: 'For auto-debit of monthly contribution and biometric eKYC.', hi: 'मासिक अंशदान के ऑटो-डेबिट के लिए।', mr: 'मासिक हप्ता खात्यातून परस्पर वर्ग होण्यासाठी.' },
        issuingAuthority: { en: 'UIDAI / Bank', hi: 'यूआईडीएआई / बैंक', mr: 'बँक / आधार' },
        helpTip: { en: 'Farmers can opt to have contributions deducted directly from their PM-KISAN installments.', hi: 'किसान चाहें तो अपनी पीएम-किसान किस्त से ही पेंशन अंशदान कटवा सकते हैं।', mr: 'पीएम-किसानच्या हप्त्यातूनच पेन्शनचा हप्ता परस्पर वळता करता येतो.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Visit nearest Common Service Center (CSC) or visit maandhan.in.', hi: 'चरण 1: नज़दीकी सीएससी केंद्र पर जाएं या maandhan.in खोलें।', mr: 'पायरी १: जवळच्या सीएससी केंद्रात जा किंवा maandhan.in उघडा.' },
      { en: 'Step 2: Authenticate via Aadhaar biometric; Kisan Pension Card is issued immediately.', hi: 'चरण 2: बायोमेट्रिक सत्यापन करा; तुरंत किसान पेंशन कार्ड जारी हो जाता है।', mr: 'पायरी २: बायोमेट्रिक पडताळणी करा; त्वरित किसान पेन्शन कार्ड मिळते.' }
    ],
    officialUrl: 'https://maandhan.in',
    sourceUrl: 'https://pmkmy.gov.in',
    lastVerifiedDate: '2026-11-01',
    applicationPeriod: 'Open 365 Days a Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-267-6888 (Toll-Free LIC/MaanDhan)',
    badge: 'Social Security Pension'
  },

  // 13. Agriculture Infrastructure Fund (AIF - Infrastructure & Storage - Central)
  {
    id: 'aif-storage',
    name: 'Agriculture Infrastructure Fund (AIF - Storage & Processing)',
    alternativeNames: ['AIF Loan Subsidy', 'Post Harvest Infrastructure Fund'],
    localNames: {
      en: 'Agriculture Infrastructure Fund (AIF - Storage & Processing)',
      hi: 'कृषि अवसंरचना कोष (एआईएफ - गोदाम, कोल्ड स्टोरेज एवं प्रसंस्करण)',
      mr: 'कृषी पायाभूत सुविधा निधी (एआयएफ - गोदामे व शीतगृह)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Welfare, GoI',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      mr: 'कृषी आणि शेतकरी कल्याण विभाग, भारत सरकार'
    },
    category: 'Agricultural Storage & Warehouses',
    subcategory: 'Warehouses, Cold Storage & Sorting Units',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops', 'Grains', 'Fruits', 'Vegetables', 'Pulses'],
    targetBeneficiaries: ['Farmers', 'FPOs', 'Primary Agricultural Credit Societies (PACS)', 'Agri-entrepreneurs'],
    applicableActivities: ['food_processing', 'agri_business', 'storage_warehousing'],
    benefitsAmount: '3% Interest Subvention on Loans up to ₹2 Crore for 7 Years',
    benefits: {
      en: 'Provides 3% annual interest subvention on term loans up to ₹2 Crore for establishing post-harvest management infrastructure (warehouses, silos, cold storage, ripening chambers, sorting/grading units). Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore.',
      hi: 'गोदाम, कोल्ड स्टोरेज, साइलो, ग्रेडिंग और पैकेजिंग यूनिट लगाने के लिए ₹2 करोड़ तक के ऋण पर 7 वर्षों तक 3% की वार्षिक ब्याज छूट और सीजीटीएमएसई के तहत बिना गारंटी लोन।',
      mr: 'शेतमाल साठवणूक, गोदामे, शीतगृह आणि प्रतवारी युनिट उभारण्यासाठी ₹२ कोटींपर्यंतच्या कर्जावर ७ वर्षांसाठी ३% व्याज सवलत आणि हमीमुक्त कर्ज.'
    },
    description: {
      en: 'Pan-India financing facility of ₹1 lakh crore for building viable post-harvest agricultural infrastructure and community farming assets to prevent distress selling.',
      hi: 'फसल कटाई के बाद के नुकसान को रोकने और किसानों को अपनी उपज का सही मूल्य दिलाने के लिए ₹1 लाख करोड़ का राष्ट्रीय अवसंरचना कोष।',
      mr: 'शेतकऱ्यांना शेतमाल साठवून योग्य भाव मिळवून देण्यासाठी गोदामे व प्रक्रिया केंद्र उभारण्यासाठी १ लाख कोटींचा देशव्यापी निधी.'
    },
    eligibilityOverview: {
      en: 'Farmers, FPOs, PACS, and Agri-entrepreneurs proposing to build post-harvest storage, processing, or testing infrastructure.',
      hi: 'किसान, एफपीओ और उद्यमी जो गोदाम, कोल्ड स्टोरेज या प्रसंस्करण केंद्र लगाना चाहते हैं।',
      mr: 'शेतकरी, शेतकरी उत्पादक कंपन्या (FPO) आणि उद्योजक जे शेतमाल साठवणूक केंद्र उभारू इच्छितात.'
    },
    rules: [
      {
        id: 'aif-rule-1',
        conditionNumber: 15,
        conditionName: 'Storage / Infrastructure Need',
        field: 'farmingNeeds',
        label: { en: 'Requires storage, warehousing, or infrastructure assistance', hi: 'गोदाम, भंडारण या अवसंरचना की आवश्यकता होनी चाहिए', mr: 'गोदाम, साठवणूक किंवा पायाभूत सुविधांची गरज असावी' },
        operator: 'in',
        expectedValue: ['storage_warehousing', 'agricultural_infrastructure', 'agri_business'],
        isMandatory: true,
        explanation: { en: 'AIF strictly funds post-harvest physical infrastructure.', hi: 'यह कोष केवल कटाई पश्चात बुनियादी ढांचे के लिए ऋण देता है।', mr: 'हा निधी केवळ काढणीपश्चात शेतमाल साठवणूक केंद्रांसाठी कर्ज देतो.' },
        failureReason: { en: 'Storage or infrastructure need not indicated in profile.', hi: 'प्रोफ़ाइल में भंडारण या अवसंरचना की आवश्यकता शामिल नहीं है।', mr: 'साठवणूक किंवा गोदाम गरज निवडलेली नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'aif-doc-1',
        name: { en: 'Detailed Project Report (DPR) & Land Title / Lease', hi: 'विस्तृत प्रोजेक्ट रिपोर्ट (DPR) एवं भूमि अभिलेख / पट्टा', mr: 'सविस्तर प्रकल्प अहवाल (DPR) व जागेचा ७/१२ उतारा' },
        isMandatory: true,
        description: { en: 'Technical and financial viability report for bank loan sanction.', hi: 'बैंक ऋण स्वीकृति हेतु तकनीकी एवं वित्तीय रिपोर्ट।', mr: 'बँक कर्ज मंजुरीसाठी तांत्रिक व आर्थिक व्यवहार्यता अहवाल.' },
        issuingAuthority: { en: 'Chartered Engineer / Chartered Accountant / Self', hi: 'सीए / चार्टर्ड इंजीनियर', mr: 'सीए / अधिकृत अभियंता' },
        helpTip: { en: 'Standard DPR templates are available for download on agriinfra.dac.gov.in.', hi: 'पोर्टल पर मानक डीपीआर प्रारूप निःशुल्क उपलब्ध हैं।', mr: 'पोर्टलवर मोफत डीपीआर नमुने उपलब्ध आहेत.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Register on the online AIF portal (agriinfra.dac.gov.in) and upload basic borrower details.', hi: 'चरण 1: agriinfra.dac.gov.in पोर्टल पर पंजीकरण करें।', mr: 'पायरी १: agriinfra.dac.gov.in पोर्टलवर नोंदणी करा.' },
      { en: 'Step 2: Submit DPR and select preferred lending bank; Ministry approves in principle within 7 days, followed by bank appraisal.', hi: 'चरण 2: डीपीआर अपलोड करें और बैंक चुनें; 7 दिनों में मंत्रालय से प्रारंभिक सहमति मिलती है।', mr: 'पायरी २: डीपीआर सादर करा व बँक निवडा; ७ दिवसांत प्राथमिक मंजुरी मिळते.' }
    ],
    officialUrl: 'https://agriinfra.dac.gov.in',
    sourceUrl: 'https://agricoop.nic.in/en/aif',
    lastVerifiedDate: '2026-10-27',
    applicationPeriod: 'Open Round the Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '011-23381012',
    badge: 'Infrastructure Fund'
  },

  // 14. Mukhyamantri Kisan Kalyan Yojana (State - Madhya Pradesh)
  {
    id: 'mp-kisan-kalyan',
    name: 'Mukhyamantri Kisan Kalyan Yojana (Madhya Pradesh)',
    alternativeNames: ['MP Kisan Kalyan', 'CM Kisan MP'],
    localNames: {
      en: 'Mukhyamantri Kisan Kalyan Yojana (Madhya Pradesh)',
      hi: 'मुख्यमंत्री किसान कल्याण योजना (मध्य प्रदेश)',
      mr: 'मुख्यमंत्री किसान कल्याण योजना (मध्य प्रदेश)'
    },
    department: {
      en: 'Farmer Welfare & Agriculture Development Department, Govt of Madhya Pradesh',
      hi: 'किसान कल्याण एवं कृषि विकास विभाग, मध्य प्रदेश शासन',
      mr: 'शेतकरी कल्याण व कृषी विकास विभाग, मध्य प्रदेश शासन'
    },
    category: 'Income Support & Direct Assistance',
    subcategory: 'State Direct Financial Assistance',
    type: 'state',
    stateCoverage: ['Madhya Pradesh'],
    cropCoverage: ['Soybean', 'Wheat', 'Gram', 'Mustard', 'All Crops'],
    targetBeneficiaries: ['All landowning PM-KISAN beneficiary farmers of Madhya Pradesh'],
    applicableActivities: ['agri_business', 'horticulture'],
    benefitsAmount: '₹6,000 / year (State Top-Up in 3 installments)',
    benefits: {
      en: 'Provides ₹6,000 per year directly to PM-KISAN beneficiary farmers in Madhya Pradesh in two/three installments, giving a total of ₹12,000/year when combined with PM-KISAN.',
      hi: 'मध्य प्रदेश के पात्र किसानों को राज्य सरकार द्वारा ₹6,000 वार्षिक (पीएम-किसान के साथ मिलाकर कुल ₹12,000 प्रति वर्ष)।',
      mr: 'मध्य प्रदेशातील शेतकऱ्यांना राज्य शासनाकडून वार्षिक ₹६,००० चे अतिरिक्त सहाय्य (एकूण ₹१२,००० थेट लाभ).'
    },
    description: {
      en: 'State government welfare programme in Madhya Pradesh providing financial assistance to ease input procurement costs for farming families.',
      hi: 'मध्य प्रदेश सरकार द्वारा किसानों को बीज-खाद की लागत में मदद के लिए संचालित सीधी आय सहायता योजना।',
      mr: 'मध्य प्रदेश शासनाची शेतकऱ्यांना थेट आर्थिक मदत देणारी कल्याणकारी योजना.'
    },
    eligibilityOverview: {
      en: 'Resident farmer of Madhya Pradesh owning cultivable land with active, verified PM-KISAN enrollment.',
      hi: 'मध्य प्रदेश का निवासी किसान जो सक्रिय पीएम-किसान का लाभार्थी हो।',
      mr: 'मध्य प्रदेशातील रहिवासी शेतकरी ज्यांचे पीएम-किसान खाते सक्रिय आहे.'
    },
    rules: [
      {
        id: 'mpk-rule-1',
        conditionNumber: 1,
        conditionName: 'Madhya Pradesh State Resident',
        field: 'state',
        label: { en: 'Must be a resident and landholder in Madhya Pradesh', hi: 'मध्य प्रदेश का निवासी और वहां भूमि स्वामी होना चाहिए', mr: 'मध्य प्रदेशातील रहिवासी शेतकरी असणे आवश्यक' },
        operator: 'eq',
        expectedValue: 'Madhya Pradesh',
        isMandatory: true,
        explanation: { en: 'Funded exclusively by the Government of Madhya Pradesh.', hi: 'यह केवल मध्य प्रदेश के किसानों के लिए है।', mr: 'केवळ मध्य प्रदेशातील शेतकऱ्यांसाठी लागू.' },
        failureReason: { en: 'Farmer state profile is not Madhya Pradesh.', hi: 'राज्य मध्य प्रदेश नहीं है।', mr: 'मध्य प्रदेश राज्य निवडलेले नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'mpk-doc-1',
        name: { en: 'MP Samagra ID & Land Khasra Details', hi: 'समग्र आईडी एवं खसरा-खतौनी', mr: 'समग्र आयडी व शेतजमीन महसूल नोंद' },
        isMandatory: true,
        description: { en: 'Samagra portal identity for state welfare distribution.', hi: 'समग्र पोर्टल पहचान संख्या।', mr: 'मध्य प्रदेश समग्र पोर्टल नोंदणी.' },
        issuingAuthority: { en: 'MP Samagra Samajik Suraksha Mission', hi: 'समग्र सामाजिक सुरक्षा मिशन', mr: 'समग्र पोर्टल' },
        helpTip: { en: 'Ensure your Samagra eKYC is verified with Aadhaar.', hi: 'समग्र ई-केवाईसी आधार से सत्यापित कराएं।', mr: 'समग्र ई-केवायसी आधारशी लिंक असावे.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Check beneficiary status on saara.mp.gov.in portal or via local Patwari.', hi: 'चरण 1: saara.mp.gov.in पोर्टल पर स्थिति देखें या पटवारी से मिलें।', mr: 'पायरी १: saara.mp.gov.in वर स्थिती तपासा किंवा पटवाऱ्यांशी संपर्क साधा.' }
    ],
    officialUrl: 'https://saara.mp.gov.in',
    sourceUrl: 'https://mpkrishi.mp.gov.in',
    lastVerifiedDate: '2026-10-29',
    applicationPeriod: 'Automatic Alignment with State Revenue Portal',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '0755-2558332',
    badge: 'MP State Income Support'
  },

  // 15. Rythu Bandhu / Rythu Bharosa (State - Telangana / Andhra Pradesh)
  {
    id: 'rythu-support',
    name: 'Rythu Bharosa / Direct Investment Support (Telangana & AP)',
    alternativeNames: ['Rythu Bandhu', 'Farmer Investment Support Scheme'],
    localNames: {
      en: 'Rythu Bharosa / Direct Investment Support (Telangana & Andhra Pradesh)',
      hi: 'रायथू भरोसा / किसान निवेश सहायता योजना (तेलंगाना एवं आंध्र प्रदेश)',
      mr: 'रायथू भरोसा / थेट शेती गुंतवणूक सहाय्य (तेलंगणा व आंध्र प्रदेश)'
    },
    department: {
      en: 'Agriculture & Cooperation Department, Govt of Telangana & Andhra Pradesh',
      hi: 'कृषि एवं सहकारिता विभाग, राज्य शासन',
      mr: 'कृषी व सहकार विभाग'
    },
    category: 'Seeds, Fertilizers & Agricultural Inputs',
    subcategory: 'Per-Acre Input Subsidy',
    type: 'state',
    stateCoverage: ['Telangana', 'Andhra Pradesh'],
    cropCoverage: ['Paddy', 'Cotton', 'Chilli', 'Maize', 'All Crops'],
    targetBeneficiaries: ['Landowner farmers', 'Tenant farmers (with CCRC card in AP)'],
    applicableActivities: ['agri_business', 'horticulture'],
    benefitsAmount: 'Up to ₹10,000 to ₹15,000 / acre per year',
    benefits: {
      en: 'Direct financial investment assistance calculated on per-acre basis (e.g. ₹10,000-₹15,000/acre/year in two agricultural seasons) credited straight into bank accounts before Kharif and Rabi sowings to purchase seeds, fertilizers, and field labor.',
      hi: 'बीज, खाद और बुवाई खर्च के लिए प्रति एकड़ ₹10,000 से ₹15,000 वार्षिक की सीधी आर्थिक मदद, जो खरीफ और रबी की बुवाई से ठीक पहले खाते में भेजी जाती है।',
      mr: 'बियाणे, खते आणि मजुरीच्या खर्चासाठी एकरी ₹१०,००० ते ₹१५,००० पर्यंत थेट खात्यात जमा होणारी हंगामनिहाय गुंतवणूक मदत.'
    },
    description: {
      en: 'Pioneering agricultural input subsidy model ensuring smallholders never have to borrow from private lenders at peak sowing times.',
      hi: 'बुवाई के समय किसानों को खाद-बीज खरीदने के लिए नकद सहायता देने वाली अग्रणी राज्य योजना।',
      mr: 'पेरणीच्या तोंडावर शेतकऱ्याला सावकाराकडे हात पसरण्याची वेळ येऊ नये म्हणून एकरी थेट मदत देणारी योजना.'
    },
    eligibilityOverview: {
      en: 'Farmers holding Pattadar Passbook in Telangana or AP. In Andhra Pradesh, tenant farmers holding Crop Cultivator Rights Card (CCRC) are also eligible.',
      hi: 'पट्टादार पासबुक धारक किसान या वैध सीसीआरसी कार्ड धारक किरायेदार किसान।',
      mr: 'पट्टादार पासबुक असणारे शेतकरी किंवा भाडेपट्टा हक्क कार्ड (CCRC) धारक शेतकरी.'
    },
    rules: [
      {
        id: 'rythu-rule-1',
        conditionNumber: 1,
        conditionName: 'State Coverage Telangana / AP',
        field: 'state',
        label: { en: 'Must cultivate land in Telangana or Andhra Pradesh', hi: 'तेलंगाना या आंध्र प्रदेश का किसान होना चाहिए', mr: 'तेलंगणा किंवा आंध्र प्रदेशातील शेतकरी असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['Telangana', 'Andhra Pradesh'],
        isMandatory: true,
        explanation: { en: 'Funded by the respective state governments.', hi: 'यह संबंधित राज्य सरकारों द्वारा वित्तपोषित है।', mr: 'संबंधित राज्य शासनाची योजना आहे.' },
        failureReason: { en: 'Farmer state profile is outside Telangana/AP.', hi: 'राज्य तेलंगाना या आंध्र प्रदेश नहीं है।', mr: 'राज्य तेलंगणा किंवा आंध्र प्रदेश नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'rythu-doc-1',
        name: { en: 'Pattadar Passbook / Dharani Title or CCRC Agreement', hi: 'पट्टादार पासबुक / धरणी रिकॉर्ड या सीसीआरसी', mr: 'पट्टादार पासबुक / धरणी नोंद किंवा CCRC करार' },
        isMandatory: true,
        description: { en: 'State revenue document with digital survey acreage.', hi: 'रकबा दर्शाने वाला डिजिटल भू-अभिलेख।', mr: 'डिजिटल महसूल उतारा व क्षेत्र नोंद.' },
        issuingAuthority: { en: 'Revenue Department / Dharani Portal', hi: 'राजस्व विभाग', mr: 'महसूल विभाग' },
        helpTip: { en: 'Tenant farmers in AP must obtain CCRC signed by land owner for 11 months.', hi: 'आंध्र प्रदेश में किरायेदार किसान ज़मीन मालिक से हस्ताक्षरित सीसीआरसी कार्ड लगाएं।', mr: 'भाडेकरू शेतकऱ्यांना ११ महिन्यांचा CCRC दाखला लागतो.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Check land status on Dharani (Telangana) or Meebhoomi (AP); money is disbursed automatically prior to sowing.', hi: 'चरण 1: धरणी या मीभूमि पोर्टल पर भूमि विवरण जांचें; राशि स्वतः जारी होती है।', mr: 'पायरी १: धरणी किंवा मीभूमी पोर्टलवर नोंद तपासा; रक्कम खात्यात आपोआप जमा होते.' }
    ],
    officialUrl: 'https://dharani.telangana.gov.in',
    sourceUrl: 'https://karshak.telangana.gov.in',
    lastVerifiedDate: '2026-10-31',
    applicationPeriod: 'Seasonal Release (May-June Kharif / Nov-Dec Rabi)',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '1800-425-3502',
    badge: 'Input Investment Grant'
  },

  // 16. Krushak Assistance for Livelihood and Income Augmentation (KALIA - Odisha)
  {
    id: 'kalia-odisha',
    name: 'KALIA Scheme (Odisha - Livelihood & Cultivator Support)',
    alternativeNames: ['KALIA Yojana Odisha', 'Krushak Assistance'],
    localNames: {
      en: 'KALIA Scheme (Odisha - Livelihood & Cultivator Support)',
      hi: 'कालिया योजना (ओडिशा - कृषक आजीविका एवं आय संवर्धन)',
      mr: 'कालिया योजना (ओडिशा - शेतकरी उपजीविका व उत्पन्न वाढ)'
    },
    department: {
      en: 'Department of Agriculture & Farmers Empowerment, Govt of Odisha',
      hi: 'कृषि एवं किसान सशक्तिकरण विभाग, ओडिशा सरकार',
      mr: 'कृषी व शेतकरी सक्षमीकरण विभाग, ओडिशा शासन'
    },
    category: 'Small & Marginal Farmer Support',
    subcategory: 'Comprehensive Income & Landless Labor Assistance',
    type: 'state',
    stateCoverage: ['Odisha'],
    cropCoverage: ['Paddy', 'Pulses', 'Millets', 'Oilseeds', 'All Crops'],
    targetBeneficiaries: ['Small and marginal farmers', 'Landless agricultural laborers', 'Sharecroppers'],
    applicableActivities: ['poultry', 'goat_sheep', 'dairy', 'fisheries', 'agri_business'],
    benefitsAmount: '₹10,000 / year for Cultivators + ₹12,500 for Landless Laborers',
    benefits: {
      en: 'Provides ₹10,000 per family per year in two installments for small/marginal farmers and sharecroppers for farm inputs. Additionally provides ₹12,500 livelihood assistance to landless agricultural households for small dairy, goat rearing, or poultry units.',
      hi: 'छोटे किसानों और बटाईदारों को खाद-बीज के लिए ₹10,000 वार्षिक और भूमिहीन कृषि मजदूरों को बकरी पालन या मुर्गी पालन के लिए ₹12,500 की आजीविका सहायता।',
      mr: 'लहान शेतकरी व बटाईदारांना ₹१०,००० वार्षिक आणि भूमिहीन शेतमजुरांना शेळीपालन किंवा कुक्कुटपालनासाठी ₹१२,५०० थेट उपजीविका अनुदान.'
    },
    description: {
      en: 'Progressive welfare package covering not only landowners but explicitly embracing sharecroppers and landless rural laborers with livelihood assets and life insurance.',
      hi: 'ज़मीन मालिकों के साथ-साथ बटाईदारों और भूमिहीन मजदूरों को भी नकद सहायता और बीमा कवच देने वाली व्यापक योजना।',
      mr: 'जमीन मालकांसह भूमिहीन शेतमजूर आणि कुळ शेतकऱ्यांनाही उपजीविकेची साधने देणारी सर्वसमावेशक योजना.'
    },
    eligibilityOverview: {
      en: 'Small/marginal farmers, sharecroppers, and landless agricultural households residing in Odisha. Urban residents and income tax payees excluded.',
      hi: 'ओडिशा के छोटे किसान, बटाईदार और भूमिहीन ग्रामीण मजदूर। आयकर दाता अपात्र हैं।',
      mr: 'ओडिशातील लहान शेतकरी, कुळ व भूमिहीन शेतमजूर.'
    },
    rules: [
      {
        id: 'kalia-rule-1',
        conditionNumber: 1,
        conditionName: 'Odisha State Resident',
        field: 'state',
        label: { en: 'Must be a resident of Odisha', hi: 'ओडिशा राज्य का निवासी होना चाहिए', mr: 'ओडिशा राज्यातील रहिवासी असणे आवश्यक' },
        operator: 'eq',
        expectedValue: 'Odisha',
        isMandatory: true,
        explanation: { en: 'KALIA is funded exclusively by the Government of Odisha.', hi: 'यह केवल ओडिशा के निवासियों के लिए है।', mr: 'केवळ ओडिशातील रहिवाशांसाठी लागू.' },
        failureReason: { en: 'Farmer state is not Odisha.', hi: 'राज्य ओडिशा नहीं है।', mr: 'ओडिशा राज्य निवडलेले नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'kalia-doc-1',
        name: { en: 'Ration Card / Food Security Card & Aadhaar', hi: 'राशन कार्ड (खाद्य सुरक्षा कार्ड) एवं आधार', mr: 'रेशन कार्ड व आधार कार्ड' },
        isMandatory: true,
        description: { en: 'Used for family enumeration and economic verification.', hi: 'पारिवारिक एवं आर्थिक सत्यापन के लिए।', mr: 'कुटुंब पडताळणीसाठी.' },
        issuingAuthority: { en: 'Food Supplies & Consumer Welfare Dept', hi: 'खाद्य आपूर्ति विभाग', mr: 'अन्न व नागरी पुरवठा विभाग' },
        helpTip: { en: 'Aadhaar must be linked to your bank account for DBT.', hi: 'बैंक खाते से आधार लिंक होना अनिवार्य है।', mr: 'बँक खात्याशी आधार जोडलेले असावे.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Check your name in the Gram Panchayat KALIA beneficiary draft list or register on kalia.odisha.gov.in.', hi: 'चरण 1: ग्राम पंचायत सूची में नाम देखें या kalia.odisha.gov.in पर पंजीकरण करें।', mr: 'पायरी १: ग्रामपंचायत यादीत नाव तपासा किंवा kalia.odisha.gov.in वर नोंदणी करा.' }
    ],
    officialUrl: 'https://kalia.odisha.gov.in',
    sourceUrl: 'https://agri.odisha.gov.in',
    lastVerifiedDate: '2026-10-24',
    applicationPeriod: 'Ongoing Verification by Gram Panchayats',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '1800-572-1122 (KALIA Helpline)',
    badge: 'Cultivator & Landless Shield'
  },

  // 17. Vidarbha-Marathwada Drought Relief & Farm Pond Package (District-Specific - Maharashtra)
  {
    id: 'vidarbha-marathwada-package',
    name: 'Vidarbha-Marathwada Special Drought Mitigation & Magel Tyala Shettale Package',
    alternativeNames: ['Magel Tyala Shettale', 'Vidarbha Farm Pond Subsidy'],
    localNames: {
      en: 'Vidarbha-Marathwada Special Drought Mitigation & Magel Tyala Shettale Package',
      hi: 'विदर्भ-मराठवाड़ा सूखा राहत एवं खेत तालाब पैकेज (मागेल त्याला शेततळे)',
      mr: 'विदर्भ-मराठवाडा दुष्काळ निवारण व मागेल त्याला शेततळे विशेष पॅकेज'
    },
    department: {
      en: 'Agriculture Department & Relief and Rehabilitation, Government of Maharashtra',
      hi: 'कृषि एवं राहत विभाग, महाराष्ट्र शासन',
      mr: 'कृषी व मदत-पुनर्वसन विभाग, महाराष्ट्र शासन'
    },
    category: 'Disaster Relief & Crop Compensation',
    subcategory: 'Drought Mitigation & On-Demand Farm Ponds',
    type: 'state',
    stateCoverage: ['Maharashtra'],
    districtCoverage: [
      'Yavatmal', 'Amravati', 'Akola', 'Buldhana', 'Washim', 'Wardha',
      'Aurangabad', 'Jalna', 'Parbhani', 'Beed', 'Nanded', 'Osmanabad', 'Latur', 'Hingoli'
    ],
    cropCoverage: ['Cotton', 'Soybean', 'Pulses', 'Oilseeds', 'All Crops'],
    targetBeneficiaries: ['Farmers in 14 agrarian distress-prone districts of Vidarbha and Marathwada'],
    applicableActivities: ['agri_business', 'fisheries', 'horticulture'],
    benefitsAmount: 'Up to ₹75,000 Direct Subsidy for Farm Pond Construction + Plastic In-Lining',
    benefits: {
      en: 'Provides ₹50,000 to ₹75,000 direct subsidy for individual farm pond (Shettale) excavation with additional plastic in-lining assistance to store rainwater. Guarantees protective irrigation for cotton and soybean crops during monsoon dry spells.',
      hi: 'विदर्भ और मराठवाड़ा के 14 सूखा प्रभावित ज़िलों में खेत तालाब (शेततळे) खोदने और प्लास्टिक इन-लाइनिंग के लिए ₹75,000 तक की सीधी सरकारी सब्सिडी।',
      mr: 'विदर्भ आणि मराठवाड्यातील १४ दुष्काळग्रस्त जिल्ह्यांमध्ये शेततळे खोदण्यासाठी आणि प्लॅस्टिक अस्तरीकरणासाठी ₹७५,००० पर्यंत थेट शासकीय अनुदान. पावसाच्या खंडात पिकांना जीवदान देणारी योजना.'
    },
    description: {
      en: 'High-priority regional package targeted at 14 drought-prone districts of Vidarbha and Marathwada to prevent agrarian distress and drought vulnerability through on-demand farm ponds.',
      hi: 'विदर्भ और मराठवाड़ा के 14 संवेदनशील ज़िलों में सूखे से निपटने और किसानों को आत्मनिर्भर बनाने के लिए विशेष ज़िला पैकेज।',
      mr: 'विदर्भ आणि मराठवाड्यातील १४ आत्महत्याग्रस्त व दुष्काळी जिल्ह्यांसाठी मागणीनुसार शेततळे देणारे विशेष शासकीय पॅकेज.'
    },
    eligibilityOverview: {
      en: 'Farmers holding minimum 0.60 hectare (1.5 acres) land in notified districts of Vidarbha (Yavatmal, Amravati, Akola, Buldhana, Washim, Wardha) and Marathwada (Beed, Latur, Osmanabad, Nanded, Parbhani, Jalna, Aurangabad, Hingoli).',
      hi: 'विदर्भ और मराठवाड़ा के 14 अधिसूचित ज़िलों में कम से कम 1.5 एकड़ ज़मीन के मालिक किसान।',
      mr: 'विदर्भ व मराठवाड्यातील १४ अधिसूचित जिल्ह्यांतील किमान १.५ एकर जमीनधारक शेतकरी.'
    },
    isDistrictSpecific: true,
    rules: [
      {
        id: 'vm-rule-1',
        conditionNumber: 1,
        conditionName: 'Notified Drought Districts Check',
        field: 'district',
        label: { en: 'Must belong to notified 14 districts of Vidarbha or Marathwada', hi: 'विदर्भ या मराठवाड़ा के 14 अधिसूचित ज़िलों में खेत होना चाहिए', mr: 'विदर्भ किंवा मराठवाड्यातील १४ अधिसूचित जिल्ह्यांत शेत असणे आवश्यक' },
        operator: 'in',
        expectedValue: [
          'Yavatmal', 'Amravati', 'Akola', 'Buldhana', 'Washim', 'Wardha',
          'Aurangabad', 'Jalna', 'Parbhani', 'Beed', 'Nanded', 'Osmanabad', 'Latur', 'Hingoli'
        ],
        isMandatory: true,
        explanation: { en: 'District-specific scheme notified under Government Resolution for agrarian distress relief.', hi: 'यह विशेष पैकेज केवल इन 14 चयनित ज़िलों के लिए अधिसूचित है।', mr: 'हे विशेष पॅकेज केवळ या १४ जिल्ह्यांसाठीच लागू आहे.' },
        failureReason: { en: 'Your district is outside the 14 notified Vidarbha-Marathwada package districts.', hi: 'आपका ज़िला इस विशेष पैकेज के अंतर्गत नहीं आता है।', mr: 'आपला जिल्हा या विशेष पॅकेज अंतर्गत येत नाही.' }
      },
      {
        id: 'vm-rule-2',
        conditionNumber: 7,
        conditionName: 'Minimum Land for Pond Excavation',
        field: 'landholdingAcres',
        label: { en: 'Minimum 1.5 acres of landholding for farm pond siting', hi: 'तालाब निर्माण के लिए न्यूनतम 1.5 एकड़ ज़मीन होनी चाहिए', mr: 'शेततळ्यासाठी किमान १.५ एकर जमीन असणे आवश्यक' },
        operator: 'gte',
        expectedValue: 1.5,
        isMandatory: true,
        explanation: { en: 'Pond size 30m x 30m requires minimum 1.5 acres to avoid reducing cultivated crop acreage excessively.', hi: 'तालाब के लिए न्यूनतम 1.5 एकड़ ज़मीन जरूरी है।', mr: 'शेततळ्यासाठी किमान क्षेत्र लागते.' },
        failureReason: { en: 'Landholding is less than 1.5 acres.', hi: 'ज़मीन 1.5 एकड़ से कम है।', mr: 'जमीन १.५ एकरपेक्षा कमी आहे.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'vm-doc-1',
        name: { en: '7/12 & 8-A Extract & Farm Site Map (Gat Nakasha)', hi: '7/12, 8-अ व गट नकाशा', mr: '७/१२, ८-अ आणि गट नकाशा' },
        isMandatory: true,
        description: { en: 'Showing slope and natural water collection contour.', hi: 'पानी के बहाव की दिशा दर्शाने वाला खेत का नक्शा।', mr: 'पाणी साचण्याची जागा दर्शवणारा अधिकृत गट नकाशा.' },
        issuingAuthority: { en: 'Talathi / Land Records Dept', hi: 'पटवारी / भूमि अभिलेख', mr: 'तलाठी / भूमी अभिलेख' },
        helpTip: { en: 'Pond must not be built within flood zone of rivers.', hi: 'तालाब नदी के बाढ़ क्षेत्र में नहीं होना चाहिए।', mr: 'शेततळे नाल्याच्या किंवा नदीच्या पूररेषेत नसावे.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Apply on MahaDBT Farmer Schemes under "Magel Tyala Shettale".', hi: 'चरण 1: महाडीबीटी पोर्टल पर "मागेल त्याला शेततळे" में आवेदन करें।', mr: 'पायरी १: महाडीबीटीवर "मागेल त्याला शेततळे" अंतर्गत अर्ज करा.' },
      { en: 'Step 2: Complete excavation, upload GPS geotagged photo; subsidy released via DBT in 2 installments.', hi: 'चरण 2: काम पूरा करके जीपीएस फोटो अपलोड करें; पैसा सीधे खाते में जमा होगा।', mr: 'पायरी २: काम पूर्ण करून जिओटॅग फोटो अपलोड करा; अनुदान खात्यात जमा होते.' }
    ],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    sourceUrl: 'https://krishi.maharashtra.gov.in',
    lastVerifiedDate: '2026-11-02',
    applicationPeriod: 'Open on Continuous Demand',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-233-4000',
    badge: 'District-Specific Drought Relief'
  },

  // 18. Soil Health Card Scheme (Soil & Inputs - Central)
  {
    id: 'shcs',
    name: 'Soil Health Card Scheme (SHCS)',
    alternativeNames: ['Mridha Swasthya Card', 'Soil Test Advisory'],
    localNames: {
      en: 'Soil Health Card Scheme (SHCS)',
      hi: 'मृदा स्वास्थ्य कार्ड योजना (सॉइल हेल्थ कार्ड)',
      mr: 'मृदा आरोग्य पत्रिका योजना (सॉईल हेल्थ कार्ड)'
    },
    department: {
      en: 'Integrated Nutrient Management Division, Ministry of Agriculture',
      hi: 'एकीकृत पोषक तत्व प्रबंधन प्रभाग, कृषि मंत्रालय',
      mr: 'एकात्मिक पोषणद्रव्ये व्यवस्थापन विभाग, कृषी मंत्रालय'
    },
    category: 'Soil Health & Land Development',
    subcategory: 'Soil Testing & Nutrient Management',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['All Crops'],
    targetBeneficiaries: ['All farmers cultivating land across India'],
    applicableActivities: ['organic_farming', 'horticulture', 'agri_business'],
    benefitsAmount: '100% Free Soil Nutrient Testing & Customized Advisory',
    benefits: {
      en: 'Free laboratory testing of soil samples across 12 crucial parameters with custom fertilizer dosages, saving 15-20% on unnecessary chemical fertilizer costs.',
      hi: '12 प्रमुख पोषक तत्वों की मुफ्त मिट्टी जांच रिपोर्ट और फसलवार सटीक खाद की सिफारिश, जिससे यूरिया/डीएपी के खर्च में 15-20% की बचत होती है।',
      mr: 'मातीतील १२ महत्त्वाच्या घटकांची मोफत प्रयोगशाळा तपासणी व पिकांनुसार अचूक खतमात्रा शिफारस, ज्यामुळे खतांच्या खर्चात १५-२०% बचत होते.'
    },
    description: {
      en: 'Guides farmers on scientifically balanced fertilizer application based on exact soil deficiency.',
      hi: 'मिट्टी की वास्तविक गुणवत्ता के अनुसार संतुलित खाद के उपयोग का वैज्ञानिक मार्गदर्शन देने वाली योजना।',
      mr: 'जमिनीच्या पोत आणि गरजेनुसार संतुलित खतांचा वापर करण्यास मार्गदर्शन करणारी देशव्यापी योजना.'
    },
    eligibilityOverview: {
      en: 'Open to all farmers cultivating agricultural land in India. No land size restriction.',
      hi: 'भारत में कृषि कार्य करने वाले सभी किसानों के लिए खुली है। ज़मीन के आकार की कोई पाबंदी नहीं।',
      mr: 'भारतात शेती करणाऱ्या सर्व शेतकऱ्यांसाठी विनामूल्य उपलब्ध.'
    },
    rules: [
      {
        id: 'shcs-rule-1',
        conditionNumber: 15,
        conditionName: 'Active Agricultural Plot',
        field: 'cropType',
        label: { en: 'Must be actively cultivating agricultural crops', hi: 'खेत में सक्रिय फसल उत्पादन होना चाहिए', mr: 'शेतात प्रत्यक्ष पिकांची लागवड असणे आवश्यक' },
        operator: 'neq',
        expectedValue: [],
        isMandatory: true,
        explanation: { en: 'Soil samples are collected from active agricultural plots before sowing.', hi: 'मिट्टी का नमूना बुवाई से पहले खेत से लिया जाता है।', mr: 'मातीचे नमुने पेरणीपूर्वी प्रत्यक्ष शेतातून गोळा केले जातात.' },
        failureReason: { en: 'No active crops specified in profile.', hi: 'प्रोफ़ाइल में कोई फसल नहीं चुनी गई है।', mr: 'कोणतेही पीक निवडलेले नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'shcs-doc-1',
        name: { en: 'Farm Location / Survey Number Details', hi: 'खेत का सर्वे नंबर व स्थान विवरण', mr: 'शेताचा गट क्रमांक व गावाचा तपशील' },
        isMandatory: true,
        description: { en: 'For GPS geo-tagging of soil sample collection site.', hi: 'मिट्टी नमूने के स्थान को जियो-टैग करने के लिए।', mr: 'माती नमुन्याची जागा जिओ-टॅग करण्यासाठी.' },
        issuingAuthority: { en: 'Village Krishi Sahayak / Self', hi: 'कृषि सहायक', mr: 'कृषी सहाय्यक' },
        helpTip: { en: 'Krishi Sahayak visits the plot to collect composite sample.', hi: 'कृषि सहायक स्वयं आकर नमूना लेते हैं।', mr: 'कृषी सहाय्यक स्वतः शेतात येऊन नमुना घेतात.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Contact your Village Krishi Sahayak or local Krishi Vigyan Kendra (KVK).', hi: 'चरण 1: अपने ग्राम कृषि सहायक या केवीके से संपर्क करें।', mr: 'पायरी १: गावातील कृषी सहाय्यक किंवा केव्हीकेशी संपर्क साधा.' },
      { en: 'Step 2: Collect sample and download Soil Health Card from soilhealth.dac.gov.in.', hi: 'चरण 2: soilhealth.dac.gov.in से अपनी मृदा स्वास्थ्य पत्रिका डाउनलोड करें।', mr: 'पायरी २: soilhealth.dac.gov.in वरून आपली मृदा आरोग्य पत्रिका डाउनलोड करा.' }
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
    sourceUrl: 'https://soilhealth.dac.gov.in/guidelines',
    lastVerifiedDate: '2026-10-15',
    applicationPeriod: 'Ongoing Cycle via Local Agriculture Assistant',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '1800-180-1551',
    badge: 'Zero-Cost Soil Science'
  },

  // 19. PKVY (Paramparagat Krishi Vikas Yojana - Organic & Natural Farming - Central)
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)',
    alternativeNames: ['Organic Farming Cluster Scheme', 'PKVY'],
    localNames: {
      en: 'Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)',
      hi: 'परंपरागत कृषि विकास योजना (पीकेवीवाई - जैविक खेती)',
      mr: 'परंपरागत कृषी विकास योजना (पीकेव्हीवाय - सेंद्रिय शेती)'
    },
    department: {
      en: 'Integrated Nutrient Management, Ministry of Agriculture',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
      mr: 'कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार'
    },
    category: 'Organic & Natural Farming',
    subcategory: 'Cluster-based Organic Farming Certification',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Millets', 'Pulses', 'Spices', 'Medicinal Plants', 'Vegetables', 'Wheat', 'Paddy'],
    targetBeneficiaries: ['Farmer clusters', 'Small/Marginal organic growers'],
    applicableActivities: ['organic_farming', 'horticulture', 'agri_business'],
    benefitsAmount: '₹50,000 per hectare for 3 years (₹31,000 via DBT)',
    benefits: {
      en: 'Financial assistance of ₹50,000/ha for 3 years. ₹31,000 is directly provided via DBT for procurement of organic inputs (bio-fertilizers, vermicompost, botanical extracts), with remaining funds covering cluster certification and PGS-India labeling.',
      hi: '3 वर्षों के लिए ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता। इसमें से ₹31,000 सीधे डीबीटी द्वारा जैविक खाद, केंचुआ खाद और जैव कीटनाशक खरीदने के लिए दिए जाते हैं।',
      mr: '३ वर्षांसाठी प्रति हेक्टर ₹५०,००० ची मदत. यापैकी ₹३१,००० थेट खात्यात सेंद्रिय खते, गांडूळ खत व निविष्ठा खरेदीसाठी जमा होतात.'
    },
    description: {
      en: 'Promotes commercial organic farming through cluster approach and Participatory Guarantee System (PGS) certification.',
      hi: 'समूह दृष्टिकोण और पीजीएस प्रमाणीकरण के माध्यम से जैविक खेती को बढ़ावा देने वाली योजना।',
      mr: 'शेतकरी गटांच्या माध्यमातून सेंद्रिय शेतीला चालना देणारी आणि पीजीएस प्रमाणीकरण मिळवून देणारी योजना.'
    },
    eligibilityOverview: {
      en: 'Farmers willing to form a cluster of 20-50 farmers (covering 20-50 hectares) and commit to non-chemical farming practices.',
      hi: '20-50 किसानों का समूह बनाकर बिना रासायनिक खाद के जैविक खेती अपनाने के इच्छुक किसान।',
      mr: '२० ते ५० शेतकऱ्यांचा गट स्थापन करून सेंद्रिय शेती करण्यास तयार असलेले शेतकरी.'
    },
    rules: [
      {
        id: 'pkvy-rule-1',
        conditionNumber: 15,
        conditionName: 'Organic Farming Preference',
        field: 'farmingNeeds',
        label: { en: 'Interested in organic farming or bio-fertilizers', hi: 'जैविक खेती या प्राकृतिक आदानों में रुचि होनी चाहिए', mr: 'सेंद्रिय शेती किंवा नैसर्गिक निविष्ठांमध्ये रस असावा' },
        operator: 'in',
        expectedValue: ['organic_farming', 'seeds_fertilizers'],
        isMandatory: true,
        explanation: { en: 'Mandates strict compliance with PGS-India organic protocol.', hi: 'केवल प्राकृतिक आदानों का उपयोग अनिवार्य है।', mr: 'केवळ सेंद्रिय पद्धती वापरण्याची तयारी हवी.' },
        failureReason: { en: 'Organic farming not selected in profile farming needs.', hi: 'प्रोफ़ाइल में जैविक खेती की आवश्यकता नहीं चुनी गई है।', mr: 'सेंद्रिय शेतीची गरज निवडलेली नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pkvy-doc-1',
        name: { en: '7/12 Land Record & Cluster Pledge Form', hi: '7/12 भूमि रिकॉर्ड और क्लस्टर शपथ पत्र', mr: '७/१२ उतारा व गट प्रतिज्ञापत्र' },
        isMandatory: true,
        description: { en: 'Pledging area for organic certification without chemical fertilizers.', hi: 'रसायन मुक्त खेती का शपथ पत्र।', mr: 'रासायनिक खते न वापरण्याचे हमीपत्र.' },
        issuingAuthority: { en: 'ATMA / Regional Council', hi: 'आत्मा (ATMA) / कृषि विभाग', mr: 'आत्मा (ATMA) प्रकल्प' },
        helpTip: { en: 'Formed through local ATMA or Taluka Agriculture Officer.', hi: 'यह समूह स्थानीय आत्मा (ATMA) द्वारा बनाया जाता है।', mr: 'तालुका कृषी अधिकारी किंवा आत्मा (ATMA) मार्फत नोंदणी होते.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Contact ATMA Project Director in your district to join an organic cluster.', hi: 'चरण 1: अपने ज़िले के आत्मा (ATMA) कार्यालय से संपर्क करें।', mr: 'पायरी १: आत्मा (ATMA) कार्यालयाशी संपर्क साधून सेंद्रिय गटात सामील व्हा.' },
      { en: 'Step 2: Register on pgsindia-ncof.gov.in and receive DBT input installments.', hi: 'चरण 2: pgsindia-ncof.gov.in पर क्लस्टर पंजीकरण कराएं।', mr: 'पायरी २: पोर्टलवर नोंदणी करून डीबीटी हप्ते मिळवा.' }
    ],
    officialUrl: 'https://pgsindia-ncof.gov.in',
    sourceUrl: 'https://pgsindia-ncof.gov.in/pkvy/guidelines.aspx',
    lastVerifiedDate: '2026-10-20',
    applicationPeriod: 'Annual Cluster Formations',
    isOpen: true,
    schemeStatus: 'active',
    verificationStatus: 'verified',
    helpline: '0120-2764906',
    badge: 'Chemical-Free Agriculture'
  },

  // 20. PM-Formalisation of Micro food processing Enterprises (PMFME - Food Processing - Central)
  {
    id: 'pmfme-processing',
    name: 'PMFME Scheme (Micro Food Processing Enterprises Subsidy)',
    alternativeNames: ['One District One Product (ODOP) Food Scheme', 'PMFME'],
    localNames: {
      en: 'PMFME Scheme (Micro Food Processing Enterprises Subsidy)',
      hi: 'पीएमएफएमई योजना (सूक्ष्म खाद्य उद्योग उन्नयन योजना)',
      mr: 'पीएमएफएमई योजना (सूक्ष्म अन्न प्रक्रिया उद्योग योजना)'
    },
    department: {
      en: 'Ministry of Food Processing Industries (MoFPI), GoI',
      hi: 'खाद्य प्रसंस्करण उद्योग मंत्रालय, भारत सरकार',
      mr: 'अन्न प्रक्रिया उद्योग मंत्रालय, भारत सरकार'
    },
    category: 'Food Processing & Value Addition',
    subcategory: 'Micro Food Processing Enterprise Credit Subsidy',
    type: 'central',
    stateCoverage: ['All India'],
    cropCoverage: ['Fruits', 'Vegetables', 'Millets', 'Spices', 'Honey', 'Dairy Products', 'Grains'],
    targetBeneficiaries: ['Individual micro food processors', 'Farmer Self-Help Groups', 'FPOs', 'Producer Cooperatives'],
    applicableActivities: ['food_processing', 'agri_business', 'horticulture'],
    benefitsAmount: '35% Credit-Linked Capital Subsidy (up to ₹10 Lakh)',
    benefits: {
      en: 'Provides 35% credit-linked capital subsidy with maximum ceiling of ₹10 lakh per unit for setting up or upgrading micro food processing units (flour mills, oil expellers, spice processing, pickle/jam units, jaggery plants, fruit pulp extraction). Seed capital of ₹40,000 per SHG member for working capital.',
      hi: 'सूक्ष्म खाद्य प्रसंस्करण इकाई (दाल मिल, तेल मिल, मसाला चक्की, आचार-मुरब्बा, गुड़ उद्योग, आटा चक्की) लगाने या अपग्रेड करने के लिए 35% क्रेडिट-लिंक्ड सब्सिडी (अधिकतम ₹10 लाख)।',
      mr: 'डाळ मिल, तेल घाणी, मसाला गिरणी, लोणचे-जॅम, गूळ उद्योग किंवा पीठ गिरणी सुरू करण्यासाठी ३५% भांडवली अनुदान (कमाल ₹१० लाख).'
    },
    description: {
      en: 'Centrally Sponsored Scheme with an outlay of ₹10,000 crore under Atmanirbhar Bharat to formalize 2,00,000 individual micro food processing enterprises based on One District One Product (ODOP) approach.',
      hi: 'एक ज़िला एक उत्पाद (ODOP) दृष्टिकोण पर आधारित ₹10,000 करोड़ की सूक्ष्म खाद्य प्रसंस्करण सहायता योजना।',
      mr: 'एक जिल्हा एक उत्पादन (ODOP) संकल्पनेवर आधारित अन्न प्रक्रिया उद्योगांना चालना देणारी केंद्र पुरस्कृत योजना.'
    },
    eligibilityOverview: {
      en: 'Existing or new individual micro food entrepreneurs, SHG members, and FPOs. The enterprise must be engaged in food processing under the district ODOP or permissible crop categories.',
      hi: 'खाद्य प्रसंस्करण कार्य में लगे या नए इच्छुक उद्यमी किसान, महिला स्वयं सहायता समूह और एफपीओ।',
      mr: 'अन्न प्रक्रिया उद्योगात असणारे किंवा नवीन उद्योग सुरू करू इच्छिणारे शेतकरी व बचत गट.'
    },
    rules: [
      {
        id: 'pmfme-rule-1',
        conditionNumber: 15,
        conditionName: 'Food Processing Activity',
        field: 'alliedActivities',
        label: { en: 'Must be engaged in or planning food processing enterprise', hi: 'खाद्य प्रसंस्करण उद्योग में रुचि होनी चाहिए', mr: 'अन्न प्रक्रिया उद्योगात रस असणे आवश्यक' },
        operator: 'in',
        expectedValue: ['food_processing', 'agri_business'],
        isMandatory: true,
        explanation: { en: 'PMFME strictly finances micro food processing machinery and setup.', hi: 'यह केवल खाद्य प्रसंस्करण मशीनरी और सेटअप के लिए है।', mr: 'हे अनुदान केवळ अन्न प्रक्रिया मशिनरीसाठी दिले जाते.' },
        failureReason: { en: 'Food processing not selected in allied activities.', hi: 'प्रोफ़ाइल में खाद्य प्रसंस्करण शामिल नहीं है।', mr: 'अन्न प्रक्रिया निवडलेली नाही.' }
      }
    ],
    requiredDocuments: [
      {
        id: 'pmfme-doc-1',
        name: { en: 'DPR & Machinery Quotation with Udyam Registration', hi: 'विस्तृत प्रोजेक्ट रिपोर्ट (DPR), मशीन कोटेशन व उद्यम आधार', mr: 'प्रकल्प अहवाल (DPR), यंत्रसामग्री दरपत्रक व उद्यम नोंदणी' },
        isMandatory: true,
        description: { en: 'For bank appraisal and 35% capital subsidy claim.', hi: 'बैंक लोन एवं 35% सब्सिडी क्लेम के लिए।', mr: 'बँक कर्ज व ३५% अनुदानासाठी.' },
        issuingAuthority: { en: 'District Resource Person (DRP) / DIC', hi: 'ज़िला उद्योग केंद्र (DIC)', mr: 'जिल्हा उद्योग केंद्र (DIC)' },
        helpTip: { en: 'Free DPR preparation assistance is provided by district Resource Persons (DRP).', hi: 'ज़िला रिसोर्स पर्सन (DRP) द्वारा निःशुल्क डीपीआर बनवाई जाती है।', mr: 'जिल्हा रिसोर्स पर्सन (DRP) कडून मोफत डीपीआर तयार करून दिला जातो.' }
      }
    ],
    applicationSteps: [
      { en: 'Step 1: Apply online on the PMFME national portal (pmfme.mofpi.gov.in).', hi: 'चरण 1: pmfme.mofpi.gov.in पर ऑनलाइन आवेदन दर्ज करें।', mr: 'पायरी १: pmfme.mofpi.gov.in पोर्टलवर ऑनलाइन अर्ज करा.' },
      { en: 'Step 2: District Level Committee forwards vetted application to lending bank; subsidy is credited after disbursement.', hi: 'चरण 2: ज़िला स्तरीय समिति बैंक को फाइल भेजती है; लोन वितरण बाद सब्सिडी जमा होती है।', mr: 'पायरी २: बँकेकडून कर्ज मंजूर झाल्यावर अनुदान खात्यात वर्ग होते.' }
    ],
    officialUrl: 'https://pmfme.mofpi.gov.in',
    sourceUrl: 'https://mofpi.gov.in/pmfme',
    lastVerifiedDate: '2026-10-26',
    applicationPeriod: 'Open Round the Year',
    isOpen: true,
    schemeStatus: 'application_open',
    verificationStatus: 'verified',
    helpline: '1800-111-555',
    badge: 'Food Processing Enterprise'
  }
];
