import { useAuth } from '@/hooks/useCustomerAccount';
import { useCustomer } from '@/hooks/useShopifyData';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountActions from './AccountActions';
import AccountHeader from './AccountHeader';
import ProfileCard from './ProfileCard';

interface CustomerProfileProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  onManageAddresses?: () => void;
}

export default function CustomerProfile({ onEditProfile, onViewOrders, onManageAddresses }: CustomerProfileProps) {
  const { data: customer, isLoading, error } = useCustomer();
  const { user } = useAuth();

  console.log('Customer Profile:', customer);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="mt-4 text-muted-foreground">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-destructive text-center mb-4">Failed to load profile</Text>
          <Text className="text-muted-foreground text-center">{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
          <AccountHeader />
          
          <ProfileCard 
            onEdit={onEditProfile}
          />
          
          <AccountActions
            onEditProfile={onEditProfile}
            onViewOrders={onViewOrders}
            onManageAddresses={onManageAddresses}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 