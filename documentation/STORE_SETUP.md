# Redux Store Setup Guide

## Overview

ChurchHub uses Redux Toolkit for centralized state management. This guide explains how the store is configured and how to use it in your components.

## Store Configuration

The centralized store is located at `shared/stores/stores.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import bibleReducer from '@/features/bible/redux/slices/bible.slice';
import sermonsReducer from '@/features/sermons/redux/slices/sermons.slice';
// ... other reducers

export const store = configureStore({
  reducer: {
    bible: bibleReducer,
    sermons: sermonsReducer,
    // ... other features
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Provider Setup

The store is provided at the root level in `app/_layout.tsx`:

```typescript
import { Provider } from 'react-redux';
import { store } from '@/shared/stores/stores';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </Provider>
  );
}
```

## Typed Hooks

Use the typed hooks from `shared/hooks/app.hooks.ts` instead of raw Redux hooks:

```typescript
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchSermons } from '@/features/sermons/redux/slices/sermons.slice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.sermons);

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  // ... render logic
}
```

## Benefits of Typed Hooks

- **Autocomplete**: IDE suggests available state properties
- **Type Safety**: Catches type errors at compile time
- **Refactoring**: Rename operations update all references
- **Documentation**: Types serve as inline documentation

## Adding a New Feature to the Store

1. Create the feature slice in `features/{feature}/redux/slices/{feature}.slice.ts`
2. Import the reducer in `shared/stores/stores.ts`
3. Add it to the `reducer` object in `configureStore()`

Example:
```typescript
import newFeatureReducer from '@/features/new-feature/redux/slices/new-feature.slice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    newFeature: newFeatureReducer,
  },
});
```

## State Structure

Each feature state follows this pattern:

```typescript
interface FeatureState {
  items: FeatureItem[];           // Main data array
  selected: FeatureItem | null;   // Currently selected item
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;            // Error message if failed
  lastFetchedAt: number;           // Timestamp for cache invalidation
}
```

## Caching Strategy

All thunks use TTL-based caching (default: 5 minutes):

```typescript
export const fetchSermons = createAsyncThunk(
  'sermons/fetchAll',
  async () => sermonsRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { sermons: SermonsState }).sermons;
      return !(
        state.status === 'succeeded' &&
        Date.now() - state.lastFetchedAt < CACHE_TTL
      );
    },
  },
);
```

If data was fetched less than 5 minutes ago, the thunk is skipped entirely (no pending/fulfilled actions).

## DevTools

Redux DevTools are automatically enabled in development mode. Use the browser extension or React Native Debugger to inspect state and actions.

## Best Practices

1. **Always use typed hooks** (`useAppDispatch`, `useAppSelector`)
2. **Dispatch thunks in useEffect** with proper dependencies
3. **Handle all loading states** (idle, loading, succeeded, failed)
4. **Display errors to users** when status is 'failed'
5. **Avoid direct state mutation** (Redux Toolkit uses Immer internally)
6. **Keep selectors simple** - extract complex logic to separate functions if needed

## Example: Full Component Pattern

```typescript
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchSermons } from '../redux/slices/sermons.slice';

export function SermonsScreen() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.sermons);

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
```
