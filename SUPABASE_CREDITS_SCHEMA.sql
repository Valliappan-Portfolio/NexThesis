-- ================================================================
-- CREDIT SYSTEM & MEETING AUTOMATION SCHEMA UPDATES
-- Run this in your Supabase SQL Editor
-- ================================================================

-- ================================================================
-- STEP 1: ADD MEETING LINK TO INTERVIEW REQUESTS
-- ================================================================

ALTER TABLE interview_requests
ADD COLUMN IF NOT EXISTS meeting_link TEXT,
ADD COLUMN IF NOT EXISTS meeting_room_id TEXT,
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled_time TEXT,
ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_requests_scheduled_date ON interview_requests(scheduled_date);

-- ================================================================
-- STEP 2: CREATE OR UPDATE PAYMENTS TABLE
-- ================================================================

-- Check if table exists and create if it doesn't
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Student Information
  student_email TEXT NOT NULL,
  student_name TEXT,

  -- Package Details
  bundle_name TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  interviews_purchased INTEGER NOT NULL,
  interviews_used INTEGER DEFAULT 0,

  -- Payment Details (for Stripe integration later)
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  payment_status TEXT DEFAULT 'completed',
  -- Possible values: 'pending', 'completed', 'failed', 'refunded'

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,

  -- Constraints
  CONSTRAINT interviews_used_check CHECK (interviews_used <= interviews_purchased),
  CONSTRAINT interviews_purchased_positive CHECK (interviews_purchased > 0),
  CONSTRAINT amount_paid_positive CHECK (amount_paid > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_student_email ON payments(student_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- ================================================================
-- STEP 3: CREATE FUNCTION TO GET AVAILABLE CREDITS
-- ================================================================

CREATE OR REPLACE FUNCTION get_available_credits(student_email_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  total_purchased INTEGER;
  total_used INTEGER;
BEGIN
  -- Sum all purchased interviews for this student
  SELECT COALESCE(SUM(interviews_purchased), 0)
  INTO total_purchased
  FROM payments
  WHERE student_email = student_email_param
    AND payment_status = 'completed';

  -- Sum all used interviews
  SELECT COALESCE(SUM(interviews_used), 0)
  INTO total_used
  FROM payments
  WHERE student_email = student_email_param
    AND payment_status = 'completed';

  -- Return available credits
  RETURN total_purchased - total_used;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- STEP 4: CREATE FUNCTION TO USE A CREDIT
-- ================================================================

CREATE OR REPLACE FUNCTION use_interview_credit(student_email_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Find the oldest payment with available credits
  SELECT *
  INTO payment_record
  FROM payments
  WHERE student_email = student_email_param
    AND payment_status = 'completed'
    AND interviews_used < interviews_purchased
  ORDER BY created_at ASC
  LIMIT 1;

  -- If no credits available, return false
  IF payment_record IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Increment the used count
  UPDATE payments
  SET interviews_used = interviews_used + 1
  WHERE id = payment_record.id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- STEP 5: CREATE VIEW FOR STUDENT CREDITS
-- ================================================================

CREATE OR REPLACE VIEW student_credits AS
SELECT
  student_email,
  student_name,
  SUM(interviews_purchased) as total_purchased,
  SUM(interviews_used) as total_used,
  SUM(interviews_purchased - interviews_used) as credits_remaining,
  SUM(amount_paid) as total_spent
FROM payments
WHERE payment_status = 'completed'
GROUP BY student_email, student_name;

-- ================================================================
-- STEP 6: INSERT SAMPLE TEST DATA
-- ================================================================

-- Sample payment for testing (student with 2 credits)
INSERT INTO payments (
  student_email,
  student_name,
  bundle_name,
  amount_paid,
  interviews_purchased,
  interviews_used,
  payment_status,
  stripe_payment_intent_id
) VALUES (
  'jane.smith@student.edu',
  'Jane Smith',
  'Research Starter - 2 Interviews',
  40,
  2,
  0,
  'completed',
  'pi_test_123456789'
) ON CONFLICT DO NOTHING;

-- Another sample with 4 credits, 1 used
INSERT INTO payments (
  student_email,
  student_name,
  bundle_name,
  amount_paid,
  interviews_purchased,
  interviews_used,
  payment_status,
  stripe_payment_intent_id
) VALUES (
  'john.doe@student.edu',
  'John Doe',
  'Deep Dive - 4 Interviews',
  80,
  4,
  1,
  'completed',
  'pi_test_987654321'
) ON CONFLICT DO NOTHING;

-- ================================================================
-- STEP 7: RLS POLICIES FOR PAYMENTS TABLE
-- ================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read own payments" ON payments;
DROP POLICY IF EXISTS "Allow insert payments" ON payments;
DROP POLICY IF EXISTS "Allow update payments" ON payments;

-- Allow anyone to read payments (app uses email-based filtering)
CREATE POLICY "Allow read payments"
ON payments FOR SELECT
TO public
USING (true);

-- Allow anyone to insert payments (for Stripe webhooks)
CREATE POLICY "Allow insert payments"
ON payments FOR INSERT
TO public
WITH CHECK (true);

-- Allow updates for credit usage
CREATE POLICY "Allow update payments"
ON payments FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check payments table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Check interview_requests new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'interview_requests'
AND column_name IN ('meeting_link', 'meeting_room_id', 'scheduled_date', 'scheduled_time', 'recording_url');

-- Test the credit functions
SELECT get_available_credits('jane.smith@student.edu') as credits_available;

-- View student credits
SELECT * FROM student_credits;

-- Test sample data
SELECT * FROM payments;

-- ================================================================
-- USEFUL QUERIES FOR ADMIN/TESTING
-- ================================================================

-- Get all students with their credit balance
SELECT
  student_email,
  SUM(interviews_purchased - interviews_used) as credits_remaining
FROM payments
WHERE payment_status = 'completed'
GROUP BY student_email
ORDER BY credits_remaining DESC;

-- Get payment history for a student
SELECT
  bundle_name,
  amount_paid,
  interviews_purchased,
  interviews_used,
  interviews_purchased - interviews_used as remaining,
  created_at
FROM payments
WHERE student_email = 'jane.smith@student.edu'
ORDER BY created_at DESC;

-- Find students who have used all their credits
SELECT student_email, SUM(interviews_purchased) as total_purchased
FROM payments
WHERE payment_status = 'completed'
GROUP BY student_email
HAVING SUM(interviews_purchased - interviews_used) = 0;

-- ================================================================
-- MIGRATION COMPLETE!
-- ================================================================
-- Next steps:
-- 1. Test credit functions
-- 2. Implement frontend credit display
-- 3. Add payment purchase flow
-- 4. Integrate Daily.co and Resend
-- ================================================================
