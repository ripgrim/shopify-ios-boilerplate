# Ngrok Setup for Customer Account API Development

Since Shopify Customer Account API doesn't support localhost for development, you need to use ngrok to create a secure tunnel for testing your React Native app.

## Quick Start

1. **Start development server with tunnel:**
   ```bash
   bun dev
   ```

2. **Get your ngrok URL:**
   When Expo starts, you'll see output like:
   ```
   › Metro waiting on exp://192.168.1.100:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   › Using ngrok tunnel: https://abc123.ngrok.io
   ```

3. **Your app is now accessible via ngrok for testing**
   - The OAuth callback still uses the mobile scheme: `shop.60857843806.app://callback`
   - The ngrok tunnel allows you to test the app on real devices
   - No changes needed to your Shopify Customer Account API settings

## Detailed Setup

### 1. Your Current Configuration

Your Shopify Customer Account API is already configured correctly:
- **Client ID**: `a8b58ec9-396f-460e-927c-8699d78725dc`
- **Shop ID**: `60857843806`
- **Store Domain**: `epoc-dev-store.myshopify.com`
- **Callback URL**: `shop.60857843806.app://callback`

### 2. Development Workflow

1. **Start the development server:**
   ```bash
   bun dev
   ```

2. **Note your ngrok URL from the terminal output**

3. **Test on your device:**
   - Open Expo Go or your development build
   - Scan the QR code or enter the ngrok URL
   - The app will load through the ngrok tunnel
   - Test the Customer Account API authentication flow

### 3. How It Works

- React Native apps use mobile scheme callbacks (`shop.60857843806.app://callback`)
- The ngrok tunnel provides a secure HTTPS connection for development
- Your device can access the development server through the ngrok URL
- The OAuth flow works normally using the mobile scheme callback
- No changes needed to your Shopify Customer Account API settings

### 4. Troubleshooting

**Common Issues:**

1. **App won't load on device:**
   - Ensure your ngrok tunnel is active
   - Check that your device is connected to the internet
   - Verify the ngrok URL is accessible in a browser

2. **Authentication doesn't work:**
   - Verify your Customer Account API configuration in Shopify
   - Check that the callback URL is exactly: `shop.60857843806.app://callback`
   - Ensure your app scheme is configured correctly in `app.json`

3. **Ngrok URL changes:**
   - Free ngrok URLs change on restart
   - You'll need to scan the new QR code or enter the new URL
   - Consider upgrading to ngrok Pro for persistent URLs

**Debug Steps:**

1. Verify your ngrok URL is accessible in a browser
2. Check the Expo DevTools logs for any errors
3. Ensure your Customer Account API configuration is correct
4. Clear app cache and restart: `bun clean && bun dev`

### 5. Benefits of Using Ngrok

- **Real device testing**: Test on actual iOS/Android devices
- **HTTPS security**: Ngrok provides secure HTTPS tunnels
- **Network accessibility**: Share your development app with team members
- **OAuth compatibility**: Works with Shopify's OAuth requirements

### 6. Production Deployment

For production builds, ngrok isn't needed. Your app will use the mobile scheme callback URL (`shop.60857843806.app://callback`) directly. 