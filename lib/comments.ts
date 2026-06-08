import { createClient } from "@/lib/supabase/client";
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

/** 클라이언트 컴포넌트: 댓글 추가 */
export async function addComment(
  postId: string,
  userId: string,
  content: string
): Promise<{ data: Comment | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: userId, content })
    .select("id, post_id, user_id, content, created_at")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: { ...data, author: "" }, error: null };
}

/** 클라이언트 컴포넌트: 댓글 삭제 */
export async function deleteComment(commentId: string): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  return error ? error.message : null;
}
