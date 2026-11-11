# Kisan Suvidha – Django REST Framework Backend

**Sahi Yojana. Sahi Kisan. Sahi Suvidha.**  
Full-stack Python Django Backend, SQLite Database, and Gemini-powered Tool-Using AI Agent for Indian Farmers.

---

## 1. Backend Architecture & Structure

```
backend/
├── kisan_backend/              # Project Configuration
│   ├── __init__.py
│   ├── settings.py            # CORS, DRF, SQLite, Auth Model
│   ├── urls.py                # Main URL Router
│   ├── wsgi.py                # WSGI entry point
│   └── asgi.py                # ASGI entry point
├── apps/
│   ├── authentication/        # Farmer Authentication (Mobile / Email + Password)
│   │   ├── models.py          # Custom FarmerUser model
│   │   ├── serializers.py     # Register, Login, User serializers
│   │   ├── views.py           # RegisterView, LoginView, LogoutView, CurrentUserView
│   │   └── urls.py            # /api/auth/*
│   ├── profiles/              # Farmer Personal & Farming Profiles
│   │   ├── models.py          # FarmerProfile with farming parameters & 12 verification fields
│   │   ├── serializers.py     # FarmerProfileSerializer
│   │   ├── views.py           # FarmerProfileView (private per-farmer access)
│   │   └── urls.py            # /api/profiles/me/
│   ├── schemes/               # Verified Government Welfare Scheme Catalog
│   │   ├── models.py          # Scheme, SchemeRule, DocumentRequirement
│   │   ├── serializers.py     # SchemeListSerializer, SchemeDetailSerializer
│   │   ├── views.py           # SchemeListView, SchemeDetailView
│   │   ├── urls.py            # /api/schemes/*
│   │   └── management/commands/seed_schemes.py # Seeds authentic verified schemes & rules
│   ├── eligibility/           # Statutory Eligibility Checking Engine
│   │   ├── engine.py          # Deterministic condition checker (ELIGIBLE / POTENTIAL / NOT ELIGIBLE)
│   │   ├── views.py           # EligibilityCheckView
│   │   └── urls.py            # /api/eligibility/check/
│   ├── saved_schemes/         # Saved Bookmarks & Application Progress
│   │   ├── models.py          # SavedScheme, ApplicationDraft
│   │   ├── serializers.py     # SavedSchemeSerializer, ApplicationDraftSerializer
│   │   ├── views.py           # SavedSchemesListView, ToggleSaveSchemeView, ApplicationDraftView
│   │   └── urls.py            # /api/saved/*
│   ├── guidance/              # Application Guidance & Mandatory Document Checklist
│   │   ├── views.py           # SchemeGuidanceView
│   │   └── urls.py            # /api/guidance/*
│   ├── alerts/                # Verified Gazette Announcements & Deadlines
│   │   ├── models.py          # SchemeAlert model
│   │   ├── serializers.py     # SchemeAlertSerializer
│   │   ├── views.py           # AlertListView
│   │   ├── urls.py            # /api/alerts/*
│   │   └── management/commands/seed_alerts.py # Seeds verified alerts
│   └── ai_assistant/          # Real Gemini Tool-Calling AI Agent
│       ├── models.py          # ConversationSession, AgentMessage
│       ├── serializers.py     # ConversationSessionSerializer, AgentMessageSerializer
│       ├── tools.py           # 10 Controlled database querying tools
│       ├── agent.py           # Gemini Function Calling loop with deterministic fallback
│       ├── views.py           # ChatAgentView, ChatHistoryView, ClearChatView
│       └── urls.py            # /api/ai/*
├── manage.py                  # Django Management CLI
├── requirements.txt           # Python Package Dependencies
├── .env.example               # Environment Variables Template
├── setup.sh                   # Automated Setup Script
└── run_backend.sh             # Server Runner Script
```

---

## 2. Quick Setup & Execution (Free & Local)

### Prerequisites
- Python 3.10 or higher
- pip and venv

### Step 1: Create and Activate Virtual Environment
```bash
cd backend
python3 -m venv venv

# On Linux / macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```
*(Optional: Insert your `GEMINI_API_KEY` in `.env` to enable live Gemini model responses with tool-calling. If omitted, the agent automatically executes the tools deterministically without failing).*

### Step 4: Run Migrations
```bash
python manage.py makemigrations authentication profiles schemes eligibility saved_schemes alerts ai_assistant
python manage.py migrate
```

### Step 5: Seed Authentic Government Data
```bash
python manage.py seed_schemes
python manage.py seed_alerts
```

### Step 6: Start Django Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```
*The API is now live at `http://127.0.0.1:8000/api/` with CORS enabled for the frontend.*

---

## 3. Core API Endpoints

| Category | Endpoint | Method | Purpose |
|---|---|---|---|
| **Health** | `/api/health/` | GET | Server health check and capabilities status |
| **Auth** | `/api/auth/register/` | POST | Register farmer using Mobile/Email + Password |
| **Auth** | `/api/auth/login/` | POST | Authenticate farmer; returns Token |
| **Auth** | `/api/auth/logout/` | POST | Revoke session and delete token |
| **Auth** | `/api/auth/me/` | GET | Retrieve authenticated farmer details |
| **Profile** | `/api/profiles/me/` | GET / PUT | Retrieve or update farmer's private profile |
| **Schemes** | `/api/schemes/` | GET | Search and filter schemes (by state, crop, category) |
| **Schemes** | `/api/schemes/<id>/` | GET | Retrieve scheme details, rules, and documents |
| **Eligibility** | `/api/eligibility/check/` | POST | Run statutory 28-condition eligibility engine |
| **Saved** | `/api/saved/` | GET | List bookmarked schemes for authenticated farmer |
| **Saved** | `/api/saved/toggle/` | POST | Bookmark or un-bookmark a scheme |
| **Progress** | `/api/saved/drafts/<scheme_id>/` | GET / POST | Track application progress and 5-state document checklist |
| **Guidance** | `/api/guidance/<scheme_id>/` | GET | Retrieve mandatory documents and official portal links |
| **Alerts** | `/api/alerts/` | GET | List verified deadlines and urgent announcements |
| **AI Agent** | `/api/ai/chat/` | POST | Multilingual Gemini tool-calling assistant |
| **AI Agent** | `/api/ai/history/<session_id>/` | GET | Retrieve conversation messages and tool audit logs |
| **AI Agent** | `/api/ai/clear/<session_id>/` | DELETE | Clear chat consultation history |

---

## 4. The 10 AI Agent Controlled Tools

The AI Assistant in `backend/apps/ai_assistant/tools.py` operates via controlled tools grounded in SQLite:
1. `get_farmer_profile`: Reads active farmer's landholding, category, state, and DBT status.
2. `search_government_schemes`: Queries schemes by keywords, state applicability, and crops.
3. `get_scheme_details`: Reads official scheme benefits, application windows, and official portal URLs.
4. `check_scheme_eligibility`: Invokes the deterministic statutory rule engine.
5. `get_required_documents`: Returns official mandatory paperwork and issuing offices.
6. `get_application_guidance`: Returns step-by-step application procedures.
7. `save_scheme`: Bookmarks a scheme in the farmer's account.
8. `get_saved_schemes`: Returns all bookmarked schemes and drafts.
9. `track_application`: Checks document checklist status (`collected`, `uploaded`, `submitted`, `verified`).
10. `get_scheme_alerts`: Retrieves official upcoming deadlines and gazette circulars.
