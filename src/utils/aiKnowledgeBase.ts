import { verifiedSchemes } from '../data/schemes';
import { verifiedAlerts } from '../data/alerts';
import { Language, FarmerProfile } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sourceSchemeId?: string;
  officialUrl?: string;
  toolsInvoked?: any[];
  agentMode?: string;
}

/**
 * Intelligent verified scheme assistant knowledge retrieval engine
 * Strictly grounds all responses in verified government gazettes and scheme records.
 */
export function queryFarmerAssistant(
  question: string,
  lang: Language = 'en',
  activeFarmer?: FarmerProfile
): { response: string; sourceSchemeId?: string; officialUrl?: string } {
  const q = question.toLowerCase().trim();

  // Helper translations for standard responses
  const t = {
    en: {
      disclaimerPrefix: 'Official Verified Answer: ',
      portalNote: 'Official portal:',
      documentsPrefix: 'Required documents include: ',
      eligibilityPrefix: 'Eligibility conditions: ',
      contactPrefix: 'Helpline: ',
      noHallucination: 'I could not find a verified government scheme answering this specific query in our authenticated records. For your safety, I do not generate unverified information. Please call the National Kisan Call Centre at toll-free 1800-180-1551 for official assistance.'
    },
    hi: {
      disclaimerPrefix: 'सत्यापित सरकारी जानकारी: ',
      portalNote: 'आधिकारिक पोर्टल:',
      documentsPrefix: 'आवश्यक दस्तावेज़: ',
      eligibilityPrefix: 'पात्रता की शर्तें: ',
      contactPrefix: 'हेल्पलाइन नंबर: ',
      noHallucination: 'हमारे सत्यापित सरकारी डेटाबेस में इस विशिष्ट प्रश्न का कोई आधिकारिक उत्तर नहीं मिला। किसानों की सुरक्षा के लिए हम कोई काल्पनिक या अपुष्ट जानकारी नहीं देते। कृपया कृषि मंत्रालय के राष्ट्रीय किसान कॉल सेंटर (टोल-फ्री 1800-180-1551) पर संपर्क करें।'
    },
    mr: {
      disclaimerPrefix: 'सत्यापित शासकीय माहिती: ',
      portalNote: 'अधिकृत संकेतस्थळ:',
      documentsPrefix: 'आवश्यक कागदपत्रे: ',
      eligibilityPrefix: 'पात्रतेच्या अटी: ',
      contactPrefix: 'हेल्पलाइन क्रमांक: ',
      noHallucination: 'आमच्या पडताळणी केलेल्या सरकारी माहितीमध्ये या प्रश्नाबाबत अचूक माहिती उपलब्ध नाही. शेतकऱ्यांच्या सुरक्षेसाठी आम्ही कोणतीही खोटी माहिती तयार करत नाही. कृपया राष्ट्रीय किसान कॉल सेंटरच्या मोफत १८००-१८०-१५५१ या क्रमांकावर संपर्क साधावा.'
    }
  }[lang];

  // Match PM-KISAN
  if (q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('kisan samman') || q.includes('6000') || q.includes('६०००') || q.includes('किस्त') || q.includes('हप्ता')) {
    const scheme = verifiedSchemes.find(s => s.id === 'pm-kisan')!;
    if (q.includes('document') || q.includes('कागद') || q.includes('दस्तावेज') || q.includes('document')) {
      return {
        response: `${t.disclaimerPrefix}\n\n` +
          (lang === 'hi'
            ? 'पीएम-किसान (PM-KISAN) के लिए मुख्य रूप से 3 दस्तावेज़ चाहिए:\n1. आधार कार्ड (मोबाइल नंबर लिंक होना चाहिए ई-केवाईसी के लिए)\n2. भूमि स्वामित्व दस्तावेज़ (खसरा-खतौनी या 7/12 उतारा)\n3. बैंक पासबुक (जिसमें आधार डीबीटी सक्रिय हो)\n\nआवेदन आधिकारिक पोर्टल pmkisan.gov.in या नज़दीकी सीएससी केंद्र से किया जा सकता है।'
            : lang === 'mr'
            ? 'पीएम-किसान (PM-KISAN) साठी ३ मुख्य कागदपत्रे आवश्यक आहेत:\n१. आधार कार्ड (ई-केवायसी साठी मोबाईल लिंक असणे आवश्यक)\n२. शेतजमिनीचा अधिकृत ७/१२ व ८-अ उतारा\n३. बँक पासबुक (ज्यात आधार डीबीटी सुरू आहे)\n\nअर्ज pmkisan.gov.in किंवा जवळच्या सीएससी केंद्रातून करता येतो.'
            : 'For PM-KISAN, three key documents are mandatory:\n1. Aadhaar Card (must be mobile-linked for OTP/eKYC)\n2. Land Ownership Record (7/12 extract or RoR / Khasra-Khatauni in applicant name)\n3. Bank Passbook with NPCI Aadhaar DBT mapping enabled.\n\nApplications can be submitted directly at pmkisan.gov.in or via CSC.'),
        sourceSchemeId: 'pm-kisan',
        officialUrl: scheme.officialUrl
      };
    }

    if (q.includes('eligible') || q.includes('पात्र') || q.includes('who') || q.includes('नियम')) {
      return {
        response: `${t.disclaimerPrefix}\n\n` +
          (lang === 'hi'
            ? 'पीएम-किसान पात्रता नियम:\n• आवेदक के नाम पर खेती योग्य ज़मीन का कानूनी मालिकाना हक होना चाहिए।\n• अपवर्जन (कौन पात्र नहीं है): संस्थागत भूमिधारक, संवैधानिक पदधारक, नियमित सरकारी कर्मचारी, और पिछले वर्ष आयकर (Income Tax) भरने वाले किसान परिवार इस योजना के लिए अपात्र हैं।'
            : lang === 'mr'
            ? 'पीएम-किसान पात्रता नियम:\n• अर्जदाराच्या नावावर शेतजमीन असणे आवश्यक आहे.\n• अपवर्जन (कोण अपात्र आहे): संस्थागत जमीनधारक, सरकारी नोकरीत असलेले, घटनात्मक पदावरील व्यक्ती आणि मागील वर्षात आयकर भरलेले शेतकरी या योजनेस अपात्र आहेत.'
            : 'PM-KISAN Eligibility Criteria:\n• Must legally own cultivable agricultural land in land revenue records.\n• Exclusions: Institutional landholders, constitutional post holders, serving/retired government employees, and income tax payees of the previous assessment year are legally excluded.'),
        sourceSchemeId: 'pm-kisan',
        officialUrl: scheme.officialUrl
      };
    }

    return {
      response: `${t.disclaimerPrefix}\n\n${scheme.benefits[lang]}\n\n${t.portalNote} ${scheme.officialUrl}\n${t.contactPrefix} ${scheme.helpline}`,
      sourceSchemeId: 'pm-kisan',
      officialUrl: scheme.officialUrl
    };
  }

  // Match PMFBY Crop Insurance
  if (q.includes('fasal bima') || q.includes('pmfby') || q.includes('insurance') || q.includes('विमा') || q.includes('बीमा') || q.includes('loss') || q.includes('damage') || q.includes('नुकसान')) {
    const scheme = verifiedSchemes.find(s => s.id === 'pmfby')!;
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY):\n• खरीफ फसलों के लिए किसान अंश केवल 2%, रबी के लिए 1.5% और बागवानी फसलों के लिए 5% है।\n• यह योजना ज़मीन मालिकों के साथ-साथ बटाईदार और किरायेदार किसानों को भी कवर करती है।\n• आवश्यक कागजात: बुवाई प्रमाणपत्र (e-Pik Pahani / पेरा प्रमाणपत्र), 7/12 खतौनी या अनुबंध, और बैंक पासबुक।\n• प्राकृतिक आपदा होने पर 72 घंटे के भीतर PMFBY ऐप या टोल-फ्री 14447 पर सूचना देना अनिवार्य है।'
          : lang === 'mr'
          ? 'प्रधानमंत्री पीक विमा योजना (PMFBY):\n• खरीप पिकांसाठी केवळ २%, रब्बीसाठी १.५% आणि बागायती पिकांसाठी ५% विमा हप्ता आहे (महाराष्ट्रात विशेष १ रुपयात योजना).\n• जमीन मालकांसोबतच कुळ व भाडेकरू शेतकरीही पात्र आहेत.\n• आवश्यक कागदपत्रे: पेरा प्रमाणपत्र (ई-पीक पाहणी), ७/१२ किंवा भाडेकरार, बँक पासबुक.\n• नुकसानीची माहिती ७२ तासांच्या आत १४४४७ क्रमांकावर किंवा ॲपवर देणे बंधनकारक आहे.'
          : 'PM Fasal Bima Yojana (PMFBY):\n• Minimal farmer premium: 2% for Kharif, 1.5% for Rabi, and 5% for horticultural crops.\n• Open to both landowners and tenant/sharecropper farmers cultivating notified crops.\n• Required docs: Sowing Certificate (or state e-Pik Pahani), Land record / lease deed, and Bank passbook.\n• Intimation of localized natural damage must be registered within 72 hours via PMFBY app or toll-free 14447.'),
      sourceSchemeId: 'pmfby',
      officialUrl: scheme.officialUrl
    };
  }

  // Match Solar Pump / PM-KUSUM
  if (q.includes('kusum') || q.includes('solar') || q.includes('सोलर') || q.includes('सौर') || q.includes('pump') || q.includes('पंप')) {
    const scheme = verifiedSchemes.find(s => s.id === 'pm-kusum')!;
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? 'पीएम-कुसुम कंपोनेंट बी (सोलर पंप योजना):\n• स्टैंडअलोन सोलर पंप (3 HP, 5 HP, 7.5 HP) पर कुल 60% सब्सिडी (30% केंद्र + 30% राज्य) मिलती है। किसान को 40% अंश देना होता है (जिसके लिए बैंक ऋण भी मिल सकता है)।\n• मुख्य शर्त: उस सर्वे नंबर पर पहले से कोई कृषि बिजली कनेक्शन नहीं होना चाहिए और कुआं/बोरवेल में पर्याप्त पानी होना चाहिए।\n• आवश्यक कागजात: 7/12 (कुएं की प्रविष्टि सहित), बिजली कनेक्शन न होने का स्व-घोषणा पत्र, आधार कार्ड।'
          : lang === 'mr'
          ? 'पीएम-कुसुम घटक ब (सौर कृषी पंप योजना):\n• ३ एचपी, ५ एचपी आणि ७.५ एचपी सौर पंपांवर ६०% शासकीय अनुदान (३०% केंद्र + ३०% राज्य) मिळते. शेतकऱ्याला केवळ ४०% रक्कम भरावी लागते.\n• मुख्य अट: त्या शेतात अगोदरपासून कृषी वीज कनेक्शन नसावे आणि विहीर किंवा बोअरवेलमध्ये पाणी असावे.\n• कागदपत्रे: पाण्याचा दाखला असलेला ७/१२, वीज जोडणी नसल्याचे स्वयंघोषणापत्र, आधार कार्ड.'
          : 'PM-KUSUM Component B (Solar Agricultural Pumps):\n• Provides up to 60% subsidy (30% Central + 30% State) for 3 HP, 5 HP, and 7.5 HP standalone solar pumps. Farmer contributes 40% (bank loan available up to 30%).\n• Key Eligibility: The field must NOT have an existing grid electricity connection, and a confirmed water source (well/borewell) must be present.\n• Documents: 7/12 extract with water source entry, No-Grid Power declaration, Aadhaar.'),
      sourceSchemeId: 'pm-kusum',
      officialUrl: scheme.officialUrl
    };
  }

  // Match KCC / Loan
  if (q.includes('kcc') || q.includes('loan') || q.includes('credit') || q.includes('कर्ज') || q.includes('ऋण') || q.includes('व्याज')) {
    const scheme = verifiedSchemes.find(s => s.id === 'kcc')!;
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? 'किसान क्रेडिट कार्ड (केसीसी):\n• फसल बुवाई और खेती खर्च के लिए ₹3 लाख तक का रियायती ऋण।\n• ब्याज दर 7% है, और समय पर चुकाने पर 3% छूट के साथ प्रभावी ब्याज केवल 4% प्रति वर्ष रहता है।\n• ₹1.6 लाख तक किसी ज़मीन बंधक (collateral) की ज़रूरत नहीं होती।\n• किरायेदार व बटाईदार किसान भी इसके पात्र हैं।'
          : lang === 'mr'
          ? 'किसान क्रेडिट कार्ड (केसीसी):\n• बियाणे व पीक लागवडीसाठी ₹३ लाखांपर्यंत सवलतीचे पीक कर्ज.\n• वेळेत परतफेड केल्यास प्रभावी व्याजदर केवळ ४% वार्षिक.\n• ₹१.६ लाखांपर्यंत तारणमुक्त कर्ज उपलब्ध.\n• जमीन मालक तसेच भाडेकरू शेतकरीही यासाठी पात्र आहेत.'
          : 'Kisan Credit Card (KCC):\n• Concessional short-term crop loans up to ₹3,00,000.\n• Effective interest rate is only 4% per annum upon prompt repayment (7% nominal minus 3% prompt repayment subvention).\n• Collateral-free lending up to ₹1,60,000.\n• Open to tenant cultivators and sharecroppers as well.'),
      sourceSchemeId: 'kcc',
      officialUrl: scheme.officialUrl
    };
  }

  // Match Namo Shetkari (Maharashtra)
  if (q.includes('namo') || q.includes('नमो') || q.includes('maharashtra') || q.includes('महाराष्ट्र') || q.includes('shetkari')) {
    const scheme = verifiedSchemes.find(s => s.id === 'namo-shetkari')!;
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? 'नमो शेतकरी महासंमान निधि योजना (महाराष्ट्र):\n• महाराष्ट्र सरकार द्वारा पीएम-किसान लाभार्थियों को अतिरिक्त ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तों में) दिए जाते हैं।\n• पीएम-किसान के ₹6,000 और राज्य के ₹6,000 मिलाकर महाराष्ट्र के किसान को कुल ₹12,000 प्रति वर्ष मिलते हैं।\n• इसके लिए अलग आवेदन की आवश्यकता नहीं है; जो किसान पीएम-किसान में पात्र हैं उन्हें यह राशि स्वतः डीबीटी से मिलती है।'
          : lang === 'mr'
          ? 'नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र):\n• महाराष्ट्र शासनाकडून पीएम-किसानच्या पात्र शेतकऱ्यांना वर्षाला अतिरिक्त ₹६,००० (३ हप्त्यांत) दिले जातात.\n• केंद्राचे ₹६,००० आणि राज्याचे ₹६,००० असे मिळून वर्षाला एकूण ₹१२,००० थेट खात्यात जमा होतात.\n• यासाठी वेगळा अर्ज करण्याची गरज नाही; ज्यांचे पीएम-किसान सुरू आहे त्यांना आपोआप लाभ मिळतो.'
          : 'Namo Shetkari Mahasanman Nidhi (Maharashtra):\n• Maharashtra State Government provides an additional ₹6,000 per year (3 installments of ₹2,000 each) on top of PM-KISAN, totaling ₹12,000/year for state farmers.\n• No separate registration needed if your PM-KISAN eKYC and land seeding are verified; funds are credited automatically.'),
      sourceSchemeId: 'namo-shetkari',
      officialUrl: scheme.officialUrl
    };
  }

  // Match Machinery / Tractor Subsidy
  if (q.includes('tractor') || q.includes('ट्रेक्टर') || q.includes('ट्रॅक्टर') || q.includes('machine') || q.includes('यंत्र') || q.includes('rotavator') || q.includes('रोटावेटर') || q.includes('smam')) {
    const scheme = verifiedSchemes.find(s => s.id === 'smam')!;
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? 'कृषि यंत्रीकरण उप-मिशन (SMAM):\n• ट्रैक्टर, रोटावेटर, पावर टिलर और कृषि यंत्रों पर 40% से 50% तक सब्सिडी दी जाती है।\n• छोटे, सीमांत, एससी/एसटी और महिला किसानों को 50% की विशेष छूट मिलती है।\n• आवश्यक कागजात: 7/12 खतौनी, 8-अ, आधार कार्ड और अधिकृत डीलर का कोटेशन (दरपत्रक)।\n• आवेदन agrimachinery.nic.in या राज्य पोर्टल (जैसे महाडीबीटी) से किया जाता है।'
          : lang === 'mr'
          ? 'कृषी यांत्रिकीकरण उप-अभियान (SMAM):\n• ट्रॅक्टर, रोटाव्हेटर, पॉवर टिलर आणि मळणी यंत्रांवर ४०% ते ५०% शासकीय अनुदान.\n• लहान, अत्यल्प भूधारक, महिला आणि मागासवर्गीय शेतकऱ्यांना ५०% पर्यंत सवलत.\n• कागदपत्रे: ७/१२, ८-अ, आधार कार्ड आणि मान्यताप्राप्त विक्रेत्याचे कोटेशन.\n• अर्ज महाडीबीटी किंवा agrimachinery.nic.in वर ऑनलाइन करता येतो.'
          : 'Sub-Mission on Agricultural Mechanization (SMAM):\n• Provides 40% to 50% financial assistance for purchasing tractors, power tillers, rotavators, and sprayers.\n• 50% preferential subsidy for Small, Marginal, SC, ST, and Women farmers.\n• Required docs: 7/12 extract, 8-A, Aadhaar, and proforma quotation from an authorized dealer.\n• Apply via state agriculture portal (e.g. MahaDBT) or agrimachinery.nic.in.'),
      sourceSchemeId: 'smam',
      officialUrl: scheme.officialUrl
    };
  }

  // Fallback to active farmer context if relevant
  if (activeFarmer && (q.includes('my') || q.includes('mera') || q.includes('majhe') || q.includes('माझी') || q.includes('मेरी') || q.includes('eligibility'))) {
    return {
      response: `${t.disclaimerPrefix}\n\n` +
        (lang === 'hi'
          ? `आपके वर्तमान प्रोफ़ाइल (${activeFarmer.name}, ${activeFarmer.landholdingAcres} एकड़, राज्य: ${activeFarmer.state}) के अनुसार:\nआप 'पात्रता जांचें' (Eligibility Checker) पृष्ठ पर जाकर एक क्लिक में सभी योजनाओं की 25-बिंदु नियम जांच देख सकते हैं।`
          : lang === 'mr'
          ? `तुमच्या चालू प्रोफाइलनुसार (${activeFarmer.name}, ${activeFarmer.landholdingAcres} एकर, राज्य: ${activeFarmer.state}):\nतुम्ही 'पात्रता तपासा' पृष्ठावर जाऊन एका क्लिकमध्ये सर्व २५ शासकीय नियमांची पडताळणी पाहू शकता.`
          : `Based on your loaded farm profile (${activeFarmer.name}, ${activeFarmer.landholdingAcres} acres in ${activeFarmer.state}):\nYou can visit the Universal Eligibility Checker tab to run transparent rule calculations against all 25 official conditions.`),
      officialUrl: 'https://pmkisan.gov.in'
    };
  }

  // Safe fallback disclaimer
  return {
    response: t.noHallucination,
    officialUrl: 'https://agricoop.nic.in'
  };
}
