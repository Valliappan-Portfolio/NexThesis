# Testing the Complete Workflow

## ✅ Fixed: Credit Deduction is Now Optional

The automation will now work **even without credits** (for testing). It will show a warning but continue with creating the meeting room and sending emails.

## Complete Testing Flow

### Step 1: Start the App
```bash
npm start
```

### Step 2: Test Interview Request (Student Side)

1. **Login as Student**
   - Use any email (e.g., `student@test.com`)
   - Fill in registration details

2. **Browse Experts**
   - Click "Browse Experts"
   - Find a professional

3. **Request Interview**
   - Click "Request Interview" on any expert
   - **Should see credit balance** at top (will show 0 if you haven't purchased)
   - Select a pricing tier (e.g., "Research Starter €20")
   - Fill in time preferences:
     - Day: Weekday/Weekend/Both
     - Time: Morning/Afternoon/Evening
     - Timezone: Select one
   - Click "Submit Request"

4. **Expected Behavior**:
   - ⚠️ If no credits: Will show warning but **WILL ALLOW submission for testing**
   - ✅ Request saved to Supabase
   - ✅ Status: "pending"

### Step 3: Test Confirmation (Professional Side)

1. **Logout and Login as Professional**
   - Use the professional's email (the one you requested from)
   - Or register as a new professional

2. **Go to Dashboard**
   - Navigate to `/professional/dashboard`
   - Should see the pending request

3. **Confirm Interview**
   - Click "Confirm" button on the request
   - **Watch the browser console** for logs

4. **Expected Console Output**:
   ```
   Request details: {student_email: "...", professional_email: "..."}
   Checking credits for student: student@test.com
   ⚠️ No credits available - continuing anyway (testing mode)
   Creating Daily.co meeting room...
   Meeting room created: https://nexthesis.daily.co/interview-1234567890-abc123
   ✅ Meeting room created
   Updating request with meeting link...
   ✅ Request updated in database
   Sending confirmation emails...
   ✅ Student email sent
   ✅ Professional email sent
   ========== AUTOMATION COMPLETE ==========
   ```

5. **Expected Alert**:
   ```
   Success! Meeting created and confirmation emails sent.

   Meeting link: https://nexthesis.daily.co/interview-xxx
   ```

6. **Check Database**:
   - Go to Supabase → interview_requests table
   - Find your request
   - Should see:
     - `status`: "confirmed"
     - `meeting_link`: "https://nexthesis.daily.co/interview-..."
     - `meeting_room_id`: "interview-..."

### Step 4: Test Credit Purchase (Optional)

1. **Login as Student**

2. **Go to Buy Credits**
   - Navigate to `/buy-credits`
   - Should see 4 packages:
     - Espresso Shot: 1 interview - €8
     - Research Starter: 2 interviews - €20
     - Deep Dive: 4 interviews - €32
     - Thesis Complete: 6 interviews - €60

3. **Purchase Credits** (Test Mode)
   - Click "Buy Now" on any package
   - Alert will show: "TEST MODE: Simulating payment of €20"
   - Credits will be added to database

4. **Verify Credits**
   - Check current balance updates
   - Request another interview
   - Should see green "2 interview credits available" badge

5. **Confirm Another Interview**
   - Login as professional
   - Confirm the new request
   - Console should show: "✅ Credit deducted successfully"
   - Check database: `interviews_used` should increment

## What's Working Now

✅ **Interview Request Flow**: Student selects pricing → scheduling → submits
✅ **Credit Check**: Shows available credits (optional for submission during testing)
✅ **Professional Confirmation**: Triggers automation
✅ **Daily.co Integration**: Creates meeting rooms (API key verified)
✅ **Database Updates**: Meeting link saved to Supabase
✅ **Email Automation**: Sends confirmation emails (Resend)
✅ **Credit Deduction**: Optional (warns if no credits but continues for testing)

## Production Mode

When you're ready to enforce credits:

1. Open [interviewAutomation.js](src/utils/interviewAutomation.js#L29-L42)
2. Change back to strict mode:
```javascript
// Step 2: Deduct credit (STRICT MODE)
const creditUsed = await deductCredit(request.student_email);
if (!creditUsed) {
  throw new Error('No credits available for student');
}
```

But for now, testing mode allows you to test the complete flow without purchasing credits!

## Common Issues

### Issue: "Daily.co API error"
**Solution**: Make sure `.env` has the correct API key and restart the app

### Issue: "No credits available" (strict mode)
**Solution**: Purchase credits via `/buy-credits` first

### Issue: Email not sent
**Check**: Console logs - emails might fail but automation continues
**Note**: Resend API key might need updating for production

### Issue: Meeting link not showing
**Check**: Supabase interview_requests table - `meeting_link` column should have the URL

## Next Steps

After testing, you can:
1. Add real Stripe payment integration
2. Enable strict credit enforcement
3. Customize email templates in [resend.js](src/utils/resend.js)
4. Add professional scheduling confirmation
5. Add notification system
