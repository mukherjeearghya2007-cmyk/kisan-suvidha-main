from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.schemes.models import Scheme, SchemeRule, DocumentRequirement

class SchemeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.scheme1 = Scheme.objects.create(
            id='pm-kisan-test',
            name='PM-KISAN Samman Nidhi',
            category='Income Support',
            scheme_type='central',
            state_coverage=['All India'],
            crop_coverage=['All Crops'],
            benefits_amount='₹6,000 / year',
            official_url='https://pmkisan.gov.in',
            source_url='https://pmkisan.gov.in'
        )
        self.scheme2 = Scheme.objects.create(
            id='mh-solar-test',
            name='Maharashtra Krishi Solar Pump Yojana',
            category='Irrigation',
            scheme_type='state',
            state_coverage=['Maharashtra'],
            crop_coverage=['Sugarcane', 'Cotton'],
            benefits_amount='95% Subsidy',
            official_url='https://mahadiscom.in',
            source_url='https://mahadiscom.in'
        )
        self.rule = SchemeRule.objects.create(
            scheme=self.scheme1,
            rule_id='rule_land',
            condition_name='Land Ownership',
            field='land_ownership',
            operator='in',
            expected_value=['owner'],
            is_mandatory=True,
            is_exclusion=False
        )
        self.doc = DocumentRequirement.objects.create(
            scheme=self.scheme1,
            doc_id='doc_712',
            name={'en': '7/12 Land Extract'},
            is_mandatory=True
        )

    def test_01_list_all_schemes(self):
        """GET /api/schemes/ returns all active schemes"""
        res = self.client.get('/api/schemes/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['count'], 2)

    def test_02_search_schemes_by_query(self):
        """GET /api/schemes/?q=solar filters matching schemes"""
        res = self.client.get('/api/schemes/?q=solar')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['schemes'][0]['id'], 'mh-solar-test')

    def test_03_filter_by_state(self):
        """GET /api/schemes/?state=Maharashtra returns state and national schemes"""
        res = self.client.get('/api/schemes/?state=Maharashtra')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 2)

    def test_04_filter_by_type(self):
        """GET /api/schemes/?type=central returns only central schemes"""
        res = self.client.get('/api/schemes/?type=central')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['schemes'][0]['id'], 'pm-kisan-test')

    def test_05_retrieve_scheme_detail(self):
        """GET /api/schemes/<id>/ returns full detail with rules and documents"""
        res = self.client.get('/api/schemes/pm-kisan-test/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['scheme']['id'], 'pm-kisan-test')
        self.assertEqual(len(res.data['scheme']['rules']), 1)
        self.assertEqual(len(res.data['scheme']['required_documents']), 1)
