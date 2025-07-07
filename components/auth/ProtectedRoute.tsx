import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import LoginScreen from './LoginScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return fallback || <LoginScreen />;
  }

  return <>{children}</>;
} 