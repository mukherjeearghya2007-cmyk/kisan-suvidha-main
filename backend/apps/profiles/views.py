from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FarmerProfile
from .serializers import FarmerProfileSerializer

class FarmerProfileView(APIView):
    """
    Get or update the authenticated farmer's private profile.
    Strictly restricted to request.user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = FarmerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'name': request.user.full_name,
                'state': request.user.state,
                'district': request.user.district,
                'village': request.user.village,
            }
        )
        serializer = FarmerProfileSerializer(profile)
        return Response({'success': True, 'profile': serializer.data})

    def put(self, request):
        profile, _ = FarmerProfile.objects.get_or_create(user=request.user)
        serializer = FarmerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            updated_profile = serializer.save()
            return Response({
                'success': True,
                'message': 'Farmer profile updated successfully.',
                'profile': FarmerProfileSerializer(updated_profile).data
            })
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)
