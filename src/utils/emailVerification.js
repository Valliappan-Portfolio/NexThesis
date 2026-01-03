// Email Verification Utilities

const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

/**
 * Generate a random verification token
 */
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(email, name, type) {
  try {
    console.log('Sending verification email to:', email);

    // Generate verification token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const tableName = type === 'student' ? 'students' : 'professionals';

    // Update user with verification token
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          verification_token: token,
          verification_token_expires: expiresAt.toISOString()
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to save verification token');
    }

    // Send verification email
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}&type=${type}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with NexThesis! Please verify your email address to get started.</p>

            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
            </p>

            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 NexThesis. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: email,
        subject: 'Verify Your Email - NexThesis',
        html: emailHtml
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send verification email');
    }

    console.log('✅ Verification email sent successfully');
    return { success: true };

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(email, type) {
  try {
    const tableName = type === 'student' ? 'students' : 'professionals';

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}&select=email_verified`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const users = await response.json();
    return users && users.length > 0 && users[0].email_verified === true;

  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
}
