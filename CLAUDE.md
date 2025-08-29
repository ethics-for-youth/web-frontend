# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server on port 8080
- `npm run preview` - Preview production build locally

### Build Commands  
- `npm run build` - Production build
- `npm run build:dev` - Development mode build
- `npm run build:qa` - QA mode build  
- `npm run build:prod` - Production mode build

### Code Quality
- `npm run lint` - Run ESLint to check for code issues

## Architecture Overview

This is a React + TypeScript web application for the Ethics For Youth (EFY) platform built with Vite, shadcn/ui components, and Tailwind CSS.

### Core Structure

**Frontend Framework**: React 18 with TypeScript, using Vite for build tooling and development server

**UI Components**: shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling

**Routing**: React Router DOM with protected admin routes and public pages

**State Management**: 
- React Context for authentication (`AuthContext`)
- TanStack Query for server state management with 5-minute stale time
- Local component state with React hooks

**API Integration**: Centralized HTTP client using Axios with interceptors for logging and error handling

### Key Directories

- `src/pages/` - Route components (public pages + admin pages in `admin/` subdirectory)
- `src/components/` - Reusable components (UI components in `ui/`, admin components in `admin/`)
- `src/services/` - API service functions for each domain (events, courses, registrations, etc.)
- `src/hooks/` - Custom React hooks for data fetching and business logic
- `src/contexts/` - React Context providers (authentication)
- `src/lib/` - Shared utilities (API client, utility functions)
- `src/config/` - Configuration files (API endpoints, environment variables)

### Authentication & Authorization

Mock authentication system with hardcoded credentials (admin@ethicsforyouth.org / admin123). Admin routes are protected by `ProtectedRoute` component that checks authentication status from `AuthContext`.

### Environment Configuration

Uses environment variables with `VITE_` prefix:
- `VITE_API_BASE_URL` - API base URL (defaults to https://dev.efy.org.in/api)
- `VITE_API_TIMEOUT` - API timeout (defaults to 10000ms)
- `VITE_API_LOGGING` - Enable API logging (set to 'true' for logging)

### Data Flow

1. Pages use custom hooks (e.g., `useEvents`, `useCourses`) for data fetching
2. Hooks use TanStack Query for caching and state management
3. API services handle HTTP requests through centralized `apiClient`
4. Error boundaries wrap critical admin components for graceful error handling

### Path Aliases

Uses `@/` alias for `src/` directory imports configured in both Vite and TypeScript configs.

## Payment Integration (Razorpay)

The application includes Razorpay payment integration for event registrations and other payment needs.

### Key Components
- `PaymentButton` - Reusable payment button component with loading states and error handling
- `EventRegistrationPayment` - Complete event registration flow with payment
- `paymentsApi` - API service for payment order creation

### Environment Variables Required
- `VITE_RAZORPAY_KEY_ID` - Razorpay key ID (test: `rzp_test_*`, live: `rzp_live_*`)

### API Endpoint
- `POST /payments/create-order` - Creates Razorpay order via backend Lambda function

### Testing
- Test page available at `/payment-demo` with mock data and test card numbers
- Use test cards: Success (4111 1111 1111 1111), Failure (4000 0000 0000 0002)

### Payment Flow
1. User clicks payment button
2. Frontend creates order via backend API
3. Razorpay checkout opens with order details
4. User completes payment
5. Backend receives webhook from Razorpay (automatic)
6. Frontend shows success/failure message

**Note**: Frontend does NOT send payment results to backend - this is handled entirely by Razorpay webhooks for security.