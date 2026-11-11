import uuid
from django.db import models
from django.conf import settings

class ConversationSession(models.Model):
    """Chat session for a farmer interacting with the Kisan Suvidha AI Agent"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='ai_conversations'
    )
    title = models.CharField(max_length=255, default='New Consultation')
    language = models.CharField(max_length=10, default='en', choices=[
        ('en', 'English'), ('hi', 'Hindi'), ('mr', 'Marathi')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Chat Session: {self.title} ({self.language})"

class AgentMessage(models.Model):
    """Individual message with audit trail of tool invocations and sources"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        ConversationSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.CharField(max_length=20, choices=[
        ('user', 'Farmer'),
        ('assistant', 'Kisan AI Agent'),
        ('system', 'System')
    ])
    content = models.TextField()
    tools_invoked = models.JSONField(default=list, blank=True)
    sources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.sender}] {self.content[:40]}..."
