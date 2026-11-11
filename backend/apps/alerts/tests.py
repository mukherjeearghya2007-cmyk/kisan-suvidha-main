from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.schemes.models import Scheme
from apps.alerts.models import SchemeAlert

class AlertAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.scheme = Scheme.objects.create(
            id='pmfby-test',
            name='Pradhan Mantri Fasal Bima Yojana',
            category='Crop Insurance',
            scheme_type='central',
            state_coverage=['All India'],
            crop_coverage=['All Crops'],
            benefits_amount='Up to 90% loss claim',
            official_url='https://pmfby.gov.in',
            source_url='https://pmfby.gov.in'
        )
        self.alert_national = SchemeAlert.objects.create(
            id='alert-national-1',
            scheme=self.scheme,
            title={'en': 'Kharif Cut-Off Date Extended'},
            description={'en': 'All farmers can apply till July 31.'},
            date='2026-06-01',
            deadline='2026-07-31',
            alert_type='deadline',
            is_urgent=True,
            state='',
            source_url='https://pmfby.gov.in',
            official_reference='DOAC&FW-2026/04'
        )
        self.alert_state = SchemeAlert.objects.create(
            id='alert-state-1',
            scheme=self.scheme,
            title={'en': 'Maharashtra District Subsidy Release'},
            description={'en': 'Direct DBT transferred.'},
            date='2026-06-05',
            alert_type='announcement',
            is_urgent=False,
            state='Maharashtra',
            source_url='https://krishi.maharashtra.gov.in',
            official_reference='MAH-AGRI-2026/12'
        )

    def test_01_list_alerts(self):
        """GET /api/alerts/ returns all active alerts"""
        res = self.client.get('/api/alerts/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['count'], 2)

    def test_02_filter_urgent_alerts(self):
        """GET /api/alerts/?urgent=true filters only urgent alerts"""
        res = self.client.get('/api/alerts/?urgent=true')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertTrue(res.data['alerts'][0]['is_urgent'])

    def test_03_filter_by_state(self):
        """GET /api/alerts/?state=Maharashtra includes national and state-specific alerts"""
        res = self.client.get('/api/alerts/?state=Maharashtra')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 2)
