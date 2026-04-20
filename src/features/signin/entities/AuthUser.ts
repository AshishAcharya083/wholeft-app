/**
 * Authenticated user profile as returned by the backend `/users/signin` endpoint.
 */
export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  onboardingStatus: OnboardingStatus;
}

export type OnboardingStatus = "pending" | "complete";

export interface SignInResult {
  user: AuthUser;
  isNewUser: boolean;
}
