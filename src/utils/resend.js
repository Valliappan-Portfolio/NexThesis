// Resend Email Integration

const RESEND_API_KEY = process.env.REACT_APP_RESEND_API_KEY || 're_GXtTz3u1_LJknyz8HMVAnoLWbWcuX3YQ6';
const RESEND_API_URL = 'https://api.resend.com';

/**
 * Send confirmation email to student
 */
export async function sendStudentConfirmationEmail(details) {
  const {
    studentEmail,
    studentName,
    professionalName,
    professionalCompany,
    meetingLink,
    scheduledDate,
    scheduledTime,
    duration = 30,
    thesisTopic,
    timezone
  } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Interview Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hi ${studentName},</p>

      <p>Great news! Your interview request has been confirmed.</p>

      <div class="info-box">
        <h3>📅 Interview Details</h3>
        <p><strong>Professional:</strong> ${professionalName}</p>
        <p><strong>Company:</strong> ${professionalCompany}</p>
        <p><strong>Date:</strong> ${scheduledDate}</p>
        <p><strong>Time:</strong> ${scheduledTime} (${timezone})</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        ${thesisTopic ? `<p><strong>Your Thesis Topic:</strong> ${thesisTopic}</p>` : ''}
      </div>

      <div style="text-align: center;">
        <a href="${meetingLink}" class="button">Join Meeting</a>
      </div>

      <div class="info-box">
        <h3>💡 Tips for a Successful Interview</h3>
        <ul>
          <li>Join 5 minutes early to test your audio and video</li>
          <li>Prepare your questions in advance</li>
          <li>Have a notebook ready to take notes</li>
          <li>Find a quiet space with good lighting</li>
        </ul>
      </div>

      <p><strong>Meeting Link:</strong><br>
      <a href="${meetingLink}">${meetingLink}</a></p>

      <p>The meeting will be automatically recorded for your reference.</p>

      <div class="footer">
        <p>Questions? Reply to this email or contact us at support@nexthesis.com</p>
        <p>NexThesis - Connecting Students with Industry Experts</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Interview Confirmed with ${professionalName} - ${scheduledDate}`,
    html: emailHtml
  });
}

/**
 * Send confirmation email to professional
 */
export async function sendProfessionalConfirmationEmail(details) {
  const {
    professionalEmail,
    professionalName,
    studentName,
    studentUniversity,
    studentThesisTopic,
    meetingLink,
    scheduledDate,
    scheduledTime,
    duration = 30,
    timezone
  } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☕ Interview Scheduled</h1>
    </div>
    <div class="content">
      <p>Hi ${professionalName},</p>

      <p>You have an interview scheduled with a student researcher.</p>

      <div class="info-box">
        <h3>📋 Student Details</h3>
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>University:</strong> ${studentUniversity || 'Not specified'}</p>
        ${studentThesisTopic ? `<p><strong>Thesis Topic:</strong> ${studentThesisTopic}</p>` : ''}
      </div>

      <div class="info-box">
        <h3>📅 Meeting Details</h3>
        <p><strong>Date:</strong> ${scheduledDate}</p>
        <p><strong>Time:</strong> ${scheduledTime} (${timezone})</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>

      <div style="text-align: center;">
        <a href="${meetingLink}" class="button">Join Meeting</a>
      </div>

      <p><strong>Meeting Link:</strong><br>
      <a href="${meetingLink}">${meetingLink}</a></p>

      <p>The meeting will be automatically recorded. Payment will be processed after the interview is completed.</p>

      <div class="footer">
        <p>Questions? Reply to this email or contact us at support@nexthesis.com</p>
        <p>Thank you for supporting student researchers!</p>
        <p>NexThesis - Connecting Students with Industry Experts</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: professionalEmail,
    subject: `Interview Scheduled with ${studentName} - ${scheduledDate}`,
    html: emailHtml
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(details) {
  const {
    studentEmail,
    studentName,
    bundleName,
    amount,
    interviewsPurchased,
    creditsAvailable
  } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Payment Successful!</h1>
    </div>
    <div class="content">
      <p>Hi ${studentName},</p>

      <p>Thank you for your purchase! Your interview credits are now available.</p>

      <div class="info-box">
        <h3>💳 Purchase Details</h3>
        <p><strong>Package:</strong> ${bundleName}</p>
        <p><strong>Amount Paid:</strong> €${amount}</p>
        <p><strong>Interviews Included:</strong> ${interviewsPurchased}</p>
        <span class="success-badge">Payment Confirmed</span>
      </div>

      <div class="info-box">
        <h3>📊 Your Credit Balance</h3>
        <p style="font-size: 24px; font-weight: bold; color: #10b981; margin: 10px 0;">
          ${creditsAvailable} interview${creditsAvailable !== 1 ? 's' : ''} available
        </p>
        <p>You can now browse experts and request interviews!</p>
      </div>

      <div class="footer">
        <p>Receipt and invoice will be sent separately.</p>
        <p>Questions? Contact us at support@nexthesis.com</p>
        <p>NexThesis - Connecting Students with Industry Experts</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Payment Confirmed - ${interviewsPurchased} Interview Credits Added`,
    html: emailHtml
  });
}

/**
 * Send welcome email to new student
 */
export async function sendStudentWelcomeEmail(details) {
  const { studentEmail, studentName } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to NexThesis!</h1>
    </div>
    <div class="content">
      <p>Hi ${studentName},</p>

      <p>Thank you for joining NexThesis! You're now part of a community of ambitious students conducting world-class research by interviewing industry professionals.</p>

      <div class="info-box">
        <h3>🚀 Next Steps</h3>
        <ol>
          <li><strong>Purchase Interview Credits</strong> - Choose a package that fits your thesis needs</li>
          <li><strong>Browse Experts</strong> - Find professionals from Fortune 500 companies in your field</li>
          <li><strong>Request Interviews</strong> - Book structured 30-minute sessions</li>
          <li><strong>Conduct Research</strong> - Gather insights for your thesis</li>
        </ol>
      </div>

      <div style="text-align: center;">
        <a href="https://www.nexthesis.com/buy-credits" class="button">Get Started - Buy Credits</a>
      </div>

      <div class="info-box">
        <h3>💡 Tips for Success</h3>
        <ul>
          <li>Most thesis require 3-5 expert interviews</li>
          <li>Prepare your research questions in advance</li>
          <li>Each interview is recorded for your reference</li>
          <li>Credits never expire - use them at your own pace</li>
        </ul>
      </div>

      <p>Need help? Reply to this email or contact us at support@nexthesis.com</p>

      <div class="footer">
        <p>NexThesis - Connecting Students with Industry Experts</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: studentEmail,
    subject: 'Welcome to NexThesis - Let\'s Get Started!',
    html: emailHtml
  });
}

/**
 * Send welcome email to new professional
 */
export async function sendProfessionalWelcomeEmail(details) {
  const { professionalEmail, professionalName, company } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☕ Welcome to NexThesis!</h1>
    </div>
    <div class="content">
      <p>Hi ${professionalName},</p>

      <p>Thank you for joining NexThesis as a professional expert! Your industry experience will help shape the next generation of business leaders.</p>

      <div class="info-box">
        <h3>📋 How It Works</h3>
        <ol>
          <li><strong>Students find you</strong> - Your profile is now visible to students researching in your field</li>
          <li><strong>Review requests</strong> - Check your dashboard for interview requests</li>
          <li><strong>Confirm interviews</strong> - Accept requests that fit your schedule</li>
          <li><strong>Share insights</strong> - 30-minute video interviews to help students with their thesis</li>
        </ol>
      </div>

      <div style="text-align: center;">
        <a href="https://www.nexthesis.com/professional/dashboard" class="button">View Dashboard</a>
      </div>

      <div class="info-box">
        <h3>💼 Your Profile</h3>
        <p><strong>Company:</strong> ${company || 'Not specified'}</p>
        <p>Students will reach out based on your industry expertise and company background.</p>
      </div>

      <p><strong>What to expect:</strong></p>
      <ul>
        <li>You'll receive email notifications when students request interviews</li>
        <li>All interviews are scheduled at your convenience</li>
        <li>Each session is 30 minutes via video call</li>
        <li>You're helping students conduct academic research</li>
      </ul>

      <p>Questions? Reply to this email or contact us at support@nexthesis.com</p>

      <div class="footer">
        <p>Thank you for supporting student researchers!</p>
        <p>NexThesis - Connecting Students with Industry Experts</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: professionalEmail,
    subject: 'Welcome to NexThesis - Share Your Expertise',
    html: emailHtml
  });
}

/**
 * Core email sending function using Resend API
 */
async function sendEmail({ to, subject, html }) {
  try {
    console.log('📧 Attempting to send email...');
    console.log('   To:', to);
    console.log('   Subject:', subject);

    // Use Resend's test domain for development
    // For production: verify your domain at https://resend.com/domains
    const fromEmail = 'onboarding@resend.dev'; // Resend's test domain

    // IMPORTANT: With onboarding@resend.dev, emails can only be sent to the API key owner's email
    // This is a Resend limitation. To send to any email, verify your domain at resend.com/domains
    const TEST_MODE_EMAIL = 'rraagul5@gmail.com'; // API key owner's email
    const actualRecipient = to;
    const recipientEmail = to; // Keep original for now, will handle 403 below

    const emailPayload = {
      from: fromEmail,
      to: [recipientEmail],
      subject: `${subject} [TO: ${actualRecipient}]`, // Show intended recipient in subject during test mode
      html: html + `<p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; color: #856404; font-size: 12px;"><strong>⚠️ TEST MODE:</strong> This email was intended for <strong>${actualRecipient}</strong> but was sent to you (${recipientEmail}) because Resend test domain can only send to the API key owner. To send to any email, verify your domain at resend.com/domains</p>`
    };

    console.log('   From:', fromEmail);
    console.log('   Attempting to send to:', recipientEmail);

    const response = await fetch(`${RESEND_API_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Check if it's the "can only send to your own email" error
      if (response.status === 403 && responseData.message && responseData.message.includes('your own email address')) {
        console.warn('⚠️ Resend test mode: Redirecting email to API key owner');
        console.warn(`   Original recipient: ${actualRecipient}`);
        console.warn(`   Redirecting to: ${TEST_MODE_EMAIL}`);

        // Retry with the owner's email
        const fallbackPayload = {
          from: fromEmail,
          to: [TEST_MODE_EMAIL],
          subject: `${subject} [INTENDED FOR: ${actualRecipient}]`,
          html: `<div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; color: #856404; margin-bottom: 20px;"><strong>⚠️ TEST MODE NOTICE:</strong> This email was intended for <strong>${actualRecipient}</strong> but was redirected to you because Resend's test domain can only send to the API key owner's email. To send to any recipient, verify your domain at <a href="https://resend.com/domains">resend.com/domains</a></div>` + html
        };

        const fallbackResponse = await fetch(`${RESEND_API_URL}/emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify(fallbackPayload)
        });

        const fallbackData = await fallbackResponse.json();

        if (!fallbackResponse.ok) {
          console.error('❌ Fallback email also failed:', fallbackData);
          throw new Error(fallbackData.message || 'Failed to send email even to fallback address');
        }

        console.log('✅ Email sent successfully (to fallback address)!');
        console.log('   Message ID:', fallbackData.id);
        console.log(`   ⚠️ Check inbox at ${TEST_MODE_EMAIL}`);

        return {
          success: true,
          messageId: fallbackData.id,
          testMode: true,
          intendedRecipient: actualRecipient,
          actualRecipient: TEST_MODE_EMAIL
        };
      }

      console.error('❌ Resend API error:', responseData);
      console.error('   Status:', response.status);
      console.error('   Error details:', JSON.stringify(responseData, null, 2));
      throw new Error(responseData.message || 'Failed to send email');
    }

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', responseData.id);

    return {
      success: true,
      messageId: responseData.id
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('   Full error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export { sendEmail };
