// Vercel Serverless Function to create Stripe checkout sessions
// This runs on the server, so your secret key stays safe

import Stripe from 'stripe';

export default async function handler(req, res) {
  // Check if Stripe key exists FIRST
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('CRITICAL: STRIPE_SECRET_KEY environment variable is not set!');
    console.error('Available env vars:', Object.keys(process.env).join(', '));
    return res.status(500).json({
      error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to Vercel environment variables.',
      hint: 'Go to Vercel Dashboard → Settings → Environment Variables'
    });
  }

  // Initialize Stripe AFTER checking the key exists
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    console.log('=== CREATE CHECKOUT REQUEST ===');
    console.log('Method:', req.method);
    console.log('Body:', JSON.stringify(req.body));
    console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('Stripe key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 10));

    const { packageName, price, interviews, studentEmail, studentName } = req.body;

    // Validate input
    if (!packageName || !price || !interviews || !studentEmail) {
      console.error('Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields: packageName, price, interviews, studentEmail'
      });
    }

    console.log('Creating Stripe checkout session...');
    console.log('Package:', packageName);
    console.log('Price:', price);
    console.log('Student:', studentEmail);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageName,
              description: `${interviews} interview${interviews > 1 ? 's' : ''} with industry experts`,
              images: ['https://www.nexthesis.com/logo.png'], // Optional: Add your logo
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/buy-credits?canceled=true`,
      customer_email: studentEmail,
      metadata: {
        studentEmail: studentEmail,
        studentName: studentName,
        packageName: packageName,
        interviews: interviews.toString(),
        amount: price.toString()
      },
    });

    console.log('✅ Checkout session created:', session.id);

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
      errorName: error.name,
      errorDetails: error.toString()
    });
  }
}
