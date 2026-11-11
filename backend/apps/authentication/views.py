from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, FarmerUserSerializer
from apps.profiles.models import FarmerProfile

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            
            # Automatically provision initial neutral FarmerProfile for this farmer
            FarmerProfile.objects.get_or_create(
                user=user,
                defaults={
                    'name': user.full_name,
                    'state': user.state,
                    'district': user.district,
                    'village': user.village,
                    'preferred_language': 'en'
                }
            )

            return Response({
                'success': True,
                'message': 'Farmer account registered successfully.',
                'token': token.key,
                'user': FarmerUserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'success': True,
                'message': f'Welcome back, {user.full_name}!',
                'token': token.key,
                'user': FarmerUserSerializer(user).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Delete token to invalidate server session
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'success': True, 'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'success': True,
            'user': FarmerUserSerializer(request.user).data
        })
