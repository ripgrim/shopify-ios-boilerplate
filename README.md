# Shopify iOS Boilerplate

React Native app with Expo Router integrating Shopify Customer Account API and Sanity CMS.

## Tech Stack

- React Native with Expo Router
- TypeScript
- Bun package manager
- NativeWind (Tailwind CSS)
- Zustand for state management
- React Query for data fetching
- Sanity CMS for content management
- Shopify Customer Account API + Storefront API

## Project Structure

```
app/
├── api/                    # Server-side API routes
│   └── sanity/            # Sanity data endpoints
├── (tabs)/                # Tab navigation screens
├── product/[handle].tsx   # Product detail page
└── _layout.tsx           # Root layout

components/
├── auth/                  # Authentication components
├── customer/             # Customer account components
├── modules/              # Sanity CMS modules
└── ui/                   # Reusable UI components

lib/
├── server/               # Server-side utilities
└── sanityImage.ts        # Image URL helper

services/
├── customerAccountApi.ts # Customer Account API client
├── customerAccountAuth.ts # OAuth authentication
└── shopify.ts           # Storefront API client

hooks/
├── useSanityData.ts     # Sanity data hooks
├── useShopifyData.ts    # Shopify data hooks
└── useCustomerAccount.ts # Customer auth hooks

stores/
└── authStore.ts         # Authentication state

types/
├── sanity.ts            # Sanity type definitions
├── shopify.ts           # Shopify type definitions
└── customerAccount.ts   # Customer Account types
```

## API Routes

Server-side API routes for secure Sanity data fetching:

- `GET /api/sanity/home` - Homepage data
- `GET /api/sanity/settings` - Site settings and navigation
- `GET /api/sanity/products?limit=20` - Products with pagination
- `GET /api/sanity/collections?limit=20` - Collections with pagination
- `GET /api/sanity/page/[slug]` - Dynamic page content

## Environment Setup

Create `.env` file in project root:

```bash
# Shopify Configuration (all public)
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_URL=https://your-store.myshopify.com/account
EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your-client-id
EXPO_PUBLIC_SHOPIFY_SHOP_ID=your-shop-id
EXPO_PUBLIC_SHOPIFY_AUTHORIZATION_URL=https://shopify.com/authentication/SHOP_ID/oauth/authorize
EXPO_PUBLIC_SHOPIFY_TOKEN_URL=https://shopify.com/authentication/SHOP_ID/oauth/token
EXPO_PUBLIC_SHOPIFY_LOGOUT_URL=https://shopify.com/authentication/SHOP_ID/logout
EXPO_PUBLIC_SHOPIFY_CALLBACK_URL=shop.SHOP_ID.app://callback

# Sanity Configuration
EXPO_PUBLIC_SANITY_PROJECT_ID=your-project-id
EXPO_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your-sanity-token-with-write-access

# App Configuration
EXPO_PUBLIC_APP_ENV=development
```

## Shopify Setup

### 1. Customer Account API Setup

1. Go to Shopify Admin → Settings → Customer accounts
2. Enable customer accounts
3. Go to Settings → Apps and sales channels → Develop apps
4. Create new app or select existing app
5. Configure Customer Account API:
   - Client type: Public
   - Application type: Mobile
   - Callback URI: `shop.YOUR_SHOP_ID.app://callback`
   - Enable all customer account scopes

### 2. Storefront API Setup

1. In your Shopify app settings
2. Enable Storefront API access
3. Generate Storefront access token
4. Enable required permissions (products, collections, etc.)

## Sanity Setup

### 1. Create Sanity Project

```bash
npm create sanity@latest
cd your-sanity-project
```

### 2. Install Shopify Connect App

1. Go to https://www.sanity.io/shopify
2. Install the Shopify Connect app to your Sanity project
3. Connect your Shopify store
4. Configure sync settings (products, collections, etc.)

### 3. Sanity Studio Configuration

Install required schemas in your Sanity studio:

```javascript
// schemas/index.js
import {shopifyProduct, shopifyProductVariant, shopifyCollection} from '@sanity/shopify'

export const schemaTypes = [
  // Shopify schemas
  shopifyProduct,
  shopifyProductVariant, 
  shopifyCollection,
  
  // Content schemas
  {
    name: 'home',
    type: 'document',
    title: 'Home Page',
    fields: [
      {
        name: 'hero',
        type: 'object',
        fields: [
          {name: 'title', type: 'string'},
          {name: 'description', type: 'text'},
          {name: 'image', type: 'image'},
          {
            name: 'cta',
            type: 'object',
            fields: [
              {name: 'title', type: 'string'},
              {name: 'url', type: 'string'}
            ]
          }
        ]
      },
      {
        name: 'modules',
        type: 'array',
        of: [
          {type: 'products'},
          {type: 'imageWithProductHotspots'},
          {type: 'callout'},
          {type: 'accordion'},
          {type: 'grid'},
          {type: 'images'},
          {type: 'instagram'}
        ]
      }
    ]
  },
  
  {
    name: 'settings',
    type: 'document',
    title: 'Settings',
    fields: [
      {
        name: 'menu',
        type: 'object',
        fields: [
          {
            name: 'links',
            type: 'array',
            of: [
              {type: 'linkInternal'},
              {type: 'linkExternal'}
            ]
          }
        ]
      }
    ]
  }
]
```

### 4. Sync Products from Shopify

1. In Sanity Studio, go to Shopify Connect
2. Run initial sync to import products/collections
3. Set up webhooks for automatic syncing
4. Configure which data to sync (products, variants, collections)

### 5. Generate Sanity Token

1. Go to sanity.io/manage → your project → API
2. Create new token with Editor permissions
3. Add token to `.env` as `SANITY_TOKEN`

## Getting Started

1. Clone repository
2. Install dependencies: `bun install`
3. Create `.env` file with configuration
4. Start development server: `bun start`
5. Run on iOS: `bun run ios`

## Development Server

The app includes server-side API routes that require ngrok for Customer Account API testing:

1. Install ngrok: `brew install ngrok`
2. Run ngrok: `ngrok http 8081`
3. Update Shopify app callback URL with ngrok URL
4. Add ngrok URL to `.env` as `EXPO_PUBLIC_NGROK_URL`

## Customer Account API Flow

1. User taps login
2. OAuth flow redirects to Shopify
3. User authenticates with Shopify
4. App receives authorization code via deep link
5. Exchange code for access token
6. Store token securely with Expo SecureStore
7. Use token for authenticated GraphQL requests

## Security Features

- SANITY_TOKEN only accessible server-side
- Client environment validation with Zod
- Server environment validation for API routes
- Secure token storage with Expo SecureStore
- OAuth 2.0 with PKCE for Customer Account API
- No sensitive data in git history or build artifacts 