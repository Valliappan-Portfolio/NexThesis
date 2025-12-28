// Quick test script to verify email automation
const RESEND_API_KEY = 're_GXtTz3u1_LJknyz8HMVAnoLWbWcuX3YQ6';
const RESEND_API_URL = 'https://api.resend.com';

async function testEmailFlow() {
  console.log('Testing email flow...');
  
  // Test 1: Send to student
  const studentPayload = {
    from: 'noreply@nexthesis.com',
    to: ['rraagul5@gmail.com'],
    subject: 'Interview Confirmed with Valliappan Natarajan - Test',
    html: '<h1>Interview Confirmed!</h1><p>Test from automation script</p>'
  };

  const studentResponse = await fetch(`${RESEND_API_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify(studentPayload)
  });

  const studentData = await studentResponse.json();
  console.log('Student email:', studentData);

  // Test 2: Send to professional
  const professionalPayload = {
    from: 'noreply@nexthesis.com',
    to: ['vspvalliappan@gmail.com'],
    subject: 'Interview Scheduled with Wall E - Test',
    html: '<h1>Interview Scheduled</h1><p>Test from automation script</p>'
  };

  const professionalResponse = await fetch(`${RESEND_API_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify(professionalPayload)
  });

  const professionalData = await professionalResponse.json();
  console.log('Professional email:', professionalData);
}

testEmailFlow().catch(console.error);
