// Entities
export type { AuthUser, OnboardingStatus, SignInResult } from "./entities";

// Store (public selectors + store hook)
export {
  useAuthStore,
  selectIsAuthenticated,
  selectAuthUser,
  selectAuthStatus,
  selectAuthError,
} from "./store/useAuthStore";

// ViewModel (for screens that want to trigger sign-in)
export { useSignInViewModel } from "./viewmodels/SignInViewModel";

// Screen
export { SignInScreen } from "./screen/SignInScreen";

// Components (re-export the button for reuse)
export { GoogleSignInButton } from "./components/GoogleSignInButton";
