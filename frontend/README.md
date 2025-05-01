# Ride Admin Frontend

A modern React frontend for the Ride Administration application, built with Vite, React, and Tailwind CSS.

## Features

- **Authentication System**: Login, registration, and email verification
- **Dashboard**: Overview of key metrics and recent activity
- **Order Management**: View and manage ride orders
- **Driver Management**: Track driver performance and details
- **Client Management**: Manage customer data and ride history
- **Live Map**: Real-time tracking of drivers and rides
- **Advanced Filtering**: Search and filter data across all sections
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Vite**: Fast build tool and development server
- **React**: UI library for building component-based interfaces
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation
- **Axios**: API client for data fetching
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

## Prerequisites

- Node.js (version 16.x or higher)
- npm or yarn
- Access to the Ride Admin backend API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ride-admin-frontend.git
cd ride-admin-frontend
```

2. Install dependencies:

```bash
npm install
# or with yarn
yarn
```

3. Create a `.env` file in the root directory and add your environment variables:

```
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:

```bash
npm run dev
# or with yarn
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
ride-admin-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── auth/        # Authentication-related components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   └── ui/          # Generic UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Build for Production

To build the application for production:

```bash
npm run build
# or with yarn
yarn build
```

The built files will be in the `dist` directory.

## Deployment

After building the project, you can deploy the `dist` directory to any static file hosting service:

- Vercel
- Netlify
- AWS S3
- GitHub Pages
- Firebase Hosting

## Connecting to the Backend

This frontend is designed to work with the Ride Admin backend API. Make sure to:

1. Update the API URL in the `.env` file to point to your backend server
2. Ensure CORS is properly configured on the backend
3. Test the authentication flow with the backend

## Authentication Flow

1. **Login**: Users enter their email and password to receive an authentication token
2. **Registration**: New users register with email and password
3. **Email Verification**: After registration, users receive an OTP (One-Time Password) to verify their email
4. **Token Storage**: Authentication tokens are stored in localStorage
5. **Protected Routes**: Private routes require authentication

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
