import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import config from '../config/env';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'customer_access_token',
  REFRESH_TOKEN: 'customer_refresh_token',
  ID_TOKEN: 'customer_id_token',
  EXPIRES_AT: 'customer_expires_at',
  CODE_VERIFIER: 'customer_code_verifier',
} as const;

export interface CustomerTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
}

export interface CustomerAccountAuthService {
  login(): Promise<CustomerTokens>;
  logout(): Promise<void>;
  refreshTokens(): Promise<CustomerTokens>;
  getStoredTokens(): Promise<CustomerTokens | null>;
  isAuthenticated(): Promise<boolean>;
  clearTokens(): Promise<void>;
  enableBiometricAuth(): Promise<boolean>;
  authenticateWithBiometrics(): Promise<boolean>;
}

class CustomerAccountAuthServiceImpl implements CustomerAccountAuthService {
  private readonly clientId = config.shopify.customerAccountApi.clientId;
  private readonly shopId = config.shopify.customerAccountApi.shopId;
  private readonly authorizationUrl = config.shopify.customerAccountApi.authorizationUrl;
  private readonly tokenUrl = config.shopify.customerAccountApi.tokenUrl;
  private readonly logoutUrl = config.shopify.customerAccountApi.logoutUrl;
  private readonly callbackUrl = config.shopify.customerAccountApi.callbackUrl;
  private readonly scope = 'openid email customer-account-api:full';

  private generateCodeVerifier(): string {
    // Generate a random string for PKCE code verifier (43-128 characters)
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomBytes = Crypto.getRandomBytes(43);
    
    for (let i = 0; i < randomBytes.length; i++) {
      result += charset[randomBytes[i] % charset.length];
    }
    
    return result;
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    return this.base64UrlEncode(digest);
  }

  private base64UrlEncode(str: string): string {
    // Convert to base64 and make it URL safe
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async storeTokens(tokens: CustomerTokens): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      SecureStore.setItemAsync(STORAGE_KEYS.ID_TOKEN, tokens.idToken),
      SecureStore.setItemAsync(STORAGE_KEYS.EXPIRES_AT, tokens.expiresAt.toString()),
    ]);
  }

  async getStoredTokens(): Promise<CustomerTokens | null> {
    try {
      console.log('=== GETTING STORED TOKENS ===');
      const [accessToken, refreshToken, idToken, expiresAt] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.ID_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_AT),
      ]);

      console.log('Token retrieval results:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasIdToken: !!idToken,
        hasExpiresAt: !!expiresAt,
        expiresAt: expiresAt,
      });

      if (!accessToken || !refreshToken || !idToken || !expiresAt) {
        console.log('Missing required tokens, returning null');
        return null;
      }

      const tokens = {
        accessToken,
        refreshToken,
        idToken,
        expiresAt: parseInt(expiresAt, 10),
      };

      console.log('Parsed tokens:', {
        expiresAt: new Date(tokens.expiresAt).toISOString(),
        timeLeft: Math.floor((tokens.expiresAt - Date.now()) / 1000 / 60) + ' minutes',
      });

      return tokens;
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    console.log('=== CHECKING AUTHENTICATION ===');
    const tokens = await this.getStoredTokens();
    if (!tokens) {
      console.log('No tokens found, not authenticated');
      return false;
    }

    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    const isValid = tokens.expiresAt > now + bufferTime;
    
    console.log('Token validation:', {
      now: new Date(now).toISOString(),
      expiresAt: new Date(tokens.expiresAt).toISOString(),
      bufferTime: bufferTime / 1000 / 60 + ' minutes',
      isValid,
      timeLeft: Math.floor((tokens.expiresAt - now) / 1000 / 60) + ' minutes',
    });
    
    return isValid;
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.ID_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.EXPIRES_AT),
      SecureStore.deleteItemAsync(STORAGE_KEYS.CODE_VERIFIER),
    ]);
  }

  async login(): Promise<CustomerTokens> {
    try {
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      const state = this.generateState();
      const nonce = this.generateNonce();

      console.log('OAuth Config:', {
        clientId: this.clientId,
        shopId: this.shopId,
        authorizationUrl: this.authorizationUrl,
        callbackUrl: this.callbackUrl,
        scope: this.scope,
      });

      // Store code verifier for later use
      await SecureStore.setItemAsync(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

      const authRequest = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: this.scope.split(' '),
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.callbackUrl,
        state,
        extraParams: {
          nonce,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        },
      });

      console.log('Starting OAuth flow with URL:', this.authorizationUrl);

      const authResult = await authRequest.promptAsync({
        authorizationEndpoint: this.authorizationUrl,
      });

      console.log('OAuth result:', authResult);

      if (authResult.type !== 'success') {
        throw new Error(`Authentication ${authResult.type}`);
      }

      if (!authResult.params.code) {
        throw new Error('No authorization code received');
      }

      // Exchange authorization code for tokens
      console.log('Exchanging authorization code for tokens...');
      const tokens = await this.exchangeCodeForTokens(authResult.params.code, codeVerifier);
      console.log('Token exchange successful, storing tokens...');
      await this.storeTokens(tokens);
      console.log('Tokens stored successfully');

      return tokens;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<CustomerTokens> {
    console.log('Making token exchange request to:', this.tokenUrl);
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code,
        redirect_uri: this.callbackUrl,
        code_verifier: codeVerifier,
      }).toString(),
    });

    console.log('Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Token exchange response data:', data);
    
    if (!data.access_token || !data.refresh_token) {
      console.error('Invalid token response - missing tokens:', data);
      throw new Error('Invalid token response');
    }

    const expiresAt = Date.now() + (data.expires_in * 1000);
    console.log('Token expires at:', new Date(expiresAt).toISOString());

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresAt,
    };
  }

  async refreshTokens(): Promise<CustomerTokens> {
    const tokens = await this.getStoredTokens();
    if (!tokens) {
      throw new Error('No tokens to refresh');
    }

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        refresh_token: tokens.refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const expiresAt = Date.now() + (data.expires_in * 1000);

    const newTokens: CustomerTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || tokens.refreshToken,
      idToken: data.id_token || tokens.idToken,
      expiresAt,
    };

    await this.storeTokens(newTokens);
    return newTokens;
  }

  async logout(): Promise<void> {
    const tokens = await this.getStoredTokens();
    
    if (tokens) {
      try {
        // Call Shopify logout endpoint with access token
        const response = await fetch(this.logoutUrl, {
          method: 'POST',
          headers: {
            'Authorization': tokens.accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (!response.ok) {
          console.warn('Logout endpoint call failed, continuing with local logout');
        }
      } catch (error) {
        console.warn('Logout endpoint call failed, continuing with local logout');
      }
    }

    await this.clearTokens();
  }

  async enableBiometricAuth(): Promise<boolean> {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return supportedTypes.length > 0;
  }

  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }
}

export const customerAccountAuthService = new CustomerAccountAuthServiceImpl(); 