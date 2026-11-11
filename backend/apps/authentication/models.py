import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class FarmerUserManager(BaseUserManager):
    """Custom user manager supporting phone number or email authentication"""
    def create_user(self, username=None, email=None, mobile=None, password=None, **extra_fields):
        if not mobile and not email:
            raise ValueError('Either a mobile number or an email address must be provided')
        
        if email:
            email = self.normalize_email(email)
        else:
            email = ''
        
        # If username is not given, derive it from mobile or email
        if not username:
            username = mobile if mobile else (email.split('@')[0] if email else str(uuid.uuid4())[:8])
            
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        
        user = self.model(username=username, email=email, mobile=mobile, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username=username, email=email, password=password, **extra_fields)

class FarmerUser(AbstractUser):
    """
    Custom user model representing an Indian farmer account.
    Supports secure login with 10-digit mobile number or email.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mobile = models.CharField(max_length=15, unique=True, null=True, blank=True, db_index=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, default='farmer', choices=[('farmer', 'Farmer'), ('admin', 'Admin')])
    state = models.CharField(max_length=100, blank=True, default='')
    district = models.CharField(max_length=100, blank=True, default='')
    village = models.CharField(max_length=150, blank=True, default='')
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = FarmerUserManager()

    def __str__(self):
        return f"{self.full_name} ({self.mobile or self.email or self.username})"
