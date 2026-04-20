import { Redirect } from 'expo-router';
import React from 'react';

import { selectIsAuthenticated, SignInScreen, useAuthStore } from '@/src/features/signin';

export default function SignInRoute(): React.ReactElement {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <SignInScreen />;
}
