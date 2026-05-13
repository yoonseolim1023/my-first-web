# Project Rules

## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Supabase Auth (email/password only)

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준 (package.json): Next.js 16.2.1, @supabase/supabase-js 2.105.1, @supabase/ssr 0.10.2
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## Routing

- App Router only. Do not create `pages/`.
- Use `next/navigation` (never `next/router`).
- Dynamic route params must be awaited.

## Supabase Auth (Ch9)

- Email/password only. Do not add social logins.
- Use `signInWithPassword` for sign-in. Do not use `auth.signIn()`.
- Use `middleware.ts` for protected routes.
- Never expose `service_role` keys to clients.
- Env vars (Ch8): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Supabase dashboard menu guidance is based on May 2026.

## UI Rules

- Prefer shadcn/ui components in `components/ui/`.
- Use design tokens (CSS variables), not Tailwind default colors.
