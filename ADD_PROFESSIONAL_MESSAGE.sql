-- Add professional_message column to interview_requests table
-- This allows professionals to add a custom message when confirming or declining requests

-- Add the column
ALTER TABLE interview_requests
ADD COLUMN IF NOT EXISTS professional_message TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN interview_requests.professional_message IS 'Optional message from professional when confirming or declining interview request';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'interview_requests'
AND column_name = 'professional_message';
