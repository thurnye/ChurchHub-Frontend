# Authentication Feature

Complete authentication system with login, signup, logout, password reset, and user management.

## Features

- ✅ User Login
- ✅ User Signup
- ✅ User Logout
- ✅ Get Current User
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Automatic token refresh
- ✅ Secure token storage (access token in memory, refresh token in SecureStore)
- ✅ Mock mode for development/testing

## Usage

### Using the `useAuth` Hook (Recommended)

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    getCurrentUser,
    requestPasswordReset,
    resetUserPassword,
    clearAuthError,
  } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: 'user@example.com',
      password: 'password123',
    });

    if (success) {
      console.log('Login successful!', user);
    } else {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Welcome, {user?.name}!</Text>
          <Button onPress={logout}>Logout</Button>
        </>
      ) : (
        <Button onPress={handleLogin}>Login</Button>
      )}
    </View>
  );
}
```

### Direct Redux Usage

```tsx
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import {
  loginUser,
  signupUser,
  logoutUser,
  fetchCurrentUser,
  forgotPassword,
  resetPassword,
} from '@/features/auth';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, status, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async () => {
    await dispatch(loginUser({
      email: 'user@example.com',
      password: 'password123',
    }));
  };

  // ... rest of component
}
```

## API Endpoints

All endpoints are prefixed with `/auth`:

- `POST /auth/login` - Login with email and password
- `POST /auth/signup` - Create new user account
- `POST /auth/logout` - Logout current user
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/me` - Get current authenticated user
- `POST /auth/refresh` - Refresh access token (called automatically)

## State Shape

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
}
```

## Token Management

- **Access Token**: Stored in memory for security
- **Refresh Token**: Stored in Expo SecureStore
- **Automatic Refresh**: When API returns 401, automatically refreshes token
- **Token Expiry Handling**: Queues failed requests during refresh

## Mock Mode

When `DATA_SOURCE = 'mock'` in `shared/utils/dataSource.ts`:

- All auth operations work with mock data
- Simulates API delays (500ms)
- Mock user is returned for all successful operations
- No actual API calls are made

## Security Features

1. **Access token** never persisted to disk
2. **Refresh token** stored in SecureStore (encrypted storage)
3. Automatic token refresh on 401 responses
4. Request queuing during token refresh
5. Automatic logout on refresh failure
6. Bearer token authorization headers

## Error Handling

All auth actions use `rejectWithValue` for consistent error handling:

```tsx
try {
  await dispatch(loginUser(credentials));
} catch (error) {
  // Error is available in state.auth.error
  console.error(error);
}
```

## Integration with API Client

The auth system integrates with `core/services/apiClient.service.ts`:

- Automatically attaches access token to all requests
- Handles 401 responses with token refresh
- Triggers logout on refresh failure

## Examples

### Login Flow

```tsx
const { login, isLoading, error } = useAuth();

const handleSubmit = async (email: string, password: string) => {
  const success = await login({ email, password });

  if (success) {
    router.push('/home');
  }
};
```

### Signup Flow

```tsx
const { signup, isLoading, error } = useAuth();

const handleSubmit = async (data: SignupCredentials) => {
  const success = await signup(data);

  if (success) {
    router.push('/home');
  }
};
```

### Password Reset Flow

```tsx
const { requestPasswordReset, resetUserPassword } = useAuth();

// Step 1: Request reset email
const handleForgotPassword = async (email: string) => {
  const success = await requestPasswordReset({ email });

  if (success) {
    alert('Check your email for reset instructions');
  }
};

// Step 2: Reset with token from email
const handleResetPassword = async (token: string, newPassword: string) => {
  const success = await resetUserPassword({ token, newPassword });

  if (success) {
    router.push('/login');
  }
};
```

### Check Authentication on App Start

```tsx
// In your root layout or App.tsx
useEffect(() => {
  const checkAuth = async () => {
    const token = tokenManager.getAccessToken();

    if (token) {
      await dispatch(fetchCurrentUser());
    }
  };

  checkAuth();
}, []);
```

## Testing

Mock credentials for testing:
- Email: any valid email
- Password: any non-empty password

Mock user returned:
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  "createdAt": "2024-01-01T00:00:00Z"
}
```
