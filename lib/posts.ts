export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content:
      "React 19에서 달라진 핵심 기능과 실무에서 바로 적용할 수 있는 포인트를 정리했습니다.",
    author: "김코딩",
    date: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content:
      "Tailwind CSS 4의 주요 변화와 프로젝트 마이그레이션 시 확인해야 할 항목을 살펴봅니다.",
    author: "이디자인",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content:
      "Next.js 16 App Router 구조와 동적 라우팅, 서버 컴포넌트 기본 패턴을 예제로 설명합니다.",
    author: "박개발",
    date: "2026-03-25",
  },
];
