# 🤖 GitHub Copilot 코딩 규칙

이 문서는 Copilot이 이 프로젝트의 코드를 만들 때 따라야 할 기본 규칙입니다.
초보자가 읽어도 이해할 수 있게, 꼭 필요한 내용만 간단히 정리합니다.

---

## 1) 프로젝트 기본 규칙

- 이 프로젝트는 **Next.js App Router만 사용**합니다.
- 페이지와 라우트는 반드시 `app/` 폴더 안에 만듭니다.
- `pages/` 폴더는 만들지 않습니다.
- 기본은 **Server Component**입니다.
- 정말 필요한 경우에만 `"use client"`를 붙입니다.

### `"use client"`가 필요한 경우

- `useState`, `useEffect` 같은 React 훅을 사용할 때
- 버튼 클릭 같은 이벤트가 필요할 때
- `window`, `localStorage` 같은 브라우저 API를 사용할 때

### App Router에서 자주 쓰는 규칙

- 페이지 이동은 `next/navigation`을 사용합니다.
- `next/router`는 사용하지 않습니다.
- 동적 라우트의 `params`는 `await`해서 꺼냅니다.

---

## 2) TypeScript 사용 규칙

- 모든 코드는 `.ts` 또는 `.tsx` 파일로 작성합니다.
- `any`는 되도록 사용하지 않습니다.
- 값의 모양이 보이도록 `type` 또는 `interface`로 타입을 적습니다.
- Props도 꼭 타입을 정의합니다.

### 좋은 예

- `ButtonProps`처럼 이름이 분명한 타입을 만든다.
- 함수 인자와 반환값이 무엇인지 알 수 있게 작성한다.

### 피해야 할 예

- `props: any`처럼 아무 타입이나 쓰는 것
- 타입을 생략해서 나중에 오류가 나기 쉬운 코드

---

## 3) Tailwind CSS 사용 규칙

- 스타일은 기본적으로 **Tailwind CSS**로 작성합니다.
- 색상은 Tailwind 기본 색상보다 **디자인 토큰(CSS 변수)**을 우선 사용합니다.
- 예: `bg-background`, `text-foreground`, `bg-primary`
- `blue-500`, `red-500` 같은 기본 색은 특별한 이유가 없으면 쓰지 않습니다.

### 레이아웃 기본값

- 메인 영역은 `max-w-4xl mx-auto`
- 컨텐츠 간격은 `space-y-6`
- 카드 내부 여백은 `p-6`
- 반응형 그리드는 `grid grid-cols-1 md:grid-cols-2`

---

## 4) shadcn/ui 사용 규칙

- UI 컴포넌트는 가능하면 **shadcn/ui**를 먼저 사용합니다.
- 자주 쓰는 컴포넌트: `Button`, `Card`, `Input`, `Dialog`
- 직접 HTML로 예쁘게 만드는 것보다, 이미 있는 UI 컴포넌트를 우선합니다.
- 커스텀 컴포넌트는 `components/` 폴더에 둡니다.
- `components/ui/`는 shadcn/ui 전용으로 생각합니다.

### 카드 예시 규칙

- 카드에는 보통 `rounded-lg shadow-sm`를 사용합니다.
- 내용은 `CardHeader`, `CardContent`처럼 나눠서 작성합니다.

---

## 5) AI가 자주 틀리는 부분

Copilot이 아래 실수를 하지 않도록 주의합니다.

| 잘못된 예 | 올바른 예 | 이유 |
|---|---|---|
| `next/router` 사용 | `next/navigation` 사용 | App Router 전용이기 때문 |
| `pages/` 폴더 생성 | `app/` 폴더 사용 | 이 프로젝트는 App Router만 사용 |
| 모든 파일에 `"use client"` 추가 | 필요한 파일만 추가 | 불필요한 클라이언트 번들을 막기 위해 |
| `params.id` 바로 사용 | `const { id } = await params` | App Router 방식에 맞추기 위해 |
| `bg-blue-500` 사용 | `bg-primary` 사용 | 디자인 토큰을 쓰기 위해 |
| `<button>`만 직접 작성 | `Button` 컴포넌트 사용 | UI 일관성을 위해 |

---

## 6) Copilot이 기억해야 할 한 줄 규칙

- App Router를 우선한다.
- 서버 컴포넌트를 기본으로 한다.
- TypeScript로 정확하게 작성한다.
- Tailwind는 디자인 토큰을 우선한다.
- UI는 shadcn/ui를 먼저 사용한다.
- 헷갈리면 단순하고 안전한 방법을 선택한다.