# Ride Admin API

A RESTful API backend using Node.js and PostgreSQL to support ride management functionality based on the provided Figma design.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Measures](#security-measures)

## Features

- **User Authentication**

  - Registration with OTP verification
  - Login with JWT
  - Password reset
  - Country restriction for users from unauthorized countries

- **Driver Management**

  - Create, read, update, delete drivers
  - Deactivate drivers
  - View driver orders

- **Order Management**

  - Create, read, update, delete orders
  - Filter and search orders
  - Order statistics

- **Dashboard**
  - Summary statistics
  - Monthly and yearly stats
  - Top drivers list

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, Passport.js
- **Validation**: Express Validator
- **Email**: Nodemailer
- **Logging**: Winston
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ride-admin-api.git
   cd ride-admin-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Create the database:

   ```bash
   createdb ride_admin_db
   # Or use your preferred method to create a PostgreSQL database
   ```

5. Run database migrations:

   ```bash
   npm run migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup (Optional)

You can also use Docker for development:

```bash
# Build the Docker image
docker-compose build

# Start the services
docker-compose up
```

## Project Structure

```
ride-admin-app/
├── src/
│   ├── config/                 # Configuration files
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Middleware functions
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   ├── migrations/             # Database migrations
│   └── app.js                  # Express app setup
├── .env.example                # Example environment variables
├── server.js                   # Server entry point
└── README.md                   # Project documentation
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint                  | Description                 | Access        |
| ------ | ------------------------- | --------------------------- | ------------- |
| POST   | /api/auth/register        | Register new user           | Public        |
| POST   | /api/auth/verify-otp      | Verify OTP for registration | Public        |
| POST   | /api/auth/login           | Login user                  | Public        |
| POST   | /api/auth/forgot-password | Request password reset      | Public        |
| POST   | /api/auth/reset-password  | Reset password with OTP     | Public        |
| POST   | /api/auth/refresh-token   | Refresh access token        | Public        |
| POST   | /api/auth/resend-otp      | Resend OTP                  | Public        |
| GET    | /api/auth/me              | Get current user profile    | Authenticated |

### Dashboard Endpoints

| Method | Endpoint                               | Description           | Access        |
| ------ | -------------------------------------- | --------------------- | ------------- |
| GET    | /api/dashboard/summary                 | Get dashboard summary | Authenticated |
| GET    | /api/dashboard/statistics/:month/:year | Get monthly stats     | Authenticated |
| GET    | /api/dashboard/statistics/:year        | Get yearly stats      | Authenticated |
| GET    | /api/dashboard/drivers                 | Get top drivers       | Authenticated |

### Driver Endpoints

| Method | Endpoint                | Description                 | Access        |
| ------ | ----------------------- | --------------------------- | ------------- |
| GET    | /api/drivers            | Get all drivers (paginated) | Authenticated |
| GET    | /api/drivers/:id        | Get driver by ID            | Authenticated |
| POST   | /api/drivers            | Create new driver           | Admin         |
| PUT    | /api/drivers/:id        | Update driver               | Admin         |
| DELETE | /api/drivers/:id        | Delete driver               | Admin         |
| GET    | /api/drivers/:id/orders | Get driver orders           | Authenticated |

### Order Endpoints

| Method | Endpoint          | Description                | Access        |
| ------ | ----------------- | -------------------------- | ------------- |
| GET    | /api/orders       | Get all orders (paginated) | Authenticated |
| GET    | /api/orders/stats | Get order statistics       | Authenticated |
| GET    | /api/orders/:id   | Get order by ID            | Authenticated |
| POST   | /api/orders       | Create new order           | Admin, Driver |
| PUT    | /api/orders/:id   | Update order               | Admin, Driver |
| DELETE | /api/orders/:id   | Delete order               | Admin         |

## Database Schema

### Users Table

- `id` (UUID, PK)
- `email` (STRING, UNIQUE)
- `password` (STRING)
- `fullName` (STRING)
- `phoneNumber` (STRING)
- `profileImage` (STRING)
- `role` (ENUM: 'admin', 'driver', 'user')
- `isEmailVerified` (BOOLEAN)
- `lastLogin` (DATE)
- `countryCode` (STRING)
- `country` (STRING)
- `status` (ENUM: 'active', 'inactive', 'blocked')
- `createdAt` (DATE)
- `updatedAt` (DATE)

### OTP Verifications Table

- `id` (UUID, PK)
- `email` (STRING)
- `otpCode` (STRING)
- `purpose` (ENUM: 'registration', 'password_reset')
- `expiresAt` (DATE)
- `isUsed` (BOOLEAN)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Drivers Table

- `id` (UUID, PK)
- `userId` (UUID, FK)
- `licenseNumber` (STRING)
- `licenseExpiryDate` (DATE)
- `rating` (FLOAT)
- `isActive` (BOOLEAN)
- `totalTrips` (INTEGER)
- `totalEarnings` (DECIMAL)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Orders Table

- `id` (UUID, PK)
- `driverId` (UUID, FK)
- `clientId` (UUID, FK)
- `carComfort` (ENUM: 'basic', 'standard', 'premium', 'luxury')
- `orderedTime` (DATE)
- `startLocation` (STRING)
- `finishLocation` (STRING)
- `income` (DECIMAL)
- `status` (ENUM: 'pending', 'accepted', 'in_progress', 'completed', 'cancelled')
- `distance` (DECIMAL)
- `duration` (INTEGER)
- `rating` (FLOAT)
- `clientComment` (TEXT)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Statistics Table

- `id` (UUID, PK)
- `month` (INTEGER)
- `year` (INTEGER)
- `averageGrade` (FLOAT)
- `examsCount` (INTEGER)
- `totalOrders` (INTEGER)
- `totalEarnings` (DECIMAL)
- `totalProfit` (DECIMAL)
- `createdAt` (DATE)
- `updatedAt` (DATE)

## Authentication

This API uses JWT (JSON Web Token) for authentication:

- Upon successful login, the server issues an access token and a refresh token
- Access tokens expire in 1 hour (configurable)
- Refresh tokens expire in 7 days (configurable)
- Protected routes require a valid access token in the Authorization header
- When access token expires, use the refresh token to get a new one
- OTP (One-Time Password) is used for email verification and password reset

## Security Measures

- Password hashing using bcrypt with strong salt (12 rounds)
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Rate limiting to prevent brute force attacks
- Geolocation-based country restriction
- Secure headers with Helmet
- Environment-based error details (no stack traces in production)
- Strong password policy enforcement

## Testing

Run tests with:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

For production deployment:

1. Configure production environment variables in `.env` file
2. Build the project if necessary
3. Run database migrations
   ```bash
   NODE_ENV=production npm run migrate
   ```
4. Start the server
   ```bash
   NODE_ENV=production npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
