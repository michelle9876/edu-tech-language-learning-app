# Architecture

## Mobile app

- `Expo React Native + Expo Router`
- `zustand` local store for offline-friendly lesson, card, and game state
- Supabase client for auth, profile sync, saved cards, lesson progress, and Edge Function calls

## Backend

- `Supabase Postgres`
  - public curriculum tables
  - private user profile, saved card, lesson progress, game session, push token, and daily content cache tables
- `Supabase Edge Functions`
  - `daily-content`: generate or fetch today’s structured learning pack
  - `dispatch-notifications`: scheduled job for twice-daily push delivery
  - `import-curriculum`: upsert JSON curriculum payloads and optionally generate lesson cards
  - `delete-account`: remove the authenticated user through the admin API

## AI responsibilities

- `gpt-5-mini`: daily content pack generation and lesson card generation
- `gpt-5.4`: reserved for heavier normalization and quality review workflows as the curriculum pipeline matures
- `gpt-5-nano`: intended for future ranking, tagging, and dedupe jobs

## Data flow

1. User signs in with Google or Apple.
2. App stores onboarding choices locally and syncs them into `user_profiles`.
3. Curriculum is displayed from seeded local data first, then can be replaced by imported Supabase curriculum.
4. Saved cards and lesson progress sync back to Supabase when credentials are available.
5. Daily content is requested from the `daily-content` Edge Function and cached in `daily_content_cache`.
6. A scheduled function checks each user’s timezone and preferred slot, generates content if needed, and pushes Expo notifications.
