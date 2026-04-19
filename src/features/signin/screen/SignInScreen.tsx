import { StyleSheet, Text, View } from "react-native";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { useAuthStore, selectAuthError, selectAuthStatus } from "../store/useAuthStore";
import { useSignInViewModel } from "../viewmodels/SignInViewModel";

export function SignInScreen(): React.ReactElement {
  const { isReady, isPending, handleGoogleSignIn } = useSignInViewModel();
  const status = useAuthStore(selectAuthStatus);
  const error = useAuthStore(selectAuthError);

  const busy = isPending || status === "authenticating";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WhoLeft</Text>
        <Text style={styles.subtitle}>
          Track who unfollowed you on Instagram — all processed privately from your export.
        </Text>
      </View>

      <View style={styles.actions}>
        <GoogleSignInButton
          onPress={handleGoogleSignIn}
          disabled={!isReady || busy}
          loading={busy}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.legal}>
          By continuing you agree to WhoLeft&apos;s terms of use and privacy policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    paddingHorizontal: 28,
    paddingTop: 96,
    paddingBottom: 48,
    justifyContent: "space-between",
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#9ca3af",
  },
  actions: {
    gap: 16,
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    textAlign: "center",
  },
  legal: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
