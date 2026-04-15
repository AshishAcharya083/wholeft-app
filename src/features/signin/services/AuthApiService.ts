import { API_BASE_URL } from "../config";
import { SignInResult } from "../entities";

interface SignInResponseBody {
  userId: string;
  email: string;
  displayName: string;
  onboardingStatus: string;
  isNewUser: boolean;
}

/**
 * Exchange a Google ID token for a backend-issued UserProfile.
 * Backend route: POST /users/signin
 */
export async function signInWithGoogle(idToken: string): Promise<SignInResult> {
  const response = await fetch(`${API_BASE_URL}/users/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Sign-in failed (${response.status}): ${text || response.statusText}`);
  }

  const body = (await response.json()) as SignInResponseBody;

  const onboardingStatus = body.onboardingStatus === "complete" ? "complete" : "pending";

  return {
    user: {
      userId: body.userId,
      email: body.email,
      displayName: body.displayName,
      onboardingStatus,
    },
    isNewUser: body.isNewUser,
  };
}
