# API Services Guide

## Overview

ChurchHub uses a layered architecture for data fetching:
1. **API Service** - Makes HTTP calls using Axios
2. **Repository** - Abstracts data source (mock vs API)
3. **Redux Thunk** - Dispatches repository calls

## Architecture Layers

### Layer 1: API Service (`*.api.service.ts`)

Direct Axios calls to backend endpoints:

```typescript
import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse, PaginatedResponse } from '@/core/types/api.types';
import type { SermonItem } from '../types/sermon.types';

export async function fetchSermons(): Promise<SermonItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<SermonItem>>('/sermons');
  return data.data;
}

export async function fetchSermonById(id: string): Promise<SermonItem> {
  const { data } = await apiClient.get<ApiResponse<SermonItem>>(`/sermons/${id}`);
  return data.data;
}
```

**Responsibilities:**
- Make HTTP requests
- Parse response data
- Throw errors on failure (Axios handles this)

### Layer 2: Repository (`*.repository.ts`)

Switches between mock data and API based on configuration:

```typescript
import { DATA_SOURCE } from '@/shared/utils/dataSource';
import { sermons } from '@/data/mockData';
import type { SermonItem } from '../types/sermon.types';
import * as sermonsApi from './sermons.api.service';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getAll(): Promise<SermonItem[]> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermons();
  return delay(sermons);
}

export async function getById(id: string): Promise<SermonItem | null> {
  if (DATA_SOURCE === 'api') return sermonsApi.fetchSermonById(id);
  return delay(sermons.find((s) => s.id === id) ?? null);
}
```

**Responsibilities:**
- Abstract data source
- Simulate network delay for mock data
- Provide consistent interface regardless of source

### Layer 3: Redux Thunk

Calls repository methods and updates state:

```typescript
export const fetchSermons = createAsyncThunk(
  'sermons/fetchAll',
  async () => sermonsRepo.getAll(),
  // ... caching logic
);
```

## API Client Configuration

The centralized Axios instance is in `core/services/apiClient.service.ts`:

```typescript
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://api.churchhub.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token
    // const token = await SecureStore.getItemAsync('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401 errors (logout user)
    // if (error.response?.status === 401) { /* logout */ }
    return Promise.reject(error);
  },
);

export default apiClient;
```

## API Response Types

Standard response interfaces in `core/types/api.types.ts`:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
```

## Switching Data Sources

Edit `shared/utils/dataSource.ts`:

```typescript
export const DATA_SOURCE: 'mock' | 'api' = 'mock'; // Change to 'api' for production
```

## Adding a New API Endpoint

1. **Define types** in `features/{feature}/types/{feature}.types.ts`
2. **Create API service** in `features/{feature}/services/{feature}.api.service.ts`
3. **Create repository** in `features/{feature}/services/{feature}.repository.ts`
4. **Create Redux slice** in `features/{feature}/redux/slices/{feature}.slice.ts`

Example for a new "Devotionals" feature:

```typescript
// types/devotionals.types.ts
export interface DevotionalItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

// services/devotionals.api.service.ts
export async function fetchDevotionals(): Promise<DevotionalItem[]> {
  const { data } = await apiClient.get<PaginatedResponse<DevotionalItem>>('/devotionals');
  return data.data;
}

// services/devotionals.repository.ts
export async function getAll(): Promise<DevotionalItem[]> {
  if (DATA_SOURCE === 'api') return devotionalsApi.fetchDevotionals();
  return delay(devotionals); // from mockData
}
```

## Error Handling

API errors are automatically caught by Redux Toolkit:

```typescript
.addCase(fetchSermons.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message ?? 'Failed to load sermons.';
});
```

Display errors in your components:

```typescript
if (status === 'failed') {
  return (
    <View>
      <Text>{error}</Text>
      <Button onPress={() => dispatch(fetchSermons())}>Retry</Button>
    </View>
  );
}
```

## Best Practices

1. **Always type API responses** - Use `ApiResponse<T>` or `PaginatedResponse<T>`
2. **Use the repository layer** - Never call API services directly from components
3. **Simulate delays for mock data** - Makes development more realistic
4. **Handle loading states** - Show spinners while fetching
5. **Provide retry mechanisms** - Let users retry failed requests
6. **Log errors in production** - Use error tracking service (Sentry, etc.)

## Environment Variables

Configure API URL in `app.config.ts`:

```typescript
export default {
  extra: {
    apiUrl: process.env.API_URL ?? 'https://api.churchhub.com',
  },
};
```

Access via Constants:
```typescript
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```
