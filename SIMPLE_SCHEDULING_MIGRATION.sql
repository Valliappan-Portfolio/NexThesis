-- ================================================================
-- SIMPLE SCHEDULING SYSTEM MIGRATION
-- Run this in your Supabase SQL Editor
-- ================================================================

-- Step 1: Add availability column to professionals table
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{"days": ["weekend"], "times": ["afternoon"], "timezone": "IST"}'::JSONB;

-- Add comment explaining the structure
COMMENT ON COLUMN professionals.availability IS
'Professional availability preferences. Format: {"days": ["weekday", "weekend"], "times": ["morning", "afternoon", "evening"], "timezone": "IST"}';

-- Step 2: Add preferred date/time columns to interview_requests table
ALTER TABLE interview_requests
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time TIME,
ADD COLUMN IF NOT EXISTS decline_reason TEXT;

-- Add comments
COMMENT ON COLUMN interview_requests.preferred_date IS 'Student preferred interview date';
COMMENT ON COLUMN interview_requests.preferred_time IS 'Student preferred interview time';
COMMENT ON COLUMN interview_requests.decline_reason IS 'Professional comment when declining request';

-- Step 2b: Make old scheduling columns nullable (backwards compatibility)
-- These columns are deprecated but kept for existing data
ALTER TABLE interview_requests
ALTER COLUMN student_day_preference DROP NOT NULL,
ALTER COLUMN student_time_preference DROP NOT NULL,
ALTER COLUMN student_timezone DROP NOT NULL;

-- Set default values for old columns to prevent errors
UPDATE interview_requests
SET
  student_day_preference = COALESCE(student_day_preference, 'not specified'),
  student_time_preference = COALESCE(student_time_preference, 'not specified'),
  student_timezone = COALESCE(student_timezone, 'UTC')
WHERE student_day_preference IS NULL
   OR student_time_preference IS NULL
   OR student_timezone IS NULL;

-- Step 3: Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_interview_requests_date
ON interview_requests(preferred_date);

-- Step 4: Set default availability for existing professionals
UPDATE professionals
SET availability = '{"days": ["weekend"], "times": ["afternoon"], "timezone": "IST"}'::JSONB
WHERE availability IS NULL;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if columns were added to professionals table
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'professionals'
AND column_name = 'availability';

-- Check if columns were added to interview_requests table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'interview_requests'
AND column_name IN ('preferred_date', 'preferred_time', 'decline_reason');

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'interview_requests'
AND indexname = 'idx_interview_requests_date';

-- View sample data
SELECT email, first_name, last_name, availability
FROM professionals
LIMIT 3;

-- ================================================================
-- MIGRATION COMPLETE!
-- ================================================================
-- Next steps:
-- 1. Update ProfessionalRegistration.js to collect availability
-- 2. Update InterviewRequest.js to show date/time picker
-- 3. Update ProfessionalRequests.js to show decline option
-- ================================================================
