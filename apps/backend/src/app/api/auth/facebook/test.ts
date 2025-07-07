/**
 * Test script for Facebook Login API
 * 
 * This script demonstrates how to test the Facebook login endpoint.
 * You need to provide a valid Facebook access token to test it.
 */

const API_BASE_URL = 'http://localhost:3000/api'

async function testFacebookLogin(facebookAccessToken: string) {
  try {
    console.log('Testing Facebook login...')
    
    const response = await fetch(`${API_BASE_URL}/auth/facebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: facebookAccessToken
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Facebook login successful!')
      console.log('User:', {
        id: data.data.user.id,
        email: data.data.user.email,
        username: data.data.user.username,
        displayName: data.data.user.displayName,
        verified: data.data.user.verified
      })
      console.log('Access Token:', data.data.tokens.accessToken)
      console.log('Refresh Token:', data.data.tokens.refreshToken)
      console.log('Expires In:', data.data.tokens.expiresIn, 'seconds')
    } else {
      console.error('❌ Facebook login failed:', data.error)
      if (data.details) {
        console.error('Validation errors:', data.details)
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

// Test with invalid token
async function testInvalidToken() {
  console.log('\nTesting with invalid token...')
  await testFacebookLogin('invalid_token')
}

// Test with missing token
async function testMissingToken() {
  try {
    console.log('\nTesting with missing token...')
    
    const response = await fetch(`${API_BASE_URL}/auth/facebook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.log('✅ Correctly rejected missing token')
      console.log('Error:', data.error)
    } else {
      console.error('❌ Should have rejected missing token')
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Facebook Login API Tests\n')
  
  // Test with invalid token
  await testInvalidToken()
  
  // Test with missing token
  await testMissingToken()
  
  console.log('\n📝 To test with a valid Facebook token:')
  console.log('1. Get a Facebook access token from Facebook Developer Console')
  console.log('2. Replace "YOUR_FACEBOOK_ACCESS_TOKEN" in the call below')
  console.log('3. Uncomment the following line:')
  console.log('// await testFacebookLogin("YOUR_FACEBOOK_ACCESS_TOKEN")')
  
  // Uncomment this line and replace with a real Facebook access token to test
  // await testFacebookLogin("YOUR_FACEBOOK_ACCESS_TOKEN")
}

// Run the tests
runTests()
