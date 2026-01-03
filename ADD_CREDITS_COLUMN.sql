-- Add credits column to students table for simple credit tracking
-- This allows the Stripe webhook to directly update student credits

-- Add credits column
ALTER TABLE students
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- Add constraint to ensure credits can't be negative
ALTER TABLE students
ADD CONSTRAINT credits_non_negative CHECK (credits >= 0);

-- Create index for faster credit queries
CREATE INDEX IF NOT EXISTS idx_students_credits ON students(credits);

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'students'
AND column_name = 'credits';

-- View current students and their credits
SELECT email, name, credits
FROM students
ORDER BY created_at DESC;
