import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
};

type DisplayPost = PostRow & {
  author: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

type PostsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { q } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let postsQuery = supabase
    .from("posts")
    .select("id, title, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (q && q.trim()) {
    postsQuery = postsQuery.or(
      `title.ilike.%${q.trim()}%,content.ilike.%${q.trim()}%`
    );
  }

  const [{ data: postsData, error: postsError }, { data: profilesData, error: profilesError }] =
    await Promise.all([
      postsQuery,
      supabase.from("profiles").select("id, username"),
    ]);

  if (postsError) {
    console.error("[PostsPage] fetchPosts error:", postsError);
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">블로그</h1>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-destructive">목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/posts">다시 시도</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (profilesError) {
    console.error("[PostsPage] fetchProfiles error:", profilesError);
  }

  const profiles = new Map<string, string>();
  for (const profile of (profilesData ?? []) as ProfileRow[]) {
    profiles.set(profile.id, profile.username ?? "익명");
  }

  const posts = ((postsData ?? []) as PostRow[]).map<DisplayPost>((post) => ({
    ...post,
    author: profiles.get(post.user_id) ?? "익명",
  }));

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">블로그</h1>

      {/* 검색바 */}
      <Suspense>
        <SearchBar />
      </Suspense>

      {q && q.trim() && (
        <p className="text-sm text-muted-foreground">
          &ldquo;<strong>{q.trim()}</strong>&rdquo; 검색 결과 ({posts.length}건)
        </p>
      )}

      {posts.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-5xl">📭</div>
          <p className="text-base font-medium text-foreground">
            {q ? "검색 결과가 없어요" : "아직 게시글이 없어요"}
          </p>
          <p className="text-sm text-muted-foreground">
            {q ? "다른 검색어로 시도해 보세요." : "첫 번째 글을 작성해 보세요!"}
          </p>
          {!q && (
            <Button asChild size="sm">
              <Link href="/posts/new">글 쓰기</Link>
            </Button>
          )}
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="h-full rounded-lg shadow-sm transition hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.content}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {post.author} · {formatDate(post.created_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
