"""
URL configuration for kisan_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_health(request):
    """Health check and status API"""
    return JsonResponse({
        "status": "healthy",
        "service": "Kisan Suvidha Django REST API",
        "version": "1.0.0",
        "database": "SQLite",
        "features": [
            "Farmer Authentication & Profiles",
            "Government Scheme Discovery & Search",
            "Statutory 28-Condition Eligibility Engine",
            "Saved Schemes & Document Roadmap Checklist",
            "Verified Scheme Deadlines & Alerts",
            "Gemini AI Agricultural Agent with Controlled Tool Calling"
        ]
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health, name='api_health'),
    
    # Kisan Suvidha App APIs
    path('api/auth/', include('apps.authentication.urls')),
    path('api/profiles/', include('apps.profiles.urls')),
    path('api/schemes/', include('apps.schemes.urls')),
    path('api/eligibility/', include('apps.eligibility.urls')),
    path('api/saved/', include('apps.saved_schemes.urls')),
    path('api/guidance/', include('apps.guidance.urls')),
    path('api/alerts/', include('apps.alerts.urls')),
    path('api/ai/', include('apps.ai_assistant.urls')),
]
