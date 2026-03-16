import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './app/index';
import { usePushNotifications } from './app/hooks/usePushNotifications';

export default function App() {
  usePushNotifications();

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
