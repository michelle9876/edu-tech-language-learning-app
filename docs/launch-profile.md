# Launch Profile

This is the recommended launch naming set for the first public release.

## Recommended choice

- Product brand: `Saylo`
- Home screen app name: `Saylo`
- App Store title: `Saylo: English & Korean`
- Play Store title: `Saylo: English & Korean`
- URL scheme: `saylo`
- Slug: `saylo`
- iOS bundle identifier: `com.saylo.app`
- Android package: `com.saylo.app`

## Why this is the best default

- `Saylo` is short enough for the home screen.
- The store title adds search-friendly context without changing the internal app brand.
- The English and Korean focus is explicit, which is useful for the first release.
- The identifiers are clean, brand-owned, and ready to use across Supabase, Google OAuth, Apple Sign In, and EAS.

## Recommended first-release env set

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

Create or link the EAS project first with `npx --yes eas-cli project:init`, then copy the generated UUID into `EAS_PROJECT_ID`.

## Good backup options

### Option B

- Product brand: `Saylo Daily`
- Home screen app name: `Saylo Daily`
- Store title: `Saylo Daily: English & Korean`

Use this only if daily habit positioning becomes the main message.

### Option C

- Product brand: `Saylo Loop`
- Home screen app name: `Saylo Loop`
- Store title: `Saylo Loop: English & Korean`

Use this only if you want a more practice-first or streak-first brand extension.

## Keep these consistent

- Supabase redirect URLs like `saylo://**`
- Google OAuth redirect settings
- Apple Sign In bundle identifier `com.saylo.app`
- EAS project environment variables
- Store listing title and screenshots
