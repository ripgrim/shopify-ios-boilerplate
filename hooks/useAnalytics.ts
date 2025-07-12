import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';

// Common event categories for better organization
export interface AnalyticsEvents {
  // Authentication events
  user_logged_in: { method: 'oauth' | 'email' | 'social'; provider?: string };
  user_logged_out: { method: 'manual' | 'automatic'; reason?: string };
  user_registered: { method: 'oauth' | 'email' | 'social'; provider?: string };
  
  // E-commerce events
  product_viewed: { product_id: string; product_title: string; price: number; category?: string };
  product_added_to_cart: { product_id: string; variant_id: string; quantity: number; price: number };
  cart_viewed: { cart_size: number; cart_value: number };
  checkout_started: { cart_value: number; item_count: number };
  checkout_completed: { order_id: string; total: number; payment_method?: string };
  discount_applied: { code: string; discount_amount: number; cart_value: number };
  discount_removed: { code: string; cart_value: number };
  
  // Navigation events
  screen_viewed: { screen_name: string; previous_screen?: string; duration?: number };
  page_viewed: { page: string; referrer?: string };
  
  // Search & Discovery
  search_performed: { query: string; results_count?: number; category?: string };
  filter_applied: { filter_type: string; filter_value: string; results_count?: number };
  
  // User Interaction
  button_clicked: { button_name: string; location: string; action?: string };
  feature_used: { feature_name: string; context?: string };
  error_encountered: { error_type: string; error_message: string; location: string };
  
  // Network events
  network_offline: { timestamp: number };
  network_online: { connection_type: string; timestamp: number };
  
  // Custom events - completely flexible
  [key: string]: Record<string, any>;
}

export interface UserProperties {
  email?: string;
  name?: string;
  customer_id?: string;
  phone?: string;
  location?: string;
  plan?: string;
  created_at?: string;
  last_login?: string;
  total_orders?: number;
  total_spent?: number;
  preferred_language?: string;
  marketing_consent?: boolean;
  [key: string]: any;
}

export interface AnalyticsHook {
  // Core tracking methods
  track: <T extends keyof AnalyticsEvents>(
    event: T,
    properties?: AnalyticsEvents[T] & Record<string, any>
  ) => void;
  
  // User identification
  identify: (userId: string, properties?: UserProperties) => void;
  alias: (alias: string) => void;
  reset: () => void;
  
  // User properties
  setUserProperties: (properties: UserProperties) => void;
  
  // Feature flags
  featureFlag: (flagKey: string) => string | boolean | undefined;
  isFeatureEnabled: (flagKey: string) => boolean;
  
  // Page tracking
  trackScreen: (screenName: string, properties?: Record<string, any>) => void;
  
  // Custom event tracking (for maximum flexibility)
  trackCustom: (eventName: string, properties?: Record<string, any>) => void;
}

const isDev = __DEV__;

export function useAnalytics(): AnalyticsHook {
  const posthog = usePostHog();

  // Core event tracking
  const track = useCallback(<T extends keyof AnalyticsEvents>(
    event: T,
    properties?: AnalyticsEvents[T] & Record<string, any>
  ) => {
    try {
      if (isDev) {
        console.log(`📊 Analytics: ${String(event)}`, properties);
      }
      posthog.capture(String(event), properties);
    } catch (error) {
      if (isDev) {
        console.error('Analytics tracking error:', error);
      }
    }
  }, [posthog]);

  // User identification
  const identify = useCallback((userId: string, properties?: UserProperties) => {
    try {
      if (isDev) {
        console.log(`👤 Analytics: Identify user ${userId}`, properties);
      }
      posthog.identify(userId, properties);
    } catch (error) {
      if (isDev) {
        console.error('Analytics identify error:', error);
      }
    }
  }, [posthog]);

  // Alias user
  const alias = useCallback((aliasId: string) => {
    try {
      if (isDev) {
        console.log(`🔗 Analytics: Alias user to ${aliasId}`);
      }
      posthog.alias(aliasId);
    } catch (error) {
      if (isDev) {
        console.error('Analytics alias error:', error);
      }
    }
  }, [posthog]);

  // Reset user (logout)
  const reset = useCallback(() => {
    try {
      if (isDev) {
        console.log(`🔄 Analytics: Reset user`);
      }
      posthog.reset();
    } catch (error) {
      if (isDev) {
        console.error('Analytics reset error:', error);
      }
    }
  }, [posthog]);

  // Set user properties
  const setUserProperties = useCallback((properties: UserProperties) => {
    try {
      if (isDev) {
        console.log(`⚙️ Analytics: Set user properties`, properties);
      }
      posthog.capture('$set', { $set: properties });
    } catch (error) {
      if (isDev) {
        console.error('Analytics setUserProperties error:', error);
      }
    }
  }, [posthog]);

  // Feature flags
  const featureFlag = useCallback((flagKey: string) => {
    try {
      return posthog.getFeatureFlag(flagKey);
    } catch (error) {
      if (isDev) {
        console.error('Analytics featureFlag error:', error);
      }
      return undefined;
    }
  }, [posthog]);

  const isFeatureEnabled = useCallback((flagKey: string) => {
    try {
      return posthog.isFeatureEnabled(flagKey) ?? false;
    } catch (error) {
      if (isDev) {
        console.error('Analytics isFeatureEnabled error:', error);
      }
      return false;
    }
  }, [posthog]);

  // Screen tracking
  const trackScreen = useCallback((screenName: string, properties?: Record<string, any>) => {
    try {
      if (isDev) {
        console.log(`📱 Analytics: Screen view ${screenName}`, properties);
      }
      posthog.screen(screenName, properties);
    } catch (error) {
      if (isDev) {
        console.error('Analytics trackScreen error:', error);
      }
    }
  }, [posthog]);

  // Custom event tracking for maximum flexibility
  const trackCustom = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      if (isDev) {
        console.log(`🎯 Analytics: Custom event ${eventName}`, properties);
      }
      posthog.capture(eventName, properties);
    } catch (error) {
      if (isDev) {
        console.error('Analytics trackCustom error:', error);
      }
    }
  }, [posthog]);

  return {
    track,
    identify,
    alias,
    reset,
    setUserProperties,
    featureFlag,
    isFeatureEnabled,
    trackScreen,
    trackCustom,
  };
}