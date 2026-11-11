from django.db import models
from apps.schemes.models import Scheme

class SchemeAlert(models.Model):
    """
    Verified government gazette announcements, installment dates, and subsidy deadlines.
    """
    id = models.CharField(max_length=100, primary_key=True)
    title = models.JSONField(default=dict)
    description = models.JSONField(default=dict)
    date = models.DateField()
    deadline = models.DateField(null=True, blank=True)
    alert_type = models.CharField(max_length=50, default='deadline', choices=[
        ('deadline', 'Application Deadline'),
        ('announcement', 'Official Announcement'),
        ('scheme_update', 'Scheme Guideline Update')
    ])
    scheme = models.ForeignKey(Scheme, on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts')
    state = models.CharField(max_length=100, blank=True, default='')
    is_urgent = models.BooleanField(default=False, db_index=True)
    verified = models.BooleanField(default=True)
    source_url = models.URLField(max_length=500)
    official_reference = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_urgent', 'deadline', '-date']

    def __str__(self):
        return f"Alert: {self.id} ({self.alert_type})"
