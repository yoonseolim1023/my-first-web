# ARCHITECTURE

## 1. 프로젝트 목표
- 개인 블로그 운영을 위한 Next.js 기반 웹앱 구축
- 글 작성과 공개, 열람에 필요한 최소 기능 제공
- 추후 확장 가능한 정보 구조와 라우팅 설계

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 현재 설치 기준 (package.json): Next.js 16.2.1, @supabase/supabase-js 2.105.1, @supabase/ssr 0.10.2
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## 2. 페이지 맵 (URL 구조 포함)
- `/`: 홈 (최근 글 목록)
- `/posts`: 글 목록
- `/posts/[id]`: 글 상세
- `/posts/new`: 글 작성
- `/mypage`: 마이페이지

## 3. 유저 플로우

### 글 읽기
- 홈 또는 글 목록에서 글 선택
- 글 상세 페이지에서 본문 확인

### 글 작성
- 글 작성 페이지로 이동
- 제목/본문 입력
- 작성 완료 후 글 상세로 이동

### 로그인/회원가입
- 이메일/비밀번호로 로그인 또는 회원가입
- 로그인 성공 시 보호 라우트 접근 가능
- 보호 라우트는 `middleware.ts`에서 처리

### 게시글 CRUD
- 글 목록에서 게시글 선택
- 상세에서 작성자만 수정/삭제 UI 확인
- 작성 페이지에서 새 글 저장
- 실제 권한은 RLS가 강제

### 마이페이지
- 마이페이지 이동
- 내 정보 및 작성 글 확인

## 컴포넌트 구조
### 디렉터리 기준
- `app/`: 라우트와 페이지 조합
- `components/ui/`: shadcn/ui 컴포넌트 (Button, Card, Input, Dialog)
- `components/`: 페이지 공용 컴포넌트 (헤더, 리스트, 폼 섹션 등)

### shadcn/ui 활용 위치
- Button: 글 작성/저장/취소, 마이페이지 액션
- Card: 글 목록 아이템, 글 상세, 마이페이지 정보 블록
- Input: 글 작성 폼 (제목, 검색, 프로필 필드)
- Dialog: 글 삭제 확인, 작성 취소 확인, 간단 알림

## 데이터 모델 (Ch8 스키마)
### profiles
- `id` (PK, auth.users 참조)
- `username`
- `avatar_url`
- `role` (user | counselor)

### posts
- `id` (PK)
- `user_id` (FK -> profiles.id)
- `title`
- `content`
- `created_at`

### 관계
- profiles 1 : N posts
- 한 유저는 여러 글을 작성할 수 있고, 각 글은 한 명의 작성자를 가진다.

## 인증/보안 규칙 (Ch9)

- 이메일/비밀번호 인증만 사용한다. (소셜 로그인 추가 금지)
- 로그인은 `signInWithPassword`만 사용한다. (`auth.signIn()` 사용 금지)
- App Router만 사용한다. (`pages/`, `next/router` 사용 금지)
- 보호 라우트는 `middleware.ts`로 처리한다.
- `service_role` 키는 클라이언트에 절대 두지 않는다.
- 환경변수 이름은 Ch8 기준을 유지한다:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase 대시보드 메뉴 안내는 2026년 5월 기준이다.

## RLS 규칙 (Ch11/12)

- RLS는 Supabase CLI 마이그레이션으로만 관리한다. (SQL Editor 직접 실행 금지)
- posts 테이블 정책은 `user_id = auth.uid()` 기준으로 작성한다.
  - SELECT: `true` (전체 공개)
  - INSERT/UPDATE/DELETE: `auth.uid() = user_id` (본인 확인)
- 보안 계층화: UI 분기는 UX 용동(버튼 숨김 등)이며, 실제 보안은 RLS가 최종 강제한다.
- `service_role` 키는 클라이언트에서 절대 사용하지 않는다.
- 빌드 전 ESLint 및 TypeScript 검증을 통해 코드 품질을 유지한다.
