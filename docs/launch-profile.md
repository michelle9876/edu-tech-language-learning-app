# Launch Profile

This is the recommended launch naming set for the first public release.

## Recommended choice

- Product brand: `Lingua Bridge`
- Home screen app name: `Lingua Bridge`
- App Store title: `Lingua Bridge: English & Korean`
- Play Store title: `Lingua Bridge: English & Korean`
- URL scheme: `linguabridge`
- Slug: `lingua-bridge`
- iOS bundle identifier: `com.dnotitia.linguabridge`
- Android package: `com.dnotitia.linguabridge`

## Why this is the best default

- `Lingua Bridge` is short enough for the home screen.
- The store title adds search-friendly context without changing the internal app brand.
- The English and Korean focus is explicit, which is useful for the first release.
- The identifiers already match the scaffold, so there is no migration work right now.

## Recommended first-release env set

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

## Good backup options

### Option B

- Product brand: `Bridge English Korean`
- Home screen app name: `Bridge EK`
- Store title: `Bridge EK: English & Korean`

Use this only if you want a more keyword-heavy brand.

### Option C

- Product brand: `Lingua Bridge Daily`
- Home screen app name: `LB Daily`
- Store title: `Lingua Bridge Daily: English & Korean`

Use this only if daily practice and streaks become the main positioning.

## Keep these consistent

- Supabase redirect URLs
- Google OAuth redirect settings
- Apple Sign In bundle identifier
- EAS project environment variables
- Store listing title and screenshots
