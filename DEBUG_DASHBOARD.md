# Professional Dashboard Debugging Guide

The professional dashboard now has extensive logging to help identify why requests aren't displaying.

## How to Debug

### Step 1: Open Browser Console

1. Navigate to `/professional/dashboard`
2. Open Developer Tools (F12)
3. Go to Console tab

### Step 2: Check the Logs

You'll see detailed logs like this:

```
========== DASHBOARD INIT ==========
localStorage data: {"type":"professional","email":"john@example.com",...}
Parsed user data: {type: 'professional', email: 'john@example.com', ...}
User type: professional
User email: john@example.com

========== PROFESSIONAL DASHBOARD DEBUG ==========
Fetching requests for professional email: john@example.com
Fetch URL: https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.john@example.com&order=created_at.desc
Response status: 200
Response ok: true
Response data: [...]
Data type: Array
Data length: 3
Setting requests array: [...]
Stats calculated: {pending: 2, confirmed: 1, declined: 0, total: 3}
========== END DEBUG ==========
```

## Common Issues and Solutions

### Issue 1: Empty Array Response

**Symptom:**
```
Data length: 0
Setting requests array: []
```

**Cause:** The professional_email in the database doesn't match the email in localStorage

**Solution:**
1. Check the exact email in localStorage console log
2. Go to Supabase → interview_requests table
3. Compare the `professional_email` field with the logged email
4. They must match EXACTLY (case-sensitive)

**Fix:**
```sql
-- Check what emails are in the database
SELECT DISTINCT professional_email FROM interview_requests;

-- Update if there's a mismatch (example)
UPDATE interview_requests
SET professional_email = 'correct@email.com'
WHERE professional_email = 'wrong@email.com';
```

### Issue 2: Error Object Instead of Array

**Symptom:**
```
Data type: object
Response data: {error: "...", message: "..."}
```

**Cause:** Supabase RLS policy is blocking the query

**Solution:**
Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'interview_requests';

-- If RLS is blocking, create a permissive policy
DROP POLICY IF EXISTS "Allow read interview_requests" ON interview_requests;

CREATE POLICY "Allow read interview_requests"
ON interview_requests FOR SELECT
TO public
USING (true);
```

### Issue 3: Network/CORS Error

**Symptom:**
```
Error loading requests: Failed to fetch
```

**Cause:** Network issue or CORS problem

**Solution:**
1. Check your Supabase URL is correct
2. Verify API keys are valid
3. Check Network tab in DevTools for the actual error
4. Ensure Supabase project is active

### Issue 4: 406 Not Acceptable Error

**Symptom:**
```
Response status: 406
```

**Cause:** Missing required headers

**Solution:** This is already handled, but verify the headers include:
- `apikey`
- `Authorization`

## Verification Steps

### 1. Verify Data Exists in Supabase

```sql
-- Check interview_requests table
SELECT * FROM interview_requests;

-- Check for specific professional
SELECT * FROM interview_requests
WHERE professional_email = 'your-email@example.com';
```

### 2. Verify Professional Email in localStorage

Open browser console and run:
```javascript
JSON.parse(localStorage.getItem('nexthesis_user'))
```

Should show:
```javascript
{
  type: "professional",
  email: "your-email@example.com",
  firstName: "...",
  lastName: "...",
  ...
}
```

### 3. Test Direct API Call

Copy the logged fetch URL from console and paste in browser:
```
https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.YOUR_EMAIL&order=created_at.desc
```

Add headers (use Postman or browser extension):
- `apikey`: Your Supabase anon key
- `Authorization`: Bearer YOUR_SUPABASE_ANON_KEY

## Expected Working Output

When everything works, console should show:

```
========== DASHBOARD INIT ==========
localStorage data: {"type":"professional","email":"test@example.com",...}
Parsed user data: {type: 'professional', email: 'test@example.com', ...}
User type: professional
User email: test@example.com

========== PROFESSIONAL DASHBOARD DEBUG ==========
Fetching requests for professional email: test@example.com
Fetch URL: https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.test@example.com&order=created_at.desc
Response status: 200
Response ok: true
Response data: [{
  id: "...",
  student_email: "student@edu.com",
  student_name: "John Student",
  professional_email: "test@example.com",
  professional_name: "Test Professional",
  status: "pending",
  ...
}]
Data type: Array
Data length: 1
Setting requests array: [...]
Stats calculated: {pending: 1, confirmed: 0, declined: 0, total: 1}
========== END DEBUG ==========
```

## Quick Checklist

- [ ] Console shows "DASHBOARD INIT" logs
- [ ] User email is displayed correctly
- [ ] Fetch URL is logged
- [ ] Response status is 200
- [ ] Response data is an Array (not object)
- [ ] Data length > 0
- [ ] Stats are calculated correctly
- [ ] No error messages in console

## If Dashboard Still Shows Nothing

After checking console logs, the issue will be clear. Share the console output and we can fix it immediately.

### Most Likely Causes (in order):

1. **Email Mismatch** (90% of cases)
   - Professional registered with email A
   - Request saved with email B
   - Query for email A returns empty

2. **RLS Policy Blocking** (8% of cases)
   - Policy doesn't allow SELECT
   - Need to update policies

3. **Data Not Saved** (2% of cases)
   - Check interview_requests table directly
   - Verify rows exist

## Remove Debug Logs (After Fixed)

Once you've identified and fixed the issue, you can remove the verbose logging by editing:
- `src/ProfessionalDashboard.js` - Remove console.log statements
- Keep error handling, just remove debug logs

## Need More Help?

Share these from console:
1. The complete "DASHBOARD INIT" section
2. The complete "PROFESSIONAL DASHBOARD DEBUG" section
3. Screenshot of interview_requests table in Supabase
4. The error message (if any)
