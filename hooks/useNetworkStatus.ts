import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isOffline: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
}

interface NetworkHookReturn extends NetworkStatus {
  checkConnection: () => Promise<boolean>;
  isApiCallSafe: boolean;
}

export const useNetworkStatus = (): NetworkHookReturn => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
    isOffline: false,
    connectionQuality: 'unknown',
  });

  const checkConnection = async (): Promise<boolean> => {
    try {
      const state = await Network.getNetworkStateAsync();
      return state.isConnected === true && state.isInternetReachable === true;
    } catch (error) {
      console.warn('Error checking network connection:', error);
      return false;
    }
  };

  const getConnectionQuality = (type: Network.NetworkStateType): NetworkStatus['connectionQuality'] => {
    switch (type) {
      case Network.NetworkStateType.WIFI:
        return 'excellent';
      case Network.NetworkStateType.CELLULAR:
        return 'good';
      case Network.NetworkStateType.ETHERNET:
      case Network.NetworkStateType.BLUETOOTH:
      case Network.NetworkStateType.VPN:
        return 'good';
      case Network.NetworkStateType.WIMAX:
        return 'poor';
      case Network.NetworkStateType.NONE:
      case Network.NetworkStateType.UNKNOWN:
      case Network.NetworkStateType.OTHER:
      default:
        return 'unknown';
    }
  };

  const getConnectionTypeName = (type: Network.NetworkStateType): string => {
    switch (type) {
      case Network.NetworkStateType.WIFI:
        return 'Wi-Fi';
      case Network.NetworkStateType.CELLULAR:
        return 'Cellular';
      case Network.NetworkStateType.ETHERNET:
        return 'Ethernet';
      case Network.NetworkStateType.BLUETOOTH:
        return 'Bluetooth';
      case Network.NetworkStateType.VPN:
        return 'VPN';
      case Network.NetworkStateType.WIMAX:
        return 'WiMAX';
      default:
        return 'Unknown';
    }
  };

  const updateNetworkStatus = (state: Network.NetworkState) => {
    const isConnected = state.isConnected === true;
    const isInternetReachable = state.isInternetReachable === true;
    const type = getConnectionTypeName(state.type || Network.NetworkStateType.UNKNOWN);
    const isOffline = !isConnected || !isInternetReachable;
    const connectionQuality = getConnectionQuality(state.type || Network.NetworkStateType.UNKNOWN);

    setNetworkStatus({
      isConnected,
      isInternetReachable,
      type,
      isOffline,
      connectionQuality,
    });
  };

  useEffect(() => {
    // Initial check
    Network.getNetworkStateAsync().then(updateNetworkStatus);

    // Set up listener for network changes
    const subscription = Network.addNetworkStateListener(updateNetworkStatus);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    ...networkStatus,
    checkConnection,
    isApiCallSafe: networkStatus.isConnected && networkStatus.isInternetReachable,
  };
};

// Utility function for API services
export const checkNetworkBeforeApiCall = async (): Promise<boolean> => {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
};

// Custom error for offline scenarios
export class NetworkError extends Error {
  constructor(message: string = 'No internet connection available') {
    super(message);
    this.name = 'NetworkError';
  }
} 