# Navigation and UX Improvements - TODO

## ✅ Fixed

### 1. Redirect After Purchase
**Issue**: After buying credits, user stays on pricing page
**Fix**: Added redirect to Browse Experts after 1.5 seconds
**File**: [src/BuyCredits.js](src/BuyCredits.js:146-149)
```javascript
setTimeout(() => {
  window.location.href = '/browse-experts';
}, 1500);
```

---

## 🔄 To Fix Next

### 2. Professional Sees Pricing When Requesting Interview
**Issue**: Professionals see 4 pricing tiers when they try to request an interview (but they don't buy credits)
**Root Cause**: InterviewRequest component shows pricing to everyone

**Solution**:
- Check user type in InterviewRequest component
- If user is a professional → Skip directly to step 2 (time preferences / date picker)
- If user is a student:
  - Check if they have credits
  - If NO credits → Show pricing OR redirect to Buy Credits
  - If HAS credits → Go directly to date/time picker

**Code Change Needed** in [src/InterviewRequest.js](src/InterviewRequest.js):
```javascript
useEffect(() => {
  const userData = JSON.parse(localStorage.getItem('nexthesis_user') || '{}');

  // If professional, skip pricing entirely
  if (userData.type === 'professional') {
    setStep(2); // Go directly to scheduling
    setSelectedTier(pricingTiers[0]); // Set default tier (not used for professionals)
  }

  // If student, load credits
  if (userData.type === 'student') {
    loadUserCredits();
  }
}, []);
```

---

### 3. General Navigation Issues
**Issue**: Navigation between pages is confusing

**Ideas to Improve**:

#### Option A: Breadcrumb Navigation
Add breadcrumbs to show user where they are:
```
Home > Browse Experts > [Expert Name] > Request Interview
Home > Dashboard > Requests
```

#### Option B: Back Buttons
Add consistent "Back" buttons on all pages:
- Browse Experts → Back to Dashboard
- Professional Profile → Back to Browse
- Interview Request → Back to Profile

#### Option C: Smart Redirects
After actions, redirect to the most logical next step:
- ✅ After purchase → Browse Experts (DONE)
- After submitting interview request → Student Dashboard
- After confirming interview → Professional Dashboard
- After declining interview → Professional Dashboard

#### Option D: Persistent Navigation Bar
Keep the top nav bar on all pages with links to:
- Dashboard (student/professional specific)
- Browse Experts (students only)
- Buy Credits (students only)
- Requests (professionals only)
- Profile
- Logout

**Recommendation**: Implement **Option C** (smart redirects) first as it's easiest, then add **Option D** (persistent nav bar) for long-term UX.

---

## Implementation Priority

1. **HIGH**: Fix professional seeing pricing (confusing and breaks flow)
2. **MEDIUM**: Smart redirects after actions
3. **LOW**: Add breadcrumbs or back buttons (nice to have)

---

## Notes

- These changes should be made AFTER scheduling system is complete
- Keep changes minimal and focused on user flow
- Test with both student and professional accounts
