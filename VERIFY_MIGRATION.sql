-- ================================================================
-- VERIFICATION SCRIPT - Run this to confirm everything works
-- ================================================================

-- 1. Check that interview_requests table has the new columns
SELECT 'Checking interview_requests columns...' as step;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'interview_requests'
AND column_name IN ('meeting_link', 'meeting_room_id', 'scheduled_date')
ORDER BY column_name;
-- Expected: You should see 3 rows (meeting_link, meeting_room_id, scheduled_date)

-- 2. Check that payments table exists and has correct structure
SELECT 'Checking payments table...' as step;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;
-- Expected: You should see: id, student_email, student_name, bundle_name, amount_paid,
--           interviews_purchased, interviews_used, payment_status, stripe_payment_intent_id,
--           created_at, updated_at

-- 3. Test the get_available_credits function with a test email
SELECT 'Testing get_available_credits function...' as step;
SELECT get_available_credits('test@example.com') as credits;
-- Expected: Should return 0 (no credits for this test email)

-- 4. Check RLS policies exist
SELECT 'Checking RLS policies...' as step;
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('interview_requests', 'payments')
ORDER BY tablename, policyname;
-- Expected: You should see policies for both tables

-- 5. Test inserting a test payment (we'll delete it after)
SELECT 'Testing payment insert...' as step;
INSERT INTO payments (
  student_email,
  student_name,
  bundle_name,
  amount_paid,
  interviews_purchased,
  interviews_used,
  payment_status
) VALUES (
  'test@example.com',
  'Test Student',
  'Test Bundle',
  20.00,
  2,
  0,
  'completed'
) RETURNING id, student_email, interviews_purchased;
-- Expected: Should return the inserted row

-- 6. Test get_available_credits with the test payment
SELECT 'Testing credits after payment...' as step;
SELECT get_available_credits('test@example.com') as credits;
-- Expected: Should return 2

-- 7. Test use_interview_credit function
SELECT 'Testing use_interview_credit...' as step;
SELECT use_interview_credit('test@example.com') as credit_used;
-- Expected: Should return true

-- 8. Check credits again after using one
SELECT 'Testing credits after using one...' as step;
SELECT get_available_credits('test@example.com') as credits;
-- Expected: Should return 1

-- 9. Check interviews_used was incremented
SELECT 'Checking interviews_used counter...' as step;
SELECT student_email, interviews_purchased, interviews_used
FROM payments
WHERE student_email = 'test@example.com';
-- Expected: Should show interviews_used = 1

-- 10. Clean up test data
SELECT 'Cleaning up test data...' as step;
DELETE FROM payments WHERE student_email = 'test@example.com';
-- Expected: Deletes the test payment

-- ================================================================
-- VERIFICATION COMPLETE!
-- ================================================================
-- If all steps above returned expected results, your migration is successful!
