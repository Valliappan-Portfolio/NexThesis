-- ================================================================
-- NEXTHESIS COMPLETE MIGRATION WITH CREDITS SYSTEM
-- Run this ENTIRE script in your Supabase SQL Editor
-- ================================================================

-- ================================================================
-- STEP 1: DROP AND RECREATE interview_requests TABLE
-- ================================================================

-- Drop the old table completely to start fresh
DROP TABLE IF EXISTS interview_requests CASCADE;

-- Create the interview_requests table with ALL fields including credits system
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

  -- Meeting Details (for automation)
  meeting_link TEXT,
  meeting_room_id TEXT,
  scheduled_date TIMESTAMPTZ,

  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Possible values: 'pending', 'confirmed', 'declined', 'completed'

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_requests_student_email ON interview_requests(student_email);
CREATE INDEX idx_requests_professional_email ON interview_requests(professional_email);
CREATE INDEX idx_requests_status ON interview_requests(status);
CREATE INDEX idx_requests_created_at ON interview_requests(created_at DESC);

-- ================================================================
-- STEP 2: CREATE payments TABLE FOR CREDIT SYSTEM
-- ================================================================

-- Drop if exists
DROP TABLE IF EXISTS payments CASCADE;

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Student information
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,

  -- Purchase details
  bundle_name TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  interviews_purchased INTEGER NOT NULL,
  interviews_used INTEGER DEFAULT 0,

  -- Payment tracking
  payment_status TEXT DEFAULT 'completed',
  stripe_payment_intent_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_interviews CHECK (interviews_used <= interviews_purchased)
);

-- Create indexes
CREATE INDEX idx_payments_student_email ON payments(student_email);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- ================================================================
-- STEP 3: CREATE POSTGRESQL FUNCTIONS FOR CREDIT SYSTEM
-- ================================================================

-- Function to get available credits for a student
CREATE OR REPLACE FUNCTION get_available_credits(student_email_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  total_purchased INTEGER;
  total_used INTEGER;
BEGIN
  SELECT
    COALESCE(SUM(interviews_purchased), 0),
    COALESCE(SUM(interviews_used), 0)
  INTO total_purchased, total_used
  FROM payments
  WHERE student_email = student_email_param
    AND payment_status = 'completed';

  RETURN total_purchased - total_used;
END;
$$ LANGUAGE plpgsql;

-- Function to use a credit (deduct from oldest payment first)
CREATE OR REPLACE FUNCTION use_interview_credit(student_email_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  available_payment RECORD;
BEGIN
  -- Find the oldest payment with remaining credits
  SELECT id, interviews_purchased, interviews_used
  INTO available_payment
  FROM payments
  WHERE student_email = student_email_param
    AND payment_status = 'completed'
    AND interviews_used < interviews_purchased
  ORDER BY created_at ASC
  LIMIT 1;

  -- If no credits available, return false
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Increment the interviews_used counter
  UPDATE payments
  SET interviews_used = interviews_used + 1,
      updated_at = NOW()
  WHERE id = available_payment.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- STEP 4: CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for interview_requests
DROP TRIGGER IF EXISTS update_interview_requests_updated_at ON interview_requests;
CREATE TRIGGER update_interview_requests_updated_at
    BEFORE UPDATE ON interview_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for payments
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- STEP 5: ENSURE professionals TABLE HAS ALL REQUIRED COLUMNS
-- ================================================================

-- Add missing columns if they don't exist
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS day_preference TEXT,
ADD COLUMN IF NOT EXISTS time_preference TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS session_length INTEGER DEFAULT 30;

-- Make booking_link optional
ALTER TABLE professionals
ALTER COLUMN booking_link DROP NOT NULL;

-- ================================================================
-- STEP 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read verified professionals" ON professionals;
DROP POLICY IF EXISTS "Allow public read all professionals" ON professionals;
DROP POLICY IF EXISTS "Allow insert students" ON students;
DROP POLICY IF EXISTS "Allow insert professionals" ON professionals;
DROP POLICY IF EXISTS "Allow students read data" ON students;
DROP POLICY IF EXISTS "Allow insert interview_requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow read interview_requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow update interview_requests" ON interview_requests;
DROP POLICY IF EXISTS "Allow insert payments" ON payments;
DROP POLICY IF EXISTS "Allow read payments" ON payments;
DROP POLICY IF EXISTS "Allow update payments" ON payments;

-- PROFESSIONALS POLICIES
CREATE POLICY "Allow public read verified professionals"
ON professionals FOR SELECT
TO public
USING (verified = true);

CREATE POLICY "Allow public read all professionals"
ON professionals FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow insert professionals"
ON professionals FOR INSERT
TO public
WITH CHECK (true);

-- STUDENTS POLICIES
CREATE POLICY "Allow insert students"
ON students FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow students read data"
ON students FOR SELECT
TO public
USING (true);

-- INTERVIEW REQUESTS POLICIES
CREATE POLICY "Allow insert interview_requests"
ON interview_requests FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow read interview_requests"
ON interview_requests FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow update interview_requests"
ON interview_requests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- PAYMENTS POLICIES
CREATE POLICY "Allow insert payments"
ON payments FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow read payments"
ON payments FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow update payments"
ON payments FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ================================================================
-- STEP 7: CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Students table indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Professionals table indexes
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);
CREATE INDEX IF NOT EXISTS idx_professionals_verified ON professionals(verified);
CREATE INDEX IF NOT EXISTS idx_professionals_sector ON professionals(sector);

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check interview_requests table structure
SELECT 'interview_requests columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'interview_requests'
ORDER BY ordinal_position;

-- Check payments table structure
SELECT 'payments columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 'RLS status:' as info;
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('students', 'professionals', 'interview_requests', 'payments');

-- Check functions exist
SELECT 'Functions:' as info;
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('get_available_credits', 'use_interview_credit');

-- ================================================================
-- MIGRATION COMPLETE!
-- ================================================================
-- Your database now includes:
-- ✅ interview_requests table with meeting automation fields
-- ✅ payments table for credit system
-- ✅ PostgreSQL functions: get_available_credits, use_interview_credit
-- ✅ Auto-update triggers for timestamps
-- ✅ RLS policies for all tables
-- ✅ Performance indexes
--
-- Next steps:
-- 1. Test purchasing credits via /buy-credits
-- 2. Test interview request with credit check
-- 3. Test professional confirmation triggering automation
-- ================================================================
