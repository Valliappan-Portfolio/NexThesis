// Test Daily.co API Key
// Run this with: node test-dailyco.js

const DAILY_API_KEY = '67e7bbee142cf779993310c300a6b10445f4d8297d29202dbfb9d9713e556103';
const DAILY_API_URL = 'https://api.daily.co/v1';

async function testDailyCoAPI() {
  console.log('\n🔍 Testing Daily.co API Key...\n');
  console.log('API Key:', DAILY_API_KEY.substring(0, 20) + '...');
  console.log('');

  try {
    // Test 1: List existing rooms (this works with free tier)
    console.log('📋 Test 1: Checking API authentication...');
    const listResponse = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    if (!listResponse.ok) {
      const error = await listResponse.json();
      console.error('❌ Authentication failed!');
      console.error('Error:', error);
      console.log('\n💡 This means your API key is invalid or expired.');
      console.log('Please get a new key from: https://dashboard.daily.co/developers');
      return false;
    }

    const rooms = await listResponse.json();
    console.log('✅ Authentication successful!');
    console.log(`   Found ${rooms.data?.length || 0} existing rooms`);
    console.log('');

    // Test 2: Create a test room
    console.log('🏗️  Test 2: Creating a test room...');
    const roomName = `test-${Date.now()}`;

    const createResponse = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'public',
        properties: {
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
          max_participants: 2
        }
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.error('❌ Room creation failed!');
      console.error('Error:', JSON.stringify(error, null, 2));

      if (error.error === 'invalid-request-error') {
        console.log('\n💡 Possible reasons:');
        console.log('   1. Your account might need to be upgraded');
        console.log('   2. Some properties might not be available on free tier');
        console.log('   3. Room name might be invalid');
      }

      return false;
    }

    const roomData = await createResponse.json();
    console.log('✅ Room created successfully!');
    console.log('   Room URL:', roomData.url);
    console.log('   Room Name:', roomData.name);
    console.log('');

    // Test 3: Delete the test room
    console.log('🗑️  Test 3: Cleaning up test room...');
    const deleteResponse = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    if (deleteResponse.ok) {
      console.log('✅ Test room deleted successfully!');
    } else {
      console.log('⚠️  Could not delete test room (not critical)');
    }

    console.log('\n✅✅✅ ALL TESTS PASSED! ✅✅✅');
    console.log('\nYour Daily.co API key is valid and working!');
    console.log('The integration should work in your app.');
    return true;

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.log('\n💡 This might be a network issue or the API key format is wrong.');
    return false;
  }
}

// Run the test
testDailyCoAPI().then(success => {
  if (!success) {
    console.log('\n📝 Next steps:');
    console.log('1. Go to https://dashboard.daily.co/developers');
    console.log('2. Copy your API key');
    console.log('3. Update the DAILY_API_KEY in this file');
    console.log('4. Run this test again: node test-dailyco.js');
  }
  process.exit(success ? 0 : 1);
});
