# Full-Stack Project

## Overview

This project is a full-stack web application built using Node.js (Express) for the backend and ReactJS for the frontend. The application uses MySQL as the database to manage user data, including login and registration functionality.

## Features

- **User Authentication**: Users can register, log in, and log out securely.
- **Session Management**: JWT tokens are used for managing sessions and ensuring secure access to protected routes.
- **MySQL Database**: All user data is stored securely in a MySQL database.

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MySQL**: Relational database management system.

### Frontend

- **ReactJS**: JavaScript library for building user interfaces.

### Other

- **Redis (TODO)**: In-memory data structure store, used for managing session tokens.
- **JWT**: JSON Web Tokens for secure authentication.
- **Sequelize**: ORM for Node.js for managing database interactions.
- **Nodemon**: Utility that automatically restarts the server when file changes are detected.

## Installation

### Prerequisites

- Node.js (version >= 18.18.x)
- MySQL (version >= 8.x)
- npm or yarn (package managers)

### Backend + Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/thanhuchiha/full-stack.git
   cd backend
   yarn
   yarn watch

   cd frontend
   yarn
   yarn start
   ```
2. List API
  - Register: [POST] /user/auth/sign-up
  - Login: [POST] /user/auth/sign-in
  - Profile: [GET] /user/users/user-information
  - Refresh token: [PUT] /user/auth/refresh-token

3. TODO (Logout feature and token management)
- Use Redis to manage user access tokens and refresh tokens. Tokens are stored with a TTL that matches their expiration time, allowing for secure session handling.
- 3.1. User Login:
Generate access and refresh tokens.
Store them in Redis with TTL matching the tokens' expiration.

- 3.2. API Access Validation:
For protected API calls, check if the access token exists in Redis.
If valid, proceed; if not, return an error: "Token has expired or you have logged out."

- 3.3. User Logout:
On sign-out, delete the access and refresh tokens from Redis.

- 3.4. Token Expiration:
Tokens automatically expire in Redis, preventing reuse of expired tokens.