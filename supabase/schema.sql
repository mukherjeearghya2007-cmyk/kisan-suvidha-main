-- ==============================================================================
-- KISAN SUVIDHA (किसान सुविधा) - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Supports: Dynamic Nationwide Scheme Discovery, 28 Categories, 
--           Role-Based Multi-Tenant Farmer Accounts, Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHEME CATEGORIES TABLE (28 Standard Categories)
CREATE TABLE IF NOT EXISTS public.scheme_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMER USERS & PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'admin', 'verifier')),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr')),
    
    -- Geographical Location
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100),
    village VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    
    -- Farming Details
    farmer_category VARCHAR(50) DEFAULT 'small' CHECK (farmer_category IN ('marginal', 'small', 'medium', 'large', 'women_farmer')),
    landholding_acres NUMERIC(8, 2) DEFAULT 0.0 CHECK (landholding_acres >= 0),
    landholding_unit VARCHAR(20) DEFAULT 'acres',
    land_ownership VARCHAR(50) DEFAULT 'owner' CHECK (land_ownership IN ('owner', 'tenant', 'sharecropper', 'oral_lessee', 'landless')),
    land_type VARCHAR(50) DEFAULT 'irrigated',
    irrigation_availability VARCHAR(50) DEFAULT 'well_borewell',
    crops_cultivated TEXT[] DEFAULT '{}',
    crop_seasons TEXT[] DEFAULT '{"Kharif"}',
    is_organic_farmer BOOLEAN DEFAULT FALSE,
    
    -- Allied Activities
    allied_activities TEXT[] DEFAULT '{}', -- e.g. dairy, poultry, fisheries, beekeeping
    
    -- Economic & Social Categorization
    annual_family_income NUMERIC(12, 2) DEFAULT 0.0,
    social_category VARCHAR(50) DEFAULT 'General' CHECK (social_category IN ('General', 'OBC', 'SC', 'ST')),
    is_tribal_beneficiary BOOLEAN DEFAULT FALSE,
    is_women_farmer_head BOOLEAN DEFAULT FALSE,
    
    -- Statutory Rule Factors
    is_income_tax_payee BOOLEAN DEFAULT FALSE,
    holds_constitutional_post BOOLEAN DEFAULT FALSE,
    is_institutional_landholder BOOLEAN DEFAULT FALSE,
    has_aadhaar_linked_bank_dbt BOOLEAN DEFAULT TRUE,
    has_land_records_712 BOOLEAN DEFAULT TRUE,
    has_kisan_credit_card BOOLEAN DEFAULT FALSE,
    has_soil_health_card BOOLEAN DEFAULT FALSE,
    previous_subsidy_availed BOOLEAN DEFAULT FALSE,
    
    -- Farming Requirements
    farming_needs TEXT[] DEFAULT '{}',
    
    -- Metadata
    profile_completion_percent INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GOVERNMENT SCHEMES REPOSITORY TABLE
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    alternative_names TEXT[] DEFAULT '{}',
    name_hi VARCHAR(255),
    name_mr VARCHAR(255),
    department_en TEXT NOT NULL,
    department_hi TEXT,
    department_mr TEXT,
    
    category_id INT REFERENCES public.scheme_categories(id),
    category_name VARCHAR(150) NOT NULL,
    subcategory VARCHAR(150),
    
    scheme_type VARCHAR(20) NOT NULL CHECK (scheme_type IN ('central', 'state', 'ut')),
    state_coverage TEXT[] DEFAULT '{"All India"}',
    district_coverage TEXT[] DEFAULT '{}',
    is_district_specific BOOLEAN DEFAULT FALSE,
    crop_coverage TEXT[] DEFAULT '{"All Crops"}',
    applicable_activities TEXT[] DEFAULT '{}',
    target_beneficiaries TEXT[] DEFAULT '{}',
    
    benefits_en TEXT NOT NULL,
    benefits_hi TEXT,
    benefits_mr TEXT,
    benefits_amount VARCHAR(150),
    
    description_en TEXT NOT NULL,
    description_hi TEXT,
    description_mr TEXT,
    
    eligibility_overview_en TEXT NOT NULL,
    eligibility_overview_hi TEXT,
    eligibility_overview_mr TEXT,
    
    official_url TEXT NOT NULL,
    source_url TEXT NOT NULL,
    last_verified_date DATE NOT NULL,
    application_period VARCHAR(150),
    is_open BOOLEAN DEFAULT TRUE,
    scheme_status VARCHAR(50) DEFAULT 'application_open' CHECK (scheme_status IN ('active', 'application_open', 'application_closed', 'temporarily_suspended', 'announced', 'expired', 'status_unknown')),
    verification_status VARCHAR(50) DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending_verification', 'outdated', 'conflicting', 'archived')),
    helpline VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SCHEME ELIGIBILITY RULES TABLE (Independent Rule Engine Data)
CREATE TABLE IF NOT EXISTS public.scheme_eligibility_rules (
    id VARCHAR(100) PRIMARY KEY,
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    condition_number INT NOT NULL,
    condition_name VARCHAR(150) NOT NULL,
    field VARCHAR(100) NOT NULL,
    operator VARCHAR(50) NOT NULL CHECK (operator IN ('eq', 'neq', 'gte', 'lte', 'between', 'in', 'not_in', 'is_false', 'is_true', 'all_in')),
    expected_value JSONB NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_exclusion BOOLEAN DEFAULT FALSE,
    explanation_en TEXT NOT NULL,
    explanation_hi TEXT,
    explanation_mr TEXT,
    failure_reason_en TEXT NOT NULL,
    failure_reason_hi TEXT,
    failure_reason_mr TEXT,
    remedy_step_en TEXT,
    remedy_step_hi TEXT,
    remedy_step_mr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCHEME REQUIRED DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.scheme_documents (
    id VARCHAR(100) PRIMARY KEY,
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    name_mr VARCHAR(255),
    is_mandatory BOOLEAN DEFAULT TRUE,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    issuing_authority_en VARCHAR(255),
    issuing_authority_hi VARCHAR(255),
    issuing_authority_mr VARCHAR(255),
    help_tip_en TEXT,
    help_tip_hi TEXT,
    help_tip_mr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SAVED SCHEMES / BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.saved_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, scheme_id)
);

-- 7. APPLICATION DRAFTS & CHECKLIST PROGRESS
CREATE TABLE IF NOT EXISTS public.application_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    document_progress JSONB DEFAULT '{}', -- e.g. {"doc-aadhaar": "ready", "doc-land": "collected"}
    completed_steps INT[] DEFAULT '{}',
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, scheme_id)
);

-- 8. SCHEME ALERTS AND NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.scheme_alerts (
    id VARCHAR(100) PRIMARY KEY,
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE SET NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    title_mr VARCHAR(255),
    description_en TEXT NOT NULL,
    description_hi TEXT,
    description_mr TEXT,
    alert_date DATE NOT NULL,
    deadline_date DATE,
    alert_type VARCHAR(50) DEFAULT 'announcement' CHECK (alert_type IN ('deadline', 'announcement', 'scheme_update')),
    is_urgent BOOLEAN DEFAULT FALSE,
    source_url TEXT NOT NULL,
    official_reference VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SCHEME VERIFICATION AUDIT LOG (Administrative Track Record)
CREATE TABLE IF NOT EXISTS public.scheme_verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id VARCHAR(100) REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    verifier_user_id UUID REFERENCES auth.users(id),
    verification_status VARCHAR(50) NOT NULL,
    official_source_checked TEXT NOT NULL,
    notes TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCHING & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.government_schemes(category_name);
CREATE INDEX IF NOT EXISTS idx_schemes_type ON public.government_schemes(scheme_type);
CREATE INDEX IF NOT EXISTS idx_schemes_status ON public.government_schemes(scheme_status);
CREATE INDEX IF NOT EXISTS idx_schemes_verification ON public.government_schemes(verification_status);
CREATE INDEX IF NOT EXISTS idx_schemes_state_gin ON public.government_schemes USING GIN(state_coverage);
CREATE INDEX IF NOT EXISTS idx_schemes_crops_gin ON public.government_schemes USING GIN(crop_coverage);
CREATE INDEX IF NOT EXISTS idx_farmer_location ON public.farmer_profiles(state, district);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user ON public.saved_schemes(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures complete multi-tenant isolation between different farmers
-- ==============================================================================

-- Enable RLS on private farmer tables
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- 1. Farmer Profiles: Farmers can only SELECT and UPDATE their OWN profile
CREATE POLICY "Farmers can view own profile" 
ON public.farmer_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can update own profile" 
ON public.farmer_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert own profile" 
ON public.farmer_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Saved Schemes: Farmers can only view and manage their own bookmarks
CREATE POLICY "Farmers can view own bookmarks" 
ON public.saved_schemes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert own bookmarks" 
ON public.saved_schemes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can delete own bookmarks" 
ON public.saved_schemes FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Application Drafts: Private to authenticated farmer
CREATE POLICY "Farmers can manage own drafts" 
ON public.application_drafts FOR ALL 
USING (auth.uid() = user_id);

-- 4. Government Schemes & Public Alerts: Read-only for all public visitors
CREATE POLICY "Public can view active verified schemes" 
ON public.government_schemes FOR SELECT 
TO PUBLIC 
USING (verification_status != 'archived');

CREATE POLICY "Admins have full access to schemes" 
ON public.government_schemes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.farmer_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
