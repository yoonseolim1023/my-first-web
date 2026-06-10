import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostOwnerActions } from "@/components/PostOwnerActions";
import { getComments } from "@/lib/comments";
import { getLikeCount, getHasLiked } from "@/lib/likes";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import { posts as legacyPosts } from "@/lib/posts";
import { Calendar, ChevronLeft, User } from "lucide-react";

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

  console.log(`[PostDetail] Fetching ID: ${id}, hasData: ${!!data}, hasError: ${!!error}`);
  
  if (error) {
    console.error(`[PostDetail] Supabase error for ID ${id}:`, error);
    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">오류가 발생했습니다</h1>
          <p className="text-muted-foreground">게시글을 불러오는 도중 문제가 발생했습니다.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
      </section>
    );
  }

  if (!data) {
    const legacyPost = legacyPosts.find(
      (post) => String(post.id) === id || String(post.id) === String(Number(id))
    );

    if (legacyPost) {
      return (
        <article className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="space-y-6 text-center">
            <Link href="/posts" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <ChevronLeft className="h-4 w-4" /> 목록으로
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{legacyPost.title}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1"><User className="h-4 w-4" /> {legacyPost.author}</div>
              <span>•</span>
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {legacyPost.date}</div>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{legacyPost.content}</p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm text-primary font-medium">
             💡 현재 이 글은 이전 버전 데이터로 표시되고 있습니다.
          </div>
        </article>
      );
    }

    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="text-7xl">🔍</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">게시글을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">이미 삭제되었거나 주소가 유효하지 않을 수 있습니다.</p>
        </div>
        <Link
          href="/posts"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          목록으로 돌아가기
        </Link>
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

  const [comments, likeCount, hasLiked] = await Promise.all([
    getComments(id),
    getLikeCount(id),
    getHasLiked(id, currentUserId),
  ]);

  const formattedDate = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/posts" className="group inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 목록으로
          </Link>
          <PostOwnerActions
            canManagePost={canManagePost}
            postId={post.id}
            postUserId={post.user_id}
            initialTitle={post.title}
            initialContent={post.content}
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight lg:leading-[4.5rem]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full"><User className="h-4 w-4" /> {authorName}</div>
            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formattedDate}</div>
          </div>
        </div>
      </header>

      {post.image_url && (
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap selection:bg-primary/30">
          {post.content}
        </p>
      </div>

      <div className="flex flex-col gap-10 pt-10">
        <div className="flex items-center justify-center py-6 border-y border-border/40">
          <LikeButton
            postId={post.id}
            initialCount={likeCount}
            initialLiked={hasLiked}
            currentUserId={currentUserId}
          />
        </div>

        <CommentSection
          postId={post.id}
          initialComments={comments}
          currentUserId={currentUserId}
        />
      </div>
    </article>
  );
}

// Minimal Button component to fix build if it fails
function Button({ variant, asChild, children, className }: any) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
