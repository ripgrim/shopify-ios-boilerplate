# Customer Account API Setup Guide

## Overview

This React Native app now includes a complete Customer Account API implementation with OAuth 2.0 authentication, secure token storage, and customer data management.

## 🔑 Key Features

- **OAuth 2.0 + PKCE**: Secure authentication flow for mobile apps
- **Biometric Authentication**: Face ID/Touch ID support
- **Automatic Token Refresh**: Seamless token management
- **Customer Data Management**: Profile, orders, addresses
- **Protected Routes**: Authentication-gated screens
- **Secure Storage**: Expo SecureStore for token storage

## 🛠 Configuration

### 1. Environment Variables

The following environment variables are configured in `app.json`:

```json
{
  "extra": {
    "shopifyCustomerAccountClientId": "a8b58ec9-396f-460e-927c-8699d78725dc",
    "shopifyShopId": "60857843806",
    "shopifyAuthorizationUrl": "https://shopify.com/authentication/60857843806/oauth/authorize",
    "shopifyTokenUrl": "https://shopify.com/authentication/60857843806/oauth/token",
    "shopifyLogoutUrl": "https://shopify.com/authentication/60857843806/logout",
    "shopifyCallbackUrl": "shop.60857843806.app://callback"
  }
}
```

### 2. URL Scheme

The app uses the custom URL scheme `shop.60857843806.app` for OAuth callbacks:

```json
{
  "scheme": "shop.60857843806.app"
}
```

### 3. Dependencies

The following packages were added for Customer Account API support:

```bash
bun add expo-auth-session expo-secure-store expo-crypto expo-local-authentication
```

## 🏗 Architecture

### Core Services

1. **CustomerAccountAuth Service** (`services/customerAccountAuth.ts`)
   - OAuth 2.0 + PKCE implementation
   - Token management and refresh
   - Biometric authentication support

2. **CustomerAccountAPI Client** (`services/customerAccountApi.ts`)
   - GraphQL client with automatic token refresh
   - Pre-defined queries and mutations
   - Error handling and retry logic

3. **Auth Store** (`stores/authStore.ts`)
   - Zustand store for authentication state
   - Automatic token refresh intervals
   - User session management

### React Query Hooks

4. **Customer Account Hooks** (`hooks/useCustomerAccount.ts`)
   - `useCustomer()` - Customer profile data
   - `useCustomerOrders()` - Order history
   - `useCustomerAddresses()` - Address management
   - `useAuth()` - Authentication actions

### Components

5. **Authentication Components**
   - `AuthProvider` - App-wide auth state initialization
   - `LoginScreen` - OAuth login with biometric support
   - `ProtectedRoute` - Route protection wrapper

6. **Customer Components**
   - `CustomerProfile` - Account management screen
   - `CustomerOrders` - Order history display

## 📱 Usage

### Authentication Flow

1. User taps "Sign In with Shopify"
2. App redirects to Shopify OAuth authorization
3. User authenticates with Shopify
4. App receives authorization code via callback
5. App exchanges code for access/refresh tokens
6. Tokens are securely stored using Expo SecureStore

### Protected Routes

Wrap screens with `ProtectedRoute` to require authentication:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AccountScreen() {
  return (
    <ProtectedRoute>
      <CustomerProfile />
    </ProtectedRoute>
  );
}
```

### Customer Data

Use React Query hooks to fetch customer data:

```tsx
import { useCustomer, useCustomerOrders } from '@/hooks/useCustomerAccount';

export default function CustomerProfile() {
  const { data: customer, isLoading } = useCustomer();
  const { data: orders } = useCustomerOrders();
  
  // Component logic
}
```

### Authentication Actions

Access authentication methods through the auth hook:

```tsx
import { useAuth } from '@/hooks/useCustomerAccount';

export default function LoginButton() {
  const { login, logout, isAuthenticated } = useAuth();
  
  return (
    <button onClick={isAuthenticated ? logout : login}>
      {isAuthenticated ? 'Sign Out' : 'Sign In'}
    </button>
  );
}
```

## 🔐 Security Features

### Token Management
- Access tokens automatically refresh before expiration
- Refresh tokens stored securely using Expo SecureStore
- Failed refresh attempts trigger re-authentication

### Biometric Authentication
- Face ID/Touch ID support for quick access
- Fallback to device PIN/password
- Optional biometric prompt for sensitive operations

### PKCE Implementation
- Proof Key for Code Exchange for enhanced security
- Code verifier generation using crypto-secure random values
- Base64URL encoding for mobile compatibility

## 🚀 Development

### Testing Authentication

Since the Customer Account API doesn't support localhost, use a development build:

```bash
# Create development build
bun run ios
# or
bun run android
```

### Debugging

Enable debug logging by setting:

```typescript
// In your development environment
console.log('Auth debug:', { tokens, isAuthenticated, error });
```

## 📋 API Endpoints

### GraphQL Queries Available

- `CUSTOMER_QUERY` - Customer profile
- `CUSTOMER_ADDRESSES_QUERY` - Customer addresses
- `CUSTOMER_ORDERS_QUERY` - Order history

### Mutations Available

- `UPDATE_CUSTOMER_MUTATION` - Update profile
- `CREATE_ADDRESS_MUTATION` - Add new address
- `UPDATE_ADDRESS_MUTATION` - Update existing address
- `DELETE_ADDRESS_MUTATION` - Remove address

## 🔧 Troubleshooting

### Common Issues

1. **OAuth callback not working**
   - Verify URL scheme matches Shopify configuration
   - Check app.json scheme setting
   - Ensure callback URL is registered in Shopify

2. **Token refresh failing**
   - Check network connectivity
   - Verify Shopify API endpoints are accessible
   - Clear stored tokens and re-authenticate

3. **Biometric authentication unavailable**
   - Ensure device has biometric hardware
   - Check device has enrolled biometric data
   - Verify app has biometric permissions

### Debug Commands

```bash
# Clear app data (including tokens)
bun run ios --clear-cache

# View app logs
bun run ios --verbose
```

## 📚 Resources

- [Shopify Customer Account API Documentation](https://shopify.dev/docs/api/customer)
- [OAuth 2.0 + PKCE Specification](https://tools.ietf.org/html/rfc7636)
- [Expo Auth Session Guide](https://docs.expo.dev/guides/authentication/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🔄 Migration from WebView

The app previously used a WebView for customer accounts. The new implementation provides:

- **Better Performance**: Native authentication flow
- **Enhanced Security**: OAuth 2.0 + PKCE vs session cookies
- **Offline Support**: Cached customer data
- **Better UX**: Native UI components
- **Biometric Support**: Face ID/Touch ID integration 