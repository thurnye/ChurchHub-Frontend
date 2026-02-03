# ChurchHub Architecture Documentation

## Overview

ChurchHub follows a feature-based architecture with clear separation of concerns. This document provides an overview of the codebase structure and development patterns.

## Project Structure

```
ChurchHub/
├── app/                    # Expo Router screens and navigation
├── features/              # Feature modules (business logic)
│   ├── bible/
│   ├── sermons/
│   ├── events/
│   └── ...
├── shared/                # Shared utilities and hooks
│   ├── hooks/            # Custom React hooks (useAppDispatch, useAppSelector)
│   ├── stores/           # Centralized Redux store
│   ├── components/       # Reusable UI components
│   └── utils/            # Utility functions
├── core/                  # Core infrastructure
│   ├── services/         # API client, interceptors
│   ├── types/            # API response types
│   └── utils/            # Security, bot detection
├── data/                  # Mock data for development
└── documentation/         # This documentation
```

## Feature Module Structure

Each feature follows a consistent structure:

```
features/{feature-name}/
├── types/                 # TypeScript interfaces
│   └── {feature}.types.ts
├── services/              # Data fetching layer
│   ├── {feature}.api.service.ts      # API calls (Axios)
│   └── {feature}.repository.ts       # Data source abstraction
├── redux/                 # State management
│   └── slices/
│       └── {feature}.slice.ts        # Redux Toolkit slice
├── screens/               # React Native screens
├── components/            # Feature-specific components
└── hooks/                 # Feature-specific hooks
```

## Key Patterns

### 1. **Repository Pattern**
- All data access goes through repositories
- Repositories switch between mock data and API based on `DATA_SOURCE` constant
- Allows seamless transition from development to production

### 2. **Redux Toolkit**
- Centralized state management with `@reduxjs/toolkit`
- Each feature has its own slice
- Typed hooks (`useAppDispatch`, `useAppSelector`) for type safety
- TTL-based caching to reduce unnecessary API calls

### 3. **API Client**
- Centralized Axios instance with interceptors
- Request interceptor for authentication tokens
- Response interceptor for error handling

### 4. **Security First**
- Input sanitization utilities
- Rate limiting helpers
- Bot detection utilities
- Email validation

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npx expo start
   ```

3. **Switch data source**
   Edit `shared/utils/dataSource.ts`:
   ```typescript
   export const DATA_SOURCE: 'mock' | 'api' = 'mock'; // or 'api'
   ```

## Architecture Benefits

- **Scalability**: Easy to add new features following established patterns
- **Maintainability**: Clear separation of concerns
- **Testability**: Pure functions, dependency injection
- **Type Safety**: Full TypeScript coverage
- **Flexibility**: Switch between mock and real API without code changes

## Related Documentation

- [Store Setup Guide](./STORE_SETUP.md)
- [API Services Guide](./API_SERVICES.md)
- [Redux Slices Reference](./REDUX_SLICES.md)
- [Security Practices](./SECURITY.md)
