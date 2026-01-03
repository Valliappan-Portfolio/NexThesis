// Vercel Serverless Function to handle Stripe webhooks
// This receives notifications when payments succeed

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase credentials
const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body for signature verification
  },
};

// Helper to get raw body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    // Verify webhook signature (only in production with webhook secret)
    // For testing without webhook secret, we'll skip verification
    let event;

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // For testing: parse the body directly (NOT SECURE - only for development!)
      console.warn('⚠️ No webhook secret configured - skipping signature verification');
      event = JSON.parse(rawBody.toString());
    }

    console.log('📨 Received webhook event:', event.type);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('✅ Payment successful!');
      console.log('   Session ID:', session.id);
      console.log('   Customer email:', session.customer_email);
      console.log('   Amount:', session.amount_total / 100);

      // Get metadata from the session
      const { studentEmail, studentName, packageName, interviews, amount } = session.metadata;

      console.log('   Metadata:', { studentEmail, studentName, packageName, interviews, amount });

      // Add credits to the database
      try {
        await addCreditsToDatabase({
          studentEmail: studentEmail || session.customer_email,
          studentName: studentName || 'Student',
          packageName: packageName,
          amount: parseFloat(amount),
          interviews: parseInt(interviews)
        });

        console.log('✅ Credits added successfully to database');

        // Send payment confirmation email
        try {
          await sendPaymentConfirmationEmail({
            studentEmail: studentEmail || session.customer_email,
            studentName: studentName || 'Student',
            packageName: packageName,
            amount: parseFloat(amount),
            interviews: parseInt(interviews)
          });
          console.log('✅ Payment confirmation email sent');
        } catch (emailError) {
          console.error('⚠️ Failed to send confirmation email:', emailError.message);
          // Don't fail the whole operation if email fails
        }

      } catch (dbError) {
        console.error('❌ Failed to add credits to database:', dbError);
        // Return 500 so Stripe will retry the webhook
        return res.status(500).json({ error: 'Failed to process payment in database' });
      }
    }

    // Return 200 to acknowledge receipt of the event
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Add credits to student's account in Supabase
 */
async function addCreditsToDatabase({ studentEmail, studentName, packageName, amount, interviews }) {
  try {
    console.log('Adding credits to database...');
    console.log('   Email:', studentEmail);
    console.log('   Credits:', interviews);

    // Check if student exists
    const studentResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const students = await studentResponse.json();

    if (!students || students.length === 0) {
      throw new Error(`Student not found: ${studentEmail}`);
    }

    const student = students[0];
    const currentCredits = student.credits || 0;
    const newCredits = currentCredits + interviews;

    console.log('   Current credits:', currentCredits);
    console.log('   New credits:', newCredits);

    // Update student credits
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          credits: newCredits
        })
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Failed to update credits: ${JSON.stringify(error)}`);
    }

    console.log('✅ Credits updated successfully');

    // Create payment record
    const paymentRecord = {
      student_email: studentEmail,
      student_name: studentName,
      package_name: packageName,
      amount: amount,
      credits_purchased: interviews,
      payment_date: new Date().toISOString(),
      payment_status: 'completed'
    };

    // Insert payment record (optional - create this table if needed)
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/payments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(paymentRecord)
        }
      );
      console.log('✅ Payment record created');
    } catch (paymentError) {
      console.warn('⚠️ Failed to create payment record (table may not exist):', paymentError.message);
      // Don't fail the whole operation if payment logging fails
    }

    return { success: true, newCredits };
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
}

/**
 * Send payment confirmation email to student
 */
async function sendPaymentConfirmationEmail({ studentEmail, studentName, packageName, amount, interviews }) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #667eea; }
          .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your credits have been added</p>
          </div>
          <div class="content">
            <p>Hi ${studentName},</p>
            <p>Thank you for your purchase! Your payment has been processed successfully and your credits are now available.</p>

            <div class="details">
              <h3 style="margin-top: 0; color: #667eea;">Order Details</h3>
              <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span>${packageName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount Paid:</span>
                <span>$${amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Credits Added:</span>
                <span>${interviews} interview${interviews > 1 ? 's' : ''}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <p>You can now use your credits to book interviews with industry experts!</p>

            <div style="text-align: center;">
              <a href="https://nexthesis.com/browse" class="cta-button">Browse Experts Now</a>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Your receipt and payment details have been sent to ${studentEmail}.
              If you have any questions, please don't hesitate to contact our support team.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 NexThesis. All rights reserved.</p>
            <p>You're receiving this email because you made a purchase on NexThesis.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Call the send-email API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://www.nexthesis.com';

    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: studentEmail,
        subject: `Payment Confirmed - ${interviews} Credits Added to Your Account`,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Email API error: ${JSON.stringify(error)}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
}
