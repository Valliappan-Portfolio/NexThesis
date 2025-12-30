// Vercel Serverless Function to send emails via Resend
// This runs on the server, not in the browser, so CORS is not an issue

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_GXtTz3u1_LJknyz8HMVAnoLWbWcuX3YQ6';
const RESEND_API_URL = 'https://api.resend.com/emails';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;

    // Validate input
    if (!to || !subject || !html) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, html'
      });
    }

    console.log('Sending email via serverless function...');
    console.log('To:', to);
    console.log('Subject:', subject);

    // Call Resend API from server-side
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@nexthesis.com',
        reply_to: 'support@nexthesis.com',
        to: [to],
        subject: subject,
        html: html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to send email',
        details: data
      });
    }

    console.log('Email sent successfully! ID:', data.id);

    return res.status(200).json({
      success: true,
      messageId: data.id
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
