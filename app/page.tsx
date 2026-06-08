import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type RecentPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("[HomePage] recent posts error:", error);
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">내 블로그</h1>
          <p className="text-sm text-muted-foreground">
            웹 개발을 배우며 기록하는 공간입니다.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            최근 글을 불러오지 못했어요. 잠시 후 다시 확인해 주세요.
          </p>
          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/posts">글 목록 보기</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const posts = (data ?? []) as RecentPost[];

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">내 블로그</h1>
        <p className="text-sm text-muted-foreground">
          웹 개발을 배우며 기록하는 공간입니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/posts">게시글 보기</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/posts/new">새 글 작성</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-base font-medium text-foreground">아직 글이 없어요</p>
          <p className="mt-2 text-sm text-muted-foreground">
            첫 번째 게시글을 작성해 보세요.
          </p>
          <div className="mt-4 flex justify-center">
            <Button asChild size="sm">
              <Link href="/posts/new">글 쓰기</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="h-full rounded-lg shadow-sm transition hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.content}
                  </p>
                  <p className="text-xs text-muted-foreground">{post.created_at}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
