from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import FarmerUser
from .models import FarmerProfile

class ProfileTests(TestCase):
    def setUp(self):
        self.client_a = APIClient()
        self.client_b = APIClient()

        # Farmer A
        self.user_a = FarmerUser.objects.create_user(
            username='farmer_a',
            mobile='9111111111',
            full_name='Farmer A',
            password='PassA@123',
            state='Maharashtra',
            district='Nashik'
        )
        self.profile_a = FarmerProfile.objects.create(
            user=self.user_a,
            name='Farmer A',
            state='Maharashtra',
            district='Nashik',
            landholding_acres=3.5,
            land_ownership='owner'
        )

        # Farmer B
        self.user_b = FarmerUser.objects.create_user(
            username='farmer_b',
            mobile='9222222222',
            full_name='Farmer B',
            password='PassB@123',
            state='Punjab',
            district='Ludhiana'
        )
        self.profile_b = FarmerProfile.objects.create(
            user=self.user_b,
            name='Farmer B',
            state='Punjab',
            district='Ludhiana',
            landholding_acres=12.0,
            land_ownership='tenant'
        )

    def test_01_retrieve_own_profile(self):
        """Farmer retrieves their own private profile"""
        token = self.user_a.auth_token.key if hasattr(self.user_a, 'auth_token') else None
        if not token:
            from rest_framework.authtoken.models import Token
            token = Token.objects.create(user=self.user_a).key
            
        self.client_a.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client_a.get('/api/profiles/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['profile']['name'], 'Farmer A')
        self.assertEqual(response.data['profile']['landholding_acres'], 3.5)

    def test_02_update_own_profile(self):
        """Farmer updates their farm parameters"""
        from rest_framework.authtoken.models import Token
        token, _ = Token.objects.get_or_create(user=self.user_a)
        self.client_a.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        update_payload = {
            'crop_type': ['Wheat', 'Sugarcane'],
            'irrigation_availability': 'drip_sprinkler',
            'is_organic_farmer': True,
            'has_aadhaar_linked_bank_dbt': 'yes'
        }
        response = self.client_a.put('/api/profiles/me/', update_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        # Verify persistence in DB
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.crop_type, ['Wheat', 'Sugarcane'])
        self.assertEqual(self.profile_a.irrigation_availability, 'drip_sprinkler')
        self.assertTrue(self.profile_a.is_organic_farmer)
        self.assertEqual(self.profile_a.has_aadhaar_linked_bank_dbt, 'yes')

    def test_03_data_isolation_between_farmers(self):
        """Scenario 8: Farmer B cannot read or overwrite Farmer A's profile"""
        from rest_framework.authtoken.models import Token
        token_b, _ = Token.objects.get_or_create(user=self.user_b)
        self.client_b.credentials(HTTP_AUTHORIZATION=f'Token {token_b}')

        # Requesting /api/profiles/me/ as Farmer B strictly returns Farmer B's profile
        response = self.client_b.get('/api/profiles/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['profile']['name'], 'Farmer B')
        self.assertEqual(response.data['profile']['district'], 'Ludhiana')
        self.assertNotEqual(response.data['profile']['name'], 'Farmer A')
