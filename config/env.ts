
import { z } from 'zod';

// Client-side environment schema - only EXPO_PUBLIC_ vars are accessible
const clientEnvSchema = z.object({
  // Shopify Config
  EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1, 'Shopify store domain is required'),
  EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1, 'Shopify storefront access token is required'),
  EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_URL: z.string().url('Shopify customer account URL must be a valid URL'),
  EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID: z.string().min(1, 'Shopify customer account client ID is required'),
  EXPO_PUBLIC_SHOPIFY_SHOP_ID: z.string().min(1, 'Shopify shop ID is required'),
  EXPO_PUBLIC_SHOPIFY_AUTHORIZATION_URL: z.string().url('Shopify authorization URL must be a valid URL'),
  EXPO_PUBLIC_SHOPIFY_TOKEN_URL: z.string().url('Shopify token URL must be a valid URL'),
  EXPO_PUBLIC_SHOPIFY_LOGOUT_URL: z.string().url('Shopify logout URL must be a valid URL'),
  EXPO_PUBLIC_SHOPIFY_CALLBACK_URL: z.string().min(1, 'Shopify callback URL is required'),
  
  // Sanity Config (client-side only - no token)
  EXPO_PUBLIC_SANITY_PROJECT_ID: z.string().min(1, 'Sanity project ID is required'),
  EXPO_PUBLIC_SANITY_DATASET: z.string().min(1, 'Sanity dataset is required'),
  
  // App Config
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  EXPO_PUBLIC_NGROK_URL: z.string().url().optional(),

  EXPO_PUBLIC_POSTHOG_API_KEY: z.string().min(1, 'PostHog API key is required'),
});

type ClientEnvVars = z.infer<typeof clientEnvSchema>;

// Validate client environment variables
const parseClientEnv = (): ClientEnvVars => {
  try {
    return clientEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Client environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
};

const env = parseClientEnv();

export interface AppConfig {
  shopify: {
    storeDomain: string;
    storefrontAccessToken: string;
    customerAccountUrl: string;
    customerAccountApi: {
      clientId: string;
      shopId: string;
      authorizationUrl: string;
      tokenUrl: string;
      logoutUrl: string;
      callbackUrl: string;
    };
  };
  sanity: {
    projectId: string;
    dataset: string;
  };
  app: {
    env: string;
    ngrokUrl?: string;
  };
  posthog: {
    apiKey: string;
  };
}

const config: AppConfig = {
  shopify: {
    storeDomain: env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN,
    storefrontAccessToken: env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    customerAccountUrl: env.EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_URL,
    customerAccountApi: {
      clientId: env.EXPO_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID,
      shopId: env.EXPO_PUBLIC_SHOPIFY_SHOP_ID,
      authorizationUrl: env.EXPO_PUBLIC_SHOPIFY_AUTHORIZATION_URL,
      tokenUrl: env.EXPO_PUBLIC_SHOPIFY_TOKEN_URL,
      logoutUrl: env.EXPO_PUBLIC_SHOPIFY_LOGOUT_URL,
      callbackUrl: env.EXPO_PUBLIC_SHOPIFY_CALLBACK_URL,
    },
  },
  sanity: {
    projectId: env.EXPO_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.EXPO_PUBLIC_SANITY_DATASET,
  },
  app: {
    env: env.EXPO_PUBLIC_APP_ENV,
    ngrokUrl: env.EXPO_PUBLIC_NGROK_URL,
  },
  posthog: {
    apiKey: env.EXPO_PUBLIC_POSTHOG_API_KEY,
  },
};

export default config; 