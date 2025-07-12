import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { useAuth } from '@/hooks/useCustomerAccount';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LogOut, MapPin, Settings, ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

interface AccountActionsProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onManageAddresses?: () => void;
}

export default function AccountActions({ onEditProfile, onViewOrders, onManageAddresses }: AccountActionsProps) {
  const iconColor = useThemeColor({}, 'icon');
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                'Sign Out Error',
                'Unable to sign out completely. You may need to sign in again on your next visit.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="space-y-3 gap-4">
      <Button
        onPress={onEditProfile}
        variant="outline"
        className="bg-card border border-border rounded-2xl p-4 flex-row items-center justify-start min-h-16"
      >
        <Settings size={20} color={iconColor} className="mr-6" />
        <View className="flex-1 ml-4">
          <Text className="text-card-foreground font-medium">Edit Profile</Text>
          <Text className="text-muted-foreground text-sm">Update your personal information</Text>
        </View>
      </Button>

      <Button
        onPress={onViewOrders}
        variant="outline"
        className="bg-card border border-border rounded-2xl p-4 flex-row items-center justify-start min-h-16 space-x-4"
      >
        <ShoppingBag size={20} color={iconColor} className="mr-6" />
        <View className="flex-1 ml-4">
          <Text className="text-card-foreground font-medium">Order History</Text>
          <Text className="text-muted-foreground text-sm">View your past orders and tracking</Text>
        </View>
      </Button>

      <Button
        onPress={onManageAddresses}
        variant="outline"
        className="bg-card border border-border rounded-2xl p-4 flex-row items-center justify-start min-h-16 space-x-4"
      >
        <MapPin size={20} color={iconColor} className="mr-6" />
        <View className="flex-1 ml-4">
          <Text className="text-card-foreground font-medium">Addresses</Text>
          <Text className="text-muted-foreground text-sm">Manage your shipping addresses</Text>
        </View>
      </Button>

      <Divider />

      <Button
        onPress={handleLogout}
        disabled={isLoggingOut}
        variant="destructive"
        className="bg-destructive rounded-2xl p-4 flex-row items-center justify-start min-h-16"
      >
        {isLoggingOut ? (
          <ActivityIndicator size={20} color="white" className="mr-6" />
        ) : (
          <LogOut size={20} color="white" className="mr-6" />
        )}
        <View className="flex-1 ml-4">
          <Text className="text-destructive-foreground font-medium">
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
          <Text className="text-destructive-foreground/70 text-sm">
            {isLoggingOut ? 'Please wait' : 'Sign out of your account'}
          </Text>
        </View>
      </Button>
    </View>
  );
} 