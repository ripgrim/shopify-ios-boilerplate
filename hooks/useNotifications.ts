import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export interface NotificationOptions {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: boolean;
  categoryIdentifier?: string;
}

export interface ScheduledNotificationOptions extends NotificationOptions {
  seconds?: number;
  date?: Date;
  repeats?: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<Notifications.NotificationPermissionsStatus | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermission({ status } as Notifications.NotificationPermissionsStatus);
    return status;
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermission({ status } as Notifications.NotificationPermissionsStatus);
      return status;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      throw error;
    }
  };

  const sendNotification = async (options: NotificationOptions) => {
    try {
      setIsLoading(true);
      
      const permissionStatus = permission?.status || await checkPermissions();
      if (permissionStatus !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      const content: any = {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge !== false ? 1 : undefined,
      };

      if (options.categoryIdentifier) {
        content.categoryIdentifier = options.categoryIdentifier;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content,
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleNotification = async (options: ScheduledNotificationOptions) => {
    try {
      setIsLoading(true);
      
      const permissionStatus = permission?.status || await checkPermissions();
      if (permissionStatus !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      let trigger: any = null;

      if (options.date) {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: options.date,
          repeats: options.repeats || false,
        };
      } else if (options.seconds) {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: options.seconds,
          repeats: options.repeats || false,
        };
      }

      const content: any = {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge !== false ? 1 : undefined,
      };

      if (options.categoryIdentifier) {
        content.categoryIdentifier = options.categoryIdentifier;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });

      return identifier;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getExpoPushToken = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
      return token.data;
    } catch (error) {
      console.error('Failed to get Expo push token:', error);
      throw error;
    }
  };

  const cancelNotification = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      throw error;
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
      throw error;
    }
  };

  // Quick notification presets
  const quickNotifications = {
    success: (message: string) => sendNotification({
      title: '✅ Success',
      body: message,
      data: { type: 'success' },
    }),
    
    warning: (message: string) => sendNotification({
      title: '⚠️ Warning',
      body: message,
      data: { type: 'warning' },
    }),
    
    error: (message: string) => sendNotification({
      title: '❌ Error',
      body: message,
      data: { type: 'error' },
    }),
    
    info: (message: string) => sendNotification({
      title: 'ℹ️ Info',
      body: message,
      data: { type: 'info' },
    }),
    
    reminder: (message: string, minutes: number) => scheduleNotification({
      title: '⏰ Reminder',
      body: message,
      seconds: minutes * 60,
      data: { type: 'reminder' },
    }),
  };

  return {
    // State
    permission,
    expoPushToken,
    isLoading,
    hasPermission: permission?.status === 'granted',
    
    // Functions
    requestPermissions,
    checkPermissions,
    sendNotification,
    scheduleNotification,
    getExpoPushToken,
    cancelNotification,
    cancelAllNotifications,
    
    // Quick presets
    ...quickNotifications,
  };
}; 