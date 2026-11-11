from rest_framework import serializers
from .models import Scheme, SchemeRule, DocumentRequirement

class SchemeRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchemeRule
        fields = [
            'rule_id', 'condition_number', 'condition_name', 'field',
            'label', 'operator', 'expected_value', 'is_mandatory',
            'is_exclusion', 'explanation', 'failure_reason', 'missing_reason', 'remedy_step'
        ]

class DocumentRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRequirement
        fields = [
            'doc_id', 'name', 'is_mandatory', 'description', 'issuing_authority', 'help_tip'
        ]

class SchemeListSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='scheme_type')

    class Meta:
        model = Scheme
        fields = [
            'id', 'name', 'alternative_names', 'local_names', 'department',
            'category', 'subcategory', 'type', 'state_coverage', 'crop_coverage',
            'benefits_amount', 'benefits', 'description', 'eligibility_overview',
            'official_url', 'source_url', 'last_verified_date', 'application_period',
            'is_open', 'scheme_status', 'verification_status', 'helpline', 'badge'
        ]

class SchemeDetailSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='scheme_type')
    rules = SchemeRuleSerializer(many=True, read_only=True)
    required_documents = DocumentRequirementSerializer(many=True, read_only=True)

    class Meta:
        model = Scheme
        fields = [
            'id', 'name', 'alternative_names', 'local_names', 'department',
            'category', 'subcategory', 'type', 'state_coverage', 'district_coverage',
            'crop_coverage', 'target_beneficiaries', 'applicable_activities',
            'benefits_amount', 'benefits', 'description', 'eligibility_overview',
            'rules', 'required_documents', 'application_steps',
            'official_url', 'source_url', 'last_verified_date', 'application_period',
            'is_open', 'scheme_status', 'verification_status', 'helpline', 'badge'
        ]
