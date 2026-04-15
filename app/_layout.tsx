import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Href, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { selectIsAuthenticated, useAuthStore } from '@/src/features/signin';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    const inSignIn = (segments[0] as string | undefined) === 'signin';
    if (!isAuthenticated && !inSignIn) {
      router.replace('/signin' as Href);
    } else if (isAuthenticated && inSignIn) {
      router.replace('/(tabs)' as Href);
    }
  }, [isAuthenticated, segments, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGate />
      <Stack>
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
