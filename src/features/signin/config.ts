/**
 * Sign-in feature configuration.
 *
 * Values come from app.config.ts via expo.extra, which selects dev vs prod
 * based on APP_ENV / EAS_BUILD_PROFILE. See app.config.ts for the source of truth.
 */

import Constants from "expo-constants";

type SigninExtra = {
  env?: "dev" | "prod";
  googleIosClientId?: string;
  googleAndroidClientId?: string;
  googleWebClientId?: string;
  apiBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as SigninExtra;

function required(name: keyof SigninExtra): string {
  const value = extra[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `Missing ${String(name)} in expo.extra. Check app.config.ts and rebuild the app.`,
    );
  }
  return value;
}

export const APP_ENV: "dev" | "prod" = extra.env ?? "dev";
export const GOOGLE_IOS_CLIENT_ID = required("googleIosClientId");
export const GOOGLE_ANDROID_CLIENT_ID = required("googleAndroidClientId");
export const GOOGLE_WEB_CLIENT_ID = required("googleWebClientId");
export const API_BASE_URL = required("apiBaseUrl");
