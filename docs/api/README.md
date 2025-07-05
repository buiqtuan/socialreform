# API Documentation

## Authentication

### Register
`POST /api/auth/register`

### Login
`POST /api/auth/login`

### Refresh Token
`POST /api/auth/refresh`

### Logout
`POST /api/auth/logout`

## Posts

### Create Post
`POST /api/posts`

### Get Posts
`GET /api/posts`

### Get Post by ID
`GET /api/posts/:id`

### Update Post
`PUT /api/posts/:id`

### Delete Post
`DELETE /api/posts/:id`

## Social Accounts

### Connect Account
`POST /api/social-accounts/connect`

### Get Accounts
`GET /api/social-accounts`

### Disconnect Account
`DELETE /api/social-accounts/:id`

## Analytics

### Get Dashboard Data
`GET /api/analytics/dashboard`

### Get Post Analytics
`GET /api/posts/:id/analytics`

## Media

### Upload Media
`POST /api/media/upload`

### Get Media
`GET /api/media`

## Notifications

### Get Notifications
`GET /api/notifications`

### Mark as Read
`PUT /api/notifications/:id`

## Teams

### Create Team
`POST /api/teams`

### Get Teams
`GET /api/teams`

### Add Member
`POST /api/teams/:id/members`

## Calendar

### Get Calendar Events
`GET /api/calendar`
