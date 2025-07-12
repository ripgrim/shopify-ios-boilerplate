import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Auth initialization is now handled by AuthGuard
  // This component just provides the context wrapper
  return <>{children}</>;
} 