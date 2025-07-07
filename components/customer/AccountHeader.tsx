import { useAuth } from '@/hooks/useCustomerAccount';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Alert, Text, View } from 'react-native';

export default function AccountHeader() {
  const { logout } = useAuth();
  const mutedColor = useThemeColor({}, 'icon');
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-row items-center justify-between mb-6">
      <Text className="text-2xl font-bold text-foreground">My Account</Text>
    </View>
  );
} 