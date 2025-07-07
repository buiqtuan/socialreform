# Facebook Login API

This API endpoint allows users to log in or register using their Facebook account.

## Endpoint

```
POST /api/auth/facebook
```

## Request Body

```json
{
  "accessToken": "string"
}
```

### Parameters

- `accessToken` (required): A valid Facebook access token obtained from Facebook's SDK

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "displayName": "string",
      "avatar": "string | null",
      "bio": "string | null",
      "verified": boolean,
      "createdAt": "string",
      "updatedAt": "string"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": 900
    }
  }
}
```

### Error Responses

#### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": "Invalid Facebook token"
}
```

#### 400 Bad Request - Invalid Input

```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["accessToken"],
      "message": "Required"
    }
  ]
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

## How it works

1. The API receives a Facebook access token from the client
2. It verifies the token with Facebook's Graph API
3. If valid, it retrieves the user's Facebook profile information
4. It checks if a user with the same email or Facebook ID already exists
5. If the user exists:
   - Updates the existing Facebook social account with the new token
   - Or creates a new Facebook social account for the existing user
6. If the user doesn't exist:
   - Creates a new user account with the Facebook profile information
   - Creates a associated Facebook social account
7. Generates JWT access and refresh tokens
8. Returns the user data and tokens

## Facebook Token Requirements

The Facebook access token must have the following permissions:
- `email` (required)
- `public_profile` (required)

## Security Notes

- The Facebook access token is verified against Facebook's Graph API
- Users created via Facebook login have an empty password field
- Facebook accounts are automatically marked as verified
- The Facebook access token is stored securely for future API calls to Facebook

## Example Usage

```javascript
// Using fetch API
const response = await fetch('/api/auth/facebook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    accessToken: 'FACEBOOK_ACCESS_TOKEN_HERE'
  })
});

const data = await response.json();

if (data.success) {
  // Login successful
  console.log('User:', data.data.user);
  console.log('Access Token:', data.data.tokens.accessToken);
  console.log('Refresh Token:', data.data.tokens.refreshToken);
} else {
  // Login failed
  console.error('Login failed:', data.error);
}
```
