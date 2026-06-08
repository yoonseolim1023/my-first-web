import { createClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** 서버 또는 클라이언트 공용: 좋아요 수 조회 */
export async function getLikeCount(postId: string): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) return 0;
  return count ?? 0;
}

/** 서버 컴포넌트: 현재 유저가 이미 좋아요 눌렀는지 */
export async function getHasLiked(
  postId: string,
  userId: string | undefined
): Promise<boolean> {
  if (!userId) return false;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

/** 클라이언트 컴포넌트: 좋아요 toggle */
export async function toggleLike(
  postId: string,
  userId: string,
  hasLiked: boolean
): Promise<{ liked: boolean; error: string | null }> {
  const supabase = createClient();

  if (hasLiked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    return { liked: false, error: error ? error.message : null };
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    return { liked: true, error: error ? error.message : null };
  }
}
