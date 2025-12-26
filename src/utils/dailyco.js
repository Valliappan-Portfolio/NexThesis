// Daily.co Meeting Room Integration

const DAILY_API_KEY = process.env.REACT_APP_DAILY_API_KEY || '67e7bbee142cf779993310c300a6b10445f4d8297d29202dbfb9d9713e556103';
const DAILY_API_URL = 'https://api.daily.co/v1';

/**
 * Create a Daily.co meeting room
 * @param {Object} options - Room configuration
 * @returns {Promise<Object>} Room details including URL
 */
export async function createMeetingRoom(options = {}) {
  try {
    // Options destructured for future use:
    // const { studentName, professionalName, scheduledDate, scheduledTime, duration = 30 } = options;

    // Generate a unique room name
    const roomName = `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Creating Daily.co room:', roomName);

    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'public',
        properties: {
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          max_participants: 2
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Daily.co API error:', error);
      throw new Error(error.error || 'Failed to create meeting room');
    }

    const roomData = await response.json();
    console.log('Meeting room created:', roomData);

    return {
      roomUrl: roomData.url,
      roomName: roomData.name,
      roomId: roomData.id,
      config: roomData.config
    };
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    throw error;
  }
}

/**
 * Delete a Daily.co meeting room
 */
export async function deleteMeetingRoom(roomName) {
  try {
    console.log('Deleting Daily.co room:', roomName);

    const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error deleting room:', error);
      throw new Error(error.error || 'Failed to delete room');
    }

    console.log('Room deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting room:', error);
    return false;
  }
}

/**
 * Get recording information
 */
export async function getRecording(roomName) {
  try {
    console.log('Fetching recording for room:', roomName);

    const response = await fetch(`${DAILY_API_URL}/recordings?room_name=${roomName}`, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recordings');
    }

    const data = await response.json();
    console.log('Recordings:', data);

    // Return the most recent recording
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching recording:', error);
    return null;
  }
}

/**
 * Generate a meeting token for a specific participant
 */
export async function createMeetingToken(roomName, userName, isOwner = false) {
  try {
    console.log('Creating meeting token for:', userName);

    const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          is_owner: isOwner,
          // Token expires in 24 hours
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create meeting token');
    }

    const data = await response.json();
    console.log('Meeting token created');

    return data.token;
  } catch (error) {
    console.error('Error creating meeting token:', error);
    throw error;
  }
}
