// Vercel Serverless Function to verify email addresses
// Handles email verification via token sent in verification emails

const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, type } = req.query;

    if (!token || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing token or type parameter'
      });
    }

    if (type !== 'student' && type !== 'professional') {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be "student" or "professional"'
      });
    }

    console.log(`Verifying ${type} email with token:`, token.substring(0, 10) + '...');

    const tableName = type === 'student' ? 'students' : 'professionals';

    // Find user with this token
    const findResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?verification_token=eq.${encodeURIComponent(token)}`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const users = await findResponse.json();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    const user = users[0];

    // Check if token is expired (24 hours)
    const expiresAt = new Date(user.verification_token_expires);
    if (expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Verification token has expired. Please request a new one.'
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        alreadyVerified: true
      });
    }

    // Verify the email
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(user.email)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email_verified: true,
          verification_token: null,
          verification_token_expires: null
        })
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Failed to verify email: ${JSON.stringify(error)}`);
    }

    console.log(`✅ Email verified for ${type}:`, user.email);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      email: user.email,
      name: user.name,
      type: type
    });

  } catch (error) {
    console.error('❌ Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify email. Please try again.'
    });
  }
}
