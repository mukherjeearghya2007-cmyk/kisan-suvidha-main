from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ConversationSession, AgentMessage
from .serializers import ConversationSessionSerializer, AgentMessageSerializer
from .agent import run_kisan_ai_agent

class ChatAgentView(APIView):
    """
    Kisan Suvidha Tool-Using AI Agent Chat Endpoint.
    Receives farmer query, executes controlled backend tools, persists audit trail,
    and returns grounded agricultural response.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip()
        session_id = request.data.get('session_id')
        language = request.data.get('language', 'en')
        profile_override = request.data.get('profile')

        if not message:
            return Response(
                {'success': False, 'error': 'A message is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user if request.user.is_authenticated else None

        # Retrieve or create session
        session = None
        if session_id:
            session = ConversationSession.objects.filter(id=session_id).first()

        if not session:
            title = message[:40] + ('...' if len(message) > 40 else '')
            session = ConversationSession.objects.create(
                user=user,
                title=title,
                language=language
            )

        # Retrieve past conversation context
        past_msgs = list(session.messages.order_by('created_at').values('sender', 'content'))

        # Save user message
        user_msg = AgentMessage.objects.create(
            session=session,
            sender='user',
            content=message
        )

        # Run AI Agent with tool-calling
        agent_res = run_kisan_ai_agent(
            message=message,
            user=user,
            profile_override=profile_override,
            language=language,
            conversation_history=past_msgs
        )

        # Save assistant message with tool audit log
        assistant_msg = AgentMessage.objects.create(
            session=session,
            sender='assistant',
            content=agent_res['response'],
            tools_invoked=agent_res.get('tools_invoked', []),
            sources=agent_res.get('sources', [])
        )

        return Response({
            'success': True,
            'session_id': str(session.id),
            'response': agent_res['response'],
            'tools_invoked': agent_res.get('tools_invoked', []),
            'sources': agent_res.get('sources', []),
            'agent_mode': agent_res.get('agent_mode', 'Tool Calling'),
            'message_id': str(assistant_msg.id)
        }, status=status.HTTP_200_OK)

class ChatHistoryView(APIView):
    """Retrieve chat history for a session"""
    permission_classes = [AllowAny]

    def get(self, request, session_id):
        session = ConversationSession.objects.filter(id=session_id).first()
        if not session:
            return Response({'success': False, 'error': 'Session not found'}, status=404)
        serializer = ConversationSessionSerializer(session)
        return Response({'success': True, 'session': serializer.data})

class ClearChatView(APIView):
    """Clear chat history for a session"""
    permission_classes = [AllowAny]

    def delete(self, request, session_id):
        session = ConversationSession.objects.filter(id=session_id).first()
        if session:
            session.messages.all().delete()
            return Response({'success': True, 'message': 'Chat history cleared'})
        return Response({'success': False, 'error': 'Session not found'}, status=404)
