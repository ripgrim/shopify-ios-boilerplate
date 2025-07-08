import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCustomer } from '@/hooks/useShopifyData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Edit, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

interface ProfileCardProps {
  onEdit?: () => void;
}

export default function ProfileCard({ onEdit }: ProfileCardProps) {
  const { data: customer, isLoading, error } = useCustomer();
  const primaryColor = useThemeColor({}, 'tint');
  const mutedColor = useThemeColor({}, 'icon');

  if (isLoading) {
    return (
      <View className="bg-card border border-border rounded-2xl p-6 mb-6">
        <Text className="text-muted-foreground text-center">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-card border border-border rounded-2xl p-6 mb-6">
        <Text className="text-destructive text-center">Error loading profile</Text>
      </View>
    );
  }

  return (
    <View className="bg-card border border-border rounded-2xl p-6 mb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
            <User size={20} color={primaryColor} />
          </View>
          <View>
            <Text className="text-card-foreground font-semibold text-lg">
              {customer?.firstName || 'Anonymous'} {customer?.lastName || 'User'}
            </Text>
            <Text className="text-muted-foreground text-sm">Customer</Text>
          </View>
        </View>
        <Button onPress={onEdit} variant="ghost" size="icon" className="p-2">
          <Edit size={16} color={mutedColor} />
        </Button>
      </View>

      {/* <View className="space-y-3">
        {customer?.emailAddress?.emailAddress && (
          <View className="flex-row items-center gap-2">
            <Mail size={16} color={mutedColor} className="mr-10" />
            <Text className="text-card-foreground flex-1">
              {customer.emailAddress.emailAddress}
            </Text>
          </View>
        )}
        
        {customer?.phoneNumber?.phoneNumber && (
          <View className="flex-row items-center">
            <Phone size={16} color={mutedColor} className="mr-3" />
            <Text className="text-card-foreground flex-1">
              {customer.phoneNumber.phoneNumber}
            </Text>
          </View>
        )}


      </View> */}
    </View>
  );
} 