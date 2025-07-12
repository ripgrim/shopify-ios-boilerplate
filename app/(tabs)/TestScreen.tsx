// import { useAuth } from '@/hooks/useCustomerAccount';
// import { CUSTOMER_QUERY, customerAccountApi } from '@/services/customerAccountApi';
import { Text } from '@/components/ui/text';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useNotifications } from '@/hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { DeviceMotion } from 'expo-sensors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // deprecated: shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function TestScreen() {
  // Expo module states
  const [notificationPermission, setNotificationPermission] = useState<Notifications.NotificationPermissionsStatus | null>(null);
  const [deviceMotionData, setDeviceMotionData] = useState<any>(null);
  const [isMotionListening, setIsMotionListening] = useState(false);

  // Custom notification inputs
  const [notificationTitle, setNotificationTitle] = useState('Custom Notification');
  const [notificationBody, setNotificationBody] = useState('This is a custom notification!');
  const [notificationData, setNotificationData] = useState('{"key": "value"}');

  // Example using the new useNotifications hook
  const notifications = useNotifications();

  // Device motion listener
  useEffect(() => {
    let subscription: any;

    if (isMotionListening) {
      subscription = DeviceMotion.addListener(motionData => {
        setDeviceMotionData(motionData);
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isMotionListening]);

  // Cleanup motion listener on unmount
  useEffect(() => {
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  // COMMENTED OUT AUTH FUNCTIONS
  /*
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
  */

  // Expo module test functions
  const testNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationPermission({ status } as Notifications.NotificationPermissionsStatus);
      Alert.alert('Notification Permission', `Status: ${status}`);
    } catch (error) {
      Alert.alert('Error', `Failed to request notification permission: ${error}`);
    }
  };

  const scheduleLocalNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "mazeincoding?",
          body: "MORE LIKE NOT CODING CUS U SUCK!! 😂",
          data: { data: 'WHAT DOES THIS DO?' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      });
      Alert.alert('Success', 'Local notification scheduled for 1 second');
    } catch (error) {
      Alert.alert('Error', `Failed to schedule notification: ${error}`);
    }
  };

  const sendCustomNotification = async () => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(notificationData);
      } catch {
        parsedData = { data: notificationData };
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
          data: parsedData,
        },
        trigger: null, // Send immediately
      });
      Alert.alert('Success', 'Custom notification sent immediately!');
    } catch (error) {
      Alert.alert('Error', `Failed to send custom notification: ${error}`);
    }
  };

  const getNotificationToken = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Expo Push Token:', token);
      Alert.alert('Push Token', `Token: ${token.data.substring(0, 20)}...`);
    } catch (error) {
      Alert.alert('Error', `Failed to get push token: ${error}`);
    }
  };

  const toggleMotionListener = () => {
    setIsMotionListening(!isMotionListening);
    if (!isMotionListening) {
      Alert.alert('Motion Sensor', 'Started listening to device motion');
    } else {
      Alert.alert('Motion Sensor', 'Stopped listening to device motion');
      setDeviceMotionData(null);
    }
  };

  const testHapticFeedback = async (type: 'impact' | 'notification' | 'selection') => {
    try {
      switch (type) {
        case 'impact':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'notification':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
      }
      Alert.alert('Haptic Feedback', `${type} feedback triggered`);
    } catch (error) {
      Alert.alert('Error', `Failed to trigger haptic feedback: ${error}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-6 pb-2">
        <Text className="text-2xl font-bold text-foreground mb-6">
          Expo Modules Test
        </Text>
      </View>
      <ScrollView className="flex-1 p-4">
        <TouchableOpacity
          onPress={() => console.clear()}
          className="bg-primary p-4 rounded-xl mb-6"
        >
          <Text className="text-primary-foreground text-center text-base font-semibold">
            🧹 Clear Console Logs
          </Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Network Status</Text>
          <NetworkStatusSection />
        </View>

        <Text className="text-lg font-semibold text-foreground mb-4">
          🚀 Easy Notifications Hook
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          <TouchableOpacity
            onPress={() => notifications.success('Operation completed!')}
            className="bg-green-600 p-4 rounded-xl shadow-lg shadow-green-600/20 flex-1 min-w-[45%]"
          >
            <Text className="text-white text-center text-sm font-semibold">
              ✅ Success
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => notifications.error('Something went wrong!')}
            className="bg-red-600 p-4 rounded-xl shadow-lg shadow-red-600/20 flex-1 min-w-[45%]"
          >
            <Text className="text-white text-center text-sm font-semibold">
              ❌ Error
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => notifications.reminder('Check your orders', 5)}
            className="bg-purple-600 p-4 rounded-xl shadow-lg shadow-purple-600/20 w-full"
          >
            <Text className="text-white text-center text-sm font-semibold">
              ⏰ Reminder (5 min)
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold text-foreground mb-4">
          📱 Notifications
        </Text>

        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">Custom Notification Title:</Text>
          <TextInput
            value={notificationTitle}
            onChangeText={setNotificationTitle}
            placeholder="Enter notification title"
            className="bg-white p-3 rounded-lg border border-gray-300 mb-3"
          />

          <Text className="text-sm font-medium text-foreground mb-2">Custom Notification Body:</Text>
          <TextInput
            value={notificationBody}
            onChangeText={setNotificationBody}
            placeholder="Enter notification body"
            multiline
            numberOfLines={2}
            className="bg-white p-3 rounded-lg border border-gray-300 mb-3"
          />

          <Text className="text-sm font-medium text-foreground mb-2">Custom Notification Data (JSON):</Text>
          <TextInput
            value={notificationData}
            onChangeText={setNotificationData}
            placeholder='{"key": "value"}'
            className="bg-white p-3 rounded-lg border border-gray-300 mb-3"
          />
        </View>

        <View className="flex-row flex-wrap gap-3 mb-6">
          <TouchableOpacity
            onPress={testNotificationPermissions}
            className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-600/20 flex-1 min-w-[45%]"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              🔐 Request Permission
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={scheduleLocalNotification}
            className="bg-green-600 p-4 rounded-xl shadow-lg shadow-green-600/20 flex-1 min-w-[45%]"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              📅 Schedule Test (1s)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={sendCustomNotification}
            className="bg-red-600 p-4 rounded-xl shadow-lg shadow-red-600/20 w-full"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              🚀 Send Custom Notification Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getNotificationToken}
            className="bg-purple-600 p-4 rounded-xl shadow-lg shadow-purple-600/20 w-full"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              🎯 Get Push Token
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold text-foreground mb-4">
          📱 Device Motion
        </Text>
        <View className="mb-6">
          <TouchableOpacity
            onPress={toggleMotionListener}
            className={`p-4 rounded-xl shadow-lg mb-4 ${isMotionListening
              ? 'bg-red-600 shadow-red-600/20'
              : 'bg-green-600 shadow-green-600/20'
              }`}
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              {isMotionListening ? '⏹️ Stop Motion' : '▶️ Start Motion'}
            </Text>
          </TouchableOpacity>

          {deviceMotionData && (
            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-800 text-sm">
                Acceleration: X: {deviceMotionData.acceleration?.x?.toFixed(2)}, Y: {deviceMotionData.acceleration?.y?.toFixed(2)}, Z: {deviceMotionData.acceleration?.z?.toFixed(2)}
              </Text>
              <Text className="text-gray-800 text-sm">
                Rotation: X: {deviceMotionData.rotation?.alpha?.toFixed(2)}, Y: {deviceMotionData.rotation?.beta?.toFixed(2)}, Z: {deviceMotionData.rotation?.gamma?.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-lg font-semibold text-foreground mb-4">
          📳 Haptic Feedback
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          <TouchableOpacity
            onPress={() => testHapticFeedback('impact')}
            className="bg-orange-600 p-4 rounded-xl shadow-lg shadow-orange-600/20 flex-1 min-w-[30%]"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              💥 Impact
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => testHapticFeedback('notification')}
            className="bg-teal-600 p-4 rounded-xl shadow-lg shadow-teal-600/20 flex-1 min-w-[30%]"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              🔔 Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => testHapticFeedback('selection')}
            className="bg-pink-600 p-4 rounded-xl shadow-lg shadow-pink-600/20 flex-1 min-w-[30%]"
          >
            <Text className="text-foreground text-center text-sm font-semibold">
              👆 Selection
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 

// Network Status Component
const NetworkStatusSection = () => {
  const { isOffline, isConnected, isInternetReachable, type, connectionQuality, checkConnection } = useNetworkStatus();
  
  const testConnection = async () => {
    const result = await checkConnection();
    Alert.alert('Connection Test', `Connection ${result ? 'successful' : 'failed'}`);
  };

  return (
    <View className="p-4 border border-border rounded-lg bg-background">
      <Text className="font-semibold mb-2">Current Network Status:</Text>
      <Text>Connected: {isConnected ? '✅' : '❌'}</Text>
      <Text>Internet Reachable: {isInternetReachable ? '✅' : '❌'}</Text>
      <Text>Connection Type: {type}</Text>
      <Text>Quality: {connectionQuality}</Text>
      <Text>Status: {isOffline ? '🔴 Offline' : '🟢 Online'}</Text>
      
      <TouchableOpacity 
        onPress={testConnection}
        className="mt-3 p-3 bg-blue-500 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
}; 