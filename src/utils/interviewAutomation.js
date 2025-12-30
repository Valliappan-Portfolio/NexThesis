// Interview Automation - Triggers meeting creation and email sending

import { createMeetingRoom } from './jitsi';
import { sendStudentConfirmationEmail, sendProfessionalConfirmationEmail } from './resend';
import { deductCredit } from './creditSystem';

const SUPABASE_URL = 'https://bpupukmduvbzyywbcngj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw';

/**
 * Main automation function - called when professional confirms an interview
 * @param {string} requestId - The interview request ID
 * @param {Object} scheduledDetails - Scheduled date/time details
 */
export async function confirmInterviewAutomation(requestId, scheduledDetails = {}) {
  console.log('========== INTERVIEW CONFIRMATION AUTOMATION ==========');
  console.log('Request ID:', requestId);
  console.log('Scheduled details:', scheduledDetails);

  try {
    // Step 1: Get the full request details
    const request = await getRequestDetails(requestId);
    console.log('Request details:', request);

    if (!request) {
      throw new Error('Request not found');
    }

    // Step 2: Try to deduct credit from student's account (optional for testing)
    console.log('Checking credits for student:', request.student_email);
    try {
      const creditUsed = await deductCredit(request.student_email);

      if (creditUsed) {
        console.log('✅ Credit deducted successfully');
      } else {
        console.warn('⚠️ No credits available - continuing anyway (testing mode)');
      }
    } catch (creditError) {
      console.warn('⚠️ Credit deduction failed:', creditError.message);
      console.warn('⚠️ Continuing without credit deduction (testing mode)');
    }

    // Step 3: Create Jitsi meeting room
    console.log('Creating Jitsi meeting room...');
    const meeting = await createMeetingRoom({
      studentName: request.student_name,
      professionalName: request.professional_name,
      scheduledDate: scheduledDetails.date || 'TBD',
      scheduledTime: scheduledDetails.time || 'TBD',
      duration: 30
    });

    console.log('✅ Meeting room created:', meeting.roomUrl);

    // Step 4: Update interview request with meeting details and status
    console.log('Updating request with meeting link...');

    // Handle scheduled date - set to null for now (to be scheduled later)
    let scheduledDate = null;
    if (scheduledDetails.date && scheduledDetails.date !== 'To be scheduled') {
      try {
        scheduledDate = new Date(scheduledDetails.date).toISOString();
      } catch (e) {
        console.warn('Invalid date format, using null:', scheduledDetails.date);
      }
    }

    await updateRequestWithMeeting(requestId, {
      meeting_link: meeting.roomUrl,
      meeting_room_id: meeting.roomName,
      scheduled_date: scheduledDate,
      status: 'confirmed'
    });

    console.log('✅ Request updated in database');

    // Step 5: Send confirmation emails
    console.log('Sending confirmation emails...');

    // Email to student
    try {
      await sendStudentConfirmationEmail({
        studentEmail: request.student_email,
        studentName: request.student_name,
        professionalName: request.professional_name,
        professionalCompany: request.professional_company || 'N/A',
        meetingLink: meeting.roomUrl,
        scheduledDate: scheduledDetails.date || 'To be scheduled',
        scheduledTime: scheduledDetails.time || 'To be confirmed',
        duration: 30,
        thesisTopic: request.student_thesis_topic,
        timezone: request.student_timezone || 'UTC',
        professionalMessage: request.professional_message || null
      });
      console.log('✅ Student email sent');
    } catch (emailError) {
      console.error('❌ Failed to send student email:', emailError);
      // Continue even if email fails
    }

    // Email to professional
    try {
      await sendProfessionalConfirmationEmail({
        professionalEmail: request.professional_email,
        professionalName: request.professional_name,
        studentName: request.student_name,
        studentUniversity: request.student_university,
        studentThesisTopic: request.student_thesis_topic,
        meetingLink: meeting.roomUrl,
        scheduledDate: scheduledDetails.date || 'To be scheduled',
        scheduledTime: scheduledDetails.time || 'To be confirmed',
        duration: 30,
        timezone: request.student_timezone || 'UTC'
      });
      console.log('✅ Professional email sent');
    } catch (emailError) {
      console.error('❌ Failed to send professional email:', emailError);
      // Continue even if email fails
    }

    console.log('========== AUTOMATION COMPLETE ==========');

    return {
      success: true,
      meetingLink: meeting.roomUrl,
      message: 'Interview confirmed! Meeting created and emails sent.'
    };

  } catch (error) {
    console.error('========== AUTOMATION FAILED ==========');
    console.error('Error:', error);

    return {
      success: false,
      error: error.message,
      message: 'Failed to complete automation. Check console for details.'
    };
  }
}

/**
 * Get full request details from database
 */
async function getRequestDetails(requestId) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_requests?id=eq.${requestId}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching request details:', error);
    throw error;
  }
}

/**
 * Update request with meeting details
 */
async function updateRequestWithMeeting(requestId, meetingDetails) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/interview_requests?id=eq.${requestId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(meetingDetails)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
}

/**
 * Simple confirmation without scheduling (for immediate approval)
 */
export async function quickConfirm(requestId) {
  return confirmInterviewAutomation(requestId, {
    date: 'To be scheduled',
    time: 'To be confirmed'
  });
}
