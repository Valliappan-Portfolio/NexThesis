// Resend Email Integration
// Note: Emails are sent via serverless function at /api/send-email to avoid CORS issues

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
    timezone,
    professionalMessage
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

      ${professionalMessage ? `
      <div class="info-box" style="background: #f0f9ff; border-left: 4px solid #3b82f6;">
        <h3 style="margin-top: 0; color: #1e40af;">💬 Message from ${professionalName}</h3>
        <p style="white-space: pre-wrap; color: #1f2937;">${professionalMessage}</p>
      </div>
      ` : ''}

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

      <p>You can record the meeting locally using your browser for your reference.</p>

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

      <p>You can record the meeting locally using your browser if needed. Payment will be processed after the interview is completed.</p>

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
 * Send decline notification email to student
 */
export async function sendDeclineEmail(details) {
  const {
    studentEmail,
    studentName,
    professionalName,
    professionalCompany,
    professionalMessage,
    thesisTopic
  } = details;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Interview Request Update</h1>
    </div>
    <div class="content">
      <p>Hi ${studentName},</p>

      <p>Unfortunately, ${professionalName} from ${professionalCompany} is unable to accept your interview request at this time.</p>

      ${professionalMessage ? `
      <div class="message-box">
        <h3 style="margin-top: 0; color: #b45309;">💬 Message from ${professionalName}</h3>
        <p style="white-space: pre-wrap; color: #1f2937;">${professionalMessage}</p>
      </div>
      ` : ''}

      <div class="info-box">
        <h3>🔍 What's Next?</h3>
        <p>Don't worry! You still have options:</p>
        <ul>
          <li><strong>Browse other experts</strong> - We have many professionals ready to help</li>
          <li><strong>Try again later</strong> - The professional might have different availability</li>
          <li><strong>Refine your request</strong> - Consider adjusting your schedule or topic focus</li>
        </ul>
        ${thesisTopic ? `<p><strong>Your Thesis Topic:</strong> ${thesisTopic}</p>` : ''}
      </div>

      <div style="text-align: center;">
        <a href="https://www.nexthesis.com/browse" class="button">Browse Other Experts</a>
      </div>

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
    subject: `Interview Request Update - ${professionalName}`,
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

    // Call our serverless function instead of Resend API directly (to avoid CORS)
    const apiEndpoint = '/api/send-email';

    const emailPayload = {
      to: to,
      subject: subject,
      html: html
    };

    console.log('   Calling serverless function:', apiEndpoint);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Email API error:', responseData);
      console.error('   Status:', response.status);
      console.error('   Error details:', JSON.stringify(responseData, null, 2));
      throw new Error(responseData.error || 'Failed to send email');
    }

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', responseData.messageId);

    return {
      success: true,
      messageId: responseData.messageId
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
