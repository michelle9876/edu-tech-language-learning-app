# Deployment Checklist

Use this checklist before the first internal build, TestFlight upload, or Play Console internal release.

## 1. Local app setup

- Install Node.js 22+.
- Run `npm install`.
- Run `npx expo install --fix`.
- Copy `.env.example` to `.env` and fill in the Expo public values.
- Confirm `EXPO_PUBLIC_APP_SCHEME` matches the redirect scheme you will register for OAuth.

## 2. Supabase project setup

- Create a Supabase project for this app.
- Copy `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` into `.env`.
- Copy `supabase/.env.local.example` to `supabase/.env.local`.
- Fill in `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and any model overrides in `supabase/.env.local`.
- Run `supabase db push`.
- Deploy Edge Functions:

```bash
supabase functions deploy daily-content
supabase functions deploy dispatch-notifications
supabase functions deploy import-curriculum
supabase functions deploy delete-account
```

## 3. OAuth setup

- Create Google OAuth credentials for Expo/native deep linking.
- Add the app redirect URI using the custom scheme from `app.config.ts`.
- Enable Apple Sign In for the iOS app identifier.
- Confirm both Google and Apple are enabled in Supabase Auth providers.
- Test sign-in on a real iPhone and Android device.

## 4. Push notifications

- Set up Expo push credentials through EAS.
- Configure APNs for iOS.
- Configure FCM for Android.
- Create the scheduled Supabase job that invokes `dispatch-notifications`.
- Verify one device can receive the primary and secondary daily notifications.

## 5. OpenAI readiness

- Confirm `OPENAI_API_KEY` is set only in `supabase/.env.local` or deployed function secrets.
- Keep `store: false` enabled for Responses API requests unless you intentionally want stored responses.
- Verify `OPENAI_DAILY_CONTENT_PROMPT_ID` and `OPENAI_CARD_SET_PROMPT_ID` if you use prompt templates.
- Run a test call to `daily-content` and confirm the JSON payload matches the schema.

## 6. Content readiness

- Replace or extend `supabase/seed/sample-curriculum.json` with your real curriculum payload.
- Import production curriculum with the `import-curriculum` function.
- Confirm English learner and Korean learner tracks both render correctly.
- Spot-check saved cards, lesson completion, and game scoring with production-like content.

## 7. Build configuration

- Set the final bundle IDs/package names in `app.config.ts`.
- Configure EAS project and environment variables.
- Run at least one `eas build` for iOS and Android.
- Confirm the app scheme, deep linking, and auth redirect flow still work in release builds.

## 8. Store readiness

- Add privacy policy and support URLs.
- Add account deletion entry points in-app and document the deletion flow.
- Ensure Apple Sign In remains available when Google Sign In is offered on iOS.
- Prepare screenshots, metadata, app description, and age rating answers.

## 9. Release QA

- Onboarding stores the correct language pair and level.
- Curriculum filters by selected target language and level.
- Duplicate saved cards do not create extra records.
- Game sessions update mastery consistently.
- Daily content cache respects the user's local timezone.
- Account deletion removes the authenticated user and related rows.

## 10. Analytics and operations

- Define dashboards for onboarding completion, lesson completion, card save rate, notification open rate, and D1/D7 retention.
- Add error tracking before inviting external testers.
- Decide who owns curriculum import, prompt updates, and push schedule monitoring.
