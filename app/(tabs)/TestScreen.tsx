import { useAuth } from '@/hooks/useCustomerAccount';
import { CUSTOMER_QUERY, customerAccountApi } from '@/services/customerAccountApi';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TestScreen() {
  const { login, logout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const clearTokens = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Auth tokens cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear tokens');
    }
  };

  const debugTokenFormat = async () => {
    try {
      const tokens = await import('@/services/customerAccountAuth').then(m => 
        m.customerAccountAuthService.getStoredTokens()
      );
      
      if (!tokens) {
        Alert.alert('Error', 'No tokens available');
        return;
      }

      console.log('=== COMPREHENSIVE TOKEN DEBUG ===');
      console.log('Raw token:', tokens.accessToken);
      console.log('Token type:', typeof tokens.accessToken);
      console.log('Token length:', tokens.accessToken.length);
      console.log('Token starts with shcat_:', tokens.accessToken.startsWith('shcat_'));
      console.log('Token ends with:', tokens.accessToken.slice(-10));
      console.log('Token first 50 chars:', tokens.accessToken.substring(0, 50));
      
      const hasWhitespace = /\s/.test(tokens.accessToken);
      console.log('Token has whitespace:', hasWhitespace);
      
      const encoded = encodeURIComponent(tokens.accessToken);
      console.log('URL encoded token length:', encoded.length);
      console.log('Token needs encoding:', encoded !== tokens.accessToken);
      
      const parts = tokens.accessToken.split('.');
      console.log('JWT parts count:', parts.length);
      if (parts.length === 3) {
        console.log('JWT header length:', parts[0].length);
        console.log('JWT payload length:', parts[1].length);
        console.log('JWT signature length:', parts[2].length);
      }
      
      const cleanToken = tokens.accessToken.trim();
      console.log('Cleaned token equals original:', cleanToken === tokens.accessToken);
      
      Alert.alert('Debug Complete', 'Check console for detailed token information');
    } catch (error) {
      console.error('Token debug error:', error);
      Alert.alert('Error', 'Failed to debug token');
    }
  };

  const testWithCleanToken = async () => {
    setIsLoading(true);
    try {
      const tokens = await import('@/services/customerAccountAuth').then(m => 
        m.customerAccountAuthService.getStoredTokens()
      );
      
      if (!tokens) {
        Alert.alert('Error', 'No tokens available');
        return;
      }

      console.log('=== TESTING WITH CLEANED TOKEN ===');
      
      const cleanToken = tokens.accessToken.trim().replace(/\s+/g, '');
      console.log('Original token length:', tokens.accessToken.length);
      console.log('Cleaned token length:', cleanToken.length);
      console.log('Tokens are equal:', cleanToken === tokens.accessToken);
      
      const response = await fetch(
        'https://shopify.com/60857843806/account/customer/api/2025-07/graphql',
        {
          method: 'POST',
          headers: {
            'Authorization': cleanToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                customer {
                  id
                  firstName
                  lastName
                }
              }
            `
          })
        }
      );

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.data && data.data.customer) {
            Alert.alert('Success', `Clean token test successful! Customer ID: ${data.data.customer.id}`);
          } else if (data.errors) {
            Alert.alert('GraphQL Error', data.errors[0]?.message || 'Unknown GraphQL error');
          } else {
            Alert.alert('Unexpected Response', `Response: ${responseText}`);
          }
        } catch (parseError) {
          Alert.alert('Parse Error', `Could not parse response: ${responseText}`);
        }
      } else {
        Alert.alert('Error', `Clean token test failed: ${response.status}\n${responseText}`);
      }
    } catch (error) {
      console.error('Clean token test error:', error);
      Alert.alert('Error', `Clean token test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomerAccountApi = async () => {
    setIsLoading(true);
    try {
      const result = await customerAccountApi.query(CUSTOMER_QUERY);
      console.log('Customer Account API Result:', result);
      Alert.alert('Success', 'Customer Account API call successful!');
    } catch (error) {
      console.error('Customer Account API Error:', error);
      Alert.alert('Error', `Customer Account API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testManualFetch = async () => {
    setIsLoading(true);
    try {
      const tokens = await import('@/services/customerAccountAuth').then(m => 
        m.customerAccountAuthService.getStoredTokens()
      );
      
      if (!tokens) {
        Alert.alert('Error', 'No tokens available');
        return;
      }

      console.log('=== MANUAL FETCH TEST ===');
      console.log('Access token:', tokens.accessToken);
      console.log('Token starts with shcat_:', tokens.accessToken.startsWith('shcat_'));
      console.log('Token length:', tokens.accessToken.length);
      
      const response = await fetch(
        'https://shopify.com/60857843806/account/customer/api/2025-07/graphql',
        {
          method: 'POST',
          headers: {
            'Authorization': tokens.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                customer {
                  id
                  firstName
                  lastName
                }
              }
            `
          })
        }
      );

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.data && data.data.customer) {
            Alert.alert('Success', `Manual fetch successful! Customer ID: ${data.data.customer.id}`);
          } else if (data.errors) {
            Alert.alert('GraphQL Error', data.errors[0]?.message || 'Unknown GraphQL error');
          } else {
            Alert.alert('Unexpected Response', `Response: ${responseText}`);
          }
        } catch (parseError) {
          Alert.alert('Parse Error', `Could not parse response: ${responseText}`);
        }
      } else {
        Alert.alert('Error', `Manual fetch failed: ${response.status}\n${responseText}`);
      }
    } catch (error) {
      console.error('Manual fetch error:', error);
      Alert.alert('Error', `Manual fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomerOrders = async () => {
    setIsLoading(true);
    try {
      const query = `
        query {
          customer {
            orders(first: 5) {
              nodes {
                id
                name
                orderNumber
                processedAt
                totalPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `;
      
      const result = await customerAccountApi.query(query);
      console.log('Customer Orders Result:', result);
      Alert.alert('Success', 'Customer orders fetched successfully!');
    } catch (error) {
      console.error('Customer Orders Error:', error);
      Alert.alert('Error', `Customer orders failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold text-foreground mb-6">
          Customer Account API Test
        </Text>

        <TouchableOpacity
          onPress={() => console.clear()}
          className="bg-primary p-4 rounded-xl mb-6"
        >
          <Text className="text-primary-foreground text-center text-base font-semibold">
            🧹 Clear Console Logs
          </Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-lg text-foreground mb-4">
            Auth Status: <Text className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
            </Text>
          </Text>

          <TouchableOpacity
            onPress={isAuthenticated ? logout : login}
            className={`p-4 rounded-xl mb-4 ${
              isAuthenticated 
                ? 'bg-red-500 shadow-lg shadow-red-500/20' 
                : 'bg-green-500 shadow-lg shadow-green-500/20'
            }`}
          >
            <Text className="text-foreground text-center text-lg font-bold">
              {isAuthenticated ? '🚪 Sign Out' : '🔐 Sign In with Shopify'}
            </Text>
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              🧪 API Testing Tools
            </Text>

            <View className="flex-row flex-wrap gap-3">
              <TouchableOpacity
                onPress={debugTokenFormat}
                className="bg-red-600 p-4 rounded-xl shadow-lg shadow-red-600/20 flex-1 min-w-[45%]"
              >
                <Text className="text-foreground text-center text-sm font-semibold">
                  🔍 Debug Token
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testWithCleanToken}
                disabled={isLoading}
                className={`p-4 rounded-xl shadow-lg flex-1 min-w-[45%] ${
                  isLoading 
                    ? 'bg-gray-400 shadow-gray-400/20' 
                    : 'bg-amber-500 shadow-amber-500/20'
                }`}
              >
                <Text className="text-foreground text-center text-sm font-semibold">
                  {isLoading ? '⏳ Testing...' : '🧼 Clean Token Test'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testCustomerAccountApi}
                disabled={isLoading}
                className={`p-6 rounded-xl shadow-lg w-full ${
                  isLoading 
                    ? 'bg-gray-400 shadow-gray-400/20' 
                    : 'bg-blue-600 shadow-blue-600/20'
                }`}
              >
                <Text className="text-foreground text-center text-lg font-bold">
                  {isLoading ? '⏳ Testing...' : '👤 Test Customer Profile'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testCustomerOrders}
                disabled={isLoading}
                className={`p-4 rounded-xl shadow-lg flex-1 min-w-[45%] ${
                  isLoading 
                    ? 'bg-gray-400 shadow-gray-400/20' 
                    : 'bg-green-600 shadow-green-600/20'
                }`}
              >
                <Text className="text-foreground text-center text-sm font-semibold">
                  {isLoading ? '⏳ Testing...' : '📦 Customer Orders'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testManualFetch}
                disabled={isLoading}
                className={`p-4 rounded-xl shadow-lg flex-1 min-w-[45%] ${
                  isLoading 
                    ? 'bg-gray-400 shadow-gray-400/20' 
                    : 'bg-purple-600 shadow-purple-600/20'
                }`}
              >
                <Text className="text-foreground text-center text-sm font-semibold">
                  {isLoading ? '⏳ Testing...' : '🔧 Manual Fetch'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={clearTokens}
                className="bg-orange-500 p-4 rounded-xl shadow-lg shadow-orange-500/20 w-full"
              >
                <Text className="text-foreground text-center text-base font-bold">
                  🗑️ Clear Auth Tokens
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 