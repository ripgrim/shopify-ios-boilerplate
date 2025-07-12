import LoginScreen from '@/components/auth/LoginScreen';
import { Button } from '@/components/ui/button';
import { ShopifyIcon } from '@/components/ui/icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useCustomerAccount';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { login, authenticateWithBiometrics } = useAuth();
    const logoSource = colorScheme.effectiveColorScheme === 'dark'
        ? require('@/assets/images/epoc-light.png')
        : require('@/assets/images/epoc.png');

    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
          setLoginError(null);
          console.log('Starting login process...');
          await login();
          // Navigate to main app after successful login
          router.push('/(tabs)');
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
            // Navigate to main app after successful biometric login
            router.push('/(tabs)');
          } else {
            Alert.alert('Authentication Failed', 'Biometric authentication was not successful.');
          }
        } catch (error) {
          console.error('Biometric login error:', error);
          Alert.alert('Authentication Error', 'An error occurred during biometric authentication.');
        }
      };    

    const handleGuest = () => {
        router.push('/(tabs)');
    };

    const handleLoginSuccess = () => {
        setShowLogin(false);
        router.push('/(tabs)');
    };

    if (showLogin) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 justify-center items-center px-6">
                <View className="w-20 h-20 rounded-lg justify-center items-center mb-4">
                    <Image source={logoSource} className="w-20 h-20" resizeMode="contain" />
                </View>
                <Text className="text-foreground text-lg text-center mb-12 font-medium">
                    Welcome to EPOC.
                </Text>

                <View className="w-full max-w-sm space-y-4 gap-4 justify-center items-center px-10">
                    <Button
                        onPress={handleLogin}
                        className="bg-primary border border-border py-4 px-8 rounded-lg w-full items-center min-h-12 flex-row gap-2"
                    >
                        <ShopifyIcon />
                        <Text className="text-primary-foreground text-base font-semibold">Log In with Shopify</Text>
                    </Button>
                </View>

                {/* <Pressable onPress={handleGuest} className="mt-8">
                    <Text className="text-muted-foreground text-sm underline">
                        Continue as Guest
                    </Text>
                </Pressable> */}
            </View>
        </SafeAreaView>
    );
}; 