import { FarmerProfile, Scheme, EligibilityRule, RuleEvaluation, EligibilityResult, Language } from '../types';

/**
 * Universal Rule-Based Eligibility Engine
 * Evaluates scheme-specific criteria deterministically without AI hallucination.
 * Strictly separates 'failed' conditions from 'missing' data to ensure fair assessment.
 */
export function evaluateSchemeEligibility(
  farmer: FarmerProfile,
  scheme: Scheme,
  lang: Language = 'en'
): EligibilityResult {
  const matchedRules: RuleEvaluation[] = [];
  const failedRules: RuleEvaluation[] = [];
  const missingRules: RuleEvaluation[] = [];

  for (const rule of scheme.rules) {
    const rawValue = (farmer as any)[rule.field];

    // Check if information is missing or unconfirmed in profile
    const isMissing = 
      rawValue === undefined || 
      rawValue === null || 
      (typeof rawValue === 'string' && (
        rawValue.trim() === '' || 
        rawValue === 'not_sure' || 
        rawValue === 'Select an option' || 
        rawValue === 'applied' ||
        rawValue === 'pending'
      )) ||
      (rule.field === 'landholdingAcres' && (
        rawValue === undefined || 
        rawValue === null || 
        rawValue === '' || 
        rawValue === 0 || 
        isNaN(Number(rawValue))
      )) ||
      (rule.field === 'landOwnership' && (!rawValue || rawValue === '' || rawValue === 'Select an option')) ||
      (rule.field === 'irrigationAvailability' && (!rawValue || rawValue === '' || rawValue === 'Select an option')) ||
      (rule.field === 'state' && (!rawValue || rawValue === '' || rawValue === 'all' || rawValue === 'Select an option')) ||
      (Array.isArray(rawValue) && rawValue.length === 0 && rule.operator !== 'neq');

    if (isMissing) {
      // If information is not provided yet in farmer profile
      missingRules.push({
        rule,
        status: 'missing',
        actualValue: undefined,
        message: rule.missingReason ? rule.missingReason[lang] : rule.label[lang],
        remedy: rule.remedyStep ? rule.remedyStep[lang] : undefined
      });
      continue;
    }

    let isPassed = false;

    switch (rule.operator) {
      case 'eq':
        if (typeof rule.expectedValue === 'string') {
          isPassed = String(rawValue).toLowerCase() === String(rule.expectedValue).toLowerCase();
        } else {
          isPassed = rawValue === rule.expectedValue;
        }
        break;

      case 'neq':
        if (Array.isArray(rule.expectedValue) && Array.isArray(rawValue)) {
          isPassed = rawValue.length > 0;
        } else {
          isPassed = rawValue !== rule.expectedValue;
        }
        break;

      case 'gte':
        isPassed = Number(rawValue) >= Number(rule.expectedValue);
        break;

      case 'lte':
        isPassed = Number(rawValue) <= Number(rule.expectedValue);
        break;

      case 'between':
        if (Array.isArray(rule.expectedValue) && rule.expectedValue.length === 2) {
          const num = Number(rawValue);
          isPassed = num >= Number(rule.expectedValue[0]) && num <= Number(rule.expectedValue[1]);
        }
        break;

      case 'in':
        if (Array.isArray(rule.expectedValue)) {
          if (Array.isArray(rawValue)) {
            // Checks if any item overlaps
            isPassed = rawValue.some(item => rule.expectedValue.includes(item));
          } else {
            // Land ownership alias matching
            if (rule.field === 'landOwnership' && rule.expectedValue.includes('owner') && (rawValue === 'owner' || rawValue === 'joint')) {
              isPassed = true;
            } else {
              isPassed = rule.expectedValue.includes(rawValue);
            }
          }
        }
        break;

      case 'not_in':
        if (Array.isArray(rule.expectedValue)) {
          if (Array.isArray(rawValue)) {
            isPassed = !rawValue.some(item => rule.expectedValue.includes(item));
          } else {
            isPassed = !rule.expectedValue.includes(rawValue);
          }
        }
        break;

      case 'is_false':
        // For exclusion rules (e.g., isIncomeTaxPayee must be false/no to pass)
        isPassed = rawValue === false || rawValue === 0 || rawValue === 'false' || rawValue === 'no';
        break;

      case 'is_true':
        isPassed = rawValue === true || rawValue === 1 || rawValue === 'true' || rawValue === 'yes';
        break;

      default:
        isPassed = false;
    }

    const evaluation: RuleEvaluation = {
      rule,
      status: isPassed ? 'matched' : 'failed',
      actualValue: rawValue,
      message: isPassed ? rule.explanation[lang] : rule.failureReason[lang],
      remedy: !isPassed && rule.remedyStep ? rule.remedyStep[lang] : undefined
    };

    if (isPassed) {
      matchedRules.push(evaluation);
    } else {
      // If it's an optional condition (like holding cap), don't fail outright unless mandatory
      if (rule.isMandatory) {
        failedRules.push(evaluation);
      } else {
        matchedRules.push({
          ...evaluation,
          status: 'matched',
          message: `${rule.explanation[lang]} (${rule.failureReason[lang]})`
        });
      }
    }
  }

  // Determine Overall Status:
  // RED: Any mandatory rule failed
  // YELLOW: No mandatory rule failed, but 1 or more rules are missing data
  // GREEN: All mandatory rules evaluated and matched
  let status: 'eligible' | 'partially_eligible' | 'not_eligible' = 'eligible';
  let summary = '';
  const nextSteps: string[] = [];

  if (failedRules.length > 0) {
    status = 'not_eligible';
    if (lang === 'hi') {
      summary = `आप वर्तमान में ${failedRules.length} अनिवार्य शर्तों के कारण इस योजना के लिए अपात्र हैं।`;
    } else if (lang === 'mr') {
      summary = `तुम्ही सध्या ${failedRules.length} अनिवार्य अटी पूर्ण न झाल्यामुळे या योजनेसाठी अपात्र आहात.`;
    } else {
      summary = `You do not currently meet ${failedRules.length} mandatory requirement(s) for this scheme.`;
    }

    for (const failed of failedRules) {
      if (failed.remedy) {
        nextSteps.push(failed.remedy);
      }
    }
  } else if (missingRules.length > 0) {
    status = 'partially_eligible';
    if (lang === 'hi') {
      summary = `आप संभावित रूप से पात्र हैं, लेकिन पुष्टि के लिए ${missingRules.length} आवश्यक जानकारी/दस्तावेज़ की जांच जरूरी है।`;
    } else if (lang === 'mr') {
      summary = `तुम्ही संभाव्य पात्र आहात, परंतु खात्री करण्यासाठी ${missingRules.length} बाबींची माहिती किंवा पडताळणी आवश्यक आहे.`;
    } else {
      summary = `You are potentially eligible! However, ${missingRules.length} required field(s) or records need confirmation before applying.`;
    }

    for (const missing of missingRules) {
      if (missing.remedy) {
        nextSteps.push(missing.remedy);
      } else {
        if (lang === 'hi') {
          nextSteps.push(`अपनी प्रोफ़ाइल में ${missing.rule.label[lang]} का विवरण सत्यापित करें।`);
        } else if (lang === 'mr') {
          nextSteps.push(`आपल्या शेतकरी प्रोफाइलमध्ये ${missing.rule.label[lang]} ची नोंद तपासा.`);
        } else {
          nextSteps.push(`Confirm status for ${missing.rule.label[lang]} in your profile questionnaire.`);
        }
      }
    }
  } else {
    status = 'eligible';
    if (lang === 'hi') {
      summary = `बधाई हो! आप इस योजना की सभी सत्यापित अनिवार्य शर्तों को पूरा करते हैं।`;
    } else if (lang === 'mr') {
      summary = `अभिनंदन! तुम्ही या योजनेच्या सर्व पडताळणी केलेल्या अनिवार्य अटी पूर्ण करता.`;
    } else {
      summary = `Congratulations! You satisfy all verified mandatory criteria for this scheme.`;
    }

    if (lang === 'hi') {
      nextSteps.push('नीचे दिए गए आवेदन मार्गदर्शन से आवश्यक दस्तावेज़ (आधार, खतौनी, बैंक पासबुक) एकत्रित करें।');
      nextSteps.push(`सीधे आधिकारिक पोर्टल (${scheme.officialUrl}) पर जाकर नया आवेदन दर्ज करें।`);
    } else if (lang === 'mr') {
      nextSteps.push('अर्ज मार्गदर्शन विभागातून सर्व आवश्यक कागदपत्रे (७/१२, आधार, बँक पासबुक) तपासा.');
      nextSteps.push(`थेट अधिकृत पोर्टलवर (${scheme.officialUrl}) जाऊन ऑनलाइन अर्ज सादर करा.`);
    } else {
      nextSteps.push('Organize your required paperwork using the Application Guidance checklist.');
      nextSteps.push(`Proceed directly to the official government portal (${scheme.officialUrl}) to submit your registration.`);
    }
  }

  return {
    schemeId: scheme.id,
    status,
    matchedRules,
    failedRules,
    missingRules,
    summary,
    nextSteps,
    verifiedRuleCount: scheme.rules.length
  };
}

/**
 * Evaluates all schemes in the database for a given farmer profile
 */
export function evaluateAllSchemes(
  farmer: FarmerProfile,
  schemes: Scheme[],
  lang: Language = 'en'
): Record<string, EligibilityResult> {
  const results: Record<string, EligibilityResult> = {};
  for (const scheme of schemes) {
    results[scheme.id] = evaluateSchemeEligibility(farmer, scheme, lang);
  }
  return results;
}
