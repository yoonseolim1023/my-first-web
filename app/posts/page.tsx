import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import SearchBar from "@/components/SearchBar";
import { Calendar, User } from "lucide-react";

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
    month: "long",
    day: "numeric",
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
      <section className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-border/60 bg-muted/5 p-12 text-center">
        <h1 className="text-2xl font-bold">블로그</h1>
        <p className="text-muted-foreground text-sm">목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/posts">다시 시도</Link>
        </Button>
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
    <section className="space-y-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">전체 게시글</h1>
            <p className="text-muted-foreground">생각을 나누고 영감을 공유하는 공간입니다.</p>
          </div>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/posts/new">새 글 쓰기</Link>
          </Button>
        </div>

        <div className="rounded-2xl bg-muted/40 p-4 sm:p-6 lg:p-8">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {q && q.trim() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          &ldquo;<strong>{q.trim()}</strong>&rdquo; 검색 결과 ({posts.length}건)
        </div>
      )}

      {posts.length === 0 && (
        <div className="flex flex-col items-center gap-6 py-20 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-4xl">📭</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{q ? "검색 결과가 없어요" : "아직 게시글이 없어요"}</h3>
            <p className="text-muted-foreground max-w-sm">
              {q ? "다른 키워드로 검색하거나 전체 목록으로 돌아가보세요." : "당신의 첫 번째 멋진 생각을 적어보세요!"}
            </p>
          </div>
          {!q && (
            <Button asChild size="lg" className="rounded-xl shadow-xl shadow-primary/20">
              <Link href="/posts/new">첫 글 작성하기</Link>
            </Button>
          )}
          {q && (
            <Button variant="outline" asChild>
              <Link href="/posts">전체 목록으로</Link>
            </Button>
          )}
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${encodeURIComponent(post.id)}`} className="card-hover">
              <Card className="h-full border-border/50 bg-card shadow-sm transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-xl font-bold tracking-tight group-hover:text-primary">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
