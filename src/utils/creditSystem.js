// Credit System Utilities

const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

/**
 * Get available credits for a student
 */
export async function getAvailableCredits(studentEmail) {
  try {
    console.log('Checking credits for:', studentEmail);

    // Read credits directly from students table
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/students?email=eq.${encodeURIComponent(studentEmail)}&select=credits`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const students = await response.json();
    const credits = students && students.length > 0 ? (students[0].credits || 0) : 0;
    console.log('Available credits:', credits);
    return credits;
  } catch (error) {
    console.error('Error getting credits:', error);
    return 0;
  }
}

/**
 * Get payment history for a student
 */
export async function getPaymentHistory(studentEmail) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?student_email=eq.${encodeURIComponent(studentEmail)}&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const payments = await response.json();
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    console.error('Error getting payment history:', error);
    return [];
  }
}

/**
 * Use a credit for an interview (deduct from student's available credits)
 */
export async function deductCredit(studentEmail) {
  try {
    console.log('Using credit for:', studentEmail);

    // Get current credits
    const currentCredits = await getAvailableCredits(studentEmail);

    if (currentCredits <= 0) {
      console.error('No credits available');
      return false;
    }

    // Deduct one credit
    const response = await fetch(
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
          credits: currentCredits - 1
        })
      }
    );

    if (response.ok) {
      console.log('Credit deducted successfully');
      return true;
    } else {
      console.error('Failed to deduct credit');
      return false;
    }
  } catch (error) {
    console.error('Error using credit:', error);
    return false;
  }
}

/**
 * Add credits (for testing or payment completion)
 */
export async function addCredits(studentEmail, studentName, bundleName, amount, interviewsPurchased) {
  try {
    console.log('Adding credits:', { studentEmail, bundleName, amount, interviewsPurchased });

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          student_email: studentEmail,
          student_name: studentName,
          bundle_name: bundleName,
          amount_paid: amount,
          interviews_purchased: interviewsPurchased,
          interviews_used: 0,
          payment_status: 'completed',
          stripe_payment_intent_id: `test_${Date.now()}`
        })
      }
    );

    const payment = await response.json();
    console.log('Credits added:', payment);
    return payment;
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
}

/**
 * Get credit summary for display
 */
export async function getCreditSummary(studentEmail) {
  try {
    const payments = await getPaymentHistory(studentEmail);
    const credits = await getAvailableCredits(studentEmail);

    const totalPurchased = payments.reduce((sum, p) => sum + p.interviews_purchased, 0);
    const totalUsed = payments.reduce((sum, p) => sum + p.interviews_used, 0);
    const totalSpent = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

    return {
      creditsAvailable: credits,
      totalPurchased,
      totalUsed,
      totalSpent,
      payments
    };
  } catch (error) {
    console.error('Error getting credit summary:', error);
    return {
      creditsAvailable: 0,
      totalPurchased: 0,
      totalUsed: 0,
      totalSpent: 0,
      payments: []
    };
  }
}
