import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostOwnerActions } from "@/components/PostOwnerActions";

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
    .select("id, title, content, created_at, user_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[PostDetailPage] Supabase error:", error);
    notFound();
  }
  if (!data) {
    notFound();
  }

  const post = data;
  const { data: authData } = await supabase.auth.getUser();
  const canManagePost = authData.user?.id === post.user_id;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", post.user_id)
    .maybeSingle();

  const authorName = profileError ? "익명" : profileData?.username ?? "익명";

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {authorName} · {post.created_at}
        </p>
        <PostOwnerActions
          canManagePost={canManagePost}
          postId={post.id}
          postUserId={post.user_id}
          initialTitle={post.title}
          initialContent={post.content}
        />
      </header>

      <p className="leading-7 text-foreground">{post.content}</p>

      <Link
        href="/posts"
        className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
      >
        목록으로 돌아가기
      </Link>
    </article>
  );
}
