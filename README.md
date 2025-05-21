# Watch Dealer Inventory Portal

A comprehensive inventory management system for luxury watch dealers, built with React, TypeScript, and Express.

![Watch Dealer Portal](https://img.shields.io/badge/Watch_Dealer-Portal-gold)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Express](https://img.shields.io/badge/Express-4.0-green)

## Features

- **User Authentication**: Secure login with email/password and Google sign-in
- **Role-Based Access Control**: Admin and dealer-specific views and permissions
- **Inventory Management**: Complete CRUD operations for watch inventory
- **Advanced Filtering**: Filter watches by brand, material, size, and price range
- **Search Functionality**: Quickly find watches by brand, model, or reference
- **Favorites System**: Dealers can save favorite watches for quick access
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Technology Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- TanStack Query for data fetching
- Tailwind CSS with shadcn/ui components
- Wouter for lightweight routing

### Backend
- Express.js
- PostgreSQL with Drizzle ORM
- Firebase Authentication for Google sign-in
- Session-based authentication

## Project Structure

```
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   └── types/       # TypeScript definitions
├── server/            # Backend Express application
│   ├── auth.ts        # Authentication logic
│   ├── routes.ts      # API routes
│   ├── storage.ts     # Database interface
│   └── db.ts          # Database connection
├── shared/            # Shared code between frontend and backend
│   └── schema.ts      # Database schema and types
└── scripts/           # Utility scripts
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/watch-dealer-portal.git
cd watch-dealer-portal
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/watchdealer
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

4. Start the development server
```bash
npm run dev
```

## Deployment

This application can be deployed on various platforms:

- **Replit**: Click the Deploy button in your Replit workspace
- **Vercel/Netlify**: Connect to your GitHub repository
- **Heroku/Railway**: Deploy the full-stack application with PostgreSQL support

## License

[MIT](LICENSE)

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Drizzle ORM](https://orm.drizzle.team/) for database operations
- [Tailwind CSS](https://tailwindcss.com/) for styling