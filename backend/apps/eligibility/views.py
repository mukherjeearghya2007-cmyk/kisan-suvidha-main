from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.schemes.models import Scheme
from apps.profiles.models import FarmerProfile
from .engine import evaluate_scheme_eligibility

class EligibilityCheckView(APIView):
    """
    Evaluates statutory scheme eligibility.
    Accepts:
    - scheme_id (required): ID of scheme to evaluate
    - lang: 'en', 'hi', or 'mr'
    - profile: Optional inline farmer profile payload (if anonymous or previewing)
    If request.user is authenticated and no inline profile is passed, uses the stored DB profile.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        scheme_id = request.data.get('scheme_id')
        lang = request.data.get('lang', 'en')
        profile_override = request.data.get('profile')

        if not scheme_id:
            return Response(
                {'success': False, 'error': 'scheme_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            scheme = Scheme.objects.prefetch_related('rules', 'required_documents').get(id=scheme_id)
        except Scheme.DoesNotExist:
            return Response(
                {'success': False, 'error': f'Scheme with id "{scheme_id}" not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        farmer_data = None
        if profile_override and isinstance(profile_override, dict):
            farmer_data = profile_override
        elif request.user.is_authenticated:
            try:
                farmer_data = request.user.profile
            except FarmerProfile.DoesNotExist:
                farmer_data = {}
        else:
            # Neutral baseline for guest visitor
            farmer_data = {}

        result = evaluate_scheme_eligibility(farmer_data, scheme, lang=lang)
        return Response({
            'success': True,
            'result': result
        }, status=status.HTTP_200_OK)
