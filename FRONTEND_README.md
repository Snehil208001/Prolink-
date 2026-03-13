# Prolink Frontend

A modern React/Next.js frontend for the Prolink professional networking platform.

## Features

- **Authentication**: Sign up, login, and secure token-based authentication
- **Feed**: View posts, like, comment, and share updates
- **Profile**: Manage your professional profile
- **Connections**: Build and manage your professional network
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env.local` file with your API configuration:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API base URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Landing page
│   ├── login/       # Login page
│   ├── signup/      # Signup page
│   ├── feed/        # Posts feed
│   ├── profile/     # User profile
│   └── connections/ # Connections page
├── components/      # Reusable components
├── context/         # React context (Auth)
├── utils/          # Utility functions and API client
└── app/
    └── globals.css # Global styles
```

## API Integration

The frontend connects to the Prolink API Gateway running on port 8080.

### Authentication Flow

1. User signs up or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests

### Endpoints Used

- **Auth**: `/users/auth/signup`, `/users/auth/login`, `/users/profile`
- **Posts**: `/posts/core`, `/posts/likes`, `/posts/comments`
- **Connections**: `/connections/core`

## Demo Credentials

```
Email: snehil123@gmail.com
Password: pass
```

## Component Overview

### Header
Navigation component with conditional rendering based on auth state.

### Login/Signup Pages
Forms for user authentication with error handling.

### Feed Page
Displays posts with like/comment/share functionality.

### Profile Page
Shows user profile information and statistics.

### Connections Page
Displays professional network and connection suggestions.

## State Management

- **Auth Context**: Manages user authentication state and operations
- **Local Component State**: Used for form inputs and UI state

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls (default: http://localhost:8080/api/v1)

## Future Enhancements

- Real-time notifications
- Advanced search and filtering
- Recommendation engine
- Direct messaging
- Post analytics
- User recommendations
- Mobile app

## Troubleshooting

### CORS Issues
Ensure your API Gateway is configured to accept requests from `http://localhost:3000`.

### Token Not Persisting
Check that localStorage is enabled in your browser.

### API Connection Errors
Verify the `NEXT_PUBLIC_API_BASE_URL` is correctly set and the backend is running.

## License

Proprietary - Prolink
