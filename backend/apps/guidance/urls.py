from django.urls import path
from .views import SchemeGuidanceView

urlpatterns = [
    path('<str:scheme_id>/', SchemeGuidanceView.as_view(), name='scheme_guidance'),
]
