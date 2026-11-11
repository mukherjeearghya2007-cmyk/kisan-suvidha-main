from rest_framework import serializers
from .models import FarmerProfile

class FarmerProfileSerializer(serializers.ModelSerializer):
    userId = serializers.CharField(source='user.id', read_only=True)
    userEmail = serializers.CharField(source='user.email', read_only=True)
    userMobile = serializers.CharField(source='user.mobile', read_only=True)

    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'userId', 'userEmail', 'userMobile', 'name', 'age', 'gender',
            'state', 'district', 'taluka', 'village', 'pincode', 'preferred_language',
            'primary_occupation', 'farming_type', 'farmer_category',
            'landholding_acres', 'landholding_unit', 'land_ownership', 'land_type',
            'irrigation_availability', 'crop_type', 'crop_season', 'is_organic_farmer',
            'allied_activities', 'annual_family_income', 'social_category',
            'is_tribal_or_special_region', 'is_women_farmer_head', 'farming_needs',
            'is_income_tax_payee', 'holds_constitutional_post', 'is_institutional_landholder',
            'has_aadhaar_linked_bank_dbt', 'is_bank_dbt_enabled', 'has_land_records_712',
            'has_kisan_credit_card', 'has_soil_health_card', 'previous_subsidy_availed',
            'has_farmer_registration_id', 'profile_completion_percent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'userId', 'profile_completion_percent', 'created_at', 'updated_at']
