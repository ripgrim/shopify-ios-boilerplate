import { Text } from '@/components/ui/text';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useThemeColor } from '@/hooks/useThemeColor';

import React, { useEffect, useRef } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { WifiIcon, WifiOffIcon } from './icons';

export const OfflineBanner: React.FC = () => {
  const { isOffline, connectionQuality, type } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const backgroundColor = useThemeColor({}, 'destructive');
  const textColor = '#FFFFFF';
  const { width } = useWindowDimensions();
  
  useEffect(() => {
    if (isOffline) {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, slideAnim]);

  const getConnectionMessage = () => {
    if (!isOffline) {
      return `Connected via ${type}`;
    }
    return 'No internet connection';
  };

  const getConnectionIcon = () => {
    if (isOffline) {
      return <WifiOffIcon size={16} color={textColor} />;
    }
    return <WifiIcon size={16} color={textColor} />;
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: width,
      }}
    >
      <View 
        className="px-4 py-3 flex-row items-center justify-center space-x-2"
        style={{ backgroundColor }}
      >
        {getConnectionIcon()}
        <Text 
          className="text-sm font-medium"
          style={{ color: textColor }}
        >
          {getConnectionMessage()}
        </Text>
      </View>
    </Animated.View>
  );
};

// Lightweight version that doesn't auto-hide
export const OfflineIndicator: React.FC = () => {
  const { isOffline, type } = useNetworkStatus();
  const backgroundColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');
  
  if (!isOffline) return null;

  return (
    <View 
      className="px-3 py-2 flex-row items-center justify-center space-x-2 border-b border-border"
      style={{ backgroundColor }}
    >
      <WifiOffIcon size={14} color={textColor} />
      <Text 
        className="text-xs font-medium"
        style={{ color: textColor }}
      >
        Offline - Some features may be limited
      </Text>
    </View>
  );
}; 