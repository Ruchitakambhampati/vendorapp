# VendorMart - Multilingual B2B Marketplace

## Overview

VendorMart is a comprehensive B2B marketplace application designed to connect street vendors with wholesale suppliers in India. The platform features multilingual support (Hindi, English, Telugu), voice-based ordering capabilities, and a mobile-first design optimized for rural and semi-urban markets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom color variables for brand consistency
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Internationalization**: react-i18next with support for Hindi, English, and Telugu
- **Voice Features**: Web Speech API for voice recognition and speech synthesis

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Database ORM**: Drizzle ORM with Neon PostgreSQL
- **API Design**: RESTful endpoints with JSON responses

### Mobile-First Design
- **Responsive**: Mobile-first responsive design principles
- **PWA Ready**: Service worker configuration for offline capabilities
- **Touch Optimized**: Large touch targets and mobile-friendly interactions
- **Bottom Navigation**: Native mobile app-like navigation pattern

## Key Components

### User Management
- **User Types**: Street vendors and wholesalers with role-based features
- **Authentication**: Username/password authentication with session persistence
- **Document Verification**: Support for Aadhaar, Ration Card, and Voter ID verification
- **Profile Management**: Complete user profiles with business information

### Product Catalog
- **Categories**: Vegetables, fruits, grains, and spices
- **Multilingual**: Product names in Hindi, English, and Telugu
- **Pricing**: Decimal precision pricing with unit specifications
- **Inventory**: Stock tracking and minimum quantity requirements
- **Search**: Text-based and voice search capabilities

### Order Management
- **Cart System**: Session-based cart with quantity management
- **Order Processing**: Multi-stage order workflow (pending → confirmed → ready → completed)
- **Voice Ordering**: Speech-to-text order placement in local languages
- **Order History**: Complete transaction history for vendors

### Voice Interface
- **Speech Recognition**: Multi-language support for voice commands
- **Speech Synthesis**: Audio feedback in user's preferred language
- **Offline Fallback**: Graceful degradation when voice features unavailable
- **Voice Commands**: Predefined product shortcuts for common items

## Data Flow

### Authentication Flow
1. User registration with document verification
2. Session creation with PostgreSQL storage
3. JWT-free session-based authentication
4. Role-based access control for vendor/wholesaler features

### Order Processing Flow
1. Product discovery through category browsing or search
2. Cart management with quantity adjustments
3. Voice or manual order placement
4. Wholesaler order confirmation
5. Status updates through order lifecycle
6. Order completion and history tracking

### Multilingual Content Flow
1. Language selection persisted in localStorage
2. Dynamic content loading based on user preference
3. Fallback to English for missing translations
4. Voice commands processed in selected language

## External Dependencies

### Database & Storage
- **Neon PostgreSQL**: Cloud PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Session Store**: PostgreSQL-backed session persistence

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon library
- **shadcn/ui**: Pre-built component library

### Voice & Internationalization
- **Web Speech API**: Browser-native speech recognition and synthesis
- **react-i18next**: Internationalization framework
- **Local Translation Files**: JSON-based translation storage

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **TypeScript Compilation**: Real-time type checking
- **Environment Variables**: DATABASE_URL and SESSION_SECRET configuration

### Production Build
- **Frontend**: Vite build with optimized bundles
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served through Express static middleware
- **Database Migrations**: Drizzle Kit for schema management

### Environment Configuration
- **Database**: Neon PostgreSQL with connection pooling
- **Sessions**: PostgreSQL-backed session storage
- **Security**: HTTPS enforcement and secure session configuration
- **Monitoring**: Request logging with response time tracking

### Scalability Considerations
- **Database Connection Pooling**: Efficient database resource usage
- **Session Management**: Distributed session storage for horizontal scaling
- **Static Asset Optimization**: Bundled and minified client-side assets
- **API Rate Limiting**: Protection against abuse and overload