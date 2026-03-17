import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { useMenuConfig, MENU_BASE_URL } from './hooks/useMenuConfig';
import { useBadges } from './hooks/useBadges';
import WebScreen from './screens/WebScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const { config, loading, error } = useMenuConfig();
  const badges = useBadges();
  // resetKeys forces a WebView remount (= reload to original URL) on tab press
  const [resetKeys, setResetKeys] = useState<Record<string, number>>({});

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !config) {
    return (
      <View style={styles.center}>
        <Text>Kunde inte ladda meny: {error}</Text>
      </View>
    );
  }

  const initialTab = config.tabs.find(t => t.initial)?.label ?? config.tabs[0].label;

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const tab = config.tabs.find(t => t.label === route.name);
            if (!tab) return null;
            return (
              <Image
                source={{ uri: `${MENU_BASE_URL}icons/${tab.icon}.png` }}
                style={{ width: size, height: size, tintColor: color }}
              />
            );
          },
          tabBarActiveTintColor: '#fce481',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          tabBarStyle: Platform.OS === 'ios' ? styles.tabBarIOS : styles.tabBarAndroid,
          tabBarItemStyle: { paddingTop: 30 },
          tabBarLabelStyle: { marginTop: 15 },
          tabBarBackground: Platform.OS === 'ios'
            ? () => <BlurView intensity={100} tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
            : undefined,
        })}
      >
        {config.tabs.map(tab => {
          const badge = badges[tab.label];
          const showBadge = badge && (badge.count === undefined || badge.count > 0);
          return (
          <Tab.Screen
            key={tab.label}
            name={tab.label}
            options={{
              tabBarBadge: showBadge
                ? (badge.count !== undefined ? badge.count : '')
                : undefined,
              tabBarBadgeStyle: showBadge
                ? { backgroundColor: badge.color ?? '#FF3B30', color: '#fff', minWidth: badge.count !== undefined ? 18 : 10, height: badge.count !== undefined ? 18 : 10, borderRadius: 9 }
                : undefined,
            }}
            listeners={{
              tabPress: () => {
                setResetKeys(prev => ({ ...prev, [tab.label]: (prev[tab.label] ?? 0) + 1 }));
              },
            }}
          >
            {() => (
              <WebScreen
                key={resetKeys[tab.label] ?? 0}
                url={tab.url}
              />
            )}
          </Tab.Screen>
          );
        })}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIOS: {
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    height: 90,
  },
  tabBarAndroid: {
    borderTopWidth: 0,
    elevation: 0,
  },
});
