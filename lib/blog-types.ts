// 공유 타입 — 서버/클라이언트 양쪽에서 안전하게 임포트 가능

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: string;
};
