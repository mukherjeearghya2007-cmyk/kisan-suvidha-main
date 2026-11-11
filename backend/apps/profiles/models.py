import uuid
from django.db import models
from django.conf import settings

class FarmerProfile(models.Model):
    """
    Comprehensive Farmer Profile for Statutory Scheme Assessment and AI Guidance.
    Each farmer account owns exactly one private profile.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    name = models.CharField(max_length=150)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True, choices=[
        ('male', 'Male'), ('female', 'Female'), ('other', 'Other')
    ])
    
    # Location Hierarchy
    state = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, default='')
    village = models.CharField(max_length=150, blank=True, default='')
    pincode = models.CharField(max_length=10, blank=True, default='')
    preferred_language = models.CharField(max_length=10, default='en', choices=[
        ('en', 'English'), ('hi', 'Hindi'), ('mr', 'Marathi')
    ])
    
    # Farming Details
    primary_occupation = models.CharField(max_length=100, blank=True, default='Farmer / Cultivator')
    farming_type = models.CharField(max_length=100, blank=True, default='')
    farmer_category = models.CharField(
        max_length=50, null=True, blank=True,
        choices=[
            ('marginal', 'Marginal (Below 2.5 Acres)'),
            ('small', 'Small (2.5 to 5 Acres)'),
            ('medium', 'Medium (5 to 10 Acres)'),
            ('large', 'Large (Above 10 Acres)'),
            ('women_farmer', 'Women Farmer')
        ]
    )
    landholding_acres = models.FloatField(null=True, blank=True)
    landholding_unit = models.CharField(max_length=20, default='acres')
    land_ownership = models.CharField(
        max_length=50, blank=True, default='',
        choices=[
            ('owner', 'Land Owner / Title Holder'),
            ('tenant', 'Tenant Farmer'),
            ('sharecropper', 'Sharecropper (Bataidar)'),
            ('oral_lessee', 'Oral Lessee'),
            ('landless', 'Landless Agricultural Laborer')
        ]
    )
    land_type = models.CharField(
        max_length=50, blank=True, default='',
        choices=[
            ('irrigated', 'Irrigated Land'),
            ('dryland', 'Rainfed / Dryland'),
            ('waste_land', 'Waste Land'),
            ('fallow', 'Fallow Land')
        ]
    )
    irrigation_availability = models.CharField(
        max_length=50, blank=True, default='',
        choices=[
            ('rainfed', 'Rainfed Only'),
            ('well_borewell', 'Well / Borewell'),
            ('canal', 'Canal Irrigation'),
            ('drip_sprinkler', 'Drip / Sprinkler Micro-Irrigation'),
            ('none', 'No Irrigation Source')
        ]
    )
    crop_type = models.JSONField(default=list, blank=True)
    crop_season = models.CharField(max_length=50, blank=True, default='Kharif')
    is_organic_farmer = models.BooleanField(default=False)

    # Allied Activities (JSON List)
    allied_activities = models.JSONField(default=list, blank=True)

    # Financial & Social Category
    annual_family_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    social_category = models.CharField(
        max_length=50, blank=True, default='',
        choices=[
            ('General', 'General'),
            ('OBC', 'Other Backward Classes (OBC)'),
            ('SC', 'Scheduled Caste (SC)'),
            ('ST', 'Scheduled Tribe (ST)')
        ]
    )
    is_tribal_or_special_region = models.BooleanField(default=False)
    is_women_farmer_head = models.BooleanField(default=False)

    # Farming Needs & Objectives (JSON List)
    farming_needs = models.JSONField(default=list, blank=True)

    # Statutory Verification & Exclusion Fields (supports 'yes', 'no', 'not_sure', 'applied')
    is_income_tax_payee = models.CharField(max_length=30, default='not_sure')
    holds_constitutional_post = models.CharField(max_length=30, default='not_sure')
    is_institutional_landholder = models.CharField(max_length=30, default='not_sure')
    has_aadhaar_linked_bank_dbt = models.CharField(max_length=30, default='not_sure')
    is_bank_dbt_enabled = models.CharField(max_length=30, default='not_sure')
    has_land_records_712 = models.CharField(max_length=30, default='not_sure')
    has_kisan_credit_card = models.CharField(max_length=30, default='not_sure')
    has_soil_health_card = models.CharField(max_length=30, default='not_sure')
    previous_subsidy_availed = models.CharField(max_length=30, default='not_sure')
    has_farmer_registration_id = models.CharField(max_length=30, default='not_sure')

    profile_completion_percent = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_completion(self):
        """Calculates true profile completeness based on verified field presence"""
        scored_fields = [
            bool(self.name),
            bool(self.state),
            bool(self.district),
            bool(self.village),
            self.landholding_acres is not None and self.landholding_acres > 0,
            bool(self.land_ownership),
            bool(self.irrigation_availability),
            bool(self.crop_type and len(self.crop_type) > 0),
            bool(self.social_category),
            self.has_aadhaar_linked_bank_dbt in ('yes', 'no', 'true', 'false'),
            self.has_land_records_712 in ('yes', 'no', 'true', 'false'),
            self.is_income_tax_payee in ('yes', 'no', 'true', 'false'),
        ]
        return int((sum(scored_fields) / len(scored_fields)) * 100)

    def save(self, *args, **kwargs):
        self.profile_completion_percent = self.calculate_completion()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profile of {self.name} ({self.district}, {self.state})"
