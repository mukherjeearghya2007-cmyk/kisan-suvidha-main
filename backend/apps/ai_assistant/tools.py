"""
Controlled Backend Tools for the Kisan Suvidha Gemini AI Agent.
Every tool interacts directly with authentic database models and the statutory rule engine.
"""
from typing import Dict, Any, List, Optional
from django.db.models import Q
from apps.schemes.models import Scheme
from apps.profiles.models import FarmerProfile
from apps.saved_schemes.models import SavedScheme, ApplicationDraft
from apps.alerts.models import SchemeAlert
from apps.eligibility.engine import evaluate_scheme_eligibility

def get_farmer_profile(user=None, profile_override=None) -> Dict[str, Any]:
    """Tool 1: Retrieve farmer's active profile, landholding, category, and farming details"""
    if profile_override and isinstance(profile_override, dict):
        return {
            "success": True,
            "profile": profile_override,
            "source": "Provided Farm Parameters"
        }
    if user and user.is_authenticated:
        try:
            p = user.profile
            return {
                "success": True,
                "profile": {
                    "name": p.name,
                    "state": p.state,
                    "district": p.district,
                    "village": p.village,
                    "farmer_category": p.farmer_category,
                    "landholding_acres": p.landholding_acres,
                    "land_ownership": p.land_ownership,
                    "irrigation_availability": p.irrigation_availability,
                    "crop_type": p.crop_type,
                    "allied_activities": p.allied_activities,
                    "social_category": p.social_category,
                    "has_aadhaar_linked_bank_dbt": p.has_aadhaar_linked_bank_dbt,
                    "has_land_records_712": p.has_land_records_712,
                    "is_income_tax_payee": p.is_income_tax_payee,
                    "profile_completion_percent": p.profile_completion_percent
                },
                "source": "Authenticated Farmer Database"
            }
        except FarmerProfile.DoesNotExist:
            pass
    return {
        "success": False,
        "message": "Farmer profile details are incomplete or user is unauthenticated.",
        "profile": {}
    }

def search_government_schemes(query: str = "", state: str = "", category: str = "", crop: str = "") -> List[Dict[str, Any]]:
    """Tool 2: Search verified central and state schemes in database by keywords, state, or crop"""
    qs = Scheme.objects.all()
    if query:
        qs = qs.filter(
            Q(name__icontains=query) |
            Q(category__icontains=query) |
            Q(benefits_amount__icontains=query)
        )
    if state and state.lower() not in ('all', 'all india'):
        qs = qs.filter(Q(state_coverage__icontains='All India') | Q(state_coverage__icontains=state))
    if category and category.lower() != 'all':
        qs = qs.filter(category__iexact=category)
    if crop and crop.lower() != 'all':
        qs = qs.filter(Q(crop_coverage__icontains='All Crops') | Q(crop_coverage__icontains=crop))

    results = []
    for s in qs[:8]:
        results.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "benefits_amount": s.benefits_amount,
            "scheme_type": s.scheme_type,
            "state_coverage": s.state_coverage,
            "official_url": s.official_url
        })
    return results

def get_scheme_details(scheme_id: str, lang: str = "en") -> Dict[str, Any]:
    """Tool 3: Retrieve complete verified metadata, benefits, and rules for a specific scheme"""
    try:
        s = Scheme.objects.prefetch_related('rules', 'required_documents').get(id=scheme_id)
        return {
            "success": True,
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "department": s.department.get(lang, s.department.get('en', '')),
            "benefits": s.benefits.get(lang, s.benefits.get('en', '')),
            "benefits_amount": s.benefits_amount,
            "description": s.description.get(lang, s.description.get('en', '')),
            "eligibility_overview": s.eligibility_overview.get(lang, s.eligibility_overview.get('en', '')),
            "official_url": s.official_url,
            "helpline": s.helpline,
            "application_period": s.application_period,
            "is_open": s.is_open,
            "rules_count": s.rules.count(),
            "documents_count": s.required_documents.count()
        }
    except Scheme.DoesNotExist:
        return {"success": False, "error": f"Scheme '{scheme_id}' not found in database."}

def check_scheme_eligibility(scheme_id: str, user=None, profile_data=None, lang: str = "en") -> Dict[str, Any]:
    """Tool 4: Run the deterministic statutory rule engine for a scheme"""
    try:
        s = Scheme.objects.prefetch_related('rules', 'required_documents').get(id=scheme_id)
    except Scheme.DoesNotExist:
        s = Scheme.objects.prefetch_related('rules', 'required_documents').filter(id__icontains=scheme_id).first()
        if not s:
            s = Scheme.objects.prefetch_related('rules', 'required_documents').filter(name__icontains=scheme_id).first()
        if not s:
            return {
                "success": False,
                "error": f"Scheme '{scheme_id}' not found.",
                "scheme_id": scheme_id,
                "scheme_name": scheme_id.upper(),
                "status": "partially_eligible",
                "summary": f"Scheme rules for '{scheme_id}' are being verified against central guidelines.",
                "matched_rules_count": 0,
                "failed_rules": [],
                "missing_rules": [],
                "next_steps": ["Check active schemes in the directory", "Contact Kisan Call Centre at 1800-180-1551"]
            }

    farmer = profile_data or (user.profile if user and user.is_authenticated else {})
    eval_result = evaluate_scheme_eligibility(farmer, s, lang=lang)
    return {
        "success": True,
        "scheme_id": s.id,
        "scheme_name": s.name,
        "status": eval_result["status"],
        "summary": eval_result["summary"],
        "matched_rules_count": len(eval_result["matched_rules"]),
        "failed_rules": eval_result["failed_rules"],
        "missing_rules": eval_result["missing_rules"],
        "next_steps": eval_result["next_steps"]
    }

def get_required_documents(scheme_id: str, lang: str = "en") -> Dict[str, Any]:
    """Tool 5: Retrieve official list of required documents, issuing authorities, and help tips"""
    try:
        s = Scheme.objects.prefetch_related('required_documents').get(id=scheme_id)
        docs = []
        for d in s.required_documents.all():
            docs.append({
                "doc_id": d.doc_id,
                "name": d.name.get(lang, d.name.get('en', '')),
                "is_mandatory": d.is_mandatory,
                "description": d.description.get(lang, d.description.get('en', '')),
                "issuing_authority": d.issuing_authority.get(lang, d.issuing_authority.get('en', '')),
                "help_tip": d.help_tip.get(lang, d.help_tip.get('en', ''))
            })
        return {
            "success": True,
            "scheme_name": s.name,
            "documents": docs,
            "official_url": s.official_url
        }
    except Scheme.DoesNotExist:
        s = Scheme.objects.prefetch_related('required_documents').filter(id__icontains=scheme_id).first()
        if not s:
            s = Scheme.objects.prefetch_related('required_documents').filter(name__icontains=scheme_id).first()
        if s:
            docs = []
            for d in s.required_documents.all():
                docs.append({
                    "doc_id": d.doc_id,
                    "name": d.name.get(lang, d.name.get('en', '')),
                    "is_mandatory": d.is_mandatory,
                    "description": d.description.get(lang, d.description.get('en', '')),
                    "issuing_authority": d.issuing_authority.get(lang, d.issuing_authority.get('en', '')),
                    "help_tip": d.help_tip.get(lang, d.help_tip.get('en', ''))
                })
            return {
                "success": True,
                "scheme_name": s.name,
                "documents": docs,
                "official_url": s.official_url
            }
        return {
            "success": False,
            "error": f"Scheme '{scheme_id}' not found.",
            "scheme_name": scheme_id.upper(),
            "documents": [
                {"name": "Aadhaar Card", "description": "Identity verification document", "is_mandatory": True, "issuing_authority": "UIDAI", "help_tip": "Carry original Aadhaar"},
                {"name": "Land Records (7/12 / RoR)", "description": "Proof of agricultural land ownership", "is_mandatory": True, "issuing_authority": "Revenue Department", "help_tip": "Obtainable from Bhulekh portal"}
            ],
            "official_url": "https://agricoop.nic.in"
        }

def get_application_guidance(scheme_id: str, lang: str = "en") -> Dict[str, Any]:
    """Tool 6: Retrieve step-by-step application procedure and official portal link"""
    try:
        s = Scheme.objects.get(id=scheme_id)
        steps = []
        for step in s.application_steps:
            if isinstance(step, dict):
                steps.append(step.get(lang, step.get('en', '')))
            else:
                steps.append(str(step))
        return {
            "success": True,
            "scheme_name": s.name,
            "steps": steps,
            "official_url": s.official_url,
            "helpline": s.helpline
        }
    except Scheme.DoesNotExist:
        return {"success": False, "error": f"Scheme '{scheme_id}' not found."}

def save_scheme(scheme_id: str, user) -> Dict[str, Any]:
    """Tool 7: Bookmark a government scheme into farmer's private account"""
    if not user or not user.is_authenticated:
        return {"success": False, "error": "Farmer must be signed in to bookmark schemes."}
    try:
        s = Scheme.objects.get(id=scheme_id)
        SavedScheme.objects.get_or_create(user=user, scheme=s)
        return {"success": True, "message": f"Successfully bookmarked '{s.name}' in your account."}
    except Scheme.DoesNotExist:
        return {"success": False, "error": f"Scheme '{scheme_id}' not found."}

def get_saved_schemes(user) -> Dict[str, Any]:
    """Tool 8: Retrieve all bookmarked schemes and active application drafts for the farmer"""
    if not user or not user.is_authenticated:
        return {"success": False, "error": "Farmer must be signed in to view saved schemes.", "schemes": []}
    saved = SavedScheme.objects.filter(user=user).select_related('scheme')
    return {
        "success": True,
        "count": saved.count(),
        "schemes": [{"id": s.scheme.id, "name": s.scheme.name, "benefits_amount": s.scheme.benefits_amount, "saved_at": str(s.saved_at)} for s in saved]
    }

def track_application(scheme_id: str, user) -> Dict[str, Any]:
    """Tool 9: Track preparation status and document checklist progress for a scheme"""
    if not user or not user.is_authenticated:
        return {"success": False, "error": "Farmer must be signed in to track application drafts."}
    draft = ApplicationDraft.objects.filter(user=user, scheme_id=scheme_id).first()
    if draft:
        return {
            "success": True,
            "scheme_id": scheme_id,
            "document_status": draft.document_status,
            "completed_steps": draft.completed_steps,
            "notes": draft.notes,
            "updated_at": str(draft.updated_at)
        }
    return {
        "success": True,
        "scheme_id": scheme_id,
        "message": "No draft application started yet for this scheme.",
        "document_status": {}
    }

def get_scheme_alerts(state: str = "", urgent_only: bool = False) -> List[Dict[str, Any]]:
    """Tool 10: Retrieve official upcoming deadlines, seasonal windows, and gazette announcements"""
    qs = SchemeAlert.objects.all()
    if state and state.lower() not in ('all', 'all india'):
        qs = qs.filter(Q(state='') | Q(state__iexact=state))
    if urgent_only:
        qs = qs.filter(is_urgent=True)
    alerts = []
    for a in qs[:6]:
        alerts.append({
            "id": a.id,
            "title": a.title.get('en', str(a.title)),
            "deadline": str(a.deadline) if a.deadline else "Ongoing",
            "is_urgent": a.is_urgent,
            "source_url": a.source_url,
            "reference": a.official_reference
        })
    return alerts
