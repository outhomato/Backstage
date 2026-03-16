import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import WebScreen from './screens/WebScreen';

const Tab = createBottomTabNavigator();

function icon(label: string) {
  const icons: Record<string, string> = {
    Hem: '🏠',
    Utforska: '🔍',
    Profil: '👤',
  };
  return <Text style={{ fontSize: 20 }}>{icons[label] ?? '📄'}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => icon(route.name),
          headerShown: false,
        })}
      >
        <Tab.Screen name="Hem">
          {() => <WebScreen url="https://example.com" />}
        </Tab.Screen>
        <Tab.Screen name="Utforska">
          {() => <WebScreen url="https://example.com" />}
        </Tab.Screen>
        <Tab.Screen name="Profil">
          {() => <WebScreen url="https://example.com" />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
