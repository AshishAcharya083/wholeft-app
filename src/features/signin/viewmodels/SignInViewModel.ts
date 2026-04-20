import { useCallback } from "react";
import { signInWithGoogle } from "../services/AuthApiService";
import { useGoogleSignIn } from "../services/GoogleSignInService";
import { useAuthStore } from "../store/useAuthStore";

export interface SignInViewModel {
  isReady: boolean;
  isPending: boolean;
  googleError: string | null;
  handleGoogleSignIn: () => Promise<void>;
}

/**
 * Orchestrates the Google sign-in flow:
 *   1. Prompt Google auth → receive ID token
 *   2. POST token to backend `/users/signin`
 *   3. Store returned UserProfile in the auth store
 */
export function useSignInViewModel(): SignInViewModel {
  const { isReady, isPending, signIn, error } = useGoogleSignIn();
  const setAuthenticating = useAuthStore((s) => s.setAuthenticating);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setError = useAuthStore((s) => s.setError);

  const handleGoogleSignIn = useCallback(async (): Promise<void> => {
    setAuthenticating();
    try {
      const idToken = await signIn();
      if (!idToken) {
        setError("Sign-in was cancelled");
        return;
      }
      const { user } = await signInWithGoogle(idToken);
      setAuthenticated(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      setError(message);
    }
  }, [signIn, setAuthenticating, setAuthenticated, setError]);

  return {
    isReady,
    isPending,
    googleError: error,
    handleGoogleSignIn,
  };
}
