-- Add email verification columns to students and professionals tables

-- Add to students table
ALTER TABLE students
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;

-- Add to professionals table
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_students_verification_token ON students(verification_token);
CREATE INDEX IF NOT EXISTS idx_professionals_verification_token ON professionals(verification_token);

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'students'
AND column_name IN ('email_verified', 'verification_token', 'verification_token_expires')
ORDER BY ordinal_position;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'professionals'
AND column_name IN ('email_verified', 'verification_token', 'verification_token_expires')
ORDER BY ordinal_position;
