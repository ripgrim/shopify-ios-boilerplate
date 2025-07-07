import { z } from 'zod';

// Server-side environment schema - can access all env vars
const serverEnvSchema = z.object({
  // Sanity Config (server-side)
  SANITY_TOKEN: z.string().min(1, 'Sanity token is required'),
  EXPO_PUBLIC_SANITY_PROJECT_ID: z.string().min(1, 'Sanity project ID is required'),
  EXPO_PUBLIC_SANITY_DATASET: z.string().min(1, 'Sanity dataset is required'),
});

type ServerEnvVars = z.infer<typeof serverEnvSchema>;

// Validate server environment variables
const parseServerEnv = (): ServerEnvVars => {
  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Server environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
};

// Export validated environment for server use
export const serverEnv = parseServerEnv();

// Export Sanity client config for server-side use
export const sanityServerConfig = {
  projectId: serverEnv.EXPO_PUBLIC_SANITY_PROJECT_ID,
  dataset: serverEnv.EXPO_PUBLIC_SANITY_DATASET,
  token: serverEnv.SANITY_TOKEN,
  apiVersion: '2023-10-01',
  useCdn: true,
}; 