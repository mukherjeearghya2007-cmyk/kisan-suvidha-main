import json
from django.core.management.base import BaseCommand
from apps.schemes.models import Scheme, SchemeRule, DocumentRequirement

class Command(BaseCommand):
    help = 'Seeds verified central and state agricultural welfare schemes, rules, and documents'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding authentic government welfare schemes..."))

        schemes_data = [
            {
                "id": "pm-kisan",
                "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "alternative_names": ["PM KISAN", "Kisan Samman Nidhi"],
                "local_names": {
                    "en": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                    "hi": "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
                    "mr": "पीएम-किसान (प्रधानमंत्री किसान सन्मान निधी)"
                },
                "department": {
                    "en": "Department of Agriculture & Farmers Welfare, Ministry of Agriculture",
                    "hi": "कृषि एवं किसान कल्याण विभाग, भारत सरकार",
                    "mr": "कृषी आणि शेतकरी कल्याण विभाग, भारत सरकार"
                },
                "category": "Income Support & Direct Assistance",
                "subcategory": "Direct Benefit Transfer (DBT)",
                "scheme_type": "central",
                "state_coverage": ["All India"],
                "crop_coverage": ["All Crops", "Cereals", "Pulses", "Oilseeds", "Cotton", "Horticulture"],
                "target_beneficiaries": ["Small and marginal landowners", "All landowning farmer families"],
                "applicable_activities": ["agri_business", "horticulture"],
                "benefits_amount": "₹6,000 / year (3 installments)",
                "benefits": {
                    "en": "Direct Income Support of ₹6,000 annually, transferred directly via DBT into the verified bank account of the beneficiary farmer family in three equal installments of ₹2,000 each.",
                    "hi": "वार्षिक ₹6,000 की सीधी आय सहायता, जो लाभार्थी किसान परिवार के बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT) द्वारा ₹2,000 की तीन समान किस्तों में सीधे भेजी जाती है।",
                    "mr": "वार्षिक ₹६,००० चे थेट उत्पन्न सहाय्य, जे पात्र शेतकरी कुटुंबाच्या बँक खात्यात थेट लाभ हस्तांतरणाद्वारे (DBT) ₹२,००० च्या तीन समान हप्त्यांमध्ये जमा केले जाते."
                },
                "description": {
                    "en": "Flagship Central Sector Scheme providing supplemental income support to all landholding farmer families with cultivable land.",
                    "hi": "खेती योग्य ज़मीन वाले सभी ज़मीन मालिक किसान परिवारों को पूरक आय सहायता प्रदान करने वाली प्रमुख केंद्रीय योजना।",
                    "mr": "लागवडयोग्य जमीन असलेल्या सर्व जमीनधारक शेतकरी कुटुंबांना आर्थिक मदत देणारी केंद्र सरकारची प्रमुख योजना."
                },
                "eligibility_overview": {
                    "en": "Cultivable land ownership registered in state revenue records; Aadhaar-seeded bank account with DBT enabled; Farmer family must not fall under institutional or income tax exclusion categories.",
                    "hi": "राज्य राजस्व रिकॉर्ड में पंजीकृत कृषि योग्य ज़मीन; आधार से जुड़ा डीबीटी बैंक खाता; परिवार संस्थागत या आयकर दाता अपवर्जन श्रेणी में न आता हो।",
                    "mr": "महसूल नोंदींमध्ये स्वतःच्या नावावर शेतजमीन; आधार लिंक बँक खाते; आयकर दाता किंवा संस्थागत अपवर्जन नियमात नसावे."
                },
                "official_url": "https://pmkisan.gov.in",
                "source_url": "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
                "last_verified_date": "2026-10-25",
                "application_period": "Continuous / Open round the year",
                "is_open": True,
                "scheme_status": "active",
                "verification_status": "verified",
                "helpline": "155261 / 011-24300606 / 1800-180-1551",
                "badge": "Direct Income Support",
                "rules": [
                    {
                        "rule_id": "pmk-rule-1",
                        "condition_number": 8,
                        "condition_name": "Land Ownership Status",
                        "field": "land_ownership",
                        "label": {
                            "en": "Must be a legal landowner of cultivable farm land",
                            "hi": "कृषि योग्य भूमि का कानूनी मालिकाना हक होना चाहिए",
                            "mr": "लागवडयोग्य शेतजमिनीचा कायदेशीर मालक असणे आवश्यक"
                        },
                        "operator": "in",
                        "expected_value": ["owner"],
                        "is_mandatory": True,
                        "is_exclusion": False,
                        "explanation": {
                            "en": "Scheme benefits are restricted to cultivator families with ownership rights over land in revenue records.",
                            "hi": "योजना का लाभ केवल उन्हीं कृषक परिवारों को मिलता है जिनके नाम राजस्व रिकॉर्ड में ज़मीन दर्ज है।",
                            "mr": "योजनेचा लाभ केवळ ज्यांच्या नावावर महसूल नोंदीत शेतजमीन आहे अशाच शेतकरी कुटुंबांना मिळतो."
                        },
                        "failure_reason": {
                            "en": "Landless agricultural laborers, pure tenant farmers, or oral lessees are currently not covered under PM-KISAN guidelines.",
                            "hi": "भूमिहीन खेतिहर मजदूर और पट्टेदार किसान वर्तमान पीएम-किसान दिशानिर्देशों के तहत पात्र नहीं हैं।",
                            "mr": "भूमिहीन शेतमजूर आणि केवळ भाडेकरू शेतकरी पीएम-किसान मार्गदर्शक तत्त्वांनुसार पात्र नाहीत."
                        },
                        "missing_reason": {
                            "en": "Land ownership status is missing in your profile. Please specify whether you own farm land.",
                            "hi": "आपकी प्रोफ़ाइल में भूमि स्वामित्व की जानकारी अधूरी है। कृपया स्पष्ट करें कि क्या आपके पास अपनी ज़मीन है।",
                            "mr": "तुमच्या प्रोफाइलमध्ये जमिनीच्या मालकीचा तपशील नाही. कृपया शेतजमीन स्वतःच्या मालकीची आहे का ते नोंदवा."
                        },
                        "remedy_step": {
                            "en": "Update land ownership details in your farmer profile with RoR / 7/12 extract details.",
                            "hi": "अपनी किसान प्रोफ़ाइल में खतौनी/जमाबंदी के अनुसार भूमि स्वामित्व दर्ज करें।",
                            "mr": "आपल्या शेतकरी प्रोफाइलमध्ये ७/१२ उताऱ्यानुसार जमीन मालकीची नोंद करा."
                        }
                    },
                    {
                        "rule_id": "pmk-rule-2",
                        "condition_number": 13,
                        "condition_name": "Income Tax Payee Exclusion",
                        "field": "is_income_tax_payee",
                        "label": {
                            "en": "Must NOT be an Income Tax payee in the last assessment year",
                            "hi": "पिछले आकलन वर्ष में आयकर दाता (Income Tax Payee) नहीं होना चाहिए",
                            "mr": "मागील मूल्यांकन वर्षात आयकर (Income Tax) भरलेला नसावा"
                        },
                        "operator": "in",
                        "expected_value": ["no", False],
                        "is_mandatory": True,
                        "is_exclusion": True,
                        "explanation": {
                            "en": "Individuals who paid income tax in the last assessment year are statutorily excluded.",
                            "hi": "पिछले वित्तीय वर्ष में आयकर भरने वाले व्यक्ति पीएम-किसान से वैधानिक रूप से बाहर हैं।",
                            "mr": "मागील वर्षात आयकर भरलेले व्यक्ती पीएम-किसान योजनेतून वगळण्यात आले आहेत."
                        },
                        "failure_reason": {
                            "en": "Income tax payers are statutorily excluded from PM-KISAN benefits.",
                            "hi": "आयकर दाता होने के कारण आप पीएम-किसान योजना के लिए अपात्र हैं।",
                            "mr": "आयकर भरत असल्यामुळे आपण पीएम-किसान योजनेसाठी अपात्र आहात."
                        },
                        "missing_reason": {
                            "en": "Income tax status is unconfirmed in your profile.",
                            "hi": "आयकर स्थिति की पुष्टि आपकी प्रोफ़ाइल में नहीं की गई है।",
                            "mr": "आयकर भरता किंवा नाही याची नोंद प्रोफाइलमध्ये नाही."
                        },
                        "remedy_step": {
                            "en": "Confirm in your profile whether any family member paid income tax.",
                            "hi": "अपनी प्रोफ़ाइल में पुष्टि करें कि क्या परिवार का कोई सदस्य आयकर भरता है।",
                            "mr": "प्रोफाइलमध्ये आयकर स्थितीची पडताळणी नोंदवा."
                        }
                    },
                    {
                        "rule_id": "pmk-rule-3",
                        "condition_number": 16,
                        "condition_name": "Aadhaar Bank DBT Linkage",
                        "field": "has_aadhaar_linked_bank_dbt",
                        "label": {
                            "en": "Bank account must be Aadhaar-seeded with active NPCI DBT",
                            "hi": "बैंक खाता आधार से लिंक और डीबीटी (NPCI DBT) सक्रिय होना चाहिए",
                            "mr": "बँक खाते आधार लिंक आणि डीबीटी (NPCI DBT) सक्रिय असणे आवश्यक"
                        },
                        "operator": "in",
                        "expected_value": ["yes", True],
                        "is_mandatory": True,
                        "is_exclusion": False,
                        "explanation": {
                            "en": "Under Central DBT norms, installment funds can only be released to NPCI-mapped bank accounts.",
                            "hi": "केंद्रीय डीबीटी नियमों के अनुसार, किस्त की राशि केवल एनपीसीआई-मैप्ड बैंक खातों में ही भेजी जा सकती है।",
                            "mr": "केंद्रीय डीबीटी नियमांनुसार, अनुदानाची रक्कम केवळ आधार लिंक बँक खात्यातच जमा होते."
                        },
                        "failure_reason": {
                            "en": "Without Aadhaar-seeded bank account and active DBT mapping, PM-KISAN installments cannot be credited.",
                            "hi": "आधार लिंक और डीबीटी सक्रिय बैंक खाते के बिना पीएम-किसान किस्त जमा नहीं हो सकती।",
                            "mr": "आधार-सीडेड बँक खाते आणि सक्रिय डीबीटीशिवाय पीएम-किसान हप्ता जमा होऊ शकत नाही."
                        },
                        "missing_reason": {
                            "en": "Aadhaar bank DBT seeding status is not confirmed in your profile.",
                            "hi": "बैंक डीबीटी सीडिंग की स्थिति आपकी प्रोफ़ाइल में दर्ज नहीं है।",
                            "mr": "बँक डीबीटी सीडिंग स्थिती प्रोफाइलमध्ये नोंदवलेली नाही."
                        },
                        "remedy_step": {
                            "en": "Visit your bank branch with Aadhaar Card and submit the NPCI DBT Mandate form.",
                            "hi": "अपनी बैंक शाखा में जाकर आधार कार्ड के साथ एनपीसीआई डीबीटी फॉर्म जमा करें।",
                            "mr": "आपल्या बँक शाखेत जाऊन आधार कार्डसह एनपीसीआई डीबीटी फॉर्म जमा करा."
                        }
                    }
                ],
                "documents": [
                    {
                        "doc_id": "doc-pmk-1",
                        "name": {
                            "en": "Aadhaar Card with Linked Mobile Number",
                            "hi": "आधार कार्ड (मोबाइल नंबर लिंक सहित)",
                            "mr": "आधार कार्ड (लिंक केलेल्या मोबाईल क्रमांकासह)"
                        },
                        "is_mandatory": True,
                        "description": {
                            "en": "Mandatory for biometric/OTP eKYC authentication on the PM-KISAN portal.",
                            "hi": "पीएम-किसान पोर्टल पर बायोमेट्रिक या ओटीपी ई-केवाईसी सत्यापन के लिए अनिवार्य।",
                            "mr": "पीएम-किसान पोर्टलवर बायोमेट्रिक किंवा ओटीपी ई-केवायसीसाठी आवश्यक."
                        },
                        "issuing_authority": {
                            "en": "UIDAI (Government of India)",
                            "hi": "यूआईडीएआई (भारत सरकार)",
                            "mr": "यूआयडीएआय (भारत सरकार)"
                        },
                        "help_tip": {
                            "en": "Ensure mobile number is active to receive OTP.",
                            "hi": "सुनिश्चित करें कि ओटीपी प्राप्त करने के लिए आपका मोबाइल नंबर चालू है।",
                            "mr": "ओटीपी मिळण्यासाठी मोबाईल नंबर सुरू असल्याची खात्री करा."
                        }
                    },
                    {
                        "doc_id": "doc-pmk-2",
                        "name": {
                            "en": "Land Ownership Record (7/12 Extract / Khasra-Khatauni / RoR)",
                            "hi": "भूमि स्वामित्व रिकॉर्ड (खसरा-खतौनी / 7/12 उतारा / जमाबंदी)",
                            "mr": "जमीन महसूल नोंद (७/१२ उतारा / ८-अ / खातावणी)"
                        },
                        "is_mandatory": True,
                        "description": {
                            "en": "Official state revenue record proving agricultural land ownership in applicant's name.",
                            "hi": "आवेदक के नाम पर कृषि भूमि के स्वामित्व को प्रमाणित करने वाला आधिकारिक राजस्व रिकॉर्ड।",
                            "mr": "अर्जदाराच्या नावावर शेतजमीन असल्याचे सिद्ध करणारा महसूल विभागाचा अधिकृत उतारा."
                        },
                        "issuing_authority": {
                            "en": "State Revenue Department / Bhulekh / Mahabhulekh Portal",
                            "hi": "राज्य राजस्व विभाग / भूलेख पोर्टल / तहसील",
                            "mr": "राज्य महसूल विभाग / महाभूलेख पोर्टल / तलाठी कार्यालय"
                        },
                        "help_tip": {
                            "en": "Digitally signed recent 7/12 copy can be downloaded from state revenue portal.",
                            "hi": "डिजिटल हस्ताक्षरित खतौनी राज्य भूलेख पोर्टल से निकाली जा सकती है।",
                            "mr": "डिजिटल स्वाक्षरीचा ७/१२ महाभूलेख संकेतस्थळावरून डाऊनलोड करता येतो."
                        }
                    },
                    {
                        "doc_id": "doc-pmk-3",
                        "name": {
                            "en": "Bank Passbook with Aadhaar Seeding Proof",
                            "hi": "बैंक पासबुक (आधार सीडिंग और डीबीटी सत्यापन प्रमाण सहित)",
                            "mr": "बँक पासबुक (आधार सीडिंग व डीबीटी पुरावा)"
                        },
                        "is_mandatory": True,
                        "description": {
                            "en": "Account must be in applicant's name, active, with IFSC code and Aadhaar DBT enabled.",
                            "hi": "खाता आवेदक के नाम पर, सक्रिय, आईएफएससी कोड और आधार डीबीटी सक्षम होना चाहिए।",
                            "mr": "खाते अर्जदाराच्या नावावर, सक्रिय, आयएफएससी कोड आणि आधार डीबीटी सक्षम असावे."
                        },
                        "issuing_authority": {
                            "en": "Scheduled Commercial Bank / Regional Rural Bank (RRB) / Post Office Bank",
                            "hi": "अनुसूचित वाणिज्यिक बैंक / ग्रामीण बैंक / डाकघर बैंक",
                            "mr": "राष्ट्रीयकृत बँक / ग्रामीण बँक / पोस्ट ऑफिस बँक"
                        },
                        "help_tip": {
                            "en": "Ask your bank manager for an NPCI mapping confirmation slip.",
                            "hi": "शाखा प्रबंधक से एनपीसीआई मैपिंग पुष्टि रसीद अवश्य प्राप्त करें।",
                            "mr": "शाखा व्यवस्थापकाकडून एनपीसीआय मॅपिंगची पावती आवर्जून घ्या."
                        }
                    }
                ]
            },
            {
                "id": "pmfby",
                "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                "alternative_names": ["PMFBY", "Crop Insurance Scheme", "Pradhan Mantri Fasal Bima"],
                "local_names": {
                    "en": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                    "hi": "पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)",
                    "mr": "पीएमएफबीवाय (प्रधानमंत्री पीक विमा योजना)"
                },
                "department": {
                    "en": "Credit Division, Department of Agriculture & Farmers Welfare",
                    "hi": "ऋण प्रभाग, कृषि एवं किसान कल्याण विभाग",
                    "mr": "पत विभाग, कृषी आणि शेतकरी कल्याण विभाग"
                },
                "category": "Crop Insurance & Risk Protection",
                "subcategory": "Comprehensive Natural Risk Cover",
                "scheme_type": "central",
                "state_coverage": ["All India"],
                "crop_coverage": ["All Food Crops", "Oilseeds", "Annual Commercial Crops", "Horticultural Crops"],
                "target_beneficiaries": ["All farmers growing notified crops", "Loanee and Non-Loanee farmers", "Sharecroppers and tenant farmers"],
                "applicable_activities": ["horticulture", "organic_farming"],
                "benefits_amount": "Up to 100% Insured Sum for prevented sowing, mid-season adversity, and localized post-harvest loss",
                "benefits": {
                    "en": "Comprehensive risk insurance covering yield losses due to non-preventable natural risks (drought, flood, pests, hailstorm, localized landslides). Farmer pays uniform nominal premium of only 2% for Kharif crops, 1.5% for Rabi food/oilseeds, and 5% for annual commercial/horticultural crops; the remainder is heavily subsidized by Central and State Governments.",
                    "hi": "अतिवृष्टि, सूखा, कीट और ओलावृष्टि से फसल क्षति पर संपूर्ण बीमा सुरक्षा। किसान को खरीफ के लिए केवल 2%, रबी के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5% नाममात्र प्रीमियम देना होता है; शेष राशि केंद्र व राज्य सरकार द्वारा वहन की जाती है।",
                    "mr": "दुष्काळ, पूर, कीड आणि गारपिटीमुळे होणाऱ्या नुकसानीवर संपूर्ण विमा संरक्षण. शेतकऱ्याला खरीप पिकांसाठी केवळ २%, रब्बीसाठी १.५% आणि बागायती पिकांसाठी ५% नाममात्र हप्ता भरावा लागतो; उर्वरित खर्च सरकार उचलते."
                },
                "description": {
                    "en": "National crop insurance flagship scheme offering financial cushion against crop failure from sowing to post-harvest stages.",
                    "hi": "बुवाई से लेकर कटाई के बाद तक प्राकृतिक आपदाओं से होने वाले फसल नुकसान के खिलाफ राष्ट्रीय फसल बीमा सुरक्षा।",
                    "mr": "पेरणीपासून काढणीपर्यंत नैसर्गिक आपत्तींमुळे होणाऱ्या पीक नुकसानीपासून शेतकऱ्यांना संरक्षण देणारी राष्ट्रीय योजना."
                },
                "eligibility_overview": {
                    "en": "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers; Sowing certificate / land cultivation proof; Enrollment within seasonal cut-off dates.",
                    "hi": "अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले सभी किसान (बटाईदार व पट्टेदार सहित); बुवाई प्रमाण पत्र / भूमि जोत प्रमाण; निर्धारित अंतिम तिथि से पूर्व आवेदन।",
                    "mr": "अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व शेतकरी (भाडेकरू व बटाईदारांसह); पेरणी प्रमाणपत्र; विहित मुदतीपूर्वी नोंदणी आवश्यक."
                },
                "official_url": "https://pmfby.gov.in",
                "source_url": "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",
                "last_verified_date": "2026-10-20",
                "application_period": "Seasonal: Kharif (till July 31), Rabi (till Dec 31)",
                "is_open": True,
                "scheme_status": "active",
                "verification_status": "verified",
                "helpline": "14447 (Krishi Rakshak Portal & Helpline)",
                "badge": "Crop Risk Shield",
                "rules": [
                    {
                        "rule_id": "pmfby-rule-1",
                        "condition_number": 6,
                        "condition_name": "Cultivated Crop Coverage",
                        "field": "crop_type",
                        "label": {
                            "en": "Must cultivate notified food grains, oilseeds, or commercial crops",
                            "hi": "अधिसूचित अनाज, तिलहन या बागवानी फसलों की खेती करना आवश्यक",
                            "mr": "अधिसूचित धान्य, गळीत धान्ये किंवा बागायती पिकांची लागवड असणे आवश्यक"
                        },
                        "operator": "neq",
                        "expected_value": [],
                        "is_mandatory": True,
                        "is_exclusion": False,
                        "explanation": {
                            "en": "Coverage is applicable to notified crops grown in the designated district/taluka cluster.",
                            "hi": "बीमा केवल अधिसूचित तहसील/क्लस्टर में उगाई जाने वाली अधिसूचित फसलों पर लागू होता है।",
                            "mr": "विमा संरक्षण केवळ अधिसूचित क्षेत्रात पिकवल्या जाणाऱ्या अधिसूचित पिकांसाठीच लागू आहे."
                        },
                        "failure_reason": {
                            "en": "No cultivated crops specified in your profile.",
                            "hi": "आपकी प्रोफ़ाइल में किसी फसल की जानकारी नहीं दी गई है।",
                            "mr": "आपल्या प्रोफाइलमध्ये कोणत्याही पिकाची नोंद नाही."
                        },
                        "missing_reason": {
                            "en": "Please select the crops currently sown or planned in your field.",
                            "hi": "कृपया अपने खेत में बोई गई या नियोजित फसलों का चयन करें।",
                            "mr": "कृपया शेतात पेरलेली किंवा नियोजित पिके निवडा."
                        },
                        "remedy_step": {
                            "en": "Add your Kharif / Rabi crops in the Farmer Profile.",
                            "hi": "अपनी किसान प्रोफ़ाइल में खरीफ या रबी फसलों को जोड़ें।",
                            "mr": "आपल्या शेतकरी प्रोफाइलमध्ये खरीप किंवा रब्बी पिकांची नोंद करा."
                        }
                    }
                ],
                "documents": [
                    {
                        "doc_id": "doc-pmfby-1",
                        "name": {
                            "en": "Sowing Certificate / Crop Sowing Declaration",
                            "hi": "बुवाई प्रमाण पत्र / फसल स्व-घोषणा पत्र",
                            "mr": "पेरणी प्रमाणपत्र / पीक पाहणी स्वयंघोषणा पत्र"
                        },
                        "is_mandatory": True,
                        "description": {
                            "en": "Issued by Village Patwari/Talathi or e-Pik Pahani digital portal proving current season sowing.",
                            "hi": "पटवारी/लेखपाल द्वारा प्रमाणित या ई-पीक पाहणी पोर्टल से प्राप्त बुवाई प्रमाण।",
                            "mr": "तलाठी किंवा ई-पीक पाहणी ॲपवरून मिळालेला पीक पेरणीचा अधिकृत पुरावा."
                        },
                        "issuing_authority": {
                            "en": "Village Patwari / Talathi / State Agriculture Assistant",
                            "hi": "पटवारी / लेखपाल / कृषि पर्यवेक्षक",
                            "mr": "तलाठी / कृषी सहाय्यक / ई-पीक पाहणी"
                        },
                        "help_tip": {
                            "en": "Upload digital e-Pik Pahani screenshot or CSC counter certificate.",
                            "hi": "ई-पीक पाहणी का स्क्रीनशॉट या सीएससी से जारी रसीद संलग्न करें।",
                            "mr": "ई-पीक पाहणीची पावती किंवा सीएससीची पोचपावती वापरा."
                        }
                    }
                ]
            },
            {
                "id": "pm-kusum",
                "name": "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
                "alternative_names": ["PM KUSUM", "Solar Pump Scheme", "Kisan Urja Suraksha"],
                "local_names": {
                    "en": "PM-KUSUM Solar Agricultural Pump Scheme",
                    "hi": "पीएम-कुसुम सोलर कृषि पंप योजना",
                    "mr": "पीएम-कुसुम सौर कृषी पंप योजना"
                },
                "department": {
                    "en": "Ministry of New and Renewable Energy (MNRE), Government of India",
                    "hi": "नवीन और नवीकरणीय ऊर्जा मंत्रालय, भारत सरकार",
                    "mr": "नवीन आणि नवीकरणीय ऊर्जा मंत्रालय, भारत सरकार"
                },
                "category": "Solar Pumps & Renewable Energy",
                "subcategory": "Off-Grid Solarization",
                "scheme_type": "central",
                "state_coverage": ["All India"],
                "crop_coverage": ["All Crops"],
                "target_beneficiaries": ["Individual farmers", "Water user associations", "FPOs", "Panchayats"],
                "applicable_activities": ["agri_business", "horticulture", "organic_farming"],
                "benefits_amount": "60% Combined Subsidy (30% Central + 30% State); Farmer pays only 10% directly, 30% via bank loan",
                "benefits": {
                    "en": "Installation of 3 HP, 5 HP, and 7.5 HP standalone solar agricultural water pumps in off-grid rural areas. Farmers receive 60% direct subsidy on solar pump cost, enabling daytime irrigation without diesel bills or electricity grid dependence.",
                    "hi": "ग्रिड-रहित ग्रामीण क्षेत्रों में 3, 5 और 7.5 एचपी के स्टैंडअलोन सोलर पंपों की स्थापना। कुल लागत पर 60% सरकारी सब्सिडी (30% केंद्र + 30% राज्य)। किसान को केवल 10% अग्रिम राशि देनी होती है, शेष 30% बैंक ऋण से उपलब्ध कराया जाता है।",
                    "mr": "वीज जोडणी नसलेल्या भागात ३, ५ आणि ७.५ एचपी क्षमतेचे स्वतंत्र सौर कृषी पंप. पंपाच्या खर्चावर ६०% थेट सरकारी अनुदान. डिझेलच्या खर्चापासून मुक्ती आणि दिवसा हक्काचे सिंचन."
                },
                "description": {
                    "en": "National renewable initiative providing standalone solar irrigation pumps to replace costly diesel engines and power agricultural tubewells.",
                    "hi": "महंगे डीजल इंजनों को बदलने और खेतों में दिन के समय निर्बाध सिंचाई सुनिश्चित करने के लिए सौर पंप योजना।",
                    "mr": "डिझेल पंपांना पर्याय म्हणून आणि दिवसा हक्काचे पाणी मिळण्यासाठी सौर कृषी पंप योजना."
                },
                "eligibility_overview": {
                    "en": "Cultivable land with dedicated water source (borewell/open well/farm pond); Field must not already possess an energized agricultural grid connection (for Component B standalone pumps).",
                    "hi": "कृषि भूमि जहां जल स्रोत (बोरवेल/कुआं/तालाब) उपलब्ध हो; उस भूमि पर पहले से बिजली ग्रिड कनेक्शन नहीं होना चाहिए।",
                    "mr": "शेतात पाण्याचा स्रोत (विहीर/बोअरवेल/शेततळे) उपलब्ध असावा; त्या शेतात आधीपासून वीज जोडणी नसणे आवश्यक."
                },
                "official_url": "https://pmkusum.mnre.gov.in",
                "source_url": "https://mnre.gov.in/solar/schemes",
                "last_verified_date": "2026-10-18",
                "application_period": "Quota allotments based on State Nodal Agency calls",
                "is_open": True,
                "scheme_status": "active",
                "verification_status": "verified",
                "helpline": "1800-180-3333 / State Nodal Energy Agencies (MEDA, UPNEDA)",
                "badge": "60% Solar Subsidy",
                "rules": [
                    {
                        "rule_id": "kusum-rule-1",
                        "condition_number": 8,
                        "condition_name": "Agricultural Landholding",
                        "field": "land_ownership",
                        "label": {
                            "en": "Must own cultivable agricultural land suitable for pump installation",
                            "hi": "सोलर पंप लगाने योग्य कृषि भूमि का मालिकाना हक होना चाहिए",
                            "mr": "सौर पंप बसवण्यासाठी स्वतःच्या नावावर शेतजमीन असणे आवश्यक"
                        },
                        "operator": "in",
                        "expected_value": ["owner"],
                        "is_mandatory": True,
                        "is_exclusion": False,
                        "explanation": {
                            "en": "Solar pump assets are permanently affixed to the beneficiary's registered agricultural parcel.",
                            "hi": "सोलर पंप परिसंपत्ति लाभार्थी के पंजीकृत कृषि खेत में स्थापित की जाती है।",
                            "mr": "सौर कृषी पंप लाभार्थीच्या स्वतःच्या नोंदणीकृत शेतात बसवला जातो."
                        },
                        "failure_reason": {
                            "en": "Tenant or oral lessee farmers require long-term registered lease deeds to qualify for solar pump allotment.",
                            "hi": "पट्टेदार किसानों को सोलर पंप आवंटन के लिए दीर्घकालिक पंजीकृत पट्टा विलेख आवश्यक है।",
                            "mr": "भाडेकरू शेतकऱ्यांना सौर पंपासाठी दीर्घकालीन नोंदणीकृत करारपत्र आवश्यक असते."
                        },
                        "missing_reason": {
                            "en": "Land ownership status is missing in your profile.",
                            "hi": "भूमि स्वामित्व स्थिति आपकी प्रोफ़ाइल में दर्ज नहीं है।",
                            "mr": "जमीन मालकीची नोंद प्रोफाइलमध्ये नाही."
                        },
                        "remedy_step": {
                            "en": "Update land ownership details in your farmer profile.",
                            "hi": "अपनी किसान प्रोफ़ाइल में भूमि स्वामित्व विवरण अपडेट करें।",
                            "mr": "आपल्या शेतकरी प्रोफाइलमध्ये जमीन मालकीचा तपशील नोंदवा."
                        }
                    }
                ],
                "documents": [
                    {
                        "doc_id": "doc-kusum-1",
                        "name": {
                            "en": "Water Source Certificate / Borewell or Well Inspection Report",
                            "hi": "जल स्रोत प्रमाण पत्र / कुआं या बोरवेल सत्यापन रिपोर्ट",
                            "mr": "पाण्याचा स्रोत प्रमाणपत्र / विहीर किंवा बोअरवेल पंचनामा"
                        },
                        "is_mandatory": True,
                        "description": {
                            "en": "Proof of water discharge capability on the farmer's land issued by local irrigation or agriculture assistant.",
                            "hi": "स्थानीय कृषि पर्यवेक्षक द्वारा जारी कुएं या बोरवेल में जल उपलब्धता का प्रमाण।",
                            "mr": "शेतातील विहीर किंवा बोअरवेलमध्ये पाणी असल्याचा कृषी सहाय्यकाचा अहवाल."
                        },
                        "issuing_authority": {
                            "en": "Taluka Agriculture Officer / Gram Panchayat Certificate",
                            "hi": "तहसील कृषि अधिकारी / ग्राम पंचायत",
                            "mr": "तालुका कृषी अधिकारी / ग्रामपंचायत"
                        },
                        "help_tip": {
                            "en": "Take photograph of open well or borewell with geolocation enabled.",
                            "hi": "कुएं या बोरवेल की जीपीएस फोटो संलग्न करें।",
                            "mr": "विहीर किंवा बोअरवेलचा जीपीएस फोटो काढून ठेवा."
                        }
                    }
                ]
            }
        ]

        for s_data in schemes_data:
            rules_data = s_data.pop("rules", [])
            docs_data = s_data.pop("documents", [])
            scheme, created = Scheme.objects.update_or_create(
                id=s_data["id"],
                defaults=s_data
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} Scheme: {scheme.name}"))

            # Seed Rules
            for r_data in rules_data:
                SchemeRule.objects.update_or_create(
                    scheme=scheme,
                    rule_id=r_data["rule_id"],
                    defaults=r_data
                )

            # Seed Documents
            for d_data in docs_data:
                DocumentRequirement.objects.update_or_create(
                    scheme=scheme,
                    doc_id=d_data["doc_id"],
                    defaults=d_data
                )

        self.stdout.write(self.style.SUCCESS("All verified schemes, rules, and documents seeded successfully!"))
