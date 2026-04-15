import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "../config";

// Required for the auth session web popup to close properly.
WebBrowser.maybeCompleteAuthSession();

export interface GoogleSignInHookResult {
  isReady: boolean;
  isPending: boolean;
  signIn: () => Promise<string | null>;
  error: string | null;
}

/**
 * Hook that wraps expo-auth-session's Google provider.
 * Returns an async `signIn` that resolves to a Google ID token
 * (to be forwarded to the backend) or `null` if the user cancelled.
 */
export function useGoogleSignIn(): GoogleSignInHookResult {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolver, setResolver] = useState<((token: string | null) => void) | null>(null);

  useEffect(() => {
    if (!response || !resolver) return;

    if (response.type === "success") {
      const idToken = response.params?.id_token ?? null;
      resolver(idToken);
    } else if (response.type === "error") {
      setError(response.error?.message ?? "Google sign-in failed");
      resolver(null);
    } else if (response.type === "dismiss" || response.type === "cancel") {
      resolver(null);
    }
    setResolver(null);
    setIsPending(false);
  }, [response, resolver]);

  const signIn = async (): Promise<string | null> => {
    if (!request) return null;
    setError(null);
    setIsPending(true);
    return new Promise<string | null>((resolve) => {
      setResolver(() => resolve);
      void promptAsync();
    });
  };

  return {
    isReady: Boolean(request),
    isPending,
    signIn,
    error,
  };
}
