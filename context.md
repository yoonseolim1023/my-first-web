# Context — my-first-web 프로젝트 상태

> ⚠️ 이 파일은 **프로젝트의 현재 상태**를 기록합니다.
> 작업 세션을 마칠 때마다 업데이트하세요.
> AI에게 참조시킬 때는 대화창에 직접 첨부하거나 "context.md를 읽어줘"라고 요청하세요.

---

## 📅 현재 상태

- **마지막 작업일**: 2026-06-01
- **완료된 작업**:
  - 홈 페이지 (`app/page.tsx`) — Supabase 최근 글 조회 연결
  - 레이아웃 (`app/layout.tsx`) — 공통 헤더/푸터 포함
  - 포스트 목록/상세/작성 페이지 (`app/posts/page.tsx`, `app/posts/[id]/`, `app/posts/new/`)
  - 포스트 수정/삭제 UI (`components/PostOwnerActions.tsx`)
  - 로그인/회원가입 페이지 (`app/login/`, `app/signup/`)
  - AuthProvider/`useAuth` 컨텍스트 구성
  - Supabase 브라우저 클라이언트 (`lib/supabase/client.ts`)
  - Supabase 서버 클라이언트 (`lib/supabase/server.ts`)
  - Supabase Auth 함수 (`lib/auth.ts`)
  - Supabase 스키마 작성 (profiles, posts)
  - RLS 정책 마이그레이션 적용 (posts)
  - 원격 Supabase migration history 정합성 복구 및 `db push` 성공
  - shadcn/ui 설치 — Button, Card, Input, Dialog 컴포넌트
  - `.github/copilot-instructions.md` 코딩 규칙 작성
  - Ch9 기준 문서 정비 (Auth/버전 정책)
  - Ch10/Ch11 기준 문서 정비 (CRUD/RLS)
- **진행 중**:
  - 마이페이지
- **미착수**:
  - 댓글 기능

---

## 🗂️ 현재 폴더 구조

```
app/
  layout.tsx          # 공통 레이아웃 (헤더/푸터)
  page.tsx            # 홈 페이지
  loading.tsx         # 전역 로딩 스켈레톤
  error.tsx           # 전역 에러 UI
  globals.css         # 글로벌 스타일 + Tailwind CSS 4 설정
  login/              # 로그인
  signup/             # 회원가입
  posts/
    page.tsx          # 포스트 목록
    loading.tsx       # 목록 로딩
    error.tsx         # 목록 에러
    [id]/             # 포스트 상세
      page.tsx        # 포스트 상세
      loading.tsx     # 상세 로딩
      error.tsx       # 상세 에러
    new/              # 포스트 작성
components/
  AuthNav.tsx         # 헤더 인증 네비게이션
  PostOwnerActions.tsx# 작성자 수정/삭제 UI
  ui/                 # shadcn/ui 자동 생성 (수정 금지)
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
contexts/
  AuthContext.tsx     # 인증 컨텍스트
lib/
  auth.ts             # 로그인/회원가입/로그아웃 함수
  error-message.ts    # 사용자 친화적 에러 변환
  posts.ts            # 더미 데이터 (현재 미사용)
  supabase/
    client.ts         # Supabase 브라우저 클라이언트
    server.ts         # Supabase 서버 클라이언트
```

---

## ⚙️ 기술 결정 사항

- **인증**: Supabase Auth (Email) — AuthProvider 사용
- **인증 규칙**: 이메일/비밀번호만 사용, `signInWithPassword`만 사용
- **보호 라우트**: `middleware.ts`로 처리
- **상태관리**: React Context (AuthProvider)
- **이미지**: Supabase Storage 사용 예정
- **데이터베이스**: Supabase (profiles, posts 연결 완료)
- **환경변수**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **보안**: `service_role` 키는 클라이언트에 두지 않음
- **RLS 적용**: Supabase CLI 마이그레이션으로만 관리
- **RLS 정책 기준**: `posts.user_id = auth.uid()`
- **RLS 적용 대상**: `posts` 테이블
- **UI 분기**: 작성자 버튼 숨김은 UX용이며 실제 보안은 RLS가 담당
- **대시보드 기준**: Supabase 메뉴 안내는 2026년 5월 기준

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준 (package.json): Next.js 16.2.1, @supabase/supabase-js 2.105.1, @supabase/ssr 0.10.2
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

---

## 🐛 해결된 이슈

- `shadcn/ui` Button variant가 디자인 토큰과 불일치
  → `globals.css`의 `--primary` 색상 수정으로 해결
- 모바일 헤더 메뉴가 다른 요소와 겹침
  → `Sheet` 컴포넌트로 교체하여 해결

---

## 💡 알게 된 점 (프로젝트 고유 노하우)

- **Tailwind CSS 4** 설정법: `tailwind.config.js` 파일 불필요.
  `globals.css`에서 `@import "tailwindcss"` + `@theme` 블록으로 설정
- **Server Component에서 페이지 이동**: `useRouter` 사용 불가 → `redirect()` 함수 사용
- **동적 라우트 params**: `await params`로 받아야 함 (Next.js 15+)

---

## 📋 다음 작업 계획

1. 마이페이지 구현
2. 댓글 기능 설계/구현
3. RLS 우회 테스트 및 배포 검증
4. Vercel 환경변수/배포 URL 최종 확인