import type { ConfigContext, ExpoConfig } from "expo/config";

const appName = process.env.EXPO_PUBLIC_APP_NAME ?? "Saylo";
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "saylo";
const appSlug = process.env.APP_SLUG ?? "saylo";
const appVersion = process.env.APP_VERSION ?? "0.1.0";
const iosBundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER ?? "com.saylo.app";
const iosBuildNumber = process.env.IOS_BUILD_NUMBER ?? "1";
const androidPackage = process.env.ANDROID_PACKAGE ?? "com.saylo.app";
const parsedAndroidVersionCode = Number.parseInt(process.env.ANDROID_VERSION_CODE ?? "1", 10);
const androidVersionCode = Number.isNaN(parsedAndroidVersionCode) ? 1 : parsedAndroidVersionCode;
const easProjectId = process.env.EAS_PROJECT_ID ?? "replace-with-your-eas-project-id";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: appSlug,
  scheme: appScheme,
  version: appVersion,
  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: iosBundleIdentifier,
    buildNumber: iosBuildNumber,
    usesAppleSignIn: true,
  },
  android: {
    package: androidPackage,
    versionCode: androidVersionCode,
  },
  plugins: [
    "expo-router",
    "expo-apple-authentication",
    "expo-font",
    [
      "expo-notifications",
      {
        color: "#125B63",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    appName,
    appScheme,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    allowDemoAuth: process.env.EXPO_PUBLIC_ALLOW_DEMO_AUTH === "true",
    eas: {
      projectId: easProjectId,
    },
  },
});
