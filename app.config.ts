import type { ConfigContext, ExpoConfig } from "expo/config";

const appName = process.env.EXPO_PUBLIC_APP_NAME ?? "Lingua Bridge";
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "linguabridge";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: "lingua-bridge",
  scheme: appScheme,
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.dnotitia.linguabridge",
    usesAppleSignIn: true,
  },
  android: {
    package: "com.dnotitia.linguabridge",
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
      projectId: "replace-with-your-eas-project-id",
    },
  },
});
