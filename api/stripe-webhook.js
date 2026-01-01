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

        // TODO: Send payment confirmation email
        // await sendPaymentConfirmationEmail({ ... });

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
