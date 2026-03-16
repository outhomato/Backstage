import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import WebScreen from './screens/WebScreen';

const Tab = createBottomTabNavigator();

function icon(label: string) {
  const icons: Record<string, string> = {
    Spånga: '⚜️',
    Hem: '🏠',
    Sök: '🔍',
    Profil: '👤',
  };
  return <Text style={{ fontSize: 20 }}>{icons[label] ?? '📄'}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Hem"
        screenOptions={({ route }) => ({
          tabBarIcon: () => icon(route.name),
          headerShown: false,
        })}
      >
        <Tab.Screen name="Spånga">
          {() => <WebScreen url="https://www.spangascouterna.se" />}
        </Tab.Screen>
        <Tab.Screen name="Hem">
          {() => <WebScreen url="https://www.spangascouterna.se/backstage" />}
        </Tab.Screen>
        <Tab.Screen name="Sök">
          {() => <WebScreen url="https://example.com" />}
        </Tab.Screen>
        <Tab.Screen name="Profil">
          {() => <WebScreen url="https://example.com" />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
