import SwipeBackHandler from '@/components/ui/SwipeBackHandler';
import { Button } from '@/components/ui/button';
import { useCustomer } from '@/hooks/useShopifyData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EditProfileProps {
  onBack?: () => void;
  onSave?: (data: any) => void;
}

export default function EditProfile({ onBack, onSave }: EditProfileProps) {
  const { data: customer } = useCustomer();
  const iconColor = useThemeColor({}, 'text');
  
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.emailAddress?.emailAddress || '',
    phone: customer?.phoneNumber?.phoneNumber || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      Alert.alert('Success', 'Profile updated successfully');
      onSave?.(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SwipeBackHandler enabled={true}>
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1">
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-6">
              <Button onPress={onBack} variant="ghost" size="icon" className="p-2">
                <ArrowLeft size={24} color={iconColor} />
              </Button>
              <Text className="text-xl font-bold text-foreground">Edit Profile</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">First Name</Text>
                <TextInput
                  value={formData.firstName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                  className="bg-card border border-border rounded-xl p-4 text-card-foreground"
                  placeholder="Enter first name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Last Name</Text>
                <TextInput
                  value={formData.lastName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                  className="bg-card border border-border rounded-xl p-4 text-card-foreground"
                  placeholder="Enter last name"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  className="bg-card border border-border rounded-xl p-4 text-card-foreground"
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Phone</Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  className="bg-card border border-border rounded-xl p-4 text-card-foreground"
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Button
              onPress={handleSave}
              disabled={isLoading}
              variant={isLoading ? "secondary" : "default"}
              className="mt-8 p-4 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SwipeBackHandler>
  );
} 