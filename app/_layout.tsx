import { Geist_100Thin, Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold, Geist_800ExtraBold, Geist_900Black } from '@expo-google-fonts/geist';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

import AuthProvider from '@/components/auth/AuthProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { Header } from '@/components/ui/Header';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useCustomerAccount';
import { NAV_THEME } from '@/lib/constants';
import { ColorScheme, ShopifyCheckoutSheetProvider } from '@shopify/checkout-sheet-kit';
import { PostHogProvider } from 'posthog-react-native';
import { useEffect, useRef, useState } from 'react';
import WelcomeScreen from './auth/welcome';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const checkoutConfig = {
  colorScheme: ColorScheme.automatic,
  preloading: true,
};

// Auth Guard Component that handles authentication logic
function AuthGuard() {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthGuard: Starting auth check...');
        await checkAuthStatus();
        console.log('AuthGuard: Auth check completed');
      } catch (error) {
        console.error('AuthGuard: Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
        console.log('AuthGuard: Initialization complete');
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  console.log('AuthGuard render state:', {
    isInitialized,
    isLoading,
    isAuthenticated,
  });

  // Show loading screen while checking authentication status
  if (!isInitialized || isLoading) {
    console.log('AuthGuard: Showing loading screen');
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!isAuthenticated) {
    console.log('AuthGuard: User not authenticated, showing welcome screen');
    return <WelcomeScreen />;
  }

  console.log('AuthGuard: User authenticated, showing main app');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        
        <ShopifyCheckoutSheetProvider configuration={checkoutConfig}>
          <CartProvider>
            <CartDrawer>
              <Header />
              <OfflineBanner />
              <Stack
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </CartDrawer>
          </CartProvider>
        </ShopifyCheckoutSheetProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { effectiveColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
    Geist_100Thin,
  });

  useEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!loaded || !isColorSchemeLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider
        apiKey="phc_nN7xm6Z6vIzsiMvNFmmhxKoLoAaWEbygGivp0zNWexS"
        options={{
          host: 'https://us.i.posthog.com',
          enableSessionReplay: true,
        }}
        autocapture
      >
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <AuthGuard />
        </ThemeProvider>
      </PostHogProvider>
    </QueryClientProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? useEffect : useLayoutEffect;