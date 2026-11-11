import uuid
from django.db import models
from django.conf import settings
from apps.schemes.models import Scheme

class SavedScheme(models.Model):
    """Bookmarked government scheme for an authenticated farmer"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_schemes')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='saved_by_farmers')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'scheme')
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.full_name} bookmarked {self.scheme.name}"

class ApplicationDraft(models.Model):
    """
    Application preparation progress and document checklist tracking.
    Documents checklist statuses: 'not_provided', 'collected', 'uploaded', 'submitted', 'verified'
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='application_drafts')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='drafts')
    document_status = models.JSONField(default=dict)
    completed_steps = models.JSONField(default=list)
    notes = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'scheme')
        ordering = ['-updated_at']

    def __str__(self):
        return f"Draft for {self.scheme.name} by {self.user.full_name}"
