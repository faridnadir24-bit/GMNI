-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Utama Isu (Issues)
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  location TEXT,
  sub_location TEXT,
  status TEXT DEFAULT 'emerging',
  impact_score INT CHECK (impact_score >= 0 AND impact_score <= 100),
  evidence_score INT CHECK (evidence_score >= 0 AND evidence_score <= 100),
  momentum_score INT CHECK (momentum_score >= 0 AND momentum_score <= 100),
  source_count INT DEFAULT 0,
  source_urls TEXT[],
  source_names TEXT[],
  published_at TIMESTAMP,
  detected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  verified_facts TEXT[],
  claims TEXT[],
  unverified TEXT[],
  research_questions TEXT[],
  actor_map JSONB
);

-- 2. Tabel Log Sumber Berita Mentah (Raw Sources)
CREATE TABLE IF NOT EXISTS raw_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  fetched_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_slug ON issues(slug);
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues(location);
CREATE INDEX IF NOT EXISTS idx_issues_detected_at ON issues(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_sources_processed ON raw_sources(processed);
