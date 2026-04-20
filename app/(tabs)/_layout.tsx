import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Alert, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInstagramDataStore, selectHasUploadedZip } from '@/src/features/homepage/store';
import { selectIsAuthenticated, useAuthStore } from '@/src/features/signin';

// Breakpoint for mobile vs tablet/desktop
const MOBILE_BREAKPOINT = 768;

const BRAND = {
  accentCyan: '#29A0B3',
  active: '#EC339D',
  inactive: '#9CA3AF',
};

function TabIcon({
  name,
  color,
  locked = false,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  locked?: boolean;
}) {
  return (
    <View style={styles.iconWrap}>
      <MaterialIcons color={color} name={name} size={28} />
      {locked ? (
        <View style={styles.lockBadge}>
          <MaterialIcons color="#fff" name="lock" size={11} />
        </View>
      ) : null}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasUploadedZip = useInstagramDataStore(selectHasUploadedZip);
  const { width } = useWindowDimensions();

  if (!isAuthenticated) {
    return <Redirect href="/signin" />;
  }
  const isDark = colorScheme === 'dark';

  const tabBarBackgroundColor = isDark ? '#1e2128' : '#ffffff';
  const tabBarBorderColor = isDark ? '#2a2d36' : '#f3f4f6';

  // Hide tab bar on web or on screens wider than mobile breakpoint
  const shouldShowTabBar = Platform.OS !== 'web' && width < MOBILE_BREAKPOINT;

  const guardLockedTab = (event: { preventDefault: () => void }) => {
    if (hasUploadedZip) return;
    event.preventDefault();
    Alert.alert('Locked', 'Upload your Instagram data (.zip) to unlock this tab.');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND.active,
        tabBarInactiveTintColor: BRAND.inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarStyle: shouldShowTabBar
          ? {
              backgroundColor: tabBarBackgroundColor,
              borderTopColor: tabBarBorderColor,
              borderTopWidth: StyleSheet.hairlineWidth,
              height: 88,
              paddingTop: 10,
              paddingBottom: 22,
            }
          : {
              display: 'none',
            },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="home" />,
        }}
      />
      <Tabs.Screen
        name="unfollowers"
        options={{
          title: 'Unfollowers',
          tabBarIcon: ({ color }) => <TabIcon color={color} locked={!hasUploadedZip} name="person-remove" />,
          tabBarItemStyle: { opacity: hasUploadedZip ? 1 : 0.55 },
        }}
        listeners={{
          tabPress: guardLockedTab,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <TabIcon color={color} locked={!hasUploadedZip} name="analytics" />,
          tabBarItemStyle: { opacity: hasUploadedZip ? 1 : 0.55 },
        }}
        listeners={{
          tabPress: guardLockedTab,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="settings" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: BRAND.accentCyan,
    borderRadius: 999,
    padding: 2,
  },
});
