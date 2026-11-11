"""
Deterministic Statutory Eligibility Engine for Indian Agricultural Welfare Schemes.
Performs rigorous statutory condition checks without AI guessing or hallucination.
"""
from typing import Dict, Any, List

def evaluate_scheme_eligibility(
    farmer_profile: Any,
    scheme: Any,
    lang: str = 'en'
) -> Dict[str, Any]:
    """
    Evaluates farmer eligibility against stored statutory SchemeRules.
    Returns:
    - status: 'eligible' (GREEN), 'partially_eligible' (YELLOW), 'not_eligible' (RED)
    - matched_rules: List of conditions passed
    - failed_rules: List of conditions failed
    - missing_rules: List of missing/unconfirmed profile information
    - summary: Plain language explanation in chosen language
    - next_steps: Actionable steps for the farmer
    """
    matched_rules = []
    failed_rules = []
    missing_rules = []

    # Get rules for this scheme
    rules = scheme.rules.all()

    for rule in rules:
        # Extract field value from farmer profile
        # Supports model attributes or dict keys
        if hasattr(farmer_profile, rule.field):
            raw_value = getattr(farmer_profile, rule.field)
        elif isinstance(farmer_profile, dict) and rule.field in farmer_profile:
            raw_value = farmer_profile[rule.field]
        else:
            raw_value = None

        # Determine if value is missing/unconfirmed
        is_missing = False
        if raw_value is None:
            is_missing = True
        elif isinstance(raw_value, str) and (
            raw_value.strip() == '' or
            raw_value.lower() in ('not_sure', 'select an option', 'pending', 'applied')
        ):
            is_missing = True
        elif rule.field == 'landholding_acres' and (raw_value == 0 or raw_value == ''):
            is_missing = True
        elif isinstance(raw_value, (list, tuple)) and len(raw_value) == 0 and rule.operator != 'neq':
            is_missing = True

        label_text = rule.label.get(lang, rule.label.get('en', rule.condition_name))
        explanation_text = rule.explanation.get(lang, rule.explanation.get('en', ''))
        failure_text = rule.failure_reason.get(lang, rule.failure_reason.get('en', 'Condition not met'))
        missing_text = rule.missing_reason.get(lang, rule.missing_reason.get('en', 'Information required in profile'))
        remedy_text = rule.remedy_step.get(lang, rule.remedy_step.get('en', ''))

        if is_missing:
            missing_rules.append({
                'rule_id': rule.rule_id,
                'condition_number': rule.condition_number,
                'condition_name': rule.condition_name,
                'field': rule.field,
                'status': 'missing',
                'message': missing_text or label_text,
                'remedy': remedy_text,
                'is_mandatory': rule.is_mandatory,
                'is_exclusion': rule.is_exclusion
            })
            continue

        # Evaluate comparison operator
        is_passed = False
        op = rule.operator
        expected = rule.expected_value

        if op == 'eq':
            if isinstance(expected, str):
                is_passed = str(raw_value).lower() == str(expected).lower()
            else:
                is_passed = raw_value == expected

        elif op == 'neq':
            if isinstance(expected, list) and isinstance(raw_value, list):
                is_passed = len(raw_value) > 0
            else:
                is_passed = raw_value != expected

        elif op == 'gte':
            try:
                is_passed = float(raw_value) >= float(expected)
            except (ValueError, TypeError):
                is_passed = False

        elif op == 'lte':
            try:
                is_passed = float(raw_value) <= float(expected)
            except (ValueError, TypeError):
                is_passed = False

        elif op == 'in':
            if isinstance(expected, list):
                if isinstance(raw_value, list):
                    is_passed = any(item in expected for item in raw_value)
                else:
                    is_passed = raw_value in expected or str(raw_value).lower() in [str(x).lower() for x in expected]
            else:
                is_passed = raw_value == expected

        elif op == 'not_in':
            if isinstance(expected, list):
                is_passed = raw_value not in expected
            else:
                is_passed = raw_value != expected

        elif op == 'is_true':
            is_passed = raw_value is True or str(raw_value).lower() in ('true', 'yes')

        elif op == 'is_false':
            is_passed = raw_value is False or str(raw_value).lower() in ('false', 'no')

        if is_passed:
            matched_rules.append({
                'rule_id': rule.rule_id,
                'condition_number': rule.condition_number,
                'condition_name': rule.condition_name,
                'field': rule.field,
                'status': 'matched',
                'actual_value': raw_value,
                'message': explanation_text or label_text
            })
        else:
            failed_rules.append({
                'rule_id': rule.rule_id,
                'condition_number': rule.condition_number,
                'condition_name': rule.condition_name,
                'field': rule.field,
                'status': 'failed',
                'actual_value': raw_value,
                'message': failure_text,
                'remedy': remedy_text,
                'is_mandatory': rule.is_mandatory,
                'is_exclusion': rule.is_exclusion
            })

    # Strict Statutory Evaluation Status
    mandatory_failed = [r for r in failed_rules if r.get('is_mandatory', True)]
    mandatory_missing = [r for r in missing_rules if r.get('is_mandatory', True)]

    if len(mandatory_failed) > 0:
        status = 'not_eligible'  # RED
    elif len(mandatory_missing) > 0:
        status = 'partially_eligible'  # YELLOW (Requires confirmation / info missing)
    else:
        status = 'eligible'  # GREEN (All verified statutory conditions met)

    # Localized Summary Generation
    summaries = {
        'en': {
            'eligible': f"Verified Eligible. Your farming profile satisfies all {len(matched_rules)} tested statutory rules for {scheme.name}.",
            'partially_eligible': f"Potentially Eligible. {len(matched_rules)} criteria met, but {len(mandatory_missing)} mandatory details require confirmation before formal submission.",
            'not_eligible': f"Statutorily Ineligible. Your profile does not meet {len(mandatory_failed)} essential requirement(s) for this scheme."
        },
        'hi': {
            'eligible': f"सत्यापित पात्र। आपकी किसान प्रोफ़ाइल {scheme.name} के सभी {len(matched_rules)} वैधानिक नियमों को पूरा करती है।",
            'partially_eligible': f"संभावित पात्र। {len(matched_rules)} शर्तें पूरी हैं, परंतु {len(mandatory_missing)} अनिवार्य जानकारी की पुष्टि आवश्यक है।",
            'not_eligible': f"वैधानिक रूप से अपात्र। आपकी प्रोफ़ाइल इस योजना की {len(mandatory_failed)} आवश्यक शर्तों को पूरा नहीं करती।"
        },
        'mr': {
            'eligible': f"पडताळणीनुसार पात्र. आपली शेतकरी प्रोफाइल {scheme.name} च्या सर्व {len(matched_rules)} अधिकृत निकषांची पूर्तता करते.",
            'partially_eligible': f"संभाव्य पात्र. {len(matched_rules)} अटी पूर्ण आहेत, परंतु {len(mandatory_missing)} आवश्यक बाबींची खात्री करणे बाकी आहे.",
            'not_eligible': f"अधिकृत नियमांनुसार अपात्र. आपली प्रोफाइल या योजनेच्या {len(mandatory_failed)} आवश्यक अटी पूर्ण करत नाही."
        }
    }

    summary = summaries.get(lang, summaries['en']).get(status)

    next_steps = []
    if status == 'eligible':
        next_steps = [
            f"Review required documents ({scheme.required_documents.count()} items required)",
            f"Access official application portal at {scheme.official_url}",
            "Submit online or visit your nearest CSC / Krishi Bhavan"
        ]
    elif status == 'partially_eligible':
        next_steps = [
            "Complete unconfirmed farming details in your Farmer Profile",
            "Verify land records (7/12 / Khasra) or bank Aadhaar DBT seeding",
            "Re-run eligibility check once profile details are updated"
        ]
    else:
        next_steps = [
            "Review the failure reason above to understand statutory limits",
            "Explore alternative central and state schemes in Scheme Finder",
            "Contact Kisan Call Centre at toll-free 1800-180-1551 for official guidance"
        ]

    return {
        'scheme_id': scheme.id,
        'scheme_name': scheme.name,
        'status': status,
        'matched_rules': matched_rules,
        'failed_rules': failed_rules,
        'missing_rules': missing_rules,
        'summary': summary,
        'next_steps': next_steps,
        'verified_rule_count': len(rules)
    }
