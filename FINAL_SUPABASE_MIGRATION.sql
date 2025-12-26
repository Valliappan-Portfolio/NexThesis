-- ================================================================
-- NEXTHESIS FINAL SUPABASE MIGRATION SCRIPT
-- Run this script in your Supabase SQL Editor
-- ================================================================

-- ================================================================
-- STEP 1: DROP AND RECREATE interview_requests TABLE
-- (This ensures it matches the application schema exactly)
-- ================================================================

-- Drop the old interview_requests table if it exists
DROP TABLE IF EXISTS interview_requests CASCADE;

-- Create the new interview_requests table with correct schema
CREATE TABLE interview_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Student Information (denormalized for faster queries)
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_university TEXT,
  student_thesis_topic TEXT,

  -- Professional Information (denormalized for faster queries)
  professional_email TEXT NOT NULL,
  professional_name TEXT NOT NULL,
  professional_company TEXT,

  -- Request Details
  pricing_tier TEXT NOT NULL,
  pricing_tier_name TEXT NOT NULL,
  price NUMERIC NOT NULL,

  -- Scheduling Preferences
  student_day_preference TEXT NOT NULL,
  student_time_preference TEXT NOT NULL,
  student_timezone TEXT NOT NULL,

  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: 'pending', 'confirmed', 'approved', 'declined', 'paid', 'scheduled', 'completed'

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_requests_student_email ON interview_requests(student_email);
CREATE INDEX idx_requests_professional_email ON interview_requests(professional_email);
CREATE INDEX idx_requests_status ON interview_requests(status);
CREATE INDEX idx_requests_created_at ON interview_requests(created_at DESC);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_interview_requests_updated_at
    BEFORE UPDATE ON interview_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- STEP 2: ENSURE professionals TABLE HAS ALL REQUIRED COLUMNS
-- ================================================================

-- Add missing columns to professionals table if they don't exist
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS day_preference TEXT,
ADD COLUMN IF NOT EXISTS time_preference TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS session_length INTEGER DEFAULT 30;

-- Make booking_link optional (nullable)
ALTER TABLE professionals
ALTER COLUMN booking_link DROP NOT NULL;

-- Update any NULL values to defaults
UPDATE professionals
SET
  day_preference = COALESCE(day_preference, ''),
  time_preference = COALESCE(time_preference, ''),
  timezone = COALESCE(timezone, 'UTC'),
  session_length = COALESCE(session_length, 30)
WHERE day_preference IS NULL
   OR time_preference IS NULL
   OR timezone IS NULL
   OR session_length IS NULL;

-- ================================================================
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read verified professionals" ON professionals;
DROP POLICY IF EXISTS "Allow insert students" ON students;
DROP POLICY IF EXISTS "Allow insert professionals" ON professionals;
DROP POLICY IF EXISTS "Allow students read own data" ON students;
DROP POLICY IF EXISTS "Allow professionals read own data" ON professionals;
DROP POLICY IF EXISTS "Allow insert interview_requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow students read own requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow professionals read their requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow professionals update their requests" ON interview_requests;

-- PUBLIC ACCESS POLICIES (for unauthenticated users via anon key)

-- Allow anyone to read verified professionals (for browsing)
CREATE POLICY "Allow public read verified professionals"
ON professionals FOR SELECT
TO public
USING (verified = true);

-- Allow anyone to read all professionals (for login/registration checks)
CREATE POLICY "Allow public read all professionals"
ON professionals FOR SELECT
TO public
USING (true);

-- Allow anyone to insert new students
CREATE POLICY "Allow insert students"
ON students FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to insert new professionals
CREATE POLICY "Allow insert professionals"
ON professionals FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read students (for login checks)
CREATE POLICY "Allow students read data"
ON students FOR SELECT
TO public
USING (true);

-- Allow anyone to insert interview requests
CREATE POLICY "Allow insert interview_requests"
ON interview_requests FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read interview requests (app uses email-based filtering)
CREATE POLICY "Allow read interview_requests"
ON interview_requests FOR SELECT
TO public
USING (true);

-- Allow anyone to update interview requests (app uses email-based authorization)
CREATE POLICY "Allow update interview_requests"
ON interview_requests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Students table indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Professionals table indexes
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);
CREATE INDEX IF NOT EXISTS idx_professionals_verified ON professionals(verified);
CREATE INDEX IF NOT EXISTS idx_professionals_sector ON professionals(sector);

-- ================================================================
-- STEP 5: INSERT SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ================================================================

-- Uncomment the lines below if you want sample data for testing

/*
-- Sample Professional
INSERT INTO professionals (
  first_name, last_name, email, linkedin_url, company, role, sector,
  years_experience, bio, booking_link, languages, day_preference,
  time_preference, timezone, session_length, verified
) VALUES (
  'John', 'Doe', 'john.doe@example.com', 'https://linkedin.com/in/johndoe',
  'Tech Corp', 'Senior Product Manager', 'Technology', 10,
  'Experienced product manager with 10 years in tech startups. Passionate about helping students understand product development and career growth.',
  'https://calendly.com/johndoe', 'English, Spanish', 'weekday',
  'morning,afternoon', 'Europe/London', 30, true
)
ON CONFLICT (email) DO NOTHING;

-- Sample Student
INSERT INTO students (
  first_name, last_name, email, university, thesis_topic
) VALUES (
  'Jane', 'Smith', 'jane.smith@student.edu', 'University of Example',
  'Digital Transformation in Traditional Industries'
)
ON CONFLICT (email) DO NOTHING;

-- Sample Interview Request
INSERT INTO interview_requests (
  student_email, student_name, student_university, student_thesis_topic,
  professional_email, professional_name, professional_company,
  pricing_tier, pricing_tier_name, price,
  student_day_preference, student_time_preference, student_timezone,
  status
) VALUES (
  'jane.smith@student.edu', 'Jane Smith', 'University of Example',
  'Digital Transformation in Traditional Industries',
  'john.doe@example.com', 'John Doe', 'Tech Corp',
  'starter', 'Research Starter', 20,
  'weekday', 'morning', 'Europe/London',
  'pending'
);
*/

-- ================================================================
-- VERIFICATION QUERIES
-- Run these to verify the migration worked correctly
-- ================================================================

-- Check professionals table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'professionals'
ORDER BY ordinal_position;

-- Check interview_requests table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'interview_requests'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('students', 'professionals', 'interview_requests');

-- ================================================================
-- MIGRATION COMPLETE!
-- ================================================================
-- Your database is now ready to use with the NexThesis application.
--
-- Next steps:
-- 1. Test student registration
-- 2. Test professional registration
-- 3. Test login flow
-- 4. Test interview request submission
-- 5. Test professional dashboard
-- ================================================================
