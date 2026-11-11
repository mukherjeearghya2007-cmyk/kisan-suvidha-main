from django.urls import path
from .views import SavedSchemesListView, ToggleSaveSchemeView, ApplicationDraftView

urlpatterns = [
    path('', SavedSchemesListView.as_view(), name='saved_schemes_list'),
    path('toggle/', ToggleSaveSchemeView.as_view(), name='saved_schemes_toggle'),
    path('drafts/<str:scheme_id>/', ApplicationDraftView.as_view(), name='application_draft'),
]
