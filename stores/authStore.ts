import { create } from 'zustand';
import { customerAccountAuthService, CustomerTokens } from '../services/customerAccountAuth';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  tokens: CustomerTokens | null;
  error: string | null;
  biometricEnabled: boolean;

  // Actions
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  enableBiometrics: () => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: false,
  user: null,
  tokens: null,
  error: null,
  biometricEnabled: false,

  // Actions
  login: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const tokens = await customerAccountAuthService.login();
      
      set({
        isAuthenticated: true,
        tokens,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        tokens: null,
        user: null,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      await customerAccountAuthService.logout();
      
      set({
        isAuthenticated: false,
        tokens: null,
        user: null,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      });
      throw error;
    }
  },

  refreshTokens: async () => {
    try {
      const tokens = await customerAccountAuthService.refreshTokens();
      
      set({
        tokens,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      // If refresh fails, user needs to re-authenticate
      set({
        isAuthenticated: false,
        tokens: null,
        user: null,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      });
      throw error;
    }
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      
      const isAuthenticated = await customerAccountAuthService.isAuthenticated();
      
      if (isAuthenticated) {
        const tokens = await customerAccountAuthService.getStoredTokens();
        
        // Check if tokens need refreshing
        if (tokens) {
          const now = Date.now();
          const refreshBuffer = 10 * 60 * 1000; // 10 minutes before expiry
          
          if (tokens.expiresAt - now < refreshBuffer) {
            // Try to refresh tokens
            try {
              await get().refreshTokens();
            } catch (refreshError) {
              // If refresh fails, logout
              await get().logout();
              return;
            }
          }
          
          set({
            isAuthenticated: true,
            tokens,
            isLoading: false,
          });
        } else {
          set({
            isAuthenticated: false,
            tokens: null,
            user: null,
            isLoading: false,
          });
        }
      } else {
        set({
          isAuthenticated: false,
          tokens: null,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        tokens: null,
        user: null,
        error: error instanceof Error ? error.message : 'Auth check failed',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  enableBiometrics: async () => {
    try {
      const enabled = await customerAccountAuthService.enableBiometricAuth();
      set({ biometricEnabled: enabled });
      return enabled;
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      return false;
    }
  },

  authenticateWithBiometrics: async () => {
    try {
      const success = await customerAccountAuthService.authenticateWithBiometrics();
      return success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));

// Auto-refresh tokens when they're about to expire
let refreshInterval: ReturnType<typeof setInterval> | null = null;

const startTokenRefreshInterval = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(async () => {
    const state = useAuthStore.getState();
    
    if (state.isAuthenticated && state.tokens) {
      const now = Date.now();
      const refreshBuffer = 5 * 60 * 1000; // 5 minutes before expiry
      
      if (state.tokens.expiresAt - now < refreshBuffer) {
        try {
          await state.refreshTokens();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
        }
      }
    }
  }, 60 * 1000); // Check every minute
};

// Start the refresh interval
startTokenRefreshInterval();

// Cleanup function
export const stopTokenRefreshInterval = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}; 