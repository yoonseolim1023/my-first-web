# ARCHITECTURE

## 1. 프로젝트 목표
- 개인 블로그 운영을 위한 Next.js 기반 웹앱 구축
- 글 작성과 공개, 열람에 필요한 최소 기능 제공
- 추후 확장 가능한 정보 구조와 라우팅 설계

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

## 데이터 모델
### users
- `id` (PK)
- `email` (unique)
- `name`
- `avatar_url` (optional)
- `created_at`
- `updated_at`

### posts
- `id` (PK)
- `author_id` (FK -> users.id)
- `title`
- `content`
- `status` (draft | published)
- `created_at`
- `updated_at`
- `published_at` (optional)

### 관계
- users 1 : N posts
- 한 유저는 여러 글을 작성할 수 있고, 각 글은 한 명의 작성자를 가진다.
