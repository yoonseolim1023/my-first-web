# Context — my-first-web 프로젝트 상태

> ⚠️ 이 파일은 **프로젝트의 현재 상태**를 기록합니다.
> 작업 세션을 마칠 때마다 업데이트하세요.
> AI에게 참조시킬 때는 대화창에 직접 첨부하거나 "context.md를 읽어줘"라고 요청하세요.

---

## 📅 현재 상태

- **마지막 작업일**: 2026-05-13
- **완료된 작업**:
  - 홈 페이지 (`app/page.tsx`) — 기본 레이아웃 구성
  - 레이아웃 (`app/layout.tsx`) — 공통 헤더/푸터 포함
  - 포스트 목록 페이지 (`app/posts/page.tsx`)
  - shadcn/ui 설치 — Button, Card, Input, Dialog 컴포넌트
  - `.github/copilot-instructions.md` 코딩 규칙 작성
  - Ch9 기준 문서 정비 (Auth/버전 정책)
- **진행 중**:
  - 포스트 상세 페이지 (`app/posts/[id]/`) — 라우트 생성됨, 내용 미완
  - 포스트 작성 페이지 (`app/posts/new/`) — 라우트 생성됨, 미완
- **미착수**:
  - 마이페이지
  - 인증(로그인/회원가입) 화면
  - 데이터베이스 연결

---

## 🗂️ 현재 폴더 구조

```
app/
  layout.tsx          # 공통 레이아웃 (헤더/푸터)
  page.tsx            # 홈 페이지
  globals.css         # 글로벌 스타일 + Tailwind CSS 4 설정
  posts/
    page.tsx          # 포스트 목록
    [id]/             # 포스트 상세 (미완)
    new/              # 포스트 작성 (미완)
components/
  ui/                 # shadcn/ui 자동 생성 (수정 금지)
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
```

---

## ⚙️ 기술 결정 사항

- **인증**: Supabase Auth (Email) — 아직 미구현
- **인증 규칙**: 이메일/비밀번호만 사용, `signInWithPassword`만 사용
- **보호 라우트**: `middleware.ts`로 처리
- **상태관리**: React Context (AuthProvider) — 아직 미구현
- **이미지**: Supabase Storage 사용 예정
- **데이터베이스**: Supabase (아직 연결 안 됨)
- **환경변수**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **보안**: `service_role` 키는 클라이언트에 두지 않음
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

1. 포스트 상세 페이지 (`app/posts/[id]/page.tsx`) UI 구현
2. 포스트 작성 폼 (`app/posts/new/page.tsx`) 구현
3. Supabase 프로젝트 생성 및 DB 연결
4. 인증 기능 (로그인/회원가입) 구현
5. middleware.ts 보호 라우트 구성