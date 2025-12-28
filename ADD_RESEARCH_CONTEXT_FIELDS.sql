-- ================================================================
-- ADD RESEARCH CONTEXT FIELDS TO interview_requests TABLE
-- Run this in your Supabase SQL Editor
-- ================================================================

-- Add new columns for better research context
ALTER TABLE interview_requests
ADD COLUMN IF NOT EXISTS research_question TEXT,
ADD COLUMN IF NOT EXISTS interview_expectations TEXT,
ADD COLUMN IF NOT EXISTS specific_questions_for_expert TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN interview_requests.research_question IS 'The main research question the student is investigating';
COMMENT ON COLUMN interview_requests.interview_expectations IS 'What the student expects to gain from this interview overall';
COMMENT ON COLUMN interview_requests.specific_questions_for_expert IS 'Specific topics or questions the student wants to discuss with this particular expert';
