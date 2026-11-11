from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import FarmerUser

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer_data = {
            'full_name': 'Ramesh Patil',
            'mobile': '9876543210',
            'email': 'ramesh@kisan.in',
            'password': 'StrongPassword@123',
            'state': 'Maharashtra',
            'district': 'Pune',
            'village': 'Baramati'
        }

    def test_01_register_new_farmer(self):
        """Scenario 1: Register a new farmer account successfully"""
        response = self.client.post('/api/auth/register/', self.farmer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['full_name'], 'Ramesh Patil')
        
        # Verify password is encrypted and never plain text in DB
        user = FarmerUser.objects.get(mobile='9876543210')
        self.assertNotEqual(user.password, 'StrongPassword@123')
        self.assertTrue(user.check_password('StrongPassword@123'))

    def test_02_register_duplicate_mobile(self):
        """Scenario 2: Register using an already existing mobile number fails"""
        self.client.post('/api/auth/register/', self.farmer_data, format='json')
        # Attempt second registration with same mobile
        response = self.client.post('/api/auth/register/', self.farmer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_03_register_missing_fields(self):
        """Scenario 3: Register with missing required mobile or name fails"""
        bad_data = {'password': 'Password123'}
        response = self.client.post('/api/auth/register/', bad_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_04_login_valid_credentials(self):
        """Scenario 4: Login using valid 10-digit mobile and password"""
        # First register
        self.client.post('/api/auth/register/', self.farmer_data, format='json')

        # Login with mobile
        login_res = self.client.post('/api/auth/login/', {
            'identifier': '9876543210',
            'password': 'StrongPassword@123'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data['success'])
        self.assertIn('token', login_res.data)

    def test_05_login_incorrect_password(self):
        """Scenario 5: Login using incorrect password fails"""
        self.client.post('/api/auth/register/', self.farmer_data, format='json')

        login_res = self.client.post('/api/auth/login/', {
            'identifier': '9876543210',
            'password': 'WrongPassword999'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(login_res.data['success'])

    def test_06_protected_endpoint_without_auth(self):
        """Scenario 6: Access protected endpoint without token returns 401 Unauthorized"""
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_07_logout_revokes_token(self):
        """Scenario 7: Logout invalidates token"""
        reg_res = self.client.post('/api/auth/register/', self.farmer_data, format='json')
        token = reg_res.data['token']

        # Authorize client
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        logout_res = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Subsequent authenticated call should fail
        me_res = self.client.get('/api/auth/me/')
        self.assertEqual(me_res.status_code, status.HTTP_401_UNAUTHORIZED)
