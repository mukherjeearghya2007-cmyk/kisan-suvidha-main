from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.schemes.models import Scheme
from apps.schemes.serializers import DocumentRequirementSerializer

class SchemeGuidanceView(APIView):
    """
    Returns step-by-step application guidance, mandatory documentation checklist,
    issuing authorities, and official application portal URLs.
    """
    permission_classes = [AllowAny]

    def get(self, request, scheme_id):
        try:
            scheme = Scheme.objects.prefetch_related('required_documents').get(id=scheme_id)
        except Scheme.DoesNotExist:
            return Response({'success': False, 'error': 'Scheme not found'}, status=404)

        docs = scheme.required_documents.all()
        doc_serializer = DocumentRequirementSerializer(docs, many=True)

        return Response({
            'success': True,
            'scheme_id': scheme.id,
            'scheme_name': scheme.name,
            'official_url': scheme.official_url,
            'source_url': scheme.source_url,
            'helpline': scheme.helpline,
            'application_steps': scheme.application_steps,
            'required_documents': doc_serializer.data
        })
