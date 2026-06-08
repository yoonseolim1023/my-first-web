// Server-only: uses next/headers via createServerSupabaseClient
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: string;
};

/** 서버 컴포넌트: 댓글 목록 + 작성자명 조회 */
export async function getComments(postId: string): Promise<Comment[]> {
  const supabase = await createServerSupabaseClient();
  const { data: commentsData, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !commentsData) return [];

  const userIds = [...new Set(commentsData.map((c) => c.user_id))];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  const profileMap = new Map<string, string>();
  for (const p of profilesData ?? []) {
    profileMap.set(p.id, p.username ?? "익명");
  }

  return commentsData.map((c) => ({
    ...c,
    author: profileMap.get(c.user_id) ?? "익명",
  }));
}
