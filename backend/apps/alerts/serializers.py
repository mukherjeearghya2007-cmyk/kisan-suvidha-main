from rest_framework import serializers
from .models import SchemeAlert

class SchemeAlertSerializer(serializers.ModelSerializer):
    scheme_id = serializers.CharField(source='scheme.id', read_only=True)
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)

    class Meta:
        model = SchemeAlert
        fields = [
            'id', 'title', 'description', 'date', 'deadline',
            'alert_type', 'scheme_id', 'scheme_name', 'state',
            'is_urgent', 'verified', 'source_url', 'official_reference'
        ]
