// Rating and Feedback System Utilities

const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

/**
 * Submit a rating and feedback for a professional after interview
 */
export async function submitRating(requestId, professionalEmail, studentEmail, rating, feedback) {
  try {
    // Update interview_requests table with rating
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_requests?id=eq.${requestId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          rating: rating,
          feedback: feedback,
          rated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }

    // Update professional's average rating
    await updateProfessionalRating(professionalEmail);

    return { success: true };
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
}

/**
 * Calculate and update a professional's average rating
 */
async function updateProfessionalRating(professionalEmail) {
  try {
    // Get all completed interviews with ratings for this professional
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_requests?professional_email=eq.${encodeURIComponent(professionalEmail)}&status=eq.confirmed&rating=not.is.null&select=rating`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const interviews = await response.json();

    if (interviews && interviews.length > 0) {
      const totalRating = interviews.reduce((sum, interview) => sum + (interview.rating || 0), 0);
      const averageRating = totalRating / interviews.length;
      const ratingCount = interviews.length;

      // Update professional's profile with average rating
      await fetch(
        `${SUPABASE_URL}/rest/v1/professionals?email=eq.${encodeURIComponent(professionalEmail)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            rating_count: ratingCount
          })
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating professional rating:', error);
    throw error;
  }
}

/**
 * Check if a student has already rated an interview
 */
export async function hasRated(requestId) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_requests?id=eq.${requestId}&select=rating`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    return data && data.length > 0 && data[0].rating !== null;
  } catch (error) {
    console.error('Error checking rating status:', error);
    return false;
  }
}

/**
 * Get a professional's rating statistics
 */
export async function getProfessionalRating(professionalEmail) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/professionals?email=eq.${encodeURIComponent(professionalEmail)}&select=average_rating,rating_count`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        averageRating: data[0].average_rating || 0,
        ratingCount: data[0].rating_count || 0
      };
    }

    return { averageRating: 0, ratingCount: 0 };
  } catch (error) {
    console.error('Error fetching professional rating:', error);
    return { averageRating: 0, ratingCount: 0 };
  }
}
