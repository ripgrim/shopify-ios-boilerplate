# Shopify iOS Boilerplate

A barebones React Native mobile application built with TypeScript and Tailwind CSS, integrating with Shopify Storefront API and Payload CMS for dynamic layout management.

## Features

- 🛍️ **Shopify Integration**: Full integration with Shopify Storefront API
- 📱 **React Native**: Cross-platform mobile app (iOS focused)
- 🎨 **Tailwind CSS**: Styling with NativeWind
- 🔄 **Dynamic Layouts**: Payload CMS-powered layout management
- 📊 **State Management**: Zustand for client state, React Query for server state
- 🔐 **Customer Accounts**: WebView integration with Shopify Customer Account 2.0
- 📱 **Tab Navigation**: Clean tab-based navigation structure

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Bun** as JavaScript runtime and package manager
- **NativeWind** (Tailwind CSS for React Native)
- **Zustand** for state management
- **React Query** for server state management
- **Zod** for validation
- **React Navigation** for routing
- **Shopify Storefront API** for e-commerce data
- **Payload CMS** for dynamic content management

## Runtime Preference

This project uses **Bun** as the preferred JavaScript runtime and package manager for:

- ⚡ **Faster installs**: Significantly faster package installation compared to npm
- 🔧 **Built-in bundler**: Native bundling capabilities
- 🚀 **Better performance**: Faster script execution
- 📦 **Drop-in replacement**: Compatible with npm packages and scripts

The project has been migrated from npm to bun with `bun.lockb` as the lockfile. All commands use `bun` instead of `npm`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── sections/       # CMS layout sections
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CollectionCard.tsx
│   ├── CustomerAccountWebView.tsx
│   └── DynamicLayoutRenderer.tsx
├── config/             # Configuration files
│   └── env.ts
├── hooks/              # Custom React hooks
│   ├── useShopifyData.ts
│   └── usePayloadData.ts
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── ProductsScreen.tsx
│   ├── CollectionsScreen.tsx
│   └── AccountScreen.tsx
├── services/           # API services
│   ├── shopify.ts
│   └── payload.ts
├── stores/             # Zustand stores
│   ├── productStore.ts
│   └── cmsStore.ts
└── types/              # TypeScript type definitions
    ├── shopify.ts
    └── payload.ts
```

## Configuration

### Environment Variables

Configure your API keys and store information in `app.json`:

```json
{
  "expo": {
    "extra": {
      "shopifyStoreDomain": "your-store.myshopify.com",
      "shopifyStorefrontAccessToken": "your-storefront-access-token",
      "shopifyCustomerAccountUrl": "https://your-store.myshopify.com/account",
      "payloadCmsApiUrl": "https://your-payload-cms.com/api",
      "payloadCmsApiKey": "your-payload-cms-api-key",
      "appEnv": "development"
    }
  }
}
```

### Shopify Setup

1. Create a Shopify store or use an existing one
2. Enable Storefront API access
3. Generate a Storefront access token
4. Update the configuration with your store domain and access token

### Payload CMS Setup

1. Set up a Payload CMS instance
2. Create the required collections using the schemas in `payload-schemas.md`
3. Configure API access and generate an API key
4. Update the configuration with your CMS URL and API key

## Available Scripts

- `bun run android` - Run on Android
- `bun run ios` - Run on iOS
- `bun run web` - Run on web
- `bun start` - Start the development server

## Key Components

### DynamicLayoutRenderer

Renders sections based on Payload CMS layout data:
- Hero sections
- Product grids
- Featured products
- Text blocks
- Image blocks
- Promotional sections

### ProductGrid

Displays products in a grid layout with:
- Infinite scrolling
- Pull-to-refresh
- Loading states
- Error handling

### CustomerAccountWebView

Integrated Shopify Customer Account 2.0 with:
- Navigation controls
- Error handling
- Loading states

## Payload CMS Integration

The app supports dynamic layouts through Payload CMS with the following content types:

- **Layouts**: Define page structures with ordered sections
- **Promotions**: Manage promotional content
- **Featured Content**: Highlight specific products or collections
- **App Config**: Global app settings and theming

See `payload-schemas.md` for detailed schema definitions.

## State Management

- **Zustand**: Client-side state (user interactions, UI state)
- **React Query**: Server state (API data, caching, synchronization)
- **Zod**: Runtime validation and type safety

## Getting Started

1. Clone the repository
2. Install dependencies: `bun install`
3. Configure your Shopify and Payload CMS credentials
4. Run the development server: `bun start`
5. Launch on your preferred platform

## Troubleshooting

**SDK Version Missing Error**: If you encounter "SDK Version is missing" error, ensure your `app.json` includes:
- `sdkVersion`: Matching your Expo SDK version
- `ios.bundleIdentifier`: For iOS builds
- `android.package`: For Android builds
- `newArchEnabled: false`: For better compatibility with third-party packages

## Development Notes

- The app uses minimal styling with no animations as requested
- All layout management is handled through Payload CMS
- Customer accounts use webview for full Shopify feature support
- Tab navigation provides clean separation of concerns

## Next Steps

To extend this boilerplate:

1. Add product search and filtering
2. Implement cart functionality
3. Add push notifications
4. Integrate analytics
5. Add offline support
6. Implement user authentication flows

## License

This project is open source and available under the MIT License. 