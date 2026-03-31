# Release Values

These are the recommended first-release identifiers for this project.

## Recommended defaults

- App name: `Saylo`
- Store title: `Saylo: English & Korean`
- Slug: `saylo`
- URL scheme: `saylo`
- iOS bundle identifier: `com.saylo.app`
- Android package: `com.saylo.app`
- Initial marketing version: `1.0.0`
- Initial iOS build number: `1`
- Initial Android version code: `1`

## Why these values

- `Saylo` is short, brandable, and easy to pronounce in both English and Korean contexts.
- `saylo` is short, readable, and works well for OAuth redirect schemes like `saylo://**`.
- `com.saylo.app` keeps the release identifier neutral and brand-owned without legacy namespace baggage.
- Starting at `1.0.0` is cleaner if this repo is moving from prototype to first real distribution.

## Values you can usually keep

- `APP_SLUG=saylo`
- `EXPO_PUBLIC_APP_NAME=Saylo`
- `EXPO_PUBLIC_APP_SCHEME=saylo`

## Values you may want to change before store submission

- `IOS_BUNDLE_IDENTIFIER`
- `ANDROID_PACKAGE`
- `APP_VERSION`
- `IOS_BUILD_NUMBER`
- `ANDROID_VERSION_CODE`
- `EAS_PROJECT_ID`

## Suggested first-release .env values

```env
EXPO_PUBLIC_APP_NAME=Saylo
EXPO_PUBLIC_APP_SCHEME=saylo
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_ALLOW_DEMO_AUTH=false

APP_SLUG=saylo
APP_VERSION=1.0.0
IOS_BUNDLE_IDENTIFIER=com.saylo.app
IOS_BUILD_NUMBER=1
ANDROID_PACKAGE=com.saylo.app
ANDROID_VERSION_CODE=1
EAS_PROJECT_ID=
```

Run `npx --yes eas-cli project:init` before filling in `EAS_PROJECT_ID`. Use the UUID created by EAS instead of a placeholder string.

## Versioning rule of thumb

- Increase `IOS_BUILD_NUMBER` every iOS build you upload.
- Increase `ANDROID_VERSION_CODE` every Android build you upload.
- Change `APP_VERSION` only when you want a new public-facing version like `1.0.1` or `1.1.0`.
