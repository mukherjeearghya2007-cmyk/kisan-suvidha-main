from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import FarmerUser
from apps.schemes.models import Scheme
from .models import SavedScheme, ApplicationDraft

class SavedSchemesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = FarmerUser.objects.create_user(
            username='ram_farmer',
            mobile='9888888888',
            full_name='Ram Singh',
            password='TestPassword@123'
        )
        self.scheme = Scheme.objects.create(
            id='pm-kisan-test',
            name='PM-KISAN Test Scheme',
            category='Direct Income Support',
            scheme_type='central',
            state_coverage=['All India'],
            official_url='https://pmkisan.gov.in',
            source_url='https://pmkisan.gov.in'
        )
        from rest_framework.authtoken.models import Token
        token = Token.objects.create(user=self.user).key
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

    def test_01_toggle_save_scheme(self):
        """Bookmark and un-bookmark a scheme"""
        # Save scheme
        res1 = self.client.post('/api/saved/toggle/', {'scheme_id': 'pm-kisan-test'}, format='json')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertTrue(res1.data['is_saved'])
        self.assertIn('pm-kisan-test', res1.data['scheme_ids'])

        # Check in list
        list_res = self.client.get('/api/saved/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data['saved_schemes']), 1)

        # Un-save scheme
        res2 = self.client.post('/api/saved/toggle/', {'scheme_id': 'pm-kisan-test'}, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_saved'])
        self.assertNotIn('pm-kisan-test', res2.data['scheme_ids'])

    def test_02_application_draft_document_checklist(self):
        """Update 5-state document checklist progress in application draft"""
        draft_url = '/api/saved/drafts/pm-kisan-test/'
        payload = {
            'document_status': {
                'doc-pmk-1': 'verified',
                'doc-pmk-2': 'collected'
            },
            'completed_steps': [1, 2],
            'notes': 'Land record verified with Talathi office.'
        }
        update_res = self.client.post(draft_url, payload, format='json')
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(update_res.data['draft']['document_status']['doc-pmk-1'], 'verified')
        self.assertEqual(update_res.data['draft']['document_status']['doc-pmk-2'], 'collected')
