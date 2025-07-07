import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { useAuth } from '@/hooks/useCustomerAccount';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LogOut, MapPin, Settings, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, View } from 'react-native';

interface AccountActionsProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onManageAddresses?: () => void;
}

export default function AccountActions({ onEditProfile, onViewOrders, onManageAddresses }: AccountActionsProps) {
  const iconColor = useThemeColor({}, 'icon');

  const { logout } = useAuth();



  const handleLogout = async () => {
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
        variant="destructive"
        className="bg-destructive/70 border border-border rounded-2xl p-4 flex-row items-center justify-start min-h-16 space-x-4"
      >
        <LogOut size={20} color={"#fff"} className="mr-6" />
        <View className="flex-1 ml-4">
          <Text className="text-card-foreground font-medium">Sign Out</Text>
          <Text className="text-muted-foreground text-sm">Sign out of your account</Text>
        </View>
      </Button>
    </View>
  );
} 