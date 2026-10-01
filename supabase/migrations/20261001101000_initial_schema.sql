-- Migration: Initial Schema for ContextLock
-- Description: Creates the relational foundation for media context verification.
-- Note: Authentication is deferred to a future phase. Minimal development RLS policies are applied.

-- Table: verification_cases
CREATE TABLE verification_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_claim TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: media
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES verification_cases(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: atomic_claims
CREATE TABLE atomic_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES verification_cases(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL CHECK (dimension IN ('what', 'where', 'when', 'who', 'other')),
    claim_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reasoning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: evidence
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES verification_cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    snippet TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: evidence_relationships
CREATE TABLE evidence_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES atomic_claims(id) ON DELETE CASCADE,
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL CHECK (relationship IN ('supports', 'contradicts', 'context', 'unrelated')),
    reasoning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(claim_id, evidence_id)
);

-- Table: verification_results
CREATE TABLE verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL UNIQUE REFERENCES verification_cases(id) ON DELETE CASCADE,
    context_status TEXT NOT NULL CHECK (context_status IN (
        'claim_supported', 
        'context_mismatch', 
        'temporal_mismatch', 
        'geographic_mismatch', 
        'event_mismatch', 
        'unverified'
    )),
    summary TEXT NOT NULL,
    confidence NUMERIC,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Storage bucket configuration
-- Creates the bucket for media if it doesn't exist. Setting public to false as requested.
INSERT INTO storage.buckets (id, name, public) VALUES ('contextlock-media', 'contextlock-media', false) ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS)
-- We enable RLS on all tables to ensure the architecture expects it.
ALTER TABLE verification_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE atomic_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_results ENABLE ROW LEVEL SECURITY;

-- Temporary Development / Hackathon Policies
-- Since there is no auth system yet, we permit all access for development.
-- MUST BE TIGHTENED ONCE AUTHENTICATION IS ADDED.
CREATE POLICY "Allow anonymous read and write on verification_cases for development" ON verification_cases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read and write on media for development" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read and write on atomic_claims for development" ON atomic_claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read and write on evidence for development" ON evidence FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read and write on evidence_relationships for development" ON evidence_relationships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read and write on verification_results for development" ON verification_results FOR ALL USING (true) WITH CHECK (true);

-- Storage RLS Policies
-- Allow unauthenticated access for development to the contextlock-media bucket
CREATE POLICY "Allow anonymous read and write on contextlock-media for development" ON storage.objects FOR ALL USING (bucket_id = 'contextlock-media') WITH CHECK (bucket_id = 'contextlock-media');
