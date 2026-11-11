from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import FarmerUser
from apps.profiles.models import FarmerProfile
from apps.schemes.models import Scheme
from . import tools
from .agent import run_kisan_ai_agent

class AIAssistantAgentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = FarmerUser.objects.create_user(
            username='ai_farmer',
            mobile='9777777777',
            full_name='Kisan Tester',
            password='Password@123'
        )
        self.profile = FarmerProfile.objects.create(
            user=self.user,
            name='Kisan Tester',
            state='Maharashtra',
            district='Kolhapur',
            landholding_acres=4.0,
            land_ownership='owner'
        )
        self.scheme = Scheme.objects.create(
            id='pm-kisan',
            name='PM-KISAN Samman Nidhi',
            category='Income Support',
            scheme_type='central',
            state_coverage=['All India'],
            benefits_amount='₹6,000 / year',
            official_url='https://pmkisan.gov.in',
            source_url='https://pmkisan.gov.in'
        )

    def test_01_tool_get_farmer_profile(self):
        """Tool 1: get_farmer_profile queries real profile from SQLite"""
        res = tools.get_farmer_profile(user=self.user)
        self.assertTrue(res['success'])
        self.assertEqual(res['profile']['name'], 'Kisan Tester')
        self.assertEqual(res['profile']['landholding_acres'], 4.0)
        self.assertEqual(res['profile']['state'], 'Maharashtra')

    def test_02_tool_search_government_schemes(self):
        """Tool 2: search_government_schemes retrieves real database schemes"""
        results = tools.search_government_schemes(query='Samman')
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['id'], 'pm-kisan')

    def test_03_agent_execution_without_gemini_key_falls_back_gracefully(self):
        """Agent executes controlled database tools without failing when Gemini key is empty"""
        result = run_kisan_ai_agent(
            message='What is my farm landholding in my profile?',
            user=self.user,
            language='en'
        )
        self.assertIn('response', result)
        self.assertIn('4.0', result['response'])
        self.assertIn('Kisan Tester', result['response'])
        self.assertGreaterEqual(len(result['tools_invoked']), 1)
        self.assertEqual(result['tools_invoked'][0]['tool'], 'get_farmer_profile')

    def test_04_chat_endpoint_stores_history(self):
        """API /api/ai/chat/ accepts query, returns answer and persists session"""
        payload = {
            'message': 'Am I eligible for PM-KISAN?',
            'language': 'en'
        }
        from rest_framework.authtoken.models import Token
        token = Token.objects.create(user=self.user).key
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        response = self.client.post('/api/ai/chat/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('response', response.data)
        self.assertIn('session_id', response.data)
