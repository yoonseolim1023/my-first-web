# Copilot Instructions

## Tech Stack

- **Next.js**: 16.2.1 (App Router ONLY)
- **Tailwind CSS**: 4.x
- **React**: 19.2.4
- **TypeScript**: 5.x

## Coding Conventions

- **Server Component 기본**: 모든 컴포넌트는 기본적으로 Server Component로 작성. Client Component가 필요한 경우에만 `"use client"` 지시어를 파일 최상단에 추가.
- **Tailwind CSS만 사용**: 스타일링은 반드시 Tailwind CSS만 사용. CSS Modules, styled-components, inline style 등 다른 스타일링 방식 금지.
- **App Router ONLY**: `app/` 디렉토리 기반의 App Router만 사용. `pages/` 디렉토리 기반의 Pages Router 사용 금지.

## Known AI Mistakes

> **반드시 지켜야 할 규칙들:**

1. **`next/router` 금지** → 반드시 `next/navigation`을 사용할 것.
   - ❌ `import { useRouter } from 'next/router'`
   - ✅ `import { useRouter } from 'next/navigation'`

2. **Pages Router 금지** → `pages/` 디렉토리에 라우트 파일을 생성하지 말 것. 반드시 `app/` 디렉토리를 사용.

3. **`params`는 반드시 `await` 필수** → Dynamic Route의 `params`는 Promise이므로 반드시 `await`하여 사용할 것.
   - ❌ `const { id } = params`
   - ✅ `const { id } = await params`