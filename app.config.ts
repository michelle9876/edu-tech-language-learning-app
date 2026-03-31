import fs from "node:fs";
import path from "node:path";
import type { ConfigContext, ExpoConfig } from "expo/config";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = trimmedLine.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const appName = process.env.EXPO_PUBLIC_APP_NAME ?? "Saylo";
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "saylo";
const appSlug = process.env.APP_SLUG ?? "saylo";
const appVersion = process.env.APP_VERSION ?? "0.1.0";
const iosBundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER ?? "com.saylo.app";
const iosBuildNumber = process.env.IOS_BUILD_NUMBER ?? "1";
const androidPackage = process.env.ANDROID_PACKAGE ?? "com.saylo.app";
const parsedAndroidVersionCode = Number.parseInt(process.env.ANDROID_VERSION_CODE ?? "1", 10);
const androidVersionCode = Number.isNaN(parsedAndroidVersionCode) ? 1 : parsedAndroidVersionCode;
const configuredEasProjectId = process.env.EAS_PROJECT_ID?.trim();
const easProjectId = configuredEasProjectId && uuidPattern.test(configuredEasProjectId)
  ? configuredEasProjectId
  : undefined;

export default ({ config }: ConfigContext): ExpoConfig =>
  ({
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
      ...(easProjectId
        ? {
            eas: {
              projectId: easProjectId,
            },
          }
        : {}),
    },
  }) as ExpoConfig;
