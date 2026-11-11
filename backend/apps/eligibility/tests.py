from django.test import TestCase
from rest_framework.test import APIClient
from apps.schemes.models import Scheme, SchemeRule
from .engine import evaluate_scheme_eligibility

class EligibilityEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.scheme = Scheme.objects.create(
            id='test-scheme',
            name='Test Agricultural Scheme',
            category='Income Support',
            scheme_type='central',
            state_coverage=['All India'],
            official_url='https://pmkisan.gov.in',
            source_url='https://pmkisan.gov.in'
        )

        # Mandatory Rule 1: Land Ownership must be 'owner'
        self.rule_ownership = SchemeRule.objects.create(
            scheme=self.scheme,
            rule_id='test-rule-1',
            condition_number=1,
            condition_name='Land Ownership',
            field='land_ownership',
            label={'en': 'Must own land', 'hi': 'जमीन का मालिक होना चाहिए', 'mr': 'स्वतःची जमीन असावी'},
            operator='in',
            expected_value=['owner'],
            is_mandatory=True,
            is_exclusion=False,
            explanation={'en': 'Only landowners qualify', 'hi': 'केवल भूमि मालिक पात्र हैं', 'mr': 'केवळ जमीन मालक पात्र'},
            failure_reason={'en': 'Tenant farmers are not covered', 'hi': 'पट्टेदार किसान पात्र नहीं हैं', 'mr': 'भाडेकरू शेतकरी पात्र नाहीत'},
            missing_reason={'en': 'Land ownership details missing', 'hi': 'भूमि स्वामित्व अधूरा है', 'mr': 'जमीन मालकीची नोंद नाही'},
            remedy_step={'en': 'Update land records', 'hi': 'राजस्व रिकॉर्ड अपडेट करें', 'mr': '७/१२ उतारा जोडा'}
        )

        # Mandatory Exclusion Rule 2: Must NOT be Income Tax Payee
        self.rule_tax = SchemeRule.objects.create(
            scheme=self.scheme,
            rule_id='test-rule-2',
            condition_number=2,
            condition_name='Income Tax Exclusion',
            field='is_income_tax_payee',
            label={'en': 'Must not pay tax', 'hi': 'आयकर दाता नहीं होना चाहिए', 'mr': 'आयकर भरलेला नसावा'},
            operator='in',
            expected_value=['no', False],
            is_mandatory=True,
            is_exclusion=True,
            explanation={'en': 'Taxpayers are excluded', 'hi': 'आयकर दाता अपात्र हैं', 'mr': 'आयकरदाते अपात्र आहेत'},
            failure_reason={'en': 'Income tax payer exclusion applies', 'hi': 'आयकर दाता होने के कारण अपात्र', 'mr': 'आयकर भरत असल्यामुळे अपात्र'},
            missing_reason={'en': 'Tax status unconfirmed', 'hi': 'आयकर स्थिति असत्यापित', 'mr': 'आयकर नोंद नाही'},
            remedy_step={'en': 'Verify tax filing status', 'hi': 'आयकर स्थिति जांचें', 'mr': 'आयकर स्थिती तपासा'}
        )

    def test_01_farmer_satisfying_all_mandatory_conditions(self):
        """Case 1: Eligible farmer satisfying all conditions -> returns 'eligible' (GREEN)"""
        farmer = {
            'land_ownership': 'owner',
            'is_income_tax_payee': 'no'
        }
        result = evaluate_scheme_eligibility(farmer, self.scheme, lang='en')
        self.assertEqual(result['status'], 'eligible')
        self.assertEqual(len(result['matched_rules']), 2)
        self.assertEqual(len(result['failed_rules']), 0)
        self.assertEqual(len(result['missing_rules']), 0)
        self.assertIn('Verified Eligible', result['summary'])

    def test_02_farmer_failing_mandatory_condition(self):
        """Case 2: Farmer failing land ownership -> returns 'not_eligible' (RED)"""
        farmer = {
            'land_ownership': 'tenant',
            'is_income_tax_payee': 'no'
        }
        result = evaluate_scheme_eligibility(farmer, self.scheme, lang='en')
        self.assertEqual(result['status'], 'not_eligible')
        self.assertEqual(len(result['failed_rules']), 1)
        self.assertEqual(result['failed_rules'][0]['rule_id'], 'test-rule-1')
        self.assertIn('Tenant farmers are not covered', result['failed_rules'][0]['message'])

    def test_03_farmer_matching_exclusion_condition(self):
        """Case 3: Farmer who pays Income Tax -> returns 'not_eligible' (RED)"""
        farmer = {
            'land_ownership': 'owner',
            'is_income_tax_payee': 'yes'  # Matches exclusion -> Fail
        }
        result = evaluate_scheme_eligibility(farmer, self.scheme, lang='en')
        self.assertEqual(result['status'], 'not_eligible')
        self.assertEqual(len(result['failed_rules']), 1)
        self.assertEqual(result['failed_rules'][0]['rule_id'], 'test-rule-2')
        self.assertTrue(result['failed_rules'][0]['is_exclusion'])

    def test_04_farmer_with_missing_information(self):
        """Case 4: Information missing or unconfirmed -> returns 'partially_eligible' (YELLOW)"""
        farmer = {
            'land_ownership': 'owner',
            'is_income_tax_payee': 'not_sure'  # Unconfirmed
        }
        result = evaluate_scheme_eligibility(farmer, self.scheme, lang='en')
        self.assertEqual(result['status'], 'partially_eligible')
        self.assertEqual(len(result['missing_rules']), 1)
        self.assertEqual(result['missing_rules'][0]['rule_id'], 'test-rule-2')
        self.assertIn('Potentially Eligible', result['summary'])

    def test_05_multilingual_explanations(self):
        """Case 5: Verification warnings in Hindi and Marathi"""
        farmer = {'land_ownership': 'tenant', 'is_income_tax_payee': 'no'}
        
        # Test Hindi output
        result_hi = evaluate_scheme_eligibility(farmer, self.scheme, lang='hi')
        self.assertEqual(result_hi['status'], 'not_eligible')
        self.assertIn('वैधानिक रूप से अपात्र', result_hi['summary'])
        self.assertIn('पट्टेदार किसान पात्र नहीं हैं', result_hi['failed_rules'][0]['message'])

        # Test Marathi output
        result_mr = evaluate_scheme_eligibility(farmer, self.scheme, lang='mr')
        self.assertEqual(result_mr['status'], 'not_eligible')
        self.assertIn('नियमांनुसार अपात्र', result_mr['summary'])
        self.assertIn('भाडेकरू शेतकरी पात्र नाहीत', result_mr['failed_rules'][0]['message'])
