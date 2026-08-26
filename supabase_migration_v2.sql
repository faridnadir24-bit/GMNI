-- =========================================================
-- RUANG ISU GMNI — Schema Migration V2
-- Core Architecture: BERITA ≠ ISU (Articles, Clustering, Evidence, Events)
-- =========================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENHANCE ISSUES TABLE
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
  urgency_score INT CHECK (urgency_score >= 0 AND urgency_score <= 100),
  evidence_score INT CHECK (evidence_score >= 0 AND evidence_score <= 100),
  momentum_score INT CHECK (momentum_score >= 0 AND momentum_score <= 100),
  confidence_score INT CHECK (confidence_score >= 0 AND confidence_score <= 100) DEFAULT 75,
  priority_score INT CHECK (priority_score >= 0 AND priority_score <= 100) DEFAULT 80,
  source_count INT DEFAULT 0,
  mention_count INT DEFAULT 1,
  is_priority BOOLEAN DEFAULT FALSE,
  is_emerging BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  source_urls TEXT[],
  source_names TEXT[],
  published_at TIMESTAMP,
  first_detected_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW(),
  detected_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  verified_facts TEXT[],
  claims TEXT[],
  unverified TEXT[],
  research_questions TEXT[],
  actor_map JSONB
);

-- Alter table in case issues table already exists from V1
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS confidence_score INT CHECK (confidence_score >= 0 AND confidence_score <= 100) DEFAULT 75;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS priority_score INT CHECK (priority_score >= 0 AND priority_score <= 100) DEFAULT 80;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS urgency_score INT CHECK (urgency_score >= 0 AND urgency_score <= 100) DEFAULT 75;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS mention_count INT DEFAULT 1;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT FALSE;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS is_emerging BOOLEAN DEFAULT TRUE;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS first_detected_at TIMESTAMP DEFAULT NOW();
    ALTER TABLE issues ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP DEFAULT NOW();
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Columns already exist';
  END;
END $$;

-- 2. NORMALIZED ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT UNIQUE NOT NULL,
  canonical_url TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source_name TEXT NOT NULL,
  source_type TEXT DEFAULT 'national_media', -- 'official' | 'national_media' | 'local_media' | 'social' | 'unknown'
  published_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  hash TEXT,
  language TEXT DEFAULT 'id',
  category TEXT,
  location TEXT,
  sub_location TEXT,
  relevance_score INT DEFAULT 80,
  processed BOOLEAN DEFAULT FALSE,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. ISSUE-SOURCES JUNCTION TABLE (1 Issue -> Many Sources; Article -> Issue)
CREATE TABLE IF NOT EXISTS issue_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT DEFAULT 'national_media',
  published_at TIMESTAMP,
  added_at TIMESTAMP DEFAULT NOW(),
  relevance_score INT DEFAULT 80,
  is_primary BOOLEAN DEFAULT FALSE,
  credibility_score INT DEFAULT 85,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_issue_source UNIQUE (issue_id, source_url)
);

-- 4. ISSUE ACTIVITY TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS issue_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'source_added' | 'official_statement' | 'public_signal' | 'issue_updated' | 'status_changed' | 'score_changed' | 'claim_added' | 'fact_added'
  title TEXT NOT NULL,
  description TEXT,
  source_id UUID,
  source_name TEXT,
  event_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. RAW INGESTION LOG TABLE (Preserved for compatibility)
CREATE TABLE IF NOT EXISTS raw_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  fetched_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_issues_slug ON issues(slug);
CREATE INDEX IF NOT EXISTS idx_issues_location ON issues(location);
CREATE INDEX IF NOT EXISTS idx_issues_sub_location ON issues(sub_location);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_last_activity ON issues(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_priority_score ON issues(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_issues_confidence_score ON issues(confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
CREATE INDEX IF NOT EXISTS idx_articles_issue_id ON articles(issue_id);
CREATE INDEX IF NOT EXISTS idx_articles_processed ON articles(processed);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_issue_sources_issue_id ON issue_sources(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_events_issue_id ON issue_events(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_events_event_at ON issue_events(event_at DESC);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_sources ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Allow public read on issues" ON issues;
CREATE POLICY "Allow public read on issues" ON issues FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on issues" ON issues;
CREATE POLICY "Allow public insert on issues" ON issues FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on issues" ON issues;
CREATE POLICY "Allow public update on issues" ON issues FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on articles" ON articles;
CREATE POLICY "Allow public read on articles" ON articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on articles" ON articles;
CREATE POLICY "Allow public insert on articles" ON articles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on articles" ON articles;
CREATE POLICY "Allow public update on articles" ON articles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on issue_sources" ON issue_sources;
CREATE POLICY "Allow public read on issue_sources" ON issue_sources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on issue_sources" ON issue_sources;
CREATE POLICY "Allow public insert on issue_sources" ON issue_sources FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on issue_sources" ON issue_sources;
CREATE POLICY "Allow public update on issue_sources" ON issue_sources FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on issue_events" ON issue_events;
CREATE POLICY "Allow public read on issue_events" ON issue_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on issue_events" ON issue_events;
CREATE POLICY "Allow public insert on issue_events" ON issue_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on issue_events" ON issue_events;
CREATE POLICY "Allow public update on issue_events" ON issue_events FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read on raw_sources" ON raw_sources;
CREATE POLICY "Allow public read on raw_sources" ON raw_sources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on raw_sources" ON raw_sources;
CREATE POLICY "Allow public insert on raw_sources" ON raw_sources FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on raw_sources" ON raw_sources;
CREATE POLICY "Allow public update on raw_sources" ON raw_sources FOR UPDATE USING (true);
