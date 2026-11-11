from django.db import models

class Scheme(models.Model):
    """
    Verified Central and State Government Welfare Scheme for Indian Farmers.
    Strictly grounded in official gazettes and ministry notifications.
    """
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    alternative_names = models.JSONField(default=list, blank=True)
    local_names = models.JSONField(default=dict)
    department = models.JSONField(default=dict)
    category = models.CharField(max_length=150, db_index=True)
    subcategory = models.CharField(max_length=150, blank=True, default='')
    scheme_type = models.CharField(max_length=20, choices=[('central', 'Central'), ('state', 'State'), ('ut', 'UT')], default='central', db_index=True)
    state_coverage = models.JSONField(default=list)  # e.g. ["All India"] or ["Maharashtra", "Punjab"]
    district_coverage = models.JSONField(default=list, blank=True)
    crop_coverage = models.JSONField(default=list, blank=True)
    target_beneficiaries = models.JSONField(default=list, blank=True)
    applicable_activities = models.JSONField(default=list, blank=True)
    benefits_amount = models.CharField(max_length=150, blank=True, default='')
    benefits = models.JSONField(default=dict)
    description = models.JSONField(default=dict)
    eligibility_overview = models.JSONField(default=dict)
    application_steps = models.JSONField(default=list, blank=True)
    official_url = models.URLField(max_length=500)
    source_url = models.URLField(max_length=500)
    last_verified_date = models.DateField(null=True, blank=True)
    application_period = models.CharField(max_length=150, blank=True, default='Continuous / Active')
    is_open = models.BooleanField(default=True, db_index=True)
    scheme_status = models.CharField(max_length=50, default='active')
    verification_status = models.CharField(max_length=50, default='verified')
    helpline = models.CharField(max_length=100, blank=True, default='1800-180-1551')
    badge = models.CharField(max_length=100, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.scheme_type.upper()})"

class SchemeRule(models.Model):
    """
    Statutory eligibility rule for deterministic evaluation.
    Never decided by LLM guess-work.
    """
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='rules')
    rule_id = models.CharField(max_length=100)
    condition_number = models.PositiveIntegerField(default=1)
    condition_name = models.CharField(max_length=150)
    field = models.CharField(max_length=100)
    label = models.JSONField(default=dict)
    operator = models.CharField(max_length=30, choices=[
        ('eq', 'Equals'),
        ('neq', 'Not Equals'),
        ('gte', 'Greater Than or Equal'),
        ('lte', 'Less Than or Equal'),
        ('between', 'Between Range'),
        ('in', 'Contained In List'),
        ('not_in', 'Not In List'),
        ('is_false', 'Is False'),
        ('is_true', 'Is True'),
        ('all_in', 'Contains All')
    ])
    expected_value = models.JSONField()
    is_mandatory = models.BooleanField(default=True)
    is_exclusion = models.BooleanField(default=False)
    explanation = models.JSONField(default=dict)
    failure_reason = models.JSONField(default=dict)
    missing_reason = models.JSONField(default=dict, blank=True)
    remedy_step = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['condition_number']

    def __str__(self):
        return f"{self.scheme_id} - Rule #{self.condition_number}: {self.condition_name}"

class DocumentRequirement(models.Model):
    """Mandatory or optional documentation required for official application"""
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='required_documents')
    doc_id = models.CharField(max_length=100)
    name = models.JSONField(default=dict)
    is_mandatory = models.BooleanField(default=True)
    description = models.JSONField(default=dict)
    issuing_authority = models.JSONField(default=dict)
    help_tip = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.scheme_id} Doc: {self.doc_id}"
