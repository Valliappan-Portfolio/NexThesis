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
 * Create checkout session (client-side for testing)
 * In production, this should be done server-side
 */
async function createCheckoutSession(packageDetails) {
  const { name, price, interviews, studentEmail, studentName } = packageDetails;

  // For test mode, we'll use Stripe's Payment Links feature
  // This is the simplest way to test without a backend

  // Convert to cents (Stripe uses smallest currency unit)
  const amountInCents = Math.round(price * 100);

  console.log('Package details:', {
    name,
    price,
    interviews,
    amountInCents,
    studentEmail
  });

  // Return a test checkout URL
  // In production, you'd call your backend API here
  return {
    url: createTestCheckoutUrl(packageDetails),
    metadata: {
      studentEmail,
      studentName,
      bundleName: name,
      interviews,
      amount: price
    }
  };
}

/**
 * Create a test checkout URL (for development without backend)
 */
function createTestCheckoutUrl(packageDetails) {
  const { name, price } = packageDetails;

  // For now, return to a success page with query params
  // In production, this would be a real Stripe checkout URL
  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/payment-success?package=${encodeURIComponent(name)}&amount=${price}`;

  return successUrl;
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
