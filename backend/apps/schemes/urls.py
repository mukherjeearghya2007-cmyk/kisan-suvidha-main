from django.urls import path
from .views import SchemeListView, SchemeDetailView

urlpatterns = [
    path('', SchemeListView.as_view(), name='scheme_list'),
    path('<str:id>/', SchemeDetailView.as_view(), name='scheme_detail'),
]
