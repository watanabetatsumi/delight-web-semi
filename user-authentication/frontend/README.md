# User Authentication Frontend

A modern React/Next.js frontend for the user authentication system with future chat functionality.

## Features

### Current Features
- ✅ User registration and login
- ✅ Cookie-based authentication
- ✅ Responsive design with Tailwind CSS
- ✅ Post creation and management
- ✅ User dashboard
- ✅ Real-time form validation
- ✅ Error handling and loading states
- ✅ TypeScript support

### Coming Soon
- 🚧 Real-time chat functionality
- 🚧 User profiles
- 🚧 Push notifications
- 🚧 File uploads
- 🚧 Advanced search

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 8081

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_APP_NAME=User Authentication App
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components (Navbar, etc.)
│   ├── posts/            # Post-related components
│   └── ui/               # UI components (Button, Input, etc.)
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api.ts            # API client configuration
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validation schemas
└── types/                # TypeScript type definitions
    ├── auth.ts           # Authentication types
    ├── post.ts           # Post types
    └── chat.ts           # Chat types (future)
```

## Key Components

### Authentication
- **AuthContext**: Manages authentication state globally
- **Login/Register Pages**: Form-based authentication with validation
- **Protected Routes**: Automatic redirection for unauthenticated users

### Dashboard
- **Dashboard Page**: Overview with stats and recent posts
- **Posts Page**: Full post management with search and filtering
- **Users Page**: Community member directory (chat preparation)

### UI Components
- **Button**: Consistent button component with variants
- **Input**: Form input with validation support
- **Card**: Flexible card component for content layout
- **LoadingSpinner**: Loading state indicator

## API Integration

The frontend communicates with the Go backend through REST APIs:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/posts` - Get posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: Primary blue theme with gray accents
- **Typography**: Inter font family
- **Components**: Consistent spacing and border radius
- **Responsive**: Mobile-first responsive design
- **Animations**: Subtle fade and slide animations

## Form Validation

Forms use Zod schemas for validation:

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
});
```

## Error Handling

- **API Errors**: Centralized error handling with toast notifications
- **Form Errors**: Field-level validation with error messages
- **Network Errors**: Automatic retry and user feedback
- **Loading States**: Consistent loading indicators

## Future Chat Implementation

The codebase is prepared for chat functionality:

- **Types**: Chat message and user types defined
- **UI**: Chat page placeholder with feature preview
- **Architecture**: WebSocket integration points identified
- **Database**: Chat table schema planned

## Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t user-auth-frontend .

# Run container
docker run -p 3001:3001 user-auth-frontend
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style

- **ESLint**: Code linting with Next.js config
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (recommended)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states for async operations
5. Write responsive, accessible components
6. Test on multiple screen sizes

## Deployment

The application is optimized for deployment with:

- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Optimized bundle size
- **Performance**: Core Web Vitals optimization

## License

This project is part of the user authentication learning module.