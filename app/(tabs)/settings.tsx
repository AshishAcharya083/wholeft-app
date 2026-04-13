import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1a1d23' : '#f7f7f7' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#303338' }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#A7AFBE' : '#666B74' }]}>Coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
});
