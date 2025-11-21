-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- for gen_random_uuid()

-- ========== Core domain ==========
CREATE TABLE IF NOT EXISTS jobs (
  job_id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
  candidate_id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  resume_text TEXT,               -- parsed text
  resume_url TEXT,                -- optional storage path
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embeddings (pgvector)
-- 1536 matches text-embedding-3-small
CREATE TABLE IF NOT EXISTS embeddings (
  embedding_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('job','candidate')),
  owner_id UUID NOT NULL,
  model TEXT NOT NULL,
  vector vector(1536) NOT NULL
);

-- Unique index so ON CONFLICT (owner_type, owner_id) works
CREATE UNIQUE INDEX IF NOT EXISTS uq_embeddings_owner
  ON embeddings(owner_type, owner_id);

-- (Optional) drop any non-unique duplicate index if you created one earlier:
-- DROP INDEX IF EXISTS idx_embeddings_owner;

-- Rankings
CREATE TABLE IF NOT EXISTS rankings (
  ranking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  justification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_rankings_job ON rankings(job_id);
