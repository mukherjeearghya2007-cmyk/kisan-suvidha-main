from rest_framework import serializers
from .models import ConversationSession, AgentMessage

class AgentMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentMessage
        fields = ['id', 'sender', 'content', 'tools_invoked', 'sources', 'created_at']

class ConversationSessionSerializer(serializers.ModelSerializer):
    messages = AgentMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ConversationSession
        fields = ['id', 'title', 'language', 'created_at', 'updated_at', 'messages']
