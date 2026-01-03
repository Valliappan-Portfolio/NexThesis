-- Add UPDATE policy for students table
-- This allows webhooks to update student credits after payment

CREATE POLICY "Allow update students"
ON students
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'students'
ORDER BY policyname;
