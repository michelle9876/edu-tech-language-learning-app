# Release Values

These are the recommended first-release identifiers for this project.

## Recommended defaults

- App name: `Lingua Bridge`
- Slug: `lingua-bridge`
- URL scheme: `linguabridge`
- iOS bundle identifier: `com.dnotitia.linguabridge`
- Android package: `com.dnotitia.linguabridge`
- Initial marketing version: `1.0.0`
- Initial iOS build number: `1`
- Initial Android version code: `1`

## Why these values

- `com.dnotitia.linguabridge` matches the existing project naming already used in the scaffold.
- `linguabridge` is short, readable, and works well for OAuth redirect schemes.
- Starting at `1.0.0` is cleaner if this repo is moving from prototype to first real distribution.

## Values you can usually keep

- `APP_SLUG=lingua-bridge`
- `EXPO_PUBLIC_APP_NAME=Lingua Bridge`
- `EXPO_PUBLIC_APP_SCHEME=linguabridge`

## Values you may want to change before store submission

- `IOS_BUNDLE_IDENTIFIER`
- `ANDROID_PACKAGE`
- `APP_VERSION`
- `IOS_BUILD_NUMBER`
- `ANDROID_VERSION_CODE`
- `EAS_PROJECT_ID`

## Suggested first-release .env values

```env
EXPO_PUBLIC_APP_NAME=Lingua Bridge
EXPO_PUBLIC_APP_SCHEME=linguabridge
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_ALLOW_DEMO_AUTH=false

APP_SLUG=lingua-bridge
APP_VERSION=1.0.0
IOS_BUNDLE_IDENTIFIER=com.dnotitia.linguabridge
IOS_BUILD_NUMBER=1
ANDROID_PACKAGE=com.dnotitia.linguabridge
ANDROID_VERSION_CODE=1
EAS_PROJECT_ID=replace-with-your-eas-project-id
```

## Versioning rule of thumb

- Increase `IOS_BUILD_NUMBER` every iOS build you upload.
- Increase `ANDROID_VERSION_CODE` every Android build you upload.
- Change `APP_VERSION` only when you want a new public-facing version like `1.0.1` or `1.1.0`.
