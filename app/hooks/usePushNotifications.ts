import { useEffect } from 'react';
import { Platform } from 'react-native';

const REGISTER_URL = 'https://www.spangascouterna.se/backstage/apps/mobile/register/';

export function usePushNotifications() {
  useEffect(() => {
    registerForPushNotifications().catch(() => {});
  }, []);
}

async function registerForPushNotifications() {
  try {
    const Device = await import('expo-device');
    if (!Device.isDevice) return;

    const Notifications = await import('expo-notifications');

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, platform: Platform.OS }),
    }).catch(() => {});
  } catch {
    // expo-notifications ej tillgängligt i Expo Go (SDK 53+), ignoreras
  }
}
