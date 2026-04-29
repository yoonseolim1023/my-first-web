# 🤖 GitHub Copilot 코딩 규칙

> 이 파일은 AI(Copilot)가 코드를 생성할 때 자동으로 읽는 규칙입니다.
> 아래 규칙을 지키면 프로젝트 전체가 일관된 스타일을 유지할 수 있습니다.

---

## 📦 기술 스택 (Tech Stack)

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 16.2.1 | 웹 프레임워크 (App Router 전용) |
| React | 19.2.4 | UI 라이브러리 |
| TypeScript | 최신 | 타입 안전성 |
| Tailwind CSS | 4 | 스타일링 |
| shadcn/ui | 최신 | UI 컴포넌트 라이브러리 |

---

## 🗂️ 폴더 구조 규칙

```
app/           ← 모든 페이지와 라우트를 여기에 만든다
components/    ← 커스텀 컴포넌트 (shadcn/ui 제외)
components/ui/ ← shadcn/ui가 자동으로 설치하는 폴더 (직접 수정 금지)
```

**❌ 하지 말 것**: `pages/` 폴더를 만들지 않는다. 이 프로젝트는 App Router만 사용한다.

---

## ⚙️ 코딩 컨벤션 (Coding Conventions)

### 1. 서버 컴포넌트 우선
- 기본적으로 **Server Component**로 만든다.
- 아래 경우에만 파일 맨 위에 `"use client"`를 추가한다:
  - `useState`, `useEffect` 등 React 훅(hook)을 사용할 때
  - `onClick` 같은 이벤트 핸들러가 필요할 때
  - `localStorage`, `window` 등 브라우저 API를 사용할 때

```tsx
// ✅ 좋은 예: 서버 컴포넌트 (기본값)
export default function Page() {
  return <h1>Hello</h1>;
}

// ✅ 좋은 예: 클라이언트 컴포넌트가 필요한 경우
"use client";
import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. TypeScript 사용
- 모든 파일은 `.ts` 또는 `.tsx` 확장자를 사용한다.
- `any` 타입은 사용하지 않는다. 정확한 타입을 정의한다.
- Props 타입은 `type` 또는 `interface`로 명시한다.

```tsx
// ✅ 좋은 예
type ButtonProps = {
  label: string;
  onClick: () => void;
};

// ❌ 나쁜 예
function Button(props: any) { ... }
```

### 3. 라우팅 (Navigation)
- 페이지 이동 시 반드시 `next/navigation`을 사용한다.
- `next/router`는 이 프로젝트에서 동작하지 않는다.

```tsx
// ✅ 올바른 방법
import { useRouter } from "next/navigation";

// ❌ 틀린 방법 (Pages Router용, 사용 금지)
import { useRouter } from "next/router";
```

### 4. 동적 라우트의 params 처리
- App Router에서 `params`는 반드시 `await`로 받아야 한다.

```tsx
// ✅ 올바른 방법
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>{id}</div>;
}

// ❌ 틀린 방법
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>; // 오류 발생할 수 있음
}
```

---

## 🎨 스타일링 규칙 (Tailwind CSS)

### Design Tokens (요약)
- Primary color: shadcn/ui `--primary`
- Background: `--background`
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 `space-y-6`, 카드 내부 `p-6`
- Max width: `max-w-4xl mx-auto` (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

### 1. CSS 변수(디자인 토큰) 사용
- shadcn/ui가 정의한 CSS 변수를 사용한다.
- Tailwind의 기본 컬러(`blue-500`, `red-400` 등)를 직접 쓰지 않는다.

```tsx
// ✅ 좋은 예: CSS 변수 사용
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// ❌ 나쁜 예: Tailwind 기본 컬러 직접 사용
<div className="bg-white text-black">
<button className="bg-blue-500 text-white">
```

### 2. 레이아웃 규칙

| 항목 | 클래스 |
|------|--------|
| 메인 컨텐츠 최대 너비 | `max-w-4xl mx-auto` |
| 컨텐츠 간격 | `space-y-6` |
| 카드 내부 패딩 | `p-6` |
| 반응형 그리드 | `grid grid-cols-1 md:grid-cols-2` |

---

## 🧩 컴포넌트 규칙 (shadcn/ui)

### Component Rules (요약)
- UI 컴포넌트는 shadcn/ui 사용 (`components/ui/`)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 `components/` 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

- Button, Card, Input, Dialog 등 UI 요소는 **shadcn/ui 컴포넌트를 우선** 사용한다.
- shadcn/ui에 없는 경우에만 커스텀 컴포넌트를 `components/` 폴더에 만든다.

```tsx
// ✅ 좋은 예: shadcn/ui 컴포넌트 사용
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ❌ 나쁜 예: HTML 태그로 직접 버튼 만들기 (shadcn/ui가 있는데 굳이 만들 필요 없음)
<button className="bg-blue-500 px-4 py-2 rounded">클릭</button>
```

### Card 컴포넌트 기본 패턴

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyCard() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>제목</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        내용
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ AI가 자주 하는 실수 (Known AI Mistakes)

> 아래 실수들은 AI가 자주 반복하는 패턴입니다. 절대 하지 마세요.

| ❌ 잘못된 방법 | ✅ 올바른 방법 | 이유 |
|--------------|--------------|------|
| `import { useRouter } from "next/router"` | `import { useRouter } from "next/navigation"` | App Router는 `next/navigation` 사용 |
| `pages/` 폴더에 파일 생성 | `app/` 폴더에 파일 생성 | 이 프로젝트는 App Router 전용 |
| 모든 파일에 `"use client"` 추가 | 꼭 필요한 경우만 추가 | Server Component가 기본값 |
| `params.id` 직접 접근 | `const { id } = await params` | Next.js 15+ 비동기 params |
| `className="bg-blue-500"` | `className="bg-primary"` | CSS 변수(디자인 토큰) 사용 |
| `<button>` HTML 태그 직접 사용 | `<Button>` shadcn/ui 컴포넌트 사용 | 디자인 일관성 유지 |

---

## 📝 이 파일 업데이트 방법

새로운 규칙이 생기면 아래 경우에 맞춰 이 파일을 업데이트하세요:

- **새 라이브러리 추가 시** → Tech Stack 표에 추가
- **디자인 토큰 변경 시** → 스타일링 규칙 섹션 업데이트  
- **AI가 같은 실수를 반복할 때** → Known AI Mistakes 표에 추가