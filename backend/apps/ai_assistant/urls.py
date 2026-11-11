from django.urls import path
from .views import ChatAgentView, ChatHistoryView, ClearChatView

urlpatterns = [
    path('chat/', ChatAgentView.as_view(), name='ai_chat'),
    path('history/<str:session_id>/', ChatHistoryView.as_view(), name='ai_history'),
    path('clear/<str:session_id>/', ClearChatView.as_view(), name='ai_clear'),
]
