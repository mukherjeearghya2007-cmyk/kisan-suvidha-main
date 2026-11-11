from rest_framework import serializers
from .models import SavedScheme, ApplicationDraft
from apps.schemes.serializers import SchemeListSerializer

class SavedSchemeSerializer(serializers.ModelSerializer):
    scheme = SchemeListSerializer(read_only=True)
    scheme_id = serializers.CharField(write_only=True)

    class Meta:
        model = SavedScheme
        fields = ['id', 'scheme', 'scheme_id', 'saved_at']

class ApplicationDraftSerializer(serializers.ModelSerializer):
    scheme_id = serializers.CharField(source='scheme.id', read_only=True)
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)

    class Meta:
        model = ApplicationDraft
        fields = ['id', 'scheme_id', 'scheme_name', 'document_status', 'completed_steps', 'notes', 'updated_at']
