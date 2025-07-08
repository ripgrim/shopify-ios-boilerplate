import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Fingerprint, LogIn, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useCustomerAccount';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { login, isLoading, error, clearError, enableBiometrics, authenticateWithBiometrics, biometricEnabled } = useAuth();
  const [showBiometricOption, setShowBiometricOption] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const iconColor = useThemeColor({}, 'background');
  React.useEffect(() => {
    // Check if biometric authentication is available
    const checkBiometrics = async () => {
      const enabled = await enableBiometrics();
      setShowBiometricOption(enabled);
    };
    
    checkBiometrics();
  }, [enableBiometrics]);

  React.useEffect(() => {
    if (error) {
      Alert.alert(
        'Authentication Error',
        error,
        [
          {
            text: 'OK',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      console.log('Starting login process...');
      await login();
      onLoginSuccess?.();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        await login();
        onLoginSuccess?.();
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert('Authentication Error', 'An error occurred during biometric authentication.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-8">
        <View className="bg-card rounded-3xl p-8 w-full max-w-sm shadow-lg">
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
              <User size={32} className="text-primary-foreground" color={iconColor}/>
            </View>
            <Text className="text-2xl font-bold text-card-foreground mb-2">Welcome</Text>
            <Text className="text-muted-foreground text-center">
              Sign in to access your account
            </Text>
          </View>

          {loginError && (
            <View className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
              <Text className="text-destructive text-center">{loginError}</Text>
            </View>
          )}

          <Button
            onPress={handleLogin}
            disabled={isLoading}
            variant={isLoading ? "secondary" : "default"}
            className="w-full p-4 rounded-xl mb-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              {isLoading ? (
                <ActivityIndicator size="small" color="white" className="mr-2" />
              ) : (
                <LogIn size={20} className="text-primary-foreground p-4" color={iconColor}/>
              )}
              <Text className="text-primary-foreground font-semibold">
                {isLoading ? 'Signing in...' : 'Sign in with Shopify'}
              </Text>
            </View>
          </Button>

          {/* Biometric Login Button */}
          {showBiometricOption && (
            <Button
              onPress={handleBiometricLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full p-4 rounded-xl mb-4"
            >
              <View className="flex-row items-center justify-center">
                <Fingerprint size={20} className="text-foreground mr-2" />
                <Text className="text-foreground font-semibold">
                  Use Face ID / Touch ID
                </Text>
              </View>
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
} 