import { Button } from '@/components/ui/button';
import { useAuth, useCustomer, useCustomerOrders } from '@/hooks/useCustomerAccount';
import { customerAccountApi } from '@/services/customerAccountApi';
import { Bug, LogOut, MapPin, RefreshCw, ShoppingBag, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestScreen() {
  const { logout } = useAuth();
  const { data: customer, refetch: refetchCustomer, isLoading: loadingCustomer } = useCustomer();
  const { data: orders, refetch: refetchOrders, isLoading: loadingOrders } = useCustomerOrders();
  const [testResults, setTestResults] = useState<any>({});

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const testCustomerFetch = async () => {
    try {
      const result = await refetchCustomer();
      setTestResults((prev: any) => ({ ...prev, customer: result }));
    } catch (error) {
      console.error('Customer fetch error:', error);
      setTestResults((prev: any) => ({ ...prev, customer: { error: error instanceof Error ? error.message : 'Unknown error' } }));
    }
  };

  const testOrdersFetch = async () => {
    try {
      const result = await refetchOrders();
      setTestResults((prev: any) => ({ ...prev, orders: result }));
    } catch (error) {
      console.error('Orders fetch error:', error);
      setTestResults((prev: any) => ({ ...prev, orders: { error: error instanceof Error ? error.message : 'Unknown error' } }));
    }
  };

  const debugOrdersQuery = async () => {
    try {
      console.log('=== Testing Orders Query ===');
      const result = await customerAccountApi.testOrdersQuery();
      console.log('Orders test result:', result);
      setTestResults((prev: any) => ({ ...prev, ordersDebug: result }));
      Alert.alert('Debug Success', 'Orders query test successful - check console');
    } catch (error) {
      console.error('Orders debug error:', error);
      setTestResults((prev: any) => ({ ...prev, ordersDebug: { error: error instanceof Error ? error.message : 'Unknown error' } }));
      Alert.alert('Debug Failed', `Orders query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const debugAddressesQuery = async () => {
    try {
      console.log('=== Testing Addresses Query ===');
      const result = await customerAccountApi.testAddressesQuery();
      console.log('Addresses test result:', result);
      setTestResults((prev: any) => ({ ...prev, addressesDebug: result }));
      Alert.alert('Debug Success', 'Addresses query test successful - check console');
    } catch (error) {
      console.error('Addresses debug error:', error);
      setTestResults((prev: any) => ({ ...prev, addressesDebug: { error: error instanceof Error ? error.message : 'Unknown error' } }));
      Alert.alert('Debug Failed', `Addresses query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const debugCustomerQuery = async () => {
    try {
      console.log('=== Testing Customer Query ===');
      const result = await customerAccountApi.testCustomerQuery();
      console.log('Customer test result:', result);
      setTestResults((prev: any) => ({ ...prev, customerDebug: result }));
      Alert.alert('Debug Success', 'Customer query test successful - check console');
    } catch (error) {
      console.error('Customer debug error:', error);
      setTestResults((prev: any) => ({ ...prev, customerDebug: { error: error instanceof Error ? error.message : 'Unknown error' } }));
      Alert.alert('Debug Failed', `Customer query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <View className="bg-card rounded-3xl p-6 mb-6">
          <Text className="text-2xl font-bold text-card-foreground mb-6">Customer Account API Test</Text>
          
          <View className="grid grid-cols-2 gap-4">
            <Button
              onPress={testCustomerFetch}
              disabled={loadingCustomer}
              variant="outline"
              className="bg-blue-50 border-blue-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <User size={32} className="text-blue-600 mb-2" />
                <Text className="text-blue-800 font-semibold">Test Customer</Text>
                <Text className="text-blue-600 text-sm">Fetch Profile</Text>
              </View>
            </Button>

            <Button
              onPress={testOrdersFetch}
              disabled={loadingOrders}
              variant="outline"
              className="bg-green-50 border-green-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <ShoppingBag size={32} className="text-green-600 mb-2" />
                <Text className="text-green-800 font-semibold">Test Orders</Text>
                <Text className="text-green-600 text-sm">Fetch History</Text>
              </View>
            </Button>

            <Button
              onPress={() => {
                testCustomerFetch();
                testOrdersFetch();
              }}
              variant="outline"
              className="bg-purple-50 border-purple-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <RefreshCw size={32} className="text-purple-600 mb-2" />
                <Text className="text-purple-800 font-semibold">Test All</Text>
                <Text className="text-purple-600 text-sm">Fetch Everything</Text>
              </View>
            </Button>

            <Button
              onPress={handleLogout}
              variant="outline"
              className="bg-red-50 border-red-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <LogOut size={32} className="text-red-600 mb-2" />
                <Text className="text-red-800 font-semibold">Logout</Text>
                <Text className="text-red-600 text-sm">Sign Out</Text>
              </View>
            </Button>
          </View>
        </View>

        <View className="bg-card rounded-3xl p-6 mb-6">
          <Text className="text-xl font-bold text-card-foreground mb-4">Debug Queries</Text>
          
          <View className="grid grid-cols-2 gap-4">
            <Button
              onPress={debugCustomerQuery}
              variant="outline"
              className="bg-yellow-50 border-yellow-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <Bug size={32} className="text-yellow-600 mb-2" />
                <Text className="text-yellow-800 font-semibold">Debug Customer</Text>
                <Text className="text-yellow-600 text-sm">Simple Query</Text>
              </View>
            </Button>

            <Button
              onPress={debugOrdersQuery}
              variant="outline"
              className="bg-orange-50 border-orange-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <ShoppingBag size={32} className="text-orange-600 mb-2" />
                <Text className="text-orange-800 font-semibold">Debug Orders</Text>
                <Text className="text-orange-600 text-sm">Simple Query</Text>
              </View>
            </Button>

            <Button
              onPress={debugAddressesQuery}
              variant="outline"
              className="bg-teal-50 border-teal-200 p-4 rounded-2xl"
            >
              <View className="items-center">
                <MapPin size={32} className="text-teal-600 mb-2" />
                <Text className="text-teal-800 font-semibold">Debug Addresses</Text>
                <Text className="text-teal-600 text-sm">Simple Query</Text>
              </View>
            </Button>
          </View>
        </View>

        {customer && (
          <View className="bg-card rounded-3xl p-6 mb-6">
            <Text className="text-xl font-bold text-card-foreground mb-4">Customer Profile</Text>
            <View className="bg-background rounded-xl p-4">
              <Text className="text-foreground font-mono text-sm">
                {JSON.stringify(customer, null, 2)}
              </Text>
            </View>
          </View>
        )}

        {orders && (
          <View className="bg-card rounded-3xl p-6 mb-6">
            <Text className="text-xl font-bold text-card-foreground mb-4">Orders</Text>
            <View className="bg-background rounded-xl p-4">
              <Text className="text-foreground font-mono text-sm">
                {JSON.stringify(orders, null, 2)}
              </Text>
            </View>
          </View>
        )}

        {Object.keys(testResults).length > 0 && (
          <View className="bg-card rounded-3xl p-6">
            <Text className="text-xl font-bold text-card-foreground mb-4">Test Results</Text>
            <View className="bg-background rounded-xl p-4">
              <Text className="text-foreground font-mono text-sm">
                {JSON.stringify(testResults, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 