import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './app/index';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
