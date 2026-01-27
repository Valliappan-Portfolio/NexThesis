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

    // First, check if user exists and get their current data
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/${tableName}?email=eq.${encodeURIComponent(email)}&select=id,email_verified`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const users = await checkResponse.json();

    if (!users || users.length === 0) {
      throw new Error('User not found. Please complete registration first.');
    }

    const user = users[0];

    // Check if already verified
    if (user.email_verified) {
      console.log('User already verified, skipping email send');
      return { success: true, messageId: null, alreadyVerified: true };
    }

    // Update user with verification token (only if fields exist)
    try {
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
        // If update fails, it might be because the fields don't exist, but we can still send email
        console.warn('Could not update verification token fields, but proceeding with email send');
      }
    } catch (updateError) {
      console.warn('Verification token update failed, but proceeding with email:', updateError);
    }

    // Send verification email
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}&type=${type}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
          .note { font-size: 12px; color: #64748b; margin-top: 20px; background: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 4px solid #667eea; }
          .success-text { color: #10b981; font-weight: 600; }
          .warning-text { color: #f59e0b; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Welcome to NexThesis</p>
          </div>
          <div class="content">
            <p style="margin: 0 0 20px 0;">Hi <span class="success-text">${name}</span>,</p>
            <p style="margin: 0 0 20px 0;">Thank you for registering with NexThesis! Please verify your email address to get started.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>

            <p style="margin: 20px 0 10px 0; font-size: 14px; color: #64748b;">
              Or copy and paste this link into your browser:
            </p>
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; word-break: break-all; font-family: monospace; font-size: 12px;">
              <a href="${verificationUrl}" style="color: #667eea; text-decoration: none;">${verificationUrl}</a>
            </div>

            <div class="note">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                ⚠️ This link will expire in 24 hours. If you didn't create an account, please ignore this email.
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 NexThesis. All rights reserved.</p>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">
              Need help? Contact us at <a href="mailto:support@nexthesis.com" style="color: #667eea; text-decoration: none;">support@nexthesis.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📧 Calling email API to send verification email...');
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

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Email API error:', responseData);
      
      // Handle Resend test domain limitation
      if (responseData.error && responseData.error.includes('testing emails to your own email address')) {
        console.warn('⚠️ Resend test domain limitation: Can only send to verified email addresses');
        throw new Error('Email verification temporarily unavailable. Please contact support or try again later.');
      }
      
      throw new Error(responseData.error || 'Failed to send verification email');
    }

    console.log('✅ Verification email sent successfully');
    console.log('   Message ID:', responseData.messageId);
    return { success: true, messageId: responseData.messageId };

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
