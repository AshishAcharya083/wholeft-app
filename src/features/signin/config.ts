/**
 * Sign-in feature configuration.
 *
 * OAuth client IDs come from Google Cloud Console → APIs & Services → Credentials.
 * Create one OAuth 2.0 Client ID per platform (iOS, Android, Web).
 *
 * The backend API base URL points to the .NET backend; override per environment.
 * For local dev against a backend running on your machine, use your LAN IP
 * (e.g. http://192.168.1.10:8080) so a physical device can reach it.
 */

import Constants from "expo-constants";

type SigninExtra = {
  googleIosClientId?: string;
  googleAndroidClientId?: string;
  googleWebClientId?: string;
  apiBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as SigninExtra;

export const GOOGLE_IOS_CLIENT_ID = extra.googleIosClientId ?? "";
export const GOOGLE_ANDROID_CLIENT_ID = extra.googleAndroidClientId ?? "";
export const GOOGLE_WEB_CLIENT_ID = extra.googleWebClientId ?? "";

// Default to Cloud Run dev URL; override in app.json → expo.extra.apiBaseUrl.
export const API_BASE_URL =
  extra.apiBaseUrl ?? "http://localhost:8080";
