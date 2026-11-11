"""
Gemini-Powered Tool-Calling AI Agent for Kisan Suvidha.
Strictly grounds every response in database queries and statutory rule evaluations.
Supports English, Hindi, and Marathi.
"""
import os
import json
import requests
from typing import Dict, Any, List, Tuple, Optional
from django.conf import settings
from . import tools

# Gemini API Model and endpoint
GEMINI_MODEL = "gemini-2.5-flash"

SYSTEM_INSTRUCTION = """
You are the official Kisan Suvidha AI Assistant, a specialized agricultural welfare advisor for Indian farmers.
Your sacred duty is to help small and marginal farmers discover legitimate government schemes, verify eligibility, understand required paperwork (like 7/12, Aadhaar DBT, eKYC), and guide them to official government portals.

CRITICAL OPERATIONAL RULES:
1. ALWAYS use your provided tools to fetch real data from the database. NEVER invent schemes, benefits, eligibility rules, or application URLs.
2. If the farmer asks if they are eligible for a scheme, call check_scheme_eligibility to get the deterministic statutory check. NEVER guess eligibility yourself.
3. If information is missing in the farmer's profile, explain what is missing and ask the farmer politely to provide it.
4. Respond in the exact language requested by the user: English, Hindi (हिंदी), or Marathi (मराठी).
5. Translate complex bureaucratic and statutory jargon into simple, empathetic language easily understood by rural farmers.
6. Clearly provide official portal links and government toll-free numbers (Kisan Call Centre: 1800-180-1551; Crop Insurance: 14447).
7. If a requested scheme or service cannot be verified in the database, honestly communicate that limitation and suggest contacting the Kisan Call Centre.
"""

TOOL_DEFINITIONS = [
    {
        "name": "get_farmer_profile",
        "description": "Retrieves the active farmer's profile details including state, district, landholding acres, farmer category, crops grown, and DBT status.",
        "parameters": {
            "type": "OBJECT",
            "properties": {}
        }
    },
    {
        "name": "search_government_schemes",
        "description": "Searches verified central and state government schemes in the database by keyword, state, category, or crop.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "Search keyword like 'solar pump', 'insurance', 'loan', 'pension', 'subsidy'"},
                "state": {"type": "STRING", "description": "Farmer's Indian state like 'Maharashtra', 'Uttar Pradesh', or 'All India'"},
                "crop": {"type": "STRING", "description": "Crop like 'Wheat', 'Rice', 'Cotton', 'Sugarcane'"}
            }
        }
    },
    {
        "name": "get_scheme_details",
        "description": "Retrieves comprehensive official metadata, benefits, application period, and official URL for a specific scheme.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "scheme_id": {"type": "STRING", "description": "Scheme ID like 'pm-kisan', 'pmfby', 'pm-kusum'"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "check_scheme_eligibility",
        "description": "Executes the deterministic statutory rule engine for a scheme against the farmer's verified profile.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "scheme_id": {"type": "STRING", "description": "Scheme ID to test eligibility for"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "get_required_documents",
        "description": "Retrieves the official list of mandatory paperwork (7/12, Aadhaar, Sowing certificate), issuing offices, and help tips.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "scheme_id": {"type": "STRING", "description": "Scheme ID"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "get_application_guidance",
        "description": "Retrieves step-by-step application procedures and official portal web links for a scheme.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "scheme_id": {"type": "STRING", "description": "Scheme ID"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "save_scheme",
        "description": "Bookmarks a government scheme in the farmer's private account for future reference.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "scheme_id": {"type": "STRING", "description": "Scheme ID to bookmark"}
            },
            "required": ["scheme_id"]
        }
    },
    {
        "name": "get_saved_schemes",
        "description": "Retrieves all schemes bookmarked by the authenticated farmer.",
        "parameters": {
            "type": "OBJECT",
            "properties": {}
        }
    },
    {
        "name": "get_scheme_alerts",
        "description": "Retrieves official active government deadlines, eKYC cut-off dates, and seasonal enrollment circulars.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "state": {"type": "STRING", "description": "Farmer's state"},
                "urgent_only": {"type": "BOOLEAN", "description": "Whether to return only urgent deadlines"}
            }
        }
    }
]

def execute_tool_call(tool_name: str, arguments: Dict[str, Any], user, profile_override, lang: str) -> Dict[str, Any]:
    """Routes function calls from the Gemini agent to backend database operations"""
    if tool_name == "get_farmer_profile":
        return tools.get_farmer_profile(user=user, profile_override=profile_override)
    elif tool_name == "search_government_schemes":
        return {"schemes": tools.search_government_schemes(
            query=arguments.get("query", ""),
            state=arguments.get("state", ""),
            crop=arguments.get("crop", "")
        )}
    elif tool_name == "get_scheme_details":
        return tools.get_scheme_details(scheme_id=arguments.get("scheme_id", ""), lang=lang)
    elif tool_name == "check_scheme_eligibility":
        return tools.check_scheme_eligibility(
            scheme_id=arguments.get("scheme_id", ""),
            user=user,
            profile_data=profile_override,
            lang=lang
        )
    elif tool_name == "get_required_documents":
        return tools.get_required_documents(scheme_id=arguments.get("scheme_id", ""), lang=lang)
    elif tool_name == "get_application_guidance":
        return tools.get_application_guidance(scheme_id=arguments.get("scheme_id", ""), lang=lang)
    elif tool_name == "save_scheme":
        return tools.save_scheme(scheme_id=arguments.get("scheme_id", ""), user=user)
    elif tool_name == "get_saved_schemes":
        return tools.get_saved_schemes(user=user)
    elif tool_name == "get_scheme_alerts":
        return {"alerts": tools.get_scheme_alerts(
            state=arguments.get("state", ""),
            urgent_only=arguments.get("urgent_only", False)
        )}
    return {"error": f"Tool '{tool_name}' is not recognized."}

def run_kisan_ai_agent(
    message: str,
    user=None,
    profile_override: Optional[Dict[str, Any]] = None,
    language: str = "en",
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Main entry point for conversational AI Agent execution.
    Executes controlled function calling with Gemini API.
    If no API key is set, executes the deterministic tool runner.
    """
    api_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", "")
    tools_invoked = []
    sources = []

    if api_key and api_key != "YOUR_GEMINI_API_KEY_HERE":
        try:
            # Build Gemini API request with tools
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
            
            # Format history
            contents = []
            if conversation_history:
                for h in conversation_history[-4:]:
                    contents.append({
                        "role": "user" if h.get("sender") == "user" else "model",
                        "parts": [{"text": h.get("text") or h.get("content", "")}]
                    })
            
            # Add current user message
            contents.append({
                "role": "user",
                "parts": [{"text": f"Farmer query in {language.upper()}: {message}"}]
            })

            payload = {
                "system_instruction": {
                    "parts": [{"text": SYSTEM_INSTRUCTION}]
                },
                "contents": contents,
                "tools": [{
                    "function_declarations": TOOL_DEFINITIONS
                }]
            }

            resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                candidate = data.get("candidates", [{}])[0]
                content = candidate.get("content", {})
                parts = content.get("parts", [])

                # Check if Gemini requested function calls
                tool_calls = [p.get("functionCall") for p in parts if "functionCall" in p]

                if tool_calls:
                    # Execute tool calls
                    function_responses = []
                    for call in tool_calls:
                        name = call.get("name")
                        args = call.get("args", {})
                        tools_invoked.append({"tool": name, "args": args})

                        tool_res = execute_tool_call(name, args, user, profile_override, language)
                        function_responses.append({
                            "response": {"name": name, "content": tool_res}
                        })

                        if "scheme_id" in args:
                            sources.append(args["scheme_id"])

                    # Send tool outputs back to Gemini for final grounded synthesis
                    contents.append(content)
                    contents.append({
                        "role": "user",
                        "parts": [{"functionResponse": fr["response"]} for fr in function_responses]
                    })

                    second_payload = {
                        "system_instruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
                        "contents": contents
                    }

                    second_resp = requests.post(url, json=second_payload, headers={"Content-Type": "application/json"}, timeout=15)
                    if second_resp.status_code == 200:
                        second_data = second_resp.json()
                        final_text = second_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        return {
                            "response": final_text,
                            "tools_invoked": tools_invoked,
                            "sources": list(set(sources)),
                            "agent_mode": "Gemini Live Function Calling"
                        }

                else:
                    text = "".join([p.get("text", "") for p in parts if "text" in p])
                    if text:
                        return {
                            "response": text,
                            "tools_invoked": [],
                            "sources": [],
                            "agent_mode": "Gemini Direct Response"
                        }
        except Exception as e:
            # Fallback to deterministic agent if external network or API limit occurs
            pass

    # Deterministic Intelligent Tool Runner Fallback
    # Interprets intent, queries real database tools, and formats verified answer in native language
    msg_lower = message.lower().strip()
    invoked_tool = None
    tool_output = None

    if any(k in msg_lower for k in ["profile", "my farm", "profl", "माझी माहिती", "मेरी जानकारी", "मेरी जमीन", "खाता"]):
        invoked_tool = "get_farmer_profile"
        tool_output = tools.get_farmer_profile(user=user, profile_override=profile_override)
        tools_invoked.append({"tool": invoked_tool, "args": {}})

    elif any(k in msg_lower for k in ["eligible", "eligibility", "patra", "पात्र", "पात्रता", "चेक"]):
        scheme_id = "pm-kisan"
        if "kusum" in msg_lower or "solar" in msg_lower or "सौर" in msg_lower:
            scheme_id = "pm-kusum"
        elif "fasal" in msg_lower or "bima" in msg_lower or "विमा" in msg_lower or "pmfby" in msg_lower:
            scheme_id = "pmfby"
        
        invoked_tool = "check_scheme_eligibility"
        tool_output = tools.check_scheme_eligibility(scheme_id, user=user, profile_data=profile_override, lang=language)
        tools_invoked.append({"tool": invoked_tool, "args": {"scheme_id": scheme_id}})
        sources.append(scheme_id)

    elif any(k in msg_lower for k in ["document", "paper", "kagad", "कागद", "दस्तावेज", "7/12", "ekyc", "आधार"]):
        scheme_id = "pm-kisan"
        if "kusum" in msg_lower or "solar" in msg_lower or "सौर" in msg_lower:
            scheme_id = "pm-kusum"
        elif "fasal" in msg_lower or "bima" in msg_lower or "विमा" in msg_lower:
            scheme_id = "pmfby"

        invoked_tool = "get_required_documents"
        tool_output = tools.get_required_documents(scheme_id, lang=language)
        tools_invoked.append({"tool": invoked_tool, "args": {"scheme_id": scheme_id}})
        sources.append(scheme_id)

    elif any(k in msg_lower for k in ["alert", "deadline", "date", "तारीख", "मुदत", "हप्ता", "किस्त"]):
        invoked_tool = "get_scheme_alerts"
        tool_output = tools.get_scheme_alerts()
        tools_invoked.append({"tool": invoked_tool, "args": {}})

    else:
        # Default scheme search
        invoked_tool = "search_government_schemes"
        search_kw = "kisan"
        for word in ["solar", "pump", "kusum", "bima", "insurance", "pension", "dbt", "subsidy", "loan"]:
            if word in msg_lower:
                search_kw = word
                break
        tool_output = tools.search_government_schemes(query=search_kw)
        tools_invoked.append({"tool": invoked_tool, "args": {"query": search_kw}})

    # Format localized response based on authentic database tool output
    if language == 'hi':
        prefix = "✅ **सत्यापित सरकारी जानकारी:**\n\n"
        if invoked_tool == "check_scheme_eligibility":
            status_val = tool_output.get("status", "partially_eligible") if isinstance(tool_output, dict) else "partially_eligible"
            status_text = "पात्र" if status_val == "eligible" else "संभावित पात्र (अधूरी जानकारी)" if status_val == "partially_eligible" else "अपात्र"
            s_name = tool_output.get('scheme_name', 'सरकारी योजना') if isinstance(tool_output, dict) else 'सरकारी योजना'
            summary = tool_output.get('summary', 'पात्रता मानदंडों की जांच की गई।') if isinstance(tool_output, dict) else ''
            next_steps = tool_output.get('next_steps', ['निकटतम सीएससी / ई-सेवा केंद्र पर जाएं']) if isinstance(tool_output, dict) else []
            reply = f"{prefix}**योजना:** {s_name}\n**पात्रता स्थिति:** {status_text}\n\n**विवरण:** {summary}\n\n**अगले कदम:**\n" + "\n".join([f"- {s}" for s in next_steps])
        elif invoked_tool == "get_required_documents":
            docs = tool_output.get('documents', []) if isinstance(tool_output, dict) else []
            s_name = tool_output.get('scheme_name', 'सरकारी योजना') if isinstance(tool_output, dict) else 'सरकारी योजना'
            doc_lines = [f"{i+1}. **{d.get('name', 'दस्तावेज़')}** - {d.get('description', '')}" for i, d in enumerate(docs)]
            reply = f"{prefix}**{s_name} के लिए आवश्यक दस्तावेज़:**\n\n" + "\n".join(doc_lines) + f"\n\nआधिकारिक पोर्टल: {tool_output.get('official_url', 'https://agricoop.nic.in')}"
        elif invoked_tool == "get_farmer_profile":
            p = tool_output.get("profile", {}) if isinstance(tool_output, dict) else {}
            reply = f"{prefix}**आपकी वर्तमान पंजीकृत प्रोफ़ाइल:**\n- नाम: {p.get('name', 'किसान')}\n- राज्य: {p.get('state', 'अनिर्धारित')}\n- ज़िला: {p.get('district', 'अनिर्धारित')}\n- भूमि जोत: {p.get('landholding_acres', 'दर्ज नहीं')} एकड़\n- प्रोफ़ाइल पूर्णता: {p.get('profile_completion_percent', 0)}%"
        else:
            reply = f"{prefix}हमारे डेटाबेस में उपलब्ध सत्यापित योजनाओं के विवरण प्राप्त हुए हैं। आप विशिष्ट योजना (जैसे पीएम-किसान, फसल बीमा, सोलर पंप) की पात्रता या दस्तावेज़ जांचने के लिए पूछ सकते हैं।\n\nआधिकारिक किसान कॉल सेंटर: **1800-180-1551** (टोल-फ्री)।"
    elif language == 'mr':
        prefix = "✅ **अधिकृत शासकीय माहिती:**\n\n"
        if invoked_tool == "check_scheme_eligibility":
            status_val = tool_output.get("status", "partially_eligible") if isinstance(tool_output, dict) else "partially_eligible"
            status_text = "पात्र" if status_val == "eligible" else "संभाव्य पात्र (अपूर्ण माहिती)" if status_val == "partially_eligible" else "अपात्र"
            s_name = tool_output.get('scheme_name', 'शासकीय योजना') if isinstance(tool_output, dict) else 'शासकीय योजना'
            summary = tool_output.get('summary', 'पात्रता नियमांची तपासणी केली आहे.') if isinstance(tool_output, dict) else ''
            next_steps = tool_output.get('next_steps', ['जवळच्या सीएससी / ई-सेवा केंद्राला भेट द्या']) if isinstance(tool_output, dict) else []
            reply = f"{prefix}**योजना:** {s_name}\n**पात्रता स्थिती:** {status_text}\n\n**तपशील:** {summary}\n\n**पुढील पायऱ्या:**\n" + "\n".join([f"- {s}" for s in next_steps])
        elif invoked_tool == "get_required_documents":
            docs = tool_output.get('documents', []) if isinstance(tool_output, dict) else []
            s_name = tool_output.get('scheme_name', 'शासकीय योजना') if isinstance(tool_output, dict) else 'शासकीय योजना'
            doc_lines = [f"{i+1}. **{d.get('name', 'कागदपत्र')}** - {d.get('description', '')}" for i, d in enumerate(docs)]
            reply = f"{prefix}**{s_name} साठी आवश्यक कागदपत्रे:**\n\n" + "\n".join(doc_lines) + f"\n\nअधिकृत पोर्टल: {tool_output.get('official_url', 'https://agricoop.nic.in')}"
        elif invoked_tool == "get_farmer_profile":
            p = tool_output.get("profile", {}) if isinstance(tool_output, dict) else {}
            reply = f"{prefix}**आपली नोंदणीकृत शेतकरी प्रोफाइल:**\n- नाव: {p.get('name', 'शेतकरी')}\n- राज्य: {p.get('state', 'नोंद नाही')}\n- जिल्हा: {p.get('district', 'नोंद नाही')}\n- शेतजमीन: {p.get('landholding_acres', 'नोंद नाही')} एकर\n- प्रोफाइल पूर्णता: {p.get('profile_completion_percent', 0)}%"
        else:
            reply = f"{prefix}डेटाबेसमधून अधिकृत योजनांची पडताळणी झाली आहे. आपण पीएम-किसान, पीक विमा किंवा सौर पंपाबाबत थेट पात्रता विचारू शकता.\n\nअधिकृत किसान कॉल सेंटर: **१८००-१८०-१५५१** (विनामूल्य)."
    else:
        prefix = "✅ **Verified Official Scheme Details:**\n\n"
        if invoked_tool == "check_scheme_eligibility":
            status_val = tool_output.get("status", "partially_eligible") if isinstance(tool_output, dict) else "partially_eligible"
            status_text = "ELIGIBLE" if status_val == "eligible" else "POTENTIALLY ELIGIBLE" if status_val == "partially_eligible" else "NOT ELIGIBLE"
            s_name = tool_output.get('scheme_name', 'Government Scheme') if isinstance(tool_output, dict) else 'Government Scheme'
            summary = tool_output.get('summary', 'Statutory criteria evaluated against farmer profile.') if isinstance(tool_output, dict) else ''
            next_steps = tool_output.get('next_steps', ['Visit nearest CSC / e-Seva Kendra']) if isinstance(tool_output, dict) else []
            reply = f"{prefix}**Scheme:** {s_name}\n**Statutory Status:** **{status_text}**\n\n**Evaluation Summary:** {summary}\n\n**Actionable Next Steps:**\n" + "\n".join([f"- {s}" for s in next_steps])
        elif invoked_tool == "get_required_documents":
            docs = tool_output.get('documents', []) if isinstance(tool_output, dict) else []
            s_name = tool_output.get('scheme_name', 'Government Scheme') if isinstance(tool_output, dict) else 'Government Scheme'
            doc_lines = [f"{i+1}. **{d.get('name', 'Document')}** - {d.get('description', '')}" for i, d in enumerate(docs)]
            reply = f"{prefix}**Required Documents for {s_name}:**\n\n" + "\n".join(doc_lines) + f"\n\nOfficial Portal Link: {tool_output.get('official_url', 'https://agricoop.nic.in')}"
        elif invoked_tool == "get_farmer_profile":
            p = tool_output.get("profile", {}) if isinstance(tool_output, dict) else {}
            reply = f"{prefix}**Current Registered Farmer Profile:**\n- Name: {p.get('name', 'Farmer')}\n- State: {p.get('state', 'Not set')}\n- District: {p.get('district', 'Not set')}\n- Landholding: {p.get('landholding_acres', 'Not entered')} Acres\n- Profile Completeness: {p.get('profile_completion_percent', 0)}%"
        else:
            reply = f"{prefix}Retrieved verified welfare records from the database. You can ask specific questions about PM-KISAN, Crop Insurance (PMFBY), Solar Pumps (PM-KUSUM), or check your statutory eligibility.\n\nNational Kisan Call Centre: **1800-180-1551** (Toll-Free)."

    return {
        "response": reply,
        "tools_invoked": tools_invoked,
        "sources": list(set(sources)),
        "agent_mode": "Deterministic Controlled Backend Runner"
    }
