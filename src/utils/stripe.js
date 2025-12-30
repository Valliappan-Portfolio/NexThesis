// Stripe Payment Integration
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create Stripe Checkout Session and redirect to payment page
 */
export async function redirectToCheckout(packageDetails) {
  try {
    const { name, price, interviews } = packageDetails;

    console.log('Creating Stripe checkout session...');
    console.log('Package:', name, '- Price:', price, '- Interviews:', interviews);

    const stripe = await getStripe();

    // Note: For a real implementation, you'd need a backend to create the checkout session
    // For now, we'll use Stripe's test mode with a simple redirect

    // In production, you would:
    // 1. Call your backend API
    // 2. Backend creates checkout session via Stripe API
    // 3. Backend returns session ID
    // 4. Frontend redirects to checkout

    // For testing without backend, we'll use a simpler approach
    // Create a checkout session (this would normally be done server-side)
    const response = await createCheckoutSession(packageDetails);

    if (response.url) {
      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } else if (response.id) {
      // Use Stripe.js to redirect
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.id,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create checkout session by calling our serverless function
 */
async function createCheckoutSession(packageDetails) {
  const { name, price, interviews, studentEmail, studentName } = packageDetails;

  console.log('📞 Calling serverless function to create checkout session...');
  console.log('Package details:', { name, price, interviews, studentEmail });

  try {
    // Call our serverless function
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        packageName: name,
        price: price,
        interviews: interviews,
        studentEmail: studentEmail,
        studentName: studentName
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Checkout creation failed:', data);
      throw new Error(data.error || 'Failed to create checkout session');
    }

    console.log('✅ Checkout session created successfully!');
    console.log('   Session ID:', data.sessionId);
    console.log('   Checkout URL:', data.url);

    return {
      id: data.sessionId,
      url: data.url
    };
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Handle successful payment
 * Called after user completes payment
 */
export async function handlePaymentSuccess(packageDetails, addCreditsCallback) {
  try {
    const { name, price, interviews, studentEmail, studentName } = packageDetails;

    console.log('Processing successful payment...');

    // Add credits to database
    await addCreditsCallback(studentEmail, studentName, name, price, interviews);

    console.log('✅ Credits added successfully');

    return {
      success: true,
      message: 'Payment successful! Credits have been added to your account.'
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Simplified payment flow for testing
 * Simulates Stripe payment without actual payment
 */
export async function simulateTestPayment(packageDetails, addCreditsCallback) {
  try {
    console.log('🧪 TEST MODE: Simulating payment...');

    const { name, price, interviews, studentEmail, studentName } = packageDetails;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `TEST PAYMENT\n\n` +
      `Package: ${name}\n` +
      `Amount: €${price}\n` +
      `Interviews: ${interviews}\n\n` +
      `Proceed with test payment?`
    );

    if (!confirmed) {
      return { success: false, cancelled: true };
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add credits
    await addCreditsCallback(studentEmail, studentName, name, price, interviews);

    console.log('✅ Test payment completed');

    return {
      success: true,
      message: 'Test payment successful! Credits added.'
    };
  } catch (error) {
    console.error('Test payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

const stripeUtils = {
  redirectToCheckout,
  handlePaymentSuccess,
  simulateTestPayment
};

export default stripeUtils;
