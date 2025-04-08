# PlotCom: Real Estate Listing Platform

## Architecture & Mental Model

PlotCom is a React Native application built with Expo Router for file-based navigation, Firebase for authentication and data storage, and a clear role-based access system.

## System Overview

### Core Architecture

```
┌─────────────────────────┐                ┌──────────────────────────┐
│                         │                │                          │
│     Authentication      │◄──────────────►│    Firebase Services     │
│     (AuthContext)       │                │  (Auth, Firestore, Storage)│
│                         │                │                          │
└───────────┬─────────────┘                └──────────────────────────┘
            │                                           ▲
            │                                           │
            ▼                                           │
┌─────────────────────────┐                ┌──────────────────────────┐
│                         │                │                          │
│    Role-Based Routing   │◄──────────────►│     Data Management      │
│    (Expo Router)        │                │     (useListing)         │
│                         │                │                          │
└───────────┬─────────────┘                └──────────────────────────┘
            │                                           ▲
            │                                           │
            ▼                                           │
┌─────────────────────────┐                             │
│                         │                             │
│    UI Components        │◄────────────────────────────┘
│    (Cards, Buttons)     │
│                         │
└─────────────────────────┘
```

### User Flow

```
┌────────────┐     ┌────────────┐     ┌────────────────────┐
│            │     │            │     │                    │
│  Sign Up   │────►│  Sign In   │────►│  Role Determination │
│            │     │            │     │                    │
└────────────┘     └────────────┘     └──────────┬─────────┘
                                                 │
                                                 ▼
                   ┌────────────────────────────────────────────────┐
                   │                                                │
                   ▼                                                ▼
        ┌────────────────────┐                         ┌────────────────────┐
        │                    │                         │                    │
        │  Customer Dashboard │                         │  Realtor Dashboard  │
        │                    │                         │                    │
        └──────────┬─────────┘                         └──────────┬─────────┘
                   │                                              │
                   ▼                                              ▼
        ┌────────────────────┐                         ┌────────────────────┐
        │                    │                         │                    │
        │  View All Listings │                         │ View Own Listings  │
        │                    │                         │                    │
        └──────────┬─────────┘                         └──────────┬─────────┘
                   │                                              │
                   ▼                                              │
        ┌────────────────────┐                                    │
        │  Filter & Search   │                                    │
        │                    │                                    │
        └──────────┬─────────┘                                    │
                   │                                              │
                   ▼                                              ▼
        ┌────────────────────┐                         ┌────────────────────┐
        │                    │◄────────────────────────┤                    │
        │ View Listing Detail│                         │ Create/Edit/Delete │
        │                    │                         │                    │
        └────────────────────┘                         └────────────────────┘
```

## Code Organization

```
plotcom/
├── app/                       # Application routes (Expo Router)
│   ├── (app)/                 # Authenticated routes
│   │   ├── realtor/           # Realtor-specific screens
│   │   │   ├── index.js       # Realtor dashboard (own listings)
│   │   │   ├── new-listing.jsx # Create new listing
│   │   │   └── edit/[id].jsx  # Edit existing listing
│   │   ├── regular/           # Customer-specific screens
│   │   │   └── index.js       # Browse all listings
│   │   ├── listing/[id].jsx   # Listing detail (shared)
│   │   ├── profile.jsx        # User profile (shared)
│   │   └── _layout.jsx        # Layout for authenticated routes
│   ├── (auth)/                # Authentication routes
│   │   ├── sign-in.jsx        # Login screen
│   │   ├── sign-up.jsx        # Registration screen
│   │   └── _layout.jsx        # Auth layout
│   ├── _layout.jsx            # Root layout (sets up AuthProvider)
│   └── index.js               # Root redirect
├── components/                # Reusable UI components
│   ├── Card.jsx               # Card container
│   ├── CustomButton.jsx       # Button component
│   ├── CustomInput.jsx        # Input component
│   ├── Header.jsx             # Header component
│   ├── ListingCard.jsx        # Listing card component
│   └── theme.jsx              # Theme constants
├── context/                   # Application context
│   └── AuthContext.jsx        # Authentication state and methods
├── hooks/                     # Custom hooks
│   └── useListing.js          # Listing data fetching logic
└── firebaseConfig.js          # Firebase configuration
```

## Key Components

### Authentication System

The authentication system is built on Firebase Authentication and uses React Context to manage user state throughout the application:

- **AuthProvider**: Manages authentication state and provides methods for sign-in, sign-up, and sign-out
- **Role-based Access**: Users are assigned either 'customer' or 'realtor' roles upon registration
- **Navigation Control**: Redirects users based on authentication status and role

### Data Management

Data is stored in Firebase Firestore and managed through custom hooks:

- **useListing Hook**: Provides filtered, reactive access to listing data
- **Secure Access**: Realtors are restricted to managing only their own listings 
- **Realtime Updates**: Uses Firestore's `onSnapshot` for live data updates
- **Firebase Storage**: Handles image storage for property listings

### Routing and Navigation

Navigation is powered by Expo Router:

- **File-based Routing**: Screens are organized according to their URL path
- **Authenticated Routes**: Protected by authentication checks in layout components
- **Role-specific Routes**: Access to certain screens depends on user role

## Security Model

1. **Authentication Layer**: Firebase Authentication handles user identity
2. **Authorization Layer**: Role-based access to routes and features
3. **Data Access Control**: 
   - Realtor listings are filtered by owner ID
   - Database queries are structured to respect ownership boundaries
   - Firebase security rules (recommended implementation) should enforce these restrictions server-side

## Data Flow

1. **User Authentication**: 
   - User credentials → Firebase Auth → User object with UID
   - User profile document retrieved from Firestore with role information

2. **Listing Management**:
   - Creation: Form data + Image → Firebase Storage → URL → Firestore document
   - Retrieval: Query with appropriate filters → Firestore → Component rendering
   - Updates: Form changes → Firestore document update → Reactive UI update
   - Deletion: Firestore document removal + Storage image deletion

## Future Improvements

1. **Enhanced Error Handling**:
   - Implement comprehensive error tracking and recovery
   - Add offline support with local data persistence

2. **Performance Optimization**:
   - Implement pagination for listing queries
   - Add image caching and optimization

3. **Security Enhancements**:
   - Implement comprehensive Firebase Security Rules
   - Add data validation on both client and server sides

4. **Testing Strategy**:
   - Unit tests for hooks and context
   - Integration tests for screens
   - End-to-end tests for critical user flows

5. **Feature Additions**:
   - User messaging system
   - Property favorites/bookmarking
   - Advanced search with geolocation

## Development Workflow

1. **Feature Development**:
   - Define feature requirements
   - Create necessary components and hooks
   - Implement Firebase integration
   - Add to routing structure
   - Test and review

2. **State Management**:
   - Local state for component-specific data
   - Context for application-wide state
   - Firestore for persistent data

3. **Styling Approach**:
   - Component-specific StyleSheet objects
   - Theme constants for consistent styling
