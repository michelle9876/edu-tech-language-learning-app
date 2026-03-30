# edu-tech-language-learning-app

Lingua Bridge is a cross-platform English/Korean learning MVP built with Expo React Native, Supabase, and OpenAI Responses API.

## Included in this scaffold

- Google and Apple sign-in entry points
- Onboarding for native language, target language, level, timezone, and notification time
- Curriculum, lesson detail, saved cards, and three review game modes
- Supabase schema with RLS for profiles, progress, cards, and push tokens
- Edge Functions for curriculum import, daily content generation, push dispatch, and account deletion
- OpenAI Structured Outputs contracts for `LessonCardSet` and `DailyContentPack`

## Project layout

- `app/`: Expo Router screens
- `src/`: UI, state, mock data, repositories, and shared contracts
- `supabase/`: SQL migration, seed import example, and Edge Functions
- `docs/`: architecture, content import notes, deployment checklist, release-value guide, and launch profile

## Local setup

1. Install Node.js 22+ and Expo CLI tooling.
2. Copy `.env.example` to `.env` and provide Expo public values.
3. Create the Supabase project, then copy the URL and anon key into `.env`.
4. Create `supabase/.env.local` with server-side secrets:

```bash
cp supabase/.env.local.example supabase/.env.local
```

5. Install app dependencies:

```bash
npm install
npx expo install --fix
```

6. Start the app:

```bash
npm run start
```

Also update the build-specific values in `.env` before your first release build:

- `APP_SLUG`
- `APP_VERSION`
- `IOS_BUNDLE_IDENTIFIER`
- `IOS_BUILD_NUMBER`
- `ANDROID_PACKAGE`
- `ANDROID_VERSION_CODE`
- `EAS_PROJECT_ID`

## Supabase setup

1. Install the Supabase CLI.
2. Link the local folder to your project.
3. Push the database migration:

```bash
supabase db push
```

4. Deploy functions:

```bash
supabase functions deploy daily-content
supabase functions deploy dispatch-notifications
supabase functions deploy import-curriculum
supabase functions deploy delete-account
```

5. Create a scheduled job for `dispatch-notifications` in the Supabase dashboard.

## Deployment notes

- Review `docs/deployment-checklist.md` before the first internal or store build.
- Review `docs/release-values.md` for recommended first-release identifiers and versioning.
- Review `docs/launch-profile.md` for the recommended app/store naming set.
- Use `.env.production.example` as the starting point for your first release configuration.
- Use `supabase/.env.local.example` as the server-side secret template for local function development and deployment prep.
- Release identifiers and build numbers now come from `.env` through `app.config.ts`.

## OpenAI model usage

- `gpt-5.4`: curriculum normalization and high-stakes quality review
- `gpt-5-mini`: daily content, card generation, and quiz generation
- `gpt-5-nano`: tagging, dedupe checks, ranking, and lightweight classification

As of March 30, 2026, the scaffold defaults match current OpenAI docs naming for GPT-5 family models. Override them with `OPENAI_*_MODEL` env vars if you pin snapshots.

The Edge Functions default to `store: false` and use Structured Outputs via `text.format`.

## App store note

If you keep Google login enabled on iOS, you should also keep Apple login enabled to satisfy App Store guideline 4.8.
