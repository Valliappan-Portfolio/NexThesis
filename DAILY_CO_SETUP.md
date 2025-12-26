# Daily.co API Setup Instructions

## Current Status

The Daily.co integration code is ready, but the API key may need to be verified or replaced.

## How to Get Your Daily.co API Key

### Step 1: Create Account
1. Go to https://dashboard.daily.co/
2. Sign up for a **free account** (no credit card required for basic usage)
3. Verify your email

### Step 2: Get Your API Key
1. After logging in, go to the **Developers** section in the left sidebar
2. Click on **API Keys**
3. Your API key will be displayed (starts with a long string of letters/numbers)
4. Copy the entire key

### Step 3: Update .env File
1. Open [.env](.env) in your project
2. Find the line: `REACT_APP_DAILY_API_KEY=...`
3. Replace with your new key:
```
REACT_APP_DAILY_API_KEY=your_actual_api_key_here
```
4. Save the file

### Step 4: Restart the App
```bash
# Stop the current running app (Ctrl+C)
npm start
```

## What Daily.co Does in Your App

When a professional confirms an interview request:
1. ✅ Creates a unique video meeting room
2. ✅ Generates a meeting URL (e.g., https://nexthesis.daily.co/interview-xyz)
3. ✅ Sets room to expire after 24 hours (auto-cleanup)
4. ✅ Limits to 2 participants (student + professional)
5. ✅ Meeting link is saved to database
6. ✅ Meeting link is sent in confirmation emails

## Free Tier Limits

Daily.co free tier includes:
- ✅ Unlimited rooms
- ✅ Up to 10,000 participant minutes/month
- ✅ Basic video/audio features
- ✅ Screen sharing
- ❌ Cloud recording (paid feature - we disabled it)
- ❌ Advanced analytics (paid feature)

## Testing the Integration

After updating the API key:

1. **Start the app**: `npm start`
2. **Create a test interview request** as a student
3. **Login as professional** and confirm the request
4. **Check console** - should see:
   ```
   Creating Daily.co room: interview-1234567890-abc123
   Meeting room created: https://nexthesis.daily.co/interview-1234567890-abc123
   ✅ Meeting room created
   ```
5. **No errors** - API key is working!

## Troubleshooting

### Error: "invalid-request-error"
- **Cause**: API key is invalid or expired
- **Solution**: Get new key from Daily.co dashboard

### Error: "unauthorized"
- **Cause**: API key not set or incorrect format
- **Solution**: Check .env file has correct format

### Error: "rate-limit-exceeded"
- **Cause**: Too many API calls (unlikely with free tier)
- **Solution**: Wait a few minutes, or upgrade plan

## Current Code Location

The Daily.co integration code is in:
- [src/utils/dailyco.js](src/utils/dailyco.js) - Meeting room creation
- [src/utils/interviewAutomation.js](src/utils/interviewAutomation.js:40-49) - Triggers on confirm

## Alternative: Skip Daily.co (Temporary)

If you want to test without Daily.co for now:

1. Open [interviewAutomation.js](src/utils/interviewAutomation.js)
2. Find line 40-49 (createMeetingRoom call)
3. Replace with:
```javascript
// Temporary: Skip Daily.co, use placeholder link
const meeting = {
  roomUrl: 'https://meet.google.com/placeholder-link',
  roomName: 'placeholder',
  roomId: 'placeholder'
};
console.log('⚠️ Using placeholder meeting link (Daily.co disabled)');
```

This will allow you to test the rest of the flow without Daily.co.
