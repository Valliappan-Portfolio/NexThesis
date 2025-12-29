// Jitsi Meet Integration
// 100% Free - No API key, no payment, no account registration required

const JITSI_DOMAIN = process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si';

/**
 * Create a Jitsi meeting room
 * Unlike Daily.co, Jitsi doesn't require API calls - rooms are created automatically when users join
 * @param {Object} options - Room configuration
 * @returns {Promise<Object>} Room details including URL
 */
export async function createMeetingRoom(options = {}) {
  try {
    const { studentName, professionalName, scheduledDate, scheduledTime } = options;

    // Generate a unique room name
    const roomName = `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Creating Jitsi meeting room:', roomName);

    // Construct the Jitsi URL
    const roomUrl = `https://${JITSI_DOMAIN}/${roomName}`;

    // Optional: Add URL parameters for room configuration if needed
    // const configParams = new URLSearchParams({
    //   '#config.startWithAudioMuted': 'false',
    //   '#config.startWithVideoMuted': 'false',
    //   '#config.prejoinPageEnabled': 'true', // Show preview page before joining
    // });

    console.log('Jitsi meeting room created:', roomUrl);

    // Return the same structure as Daily.co for compatibility
    return {
      roomUrl: roomUrl,
      roomName: roomName,
      roomId: roomName, // Jitsi uses room name as ID
      config: {
        domain: JITSI_DOMAIN,
        roomName: roomName,
        studentName: studentName,
        professionalName: professionalName,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        features: {
          chat: true,
          screenshare: true,
          recording: true, // Local browser-based recording
          reactions: true,
          virtualBackgrounds: true
        }
      }
    };
  } catch (error) {
    console.error('Error creating Jitsi room:', error);
    throw error;
  }
}

/**
 * Delete a Jitsi meeting room
 * Note: Jitsi rooms are automatically cleaned up when empty
 * This function is kept for API compatibility with Daily.co
 */
export async function deleteMeetingRoom(roomName) {
  try {
    console.log('Jitsi room cleanup (automatic):', roomName);
    // Jitsi doesn't require explicit room deletion
    // Rooms are automatically cleaned up when all participants leave
    console.log('Room will be automatically cleaned up when empty');
    return true;
  } catch (error) {
    console.error('Note: Jitsi rooms auto-cleanup:', error);
    return true; // Always return true since no action needed
  }
}

/**
 * Get recording information
 * Note: Jitsi uses local browser-based recording (Jibri for server recording)
 * This function is kept for API compatibility with Daily.co
 */
export async function getRecording(roomName) {
  try {
    console.log('Jitsi recording info for room:', roomName);
    console.log('Note: Jitsi uses local browser-based recording');
    console.log('Recordings are saved locally on participant devices');

    // Return null since Jitsi doesn't have cloud recording API like Daily.co
    return null;
  } catch (error) {
    console.error('Jitsi recording note:', error);
    return null;
  }
}

/**
 * Generate a meeting token for a specific participant
 * Note: Jitsi supports JWT tokens for secure rooms (optional, free feature)
 * This basic implementation doesn't use JWT - rooms are open to anyone with the link
 * For production, you can implement JWT tokens for added security
 */
export async function createMeetingToken(roomName, userName, isOwner = false) {
  try {
    console.log('Creating Jitsi meeting link for:', userName);

    // Basic implementation: Just return the room URL with user display name
    const roomUrl = `https://${JITSI_DOMAIN}/${roomName}#userInfo.displayName="${encodeURIComponent(userName)}"`;

    console.log('Meeting link created (no token needed for basic Jitsi)');

    // For JWT token implementation, see: https://jitsi.github.io/handbook/docs/devops-guide/secure-domain
    return roomUrl;
  } catch (error) {
    console.error('Error creating meeting token:', error);
    throw error;
  }
}
