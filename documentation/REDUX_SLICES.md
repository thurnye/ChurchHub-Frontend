# Redux Slices Reference

## Overview

Every feature in ChurchHub has a Redux slice that manages its state. This document provides a reference for the slice structure and available features.

## Slice Anatomy

Each slice follows this template:

```typescript
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as featureRepo from '../../services/feature.repository';
import type { FeatureState, FeatureItem } from '../../types/feature.types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Initial state
const initialState: FeatureState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
  lastFetchedAt: 0,
};

// Async thunk with caching
export const fetchFeatures = createAsyncThunk(
  'feature/fetchAll',
  async () => featureRepo.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { feature: FeatureState }).feature;
      return !(
        state.status === 'succeeded' &&
        Date.now() - state.lastFetchedAt < CACHE_TTL
      );
    },
  },
);

// Slice definition
const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<FeatureItem | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load items.';
      });
  },
});

export const { setSelected } = featureSlice.actions;
export default featureSlice.reducer;
```

## Available Slices

### Core Features
- **bible** - Bible translations, books, chapters, verses
- **sermons** - Sermon recordings and metadata (end-to-end implementation)

### Content Features
- **events** - Church events and calendar
- **notifications** - App notifications
- **community** - Community programs and outreach
- **groups** - Small groups and ministries
- **prayer** - Prayer requests
- **worship** - Worship resources

### Discovery & Church
- **church** - Church directory and profiles
- **discover** - Discover new churches

### User Features
- **auth** - Authentication state
- **profile** - User profile data
- **give** - Giving history and donations
- **settings** - App settings and preferences

### Media
- **media-player** - Media playback state
- **home** - Home feed items

## State Shape

All slices share a common state structure:

```typescript
interface FeatureState {
  items: FeatureItem[];           // Array of items
  selected: FeatureItem | null;   // Currently selected item
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;            // Error message
  lastFetchedAt: number;           // Cache timestamp (ms)
}
```

## Available Actions

### Async Thunks
- `fetch{Features}()` - Fetch all items (with automatic caching)
- `fetch{Feature}ById(id)` - Fetch single item (when implemented)

### Synchronous Actions
- `setSelected(item)` - Set the currently selected item

## Caching Behavior

### How It Works
1. User dispatches `fetchSermons()`
2. Thunk checks `condition` before executing
3. If cache is fresh (< 5 min old), thunk is **skipped entirely**
4. No pending/fulfilled actions are dispatched
5. Component sees existing cached data immediately

### Benefits
- Reduces unnecessary API calls
- Improves performance
- Reduces server load
- Better offline experience

### Invalidating Cache
To force a fresh fetch, you can:

1. **Wait 5 minutes** - Cache expires automatically
2. **Manually reset timestamp**:
   ```typescript
   // In your slice:
   clearCache(state) {
     state.lastFetchedAt = 0;
   }

   // In your component:
   dispatch(clearCache());
   dispatch(fetchSermons()); // Will execute
   ```

3. **Reset the entire state**:
   ```typescript
   // In your slice:
   reset: () => initialState

   // In your component:
   dispatch(reset());
   dispatch(fetchSermons());
   ```

## Using Slices in Components

### Basic Pattern

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import { fetchSermons, setSelected } from '@/features/sermons/redux/slices/sermons.slice';

function SermonsScreen() {
  const dispatch = useAppDispatch();
  const { items, selected, status, error } = useAppSelector((state) => state.sermons);

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const handleSelect = (sermon) => {
    dispatch(setSelected(sermon));
  };

  // ... render logic
}
```

### Handling All States

```typescript
function SermonsScreen() {
  const { items, status, error } = useAppSelector((state) => state.sermons);

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (status === 'failed') {
    return (
      <View>
        <Text>Error: {error}</Text>
        <Button onPress={() => dispatch(fetchSermons())}>Retry</Button>
      </View>
    );
  }

  if (status === 'succeeded' && items.length === 0) {
    return <Text>No sermons found</Text>;
  }

  return <FlatList data={items} {...props} />;
}
```

## Extending a Slice

### Adding a New Thunk

```typescript
export const searchSermons = createAsyncThunk(
  'sermons/search',
  async (query: string) => sermonsRepo.search(query),
);

// In extraReducers:
.addCase(searchSermons.fulfilled, (state, action) => {
  state.items = action.payload;
  state.status = 'succeeded';
})
```

### Adding a New Action

```typescript
reducers: {
  setSelected(state, action: PayloadAction<SermonItem | null>) {
    state.selected = action.payload;
  },
  clearSelected(state) {
    state.selected = null;
  },
  toggleFavorite(state, action: PayloadAction<string>) {
    const sermon = state.items.find((s) => s.id === action.payload);
    if (sermon) sermon.isFavorite = !sermon.isFavorite;
  },
}
```

## Bible Slice Special Features

The Bible slice has additional complexity due to managing multiple translations and books:

```typescript
interface BibleState {
  bibles: ApiBible[];                  // Available translations
  biblesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  biblesError: string | null;
  selectedBibleId: string;             // Currently selected translation
  booksByBibleId: Record<string, ApiBibleBook[]>;  // Books per translation
  booksStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>;
  booksFilter: string;                 // 'ALL' or specific book ID
  lastFetchedAt: {
    bibles: number;
    books: Record<string, number>;     // Separate cache per translation
  };
}
```

Thunks:
- `loadBibles()` - Fetch all Bible translations
- `loadBooks(bibleId)` - Fetch books for a specific translation

Actions:
- `setSelectedBibleId(id)` - Change active translation
- `setBooksFilter(filter)` - Filter by book ('ALL' or bookId)

## Best Practices

1. **Always handle all states** - idle, loading, succeeded, failed
2. **Use typed selectors** - `useAppSelector((state) => state.feature)`
3. **Dispatch in useEffect** - With proper dependencies
4. **Don't duplicate state** - Use `selected` instead of local state when possible
5. **Keep thunks simple** - Complex logic belongs in repositories
6. **Use proper error messages** - Make them user-friendly
7. **Test cache behavior** - Ensure data refreshes when expected

## Common Patterns

### Pull to Refresh
```typescript
const onRefresh = () => {
  dispatch(clearCache());
  dispatch(fetchSermons());
};
```

### Optimistic Updates
```typescript
const handleToggleFavorite = (id: string) => {
  dispatch(toggleFavorite(id)); // Immediate UI update
  // Optionally sync to server in background
};
```

### Pagination (Future Enhancement)
```typescript
export const fetchMoreSermons = createAsyncThunk(
  'sermons/fetchMore',
  async (page: number) => sermonsRepo.getPage(page),
);

.addCase(fetchMoreSermons.fulfilled, (state, action) => {
  state.items.push(...action.payload);
  state.page = state.page + 1;
})
```
