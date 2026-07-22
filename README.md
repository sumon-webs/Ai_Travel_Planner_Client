# AI Travel Planner

A modern, full-stack AI-powered travel planning application featuring intelligent itinerary generation, real-time chat assistance, and a beautiful glass-morphism UI.

## 🌟 Features

### Core Features
- **AI-Powered Trip Generation** - Generate personalized travel itineraries using Google Gemini AI
- **Real-Time Chat Assistant** - Context-aware AI chat for trip modifications and travel advice
- **Glass-Morphism UI** - Beautiful, modern interface with glass effects and smooth animations
- **Authentication** - Secure authentication with Better-Auth (email/password + Google OAuth)
- **Trip Management** - Save, view, edit, and manage your generated trips
- **Destination Exploration** - Browse trending destinations and travel statistics
- **Favorites System** - Save favorite destinations for quick access
- **Responsive Design** - Fully responsive layout optimized for all devices

### Technical Features
- **Cross-Origin Authentication** - Secure cookie-based auth across domains
- **Real-Time Data Fetching** - Optimized with TanStack Query
- **Form Validation** - Robust validation using Zod and React Hook Form
- **MongoDB Integration** - Scalable NoSQL database for data persistence
- **RESTful API** - Well-structured backend API with Express.js

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │ Components   │  │   State      │      │
│  │  (App Router)│  │  (Reusable)  │  │  (TanStack)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS + CORS
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Routes │  │  Middleware  │  │  Better Auth │      │
│  │  (RESTful)   │  │  (CORS/Auth) │  │  (OAuth/Session)│    │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │    Trips     │  │  Chat History│      │
│  │  (Sessions)  │  │  (Itineraries)│  │  (Context)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API
                            │
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Google Gemini│  │  Google OAuth│  │   Render     │      │
│  │     AI       │  │   Provider   │  │  (Hosting)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **HeroUI** - Modern React component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Better-Auth** - Authentication client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Better-Auth** - Authentication library with MongoDB adapter
- **Google Gemini AI** - AI model for trip generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account (for OAuth and Gemini AI)
- GitHub account (for deployment)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AiTravelPlanner
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Configure backend environment variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ai-travel

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:5000/api/auth
CLIENT_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env.local
```

Configure frontend environment variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000/api/auth
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
AiTravelPlanner/
├── client/                    # Frontend (Next.js)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── (main)/     # Main app routes
│   │   │   │   ├── page.tsx
│   │   │   │   ├── plan-trip/
│   │   │   │   ├── trips/
│   │   │   │   ├── items/
│   │   │   │   └── profile/
│   │   │   ├── login/      # Login page
│   │   │   ├── signup/     # Signup page
│   │   │   └── layout.tsx  # Root layout
│   │   ├── components/     # Reusable components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── home/       # Home page components
│   │   │   ├── plan-trip/  # Trip planning components
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── lib/           # Utility libraries
│   │       └── auth-client.ts
│   ├── .env.example
│   ├── .env.local
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── server/                   # Backend (Express.js)
    ├── src/
    │   ├── config/         # Configuration files
    │   │   ├── db.ts      # Database connection
    │   │   └── collections.ts # MongoDB collections
    │   ├── lib/            # Core libraries
    │   │   └── auth.ts    # Better Auth configuration
    │   ├── middlewares/    # Express middleware
    │   │   └── auth.ts    # Authentication middleware
    │   ├── routes/         # API routes
    │   │   ├── tripRoutes.ts
    │   │   ├── aiRoutes.ts
    │   │   ├── chatRoutes.ts
    │   │   ├── destinationRoutes.ts
    │   │   └── feedbackRoutes.ts
    │   ├── services/       # Business logic
    │   │   └── geminiService.ts
    │   ├── app.ts         # Express app configuration
    │   └── server.ts      # Server entry point
    ├── dist/              # Compiled JavaScript
    ├── .env.example
    ├── .env
    ├── render.yaml        # Render deployment config
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - Email/password signup
- `GET /api/auth/sign-in/social` - Initiate OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### AI Services
- `POST /api/ai/generate-trip` - Generate AI trip itinerary
- `POST /api/ai/chat` - AI chat with trip context

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/trending` - Get trending destinations
- `GET /api/destinations/:id` - Get destination by ID

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Feedback
- `POST /api/feedback` - Submit feedback

## 🗄️ Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Session Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  expiresAt: Date,
  ipAddress: string,
  userAgent: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Account Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  accountId: string,
  providerId: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Trip Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  destination: string,
  duration: number,
  budget: number,
  travelers: number,
  interests: string[],
  itinerary: {
    days: [{
      day: number,
      activities: [{
        time: string,
        activity: string,
        location: string,
        cost: number
      }]
    }]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Chat History Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  tripId: ObjectId,
  messages: [{
    role: 'user' | 'assistant',
    content: string,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

### Email/Password Login
1. User enters email and password
2. Frontend sends POST request to `/api/auth/sign-in/email`
3. Better Auth validates credentials
4. Server sets session cookie with `SameSite=None`, `Secure=true`, `Partitioned`
5. Frontend receives response and redirects to home
6. Subsequent requests include session cookie automatically

### Google OAuth
1. User clicks "Continue with Google"
2. Frontend calls `signIn.social({ provider: 'google', callbackURL })`
3. Better Auth generates OAuth state and sets state cookie
4. User is redirected to Google consent screen
5. User approves and Google redirects to callback URL
6. Better Auth validates state from cookie
7. Server creates session and sets session cookie
8. User is redirected to frontend callback URL
9. Frontend handles redirect and user is logged in

### Session Management
- Sessions stored in MongoDB
- Cookie-based authentication with secure attributes
- Session expires after 30 days
- Automatic session refresh on activity

## 🤖 AI Integration

### Trip Generation
- Uses Google Gemini AI for intelligent itinerary generation
- Structured JSON output with detailed trip information
- Budget-aware recommendations
- Personalized based on user preferences and interests
- Multi-day itinerary with time-based activities

### Chat Assistant
- Context-aware chat with full trip context
- Real-time streaming responses
- Conversation history persistence in MongoDB
- Suggestions for common queries
- Ability to modify existing trips through chat

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-backend-url.com/api/auth
   ```
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Import project in [Render](https://render.com)
3. Configure environment variables:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   BETTER_AUTH_SECRET=your-production-secret
   BETTER_AUTH_URL=https://your-backend-url.com/api/auth
   CLIENT_URL=https://your-frontend-url.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configure IP whitelist (0.0.0.0/0 for Render)
3. Create database user
4. Get connection string
5. Add to environment variables

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-frontend-url.com` (production)
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/callback/google` (development)
   - `https://your-backend-url.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret to environment variables

## 📜 Available Scripts

### Frontend
```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Development server with auto-reload
npm run build        # Compile TypeScript
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🎨 Key Components

### Frontend Components
- **AuthForm** - Login/signup form with validation
- **GoogleButton** - Google OAuth integration
- **TripPlannerForm** - Multi-section trip planning form
- **PlanTripChat** - Real-time AI chat interface
- **Hero** - Animated hero section
- **TrendingDestinations** - Destination grid
- **Glass Components** - Glass-morphism UI elements

### Backend Components
- **Better Auth Configuration** - Authentication setup with MongoDB
- **API Routes** - RESTful endpoints for all features
- **Gemini Service** - AI integration for trip generation
- **Middleware** - CORS, authentication, error handling
- **Database Models** - MongoDB schemas and indexes

## 🔒 Security Features

- **Secure Cookies** - HttpOnly, Secure, SameSite=None, Partitioned
- **CORS Configuration** - Explicit allowed origins with credentials
- **Input Validation** - Zod schemas for all inputs
- **Session Management** - Secure session handling with expiration
- **OAuth State Validation** - Prevents CSRF attacks
- **Environment Variables** - Sensitive data in environment files
- **MongoDB Authentication** - Database access with credentials

## 🐛 Troubleshooting

### Common Issues

**OAuth State Mismatch**
- Ensure state cookie attributes are correctly configured
- Check that cookies are being sent in callback requests
- Verify trustedOrigins includes frontend URL
- Check that SameSite=None and Secure=true are set

**CORS Errors**
- Verify frontend URL is in allowedOrigins
- Check that credentials: true is set in CORS config
- Ensure backend is accessible from frontend domain

**Session Not Persisting**
- Check cookie attributes (SameSite, Secure, Domain)
- Verify browser is accepting cookies
- Check that session cookie is being set correctly
- Ensure MongoDB session collection is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Express.js](https://expressjs.com) - Web framework
- [MongoDB](https://www.mongodb.com) - NoSQL database
- [Google Gemini AI](https://ai.google.dev) - AI model for trip generation
- [Better-Auth](https://www.better-auth.com) - Authentication library
- [HeroUI](https://heroui.com) - UI component library
- [TailwindCSS](https://tailwindcss.com) - CSS framework
- [Vercel](https://vercel.com) - Frontend hosting
- [Render](https://render.com) - Backend hosting
