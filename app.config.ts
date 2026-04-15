import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Dynamic Expo config. Values in this file override app.json.
 *
 * Environment is resolved from (in order):
 *   1. process.env.APP_ENV          (manual override, e.g. APP_ENV=prod npx expo start)
 *   2. process.env.EAS_BUILD_PROFILE (set automatically during `eas build`)
 *   3. default → "dev"
 *
 * Each environment gets its own OAuth client IDs and backend API URL.
 * The iOS URL scheme (reversed iOS client ID) is baked into the native
 * build via the expo-auth-session config plugin, so it must be chosen at
 * build time — make sure APP_ENV or EAS_BUILD_PROFILE matches the target.
 */

type AppEnv = "dev" | "prod";

interface EnvConfig {
  readonly googleIosClientId: string;
  readonly googleAndroidClientId: string;
  readonly googleWebClientId: string;
  readonly apiBaseUrl: string;
  readonly iosUrlScheme: string; // reversed iOS client ID
}

const DEV: EnvConfig = {
  googleIosClientId:
    "20014286084-4131vkpg48vo8eu1n1sqs8dver6m8gt8.apps.googleusercontent.com",
  googleAndroidClientId:
    "20014286084-lib4djicftha26mt9hghf7vbeclfpec1.apps.googleusercontent.com",
  googleWebClientId:
    "20014286084-bc77ssh8hkusb45ag82qi45m5agi0i3t.apps.googleusercontent.com",
  apiBaseUrl:
    "https://wholeft-backend-20014286084.australia-southeast1.run.app",
  iosUrlScheme:
    "com.googleusercontent.apps.20014286084-4131vkpg48vo8eu1n1sqs8dver6m8gt8",
};

const PROD: EnvConfig = {
  googleIosClientId:
    "624364622659-u8pi4jios78p01j0hpidgnggvmc9bbfp.apps.googleusercontent.com",
  googleAndroidClientId:
    "624364622659-gemfedqnm7iff8numnqs38bj673a6sto.apps.googleusercontent.com",
  googleWebClientId:
    "624364622659-9rrjg8h4dfvhvhd65vndv8ageisfsns6.apps.googleusercontent.com",
  apiBaseUrl: "https://wholeft-backend-624364622659.us-central1.run.app",
  iosUrlScheme:
    "com.googleusercontent.apps.624364622659-u8pi4jios78p01j0hpidgnggvmc9bbfp",
};

function resolveEnv(): AppEnv {
  const raw = (process.env.APP_ENV ?? process.env.EAS_BUILD_PROFILE ?? "").toLowerCase();
  if (raw === "prod" || raw === "production") return "prod";
  return "dev";
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = resolveEnv();
  const envConfig = env === "prod" ? PROD : DEV;

  // Spread the static app.json config and override the dynamic bits.
  return {
    ...config,
    name: config.name ?? "wholeft",
    slug: config.slug ?? "wholeft",
    ios: {
      ...(config.ios ?? {}),
      bundleIdentifier: config.ios?.bundleIdentifier ?? "app.wholeft",
      infoPlist: {
        ...(config.ios?.infoPlist ?? {}),
        // Required by Google Sign-In: the reversed iOS client ID must be a
        // registered URL scheme so Google can redirect back into the app.
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [envConfig.iosUrlScheme],
          },
        ],
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    extra: {
      ...(config.extra ?? {}),
      env,
      googleIosClientId: envConfig.googleIosClientId,
      googleAndroidClientId: envConfig.googleAndroidClientId,
      googleWebClientId: envConfig.googleWebClientId,
      apiBaseUrl: envConfig.apiBaseUrl,
      eas: {
        projectId: "04e7bac9-df90-4998-b635-02196fa96eaa",
      },
    },
  };
};
