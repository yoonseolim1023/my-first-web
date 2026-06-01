"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("posts")
      .select("id, title, content, created_at, user_id")
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("[PostsPage] fetchPosts error:", queryError);
      setError("목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } else {
      setPosts(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (active) await fetchPosts();
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchPosts]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">블로그</h1>

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse">불러오는 중...</p>
      )}
      {error && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={fetchPosts} variant="outline" size="sm">
            다시 시도
          </Button>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-5xl">📭</div>
          <p className="text-base font-medium text-foreground">아직 게시글이 없어요</p>
          <p className="text-sm text-muted-foreground">첫 번째 글을 작성해 보세요!</p>
          <Button asChild size="sm">
            <Link href="/posts/new">글 쓰기</Link>
          </Button>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
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
                    {post.created_at}
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
