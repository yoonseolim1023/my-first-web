import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostOwnerActions } from "@/components/PostOwnerActions";
import { getComments } from "@/lib/comments";
import { getLikeCount, getHasLiked } from "@/lib/likes";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";

export const dynamic = "force-dynamic";

type PostDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[PostDetailPage] Supabase error:", error);
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">게시글 상세</h1>
        <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm space-y-3">
          <p className="text-base font-medium text-foreground">게시글을 불러오지 못했어요</p>
          <p className="text-sm text-muted-foreground">
            잠시 후 다시 시도하거나 목록으로 돌아가 주세요.
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            목록으로
          </Link>
        </div>
      </section>
    );
  }
  if (!data) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">게시글 상세</h1>
        <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm space-y-3">
          <p className="text-base font-medium text-foreground">게시글을 찾을 수 없습니다</p>
          <p className="text-sm text-muted-foreground">
            삭제되었거나 주소가 잘못되었을 수 있습니다.
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            목록으로
          </Link>
        </div>
      </section>
    );
  }

  const post = data;
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData.user?.id;
  const canManagePost = currentUserId === post.user_id;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", post.user_id)
    .maybeSingle();

  const authorName = profileError ? "익명" : profileData?.username ?? "익명";

  // 댓글·좋아요 병렬 조회
  const [comments, likeCount, hasLiked] = await Promise.all([
    getComments(id),
    getLikeCount(id),
    getHasLiked(id, currentUserId),
  ]);

  const formattedDate = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {authorName} · {formattedDate}
        </p>
        <PostOwnerActions
          canManagePost={canManagePost}
          postId={post.id}
          postUserId={post.user_id}
          initialTitle={post.title}
          initialContent={post.content}
        />
      </header>

      {/* 이미지 */}
      {post.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image_url}
          alt="게시글 이미지"
          className="w-full max-h-[480px] rounded-lg object-cover border border-border"
        />
      )}

      <p className="leading-7 text-foreground whitespace-pre-wrap">{post.content}</p>

      {/* 좋아요 버튼 */}
      <div className="flex items-center gap-3">
        <LikeButton
          postId={post.id}
          initialCount={likeCount}
          initialLiked={hasLiked}
          currentUserId={currentUserId}
        />
      </div>

      {/* 댓글 */}
      <CommentSection
        postId={post.id}
        initialComments={comments}
        currentUserId={currentUserId}
      />

      <Link
        href="/posts"
        className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
      >
        목록으로 돌아가기
      </Link>
    </article>
  );
}
