import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import LoginScreen from './LoginScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  console.log('ProtectedRoute render:', {
    isLoading,
    isAuthenticated,
  });

  if (isLoading) {
    console.log('ProtectedRoute: Showing loading screen');
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, showing login screen');
    return fallback || <LoginScreen />;
  }

  console.log('ProtectedRoute: User authenticated, showing protected content');
  return <>{children}</>;
} 