# Security Best Practices

## Overview

ChurchHub implements multiple layers of security to protect user data and prevent common attacks. This document outlines the security utilities and best practices.

## Security Utilities

### Input Sanitization (`core/utils/security.utils.ts`)

#### `sanitizeInput(input: string): string`

Removes potentially dangerous characters from user input:

```typescript
import { sanitizeInput } from '@/core/utils/security.utils';

const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeInput(userInput);
// Result: 'scriptalert("XSS")/script'
```

**When to use:**
- Before displaying user-generated content
- Before sending to API
- Form inputs, comments, chat messages

**Pattern:**
```typescript
const Comment = ({ text }: { text: string }) => {
  const safeText = sanitizeInput(text);
  return <Text>{safeText}</Text>;
};
```

#### `isValidEmail(email: string): boolean`

Validates email format using RFC 5322 standard:

```typescript
import { isValidEmail } from '@/core/utils/security.utils';

const email = 'user@example.com';
if (isValidEmail(email)) {
  // Proceed with submission
} else {
  // Show error
}
```

**When to use:**
- Email input validation
- Before sending verification emails
- User registration forms

#### `isRateLimited(identifier: string, limit: number, windowMs: number): boolean`

Simple in-memory rate limiting:

```typescript
import { isRateLimited } from '@/core/utils/security.utils';

const handleSubmit = () => {
  if (isRateLimited('submit-button', 5, 60000)) {
    Alert.alert('Too many requests. Please wait.');
    return;
  }
  // Proceed with submission
};
```

**Parameters:**
- `identifier` - Unique key for this action (e.g., 'login-attempt')
- `limit` - Max attempts allowed
- `windowMs` - Time window in milliseconds

**Use cases:**
- Login attempts
- Form submissions
- API calls from client

### Bot Detection (`core/utils/botDetection.utils.ts`)

#### `isSuspiciousRequest(userAgent: string, ip: string): boolean`

Detects potentially malicious patterns:

```typescript
import { isSuspiciousRequest } from '@/core/utils/botDetection.utils';

const userAgent = req.headers['user-agent'];
const ip = req.headers['x-forwarded-for'];

if (isSuspiciousRequest(userAgent, ip)) {
  // Log and block request
  return res.status(403).json({ error: 'Forbidden' });
}
```

**Detection criteria:**
- Empty or missing user-agent
- Known bot patterns (curl, wget, python-requests)
- Suspicious IPs (127.0.0.1, localhost, private ranges)

#### `isHoneypotTriggered(honeypotValue: string): boolean`

Honeypot field detection:

```typescript
import { isHoneypotTriggered } from '@/core/utils/botDetection.utils';

// In your form, add a hidden field:
// <TextInput name="website" style={{ display: 'none' }} />

const handleSubmit = (formData) => {
  if (isHoneypotTriggered(formData.website)) {
    // Bot detected, silently reject
    return;
  }
  // Process legitimate submission
};
```

**How it works:**
- Add a hidden field that humans won't fill
- Bots often fill all fields
- If hidden field has value, it's likely a bot

## API Security

### Authentication

Token-based authentication (to be implemented):

```typescript
// In apiClient.service.ts request interceptor
import * as SecureStore from 'expo-secure-store';

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Best practices:**
- Store tokens in `expo-secure-store` (encrypted)
- Never store tokens in AsyncStorage (not encrypted)
- Include token in `Authorization` header
- Refresh tokens before expiry

### Response Handling

Global error handling (to be implemented):

```typescript
// In apiClient.service.ts response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await SecureStore.deleteItemAsync('authToken');
      // Navigate to login screen
      router.replace('/login');
    }
    return Promise.reject(error);
  },
);
```

## Common Attack Vectors & Mitigations

### 1. Cross-Site Scripting (XSS)

**Attack:** Injecting malicious scripts into user-generated content

**Mitigation:**
- Sanitize all user inputs with `sanitizeInput()`
- Never use `dangerouslySetInnerHTML` (web) or similar
- Escape HTML entities

```typescript
// BAD
<Text>{userInput}</Text>

// GOOD
<Text>{sanitizeInput(userInput)}</Text>
```

### 2. SQL Injection

**Attack:** Injecting SQL commands into database queries

**Mitigation:**
- Always use parameterized queries (backend)
- Never concatenate user input into SQL strings
- Validate input types on backend

### 3. Brute Force Attacks

**Attack:** Automated attempts to guess passwords

**Mitigation:**
- Rate limit login attempts with `isRateLimited()`
- Implement CAPTCHA after N failed attempts
- Lock accounts after excessive failures

```typescript
const handleLogin = async (email, password) => {
  if (isRateLimited(`login-${email}`, 5, 300000)) {
    Alert.alert('Too many failed attempts. Try again in 5 minutes.');
    return;
  }
  // Proceed with login
};
```

### 4. Bot Submissions

**Attack:** Automated form submissions (spam, fake accounts)

**Mitigation:**
- Use honeypot fields with `isHoneypotTriggered()`
- Detect suspicious requests with `isSuspiciousRequest()`
- Implement CAPTCHA for sensitive operations

### 5. Man-in-the-Middle (MITM)

**Attack:** Intercepting network traffic to steal data

**Mitigation:**
- Always use HTTPS (enforced by app stores)
- Pin SSL certificates (advanced)
- Never send sensitive data over HTTP

### 6. Insecure Data Storage

**Attack:** Reading sensitive data from device storage

**Mitigation:**
- Use `expo-secure-store` for tokens, passwords
- Never store sensitive data in AsyncStorage
- Clear sensitive data on logout

```typescript
import * as SecureStore from 'expo-secure-store';

// GOOD
await SecureStore.setItemAsync('authToken', token);

// BAD
await AsyncStorage.setItem('authToken', token);
```

## Data Validation

### Client-Side Validation

Always validate before submission:

```typescript
const validateForm = (data) => {
  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email' };
  }
  if (data.password.length < 8) {
    return { valid: false, error: 'Password too short' };
  }
  return { valid: true };
};

const handleSubmit = (data) => {
  const validation = validateForm(data);
  if (!validation.valid) {
    Alert.alert('Error', validation.error);
    return;
  }
  // Submit
};
```

### Backend Validation

**Never trust client-side validation alone**

Backend must re-validate all inputs:
- Type checking
- Length limits
- Format validation
- Business logic rules

## Permissions

### Camera/Microphone Access

```typescript
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();

if (!permission?.granted) {
  await requestPermission();
}
```

### Location Access

```typescript
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permission denied');
  return;
}
```

**Best practices:**
- Request permissions only when needed
- Explain why permission is needed
- Gracefully handle denials

## Checklist for New Features

- [ ] Sanitize all user inputs
- [ ] Validate email format
- [ ] Rate limit sensitive actions
- [ ] Use honeypot for forms
- [ ] Store sensitive data in SecureStore
- [ ] Use HTTPS for all API calls
- [ ] Handle authentication errors (401)
- [ ] Clear sensitive data on logout
- [ ] Request permissions appropriately
- [ ] Validate on both client and server

## Security Audit

Regular security review checklist:

1. **Authentication**
   - Tokens stored securely?
   - Logout clears all tokens?
   - Auto-logout on 401?

2. **Input Validation**
   - All user inputs sanitized?
   - Email validation in place?
   - Form data validated before submission?

3. **Rate Limiting**
   - Login attempts limited?
   - API calls limited?
   - Form submissions limited?

4. **Data Storage**
   - Using SecureStore for sensitive data?
   - AsyncStorage only for non-sensitive data?
   - Data cleared on logout?

5. **Network Security**
   - All API calls use HTTPS?
   - SSL certificate pinning (if needed)?
   - Tokens in Authorization header?

## Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)
- [React Native Security](https://reactnative.dev/docs/security)

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** create a public GitHub issue
2. Email security@churchhub.com with details
3. Allow reasonable time for fix before disclosure
