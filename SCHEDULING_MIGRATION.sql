-- ================================================================
-- ENHANCED SCHEDULING SYSTEM MIGRATION
-- Run this in your Supabase SQL Editor
-- ================================================================

-- Step 1: Add availability_blocks to professionals table
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS availability_blocks JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_timezone TEXT DEFAULT 'UTC';

-- Add comment to explain the structure
COMMENT ON COLUMN professionals.availability_blocks IS
'Weekly recurring availability. Format: {"monday": ["9-11", "14-16"], "tuesday": ["9-11", "18-20"]}. Times in 24-hour format.';

-- Step 2: Modify interview_requests table for exact datetime
ALTER TABLE interview_requests
ADD COLUMN IF NOT EXISTS preferred_datetime TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS slot_duration_minutes INTEGER DEFAULT 30;

-- Add comment
COMMENT ON COLUMN interview_requests.preferred_datetime IS
'Exact datetime slot selected by student for the interview (stored in UTC)';

-- Step 3: Create index for faster datetime queries
CREATE INDEX IF NOT EXISTS idx_interview_requests_datetime
ON interview_requests(preferred_datetime);

-- Step 4: Create helper function to check if a datetime falls within availability
CREATE OR REPLACE FUNCTION is_slot_available(
  availability_blocks JSONB,
  slot_datetime TIMESTAMPTZ,
  slot_duration_minutes INTEGER DEFAULT 30
)
RETURNS BOOLEAN AS $$
DECLARE
  day_of_week TEXT;
  time_24h TEXT;
  hour_num INTEGER;
  available_blocks TEXT[];
  time_block TEXT;
  block_start INTEGER;
  block_end INTEGER;
BEGIN
  -- Get day of week (lowercase, e.g., 'monday')
  day_of_week := LOWER(TO_CHAR(slot_datetime, 'Day'));
  day_of_week := TRIM(day_of_week);

  -- Get hour in 24-hour format
  hour_num := EXTRACT(HOUR FROM slot_datetime);

  -- Get available blocks for this day
  available_blocks := ARRAY(
    SELECT jsonb_array_elements_text(availability_blocks->day_of_week)
  );

  -- If no blocks for this day, not available
  IF array_length(available_blocks, 1) IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if the hour falls within any block
  FOREACH time_block IN ARRAY available_blocks
  LOOP
    -- Parse block (e.g., "9-11" or "14-16")
    block_start := SPLIT_PART(time_block, '-', 1)::INTEGER;
    block_end := SPLIT_PART(time_block, '-', 2)::INTEGER;

    -- Check if hour falls within this block
    IF hour_num >= block_start AND hour_num < block_end THEN
      RETURN TRUE;
    END IF;
  END LOOP;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 5: Create function to get available slots for a professional on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  professional_email_param TEXT,
  target_date DATE
)
RETURNS TABLE(
  slot_datetime TIMESTAMPTZ,
  slot_time TEXT,
  is_available BOOLEAN
) AS $$
DECLARE
  prof_availability JSONB;
  prof_timezone TEXT;
  day_name TEXT;
  time_blocks TEXT[];
  time_block TEXT;
  block_start INTEGER;
  block_end INTEGER;
  current_hour INTEGER;
  slot_dt TIMESTAMPTZ;
BEGIN
  -- Get professional's availability
  SELECT availability_blocks, availability_timezone
  INTO prof_availability, prof_timezone
  FROM professionals
  WHERE email = professional_email_param;

  -- Get day of week name (lowercase)
  day_name := LOWER(TO_CHAR(target_date, 'Day'));
  day_name := TRIM(day_name);

  -- Get available time blocks for this day
  time_blocks := ARRAY(
    SELECT jsonb_array_elements_text(prof_availability->day_name)
  );

  -- Generate 30-minute slots for each block
  FOREACH time_block IN ARRAY time_blocks
  LOOP
    block_start := SPLIT_PART(time_block, '-', 1)::INTEGER;
    block_end := SPLIT_PART(time_block, '-', 2)::INTEGER;

    -- Generate slots every 30 minutes
    FOR current_hour IN block_start..(block_end - 1)
    LOOP
      -- Slot at XX:00
      slot_dt := (target_date::TEXT || ' ' || current_hour::TEXT || ':00:00')::TIMESTAMPTZ;
      RETURN QUERY SELECT
        slot_dt,
        TO_CHAR(slot_dt, 'HH24:MI'),
        TRUE;

      -- Slot at XX:30
      slot_dt := (target_date::TEXT || ' ' || current_hour::TEXT || ':30:00')::TIMESTAMPTZ;
      RETURN QUERY SELECT
        slot_dt,
        TO_CHAR(slot_dt, 'HH24:MI'),
        TRUE;
    END LOOP;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create sample availability data (for testing)
-- You can run this to add availability to an existing professional
/*
UPDATE professionals
SET availability_blocks = '{
  "monday": ["9-11", "14-16", "18-20"],
  "tuesday": ["9-11", "14-16"],
  "wednesday": ["9-11", "14-16", "18-20"],
  "thursday": ["9-11", "14-16"],
  "friday": ["9-11", "14-16"]
}'::JSONB,
availability_timezone = 'Europe/London'
WHERE email = 'your-professional-email@example.com';
*/

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check if columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'professionals'
AND column_name IN ('availability_blocks', 'availability_timezone');

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'interview_requests'
AND column_name IN ('preferred_datetime', 'slot_duration_minutes');

-- Check if functions were created
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_slot_available', 'get_available_slots');

-- ================================================================
-- MIGRATION COMPLETE!
-- ================================================================
-- You can now:
-- 1. Set professional availability via UI
-- 2. Students can select specific datetime slots
-- 3. System validates slots against availability
-- ================================================================
