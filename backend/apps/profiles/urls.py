from django.urls import path
from .views import FarmerProfileView

urlpatterns = [
    path('me/', FarmerProfileView.as_view(), name='farmer_profile_me'),
]
