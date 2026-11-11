from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import FarmerUser

class FarmerUserSerializer(serializers.ModelSerializer):
    """Public serialized view of authenticated farmer account"""
    class Meta:
        model = FarmerUser
        fields = [
            'id', 'username', 'email', 'mobile', 'full_name',
            'role', 'state', 'district', 'village', 'email_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = FarmerUser
        fields = ['full_name', 'email', 'mobile', 'password', 'state', 'district', 'village']

    def validate(self, data):
        mobile = data.get('mobile', '').strip()
        email = data.get('email', '').strip().lower()

        if not mobile and not email:
            raise serializers.ValidationError("Either a valid 10-digit mobile number or email address is required.")

        if mobile:
            # Clean mobile
            clean_mobile = ''.join(filter(str.isdigit, mobile))
            if len(clean_mobile) == 10:
                data['mobile'] = clean_mobile
            elif len(clean_mobile) > 10 and clean_mobile.startswith('91'):
                data['mobile'] = clean_mobile[-10:]
            else:
                raise serializers.ValidationError({"mobile": "Please provide a valid 10-digit Indian mobile number."})

            if FarmerUser.objects.filter(mobile=data['mobile']).exists():
                raise serializers.ValidationError({"mobile": "A farmer account with this mobile number already exists."})

        if email:
            if FarmerUser.objects.filter(email=email).exists():
                raise serializers.ValidationError({"email": "An account with this email address already exists."})
            data['email'] = email

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = FarmerUser.objects.create_user(password=password, **validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        identifier = data.get('identifier', '').strip()
        password = data.get('password', '')

        # Check if identifier is 10 digit mobile or email or username
        clean_mobile = ''.join(filter(str.isdigit, identifier))
        user = None

        if len(clean_mobile) == 10:
            try:
                candidate = FarmerUser.objects.get(mobile=clean_mobile)
                if candidate.check_password(password):
                    user = candidate
            except FarmerUser.DoesNotExist:
                pass

        if not user:
            # Check by email
            try:
                candidate = FarmerUser.objects.get(email__iexact=identifier)
                if candidate.check_password(password):
                    user = candidate
            except FarmerUser.DoesNotExist:
                pass

        if not user:
            # Check standard django username
            user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials. Please verify your mobile number/email and password.")

        if not user.is_active:
            raise serializers.ValidationError("This farmer account is currently inactive.")

        data['user'] = user
        return data
