import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import WebScreen from './screens/WebScreen';

const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, IoniconName> = {
  Spånga: 'leaf-outline',
  Hem: 'home-outline',
  Sök: 'search-outline',
  Profil: 'person-outline',
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Hem"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#555',
          tabBarStyle: Platform.OS === 'ios' ? styles.tabBarIOS : styles.tabBarAndroid,
          tabBarBackground: Platform.OS === 'ios'
            ? () => <BlurView intensity={60} tint="systemMaterial" style={StyleSheet.absoluteFill} />
            : undefined,
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

const styles = StyleSheet.create({
  tabBarIOS: {
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tabBarAndroid: {
    borderTopWidth: 0,
    elevation: 0,
  },
});
